/**
 * synthux — Nielsen 10 Heuristic Engine
 * 
 * Loads heuristic rules from JSON and builds AI evaluation prompts.
 * Parses AI responses and calculates weighted scores.
 */

import { getProfile } from './profiles.js';

export const MAX_CUSTOM_RULE_PACKS = 10;

export const BUILT_IN_RULE_PACKS = [
  {
    id: 'nielsen-10',
    name: "Nielsen's 10 Usability Heuristics",
    shortName: 'Nielsen 10',
    category: 'General UX',
    description: 'Industry-standard general usability framework by Jakob Nielsen.',
    file: 'rules/nielsen-10.json',
    ruleCount: 10,
    isBuiltIn: true
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Conversion UX',
    shortName: 'E-Commerce',
    category: 'E-Commerce & Retail',
    description: 'Specialized UX rules for online stores, product pages, carts, and checkout flows.',
    file: 'rules/ecommerce.json',
    ruleCount: 8,
    isBuiltIn: true
  },
  {
    id: 'saas',
    name: 'SaaS & Web Application UX',
    shortName: 'SaaS',
    category: 'SaaS & Dashboards',
    description: 'Specialized UX rules for SaaS apps, dashboards, onboarding, and self-service workflows.',
    file: 'rules/saas.json',
    ruleCount: 8,
    isBuiltIn: true
  },
  {
    id: 'fintech',
    name: 'Fintech, Banking & Web3 UX',
    shortName: 'Fintech',
    category: 'Finance & Banking',
    description: 'High-trust financial UX rules covering transaction safety, fee transparency, and numerical legibility.',
    file: 'rules/fintech.json',
    ruleCount: 8,
    isBuiltIn: true
  }
];

const DEFAULT_SCORING_RUBRIC = {
  '0-20': 'Critical violations — severe usability barriers',
  '21-40': 'Major issues — frequent user friction and confusion',
  '41-60': 'Moderate — functional but with notable UX gaps',
  '61-80': 'Good — solid implementation with minor issues',
  '81-100': 'Excellent — best-in-class user experience'
};

/**
 * Validate and normalize a custom/community JSON rule pack
 */
export function validateAndNormalizeRulePack(rawInput) {
  let parsed = rawInput;
  if (typeof rawInput === 'string') {
    try {
      parsed = JSON.parse(rawInput);
    } catch (e) {
      throw new Error('Invalid JSON syntax in rule pack.');
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Rule pack must be a JSON object.');
  }

  const packName = String(parsed.name || parsed.shortName || '').trim();
  if (!packName) {
    throw new Error('Rule pack must include a "name" field.');
  }

  if (!Array.isArray(parsed.rules) || parsed.rules.length === 0) {
    throw new Error('Rule pack must contain a non-empty "rules" array.');
  }

  if (parsed.rules.length > 25) {
    throw new Error('Rule pack can contain at most 25 rules.');
  }

  const slug = String(parsed.id || packName)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || `custom-pack-${Date.now()}`;

  const builtInIds = new Set(BUILT_IN_RULE_PACKS.map(p => p.id));
  const id = builtInIds.has(slug) ? `custom-${slug}` : slug;

  const normalizedRules = parsed.rules.map((r, idx) => {
    const ruleNameEn = typeof r.name === 'object' && r.name !== null
      ? String(r.name.en || r.name.tr || `Rule ${idx + 1}`).trim()
      : String(r.name || `Rule ${idx + 1}`).trim();
    const ruleNameTr = typeof r.name === 'object' && r.name !== null
      ? String(r.name.tr || ruleNameEn).trim()
      : ruleNameEn;

    const descEn = typeof r.description === 'object' && r.description !== null
      ? String(r.description.en || r.description.tr || ruleNameEn).trim()
      : String(r.description || ruleNameEn).trim();
    const descTr = typeof r.description === 'object' && r.description !== null
      ? String(r.description.tr || descEn).trim()
      : descEn;

    const ruleId = String(r.id || `${id}-rule-${idx + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-');

    const weight = Number.isFinite(Number(r.weight))
      ? Math.max(0.1, Math.min(3.0, Number(r.weight)))
      : 1.0;

    return {
      id: ruleId,
      name: { en: ruleNameEn, tr: ruleNameTr },
      description: { en: descEn, tr: descTr },
      weight,
      automated_checks: Array.isArray(r.automated_checks) ? r.automated_checks : [],
      evaluation_guide: String(r.evaluation_guide || r.criteria?.join(', ') || descEn).trim(),
      prompt_template: String(r.prompt_template || `Evaluate this web page for '${ruleNameEn}'.`).trim(),
      scoring_rubric: (r.scoring_rubric && typeof r.scoring_rubric === 'object')
        ? r.scoring_rubric
        : DEFAULT_SCORING_RUBRIC
    };
  });

  return {
    id,
    name: packName,
    shortName: String(parsed.shortName || packName.slice(0, 22)).trim(),
    category: String(parsed.category || 'Custom Pack').trim(),
    description: String(parsed.description || `Custom UX rule pack (${normalizedRules.length} rules)`).trim(),
    version: String(parsed.version || '1.0.0').trim(),
    source: String(parsed.source || 'custom').trim(),
    ruleCount: normalizedRules.length,
    isCustom: true,
    rules: normalizedRules
  };
}

/**
 * Get custom rule packs from chrome.storage.local
 */
export async function getCustomRulePacks() {
  try {
    const data = await chrome.storage.local.get('customRulePacks');
    return Array.isArray(data.customRulePacks) ? data.customRulePacks : [];
  } catch {
    return [];
  }
}

/**
 * Get all available rule packs (built-in + custom)
 */
export async function getAllRulePacks() {
  const custom = await getCustomRulePacks();
  return [...BUILT_IN_RULE_PACKS, ...custom];
}

/**
 * Save or update a custom rule pack in chrome.storage.local
 */
export async function saveCustomRulePack(rawPack) {
  const normalized = validateAndNormalizeRulePack(rawPack);
  const existing = await getCustomRulePacks();
  const idx = existing.findIndex(p => p.id === normalized.id);

  if (idx >= 0) {
    existing[idx] = normalized;
  } else {
    if (existing.length >= MAX_CUSTOM_RULE_PACKS) {
      throw new Error(`Maximum of ${MAX_CUSTOM_RULE_PACKS} custom rule packs reached.`);
    }
    existing.push(normalized);
  }

  await chrome.storage.local.set({ customRulePacks: existing });
  return normalized;
}

/**
 * Delete a custom rule pack from chrome.storage.local
 */
export async function deleteCustomRulePack(packId) {
  const existing = await getCustomRulePacks();
  const filtered = existing.filter(p => p.id !== packId);
  await chrome.storage.local.set({ customRulePacks: filtered });
  return filtered;
}

/**
 * Load heuristic rules by rulePackId (built-in or custom)
 */
export async function loadHeuristics(rulePackId = 'nielsen-10') {
  try {
    const builtIn = BUILT_IN_RULE_PACKS.find(p => p.id === rulePackId);
    if (builtIn) {
      const response = await fetch(chrome.runtime.getURL(builtIn.file));
      const data = await response.json();
      return {
        ...data,
        id: data.id || builtIn.id,
        shortName: data.shortName || builtIn.shortName,
        category: data.category || builtIn.category
      };
    }

    // Check custom rule packs in storage
    const customPacks = await getCustomRulePacks();
    const customMatch = customPacks.find(p => p.id === rulePackId);
    if (customMatch && Array.isArray(customMatch.rules) && customMatch.rules.length > 0) {
      return customMatch;
    }

    // Fallback to default Nielsen 10
    const response = await fetch(chrome.runtime.getURL('rules/nielsen-10.json'));
    return await response.json();
  } catch (err) {
    console.error('[synthux] Failed to load heuristics:', err);
    return getDefaultHeuristics();
  }
}

/**
 * Select heuristics based on analysis mode
 * Quick mode: top 3 heuristics by priority or weight
 * Deep mode: all heuristics in the pack
 */
export function selectHeuristics(rules, mode = 'deep', profileId = null) {
  const allRules = rules.rules || [];

  if (mode === 'quick') {
    // Check if the profile specifies priority heuristics matching this rule pack
    const profile = getProfile(profileId);
    if (profile?.priorityHeuristics) {
      const matched = allRules.filter(r => profile.priorityHeuristics.includes(r.id));
      if (matched.length >= 3) {
        return matched.slice(0, 3);
      }
    }
    // Sort by weight descending and take top 3
    return [...allRules]
      .sort((a, b) => (b.weight || 1.0) - (a.weight || 1.0))
      .slice(0, 3);
  }

  return allRules;
}

/**
 * Build an evaluation prompt for a single heuristic + profile combination
 * Strict JSON-only output instructions to prevent comment leakage
 */
export function buildPrompt(heuristic, profile, pageData, hasVision = false) {
  const pageSummary = summarizePageData(pageData);

  const visionBlock = hasVision ? `
## Visual Analysis (Screenshot Attached)
A screenshot of the page is attached. Analyze BOTH the structural DOM data AND the visual screenshot together.
Pay special attention to:
- Visual hierarchy: Are headings, CTAs, and key content visually prominent?
- Color harmony: Do colors work well together? Is contrast sufficient?
- Layout & spacing: Is whitespace balanced? Are elements aligned properly?
- CTA visibility: Are call-to-action buttons visually discoverable?
- Typography: Is text readable? Are font sizes appropriate?
- Visual clutter: Is the page too busy or well-organized?
- Responsive feel: Does the layout look intentional and well-structured?
Include visual observations in your issue descriptions when relevant (e.g., "The CTA button blends into the background").
` : '';

  const heuristicName = typeof heuristic.name === 'object' ? (heuristic.name.en || heuristic.name.tr) : String(heuristic.name || '');
  const heuristicDesc = typeof heuristic.description === 'object' ? (heuristic.description.en || heuristic.description.tr) : String(heuristic.description || '');
  const rubric = heuristic.scoring_rubric || DEFAULT_SCORING_RUBRIC;

  const prompt = `You are a UX evaluation expert. Evaluate the following web page against the heuristic "${heuristicName}".

## Heuristic Definition
${heuristicDesc}

## Evaluation Criteria
${heuristic.evaluation_guide || 'Evaluate based on the heuristic definition and common UX best practices.'}

## Scoring Rubric
${Object.entries(rubric).map(([range, desc]) => `- ${range}: ${desc}`).join('\n')}

## Page Data
${pageSummary}
${visionBlock}
## Your Perspective
${profile.systemPrompt}

## STRICT Response Rules
1. Respond with ONLY a valid JSON object. No markdown, no code fences, no comments.
2. Do NOT use JavaScript comments (// or /* */) anywhere in the response.
3. Every field must have a meaningful, non-empty value. Do not leave any field blank.
4. Each issue must have a clear description, the affected element, and a specific recommendation.
5. Score must be a number between 0 and 100.
6. For each issue, provide a concrete code fix showing the before/after code change. Use CSS, HTML, or JavaScript as appropriate.
7. For each issue, rate the priority (impact on users: high/medium/low) and fix_effort (how hard it is to fix: easy/moderate/hard).
8. For each issue, the "element" field MUST be a valid CSS selector that uniquely identifies the problematic element on the page (e.g. "nav.main-menu > ul > li:nth-child(2)", "input#email", ".hero-section .cta-button"). This is critical for page highlighting.${hasVision ? '\n9. When the screenshot reveals visual issues not apparent from DOM data alone, include them as findings.' : ''}

## Required JSON Structure
{
  "score": 72,
  "summary": "The page provides good visual feedback but lacks loading states for dynamic content.",
  "issues": [
    {
      "severity": "critical",
      "priority": "high",
      "fix_effort": "easy",
      "description": "Form inputs in the search section have no associated label elements",
      "element": "input.search-field",
      "recommendation": "Add a visible label element or aria-label attribute to each form input",
      "code_fix": {
        "language": "html",
        "before": "<input type=\\"text\\" class=\\"search-field\\" placeholder=\\"Search...\\">",
        "after": "<label for=\\"search\\">Search</label>\\n<input type=\\"text\\" id=\\"search\\" class=\\"search-field\\" placeholder=\\"Search...\\">"
      }
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
      .map(issue => {
        const priority = ['high', 'medium', 'low'].includes(issue.priority)
          ? issue.priority : 'medium';
        const fixEffort = ['easy', 'moderate', 'hard'].includes(issue.fix_effort)
          ? issue.fix_effort : 'moderate';
        return {
          severity: ['critical', 'moderate', 'minor'].includes(issue.severity) 
            ? issue.severity : 'moderate',
          priority,
          fixEffort,
          isQuickWin: priority === 'high' && fixEffort === 'easy',
          description: String(issue.description || '').trim(),
          element: String(issue.element || '').trim(),
          recommendation: String(issue.recommendation || '').trim(),
          codeFix: parseCodeFix(issue.code_fix)
        };
      })
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
 * Remove reasoning <think> blocks and JavaScript-style comments from LLM output before JSON parse
 */
function sanitizeLLMOutput(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // Strip reasoning blocks (<think>...</think> or unclosed <think> before JSON)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  cleaned = cleaned.replace(/^[\s\S]*?<\/think>/gi, '');

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

  // Pre-strip reasoning <think> blocks so braces inside thoughts don't hijack regex matching
  const strippedText = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\S]*?<\/think>/gi, '')
    .trim();

  // Strategy 1: Direct parse
  try { return JSON.parse(strippedText); } catch {}

  // Strategy 2: Extract JSON block + basic clean
  const jsonMatch = strippedText.match(/\{[\s\S]*\}/);
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

  // Strategy 5: Extract fields individually from malformed JSON
  const scoreMatch = strippedText.match(/"score"\s*:\s*(\d+)/);
  const summaryMatch = strippedText.match(/"summary"\s*:\s*"([^"]+)"/);
  const justificationMatch = strippedText.match(/"score_justification"\s*:\s*"([^"]+)"/);
  if (scoreMatch) {
    // Try to extract issues array even if full parse failed
    let issues = [];
    const issuesBlockMatch = strippedText.match(/"issues"\s*:\s*\[([\s\S]*?)\]/);
    if (issuesBlockMatch) {
      try {
        const cleaned = sanitizeLLMOutput(`[${issuesBlockMatch[1]}]`);
        issues = JSON.parse(cleaned);
      } catch {
        // Extract individual issue objects
        const issueMatches = issuesBlockMatch[1].match(/\{[^{}]*\}/g);
        if (issueMatches) {
          issues = issueMatches.map(m => {
            try { return JSON.parse(sanitizeLLMOutput(m)); } catch { return null; }
          }).filter(Boolean);
        }
      }
    }

    // Try to extract positives
    let positives = [];
    const positivesMatch = text.match(/"positives"\s*:\s*\[([\s\S]*?)\]/);
    if (positivesMatch) {
      try {
        positives = JSON.parse(`[${positivesMatch[1]}]`);
      } catch {}
    }

    return {
      score: parseInt(scoreMatch[1]),
      summary: summaryMatch ? summaryMatch[1] : 'Evaluation completed (recovered)',
      issues,
      positives,
      score_justification: justificationMatch ? justificationMatch[1] : 'Recovered from malformed response'
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

/**
 * Parse and validate a code_fix object from AI output
 */
function parseCodeFix(codeFix) {
  if (!codeFix || typeof codeFix !== 'object') return null;

  const language = String(codeFix.language || 'css').toLowerCase();
  const before = String(codeFix.before || '').trim();
  const after = String(codeFix.after || '').trim();

  // Need at least the 'after' code to be useful
  if (!after || after.length < 3 || isPlaceholder(after)) return null;

  const validLangs = ['css', 'html', 'javascript', 'js', 'jsx', 'scss'];
  return {
    language: validLangs.includes(language) ? language : 'css',
    before: before || '',
    after
  };
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
