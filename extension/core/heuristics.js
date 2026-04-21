/**
 * synthux — Nielsen 10 Heuristic Engine
 * 
 * Loads heuristic rules from JSON and builds AI evaluation prompts.
 * Parses AI responses and calculates weighted scores.
 */

import { getProfile } from './profiles.js';

/**
 * Load the default Nielsen 10 heuristic rules
 */
export async function loadHeuristics(rulePath = '../rules/nielsen-10.json') {
  try {
    const response = await fetch(chrome.runtime.getURL('rules/nielsen-10.json'));
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('[synthux] Failed to load heuristics:', err);
    return getDefaultHeuristics();
  }
}

/**
 * Select heuristics based on analysis mode
 * Quick mode: top 3 heuristics by priority
 * Deep mode: all 10 heuristics
 */
export function selectHeuristics(rules, mode = 'deep', profileId = null) {
  const allRules = rules.rules || [];

  if (mode === 'quick') {
    // For quick mode, select highest-priority heuristics for the profile
    const profile = getProfile(profileId);
    if (profile?.priorityHeuristics) {
      return allRules.filter(r => profile.priorityHeuristics.includes(r.id));
    }
    // Default quick selection
    return allRules.slice(0, 3);
  }

  return allRules;
}

/**
 * Build an evaluation prompt for a single heuristic + profile combination
 * Strict JSON-only output instructions to prevent comment leakage
 */
export function buildPrompt(heuristic, profile, pageData) {
  const pageSummary = summarizePageData(pageData);

  const prompt = `You are a UX evaluation expert. Evaluate the following web page against the heuristic "${heuristic.name.en}".

## Heuristic Definition
${heuristic.description.en}

## Evaluation Criteria
${heuristic.evaluation_guide || 'Evaluate based on the heuristic definition and common UX best practices.'}

## Scoring Rubric
${Object.entries(heuristic.scoring_rubric).map(([range, desc]) => `- ${range}: ${desc}`).join('\n')}

## Page Data
${pageSummary}

## Your Perspective
${profile.systemPrompt}

## STRICT Response Rules
1. Respond with ONLY a valid JSON object. No markdown, no code fences, no comments.
2. Do NOT use JavaScript comments (// or /* */) anywhere in the response.
3. Every field must have a meaningful, non-empty value. Do not leave any field blank.
4. Each issue must have a clear description, the affected element, and a specific recommendation.
5. Score must be a number between 0 and 100.

## Required JSON Structure
{
  "score": 72,
  "summary": "The page provides good visual feedback but lacks loading states for dynamic content.",
  "issues": [
    {
      "severity": "critical",
      "description": "Form inputs in the search section have no associated label elements",
      "element": "input.search-field",
      "recommendation": "Add a visible label element or aria-label attribute to each form input"
    }
  ],
  "positives": ["Clear navigation structure", "Good use of breadcrumbs"],
  "score_justification": "Score reflects strong navigation but weak form accessibility"
}`;

  return prompt;
}

/**
 * Parse and validate AI evaluation response
 * Includes multi-pass JSON repair for common LLM output errors
 */
export function parseEvaluation(response) {
  try {
    let data;
    const rawText = typeof response === 'string' 
      ? response 
      : (response?.raw || JSON.stringify(response));

    // Try progressive parse strategies
    data = tryParseJSON(rawText);

    if (!data || typeof data !== 'object') {
      throw new Error('Could not extract valid JSON');
    }

    // Validate and normalize — filter out invalid/empty issues
    const validIssues = (data.issues || [])
      .map(issue => ({
        severity: ['critical', 'moderate', 'minor'].includes(issue.severity) 
          ? issue.severity : 'moderate',
        description: String(issue.description || '').trim(),
        element: String(issue.element || '').trim(),
        recommendation: String(issue.recommendation || '').trim()
      }))
      .filter(issue => {
        if (!issue.description || issue.description.length < 5) return false;
        if (isPlaceholder(issue.description)) return false;
        if (isPlaceholder(issue.recommendation)) return false;
        const filledFields = [issue.description, issue.element, issue.recommendation]
          .filter(f => f && f.length > 3 && !isPlaceholder(f)).length;
        return filledFields >= 2;
      });

    // Filter positives
    const validPositives = (data.positives || [])
      .map(p => String(p).trim())
      .filter(p => p.length > 3 && !isPlaceholder(p));

    return {
      score: Math.max(0, Math.min(100, parseInt(data.score) || 50)),
      summary: isPlaceholder(data.summary) ? 'Evaluation completed' : String(data.summary || 'Evaluation completed').trim(),
      issues: validIssues,
      positives: validPositives,
      scoreJustification: String(data.score_justification || '').trim()
    };
  } catch (err) {
    console.error('[synthux] Failed to parse evaluation:', err);
    return {
      score: 50,
      summary: 'Unable to parse AI evaluation response',
      issues: [],
      positives: [],
      scoreJustification: 'Default score due to parse error'
    };
  }
}

/**
 * Calculate weighted overall score from individual heuristic evaluations
 */
export function calculateOverallScore(evaluations, rules) {
  if (!evaluations || evaluations.length === 0) return 0;

  const allRules = rules.rules || [];
  let totalWeight = 0;
  let weightedSum = 0;

  evaluations.forEach(evaluation => {
    const rule = allRules.find(r => r.id === evaluation.heuristicId);
    const weight = rule?.weight || 1.0;
    weightedSum += evaluation.score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

// ─── Sanitization Helpers ────────────────────────────────────────────────────

/**
 * Remove JavaScript-style comments from LLM output before JSON parse
 */
function sanitizeLLMOutput(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Remove single-line comments
  cleaned = cleaned.replace(/,\s*\/\/[^\n]*/g, ',');
  cleaned = cleaned.replace(/{\s*\/\/[^\n]*/g, '{');
  cleaned = cleaned.replace(/^\s*\/\/[^\n]*/gm, '');

  // Remove multi-line comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove trailing commas before closing brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  // Remove markdown code fences
  cleaned = cleaned.replace(/```json\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/g, '');

  return cleaned.trim();
}

/**
 * Try multiple strategies to parse JSON from LLM output
 */
function tryParseJSON(text) {
  if (!text || typeof text !== 'string') {
    if (typeof text === 'object' && text !== null) return text;
    return null;
  }

  // Strategy 1: Direct parse
  try { return JSON.parse(text); } catch {}

  // Strategy 2: Extract JSON block + basic clean
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}

    // Strategy 3: Sanitize comments/trailing commas
    try {
      const cleaned = sanitizeLLMOutput(jsonMatch[0]);
      return JSON.parse(cleaned);
    } catch {}

    // Strategy 4: Aggressive repair
    try {
      const repaired = repairJSON(sanitizeLLMOutput(jsonMatch[0]));
      return JSON.parse(repaired);
    } catch {}
  }

  // Strategy 5: Extract score at minimum
  const scoreMatch = text.match(/"score"\s*:\s*(\d+)/);
  const summaryMatch = text.match(/"summary"\s*:\s*"([^"]+)"/);
  if (scoreMatch) {
    return {
      score: parseInt(scoreMatch[1]),
      summary: summaryMatch ? summaryMatch[1] : 'Partial parse',
      issues: [],
      positives: [],
      score_justification: 'Extracted from malformed response'
    };
  }

  return null;
}

/**
 * Aggressively repair common LLM JSON errors
 */
function repairJSON(text) {
  let json = text;

  // Fix missing commas between array elements: }{  or }\n{ or ""  patterns
  json = json.replace(/}\s*{/g, '},{');
  json = json.replace(/"\s*"/g, (match, offset) => {
    // Only fix if inside an array context (look back for [ or ,)
    const before = json.substring(Math.max(0, offset - 20), offset);
    if (/[\[,]\s*"[^"]*$/.test(before)) return '","';
    return match;
  });

  // Fix missing commas between array elements: "value1" "value2"
  json = json.replace(/("[^"]*")\s+("[^"]*")/g, '$1,$2');

  // Remove trailing commas (re-apply after repairs)
  json = json.replace(/,\s*([\]}])/g, '$1');

  // Auto-close truncated JSON
  const opens = (json.match(/{/g) || []).length;
  const closes = (json.match(/}/g) || []).length;
  const arrOpens = (json.match(/\[/g) || []).length;
  const arrCloses = (json.match(/\]/g) || []).length;

  // Close unclosed arrays first, then objects
  for (let i = 0; i < arrOpens - arrCloses; i++) json += ']';
  for (let i = 0; i < opens - closes; i++) json += '}';

  // Ensure the string ends properly — close any dangling string
  const quoteCount = (json.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    // Find last unclosed quote and close it
    json += '"';
  }

  return json;
}

/**
 * Check if a string looks like a placeholder or empty value
 */
function isPlaceholder(str) {
  if (!str || typeof str !== 'string') return true;
  const s = str.trim().toLowerCase();
  if (s.length < 3) return true;
  
  const placeholders = [
    'no description', 'no recommendation', 'no summary',
    'n/a', 'none', 'unknown', 'not available', 'not applicable',
    'no issues', 'no information', 'description', 'recommendation',
    'tbd', 'todo', 'placeholder'
  ];
  
  return placeholders.includes(s);
}

// ─── Data Helpers ────────────────────────────────────────────────────────────

function summarizePageData(pageData) {
  const parts = [];

  // Meta
  if (pageData.meta) {
    parts.push(`**Page Title:** ${pageData.meta.title || 'None'}`);
    parts.push(`**Language:** ${pageData.meta.lang || 'Not set'}`);
    parts.push(`**Description:** ${pageData.meta.description || 'None'}`);
  }

  // Structure
  if (pageData.structure) {
    const { headings, landmarks, forms } = pageData.structure;
    parts.push(`\n**Headings:** ${headings?.length || 0} total`);
    if (headings?.length > 0) {
      const h1Count = headings.filter(h => h.level === 1).length;
      parts.push(`  - H1 count: ${h1Count}`);
      const headingOrder = headings.map(h => `H${h.level}`).join(' → ');
      parts.push(`  - Order: ${headingOrder}`);
    }
    parts.push(`**Landmarks:** ${landmarks?.length || 0} (${landmarks?.map(l => l.role).join(', ') || 'none'})`);
    parts.push(`**Forms:** ${forms?.length || 0}`);
    if (forms?.length > 0) {
      forms.forEach((f, i) => {
        parts.push(`  Form ${i + 1}: ${f.fields?.length || 0} fields, submit button: ${f.hasSubmitButton ? 'yes' : 'no'}`);
        const unlabeled = f.fields?.filter(field => !field.label).length || 0;
        if (unlabeled > 0) parts.push(`    ${unlabeled} fields without labels`);
      });
    }
  }

  // Navigation
  if (pageData.navigation) {
    parts.push(`\n**Navigation:**`);
    parts.push(`  - Nav elements: ${pageData.navigation.navCount || 0}`);
    parts.push(`  - Menu depth: ${pageData.navigation.mainMenu?.depth || 0}`);
    parts.push(`  - Breadcrumbs: ${pageData.navigation.breadcrumb ? 'yes' : 'no'}`);
    parts.push(`  - Skip links: ${pageData.navigation.skipLinks ? 'yes' : 'no'}`);
    parts.push(`  - Search: ${pageData.navigation.hasSearch ? 'yes' : 'no'}`);
  }

  // Content
  if (pageData.content) {
    parts.push(`\n**Content:**`);
    parts.push(`  - Text length: ${pageData.content.textLength || 0} chars, ${pageData.content.wordCount || 0} words`);
    parts.push(`  - Images: ${pageData.content.imageCount || 0} total, ${pageData.content.imagesWithoutAlt || 0} without alt text`);
    parts.push(`  - CTAs: ${pageData.content.ctas?.length || 0}`);
    parts.push(`  - Links: ${pageData.content.internalLinks || 0} internal, ${pageData.content.externalLinks || 0} external`);
  }

  // Accessibility
  if (pageData.accessibility) {
    parts.push(`\n**Accessibility:**`);
    parts.push(`  - ARIA roles used: ${pageData.accessibility.ariaRoles?.join(', ') || 'none'}`);
    parts.push(`  - Tab order issues: ${pageData.accessibility.tabOrderIssues?.length || 0}`);
    parts.push(`  - Lang attribute: ${pageData.accessibility.hasLangAttr ? 'yes' : 'no'}`);
    parts.push(`  - Unlabeled interactive elements: ${pageData.accessibility.unlabeledInteractives?.length || 0}`);

    const contrastResults = pageData.accessibility.contrastResults || [];
    const failing = contrastResults.filter(c => !c.passes).length;
    parts.push(`  - Color contrast: ${contrastResults.length} sampled, ${failing} failing`);
    parts.push(`  - Focus indicators: ${pageData.accessibility.focusIndicators?.note || 'unknown'}`);
  }

  // Performance
  if (pageData.performance) {
    parts.push(`\n**Performance:**`);
    parts.push(`  - DOM elements: ${pageData.performance.domSize || 0}`);
    parts.push(`  - Scripts: ${pageData.performance.scriptCount || 0}`);
    parts.push(`  - Stylesheets: ${pageData.performance.styleSheetCount || 0}`);
    parts.push(`  - Loading indicators: ${pageData.performance.loadingState?.hasLoadingIndicators ? 'present' : 'none detected'}`);
  }

  return parts.join('\n');
}

/**
 * Fallback heuristic definitions if JSON file can't be loaded
 */
function getDefaultHeuristics() {
  return {
    name: "Nielsen's 10 Usability Heuristics",
    version: '1.0.0',
    source: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    rules: [
      { id: 'visibility-of-system-status', name: { en: 'Visibility of System Status', tr: 'Sistem Durumu Görünürlüğü' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical violations', '21-40': 'Major issues', '41-60': 'Some feedback present', '61-80': 'Good feedback', '81-100': 'Excellent' } },
      { id: 'match-real-world', name: { en: 'Match Between System and Real World', tr: 'Sistem-Gerçek Dünya Eşleşmesi' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'user-control-freedom', name: { en: 'User Control and Freedom', tr: 'Kullanıcı Kontrolü ve Özgürlük' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'consistency-standards', name: { en: 'Consistency and Standards', tr: 'Tutarlılık ve Standartlar' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'error-prevention', name: { en: 'Error Prevention', tr: 'Hata Önleme' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'recognition-over-recall', name: { en: 'Recognition Rather Than Recall', tr: 'Tanıma > Hatırlama' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'flexibility-efficiency', name: { en: 'Flexibility and Efficiency of Use', tr: 'Esneklik ve Verimlilik' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'aesthetic-minimalist', name: { en: 'Aesthetic and Minimalist Design', tr: 'Estetik ve Minimalist Tasarım' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'error-recovery', name: { en: 'Help Users Recognize, Diagnose, and Recover from Errors', tr: 'Hata Tanıma ve Kurtarma' }, weight: 1.0, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } },
      { id: 'help-documentation', name: { en: 'Help and Documentation', tr: 'Yardım ve Dokümantasyon' }, weight: 0.8, scoring_rubric: { '0-20': 'Critical', '21-40': 'Major', '41-60': 'Moderate', '61-80': 'Good', '81-100': 'Excellent' } }
    ]
  };
}
