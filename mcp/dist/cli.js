#!/usr/bin/env node

// mcp/server.js
import http from "node:http";
import crypto from "node:crypto";
import readline from "node:readline";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// extension/core/profiles.js
var PROFILES = {
  "first-time": {
    id: "first-time",
    icon: "\u{1F195}",
    name: {
      en: "First-Time Visitor",
      tr: "\u0130lk Kez Gelen Ziyaret\xE7i"
    },
    description: {
      en: "A user who has never visited this website before. They are in exploration mode, unfamiliar with the site's navigation, terminology, and layout.",
      tr: "Bu web sitesini daha \xF6nce hi\xE7 ziyaret etmemi\u015F bir kullan\u0131c\u0131. Ke\u015Fif modunda, sitenin navigasyonu, terminolojisi ve d\xFCzeni hakk\u0131nda bilgi sahibi de\u011Fil."
    },
    systemPrompt: `You are a first-time visitor who has never seen this website before. You are:
- Unfamiliar with the site's navigation, layout, and terminology
- Trying to understand what this site/product does within the first few seconds
- Looking for clear visual hierarchy and obvious entry points
- Easily confused by jargon, abbreviations, or insider language
- Expecting intuitive navigation without needing external help
- Judging trustworthiness based on design quality and professionalism

When evaluating, focus on:
- First impressions and clarity of purpose
- Navigation discoverability
- Terminology accessibility
- Visual hierarchy effectiveness
- Call-to-action clarity
- Error prevention for unfamiliar users`,
    priorityHeuristics: [
      "visibility-of-system-status",
      "match-real-world",
      "recognition-over-recall",
      "aesthetic-minimalist"
    ],
    weight: 1
  },
  "power-user": {
    id: "power-user",
    icon: "\u{1F468}\u200D\u{1F4BB}",
    name: {
      en: "Power User",
      tr: "Uzman Kullan\u0131c\u0131"
    },
    description: {
      en: "An experienced user who values speed and efficiency above all. They look for keyboard shortcuts, advanced features, and gets frustrated by unnecessary steps.",
      tr: "H\u0131z ve verimlili\u011Fe her \u015Feyin \xFCst\xFCnde de\u011Fer veren deneyimli bir kullan\u0131c\u0131. Klavye k\u0131sayollar\u0131, geli\u015Fmi\u015F \xF6zellikler arar ve gereksiz ad\u0131mlardan rahats\u0131z olur."
    },
    systemPrompt: `You are an experienced power user who values speed and efficiency above everything. You are:
- Impatient with unnecessary steps, confirmations, or animations
- Looking for keyboard shortcuts, batch actions, and quick access features
- Expecting consistent behavior across similar interactive elements
- Frustrated by lack of undo/redo or recovery options
- Wanting customization and flexibility in workflows
- Expecting search functionality and filtering options

When evaluating, focus on:
- Efficiency of common tasks
- Keyboard accessibility and shortcuts
- Consistency of UI patterns
- Undo/redo availability
- Search and filtering capabilities
- Customization options
- Error recovery speed`,
    priorityHeuristics: [
      "flexibility-efficiency",
      "consistency-standards",
      "error-recovery",
      "user-control-freedom"
    ],
    weight: 1
  },
  "accessibility": {
    id: "accessibility",
    icon: "\u267F",
    name: {
      en: "Accessibility User",
      tr: "Eri\u015Filebilirlik Kullan\u0131c\u0131s\u0131"
    },
    description: {
      en: "A user who relies on assistive technologies like screen readers and keyboard-only navigation. They have low vision and need high contrast and clear structure.",
      tr: "Ekran okuyucu ve yaln\u0131zca klavye navigasyonu gibi yard\u0131mc\u0131 teknolojilere g\xFCvenen bir kullan\u0131c\u0131. D\xFC\u015F\xFCk g\xF6rme kapasitesine sahip, y\xFCksek kontrast ve net yap\u0131 gerektirir."
    },
    systemPrompt: `You are a user who relies on assistive technologies. You are:
- Using a screen reader (like JAWS, NVDA, or VoiceOver) to navigate
- Navigating entirely with keyboard (Tab, Enter, Arrow keys, Escape)
- Dependent on proper heading structure for page comprehension
- Needing high color contrast (WCAG AA: 4.5:1 minimum)
- Requiring all interactive elements to have accessible names
- Expecting all images to have descriptive alt text
- Needing clear focus indicators to know where you are on the page
- Requiring form fields to have associated labels

When evaluating, focus on:
- Semantic HTML structure (headings, landmarks, lists)
- ARIA roles and labels completeness
- Keyboard navigability (Tab order, focus management)
- Color contrast ratios
- Alternative text for images
- Form accessibility (labels, error messages)
- Focus indicator visibility
- Skip navigation links`,
    priorityHeuristics: [
      "error-prevention",
      "help-documentation",
      "visibility-of-system-status",
      "recognition-over-recall"
    ],
    weight: 1
  }
};
function getProfile(id) {
  return PROFILES[id] || null;
}
function buildCustomSystemPrompt(profile) {
  const techLabels = {
    low: "not very comfortable with technology, prefers simple interfaces",
    medium: "moderately comfortable with technology, uses common apps regularly",
    high: "very tech-savvy, comfortable with complex interfaces and shortcuts"
  };
  const ageLabels = {
    "18-25": "a young adult (18-25) who is digitally native",
    "25-35": "an adult (25-35) with regular internet experience",
    "35-50": "a middle-aged adult (35-50) with moderate tech familiarity",
    "50-65": "an older adult (50-65) who may prefer larger text and simpler layouts",
    "65+": "a senior user (65+) who needs high contrast, large click targets, and simple navigation"
  };
  const disabilityDescriptions = {
    vision: "low vision \u2014 needs high contrast, large text, and screen reader support",
    hearing: "hearing impairment \u2014 relies on captions and visual cues instead of audio",
    motor: "motor disability \u2014 uses keyboard or switch device, needs large click targets",
    cognitive: "cognitive disability \u2014 needs simple language, clear structure, and minimal distractions",
    none: "no disabilities"
  };
  const age = ageLabels[profile.ageRange] || ageLabels["25-35"];
  const tech = techLabels[profile.techLevel] || techLabels["medium"];
  const disabilities = (profile.disabilities || []).length > 0 ? profile.disabilities.map((d) => disabilityDescriptions[d] || d).join("; ") : disabilityDescriptions.none;
  const goal = profile.goal || "browsing the page to accomplish a task";
  return `You are ${age}. You are ${tech}.
Your accessibility needs: ${disabilities}.
Your goal on this page: ${goal}.

When evaluating this web page, adopt this persona fully. Consider:
- How would someone with your age, tech level, and abilities experience this page?
- Are there barriers that would prevent you from accomplishing your goal?
- Is the language, layout, and interaction design appropriate for your profile?
- Would you feel confident, confused, or frustrated using this page?

Evaluate from YOUR perspective \u2014 not as a generic user.`;
}

// extension/core/heuristics.js
var BUILT_IN_RULE_PACKS = [
  {
    id: "nielsen-10",
    name: "Nielsen's 10 Usability Heuristics",
    shortName: "Nielsen 10",
    category: "General UX",
    description: "Industry-standard general usability framework by Jakob Nielsen.",
    file: "rules/nielsen-10.json",
    ruleCount: 10,
    isBuiltIn: true
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Conversion UX",
    shortName: "E-Commerce",
    category: "E-Commerce & Retail",
    description: "Specialized UX rules for online stores, product pages, carts, and checkout flows.",
    file: "rules/ecommerce.json",
    ruleCount: 8,
    isBuiltIn: true
  },
  {
    id: "saas",
    name: "SaaS & Web Application UX",
    shortName: "SaaS",
    category: "SaaS & Dashboards",
    description: "Specialized UX rules for SaaS apps, dashboards, onboarding, and self-service workflows.",
    file: "rules/saas.json",
    ruleCount: 8,
    isBuiltIn: true
  },
  {
    id: "fintech",
    name: "Fintech, Banking & Web3 UX",
    shortName: "Fintech",
    category: "Finance & Banking",
    description: "High-trust financial UX rules covering transaction safety, fee transparency, and numerical legibility.",
    file: "rules/fintech.json",
    ruleCount: 8,
    isBuiltIn: true
  }
];
var DEFAULT_SCORING_RUBRIC = {
  "0-20": "Critical violations \u2014 severe usability barriers",
  "21-40": "Major issues \u2014 frequent user friction and confusion",
  "41-60": "Moderate \u2014 functional but with notable UX gaps",
  "61-80": "Good \u2014 solid implementation with minor issues",
  "81-100": "Excellent \u2014 best-in-class user experience"
};
function validateAndNormalizeRulePack(rawInput) {
  let parsed = rawInput;
  if (typeof rawInput === "string") {
    try {
      parsed = JSON.parse(rawInput);
    } catch (e) {
      throw new Error("Invalid JSON syntax in rule pack.");
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Rule pack must be a JSON object.");
  }
  const packName = String(parsed.name || parsed.shortName || "").trim();
  if (!packName) {
    throw new Error('Rule pack must include a "name" field.');
  }
  if (!Array.isArray(parsed.rules) || parsed.rules.length === 0) {
    throw new Error('Rule pack must contain a non-empty "rules" array.');
  }
  if (parsed.rules.length > 25) {
    throw new Error("Rule pack can contain at most 25 rules.");
  }
  const slug = String(parsed.id || packName).toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "") || `custom-pack-${Date.now()}`;
  const builtInIds = new Set(BUILT_IN_RULE_PACKS.map((p) => p.id));
  const id = builtInIds.has(slug) ? `custom-${slug}` : slug;
  const normalizedRules = parsed.rules.map((r, idx) => {
    const ruleNameEn = typeof r.name === "object" && r.name !== null ? String(r.name.en || r.name.tr || `Rule ${idx + 1}`).trim() : String(r.name || `Rule ${idx + 1}`).trim();
    const ruleNameTr = typeof r.name === "object" && r.name !== null ? String(r.name.tr || ruleNameEn).trim() : ruleNameEn;
    const descEn = typeof r.description === "object" && r.description !== null ? String(r.description.en || r.description.tr || ruleNameEn).trim() : String(r.description || ruleNameEn).trim();
    const descTr = typeof r.description === "object" && r.description !== null ? String(r.description.tr || descEn).trim() : descEn;
    const ruleId = String(r.id || `${id}-rule-${idx + 1}`).toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
    const weight = Number.isFinite(Number(r.weight)) ? Math.max(0.1, Math.min(3, Number(r.weight))) : 1;
    return {
      id: ruleId,
      name: { en: ruleNameEn, tr: ruleNameTr },
      description: { en: descEn, tr: descTr },
      weight,
      automated_checks: Array.isArray(r.automated_checks) ? r.automated_checks : [],
      evaluation_guide: String(r.evaluation_guide || r.criteria?.join(", ") || descEn).trim(),
      prompt_template: String(r.prompt_template || `Evaluate this web page for '${ruleNameEn}'.`).trim(),
      scoring_rubric: r.scoring_rubric && typeof r.scoring_rubric === "object" ? r.scoring_rubric : DEFAULT_SCORING_RUBRIC
    };
  });
  return {
    id,
    name: packName,
    shortName: String(parsed.shortName || packName.slice(0, 22)).trim(),
    category: String(parsed.category || "Custom Pack").trim(),
    description: String(parsed.description || `Custom UX rule pack (${normalizedRules.length} rules)`).trim(),
    version: String(parsed.version || "1.0.0").trim(),
    source: String(parsed.source || "custom").trim(),
    ruleCount: normalizedRules.length,
    isCustom: true,
    rules: normalizedRules
  };
}
function selectHeuristics(rules, mode = "deep", profileId = null) {
  const allRules = rules.rules || [];
  if (mode === "quick") {
    const profile = getProfile(profileId);
    if (profile?.priorityHeuristics) {
      const matched = allRules.filter((r) => profile.priorityHeuristics.includes(r.id));
      if (matched.length >= 3) {
        return matched.slice(0, 3);
      }
    }
    return [...allRules].sort((a, b) => (b.weight || 1) - (a.weight || 1)).slice(0, 3);
  }
  return allRules;
}
function buildPrompt(heuristic, profile, pageData, hasVision = false) {
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
` : "";
  const heuristicName = typeof heuristic.name === "object" ? heuristic.name.en || heuristic.name.tr : String(heuristic.name || "");
  const heuristicDesc = typeof heuristic.description === "object" ? heuristic.description.en || heuristic.description.tr : String(heuristic.description || "");
  const rubric = heuristic.scoring_rubric || DEFAULT_SCORING_RUBRIC;
  const prompt = `You are a UX evaluation expert. Evaluate the following web page against the heuristic "${heuristicName}".

## Heuristic Definition
${heuristicDesc}

## Evaluation Criteria
${heuristic.evaluation_guide || "Evaluate based on the heuristic definition and common UX best practices."}

## Scoring Rubric
${Object.entries(rubric).map(([range, desc]) => `- ${range}: ${desc}`).join("\n")}

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
8. For each issue, the "element" field MUST be a valid CSS selector that uniquely identifies the problematic element on the page (e.g. "nav.main-menu > ul > li:nth-child(2)", "input#email", ".hero-section .cta-button"). This is critical for page highlighting.${hasVision ? "\n9. When the screenshot reveals visual issues not apparent from DOM data alone, include them as findings." : ""}

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
function parseEvaluation(response) {
  try {
    let data;
    const rawText = typeof response === "string" ? response : response?.raw || JSON.stringify(response);
    data = tryParseJSON(rawText);
    if (!data || typeof data !== "object") {
      throw new Error("Could not extract valid JSON");
    }
    const validIssues = (data.issues || []).map((issue) => {
      const priority = ["high", "medium", "low"].includes(issue.priority) ? issue.priority : "medium";
      const fixEffort = ["easy", "moderate", "hard"].includes(issue.fix_effort) ? issue.fix_effort : "moderate";
      return {
        severity: ["critical", "moderate", "minor"].includes(issue.severity) ? issue.severity : "moderate",
        priority,
        fixEffort,
        isQuickWin: priority === "high" && fixEffort === "easy",
        description: String(issue.description || "").trim(),
        element: String(issue.element || "").trim(),
        recommendation: String(issue.recommendation || "").trim(),
        codeFix: parseCodeFix(issue.code_fix)
      };
    }).filter((issue) => {
      if (!issue.description || issue.description.length < 5) return false;
      if (isPlaceholder(issue.description)) return false;
      if (isPlaceholder(issue.recommendation)) return false;
      const filledFields = [issue.description, issue.element, issue.recommendation].filter((f) => f && f.length > 3 && !isPlaceholder(f)).length;
      return filledFields >= 2;
    });
    const validPositives = (data.positives || []).map((p) => String(p).trim()).filter((p) => p.length > 3 && !isPlaceholder(p));
    return {
      score: Math.max(0, Math.min(100, parseInt(data.score) || 50)),
      summary: isPlaceholder(data.summary) ? "Evaluation completed" : String(data.summary || "Evaluation completed").trim(),
      issues: validIssues,
      positives: validPositives,
      scoreJustification: String(data.score_justification || "").trim()
    };
  } catch (err) {
    console.error("[synthux] Failed to parse evaluation:", err);
    return {
      score: 50,
      summary: "Unable to parse AI evaluation response",
      issues: [],
      positives: [],
      scoreJustification: "Default score due to parse error"
    };
  }
}
function calculateOverallScore(evaluations, rules) {
  if (!evaluations || evaluations.length === 0) return 0;
  const allRules = rules.rules || [];
  let totalWeight = 0;
  let weightedSum = 0;
  evaluations.forEach((evaluation) => {
    const rule = allRules.find((r) => r.id === evaluation.heuristicId);
    const weight = rule?.weight || 1;
    weightedSum += evaluation.score * weight;
    totalWeight += weight;
  });
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
function sanitizeLLMOutput(text) {
  if (!text || typeof text !== "string") return "";
  let cleaned = text;
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/^[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/,\s*\/\/[^\n]*/g, ",");
  cleaned = cleaned.replace(/{\s*\/\/[^\n]*/g, "{");
  cleaned = cleaned.replace(/^\s*\/\/[^\n]*/gm, "");
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  cleaned = cleaned.replace(/```json\s*/gi, "");
  cleaned = cleaned.replace(/```\s*/g, "");
  return cleaned.trim();
}
function tryParseJSON(text) {
  if (!text || typeof text !== "string") {
    if (typeof text === "object" && text !== null) return text;
    return null;
  }
  const strippedText = text.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\S]*?<\/think>/gi, "").trim();
  try {
    return JSON.parse(strippedText);
  } catch {
  }
  const jsonMatch = strippedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
    }
    try {
      const cleaned = sanitizeLLMOutput(jsonMatch[0]);
      return JSON.parse(cleaned);
    } catch {
    }
    try {
      const repaired = repairJSON(sanitizeLLMOutput(jsonMatch[0]));
      return JSON.parse(repaired);
    } catch {
    }
  }
  const scoreMatch = strippedText.match(/"score"\s*:\s*(\d+)/);
  const summaryMatch = strippedText.match(/"summary"\s*:\s*"([^"]+)"/);
  const justificationMatch = strippedText.match(/"score_justification"\s*:\s*"([^"]+)"/);
  if (scoreMatch) {
    let issues = [];
    const issuesBlockMatch = strippedText.match(/"issues"\s*:\s*\[([\s\S]*?)\]/);
    if (issuesBlockMatch) {
      try {
        const cleaned = sanitizeLLMOutput(`[${issuesBlockMatch[1]}]`);
        issues = JSON.parse(cleaned);
      } catch {
        const issueMatches = issuesBlockMatch[1].match(/\{[^{}]*\}/g);
        if (issueMatches) {
          issues = issueMatches.map((m) => {
            try {
              return JSON.parse(sanitizeLLMOutput(m));
            } catch {
              return null;
            }
          }).filter(Boolean);
        }
      }
    }
    let positives = [];
    const positivesMatch = text.match(/"positives"\s*:\s*\[([\s\S]*?)\]/);
    if (positivesMatch) {
      try {
        positives = JSON.parse(`[${positivesMatch[1]}]`);
      } catch {
      }
    }
    return {
      score: parseInt(scoreMatch[1]),
      summary: summaryMatch ? summaryMatch[1] : "Evaluation completed (recovered)",
      issues,
      positives,
      score_justification: justificationMatch ? justificationMatch[1] : "Recovered from malformed response"
    };
  }
  return null;
}
function repairJSON(text) {
  let json = text;
  json = json.replace(/}\s*{/g, "},{");
  json = json.replace(/"\s*"/g, (match, offset) => {
    const before = json.substring(Math.max(0, offset - 20), offset);
    if (/[\[,]\s*"[^"]*$/.test(before)) return '","';
    return match;
  });
  json = json.replace(/("[^"]*")\s+("[^"]*")/g, "$1,$2");
  json = json.replace(/,\s*([\]}])/g, "$1");
  const opens = (json.match(/{/g) || []).length;
  const closes = (json.match(/}/g) || []).length;
  const arrOpens = (json.match(/\[/g) || []).length;
  const arrCloses = (json.match(/\]/g) || []).length;
  for (let i = 0; i < arrOpens - arrCloses; i++) json += "]";
  for (let i = 0; i < opens - closes; i++) json += "}";
  const quoteCount = (json.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    json += '"';
  }
  return json;
}
function isPlaceholder(str) {
  if (!str || typeof str !== "string") return true;
  const s = str.trim().toLowerCase();
  if (s.length < 3) return true;
  const placeholders = [
    "no description",
    "no recommendation",
    "no summary",
    "n/a",
    "none",
    "unknown",
    "not available",
    "not applicable",
    "no issues",
    "no information",
    "description",
    "recommendation",
    "tbd",
    "todo",
    "placeholder"
  ];
  return placeholders.includes(s);
}
function parseCodeFix(codeFix) {
  if (!codeFix || typeof codeFix !== "object") return null;
  const language = String(codeFix.language || "css").toLowerCase();
  const before = String(codeFix.before || "").trim();
  const after = String(codeFix.after || "").trim();
  if (!after || after.length < 3 || isPlaceholder(after)) return null;
  const validLangs = ["css", "html", "javascript", "js", "jsx", "scss"];
  return {
    language: validLangs.includes(language) ? language : "css",
    before: before || "",
    after
  };
}
function summarizePageData(pageData) {
  const parts = [];
  if (pageData.meta) {
    parts.push(`**Page Title:** ${pageData.meta.title || "None"}`);
    parts.push(`**Language:** ${pageData.meta.lang || "Not set"}`);
    parts.push(`**Description:** ${pageData.meta.description || "None"}`);
  }
  if (pageData.structure) {
    const { headings, landmarks, forms } = pageData.structure;
    parts.push(`
**Headings:** ${headings?.length || 0} total`);
    if (headings?.length > 0) {
      const h1Count = headings.filter((h) => h.level === 1).length;
      parts.push(`  - H1 count: ${h1Count}`);
      const headingOrder = headings.map((h) => `H${h.level}`).join(" \u2192 ");
      parts.push(`  - Order: ${headingOrder}`);
    }
    parts.push(`**Landmarks:** ${landmarks?.length || 0} (${landmarks?.map((l) => l.role).join(", ") || "none"})`);
    parts.push(`**Forms:** ${forms?.length || 0}`);
    if (forms?.length > 0) {
      forms.forEach((f, i) => {
        parts.push(`  Form ${i + 1}: ${f.fields?.length || 0} fields, submit button: ${f.hasSubmitButton ? "yes" : "no"}`);
        const unlabeled = f.fields?.filter((field) => !field.label).length || 0;
        if (unlabeled > 0) parts.push(`    ${unlabeled} fields without labels`);
      });
    }
  }
  if (pageData.navigation) {
    parts.push(`
**Navigation:**`);
    parts.push(`  - Nav elements: ${pageData.navigation.navCount || 0}`);
    parts.push(`  - Menu depth: ${pageData.navigation.mainMenu?.depth || 0}`);
    parts.push(`  - Breadcrumbs: ${pageData.navigation.breadcrumb ? "yes" : "no"}`);
    parts.push(`  - Skip links: ${pageData.navigation.skipLinks ? "yes" : "no"}`);
    parts.push(`  - Search: ${pageData.navigation.hasSearch ? "yes" : "no"}`);
  }
  if (pageData.content) {
    parts.push(`
**Content:**`);
    parts.push(`  - Text length: ${pageData.content.textLength || 0} chars, ${pageData.content.wordCount || 0} words`);
    parts.push(`  - Images: ${pageData.content.imageCount || 0} total, ${pageData.content.imagesWithoutAlt || 0} without alt text`);
    parts.push(`  - CTAs: ${pageData.content.ctas?.length || 0}`);
    parts.push(`  - Links: ${pageData.content.internalLinks || 0} internal, ${pageData.content.externalLinks || 0} external`);
  }
  if (pageData.accessibility) {
    parts.push(`
**Accessibility:**`);
    parts.push(`  - ARIA roles used: ${pageData.accessibility.ariaRoles?.join(", ") || "none"}`);
    parts.push(`  - Tab order issues: ${pageData.accessibility.tabOrderIssues?.length || 0}`);
    parts.push(`  - Lang attribute: ${pageData.accessibility.hasLangAttr ? "yes" : "no"}`);
    parts.push(`  - Unlabeled interactive elements: ${pageData.accessibility.unlabeledInteractives?.length || 0}`);
    const contrastResults = pageData.accessibility.contrastResults || [];
    const failing = contrastResults.filter((c) => !c.passes).length;
    parts.push(`  - Color contrast: ${contrastResults.length} sampled, ${failing} failing`);
    parts.push(`  - Focus indicators: ${pageData.accessibility.focusIndicators?.note || "unknown"}`);
  }
  if (pageData.performance) {
    parts.push(`
**Performance:**`);
    parts.push(`  - DOM elements: ${pageData.performance.domSize || 0}`);
    parts.push(`  - Scripts: ${pageData.performance.scriptCount || 0}`);
    parts.push(`  - Stylesheets: ${pageData.performance.styleSheetCount || 0}`);
    parts.push(`  - Loading indicators: ${pageData.performance.loadingState?.hasLoadingIndicators ? "present" : "none detected"}`);
  }
  return parts.join("\n");
}

// extension/core/accessibility.js
function runAccessibilityChecks(pageData) {
  const checks = [];
  checks.push(checkAltText(pageData));
  checks.push(checkHeadingHierarchy(pageData));
  checks.push(checkColorContrast(pageData));
  checks.push(checkFormLabels(pageData));
  checks.push(checkLanguageAttribute(pageData));
  checks.push(checkSkipNavigation(pageData));
  checks.push(checkLandmarks(pageData));
  checks.push(checkTabOrder(pageData));
  checks.push(checkFocusIndicators(pageData));
  checks.push(checkInteractiveLabels(pageData));
  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const totalChecks = checks.length;
  const score = Math.round(
    (passCount * 100 + warnCount * 50 + failCount * 0) / totalChecks
  );
  return {
    score,
    passCount,
    warnCount,
    failCount,
    totalChecks,
    checks
  };
}
function checkAltText(pageData) {
  const images = pageData.content?.images || [];
  const total = images.length;
  const withAlt = images.filter((i) => i.hasAlt).length;
  const withoutAlt = images.filter((i) => !i.hasAlt).length;
  if (total === 0) {
    return {
      id: "alt-text",
      name: "Image Alt Text",
      status: "pass",
      message: "No images found on page",
      details: { total: 0, withAlt: 0, withoutAlt: 0 }
    };
  }
  const ratio = withAlt / total;
  return {
    id: "alt-text",
    name: "Image Alt Text",
    status: ratio >= 1 ? "pass" : ratio >= 0.8 ? "warning" : "fail",
    message: `${withAlt}/${total} images have alt text (${Math.round(ratio * 100)}%)`,
    details: {
      total,
      withAlt,
      withoutAlt,
      missingElements: images.filter((i) => !i.hasAlt).slice(0, 5).map((i) => i.src?.substring(0, 80))
    }
  };
}
function checkHeadingHierarchy(pageData) {
  const headings = pageData.structure?.headings || [];
  if (headings.length === 0) {
    return {
      id: "heading-hierarchy",
      name: "Heading Hierarchy",
      status: "warning",
      message: "No headings found on page",
      details: { headings: [] }
    };
  }
  const issues = [];
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    issues.push("No H1 heading found");
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
  }
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      issues.push(`Heading level skipped: H${prev} \u2192 H${curr} (expected H${prev + 1})`);
    }
  }
  return {
    id: "heading-hierarchy",
    name: "Heading Hierarchy",
    status: issues.length === 0 ? "pass" : issues.length <= 1 ? "warning" : "fail",
    message: issues.length === 0 ? `${headings.length} headings in correct order` : `${issues.length} heading issues found`,
    details: {
      headingCount: headings.length,
      h1Count,
      issues,
      structure: headings.map((h) => `H${h.level}: ${h.text.substring(0, 60)}`)
    }
  };
}
function checkColorContrast(pageData) {
  const results = pageData.accessibility?.contrastResults || [];
  if (results.length === 0) {
    return {
      id: "color-contrast",
      name: "Color Contrast (WCAG AA)",
      status: "warning",
      message: "Unable to sample color contrast",
      details: { sampled: 0 }
    };
  }
  const passing = results.filter((r) => r.passes).length;
  const failing = results.filter((r) => !r.passes).length;
  const ratio = passing / results.length;
  return {
    id: "color-contrast",
    name: "Color Contrast (WCAG AA)",
    status: ratio >= 1 ? "pass" : ratio >= 0.8 ? "warning" : "fail",
    message: `${passing}/${results.length} sampled elements pass WCAG AA`,
    details: {
      sampled: results.length,
      passing,
      failing,
      failingElements: results.filter((r) => !r.passes).slice(0, 5).map((r) => ({
        element: r.element,
        ratio: r.ratio,
        required: r.required
      }))
    }
  };
}
function checkFormLabels(pageData) {
  const forms = pageData.structure?.forms || [];
  if (forms.length === 0) {
    return {
      id: "form-labels",
      name: "Form Field Labels",
      status: "pass",
      message: "No forms found on page",
      details: { formCount: 0 }
    };
  }
  let totalFields = 0;
  let labeledFields = 0;
  const unlabeledFields = [];
  forms.forEach((form) => {
    (form.fields || []).forEach((field) => {
      if (field.type === "hidden" || field.type === "submit") return;
      totalFields++;
      if (field.label) {
        labeledFields++;
      } else {
        unlabeledFields.push(`${field.type}${field.name ? `[name="${field.name}"]` : ""}`);
      }
    });
  });
  if (totalFields === 0) {
    return {
      id: "form-labels",
      name: "Form Field Labels",
      status: "pass",
      message: "No input fields found",
      details: { formCount: forms.length, totalFields: 0 }
    };
  }
  const ratio = labeledFields / totalFields;
  return {
    id: "form-labels",
    name: "Form Field Labels",
    status: ratio >= 1 ? "pass" : ratio >= 0.8 ? "warning" : "fail",
    message: `${labeledFields}/${totalFields} form fields have labels`,
    details: {
      formCount: forms.length,
      totalFields,
      labeledFields,
      unlabeledFields: unlabeledFields.slice(0, 10)
    }
  };
}
function checkLanguageAttribute(pageData) {
  const hasLang = pageData.accessibility?.hasLangAttr;
  return {
    id: "lang-attribute",
    name: "Language Attribute",
    status: hasLang ? "pass" : "fail",
    message: hasLang ? `Page language is set to "${pageData.meta?.lang}"` : "No lang attribute on <html> element",
    details: { lang: pageData.meta?.lang || null }
  };
}
function checkSkipNavigation(pageData) {
  const hasSkip = pageData.navigation?.skipLinks;
  return {
    id: "skip-nav",
    name: "Skip Navigation",
    status: hasSkip ? "pass" : "warning",
    message: hasSkip ? "Skip navigation link found" : "No skip navigation link detected",
    details: {}
  };
}
function checkLandmarks(pageData) {
  const landmarks = pageData.structure?.landmarks || [];
  const roles = landmarks.map((l) => l.role);
  const hasMain = roles.includes("main");
  const hasNav = roles.includes("navigation");
  const hasBanner = roles.includes("banner");
  const issues = [];
  if (!hasMain) issues.push('No <main> or role="main" landmark');
  if (!hasNav) issues.push('No <nav> or role="navigation" landmark');
  return {
    id: "landmarks",
    name: "ARIA Landmarks",
    status: issues.length === 0 ? "pass" : issues.length === 1 ? "warning" : "fail",
    message: `${landmarks.length} landmarks found (${roles.join(", ") || "none"})`,
    details: {
      landmarkCount: landmarks.length,
      roles,
      hasMain,
      hasNav,
      hasBanner,
      issues
    }
  };
}
function checkTabOrder(pageData) {
  const issues = pageData.accessibility?.tabOrderIssues || [];
  return {
    id: "tab-order",
    name: "Tab Order",
    status: issues.length === 0 ? "pass" : "warning",
    message: issues.length === 0 ? "No positive tabindex values found" : `${issues.length} elements use positive tabindex (disrupts natural order)`,
    details: {
      issues: issues.slice(0, 5)
    }
  };
}
function checkFocusIndicators(pageData) {
  const focusInfo = pageData.accessibility?.focusIndicators || {};
  return {
    id: "focus-indicators",
    name: "Focus Indicators",
    status: focusInfo.removesOutlines ? "fail" : "pass",
    message: focusInfo.note || "Unable to check focus indicators",
    details: focusInfo
  };
}
function checkInteractiveLabels(pageData) {
  const unlabeled = pageData.accessibility?.unlabeledInteractives || [];
  return {
    id: "interactive-labels",
    name: "Interactive Element Labels",
    status: unlabeled.length === 0 ? "pass" : unlabeled.length <= 3 ? "warning" : "fail",
    message: unlabeled.length === 0 ? "All interactive elements have accessible names" : `${unlabeled.length} interactive elements lack accessible names`,
    details: {
      unlabeledCount: unlabeled.length,
      elements: unlabeled.slice(0, 10)
    }
  };
}

// extension/core/report-generator.js
function generateReport(data) {
  const {
    url,
    title,
    timestamp,
    model,
    mode,
    provider,
    rulePackId = "nielsen-10",
    rulePackName = "Nielsen's 10 Usability Heuristics",
    rulePackShortName = "Nielsen 10",
    ruleCount = 10,
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    screenshot,
    annotatedScreenshot = null,
    costSummary
  } = data;
  return {
    version: "2.0.0",
    url,
    title,
    timestamp,
    model,
    mode,
    provider: provider || "ollama",
    rulePackId,
    rulePackName,
    rulePackShortName,
    ruleCount,
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    annotatedScreenshot: annotatedScreenshot || null,
    visionEnabled: !!screenshot,
    costSummary: costSummary || null,
    markdown: generateMarkdown(data),
    json: generateJSON(data)
  };
}
function generateMarkdown(data) {
  const {
    url,
    title,
    timestamp,
    model,
    mode,
    rulePackName = "Nielsen's 10 Usability Heuristics",
    ruleCount = 10,
    overallScore,
    profileResults = {},
    accessibilityResults,
    issues = []
  } = data;
  const lines = [];
  const critical = issues.filter((i) => i.severity === "critical");
  const moderate = issues.filter((i) => i.severity === "moderate");
  const minor = issues.filter((i) => i.severity === "minor");
  const quickWins = issues.filter((i) => i.isQuickWin || i.priority === "high" && i.fixEffort === "easy");
  lines.push("# \u{1F4CA} synthux UX Audit Report");
  lines.push("");
  lines.push("| Audit Property | Details |");
  lines.push("|:---|:---|");
  lines.push(`| **URL** | ${url} |`);
  lines.push(`| **Page Title** | ${title || "N/A"} |`);
  lines.push(`| **Date** | ${new Date(timestamp).toLocaleString()} |`);
  lines.push(`| **Rule Pack** | **${rulePackName}** |`);
  const modeLabel = mode === "deep" ? `\u{1F52C} Deep (${ruleCount} rules)` : mode === "custom" ? "\u{1F3AF} Custom Selection" : `\u26A1 Quick (${Math.min(3, ruleCount)} rules)`;
  lines.push(`| **Analysis Mode** | ${modeLabel} |`);
  lines.push(`| **AI Engine** | \`${model}\` (${data.provider || "ollama"}${data.screenshot ? " \xB7 Vision" : ""}) |`);
  if (data.costSummary) {
    lines.push(`| **Token / Cost** | ${data.costSummary.formatted} |`);
  }
  lines.push("");
  lines.push("## \u{1F4C8} Executive Summary & KPI Scorecard");
  lines.push("");
  lines.push("| Metric | Score / Count | Visual Bar / Breakdown |");
  lines.push("|:---|:---|:---|");
  lines.push(`| **Overall UX Score** | **${overallScore}/100** ${getScoreEmoji(overallScore)} | \`${renderScoreBar(overallScore)}\` (${getScoreGrade(overallScore)}) |`);
  if (accessibilityResults) {
    lines.push(`| **Accessibility (WCAG)** | **${accessibilityResults.score}/100** ${getScoreEmoji(accessibilityResults.score)} | \`${renderScoreBar(accessibilityResults.score)}\` (${accessibilityResults.wcagViolations?.length || 0} WCAG violations) |`);
  }
  Object.values(profileResults).forEach((pr) => {
    const pName = pr.profile?.name?.en || pr.profile?.name || "Profile";
    lines.push(`| **${pr.profile?.icon || "\u{1F464}"} ${pName}** | **${pr.score}/100** ${getScoreEmoji(pr.score)} | \`${renderScoreBar(pr.score)}\` |`);
  });
  lines.push(`| **Total Unique Issues** | **${issues.length}** | \u{1F534} ${critical.length} Critical \xB7 \u{1F7E1} ${moderate.length} Moderate \xB7 \u{1F7E2} ${minor.length} Minor |`);
  lines.push(`| **Quick Wins** | **${quickWins.length}** | \u26A1 High-impact, easy-effort fixes ready for immediate action |`);
  lines.push("");
  if (issues.length > 0) {
    const majorProjects = issues.filter((i) => i.priority === "high" && i.fixEffort !== "easy");
    const fillIns = issues.filter((i) => i.priority !== "high" && i.fixEffort === "easy");
    const backlog = issues.filter((i) => i.priority !== "high" && i.fixEffort !== "easy");
    lines.push("---");
    lines.push("");
    lines.push("## \u{1F9ED} 2\xD72 Impact \xD7 Effort Priority Matrix");
    lines.push("");
    lines.push("| Quadrant | Impact \xD7 Effort | Count | Top Actionable Focus |");
    lines.push("|:---|:---|:---:|:---|");
    lines.push(`| **\u26A1 1. Quick Wins** | High Impact \xB7 Easy Fix | **${quickWins.length}** | ${quickWins[0]?.description || "None identified"} |`);
    lines.push(`| **\u{1F680} 2. Major Projects** | High Impact \xB7 Mod/Hard Fix | **${majorProjects.length}** | ${majorProjects[0]?.description || "None identified"} |`);
    lines.push(`| **\u{1F527} 3. Fill-Ins** | Med/Low Impact \xB7 Easy Fix | **${fillIns.length}** | ${fillIns[0]?.description || "None identified"} |`);
    lines.push(`| **\u{1F4CB} 4. Backlog** | Med/Low Impact \xB7 Mod/Hard Fix | **${backlog.length}** | ${backlog[0]?.description || "None identified"} |`);
    lines.push("");
    if (quickWins.length > 0) {
      lines.push("### \u26A1 Top Quick Wins (Do First)");
      lines.push("");
      quickWins.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **[${issue.severity.toUpperCase()}] ${issue.description}**`);
        if (issue.element) lines.push(`   - **Selector:** \`${issue.element}\``);
        lines.push(`   - **Action:** ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`   - **Fix (\`${issue.codeFix.language}\`):** \`${issue.codeFix.after.replace(/\n/g, " ")}\``);
        }
      });
      lines.push("");
    }
  }
  Object.values(profileResults).forEach((pr) => {
    const pName = pr.profile?.name?.en || pr.profile?.name || "Profile";
    lines.push("---");
    lines.push("");
    lines.push(`## ${pr.profile?.icon || "\u{1F464}"} ${pName} \u2014 ${pr.score}/100 (${getScoreGrade(pr.score)})`);
    lines.push("");
    if (pr.profile?.custom) {
      const details = [];
      if (pr.profile.ageRange) details.push(`**Age:** ${pr.profile.ageRange}`);
      if (pr.profile.techLevel) details.push(`**Tech Level:** ${pr.profile.techLevel}`);
      if (pr.profile.disabilities?.length) details.push(`**Accessibility:** ${pr.profile.disabilities.join(", ")}`);
      if (pr.profile.goal) details.push(`**Goal:** ${pr.profile.goal}`);
      if (details.length > 0) {
        lines.push(`> \u{1F464} **Custom Persona** \u2014 ${details.join(" \xB7 ")}`);
        lines.push("");
      }
    }
    lines.push("| Heuristic / Rule | Score | Bar | Summary |");
    lines.push("|:---|:---:|:---|:---|");
    pr.evaluations.forEach((ev) => {
      const name = ev.heuristicName?.en || ev.heuristicName;
      const emoji = getScoreEmoji(ev.score);
      const summary = String(ev.summary || "").replace(/\|/g, "\\|");
      lines.push(`| **${name}** | ${ev.score}/100 ${emoji} | \`${renderScoreBar(ev.score, 8)}\` | ${summary} |`);
    });
    lines.push("");
    const profileIssues = pr.evaluations.flatMap(
      (ev) => (ev.issues || []).map((i) => ({ ...i, heuristic: ev.heuristicName?.en || ev.heuristicName }))
    );
    if (profileIssues.length > 0) {
      lines.push("### \u{1F50D} Identified Issues & Code Fixes");
      lines.push("");
      profileIssues.forEach((issue) => {
        const icon = issue.severity === "critical" ? "\u{1F534}" : issue.severity === "moderate" ? "\u{1F7E1}" : "\u{1F7E2}";
        const priorityTag = issue.priority === "high" ? " \xB7 `HIGH IMPACT`" : issue.priority === "low" ? " \xB7 `low impact`" : "";
        const effortTag = issue.fixEffort === "easy" ? " \xB7 `EASY FIX`" : issue.fixEffort === "hard" ? " \xB7 `HARD FIX`" : "";
        const qwTag = issue.priority === "high" && issue.fixEffort === "easy" ? " \xB7 \u{1F3C6} **Quick Win**" : "";
        lines.push(`- ${icon} **[${issue.severity.toUpperCase()}]** *(${issue.heuristic})*${priorityTag}${effortTag}${qwTag}`);
        lines.push(`  - **Issue:** ${issue.description}`);
        if (issue.element) lines.push(`  - **Element:** \`${issue.element}\``);
        lines.push(`  - **Recommendation:** ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`  - <details><summary>\u{1F4BB} Suggested Code Fix (${issue.codeFix.language})</summary>`);
          lines.push("");
          if (issue.codeFix.before) {
            lines.push(`    **Before:**`);
            lines.push(`    \`\`\`${issue.codeFix.language}`);
            lines.push(`    ${issue.codeFix.before}`);
            lines.push(`    \`\`\``);
          }
          lines.push(`    **After:**`);
          lines.push(`    \`\`\`${issue.codeFix.language}`);
          lines.push(`    ${issue.codeFix.after}`);
          lines.push(`    \`\`\``);
          lines.push(`    </details>`);
        }
      });
      lines.push("");
    }
    const positives = pr.evaluations.flatMap((ev) => ev.positives || []);
    if (positives.length > 0) {
      lines.push("### \u2705 Strengths & Positives");
      lines.push("");
      positives.forEach((p) => {
        lines.push(`- \u2705 ${p}`);
      });
      lines.push("");
    }
  });
  if (accessibilityResults) {
    lines.push("---");
    lines.push("");
    lines.push(`## \u267F Accessibility & WCAG 2.2 AA Audit \u2014 ${accessibilityResults.score}/100`);
    lines.push("");
    lines.push("| Automated Check | Status | Details |");
    lines.push("|:---|:---|:---|");
    (accessibilityResults.checks || []).forEach((check) => {
      const icon = check.status === "pass" ? "\u2705" : check.status === "warning" ? "\u26A0\uFE0F" : "\u274C";
      lines.push(`| **${check.name}** | ${icon} ${check.status} | ${check.message} |`);
    });
    lines.push("");
    if (accessibilityResults.wcagViolations?.length > 0) {
      lines.push(`### WCAG Violations (axe-core) \u2014 ${accessibilityResults.wcagViolations.length} issue${accessibilityResults.wcagViolations.length > 1 ? "s" : ""}`);
      lines.push("");
      accessibilityResults.wcagViolations.forEach((v) => {
        const impactIcon = v.impact === "critical" ? "\u{1F534}" : v.impact === "serious" ? "\u{1F7E1}" : v.impact === "moderate" ? "\u{1F535}" : "\u26AA";
        lines.push(`- ${impactIcon} **[${v.impact}]** **${v.help}**`);
        lines.push(`  - ${v.description}`);
        if (v.tags?.length) lines.push(`  - **Standard:** \`${v.tags.join("`, `")}\``);
        if (v.nodes?.length) {
          v.nodes.slice(0, 3).forEach((n) => {
            lines.push(`  - **Element:** \`${n.target || n.html}\``);
          });
        }
        if (v.helpUrl) lines.push(`  - [WCAG Reference](${v.helpUrl})`);
      });
      lines.push("");
    }
    if (accessibilityResults.wcagPasses) {
      lines.push(`> \u2713 **${accessibilityResults.wcagPasses}** automated WCAG 2.2 rules passed`);
      lines.push("");
    }
  }
  if (issues.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## \u{1F3AF} Consolidated Issues by Severity");
    lines.push("");
    if (critical.length > 0) {
      lines.push(`### \u{1F534} Critical (${critical.length})`);
      critical.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ""}`);
        lines.push(`   - \u{1F4A1} ${issue.recommendation}`);
      });
      lines.push("");
    }
    if (moderate.length > 0) {
      lines.push(`### \u{1F7E1} Moderate (${moderate.length})`);
      moderate.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ""}`);
        lines.push(`   - \u{1F4A1} ${issue.recommendation}`);
      });
      lines.push("");
    }
    if (minor.length > 0) {
      lines.push(`### \u{1F7E2} Minor (${minor.length})`);
      minor.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ""}`);
        lines.push(`   - \u{1F4A1} ${issue.recommendation}`);
      });
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");
  lines.push("*Generated by [synthux v2.0](https://synthux.app) \u2014 Open Source AI-Powered UX Audit.*");
  return lines.join("\n");
}
function generateJSON(data) {
  return {
    version: "2.0.0",
    url: data.url,
    title: data.title,
    timestamp: data.timestamp,
    model: data.model,
    mode: data.mode,
    rulePackId: data.rulePackId || "nielsen-10",
    rulePackName: data.rulePackName || "Nielsen's 10 Usability Heuristics",
    overallScore: data.overallScore,
    profiles: Object.fromEntries(
      Object.entries(data.profileResults || {}).map(([id, pr]) => [
        id,
        {
          score: pr.score,
          evaluations: (pr.evaluations || []).map((ev) => ({
            heuristic: ev.heuristicId,
            score: ev.score,
            summary: ev.summary,
            issues: ev.issues,
            positives: ev.positives
          }))
        }
      ])
    ),
    accessibility: {
      score: data.accessibilityResults?.score,
      checks: data.accessibilityResults?.checks?.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        message: c.message
      }))
    },
    topIssues: (data.issues || []).slice(0, 15).map((i) => ({
      severity: i.severity,
      priority: i.priority,
      fixEffort: i.fixEffort,
      isQuickWin: i.isQuickWin || false,
      element: i.element || "",
      description: i.description,
      recommendation: i.recommendation,
      codeFix: i.codeFix || null
    }))
  };
}
function getScoreEmoji(score) {
  if (score >= 81) return "\u2705";
  if (score >= 61) return "\u{1F7E1}";
  if (score >= 41) return "\u26A0\uFE0F";
  return "\u274C";
}
function getScoreGrade(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Critical";
}
function renderScoreBar(score, length = 10) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const filled = Math.round(clamped / 100 * length);
  return "\u2588".repeat(filled) + "\u2591".repeat(Math.max(0, length - filled));
}

// extension/core/providers.js
var PROVIDERS = {
  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    icon: "\u{1F5A5}\uFE0F",
    authType: "none",
    defaultEndpoint: "http://localhost:11434",
    models: [],
    // Dynamically fetched from local server
    modelsFetchable: true,
    buildRequest(prompt, model, options = {}) {
      const body = {
        model,
        prompt,
        system: options.systemPrompt || "",
        stream: false,
        format: options.format || "json",
        options: {
          temperature: options.temperature ?? 0.3,
          num_predict: options.maxTokens || 2048
        }
      };
      if (options.images?.length) {
        body.images = options.images.map((img) => img.replace(/^data:image\/\w+;base64,/, ""));
      }
      return {
        url: `${options.endpoint || this.defaultEndpoint}/api/generate`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      };
    },
    parseResponse(data) {
      try {
        const parsed = JSON.parse(data.response);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.model,
            totalDuration: data.total_duration,
            inputTokens: data.prompt_eval_count || 0,
            outputTokens: data.eval_count || 0
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: data.response },
          meta: {
            model: data.model,
            inputTokens: data.prompt_eval_count || 0,
            outputTokens: data.eval_count || 0
          }
        };
      }
    },
    async fetchModels(endpoint) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/api/tags`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.models || []).map((m) => ({
          id: m.name,
          name: m.name,
          size: m.size
        }));
      } catch {
        return [];
      }
    },
    async ping(endpoint) {
      const url = endpoint || this.defaultEndpoint;
      try {
        const res = await fetch(`${url}/api/tags`, {
          signal: AbortSignal.timeout(5e3)
        });
        if (res.ok) {
          try {
            const postProbe = await fetch(`${url}/api/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model: "" }),
              signal: AbortSignal.timeout(3e3)
            });
            if (postProbe.status === 403) {
              return { status: "cors-blocked" };
            }
          } catch {
            return { status: "cors-blocked" };
          }
          let version = null;
          try {
            const vRes = await fetch(`${url}/api/version`, { signal: AbortSignal.timeout(3e3) });
            if (vRes.ok) {
              const vData = await vRes.json();
              version = vData.version || null;
            }
          } catch {
          }
          return { status: "connected", version };
        }
        return { status: "error", code: res.status };
      } catch {
        try {
          await fetch(url, {
            mode: "no-cors",
            signal: AbortSignal.timeout(3e3)
          });
          return { status: "cors-blocked" };
        } catch {
          return { status: "offline" };
        }
      }
    }
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    icon: "\u{1F7E2}",
    authType: "bearer",
    defaultEndpoint: "https://api.openai.com",
    models: [
      { id: "gpt-5.4", name: "GPT-5.4" },
      { id: "gpt-5.4-mini", name: "GPT-5.4 Mini" },
      { id: "gpt-5.4-nano", name: "GPT-5.4 Nano" },
      { id: "gpt-5.1", name: "GPT-5.1" }
    ],
    modelsFetchable: true,
    buildRequest(prompt, model, options = {}) {
      const userContent = [];
      if (options.images?.length) {
        options.images.forEach((img) => {
          userContent.push({
            type: "image_url",
            image_url: { url: img, detail: "low" }
          });
        });
      }
      userContent.push({ type: "text", text: prompt });
      return {
        url: `${options.endpoint || this.defaultEndpoint}/v1/chat/completions`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${options.apiKey}`
        },
        body: {
          model,
          messages: [
            ...options.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : [],
            { role: "user", content: options.images?.length ? userContent : prompt }
          ],
          temperature: options.temperature ?? 0.3,
          max_tokens: options.maxTokens || 2048,
          response_format: options.format === "json" ? { type: "json_object" } : void 0
        }
      };
    },
    parseResponse(data) {
      const content = data.choices?.[0]?.message?.content || "";
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.model,
            inputTokens: data.usage?.prompt_tokens || 0,
            outputTokens: data.usage?.completion_tokens || 0
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.model,
            inputTokens: data.usage?.prompt_tokens || 0,
            outputTokens: data.usage?.completion_tokens || 0
          }
        };
      }
    },
    async fetchModels(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: { "Authorization": `Bearer ${apiKey}` }
        });
        if (!res.ok) return this.models;
        const data = await res.json();
        return (data.data || []).filter((m) => m.id.startsWith("gpt-5") || m.id.startsWith("gpt-4") || m.id.startsWith("o")).map((m) => ({ id: m.id, name: m.id })).sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        return this.models;
      }
    },
    async ping(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: { "Authorization": `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(8e3)
        });
        return res.ok;
      } catch {
        return false;
      }
    }
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    icon: "\u{1F535}",
    authType: "query_param",
    defaultEndpoint: "https://generativelanguage.googleapis.com",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite" },
      { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Preview)" },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Preview)" },
      { id: "gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash-Lite (Preview)" }
    ],
    modelsFetchable: true,
    buildRequest(prompt, model, options = {}) {
      const endpoint = options.endpoint || this.defaultEndpoint;
      const apiKey = options.apiKey || "";
      const userParts = [];
      if (options.images?.length) {
        options.images.forEach((img) => {
          userParts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: img.replace(/^data:image\/\w+;base64,/, "")
            }
          });
        });
      }
      userParts.push({ text: prompt });
      return {
        url: `${endpoint}/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          contents: [
            ...options.systemPrompt ? [{
              role: "model",
              parts: [{ text: `System: ${options.systemPrompt}` }]
            }] : [],
            { role: "user", parts: userParts }
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.3,
            maxOutputTokens: options.maxTokens || 4096,
            responseMimeType: options.format === "json" ? "application/json" : "text/plain",
            // Disable thinking tokens for structured JSON output — saves ~60-80% output cost
            thinkingConfig: { thinkingBudget: 0 }
          }
        }
      };
    },
    parseResponse(data) {
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const usage = data.usageMetadata || {};
      const outputTokens = (usage.candidatesTokenCount || 0) + (usage.thoughtsTokenCount || 0);
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.modelVersion || "",
            inputTokens: usage.promptTokenCount || 0,
            outputTokens,
            thinkingTokens: usage.thoughtsTokenCount || 0
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.modelVersion || "",
            inputTokens: usage.promptTokenCount || 0,
            outputTokens,
            thinkingTokens: usage.thoughtsTokenCount || 0
          }
        };
      }
    },
    async fetchModels(endpoint, apiKey) {
      try {
        const res = await fetch(
          `${endpoint || this.defaultEndpoint}/v1beta/models?key=${apiKey}`
        );
        if (!res.ok) return this.models;
        const data = await res.json();
        return (data.models || []).filter((m) => m.name.includes("gemini") && m.supportedGenerationMethods?.includes("generateContent")).map((m) => ({
          id: m.name.replace("models/", ""),
          name: m.displayName || m.name.replace("models/", "")
        }));
      } catch {
        return this.models;
      }
    },
    async ping(endpoint, apiKey) {
      try {
        const res = await fetch(
          `${endpoint || this.defaultEndpoint}/v1beta/models?key=${apiKey}`,
          { signal: AbortSignal.timeout(8e3) }
        );
        return res.ok;
      } catch {
        return false;
      }
    }
  },
  claude: {
    id: "claude",
    name: "Anthropic Claude",
    icon: "\u{1F7E0}",
    authType: "x-api-key",
    defaultEndpoint: "https://api.anthropic.com",
    models: [
      { id: "claude-opus-4-7", name: "Claude Opus 4.7" },
      { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
      { id: "claude-haiku-4-5", name: "Claude Haiku 4.5" },
      { id: "claude-opus-4-6", name: "Claude Opus 4.6" }
    ],
    modelsFetchable: true,
    buildRequest(prompt, model, options = {}) {
      const userContent = [];
      if (options.images?.length) {
        options.images.forEach((img) => {
          userContent.push({
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: img.replace(/^data:image\/\w+;base64,/, "")
            }
          });
        });
      }
      userContent.push({ type: "text", text: prompt });
      return {
        url: `${options.endpoint || this.defaultEndpoint}/v1/messages`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": options.apiKey || "",
          "anthropic-version": "2024-01-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: {
          model,
          max_tokens: options.maxTokens || 2048,
          ...options.systemPrompt ? { system: options.systemPrompt } : {},
          messages: [
            { role: "user", content: options.images?.length ? userContent : prompt }
          ]
        }
      };
    },
    parseResponse(data) {
      const content = data.content?.[0]?.text || "";
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.model || "",
            inputTokens: data.usage?.input_tokens || 0,
            outputTokens: data.usage?.output_tokens || 0
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.model || "",
            inputTokens: data.usage?.input_tokens || 0,
            outputTokens: data.usage?.output_tokens || 0
          }
        };
      }
    },
    async fetchModels(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: {
            "x-api-key": apiKey || "",
            "anthropic-version": "2024-01-01"
          },
          signal: AbortSignal.timeout(8e3)
        });
        if (!res.ok) return this.models;
        const data = await res.json();
        return (data.data || []).filter((m) => m.id.startsWith("claude")).map((m) => ({ id: m.id, name: m.display_name || m.id })).sort((a, b) => a.name.localeCompare(b.name));
      } catch {
        return this.models;
      }
    },
    async ping(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey || "",
            "anthropic-version": "2024-01-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5",
            max_tokens: 1,
            messages: [{ role: "user", content: "Hi" }]
          }),
          signal: AbortSignal.timeout(1e4)
        });
        return res.ok;
      } catch {
        return false;
      }
    }
  }
};
function getProvider(id) {
  return PROVIDERS[id] || PROVIDERS.ollama;
}

// extension/core/ai-client.js
var AIClient = class {
  constructor(endpoint = "http://localhost:11434", options = {}) {
    this.endpoint = endpoint.replace(/\/$/, "");
    this.providerId = options.provider || "ollama";
    this.apiKey = options.apiKey || "";
    this.abortController = null;
    this.provider = getProvider(this.providerId);
  }
  /**
   * Update provider configuration
   */
  setProvider(providerId, apiKey = "", endpoint = "") {
    this.providerId = providerId;
    this.apiKey = apiKey;
    this.provider = getProvider(providerId);
    if (endpoint) {
      this.endpoint = endpoint.replace(/\/$/, "");
    } else {
      this.endpoint = this.provider.defaultEndpoint;
    }
  }
  /**
   * Check if AI server is reachable
   */
  async ping() {
    return this.provider.ping(this.endpoint, this.apiKey);
  }
  /**
   * List all available models
   */
  async listModels() {
    return this.provider.fetchModels(this.endpoint, this.apiKey);
  }
  /**
   * Send a single evaluation prompt and get structured response
   * Retries once on 500 errors
   */
  async evaluate(prompt, options = {}) {
    const {
      model = "gemma4",
      systemPrompt = "",
      temperature = 0.3,
      format = "json",
      maxRetries = 1,
      maxTokens = 4096,
      images = []
    } = options;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      this.abortController = new AbortController();
      try {
        if (attempt > 0) {
          console.log(`[synthux] Retrying AI call (attempt ${attempt + 1})...`);
          await new Promise((r) => setTimeout(r, 3e3));
        }
        const req = this.provider.buildRequest(prompt, model, {
          endpoint: this.endpoint,
          apiKey: this.apiKey,
          systemPrompt,
          temperature,
          format,
          maxTokens,
          images: images.filter(Boolean)
        });
        const response = await fetch(req.url, {
          method: req.method,
          headers: req.headers,
          signal: this.abortController.signal,
          body: JSON.stringify(req.body)
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[synthux] HTTP ${response.status} from ${req.url}:`, errorText.substring(0, 300));
          lastError = new Error(`${this.provider.name} error (${response.status}): ${errorText}`);
          if (response.status >= 500 && attempt < maxRetries) {
            console.warn(`[synthux] ${this.provider.name} 500 error, will retry...`);
            continue;
          }
          if (response.status === 401 || response.status === 403) {
            if (this.providerId === "ollama") {
              return {
                success: false,
                error: 'Ollama is blocking requests from this extension (CORS). Set OLLAMA_ORIGINS="*" and restart Ollama.',
                errorType: "cors"
              };
            }
            return {
              success: false,
              error: `Invalid API key for ${this.provider.name}. Check your settings. (HTTP ${response.status})`
            };
          }
          if (response.status === 429) {
            return {
              success: false,
              error: `Rate limit exceeded for ${this.provider.name}. Try again later.`
            };
          }
          return {
            success: false,
            error: response.status >= 500 ? `${this.provider.name} server error. Try again or restart.` : lastError.message
          };
        }
        const data = await response.json();
        const parsed = this.provider.parseResponse(data);
        return parsed;
      } catch (err) {
        if (err.name === "AbortError") {
          return { success: false, error: "Evaluation cancelled" };
        }
        lastError = err;
        if (attempt < maxRetries) continue;
        return { success: false, error: `AI evaluation failed: ${err.message}` };
      } finally {
        this.abortController = null;
      }
    }
    return { success: false, error: lastError?.message || "Unknown error" };
  }
  /**
   * Stream evaluation response (for progress display)
   * Currently only supported for Ollama
   */
  async *evaluateStream(prompt, options = {}) {
    const {
      model = "gemma4",
      systemPrompt = "",
      temperature = 0.3
    } = options;
    if (this.providerId !== "ollama") {
      const result = await this.evaluate(prompt, options);
      yield {
        token: result.success ? JSON.stringify(result.result) : result.error,
        done: true,
        meta: result.meta || null
      };
      return;
    }
    this.abortController = new AbortController();
    try {
      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: this.abortController.signal,
        body: JSON.stringify({
          model,
          prompt,
          system: systemPrompt,
          stream: true,
          options: {
            temperature,
            num_predict: 2048
          }
        })
      });
      if (!response.ok) {
        throw new Error(`Ollama error (${response.status})`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line);
              yield {
                token: chunk.response || "",
                done: chunk.done || false,
                meta: chunk.done ? {
                  model: chunk.model,
                  totalDuration: chunk.total_duration,
                  evalCount: chunk.eval_count
                } : null
              };
            } catch {
            }
          }
        }
      }
    } finally {
      this.abortController = null;
    }
  }
  /**
   * Cancel any ongoing evaluation
   */
  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
};

// mcp/server.js
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var ROOT_DIR = path.resolve(__dirname, "..");
var RULES_DIR = [
  path.join(__dirname, "rules"),
  path.join(__dirname, "..", "rules"),
  path.join(ROOT_DIR, "extension", "rules"),
  path.join(__dirname, "..", "..", "extension", "rules")
].find((dir) => fs.existsSync(dir)) || path.join(ROOT_DIR, "extension", "rules");
var LOOPBACK_HOST = "127.0.0.1";
var PORT = Number(process.env.SYNTHUX_MCP_PORT || 17483);
var REQUIRED_TOKEN = (process.env.SYNTHUX_MCP_TOKEN || "").trim();
var SERVER_INFO = {
  name: "synthux-mcp",
  version: "2.1.0"
};
var PROTOCOL_VERSION = "2024-11-05";
var localState = {
  customRulePacks: [],
  customProfiles: [],
  lastReport: null,
  reportHistory: [],
  aiSettings: {
    ollamaEndpoint: process.env.OLLAMA_HOST || "http://localhost:11434",
    ollamaModel: process.env.SYNTHUX_MODEL || "gemma4",
    providerId: "ollama",
    apiKey: "",
    rulePackId: "nielsen-10",
    analysisMode: "deep",
    language: "en",
    enableVision: true
  }
};
function loadRulePackFromDisk(rulePackId = "nielsen-10") {
  const custom = localState.customRulePacks.find((p) => p.id === rulePackId);
  if (custom) return custom;
  const builtIn = BUILT_IN_RULE_PACKS.find((p) => p.id === rulePackId) || BUILT_IN_RULE_PACKS[0];
  const filePath = path.join(RULES_DIR, path.basename(builtIn.file));
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return {
    ...raw,
    id: raw.id || builtIn.id,
    shortName: raw.shortName || builtIn.shortName,
    category: raw.category || builtIn.category
  };
}
function isAllowedOrigin(originHeader) {
  if (!originHeader) return true;
  if (originHeader.startsWith("chrome-extension://")) return true;
  return false;
}
function validateSafeHttpUrl(urlStr) {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
var WebSocketConnection = class {
  constructor(socket) {
    this.socket = socket;
    this.isAlive = true;
    this.extensionInfo = null;
    this.authenticated = !REQUIRED_TOKEN;
    this._buffer = Buffer.alloc(0);
    socket.on("data", (chunk) => this._onData(chunk));
    socket.on("close", () => this._onClose());
    socket.on("error", () => this._onClose());
  }
  send(obj) {
    if (this.socket.destroyed) return;
    const payload = Buffer.from(JSON.stringify(obj), "utf8");
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.alloc(2);
      header[0] = 129;
      header[1] = len;
    } else if (len < 65536) {
      header = Buffer.alloc(4);
      header[0] = 129;
      header[1] = 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 129;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    try {
      this.socket.write(Buffer.concat([header, payload]));
    } catch {
    }
  }
  close() {
    if (!this.socket.destroyed) {
      try {
        this.socket.end(Buffer.from([136, 0]));
      } catch {
      }
      this.socket.destroy();
    }
  }
  _onData(chunk) {
    this._buffer = Buffer.concat([this._buffer, chunk]);
    while (this._buffer.length >= 2) {
      const firstByte = this._buffer[0];
      const secondByte = this._buffer[1];
      const opcode = firstByte & 15;
      const isMasked = (secondByte & 128) !== 0;
      let payloadLen = secondByte & 127;
      let offset = 2;
      if (payloadLen === 126) {
        if (this._buffer.length < 4) return;
        payloadLen = this._buffer.readUInt16BE(2);
        offset = 4;
      } else if (payloadLen === 127) {
        if (this._buffer.length < 10) return;
        payloadLen = Number(this._buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const maskKeyLen = isMasked ? 4 : 0;
      const totalFrameLen = offset + maskKeyLen + payloadLen;
      if (this._buffer.length < totalFrameLen) return;
      let payload = this._buffer.subarray(offset + maskKeyLen, totalFrameLen);
      if (isMasked) {
        const maskKey = this._buffer.subarray(offset, offset + 4);
        const unmasked = Buffer.alloc(payloadLen);
        for (let i = 0; i < payloadLen; i++) {
          unmasked[i] = payload[i] ^ maskKey[i % 4];
        }
        payload = unmasked;
      }
      this._buffer = this._buffer.subarray(totalFrameLen);
      if (opcode === 8) {
        this.close();
        return;
      }
      if (opcode === 9) {
        this.socket.write(Buffer.from([138, 0]));
        continue;
      }
      if (opcode === 1) {
        const text = payload.toString("utf8");
        this.onMessage?.(text);
      }
    }
  }
  _onClose() {
    this.onClose?.();
  }
};
var activeExtensionClient = null;
var pendingCommands = /* @__PURE__ */ new Map();
var isProxyMode = false;
function sendExtensionCommand(command, params = {}, timeoutMs = 12e4) {
  if (!activeExtensionClient || !activeExtensionClient.authenticated) {
    return Promise.reject(new Error("Chrome extension is not connected to MCP Bridge. Ensure the synthux extension is loaded in Chrome and MCP Bridge is enabled in Settings."));
  }
  const id = `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingCommands.delete(id);
      reject(new Error(`Extension command "${command}" timed out after ${Math.round(timeoutMs / 1e3)}s.`));
    }, timeoutMs);
    pendingCommands.set(id, { resolve, reject, timer });
    activeExtensionClient.send({
      type: "MCP_COMMAND",
      id,
      command,
      params
    });
  });
}
var MCP_TOOLS = [
  {
    name: "synthux_status",
    description: "Check synthux MCP Server status, Chrome Extension live WebSocket connection, active browser tab, available Sectoral Rule Packs, Personas, and AI provider (Ollama Local LLM / Cloud API) status.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "synthux_open_url",
    description: "Open or navigate a Chrome tab to a target URL and wait for the page to finish loading so synthux can audit it.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Target http:// or https:// URL to open and audit" },
        newTab: { type: "boolean", description: "Open in a new tab instead of reusing active tab (default: false)" },
        active: { type: "boolean", description: "Focus the tab in Chrome (default: true)" }
      },
      required: ["url"]
    }
  },
  {
    name: "synthux_list_tabs",
    description: "List all open web tabs in Chrome with their tabId, title, and URL.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "synthux_scan_page",
    description: "Extract comprehensive DOM structure, headings, landmarks, forms, navigation depth, CTAs, color contrast samples, unlabeled interactive elements, and performance metrics from the active tab or target URL.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Optional URL to navigate to before scanning" },
        tabId: { type: "number", description: "Optional Chrome tab ID (uses active tab if omitted)" },
        includeScreenshot: { type: "boolean", description: "Also capture full-page screenshot (default: false)" }
      }
    }
  },
  {
    name: "synthux_run_wcag_audit",
    description: "Run deterministic accessibility checks (10 rule-based DOM checks) combined with live axe-core WCAG 2.2 AA compliance auditing on the target page.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Optional URL to open before running WCAG 2.2 AA audit" },
        tabId: { type: "number", description: "Optional Chrome tab ID" },
        pageData: { type: "object", description: "Optional pre-extracted pageData for offline/headless testing" }
      }
    }
  },
  {
    name: "synthux_run_ux_audit",
    description: "Run a full autonomous synthux UX audit using the selected Sectoral Rule Pack (nielsen-10, ecommerce, saas, fintech, or custom pack), Synthetic Personas, and AI provider (Local Ollama gemma4/qwen3.8/deepseek-r1 or Cloud Gemini/OpenAI/Claude).",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Optional URL to open and analyze" },
        tabId: { type: "number", description: "Optional Chrome tab ID" },
        rulePackId: {
          type: "string",
          description: 'Rule pack ID: "nielsen-10", "ecommerce", "saas", "fintech", or a custom rule pack ID',
          default: "nielsen-10"
        },
        mode: {
          type: "string",
          enum: ["quick", "deep", "custom"],
          description: 'Analysis depth: "quick" (top 3 rules), "deep" (all rules), or "custom"',
          default: "quick"
        },
        profiles: {
          type: "array",
          items: { type: "string" },
          description: 'Persona IDs: ["first-time", "power-user", "accessibility"] or custom persona IDs'
        },
        heuristics: {
          type: "array",
          items: { type: "string" },
          description: 'Specific heuristic rule IDs when mode is "custom"'
        },
        provider: {
          type: "string",
          enum: ["ollama", "gemini", "openai", "claude"],
          description: "Optional AI provider override"
        },
        model: {
          type: "string",
          description: 'Optional model override (e.g., "gemma4", "qwen3.8", "deepseek-r1", "gemini-2.5-flash")'
        }
      }
    }
  },
  {
    name: "synthux_prepare_external_audit",
    description: "Agent-Brain Mode (Step 1): Scans the page in Chrome, runs axe-core WCAG 2.2 AA checks, captures a screenshot, and builds the exact Sectoral Rule Pack + Persona evaluation prompts so YOU (the connected MCP AI Agent, e.g. Antigravity Gemini 4 Argon, Claude, Cursor, Codex) can evaluate the UX directly without needing a separate LLM call inside the extension.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Optional URL to open and scan" },
        tabId: { type: "number", description: "Optional Chrome tab ID" },
        rulePackId: {
          type: "string",
          description: 'Rule pack ID: "nielsen-10", "ecommerce", "saas", "fintech", or custom pack ID',
          default: "nielsen-10"
        },
        mode: {
          type: "string",
          enum: ["quick", "deep", "custom"],
          default: "quick"
        },
        profiles: {
          type: "array",
          items: { type: "string" },
          description: 'Persona IDs (e.g., ["first-time", "accessibility"])'
        },
        heuristics: {
          type: "array",
          items: { type: "string" }
        },
        includeScreenshot: {
          type: "boolean",
          description: "Include base64 screenshot in response (default: false to save context tokens)"
        },
        pageData: {
          type: "object",
          description: "Optional pre-extracted pageData for offline/headless testing when browser is closed"
        }
      }
    }
  },
  {
    name: "synthux_submit_external_audit",
    description: "Agent-Brain Mode (Step 2): Submit the heuristic evaluations generated by the MCP AI Agent back to synthux. Computes weighted scores, deduplicates issues, renders the live Issue Heatmap on the Chrome tab, captures an Annotated Screenshot with numbered markers, updates the Side Panel UI, and returns the complete Enhanced v2.0 Markdown & JSON Report.",
    inputSchema: {
      type: "object",
      properties: {
        tabId: { type: "number", description: "Optional Chrome tab ID" },
        url: { type: "string", description: "Page URL (used when running in standalone/offline mode)" },
        title: { type: "string", description: "Page title" },
        rulePackId: { type: "string", default: "nielsen-10" },
        mode: { type: "string", default: "quick" },
        model: { type: "string", description: 'Name of the MCP Agent model that performed the evaluation (e.g., "Gemini 4 Argon")' },
        showHeatmap: { type: "boolean", description: "Render live issue heatmap on the Chrome page (default: true)" },
        pageData: { type: "object", description: "Optional pageData for offline report generation" },
        evaluations: {
          type: "array",
          description: "Array of evaluations per profile and heuristic",
          items: {
            type: "object",
            properties: {
              profileId: { type: "string" },
              heuristicId: { type: "string" },
              heuristicName: { type: "string" },
              evaluation: {
                type: "object",
                properties: {
                  score: { type: "number" },
                  summary: { type: "string" },
                  issues: { type: "array", items: { type: "object" } },
                  positives: { type: "array", items: { type: "string" } },
                  score_justification: { type: "string" }
                }
              }
            },
            required: ["profileId", "heuristicId", "evaluation"]
          }
        }
      },
      required: ["evaluations"]
    }
  },
  {
    name: "synthux_run_flow_audit",
    description: "Run a multi-page User Journey Flow Builder analysis across 2 or more URLs. Evaluates navigation consistency, visual coherence, flow progression, and terminology across steps.",
    inputSchema: {
      type: "object",
      properties: {
        pages: {
          type: "array",
          description: "Ordered list of pages in the user journey (minimum 2)",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              url: { type: "string" },
              label: { type: "string" }
            },
            required: ["url"]
          }
        },
        connectors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fromId: { type: "string" },
              toId: { type: "string" }
            }
          }
        },
        notes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              attachedTo: { type: "string" }
            }
          }
        },
        profiles: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["pages"]
    }
  },
  {
    name: "synthux_visual_overlay",
    description: "Control live visual overlays on the active Chrome tab: highlight specific problematic CSS selectors, show/hide the severity Issue Heatmap, clear overlays, or capture an Annotated Visual Audit screenshot.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["highlight", "clear_highlight", "heatmap", "clear_heatmap", "clear_all", "annotated_screenshot", "full_screenshot"],
          description: "Visual overlay action to execute in Chrome"
        },
        tabId: { type: "number" },
        selector: { type: "string", description: 'CSS selector to highlight (when action="highlight")' },
        severity: { type: "string", enum: ["critical", "moderate", "minor"], description: "Highlight color severity" },
        label: { type: "string", description: "Tooltip label for highlighted element" },
        issues: {
          type: "array",
          description: "Issues array with element CSS selectors and severities (for heatmap or annotated_screenshot)",
          items: { type: "object" }
        }
      },
      required: ["action"]
    }
  },
  {
    name: "synthux_manage_rule_packs",
    description: "List built-in Sectoral Rule Packs (nielsen-10, ecommerce, saas, fintech) and custom packs, inspect rules inside a pack, import/validate a new custom JSON rule pack, or delete a custom rule pack.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "save", "delete"],
          default: "list"
        },
        rulePackId: { type: "string", description: 'Rule pack ID for "get" or "delete"' },
        rulePack: {
          type: "object",
          description: 'Custom JSON rule pack object to validate and save (for action="save")'
        }
      }
    }
  },
  {
    name: "synthux_manage_personas",
    description: "List built-in Synthetic User Personas (first-time, power-user, accessibility) and custom personas, create a new custom persona (ageRange, techLevel, disabilities, goal), or delete a custom persona.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "save", "delete"],
          default: "list"
        },
        profileId: { type: "string", description: "Custom persona ID to delete" },
        persona: {
          type: "object",
          description: 'New custom persona definition (for action="save")',
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ageRange: { type: "string", enum: ["18-25", "25-35", "35-50", "50-65", "65+"] },
            techLevel: { type: "string", enum: ["low", "medium", "high"] },
            disabilities: { type: "array", items: { type: "string" } },
            goal: { type: "string" }
          }
        }
      }
    }
  },
  {
    name: "synthux_configure_ai",
    description: "Read or update synthux AI provider configuration (Local Ollama gemma4/qwen3.8/deepseek-r1 or Cloud Gemini/OpenAI/Claude) and test provider connectivity.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["get", "update", "ping"],
          default: "get"
        },
        provider: { type: "string", enum: ["ollama", "gemini", "openai", "claude"] },
        model: { type: "string" },
        endpoint: { type: "string" },
        enableVision: { type: "boolean" },
        rulePackId: { type: "string" },
        analysisMode: { type: "string", enum: ["quick", "deep", "custom"] }
      }
    }
  },
  {
    name: "synthux_get_reports",
    description: "Retrieve the latest UX audit report, list report history, or export a report in Enhanced Markdown v2.0 or JSON format.",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["latest", "history", "by_id"],
          default: "latest"
        },
        id: { type: "string", description: 'Report ID when action="by_id"' },
        format: {
          type: "string",
          enum: ["json", "markdown"],
          default: "markdown"
        }
      }
    }
  }
];
async function executeToolCall(name, args = {}) {
  if (args.url && !validateSafeHttpUrl(args.url)) {
    throw new Error("Security Policy: Only valid http:// and https:// URLs are permitted.");
  }
  const extConnected = !!(activeExtensionClient && activeExtensionClient.authenticated);
  switch (name) {
    case "synthux_status": {
      let extStatus = null;
      if (extConnected) {
        try {
          extStatus = await sendExtensionCommand("PING_EXTENSION", {}, 1e4);
        } catch (err) {
          extStatus = { connected: false, error: err.message };
        }
      }
      const client = new AIClient(localState.aiSettings.ollamaEndpoint, {
        provider: localState.aiSettings.providerId,
        apiKey: localState.aiSettings.apiKey
      });
      let localAiPing = null;
      try {
        localAiPing = await client.ping();
      } catch {
        localAiPing = { status: "offline" };
      }
      return {
        mcpServer: {
          ...SERVER_INFO,
          host: LOOPBACK_HOST,
          port: PORT,
          streamableHttpUrl: `http://${LOOPBACK_HOST}:${PORT}/mcp`,
          wsBridgeUrl: `ws://${LOOPBACK_HOST}:${PORT}/ws`,
          security: {
            loopbackOnly: true,
            originVerification: true,
            tokenAuthEnabled: !!REQUIRED_TOKEN
          }
        },
        chromeExtension: extConnected ? { connected: true, ...extStatus } : {
          connected: false,
          note: "Chrome extension is not currently connected over WebSocket. Offline/standalone engine tools (rule packs, personas, WCAG checks, external audit preparation/submission, report generation, and local AI ping) remain 100% available."
        },
        localAiStatus: localAiPing,
        builtInRulePacks: BUILT_IN_RULE_PACKS.map((p) => ({ id: p.id, name: p.name, ruleCount: p.ruleCount })),
        builtInPersonas: Object.keys(PROFILES)
      };
    }
    case "synthux_open_url": {
      if (!extConnected) {
        throw new Error("Opening a live browser tab requires the synthux Chrome extension to be connected to ws://127.0.0.1:17483/ws.");
      }
      return await sendExtensionCommand("OPEN_AND_WAIT_TAB", args, 25e3);
    }
    case "synthux_list_tabs": {
      if (!extConnected) {
        return {
          success: true,
          extensionConnected: false,
          tabs: [],
          note: "Chrome extension is not connected."
        };
      }
      return await sendExtensionCommand("LIST_TABS", {}, 1e4);
    }
    case "synthux_scan_page": {
      if (extConnected) {
        return await sendExtensionCommand("SCAN_PAGE", args, 3e4);
      }
      throw new Error("Scanning a live browser DOM requires the synthux Chrome extension to be connected, or pass pre-extracted pageData to synthux_run_wcag_audit / synthux_prepare_external_audit.");
    }
    case "synthux_run_wcag_audit": {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand("RUN_WCAG_AUDIT", args, 3e4);
      }
      const pageData = args.pageData || {
        meta: { title: "Sample Page", lang: "en" },
        structure: { headings: [{ level: 1, text: "Main Heading" }], landmarks: [{ role: "main" }], forms: [] },
        navigation: { navCount: 1, skipLinks: true },
        content: { images: [], ctas: [] },
        accessibility: { hasLangAttr: true, contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] }
      };
      const accessibilityResults = runAccessibilityChecks(pageData);
      return {
        success: true,
        mode: "standalone-engine",
        accessibilityResults
      };
    }
    case "synthux_run_ux_audit": {
      if (extConnected) {
        return await sendExtensionCommand("START_ANALYSIS", args, 3e5);
      }
      throw new Error("Live browser autonomous audit requires the Chrome extension connection, or use synthux_prepare_external_audit + synthux_submit_external_audit for Agent-Brain evaluation.");
    }
    case "synthux_prepare_external_audit": {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand("PREPARE_EXTERNAL_AUDIT", args, 45e3);
      }
      const rulePackId = args.rulePackId || "nielsen-10";
      const mode = args.mode || "quick";
      const profileIds = Array.isArray(args.profiles) && args.profiles.length > 0 ? args.profiles : ["first-time", "power-user", "accessibility"];
      const pageData = args.pageData || {
        meta: { title: args.title || "Audited Page", lang: "en", description: "" },
        structure: { headings: [{ level: 1, text: "Welcome" }], landmarks: [{ role: "main" }], forms: [] },
        navigation: { navCount: 1, skipLinks: false, breadcrumb: false },
        content: { textLength: 450, wordCount: 75, images: [], imageCount: 0, imagesWithoutAlt: 0, ctas: ["Get Started"] },
        accessibility: { hasLangAttr: true, ariaRoles: ["main"], contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] },
        performance: { domSize: 120, scriptCount: 2, styleSheetCount: 1 }
      };
      const rules = loadRulePackFromDisk(rulePackId);
      const accessibilityResults = runAccessibilityChecks(pageData);
      const evaluationTasks = [];
      for (const pid of profileIds) {
        const profile = getProfile(pid) || localState.customProfiles.find((p) => p.id === pid);
        if (!profile) continue;
        const selectedRules = args.heuristics && args.heuristics.length > 0 ? (rules.rules || []).filter((r) => args.heuristics.includes(r.id)) : selectHeuristics(rules, mode, pid);
        for (const heuristic of selectedRules) {
          evaluationTasks.push({
            profileId: profile.id,
            profileName: profile.name?.en || profile.name,
            heuristicId: heuristic.id,
            heuristicName: heuristic.name?.en || heuristic.name,
            weight: heuristic.weight || 1,
            prompt: buildPrompt(heuristic, profile, pageData, false)
          });
        }
      }
      return {
        success: true,
        executionMode: "standalone-engine",
        rulePack: {
          id: rules.id || rulePackId,
          name: rules.name,
          shortName: rules.shortName,
          ruleCount: (rules.rules || []).length
        },
        mode,
        profiles: profileIds,
        accessibilityResults,
        evaluationTasks
      };
    }
    case "synthux_submit_external_audit": {
      if (extConnected && !args.pageData) {
        return await sendExtensionCommand("SUBMIT_EXTERNAL_AUDIT", args, 45e3);
      }
      const rulePackId = args.rulePackId || "nielsen-10";
      const mode = args.mode || "quick";
      const rules = loadRulePackFromDisk(rulePackId);
      const pageData = args.pageData || {
        meta: { title: args.title || "Audited Page", lang: "en" },
        structure: { headings: [{ level: 1, text: "Main" }], landmarks: [{ role: "main" }], forms: [] },
        navigation: { navCount: 1, skipLinks: true },
        content: { images: [], ctas: [] },
        accessibility: { hasLangAttr: true, contrastResults: [], tabOrderIssues: [], unlabeledInteractives: [] }
      };
      const accessibilityResults = runAccessibilityChecks(pageData);
      const rawEvaluations = Array.isArray(args.evaluations) ? args.evaluations : [];
      const profileGroups = /* @__PURE__ */ new Map();
      for (const item of rawEvaluations) {
        const pid = item.profileId || "first-time";
        if (!profileGroups.has(pid)) profileGroups.set(pid, []);
        const ruleObj = (rules.rules || []).find((r) => r.id === item.heuristicId) || {
          id: item.heuristicId || "general",
          name: { en: item.heuristicName || item.heuristicId || "General Usability" }
        };
        const parsed = parseEvaluation(item.evaluation || item);
        profileGroups.get(pid).push({
          heuristicId: ruleObj.id,
          heuristicName: ruleObj.name,
          ...parsed
        });
      }
      const profileResults = {};
      for (const [pid, evaluations] of profileGroups.entries()) {
        const profile = getProfile(pid) || localState.customProfiles.find((p) => p.id === pid) || {
          id: pid,
          icon: "\u{1F464}",
          name: { en: pid, tr: pid },
          description: { en: "MCP Persona", tr: "MCP Personas\u0131" }
        };
        const score = calculateOverallScore(evaluations, rules);
        profileResults[pid] = {
          profile: {
            id: profile.id,
            icon: profile.icon || "\u{1F464}",
            name: profile.name,
            description: profile.description,
            custom: profile.custom || false
          },
          score,
          evaluations
        };
      }
      const allScores = Object.values(profileResults).map((r) => r.score);
      const overallScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : accessibilityResults.score;
      const allIssues = [];
      Object.values(profileResults).forEach((pr) => {
        pr.evaluations.forEach((ev) => {
          (ev.issues || []).forEach((issue) => {
            allIssues.push({
              ...issue,
              heuristic: ev.heuristicName?.en || ev.heuristicName,
              profile: pr.profile.name?.en || pr.profile.name,
              profileIcon: pr.profile.icon || "\u{1F464}"
            });
          });
        });
      });
      const report = generateReport({
        url: args.url || "https://synthux.app",
        title: args.title || pageData.meta?.title || "MCP Audited Page",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        model: args.model || "Gemini 4 Argon (MCP Agent)",
        mode,
        provider: "mcp-agent",
        rulePackId: rules.id || rulePackId,
        rulePackName: rules.name,
        rulePackShortName: rules.shortName || "Nielsen 10",
        ruleCount: (rules.rules || []).length,
        overallScore,
        profileResults,
        accessibilityResults,
        issues: allIssues,
        screenshot: null,
        annotatedScreenshot: null,
        costSummary: null
      });
      localState.lastReport = report;
      localState.reportHistory.unshift({
        id: `mcp-${Date.now()}`,
        url: report.url,
        title: report.title,
        score: report.overallScore,
        mode: report.mode,
        model: report.model,
        timestamp: report.timestamp,
        report
      });
      return {
        success: true,
        executionMode: "standalone-engine",
        report
      };
    }
    case "synthux_run_flow_audit": {
      if (extConnected) {
        return await sendExtensionCommand("START_FLOW_ANALYSIS", args, 3e5);
      }
      throw new Error("Multi-page Flow Builder navigation requires the synthux Chrome extension to be connected.");
    }
    case "synthux_visual_overlay": {
      if (extConnected) {
        return await sendExtensionCommand("VISUAL_OVERLAY", args, 2e4);
      }
      throw new Error("Visual overlays (Heatmap, Highlight, Annotated Screenshot) require the live Chrome extension connection.");
    }
    case "synthux_manage_rule_packs": {
      if (extConnected) {
        return await sendExtensionCommand("MANAGE_RULE_PACKS", args, 15e3);
      }
      const action = args.action || "list";
      if (action === "list") {
        return {
          success: true,
          rulePacks: [...BUILT_IN_RULE_PACKS, ...localState.customRulePacks]
        };
      }
      if (action === "get") {
        return {
          success: true,
          rulePack: loadRulePackFromDisk(args.rulePackId || "nielsen-10")
        };
      }
      if (action === "save") {
        const normalized = validateAndNormalizeRulePack(args.rulePack);
        const idx = localState.customRulePacks.findIndex((p) => p.id === normalized.id);
        if (idx >= 0) localState.customRulePacks[idx] = normalized;
        else localState.customRulePacks.push(normalized);
        return { success: true, rulePack: normalized };
      }
      if (action === "delete") {
        localState.customRulePacks = localState.customRulePacks.filter((p) => p.id !== args.rulePackId);
        return { success: true, customRulePacks: localState.customRulePacks };
      }
      throw new Error(`Unknown rule pack action: ${action}`);
    }
    case "synthux_manage_personas": {
      if (extConnected) {
        return await sendExtensionCommand("MANAGE_PERSONAS", args, 15e3);
      }
      const action = args.action || "list";
      if (action === "list") {
        return {
          success: true,
          profiles: [...Object.values(PROFILES), ...localState.customProfiles]
        };
      }
      if (action === "save") {
        const p = args.persona || {};
        if (!p.name) throw new Error("Persona name is required.");
        const newProfile = {
          id: `custom-${Date.now()}`,
          icon: "\u{1F464}",
          custom: true,
          name: { en: p.name, tr: p.name },
          description: { en: p.description || "", tr: p.description || "" },
          ageRange: p.ageRange || "25-35",
          techLevel: p.techLevel || "medium",
          disabilities: p.disabilities || [],
          goal: p.goal || "",
          weight: 1,
          systemPrompt: buildCustomSystemPrompt(p)
        };
        localState.customProfiles.push(newProfile);
        return { success: true, profile: newProfile };
      }
      if (action === "delete") {
        localState.customProfiles = localState.customProfiles.filter((p) => p.id !== args.profileId);
        return { success: true, customProfiles: localState.customProfiles };
      }
      throw new Error(`Unknown persona action: ${action}`);
    }
    case "synthux_configure_ai": {
      if (extConnected) {
        return await sendExtensionCommand("CONFIGURE_AI", args, 15e3);
      }
      if (args.action === "update") {
        if (args.provider) localState.aiSettings.providerId = args.provider;
        if (args.model) localState.aiSettings.ollamaModel = args.model;
        if (args.endpoint) localState.aiSettings.ollamaEndpoint = args.endpoint;
        if (typeof args.enableVision === "boolean") localState.aiSettings.enableVision = args.enableVision;
        if (args.rulePackId) localState.aiSettings.rulePackId = args.rulePackId;
        if (args.analysisMode) localState.aiSettings.analysisMode = args.analysisMode;
      }
      const client = new AIClient(localState.aiSettings.ollamaEndpoint, {
        provider: localState.aiSettings.providerId,
        apiKey: localState.aiSettings.apiKey
      });
      const pingResult = await client.ping();
      const models = await client.listModels();
      return {
        success: true,
        settings: {
          ...localState.aiSettings,
          apiKey: localState.aiSettings.apiKey ? "***configured***" : ""
        },
        connectionStatus: {
          ping: pingResult,
          models
        }
      };
    }
    case "synthux_get_reports": {
      if (extConnected) {
        return await sendExtensionCommand("GET_REPORTS", args, 15e3);
      }
      const action = args.action || "latest";
      if (action === "history") {
        return {
          success: true,
          history: localState.reportHistory.map((r) => ({
            id: r.id,
            url: r.url,
            title: r.title,
            score: r.score,
            mode: r.mode,
            model: r.model,
            timestamp: r.timestamp
          }))
        };
      }
      if (action === "by_id" && args.id) {
        const entry = localState.reportHistory.find((r) => r.id === args.id);
        if (!entry) throw new Error(`Report ${args.id} not found.`);
        return {
          success: true,
          report: args.format === "markdown" ? entry.report.markdown : entry.report
        };
      }
      if (!localState.lastReport) {
        return { error: "No report generated yet in this session." };
      }
      return {
        success: true,
        report: args.format === "markdown" ? localState.lastReport.markdown : localState.lastReport
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
async function handleJsonRpcMessage(msg) {
  if (!msg || typeof msg !== "object") return null;
  if (isProxyMode && (msg.method === "tools/call" || msg.method === "resources/read")) {
    try {
      const res = await fetch(`http://${LOOPBACK_HOST}:${PORT}/mcp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...REQUIRED_TOKEN ? { "x-synthux-token": REQUIRED_TOKEN } : {}
        },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      isProxyMode = false;
    }
  }
  const { id, method, params } = msg;
  if (id === void 0 || id === null) {
    return null;
  }
  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
            capabilities: {
              tools: { listChanged: false },
              resources: { listChanged: false },
              prompts: { listChanged: false }
            },
            serverInfo: SERVER_INFO
          }
        };
      case "ping":
        return {
          jsonrpc: "2.0",
          id,
          result: {}
        };
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: MCP_TOOLS
          }
        };
      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        const output = await executeToolCall(toolName, toolArgs);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: typeof output === "string" ? output : JSON.stringify(output, null, 2)
              }
            ],
            isError: !!output?.error
          }
        };
      }
      case "resources/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            resources: BUILT_IN_RULE_PACKS.map((pack) => ({
              uri: `synthux://rules/${pack.id}`,
              name: pack.name,
              description: pack.description,
              mimeType: "application/json"
            }))
          }
        };
      case "resources/read": {
        const uri = String(params?.uri || "");
        const match = uri.match(/^synthux:\/\/rules\/(.+)$/);
        const packId = match ? match[1] : "nielsen-10";
        const data = loadRulePackFromDisk(packId);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        };
      }
      case "prompts/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            prompts: [
              {
                name: "audit_website_ux",
                description: "Run a complete end-to-end UX & WCAG 2.2 AA audit on a target URL using synthux",
                arguments: [
                  { name: "url", description: "Website URL to audit", required: true },
                  { name: "rulePackId", description: "Rule pack (nielsen-10, ecommerce, saas, fintech)", required: false }
                ]
              }
            ]
          }
        };
      case "prompts/get": {
        const url = params?.arguments?.url || "https://example.com";
        const rulePackId = params?.arguments?.rulePackId || "nielsen-10";
        return {
          jsonrpc: "2.0",
          id,
          result: {
            description: `Audit ${url} with synthux (${rulePackId})`,
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: `Please audit ${url} using the synthux MCP tools with rulePackId="${rulePackId}". First call synthux_prepare_external_audit (or synthux_run_ux_audit), evaluate the heuristics, and then submit the findings via synthux_submit_external_audit to generate the live heatmap and Enhanced v2.0 UX Audit Report.`
                }
              }
            ]
          }
        };
      }
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        };
    }
  } catch (err) {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: err.message || String(err) }, null, 2)
          }
        ],
        isError: true
      }
    };
  }
}
async function handleHttpRequest(req, res) {
  const origin = req.headers?.origin;
  if (!isAllowedOrigin(origin)) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden: Web origins are blocked by synthux security policy." }));
    return;
  }
  if (REQUIRED_TOKEN) {
    const headerToken = req.headers["x-synthux-token"] || (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (headerToken !== REQUIRED_TOKEN) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized: Invalid SYNTHUX_MCP_TOKEN." }));
      return;
    }
  }
  const url = new URL(req.url || "/", `http://${LOOPBACK_HOST}:${PORT}`);
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      server: SERVER_INFO,
      extensionConnected: !!(activeExtensionClient && activeExtensionClient.authenticated)
    }));
    return;
  }
  if (url.pathname === "/mcp") {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString("utf8");
        if (body.length > 25 * 1024 * 1024) req.destroy?.();
      });
      req.on("end", async () => {
        try {
          const parsed = JSON.parse(body);
          if (Array.isArray(parsed)) {
            const responses = (await Promise.all(parsed.map((m) => handleJsonRpcMessage(m)))).filter(Boolean);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(responses));
          } else {
            const response = await handleJsonRpcMessage(parsed);
            if (!response) {
              res.writeHead(202);
              res.end();
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response));
            }
          }
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: `Parse error: ${err.message}` }
          }));
        }
      });
      return;
    }
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        transport: "streamable-http",
        endpoint: `http://${LOOPBACK_HOST}:${PORT}/mcp`,
        extensionConnected: !!(activeExtensionClient && activeExtensionClient.authenticated)
      }));
      return;
    }
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
}
function handleWebSocketUpgrade(req, socket) {
  const origin = req.headers?.origin;
  if (!isAllowedOrigin(origin)) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }
  const key = req.headers?.["sec-websocket-key"];
  if (!key) {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
    socket.destroy();
    return;
  }
  const acceptKey = crypto.createHash("sha1").update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
  socket.write(
    `HTTP/1.1 101 Switching Protocols\r
Upgrade: websocket\r
Connection: Upgrade\r
Sec-WebSocket-Accept: ${acceptKey}\r
\r
`
  );
  const wsClient = new WebSocketConnection(socket);
  activeExtensionClient = wsClient;
  wsClient.onMessage = (rawText) => {
    try {
      const msg = JSON.parse(rawText);
      if (msg.type === "PING") {
        wsClient.send({ type: "PONG", timestamp: Date.now() });
        return;
      }
      if (msg.type === "EXTENSION_HELLO") {
        if (REQUIRED_TOKEN && msg.token !== REQUIRED_TOKEN) {
          wsClient.authenticated = false;
          wsClient.close();
          return;
        }
        wsClient.authenticated = true;
        wsClient.extensionInfo = {
          version: msg.version,
          extensionId: msg.extensionId,
          connectedAt: msg.timestamp || (/* @__PURE__ */ new Date()).toISOString()
        };
        return;
      }
      if (msg.type === "MCP_RESPONSE" && msg.id) {
        const pending = pendingCommands.get(msg.id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingCommands.delete(msg.id);
          pending.resolve(msg.result);
        }
      }
    } catch {
    }
  };
  wsClient.onClose = () => {
    if (activeExtensionClient === wsClient) {
      activeExtensionClient = null;
    }
  };
}
function startBridgeServer(listenOptions = { port: PORT, host: LOOPBACK_HOST }) {
  const server = http.createServer(handleHttpRequest);
  server.on("upgrade", handleWebSocketUpgrade);
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      isProxyMode = true;
    } else if (err.code === "EPERM" || err.code === "EACCES") {
    }
  });
  try {
    if (listenOptions.socketPath) {
      server.listen(listenOptions.socketPath);
    } else {
      server.listen(listenOptions.port ?? PORT, listenOptions.host ?? LOOPBACK_HOST);
    }
  } catch {
  }
  return server;
}
function startStdioTransport() {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
  });
  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const msg = JSON.parse(trimmed);
      const response = await handleJsonRpcMessage(msg);
      if (response) {
        process.stdout.write(JSON.stringify(response) + "\n");
      }
    } catch (err) {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: `Parse error: ${err.message}` }
      }) + "\n");
    }
  });
}
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("synthux-mcp") || process.argv[1]?.endsWith("server.js")) {
  startBridgeServer();
  startStdioTransport();
}
export {
  MCP_TOOLS,
  executeToolCall,
  handleHttpRequest,
  handleJsonRpcMessage,
  handleWebSocketUpgrade,
  startBridgeServer
};
