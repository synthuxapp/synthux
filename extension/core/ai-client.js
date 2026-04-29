/**
 * synthux — AI Client (Multi-Provider)
 * 
 * Unified AI client that works with multiple providers:
 * - Ollama (local, default)
 * - OpenAI (BYOK)
 * - Google Gemini (BYOK)
 * - Anthropic Claude (BYOK)
 * 
 * Backward compatible: OllamaClient still exported as alias.
 */

import { getProvider } from './providers.js';

export class AIClient {
  constructor(endpoint = 'http://localhost:11434', options = {}) {
    this.endpoint = endpoint.replace(/\/$/, '');
    this.providerId = options.provider || 'ollama';
    this.apiKey = options.apiKey || '';
    this.abortController = null;

    this.provider = getProvider(this.providerId);
  }

  /**
   * Update provider configuration
   */
  setProvider(providerId, apiKey = '', endpoint = '') {
    this.providerId = providerId;
    this.apiKey = apiKey;
    this.provider = getProvider(providerId);
    if (endpoint) {
      this.endpoint = endpoint.replace(/\/$/, '');
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
      model = 'gemma3',
      systemPrompt = '',
      temperature = 0.3,
      format = 'json',
      maxRetries = 1,
      images = []
    } = options;

    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      this.abortController = new AbortController();

      try {
        // Wait before retry
        if (attempt > 0) {
          console.log(`[synthux] Retrying AI call (attempt ${attempt + 1})...`);
          await new Promise(r => setTimeout(r, 3000));
        }

        // Build provider-specific request
        const req = this.provider.buildRequest(prompt, model, {
          endpoint: this.endpoint,
          apiKey: this.apiKey,
          systemPrompt,
          temperature,
          format,
          maxTokens: 4096,
          images: images.filter(Boolean),
        });

        const response = await fetch(req.url, {
          method: req.method,
          headers: req.headers,
          signal: this.abortController.signal,
          body: JSON.stringify(req.body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(`${this.provider.name} error (${response.status}): ${errorText}`);

          // Retry on 500 (server crash), don't retry on 4xx
          if (response.status >= 500 && attempt < maxRetries) {
            console.warn(`[synthux] ${this.provider.name} 500 error, will retry...`);
            continue;
          }

          // Provider-specific error messages
          if (response.status === 401 || response.status === 403) {
            return {
              success: false,
              error: `Invalid API key for ${this.provider.name}. Check your settings.`
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
            error: response.status >= 500
              ? `${this.provider.name} server error. Try again or restart.`
              : lastError.message
          };
        }

        const data = await response.json();

        // Parse using provider adapter
        const parsed = this.provider.parseResponse(data);
        return parsed;

      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, error: 'Evaluation cancelled' };
        }
        lastError = err;
        if (attempt < maxRetries) continue;
        return { success: false, error: `AI evaluation failed: ${err.message}` };
      } finally {
        this.abortController = null;
      }
    }

    return { success: false, error: lastError?.message || 'Unknown error' };
  }

  /**
   * Stream evaluation response (for progress display)
   * Currently only supported for Ollama
   */
  async *evaluateStream(prompt, options = {}) {
    const {
      model = 'gemma3',
      systemPrompt = '',
      temperature = 0.3
    } = options;

    // Streaming only for Ollama
    if (this.providerId !== 'ollama') {
      // Fall back to non-streaming for cloud providers
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: this.abortController.signal,
        body: JSON.stringify({
          model,
          prompt,
          system: systemPrompt,
          stream: true,
          options: {
            temperature,
            num_predict: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama error (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line);
              yield {
                token: chunk.response || '',
                done: chunk.done || false,
                meta: chunk.done ? {
                  model: chunk.model,
                  totalDuration: chunk.total_duration,
                  evalCount: chunk.eval_count
                } : null
              };
            } catch {
              // Skip malformed chunks
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
}

// ─── Backward Compatibility ──────────────────────────────────────────────────
// OllamaClient is now an alias for AIClient (defaults to Ollama provider)
export const OllamaClient = AIClient;
