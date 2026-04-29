/**
 * synthux — AI Provider Adapters
 * 
 * Adapter pattern for multiple AI providers.
 * Each provider normalizes request/response to a common format.
 * 
 * Supported: Ollama (local), OpenAI, Google Gemini, Anthropic Claude
 */

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
      try {
        const res = await fetch(`${endpoint || this.defaultEndpoint}/api/tags`, {
          signal: AbortSignal.timeout(5000)
        });
        return res.ok;
      } catch { return false; }
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
