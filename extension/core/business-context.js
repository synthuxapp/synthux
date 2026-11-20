/**
 * synthux — Business, Product, Must-Haves & Department Context Engine (v2.2.0)
 *
 * Provides:
 * 1. Opt-in Company / Product Context profiles (Primary Goal, Value Prop, Must-Haves, Marketing/Usage Metrics)
 * 2. 5 Built-in Department Lenses + user-defined Custom Departments
 * 3. Prompt builders & structured parsers for Single-Page and Multi-Page Flow analysis
 * 4. Interactive MCP Discovery Questions generator (for AI agents to interview the user)
 * 5. Before vs After Report Comparison (Audit Diff) engine & AI Fix Prompt generator
 */

export const BUILT_IN_DEPARTMENTS = [
  {
    id: 'product-ux',
    name: { en: 'Product & UX Design', tr: 'Ürün & UX Tasarım' },
    icon: '',
    focus: 'Task completion speed, cognitive load, information hierarchy, interaction feedback, and design system consistency.',
    defaultCriteria: 'Minimize friction on primary user flows, keep visual hierarchy clear, and provide immediate state feedback.'
  },
  {
    id: 'marketing-cro',
    name: { en: 'Marketing & Growth (CRO)', tr: 'Pazarlama & Büyüme (CRO)' },
    icon: '',
    focus: 'Value proposition clarity within 5 seconds, CTA prominence, social proof, trust signals, and bounce/drop-off prevention.',
    defaultCriteria: 'Ensure above-the-fold headline communicates clear value, primary CTA stands out, and conversion barriers are eliminated.'
  },
  {
    id: 'sales-revenue',
    name: { en: 'Sales & Revenue', tr: 'Satış & Gelir' },
    icon: '',
    focus: 'Lead capture / checkout friction, pricing & package transparency, enterprise trust indicators, and objection handling.',
    defaultCriteria: 'Reduce form fields to essential inputs, clarify pricing/tier differences, and surface risk-reversal guarantees.'
  },
  {
    id: 'legal-compliance',
    name: { en: 'Legal, Privacy & Compliance', tr: 'Hukuk, Gizlilik & Uyumluluk' },
    icon: '',
    focus: 'GDPR/KVKK/CCPA consent clarity, transparent terms/fees disclosure, accessibility compliance (WCAG 2.2 AA / EAA), and zero dark patterns.',
    defaultCriteria: 'Ensure mandatory disclosures, privacy links, consent checkboxes, and accessible controls are clearly visible and unambiguous.'
  },
  {
    id: 'engineering-qa',
    name: { en: 'Engineering & Frontend QA', tr: 'Yazılım & Frontend QA' },
    icon: '',
    focus: 'Semantic HTML landmarks, form validation states, responsive layout resilience, DOM complexity, and ARIA correctness.',
    defaultCriteria: 'Verify all interactive controls have accessible names, forms have explicit validation states, and DOM selectors are clean.'
  }
];

const STORAGE_KEY = 'synthux_business_context_state';
const MAX_CONTEXT_PROFILES = 15;
const MAX_CUSTOM_DEPARTMENTS = 20;

export const DEFAULT_BUSINESS_STATE = {
  enabled: false,
  activeContextId: 'default-context',
  customDepartments: [],
  contexts: [
    {
      id: 'default-context',
      name: 'Default Product Context',
      companyName: '',
      productName: '',
      industry: 'SaaS / Web Application',
      primaryGoal: '',
      valueProposition: '',
      targetAudience: '',
      mustHaves: [],
      metrics: [],
      departments: ['product-ux', 'marketing-cro'],
      departmentNotes: {},
      updatedAt: new Date().toISOString()
    }
  ]
};

// ─── Normalization & Validation ──────────────────────────────────────────────

export function normalizeDepartment(raw = {}, index = 0) {
  const nameStr = typeof raw.name === 'object' && raw.name !== null
    ? String(raw.name.en || raw.name.tr || `Department ${index + 1}`).trim()
    : String(raw.name || `Department ${index + 1}`).trim();
  const nameTr = typeof raw.name === 'object' && raw.name !== null
    ? String(raw.name.tr || nameStr).trim()
    : nameStr;

  const id = String(raw.id || nameStr)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || `custom-dept-${Date.now()}`;

  return {
    id,
    name: { en: nameStr, tr: nameTr },
    icon: '',
    focus: String(raw.focus || raw.criteria || raw.description || nameStr).trim(),
    defaultCriteria: String(raw.defaultCriteria || raw.criteria || raw.focus || '').trim(),
    isCustom: true
  };
}

export function normalizeBusinessContext(raw = {}) {
  const companyName = String(raw.companyName || '').trim();
  const productName = String(raw.productName || '').trim();
  const name = String(
    raw.name ||
    [companyName, productName].filter(Boolean).join(' — ') ||
    'Product Context'
  ).trim();

  const id = String(raw.id || name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || `ctx-${Date.now()}`;

  const mustHaves = Array.isArray(raw.mustHaves)
    ? raw.mustHaves.map(item => String(item || '').trim()).filter(Boolean)
    : typeof raw.mustHaves === 'string'
      ? raw.mustHaves.split(/\n|;/).map(s => s.trim()).filter(Boolean)
      : [];

  const metrics = Array.isArray(raw.metrics)
    ? raw.metrics
        .map(m => {
          if (typeof m === 'string') return m.trim();
          if (m && typeof m === 'object') {
            const label = String(m.name || m.label || m.metric || '').trim();
            const val = String(m.value || '').trim();
            const target = m.target ? ` (Target: ${m.target})` : '';
            return [label, val].filter(Boolean).join(': ') + target;
          }
          return '';
        })
        .filter(Boolean)
    : typeof raw.metrics === 'string'
      ? raw.metrics.split(/\n|;/).map(s => s.trim()).filter(Boolean)
      : [];

  const departments = Array.isArray(raw.departments) && raw.departments.length > 0
    ? raw.departments.map(d => String(d).trim()).filter(Boolean)
    : ['product-ux', 'marketing-cro'];

  const departmentNotes = (raw.departmentNotes && typeof raw.departmentNotes === 'object')
    ? raw.departmentNotes
    : {};

  return {
    id,
    name,
    companyName,
    productName,
    industry: String(raw.industry || 'General Web / Digital Product').trim(),
    primaryGoal: String(raw.primaryGoal || '').trim(),
    valueProposition: String(raw.valueProposition || '').trim(),
    targetAudience: String(raw.targetAudience || '').trim(),
    mustHaves,
    metrics,
    departments,
    departmentNotes,
    updatedAt: new Date().toISOString()
  };
}

// ─── Storage Helpers (Chrome Storage + Fallback) ─────────────────────────────

let memoryFallbackState = structuredClone(DEFAULT_BUSINESS_STATE);

export async function getBusinessContextState() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const data = await chrome.storage.local.get(STORAGE_KEY);
      if (data?.[STORAGE_KEY] && typeof data[STORAGE_KEY] === 'object') {
        const st = data[STORAGE_KEY];
        return {
          enabled: Boolean(st.enabled),
          activeContextId: st.activeContextId || st.contexts?.[0]?.id || 'default-context',
          customDepartments: Array.isArray(st.customDepartments) ? st.customDepartments : [],
          contexts: Array.isArray(st.contexts) && st.contexts.length > 0
            ? st.contexts.map(normalizeBusinessContext)
            : structuredClone(DEFAULT_BUSINESS_STATE.contexts)
        };
      }
    }
  } catch {
    // Fallback to in-memory state (Node.js MCP standalone)
  }
  return structuredClone(memoryFallbackState);
}

export async function saveBusinessContextState(nextState) {
  const cleanState = {
    enabled: Boolean(nextState.enabled),
    activeContextId: nextState.activeContextId || nextState.contexts?.[0]?.id || 'default-context',
    customDepartments: Array.isArray(nextState.customDepartments)
      ? nextState.customDepartments.slice(0, MAX_CUSTOM_DEPARTMENTS)
      : [],
    contexts: Array.isArray(nextState.contexts) && nextState.contexts.length > 0
      ? nextState.contexts.slice(0, MAX_CONTEXT_PROFILES).map(normalizeBusinessContext)
      : structuredClone(DEFAULT_BUSINESS_STATE.contexts)
  };

  memoryFallbackState = structuredClone(cleanState);

  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: cleanState });
    }
  } catch {
    // Node.js fallback
  }
  return cleanState;
}

export async function getAllDepartments() {
  const state = await getBusinessContextState();
  return [...BUILT_IN_DEPARTMENTS, ...(state.customDepartments || [])];
}

export async function getActiveBusinessContext() {
  const state = await getBusinessContextState();
  if (!state.enabled) return null;
  const active = state.contexts.find(c => c.id === state.activeContextId) || state.contexts[0] || null;
  if (!active) return null;
  const allDepts = [...BUILT_IN_DEPARTMENTS, ...(state.customDepartments || [])];
  const resolvedDepartments = (active.departments || [])
    .map(id => {
      const dept = allDepts.find(d => d.id === id);
      if (!dept) return null;
      return {
        ...dept,
        customCriteria: active.departmentNotes?.[id] || dept.defaultCriteria || dept.focus
      };
    })
    .filter(Boolean);

  return {
    ...active,
    enabled: true,
    resolvedDepartments
  };
}

export async function upsertBusinessContextProfile(rawProfile, options = {}) {
  const state = await getBusinessContextState();
  const normalized = normalizeBusinessContext(rawProfile);
  const idx = state.contexts.findIndex(c => c.id === normalized.id);
  if (idx >= 0) {
    state.contexts[idx] = normalized;
  } else {
    state.contexts.unshift(normalized);
  }
  if (options.setActive !== false) {
    state.activeContextId = normalized.id;
  }
  if (typeof options.enabled === 'boolean') {
    state.enabled = options.enabled;
  }
  await saveBusinessContextState(state);
  return { state, profile: normalized };
}

export async function deleteBusinessContextProfile(contextId) {
  const state = await getBusinessContextState();
  state.contexts = state.contexts.filter(c => c.id !== contextId);
  if (state.contexts.length === 0) {
    state.contexts = structuredClone(DEFAULT_BUSINESS_STATE.contexts);
  }
  if (!state.contexts.some(c => c.id === state.activeContextId)) {
    state.activeContextId = state.contexts[0].id;
  }
  return await saveBusinessContextState(state);
}

export async function upsertCustomDepartment(rawDept) {
  const state = await getBusinessContextState();
  const normalized = normalizeDepartment(rawDept, state.customDepartments.length);
  const builtInIds = new Set(BUILT_IN_DEPARTMENTS.map(d => d.id));
  if (builtInIds.has(normalized.id)) {
    normalized.id = `custom-${normalized.id}`;
  }
  const idx = state.customDepartments.findIndex(d => d.id === normalized.id);
  if (idx >= 0) {
    state.customDepartments[idx] = normalized;
  } else {
    state.customDepartments.push(normalized);
  }
  await saveBusinessContextState(state);
  return { state, department: normalized };
}

export async function deleteCustomDepartment(deptId) {
  const state = await getBusinessContextState();
  state.customDepartments = state.customDepartments.filter(d => d.id !== deptId);
  state.contexts = state.contexts.map(ctx => ({
    ...ctx,
    departments: (ctx.departments || []).filter(id => id !== deptId)
  }));
  return await saveBusinessContextState(state);
}

// ─── Prompt Builders & Evaluation Logic ──────────────────────────────────────

/**
 * Format Business Context block to inject into heuristic or flow prompts
 */
export function buildBusinessContextPromptBlock(businessContext, allDepartments = BUILT_IN_DEPARTMENTS) {
  if (!businessContext || businessContext.enabled === false) return '';

  const companyLine = [businessContext.companyName, businessContext.productName]
    .filter(Boolean)
    .join(' / ');

  const depts = (businessContext.resolvedDepartments || []).length > 0
    ? businessContext.resolvedDepartments
    : (businessContext.departments || [])
        .map(id => allDepartments.find(d => d.id === id))
        .filter(Boolean);

  const lines = [
    '',
    '## 🏢 Company, Product & Goal Context (ACTIVE — Must Factor Into Evaluation)',
    companyLine ? `- **Company / Product:** ${companyLine} (${businessContext.industry || 'Digital Product'})` : `- **Industry:** ${businessContext.industry || 'Digital Product'}`,
    businessContext.primaryGoal ? `- **Primary Page / Flow Goal:** ${businessContext.primaryGoal}` : '',
    businessContext.valueProposition ? `- **Core Value Proposition:** ${businessContext.valueProposition}` : '',
    businessContext.targetAudience ? `- **Target Audience:** ${businessContext.targetAudience}` : ''
  ].filter(Boolean);

  if (Array.isArray(businessContext.mustHaves) && businessContext.mustHaves.length > 0) {
    lines.push('- **Non-Negotiable Must-Haves (Check if present, clear, and effective on the page):**');
    businessContext.mustHaves.forEach((item, i) => {
      lines.push(`  ${i + 1}. ${item}`);
    });
  }

  if (Array.isArray(businessContext.metrics) && businessContext.metrics.length > 0) {
    lines.push('- **Current Marketing & Usage Metrics / Bottlenecks (Diagnose UX root causes for these):**');
    businessContext.metrics.forEach(m => {
      lines.push(`  - ${m}`);
    });
  }

  if (depts.length > 0) {
    lines.push('- **Active Department Lenses:**');
    depts.forEach(d => {
      const dName = d.name?.en || d.name || d.id;
      const note = businessContext.departmentNotes?.[d.id] || d.customCriteria || d.defaultCriteria || d.focus;
      lines.push(`  - **${d.icon || '🏛️'} ${dName}:** ${note}`);
    });
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Build a dedicated single-pass prompt to evaluate Business Goal Alignment,
 * Must-Haves compliance, Metric Root Causes, and Department Findings.
 */
export function buildBusinessAlignmentPrompt(businessContext, pageSummary, allDepartments = BUILT_IN_DEPARTMENTS) {
  const ctxBlock = buildBusinessContextPromptBlock(businessContext, allDepartments);
  const depts = (businessContext.resolvedDepartments || []).length > 0
    ? businessContext.resolvedDepartments
    : (businessContext.departments || [])
        .map(id => allDepartments.find(d => d.id === id))
        .filter(Boolean);

  return `You are a Principal Product, CRO, and UX Strategist. Evaluate the following web page against the company's specific business goals, non-negotiable must-haves, marketing/usage metrics, and department perspectives.
${ctxBlock}
## Extracted Page Data
${pageSummary}

## STRICT JSON Response Rules
Respond ONLY with a valid JSON object matching this exact schema (no markdown fences, no comments):
{
  "goalAlignmentScore": 78,
  "goalSummary": "1-2 sentence assessment of how effectively the page achieves its primary business goal and value proposition.",
  "mustHavesAudit": [
    {
      "item": "Exact must-have requirement text",
      "status": "pass|partial|missing",
      "evidence": "What was found or missing in the DOM/visual layout",
      "recommendation": "Concrete fix if partial or missing"
    }
  ],
  "metricInsights": [
    {
      "metric": "The metric or bottleneck provided (e.g. Bounce rate 68%)",
      "rootCause": "Likely UX/DOM cause observed on this page",
      "action": "High-impact change to improve this metric"
    }
  ],
  "departmentFindings": [
    ${depts.map(d => `{
      "departmentId": "${d.id}",
      "departmentName": "${d.name?.en || d.name || d.id}",
      "icon": "${d.icon || '🏛️'}",
      "score": 75,
      "summary": "Key takeaway for ${d.name?.en || d.id}",
      "actionItems": ["Concrete action item 1", "Concrete action item 2"]
    }`).join(',\n    ')}
  ]
}`;
}

/**
 * Deterministic + AI fallback parser for Business Alignment evaluation
 * If AI response is unavailable or running in fast deterministic mode, synthesizes a baseline check from DOM data.
 */
export function buildDeterministicBusinessAlignment(businessContext, pageData = {}, allDepartments = BUILT_IN_DEPARTMENTS) {
  if (!businessContext) return null;

  const bodyText = JSON.stringify({
    title: pageData.meta?.title || '',
    description: pageData.meta?.description || '',
    headings: (pageData.structure?.headings || []).map(h => h.text),
    ctas: pageData.content?.ctas || [],
    forms: pageData.structure?.forms || []
  }).toLowerCase();

  const mustHavesAudit = (businessContext.mustHaves || []).map(item => {
    const keywords = item
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöç\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const matchedCount = keywords.filter(kw => bodyText.includes(kw)).length;
    const ratio = keywords.length > 0 ? matchedCount / keywords.length : 0.5;
    const status = ratio >= 0.6 ? 'pass' : ratio > 0 ? 'partial' : 'missing';

    return {
      item,
      status,
      evidence: status === 'pass'
        ? 'Matching content/CTA elements detected in page DOM.'
        : status === 'partial'
          ? 'Partially referenced in DOM; prominence or explicit copy may need strengthening.'
          : 'Not clearly detected in primary headings, CTAs, or form labels.',
      recommendation: status === 'pass'
        ? 'Maintain visibility across desktop and mobile viewports.'
        : `Explicitly surface "${item}" near the primary conversion area.`
    };
  });

  const passCount = mustHavesAudit.filter(m => m.status === 'pass').length;
  const partialCount = mustHavesAudit.filter(m => m.status === 'partial').length;
  const totalMust = mustHavesAudit.length;
  const goalAlignmentScore = totalMust > 0
    ? Math.round(((passCount + partialCount * 0.5) / totalMust) * 100)
    : (pageData.content?.ctas?.length > 0 ? 78 : 62);

  const metricInsights = (businessContext.metrics || []).map(metric => ({
    metric,
    rootCause: (pageData.content?.ctas?.length || 0) === 0
      ? 'Low CTA prominence and unclear primary conversion path in initial viewport.'
      : (pageData.structure?.forms?.[0]?.fields?.length || 0) > 5
        ? `High form field count (${pageData.structure.forms[0].fields.length} fields) creating completion friction.`
        : 'Information density and hierarchy between headline, trust signals, and primary CTA.',
    action: `Align primary CTA and above-the-fold copy directly with goal: "${businessContext.primaryGoal || 'conversion'}".`
  }));

  const depts = (businessContext.resolvedDepartments || []).length > 0
    ? businessContext.resolvedDepartments
    : (businessContext.departments || [])
        .map(id => allDepartments.find(d => d.id === id))
        .filter(Boolean);

  const departmentFindings = depts.map(d => ({
    departmentId: d.id,
    departmentName: d.name?.en || d.name || d.id,
    icon: '',
    score: goalAlignmentScore,
    summary: businessContext.departmentNotes?.[d.id] || d.defaultCriteria || d.focus,
    actionItems: [
      `Verify page satisfies ${d.name?.en || d.id} focus: ${d.focus}`,
      ...(mustHavesAudit.filter(m => m.status !== 'pass').slice(0, 2).map(m => m.recommendation))
    ]
  }));

  return {
    contextName: businessContext.name,
    companyName: businessContext.companyName,
    productName: businessContext.productName,
    industry: businessContext.industry,
    primaryGoal: businessContext.primaryGoal,
    valueProposition: businessContext.valueProposition,
    goalAlignmentScore,
    goalSummary: businessContext.primaryGoal
      ? `Evaluated against primary goal: "${businessContext.primaryGoal}". ${passCount}/${totalMust} non-negotiable must-haves verified.`
      : `Evaluated with ${businessContext.name} context across ${departmentFindings.length} department lens(es).`,
    mustHavesAudit,
    metricInsights,
    departmentFindings
  };
}

/**
 * Parse AI JSON output for Business Alignment and merge with fallback
 */
export function parseBusinessAlignmentResponse(rawResponse, businessContext, pageData, allDepartments = BUILT_IN_DEPARTMENTS) {
  const fallback = buildDeterministicBusinessAlignment(businessContext, pageData, allDepartments);
  if (!rawResponse) return fallback;

  try {
    let text = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse);
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(text);

    return {
      ...fallback,
      goalAlignmentScore: Number.isFinite(Number(parsed.goalAlignmentScore))
        ? Math.max(0, Math.min(100, Math.round(Number(parsed.goalAlignmentScore))))
        : fallback.goalAlignmentScore,
      goalSummary: String(parsed.goalSummary || fallback.goalSummary).trim(),
      mustHavesAudit: Array.isArray(parsed.mustHavesAudit) && parsed.mustHavesAudit.length > 0
        ? parsed.mustHavesAudit.map(m => ({
            item: String(m.item || '').trim(),
            status: ['pass', 'partial', 'missing'].includes(String(m.status).toLowerCase())
              ? String(m.status).toLowerCase()
              : 'partial',
            evidence: String(m.evidence || '').trim(),
            recommendation: String(m.recommendation || '').trim()
          }))
        : fallback.mustHavesAudit,
      metricInsights: Array.isArray(parsed.metricInsights) && parsed.metricInsights.length > 0
        ? parsed.metricInsights.map(mi => ({
            metric: String(mi.metric || '').trim(),
            rootCause: String(mi.rootCause || mi.likelyUxCause || '').trim(),
            action: String(mi.action || mi.recommendation || '').trim()
          }))
        : fallback.metricInsights,
      departmentFindings: Array.isArray(parsed.departmentFindings) && parsed.departmentFindings.length > 0
        ? parsed.departmentFindings.map(df => ({
            departmentId: String(df.departmentId || 'dept').trim(),
            departmentName: String(df.departmentName || df.departmentId || 'Department').trim(),
            icon: '',
            score: Number.isFinite(Number(df.score)) ? Math.max(0, Math.min(100, Math.round(Number(df.score)))) : fallback.goalAlignmentScore,
            summary: String(df.summary || '').trim(),
            actionItems: Array.isArray(df.actionItems) ? df.actionItems.map(a => String(a).trim()).filter(Boolean) : []
          }))
        : fallback.departmentFindings
    };
  } catch {
    return fallback;
  }
}

// ─── Interactive Discovery Questions for MCP AI Agents ───────────────────────

/**
 * Generates contextual discovery questions for an MCP AI agent to ask the user
 * before running a business-context-aware UX or Flow audit.
 */
export function generateDiscoveryQuestions({ url = '', title = '', pageData = null, flowPages = null, currentContext = null } = {}) {
  const isFlow = Array.isArray(flowPages) && flowPages.length > 1;
  const detectedCtas = pageData?.content?.ctas?.slice(0, 4)?.join(', ') || '';
  const detectedForms = pageData?.structure?.forms?.length || 0;

  return {
    contextStatus: currentContext?.enabled ? 'configured_and_enabled' : 'not_configured_or_disabled',
    targetSummary: isFlow
      ? `Multi-page flow (${flowPages.length} pages: ${flowPages.map(p => p.label || p.url).join(' → ')})`
      : `${title || 'Web Page'} (${url || 'active tab'})`,
    agentInstruction: 'Ask the user these concise questions to capture their company/product context, non-negotiable must-haves, department priorities, and metrics. Once the user replies, call synthux_manage_business_context with action="save" and enabled=true.',
    questions: [
      {
        id: 'company_and_goal',
        questionTr: `1. Firma / Ürün ve Birincil Hedef: Bu ${isFlow ? 'akışın' : 'sayfanın'} ait olduğu firma/ürün nedir ve kullanıcının burada tamamlamasını istediğiniz birincil dönüşüm hedefi nedir?${detectedCtas ? ` (Sayfada tespit edilen CTA'lar: ${detectedCtas})` : ''}`,
        questionEn: `1. Company / Product & Primary Goal: Which company/product does this ${isFlow ? 'flow' : 'page'} belong to, and what is the primary conversion or user goal?${detectedCtas ? ` (Detected CTAs: ${detectedCtas})` : ''}`,
        mapsToFields: ['companyName', 'productName', 'industry', 'primaryGoal', 'valueProposition']
      },
      {
        id: 'must_haves',
        questionTr: `2. Olmazsa Olmazlar (Must-Haves): Firma veya ürün için bu ${isFlow ? 'akışta' : 'sayfada'} kesinlikle bulunması, vurgulanması veya korunması gereken kritik unsurlar nelerdir? (Örn. "Ücretsiz deneme CTA'sı ilk ekranda olmalı", "Kredi kartı gerekmez ibaresi", "Güven rozetleri / KVKK onayı")`,
        questionEn: `2. Non-Negotiable Must-Haves: What elements, trust signals, disclosures, or features MUST be clearly visible on this ${isFlow ? 'flow' : 'page'}?`,
        mapsToFields: ['mustHaves']
      },
      {
        id: 'departments',
        questionTr: '3. Departman Perspektifleri: Analizde hangi departmanların bakış açısına odaklanalım? (Hazır: Product & UX, Marketing & CRO, Sales & Revenue, Legal & Compliance, Engineering & QA — veya eklemek istediğiniz özel bir departman ve kriteri var mı?)',
        questionEn: '3. Department Lenses: Which departments should evaluate this page/flow? (Built-in: Product & UX, Marketing & CRO, Sales & Revenue, Legal & Compliance, Engineering & QA — or any custom department?)',
        mapsToFields: ['departments', 'departmentNotes', 'customDepartments']
      },
      {
        id: 'metrics',
        questionTr: `4. Pazarlama ve Kullanım Metrikleri (Opsiyonel): Elimizde bu ${isFlow ? 'akışa' : 'sayfaya'} dair mevcut bir metrik veya bilinen bir darboğaz var mı? (Örn. Bounce rate %65, Sepet terk %70, ${detectedForms > 0 ? 'Form terk oranı, ' : ''}Mobil dönüşüm oranı)`,
        questionEn: '4. Marketing & Usage Metrics (Optional): Are there any current analytics metrics or known bottlenecks (e.g., bounce rate, drop-off step, conversion rate) we should diagnose?',
        mapsToFields: ['metrics']
      }
    ]
  };
}

// ─── Report Comparison (Before vs After Audit Diff Engine) ──────────────────

function normalizeIssueKey(issue) {
  const el = String(issue.element || '').trim().toLowerCase();
  const desc = String(issue.description || issue.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç\s]/gi, '')
    .split(/\s+/)
    .slice(0, 7)
    .join(' ');
  return `${el}::${desc}`;
}

function collectUniqueIssues(report) {
  if (!report) return [];
  if (report.type === 'flow' && Array.isArray(report.pages)) {
    const flowIssues = [];
    report.pages.forEach(p => {
      const label = p.page?.label || p.page?.url || 'Step';
      (p.report?.issues || []).forEach(iss => {
        flowIssues.push({
          severity: iss.severity || 'moderate',
          element: label,
          description: typeof iss === 'string' ? iss : (iss.description || iss.title || ''),
          recommendation: iss.recommendation || ''
        });
      });
    });
    (report.crossPage?.findings || []).forEach(f => {
      flowIssues.push({
        severity: f.severity || 'moderate',
        element: 'Cross-Page',
        description: `${f.title}: ${f.description}`,
        recommendation: ''
      });
    });
    return flowIssues;
  }

  if (Array.isArray(report.issues) && report.issues.length > 0) {
    return report.issues;
  }

  const map = new Map();
  Object.values(report.profileResults || {}).forEach(pr => {
    (pr.evaluations || []).forEach(ev => {
      (ev.issues || []).forEach(iss => {
        const key = normalizeIssueKey(iss);
        if (!map.has(key)) map.set(key, iss);
      });
    });
  });
  return Array.from(map.values());
}

/**
 * Compare two reports (Before vs After) for Single-Page or Flow Audits
 */
export function compareReports(baseReport, targetReport) {
  if (!baseReport || !targetReport) {
    throw new Error('Both baseReport (older) and targetReport (newer) are required for comparison.');
  }

  const baseScore = baseReport.overallScore ?? baseReport.flowScore ?? baseReport.score ?? 0;
  const targetScore = targetReport.overallScore ?? targetReport.flowScore ?? targetReport.score ?? 0;
  const overallScoreDelta = targetScore - baseScore;

  const baseA11y = baseReport.accessibilityResults?.score ?? null;
  const targetA11y = targetReport.accessibilityResults?.score ?? null;
  const accessibilityScoreDelta = (baseA11y !== null && targetA11y !== null) ? (targetA11y - baseA11y) : null;

  const baseGoal = baseReport.businessAlignment?.goalAlignmentScore ?? null;
  const targetGoal = targetReport.businessAlignment?.goalAlignmentScore ?? null;
  const goalAlignmentDelta = (baseGoal !== null && targetGoal !== null) ? (targetGoal - baseGoal) : null;

  const baseIssues = collectUniqueIssues(baseReport);
  const targetIssues = collectUniqueIssues(targetReport);

  const baseMap = new Map(baseIssues.map(i => [normalizeIssueKey(i), i]));
  const targetMap = new Map(targetIssues.map(i => [normalizeIssueKey(i), i]));

  const resolvedIssues = [];
  const persistentIssues = [];
  const newIssues = [];

  for (const [key, issue] of baseMap.entries()) {
    if (targetMap.has(key)) {
      persistentIssues.push(issue);
    } else {
      resolvedIssues.push(issue);
    }
  }

  for (const [key, issue] of targetMap.entries()) {
    if (!baseMap.has(key)) {
      newIssues.push(issue);
    }
  }

  // Must-Haves progress
  const baseMust = baseReport.businessAlignment?.mustHavesAudit || [];
  const targetMust = targetReport.businessAlignment?.mustHavesAudit || [];
  const mustHavesProgress = targetMust.map(tm => {
    const bm = baseMust.find(b => b.item === tm.item);
    return {
      item: tm.item,
      beforeStatus: bm ? bm.status : 'untracked',
      afterStatus: tm.status,
      improved: bm ? (bm.status !== 'pass' && tm.status === 'pass') : (tm.status === 'pass')
    };
  });

  const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
  const mdLines = [
    '# synthux Before vs After Audit Comparison',
    '',
    '| Metric | Before (Base) | After (Target) | Change (Delta) |',
    '|:---|:---:|:---:|:---:|',
    `| **URL / Flow** | ${baseReport.url || baseReport.name || 'Base'} | ${targetReport.url || targetReport.name || 'Target'} | — |`,
    `| **Overall UX Score** | **${baseScore}/100** | **${targetScore}/100** | **${sign(overallScoreDelta)}** |`
  ];

  if (accessibilityScoreDelta !== null) {
    mdLines.push(`| **Accessibility (WCAG)** | ${baseA11y}/100 | ${targetA11y}/100 | **${sign(accessibilityScoreDelta)}** |`);
  }
  if (goalAlignmentDelta !== null) {
    mdLines.push(`| **Business Goal Alignment** | ${baseGoal}/100 | ${targetGoal}/100 | **${sign(goalAlignmentDelta)}** |`);
  }
  mdLines.push(`| **Total Issues** | ${baseIssues.length} | ${targetIssues.length} | **${sign(targetIssues.length - baseIssues.length)}** (${resolvedIssues.length} resolved, ${newIssues.length} new) |`);
  mdLines.push('');

  if (resolvedIssues.length > 0) {
    mdLines.push(`## Resolved Issues (${resolvedIssues.length})`);
    resolvedIssues.forEach(i => {
      mdLines.push(`- ~~**[${(i.severity || 'moderate').toUpperCase()}]** ${i.description}~~ ${i.element ? `(\`${i.element}\`)` : ''}`);
    });
    mdLines.push('');
  }

  if (newIssues.length > 0) {
    mdLines.push(`## New / Regression Issues (${newIssues.length})`);
    newIssues.forEach(i => {
      mdLines.push(`- **[${(i.severity || 'moderate').toUpperCase()}]** ${i.description} ${i.element ? `(\`${i.element}\`)` : ''}`);
    });
    mdLines.push('');
  }

  if (persistentIssues.length > 0) {
    mdLines.push(`## Persistent Issues (${persistentIssues.length})`);
    persistentIssues.forEach(i => {
      mdLines.push(`- **[${(i.severity || 'moderate').toUpperCase()}]** ${i.description} ${i.element ? `(\`${i.element}\`)` : ''}`);
    });
    mdLines.push('');
  }

  return {
    baseId: baseReport.id || null,
    targetId: targetReport.id || null,
    url: targetReport.url || baseReport.url || null,
    baseTimestamp: baseReport.timestamp || null,
    targetTimestamp: targetReport.timestamp || null,
    scores: {
      baseScore,
      targetScore,
      overallScoreDelta,
      baseA11y,
      targetA11y,
      accessibilityScoreDelta,
      baseGoal,
      targetGoal,
      goalAlignmentDelta
    },
    counts: {
      baseTotalIssues: baseIssues.length,
      targetTotalIssues: targetIssues.length,
      resolvedCount: resolvedIssues.length,
      newCount: newIssues.length,
      persistentCount: persistentIssues.length
    },
    resolvedIssues,
    newIssues,
    persistentIssues,
    mustHavesProgress,
    markdown: mdLines.join('\n')
  };
}

// ─── AI Coding Agent Fix Prompt Generator ────────────────────────────────────

/**
 * Generates an actionable engineering prompt for AI coding agents (Antigravity, Cursor, Claude Code)
 * to fix the highest-impact UX, WCAG, and Business Must-Have issues found in a report.
 */
export function generateAiFixPrompt(report) {
  if (!report) return '';
  const issues = collectUniqueIssues(report);
  const criticalAndHigh = issues.filter(i => i.severity === 'critical' || i.priority === 'high' || i.isQuickWin);
  const targetList = criticalAndHigh.length > 0 ? criticalAndHigh : issues.slice(0, 10);

  const lines = [
    `Please fix the following UX, Accessibility (WCAG 2.2 AA), and Business Goal issues identified by synthux on ${report.url || report.title || 'this page'} (Current UX Score: ${report.overallScore ?? report.flowScore ?? 0}/100):`,
    ''
  ];

  if (report.businessAlignment) {
    const ba = report.businessAlignment;
    lines.push(`### Business & Product Goal Context (${ba.goalAlignmentScore}/100)`);
    if (ba.primaryGoal) lines.push(`- **Primary Goal:** ${ba.primaryGoal}`);
    const missingMusts = (ba.mustHavesAudit || []).filter(m => m.status !== 'pass');
    if (missingMusts.length > 0) {
      lines.push('- **Missing / Partial Non-Negotiable Must-Haves to Implement:**');
      missingMusts.forEach(m => {
        lines.push(`  - [${m.status.toUpperCase()}] **${m.item}** -> ${m.recommendation || m.evidence}`);
      });
    }
    lines.push('');
  }

  lines.push(`### Priority UX & Accessibility Fixes (${targetList.length})`);
  targetList.forEach((issue, idx) => {
    lines.push(`${idx + 1}. **[${(issue.severity || 'moderate').toUpperCase()}${issue.isQuickWin ? ' · QUICK WIN' : ''}]** ${issue.description}`);
    if (issue.element) lines.push(`   - **Selector:** \`${issue.element}\``);
    if (issue.recommendation) lines.push(`   - **Required Change:** ${issue.recommendation}`);
    if (issue.codeFix?.after) {
      lines.push(`   - **Suggested Code (\`${issue.codeFix.language || 'html'}\`):**\n\`\`\`${issue.codeFix.language || 'html'}\n${issue.codeFix.after}\n\`\`\``);
    }
  });

  if (report.accessibilityResults?.wcagViolations?.length > 0) {
    lines.push('');
    lines.push(`### axe-core WCAG 2.2 AA Violations (${report.accessibilityResults.wcagViolations.length})`);
    report.accessibilityResults.wcagViolations.slice(0, 6).forEach(v => {
      const targets = (v.nodes || []).slice(0, 2).map(n => n.target).join(', ');
      lines.push(`- **[${(v.impact || 'serious').toUpperCase()}] ${v.help}**: ${v.description}${targets ? ` (Targets: \`${targets}\`)` : ''}`);
    });
  }

  return lines.join('\n');
}
