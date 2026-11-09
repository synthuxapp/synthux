/**
 * synthux — AI Provider Adapters
 * 
 * Adapter pattern for multiple AI providers.
 * Each provider normalizes request/response to a common format.
 * 
 * Supported:
 * - Ollama (Local)
 * - Apple Intelligence (macOS 26/27 Built-in Foundation Models via local bridge)
 * - Chrome Built-in AI (Gemini Nano via Chrome Prompt API)
 * - OpenAI (BYOK)
 * - Google Gemini (BYOK)
 * - Anthropic Claude (BYOK)
 */

function stripMarkdownJsonFences(rawText) {
  let text = String(rawText || '').trim();
  if (text.startsWith('```json')) {
    text = text.slice(7);
  } else if (text.startsWith('```')) {
    text = text.slice(3);
  }
  if (text.endsWith('```')) {
    text = text.slice(0, -3);
  }
  return text.trim();
}

function getChromeLanguageModelApi() {
  if (typeof globalThis !== 'undefined') {
    if (globalThis.LanguageModel) return { api: globalThis.LanguageModel, type: 'standard' };
    if (globalThis.ai?.languageModel) return { api: globalThis.ai.languageModel, type: 'legacy' };
  }
  return null;
}

// ─── Provider Registry ──────────────────────────────────────────────────────

export const PROVIDERS = {
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    icon: '🖥️',
    authType: 'none',
    defaultEndpoint: 'http://localhost:11434',
    models: [],  // Dynamically fetched from local server
    modelsFetchable: true,

    buildRequest(prompt, model, options = {}) {
      const body = {
        model,
        prompt,
        system: options.systemPrompt || '',
        stream: false,
        format: options.format || 'json',
        options: {
          temperature: options.temperature ?? 0.3,
          num_predict: options.maxTokens || 2048,
        }
      };
      // Ollama vision: images as base64 array (no data URL prefix)
      if (options.images?.length) {
        body.images = options.images.map(img => img.replace(/^data:image\/\w+;base64,/, ''));
      }
      return {
        url: `${options.endpoint || this.defaultEndpoint}/api/generate`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            outputTokens: data.eval_count || 0,
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: data.response },
          meta: {
            model: data.model,
            inputTokens: data.prompt_eval_count || 0,
            outputTokens: data.eval_count || 0,
          }
        };
      }
    },

    async fetchModels(endpoint) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/api/tags`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.models || []).map(m => ({
          id: m.name,
          name: m.name,
          size: m.size
        }));
      } catch { return []; }
    },

    async ping(endpoint) {
      const url = endpoint || this.defaultEndpoint;
      try {
        const res = await fetch(`${url}/api/tags`, {
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          // GET works — but CORS may still block POST requests.
          // Quick POST probe to verify (will get 400 "model required" if POST is allowed,
          // or 403 if CORS blocks POST from this extension origin)
          try {
            const postProbe = await fetch(`${url}/api/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: '' }),
              signal: AbortSignal.timeout(3000)
            });
            // 403 = CORS blocking POST specifically
            if (postProbe.status === 403) {
              return { status: 'cors-blocked' };
            }
            // Any other response (400, 404, etc.) = POST is allowed, connection works
          } catch {
            // POST fetch threw entirely — CORS blocking at network level
            return { status: 'cors-blocked' };
          }

          // Also check version for update tracking
          let version = null;
          try {
            const vRes = await fetch(`${url}/api/version`, { signal: AbortSignal.timeout(3000) });
            if (vRes.ok) {
              const vData = await vRes.json();
              version = vData.version || null;
            }
          } catch { /* version check is best-effort */ }
          return { status: 'connected', version };
        }
        // Ollama is reachable but returned non-200
        return { status: 'error', code: res.status };
      } catch {
        // GET fetch threw — either CORS blocked entirely or truly offline.
        // Use a no-cors probe to distinguish:
        try {
          await fetch(url, {
            mode: 'no-cors',
            signal: AbortSignal.timeout(3000)
          });
          // Opaque response received — Ollama is running but CORS is blocking
          return { status: 'cors-blocked' };
        } catch {
          // Network error — Ollama is truly offline
          return { status: 'offline' };
        }
      }
    }
  },

  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    authType: 'bearer',
    defaultEndpoint: 'https://api.openai.com',
    models: [
      { id: 'gpt-5.4', name: 'GPT-5.4' },
      { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini' },
      { id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano' },
      { id: 'gpt-5.1', name: 'GPT-5.1' },
    ],
    modelsFetchable: true,

    buildRequest(prompt, model, options = {}) {
      // Build user message content (text + optional images)
      const userContent = [];
      if (options.images?.length) {
        options.images.forEach(img => {
          userContent.push({
            type: 'image_url',
            image_url: { url: img, detail: 'low' }
          });
        });
      }
      userContent.push({ type: 'text', text: prompt });

      return {
        url: `${options.endpoint || this.defaultEndpoint}/v1/chat/completions`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${options.apiKey}`,
        },
        body: {
          model,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: options.images?.length ? userContent : prompt }
          ],
          temperature: options.temperature ?? 0.3,
          max_tokens: options.maxTokens || 2048,
          response_format: options.format === 'json' ? { type: 'json_object' } : undefined,
        }
      };
    },

    parseResponse(data) {
      const content = data.choices?.[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.model,
            inputTokens: data.usage?.prompt_tokens || 0,
            outputTokens: data.usage?.completion_tokens || 0,
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.model,
            inputTokens: data.usage?.prompt_tokens || 0,
            outputTokens: data.usage?.completion_tokens || 0,
          }
        };
      }
    },

    async fetchModels(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!res.ok) return this.models;
        const data = await res.json();
        return (data.data || [])
          .filter(m => m.id.startsWith('gpt-5') || m.id.startsWith('gpt-4') || m.id.startsWith('o'))
          .map(m => ({ id: m.id, name: m.id }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch { return this.models; }
    },

    async ping(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(8000)
        });
        return res.ok;
      } catch { return false; }
    }
  },

  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🔵',
    authType: 'query_param',
    defaultEndpoint: 'https://generativelanguage.googleapis.com',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Preview)' },
      { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash-Lite (Preview)' },
    ],
    modelsFetchable: true,

    buildRequest(prompt, model, options = {}) {
      const endpoint = options.endpoint || this.defaultEndpoint;
      const apiKey = options.apiKey || '';
      // Build user parts (text + optional images)
      const userParts = [];
      if (options.images?.length) {
        options.images.forEach(img => {
          userParts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: img.replace(/^data:image\/\w+;base64,/, '')
            }
          });
        });
      }
      userParts.push({ text: prompt });

      return {
        url: `${endpoint}/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          contents: [
            ...(options.systemPrompt ? [{
              role: 'model',
              parts: [{ text: `System: ${options.systemPrompt}` }]
            }] : []),
            { role: 'user', parts: userParts }
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.3,
            maxOutputTokens: options.maxTokens || 4096,
            responseMimeType: options.format === 'json' ? 'application/json' : 'text/plain',
            // Disable thinking tokens for structured JSON output — saves ~60-80% output cost
            thinkingConfig: { thinkingBudget: 0 }
          }
        }
      };
    },

    parseResponse(data) {
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const usage = data.usageMetadata || {};
      // Gemini 2.5 Flash: thinking tokens are billed as output tokens
      const outputTokens = (usage.candidatesTokenCount || 0) + (usage.thoughtsTokenCount || 0);
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.modelVersion || '',
            inputTokens: usage.promptTokenCount || 0,
            outputTokens,
            thinkingTokens: usage.thoughtsTokenCount || 0,
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.modelVersion || '',
            inputTokens: usage.promptTokenCount || 0,
            outputTokens,
            thinkingTokens: usage.thoughtsTokenCount || 0,
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
        return (data.models || [])
          .filter(m => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => ({
            id: m.name.replace('models/', ''),
            name: m.displayName || m.name.replace('models/', '')
          }));
      } catch { return this.models; }
    },

    async ping(endpoint, apiKey) {
      try {
        const res = await fetch(
          `${endpoint || this.defaultEndpoint}/v1beta/models?key=${apiKey}`,
          { signal: AbortSignal.timeout(8000) }
        );
        return res.ok;
      } catch { return false; }
    }
  },

  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    icon: '🟠',
    authType: 'x-api-key',
    defaultEndpoint: 'https://api.anthropic.com',
    models: [
      { id: 'claude-opus-4-7', name: 'Claude Opus 4.7' },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
    ],
    modelsFetchable: true,

    buildRequest(prompt, model, options = {}) {
      // Build user message content (text + optional images)
      const userContent = [];
      if (options.images?.length) {
        options.images.forEach(img => {
          userContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: img.replace(/^data:image\/\w+;base64,/, '')
            }
          });
        });
      }
      userContent.push({ type: 'text', text: prompt });

      return {
        url: `${options.endpoint || this.defaultEndpoint}/v1/messages`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': options.apiKey || '',
          'anthropic-version': '2024-01-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: {
          model,
          max_tokens: options.maxTokens || 2048,
          ...(options.systemPrompt ? { system: options.systemPrompt } : {}),
          messages: [
            { role: 'user', content: options.images?.length ? userContent : prompt }
          ],
        }
      };
    },

    parseResponse(data) {
      const content = data.content?.[0]?.text || '';
      try {
        const parsed = JSON.parse(content);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data.model || '',
            inputTokens: data.usage?.input_tokens || 0,
            outputTokens: data.usage?.output_tokens || 0,
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: content },
          meta: {
            model: data.model || '',
            inputTokens: data.usage?.input_tokens || 0,
            outputTokens: data.usage?.output_tokens || 0,
          }
        };
      }
    },

    async fetchModels(endpoint, apiKey) {
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/models`, {
          headers: {
            'x-api-key': apiKey || '',
            'anthropic-version': '2024-01-01',
          },
          signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) return this.models;
        const data = await res.json();
        return (data.data || [])
          .filter(m => m.id.startsWith('claude'))
          .map(m => ({ id: m.id, name: m.display_name || m.id }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch { return this.models; }
    },

    async ping(endpoint, apiKey) {
      try {
        // Send a minimal request to verify the API key works
        const res = await fetch(`${endpoint || this.defaultEndpoint}/v1/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
            'anthropic-version': '2024-01-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Hi' }]
          }),
          signal: AbortSignal.timeout(10000)
        });
        return res.ok;
      } catch { return false; }
    }
  },

  apple: {
    id: 'apple',
    name: 'Apple Intelligence (macOS)',
    icon: '',
    authType: 'none',
    defaultEndpoint: 'http://127.0.0.1:17483',
    models: [
      { id: 'apple-on-device', name: 'Apple Foundation Model (On-Device ANE)' },
      { id: 'apple-pcc', name: 'Apple Private Cloud Compute (macOS 27)' },
      { id: 'apple-content-tagging', name: 'Apple Foundation Model (Fast Tagging)' }
    ],
    modelsFetchable: true,

    buildRequest(prompt, model, options = {}) {
      const endpoint = (options.endpoint || this.defaultEndpoint).replace(/\/$/, '');
      const selectedModel = model || 'apple-on-device';

      // Trim prompt safely to fit Apple On-Device Foundation Model context window (~4K-8K tokens)
      const maxChars = selectedModel === 'apple-pcc' ? 28000 : 12000;
      const safePrompt = prompt.length > maxChars
        ? `${prompt.slice(0, maxChars)}\n\n[DOM truncated for on-device context window. Respond ONLY with valid JSON.]`
        : prompt;

      return {
        url: `${endpoint}/apple-fm/generate`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          model: selectedModel,
          prompt: safePrompt,
          system: options.systemPrompt || 'You are a UX evaluation expert. Respond only with valid JSON.',
          temperature: options.temperature ?? 0.3,
          maxTokens: options.maxTokens || 2048,
          format: options.format || 'json'
        }
      };
    },

    parseResponse(data) {
      if (data && data.success === false) {
        throw new Error(data.error || 'Apple Foundation Model failed to generate a response.');
      }

      const rawText = stripMarkdownJsonFences(
        data?.response ?? data?.choices?.[0]?.message?.content ?? ''
      );

      try {
        const parsed = JSON.parse(rawText);
        return {
          success: true,
          result: parsed,
          meta: {
            model: data?.model || 'apple-on-device',
            totalDuration: data?.totalDuration || 0,
            inputTokens: data?.inputTokens ?? data?.usage?.prompt_tokens ?? 0,
            outputTokens: data?.outputTokens ?? data?.usage?.completion_tokens ?? 0
          }
        };
      } catch {
        return {
          success: true,
          result: { raw: rawText },
          meta: {
            model: data?.model || 'apple-on-device',
            inputTokens: data?.inputTokens ?? 0,
            outputTokens: data?.outputTokens ?? 0
          }
        };
      }
    },

    async fetchModels(endpoint) {
      const base = (endpoint || this.defaultEndpoint).replace(/\/$/, '');
      try {
        const res = await fetch(`${base}/apple-fm/status`, {
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models) && data.models.length > 0) {
            return data.models.map(m => ({
              id: m.id || m.name,
              name: m.name || m.id
            }));
          }
        }
      } catch {}
      return this.models;
    },

    async ping(endpoint) {
      const base = (endpoint || this.defaultEndpoint).replace(/\/$/, '');
      try {
        const res = await fetch(`${base}/apple-fm/status`, {
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.available) {
            return {
              status: 'connected',
              version: data.variant || data.osVersion || 'Apple Intelligence'
            };
          }
          // Bridge is reachable on macOS 26/27; report status + reason if Apple Intelligence needs enabling
          return {
            status: data.status === 'unsupported_os' ? 'unsupported-os' : 'connected',
            version: data.variant || data.osVersion || 'macOS Bridge Ready',
            warning: data.reason || null
          };
        }
        return { status: 'error', code: res.status };
      } catch {
        return { status: 'offline' };
      }
    }
  },

  chromeai: {
    id: 'chromeai',
    name: 'Chrome Built-in AI',
    icon: '🌐',
    authType: 'none',
    defaultEndpoint: 'chrome://on-device-internals',
    models: [
      { id: 'gemini-nano', name: 'Gemini Nano (Chrome Prompt API)' }
    ],
    modelsFetchable: false,

    async evaluateDirect(prompt, model = 'gemini-nano', options = {}) {
      const entry = getChromeLanguageModelApi();
      if (!entry) {
        return {
          success: false,
          error: 'Chrome Built-in AI (Prompt API) is not enabled in this browser. Enable chrome://flags/#prompt-api-for-gemini-nano and restart Chrome.'
        };
      }

      const maxChars = 14000;
      const safePrompt = prompt.length > maxChars
        ? `${prompt.slice(0, maxChars)}\n\n[DOM truncated for Gemini Nano context window. Respond ONLY with valid JSON.]`
        : prompt;

      const systemPrompt = options.systemPrompt || 'You are a UX evaluation expert. Respond ONLY with a valid JSON object without markdown code fences.';
      let session = null;

      try {
        if (entry.type === 'standard') {
          session = await entry.api.create({
            initialPrompts: [{ role: 'system', content: systemPrompt }],
            temperature: options.temperature ?? 0.3,
            topK: 3,
            signal: options.signal
          });
        } else {
          session = await entry.api.create({
            systemPrompt,
            temperature: options.temperature ?? 0.3,
            topK: 3,
            signal: options.signal
          });
        }

        const rawResponse = await session.prompt(safePrompt, { signal: options.signal });
        const cleaned = stripMarkdownJsonFences(rawResponse);
        const inputTokens = Math.max(1, Math.round(safePrompt.length / 4));
        const outputTokens = Math.max(1, Math.round(cleaned.length / 4));

        try {
          const parsed = JSON.parse(cleaned);
          return {
            success: true,
            result: parsed,
            meta: {
              model: model || 'gemini-nano',
              inputTokens,
              outputTokens
            }
          };
        } catch {
          return {
            success: true,
            result: { raw: cleaned },
            meta: {
              model: model || 'gemini-nano',
              inputTokens,
              outputTokens
            }
          };
        }
      } catch (err) {
        return {
          success: false,
          error: `Chrome Built-in AI error: ${err.message || String(err)}`
        };
      } finally {
        try { session?.destroy?.(); } catch {}
      }
    },

    async fetchModels() {
      return this.models;
    },

    async ping() {
      const entry = getChromeLanguageModelApi();
      if (!entry) {
        return { status: 'chromeai-disabled' };
      }
      try {
        if (entry.type === 'standard' && typeof entry.api.availability === 'function') {
          const avail = await entry.api.availability();
          if (avail === 'unavailable' || avail === 'no') {
            return { status: 'chromeai-disabled' };
          }
          return { status: 'connected', version: `Gemini Nano (${avail})` };
        }
        if (entry.type === 'legacy' && typeof entry.api.capabilities === 'function') {
          const caps = await entry.api.capabilities();
          if (caps?.available === 'no') {
            return { status: 'chromeai-disabled' };
          }
          return { status: 'connected', version: `Gemini Nano (${caps?.available || 'ready'})` };
        }
        return { status: 'connected', version: 'Gemini Nano' };
      } catch {
        return { status: 'chromeai-disabled' };
      }
    }
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get provider by ID
 */
export function getProvider(id) {
  return PROVIDERS[id] || PROVIDERS.ollama;
}

/**
 * Get all provider IDs
 */
export function getProviderIds() {
  return Object.keys(PROVIDERS);
}

/**
 * Get provider display list for settings dropdown
 */
export function getProviderList() {
  return Object.values(PROVIDERS).map(p => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    authType: p.authType,
    models: p.models
  }));
}

// ─── Vision Capability Detection ─────────────────────────────────────────────

/**
 * In-memory cache for vision capability per model.
 * Key: "providerId::modelName", Value: boolean
 */
const _visionCache = new Map();

/**
 * Check if a model supports vision (image) input.
 *
 * - Cloud providers (OpenAI, Gemini, Claude): always returns true
 *   (all modern cloud models accept images; the API gracefully ignores
 *    images if the specific model doesn't support them).
 * - Apple Intelligence & Chrome Built-in AI: returns false so prompts stay
 *   within the fast on-device text/DOM context window.
 * - Ollama: queries /api/show for the model's `capabilities` array
 *   and returns true if it contains "vision".
 *
 * Results are cached in-memory so repeated calls for the same model
 * don't hit the network.
 *
 * @param {string} providerId  - e.g. 'ollama', 'apple', 'chromeai', 'openai', 'gemini', 'claude'
 * @param {string} model       - model name, e.g. 'gemma3:4b'
 * @param {string} [endpoint]  - Ollama endpoint (default http://localhost:11434)
 * @returns {Promise<boolean>}
 */
export async function checkVisionSupport(providerId, model, endpoint) {
  // On-device compact text/DOM models skip base64 screenshot payloads
  if (providerId === 'apple' || providerId === 'chromeai') return false;

  // Cloud providers — always treat as vision-capable
  if (providerId !== 'ollama') return true;

  if (!model) return false;

  const cacheKey = `${providerId}::${model}`;
  if (_visionCache.has(cacheKey)) {
    return _visionCache.get(cacheKey);
  }

  const base = (endpoint || PROVIDERS.ollama.defaultEndpoint).replace(/\/$/, '');

  try {
    const res = await fetch(`${base}/api/show`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model }),
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      // Can't determine — assume no vision to be safe
      _visionCache.set(cacheKey, false);
      return false;
    }

    const data = await res.json();

    // Primary: capabilities array (Ollama ≥ 0.5+)
    if (Array.isArray(data.capabilities)) {
      const hasVision = data.capabilities.includes('vision');
      _visionCache.set(cacheKey, hasVision);
      console.info(`[synthux] Vision check for "${model}": capabilities=[${data.capabilities.join(',')}] → ${hasVision}`);
      return hasVision;
    }

    // Fallback: check model_info for vision-related keys (older Ollama)
    if (data.model_info) {
      const keys = Object.keys(data.model_info);
      const hasVisionKeys = keys.some(k =>
        k.includes('vision') || k.includes('mmproj') || k.includes('clip')
      );
      _visionCache.set(cacheKey, hasVisionKeys);
      console.info(`[synthux] Vision check for "${model}": model_info keys fallback → ${hasVisionKeys}`);
      return hasVisionKeys;
    }

    // Fallback: check families
    const families = data.details?.families || data.details?.family;
    if (families) {
      const famArr = Array.isArray(families) ? families : [families];
      const hasVisionFamily = famArr.some(f =>
        /clip|vision|mmproj/i.test(f)
      );
      _visionCache.set(cacheKey, hasVisionFamily);
      console.info(`[synthux] Vision check for "${model}": families fallback → ${hasVisionFamily}`);
      return hasVisionFamily;
    }

    _visionCache.set(cacheKey, false);
    return false;
  } catch (err) {
    console.warn(`[synthux] Vision capability check failed for "${model}":`, err.message);
    _visionCache.set(cacheKey, false);
    return false;
  }
}
