/**
 * synthux — Cost Calculator
 * 
 * Estimates the cost of an AI analysis using pricing data from aicost.
 * Hybrid approach: bundled pricing.json (offline fallback) + periodic GitHub fetch.
 */

const PRICING_URL = 'https://raw.githubusercontent.com/ufhouck/aicost/main/data/pricing.json';
const CACHE_KEY = 'synthux_pricing_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── Bundled pricing data (offline fallback) ─────────────────────────────────
// Subset of text models from aicost — last updated 2026-04-26
const BUNDLED_PRICING = {
  last_updated: '2026-04-29',
  models: [
    // OpenAI GPT-5 series (verified Apr 2026)
    { id: 'gpt-5.5', provider: 'OpenAI', cost_per_1m_input_tokens: 5.0, cost_per_1m_output_tokens: 30.0 },
    { id: 'gpt-5.4', provider: 'OpenAI', cost_per_1m_input_tokens: 2.0, cost_per_1m_output_tokens: 8.0 },
    { id: 'gpt-5.4-mini', provider: 'OpenAI', cost_per_1m_input_tokens: 0.40, cost_per_1m_output_tokens: 1.60 },
    { id: 'gpt-5.4-nano', provider: 'OpenAI', cost_per_1m_input_tokens: 0.10, cost_per_1m_output_tokens: 0.40 },
    { id: 'gpt-5.1', provider: 'OpenAI', cost_per_1m_input_tokens: 1.50, cost_per_1m_output_tokens: 6.0 },
    // Anthropic Claude 4 series (verified Apr 2026)
    { id: 'claude-opus-4-7', provider: 'Anthropic', cost_per_1m_input_tokens: 5.0, cost_per_1m_output_tokens: 25.0 },
    { id: 'claude-sonnet-4-6', provider: 'Anthropic', cost_per_1m_input_tokens: 3.0, cost_per_1m_output_tokens: 15.0 },
    { id: 'claude-haiku-4-5', provider: 'Anthropic', cost_per_1m_input_tokens: 1.0, cost_per_1m_output_tokens: 5.0 },
    { id: 'claude-opus-4-6', provider: 'Anthropic', cost_per_1m_input_tokens: 5.0, cost_per_1m_output_tokens: 25.0 },
    // Google Gemini (verified Apr 2026)
    { id: 'gemini-2.5-pro', provider: 'Google', cost_per_1m_input_tokens: 1.25, cost_per_1m_output_tokens: 10.0 },
    { id: 'gemini-2.5-flash', provider: 'Google', cost_per_1m_input_tokens: 0.30, cost_per_1m_output_tokens: 2.50 },
    { id: 'gemini-2.5-flash-lite', provider: 'Google', cost_per_1m_input_tokens: 0.10, cost_per_1m_output_tokens: 0.40 },
    { id: 'gemini-3-flash-preview', provider: 'Google', cost_per_1m_input_tokens: 0.30, cost_per_1m_output_tokens: 2.50 },
    { id: 'gemini-3.1-pro-preview', provider: 'Google', cost_per_1m_input_tokens: 1.25, cost_per_1m_output_tokens: 10.0 },
  ]
};

// ─── Pricing data cache ──────────────────────────────────────────────────────
let pricingData = null;

/**
 * Load pricing data — tries cache first, then fetches from GitHub
 */
async function loadPricing() {
  if (pricingData) return pricingData;

  // Try chrome.storage cache
  try {
    const cached = await chrome.storage.local.get(CACHE_KEY);
    if (cached[CACHE_KEY]) {
      const { data, timestamp } = cached[CACHE_KEY];
      if (Date.now() - timestamp < CACHE_TTL) {
        pricingData = data;
        return pricingData;
      }
    }
  } catch {
    // Not in extension context — use bundled
  }

  // Try fetching fresh data from GitHub
  try {
    const response = await fetch(PRICING_URL, {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const fresh = await response.json();
      pricingData = fresh;

      // Cache in chrome.storage
      try {
        await chrome.storage.local.set({
          [CACHE_KEY]: { data: fresh, timestamp: Date.now() }
        });
      } catch { /* Not in extension context */ }

      return pricingData;
    }
  } catch {
    // Fetch failed — fall back to bundled
  }

  // Fallback: bundled pricing
  pricingData = BUNDLED_PRICING;
  return pricingData;
}

/**
 * Calculate estimated cost for a given model and token usage
 * 
 * @param {string} modelId — Model identifier (e.g., 'gpt-4o', 'gemini-2.5-flash')
 * @param {number} inputTokens — Number of input tokens used
 * @param {number} outputTokens — Number of output tokens generated
 * @param {string} providerId — Provider identifier (e.g., 'ollama', 'openai')
 * @returns {Object} — { cost, formatted, isLocal, modelFound }
 */
export async function calculateCost(modelId, inputTokens, outputTokens, providerId = 'ollama') {
  // Local models are free
  if (providerId === 'ollama') {
    return {
      cost: 0,
      formatted: 'Free — local AI ✓',
      isLocal: true,
      modelFound: true,
      inputTokens,
      outputTokens,
    };
  }

  const pricing = await loadPricing();
  
  // Find model in pricing data
  // Try exact match first, then fuzzy match (model IDs may differ slightly)
  let modelPricing = pricing.models.find(m => m.id === modelId);
  
  if (!modelPricing) {
    // Fuzzy: try partial match
    const normalizedId = modelId.toLowerCase();
    modelPricing = pricing.models.find(m => 
      m.id.toLowerCase().includes(normalizedId) || 
      normalizedId.includes(m.id.toLowerCase())
    );
  }

  if (!modelPricing) {
    return {
      cost: null,
      formatted: `${inputTokens + outputTokens} tokens used`,
      isLocal: false,
      modelFound: false,
      inputTokens,
      outputTokens,
    };
  }

  const inputCost = (inputTokens / 1_000_000) * modelPricing.cost_per_1m_input_tokens;
  const outputCost = (outputTokens / 1_000_000) * modelPricing.cost_per_1m_output_tokens;
  const totalCost = inputCost + outputCost;

  return {
    cost: totalCost,
    formatted: totalCost < 0.001 ? '<$0.001' : `~$${totalCost.toFixed(4)}`,
    isLocal: false,
    modelFound: true,
    inputTokens,
    outputTokens,
    breakdown: {
      inputCost: inputCost.toFixed(6),
      outputCost: outputCost.toFixed(6),
    }
  };
}

/**
 * Aggregate cost across multiple evaluations
 */
export function aggregateCosts(costResults) {
  const locals = costResults.filter(c => c.isLocal);
  if (locals.length === costResults.length) {
    const totalTokens = costResults.reduce((sum, c) => sum + (c.inputTokens || 0) + (c.outputTokens || 0), 0);
    return {
      cost: 0,
      formatted: `Free — local AI ✓ (${totalTokens.toLocaleString()} tokens)`,
      isLocal: true,
    };
  }

  const totalCost = costResults.reduce((sum, c) => sum + (c.cost || 0), 0);
  const totalInput = costResults.reduce((sum, c) => sum + (c.inputTokens || 0), 0);
  const totalOutput = costResults.reduce((sum, c) => sum + (c.outputTokens || 0), 0);

  return {
    cost: totalCost,
    formatted: totalCost < 0.001 ? '<$0.001' : `~$${totalCost.toFixed(4)}`,
    isLocal: false,
    totalTokens: totalInput + totalOutput,
    inputTokens: totalInput,
    outputTokens: totalOutput,
  };
}
