/**
 * synthux — Ollama AI Client
 * 
 * Communicates with local Ollama server for AI-powered UX analysis.
 * Supports both single-shot and streaming responses.
 */

export class OllamaClient {
  constructor(endpoint = 'http://localhost:11434') {
    this.endpoint = endpoint.replace(/\/$/, '');
    this.abortController = null;
  }

  /**
   * Check if Ollama server is reachable
   */
  async ping() {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List all downloaded models
   */
  async listModels() {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return (data.models || []).map(m => ({
        name: m.name,
        size: m.size,
        modified: m.modified_at,
        digest: m.digest
      }));
    } catch (err) {
      console.error('[synthux] Failed to list models:', err);
      return [];
    }
  }

  /**
   * Send a single evaluation prompt and get structured response
   * Retries once on 500 errors (Ollama internal crash)
   */
  async evaluate(prompt, options = {}) {
    const {
      model = 'gemma3',
      systemPrompt = '',
      temperature = 0.3,
      format = 'json',
      maxRetries = 1
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

        const response = await fetch(`${this.endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: this.abortController.signal,
          body: JSON.stringify({
            model,
            prompt,
            system: systemPrompt,
            stream: false,
            format,
            options: {
              temperature,
              num_predict: 2048,
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(`Ollama error (${response.status}): ${errorText}`);

          // Retry on 500 (server crash), don't retry on 4xx
          if (response.status >= 500 && attempt < maxRetries) {
            console.warn(`[synthux] Ollama 500 error, will retry...`);
            continue;
          }

          return {
            success: false,
            error: response.status >= 500
              ? 'Ollama crashed during evaluation. Try restarting Ollama.'
              : lastError.message
          };
        }

        const data = await response.json();
        
        // Parse JSON response from model
        try {
          const parsed = JSON.parse(data.response);
          return {
            success: true,
            result: parsed,
            meta: {
              model: data.model,
              totalDuration: data.total_duration,
              evalCount: data.eval_count
            }
          };
        } catch {
          // Model didn't return valid JSON — return raw text
          return {
            success: true,
            result: { raw: data.response },
            meta: {
              model: data.model,
              totalDuration: data.total_duration,
              evalCount: data.eval_count
            }
          };
        }
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
   */
  async *evaluateStream(prompt, options = {}) {
    const {
      model = 'gemma3',
      systemPrompt = '',
      temperature = 0.3
    } = options;

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
