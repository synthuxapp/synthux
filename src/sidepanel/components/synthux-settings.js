/**
 * synthux — Settings Component
 * 
 * <synthux-settings> — Minimal settings panel
 * Ollama connection, setup guide, language, about
 */

import { LitElement, html, css } from 'lit';

export class SynthuxSettings extends LitElement {
  static properties = {
    ollamaStatus: { type: Object },
    endpoint: { type: String },
    model: { type: String },
    models: { type: Array },
    language: { type: String },
    connectionState: { type: String },
    showSetupGuide: { type: Boolean },
    errorType: { type: String },
    _saved: { type: Boolean, state: true }
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .section { margin-bottom: 24px; }

    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    .settings-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 14px;
    }

    /* ─── Fields ─────────────────────────────── */
    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }

    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 5px;
    }

    .field-input {
      width: 100%;
      padding: 8px 10px;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 150ms ease;
      box-sizing: border-box;
    }

    .field-input:focus {
      border-color: var(--sx-accent, #3b82f6);
    }

    .field-select {
      width: 100%;
      padding: 8px 10px;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2363636e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      padding-right: 28px;
    }

    .field-select:focus { border-color: var(--sx-accent, #3b82f6); }

    /* ─── Buttons ─────────────────────────────── */
    .test-btn {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      margin-top: 10px;
    }

    .test-btn:hover { border-color: var(--sx-border-hover, rgba(255,255,255,0.10)); }
    .test-btn.testing { color: var(--sx-accent, #3b82f6); }
    .test-btn.connected {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.2);
    }
    .test-btn.failed {
      color: var(--sx-error, #ef4444);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .save-btn {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      margin-top: 14px;
    }

    .save-btn:hover { background: var(--sx-accent-hover, #60a5fa); }
    .save-btn.saved { background: var(--sx-success, #22c55e); }

    /* ─── Language ────────────────────────────── */
    .lang-options { display: flex; gap: 6px; }

    .lang-btn {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      text-align: center;
      font-family: inherit;
    }

    .lang-btn:hover { border-color: var(--sx-border-hover, rgba(255,255,255,0.10)); }
    .lang-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    /* ─── Setup Guide ────────────────────────── */
    .setup-guide {
      margin-bottom: 20px;
    }

    .setup-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .setup-toggle:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .setup-chevron {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      transition: transform 150ms ease;
    }

    .setup-chevron.open { transform: rotate(90deg); }

    .setup-content {
      margin-top: 8px;
      padding: 14px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
    }

    .setup-step {
      margin-bottom: 14px;
    }

    .setup-step:last-child { margin-bottom: 0; }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--sx-accent-dim, rgba(59,130,246,0.12));
      color: var(--sx-accent, #3b82f6);
      font-size: 10px;
      font-weight: 700;
      margin-right: 6px;
    }

    .step-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 5px;
    }

    .step-desc {
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 6px;
    }

    .code-block {
      position: relative;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      padding: 8px 10px;
      padding-top: 28px;
    }

    .code-block code {
      display: block;
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 11px;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
      text-align: left;
    }

    .copy-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 3px 8px;
      border: none;
      border-radius: 4px;
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .copy-btn:hover {
      color: var(--sx-text-primary, #ededf0);
    }

    .copy-btn.copied {
      color: var(--sx-success, #22c55e);
    }

    .error-hint {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
      border: 1px solid rgba(234, 179, 8, 0.15);
      border-radius: 8px;
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-top: 10px;
    }

    .error-hint-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sx-warning, #eab308);
      flex-shrink: 0;
      margin-top: 5px;
    }

    .error-hint strong {
      color: var(--sx-warning, #eab308);
    }

    /* ─── About ──────────────────────────────── */
    .about-card {
      text-align: center;
      padding: 20px 14px;
    }

    .about-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 2px;
    }

    .about-version {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 10px;
    }

    .about-desc {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .about-links { display: flex; gap: 16px; justify-content: center; }

    .about-link {
      font-size: 12px;
      color: var(--sx-accent, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }

    .about-link:hover { text-decoration: underline; }

    .about-license {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 10px;
    }
  `;

  constructor() {
    super();
    this.ollamaStatus = { connected: false, models: [] };
    this.endpoint = 'http://localhost:11434';
    this.model = 'gemma4:31b';
    this.models = [];
    this.language = 'en';
    this.connectionState = 'idle';
    this.showSetupGuide = false;
    this.errorType = '';
    this._saved = false;
    this._copiedCmd = '';
    this._loadSettings();
  }

  async _loadSettings() {
    try {
      const settings = await chrome.storage.local.get({
        ollamaEndpoint: 'http://localhost:11434',
        ollamaModel: 'gemma4:31b',
        language: 'en'
      });
      this.endpoint = settings.ollamaEndpoint;
      this.model = settings.ollamaModel;
      this.language = settings.language;
      if (this.ollamaStatus?.connected) {
        this.models = (this.ollamaStatus.models || []).map(m => m.name || m);
      }
    } catch { /* defaults */ }
  }

  async _testConnection() {
    this.connectionState = 'testing';
    this.errorType = '';
    try {
      const response = await fetch(`${this.endpoint}/api/tags`, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        const data = await response.json();
        this.models = (data.models || []).map(m => m.name);
        this.connectionState = 'connected';
        this.errorType = '';
        if (this.models.length > 0 && !this.models.includes(this.model)) {
          this.model = this.models[0];
        }
        this.dispatchEvent(new CustomEvent('status-changed', {
          detail: { connected: true, models: data.models || [] }
        }));
      } else if (response.status === 403) {
        this.connectionState = 'failed';
        this.errorType = 'cors';
        this.showSetupGuide = true;
        this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, models: [] } }));
      } else {
        this.connectionState = 'failed';
        this.errorType = 'unknown';
        this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, models: [] } }));
      }
    } catch (err) {
      this.connectionState = 'failed';
      this.errorType = err.name === 'TimeoutError' ? 'timeout' : 'offline';
      this.showSetupGuide = true;
      this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, models: [] } }));
    }
    setTimeout(() => { 
      if (this.connectionState === 'connected') this.connectionState = 'idle'; 
    }, 3000);
  }

  async _saveSettings() {
    try {
      await chrome.runtime.sendMessage({
        type: 'SAVE_SETTINGS',
        payload: { ollamaEndpoint: this.endpoint, ollamaModel: this.model, language: this.language }
      });
      this._saved = true;
      setTimeout(() => { this._saved = false; }, 2000);
    } catch (err) { console.error('[synthux] Failed to save:', err); }
  }

  async _copyCommand(text, id) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this._copiedCmd = id;
    this.requestUpdate();
    setTimeout(() => { this._copiedCmd = ''; this.requestUpdate(); }, 2000);
  }

  _getTestLabel() {
    switch (this.connectionState) {
      case 'testing': return 'Testing...';
      case 'connected': return 'Connected';
      case 'failed': 
        if (this.errorType === 'cors') return 'Blocked (CORS)';
        if (this.errorType === 'timeout') return 'Timed out';
        if (this.errorType === 'offline') return 'Not reachable';
        return 'Connection failed';
      default: return 'Test Connection';
    }
  }

  render() {
    return html`
      <div class="section">
        <div class="section-header">Connection</div>
        <div class="settings-card">
          <div class="field">
            <label class="field-label">Endpoint</label>
            <input class="field-input" type="url" .value="${this.endpoint}" @input="${(e) => this.endpoint = e.target.value}" placeholder="http://localhost:11434" />
          </div>
          <div class="field">
            <label class="field-label">Model</label>
            ${this.models.length > 0 ? html`
              <select class="field-select" .value="${this.model}" @change="${(e) => this.model = e.target.value}">
                ${this.models.map(m => html`<option value="${m}" ?selected="${m === this.model}">${m}</option>`)}
              </select>
            ` : html`
              <input class="field-input" type="text" .value="${this.model}" @input="${(e) => this.model = e.target.value}" placeholder="gemma4:31b" />
            `}
          </div>
          <button class="test-btn ${this.connectionState}" @click="${this._testConnection}" ?disabled="${this.connectionState === 'testing'}">${this._getTestLabel()}</button>
        </div>

        ${this.errorType === 'cors' ? html`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>CORS blocked.</strong> Ollama needs permission to accept requests from Chrome extensions. See the setup guide below.
            </div>
          </div>
        ` : ''}

        ${this.errorType === 'offline' || this.errorType === 'timeout' ? html`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Ollama not running.</strong> Make sure Ollama is installed and running on your machine.
            </div>
          </div>
        ` : ''}
      </div>

      <div class="setup-guide">
        <button class="setup-toggle" @click="${() => this.showSetupGuide = !this.showSetupGuide}">
          Ollama Setup Guide
          <span class="setup-chevron ${this.showSetupGuide ? 'open' : ''}">▶</span>
        </button>

        ${this.showSetupGuide ? html`
          <div class="setup-content">
            <div class="setup-step">
              <div class="step-title"><span class="step-number">1</span> Install Ollama</div>
              <div class="step-desc">Download from ollama.com and install. Available for macOS, Linux, and Windows.</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'url' ? 'copied' : ''}" @click="${() => this._copyCommand('https://ollama.com/download', 'url')}">${this._copiedCmd === 'url' ? 'Copied' : 'Copy'}</button>
                <code>https://ollama.com/download</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Download a model</div>
              <div class="step-desc">Pull a language model. Gemma 4, Qwen, or Llama recommended.</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'pull' ? 'copied' : ''}" @click="${() => this._copyCommand('ollama pull gemma4', 'pull')}">${this._copiedCmd === 'pull' ? 'Copied' : 'Copy'}</button>
                <code>ollama pull gemma4</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Enable Chrome extension access</div>
              <div class="step-desc">Ollama blocks browser extensions by default. Choose your platform:</div>
              <div class="step-desc"><strong>macOS (app):</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'macos' ? 'copied' : ''}" @click="${() => this._copyCommand('launchctl setenv OLLAMA_ORIGINS \\"*\\"', 'macos')}">${this._copiedCmd === 'macos' ? 'Copied' : 'Copy'}</button>
                <code>launchctl setenv OLLAMA_ORIGINS "*"</code>
              </div>
              <div class="step-desc" style="margin-top: 8px;"><strong>Linux / Terminal:</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'linux' ? 'copied' : ''}" @click="${() => this._copyCommand('export OLLAMA_ORIGINS=\\"*\\"\nollama serve', 'linux')}">${this._copiedCmd === 'linux' ? 'Copied' : 'Copy'}</button>
                <code>export OLLAMA_ORIGINS="*"
ollama serve</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">4</span> Restart Ollama</div>
              <div class="step-desc"><strong>Important:</strong> After running the command, quit Ollama from the menu bar and reopen it for changes to take effect.</div>
              <div class="step-desc" style="color: var(--sx-warning, #eab308);">\u26a0\ufe0f Ollama updates may reset this setting. If you get a CORS error after updating, repeat step 3 and restart.</div>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-header">Report Language</div>
        <div class="lang-options" style="gap: 4px;">
          <button class="lang-btn ${this.language === 'en' ? 'active' : ''}" @click="${() => this.language = 'en'}" style="padding: 6px 12px; font-size: 11px;">EN</button>
          <button class="lang-btn ${this.language === 'tr' ? 'active' : ''}" @click="${() => this.language = 'tr'}" style="padding: 6px 12px; font-size: 11px;">TR</button>
        </div>
      </div>

      <button class="save-btn ${this._saved ? 'saved' : ''}" @click="${this._saveSettings}">${this._saved ? 'Saved' : 'Save Settings'}</button>

      <div class="section" style="margin-top: 32px;">
        <div class="section-header">About</div>
        <div class="settings-card about-card">
          <div class="about-name">synthux</div>
          <div class="about-version">v1.0.0</div>
          <div class="about-desc">AI-powered UX audit. Open source. Privacy first.</div>
          <div class="about-links">
            <a class="about-link" href="https://synthux.app" target="_blank">Website</a>
            <a class="about-link" href="https://github.com/synthuxapp/synthux" target="_blank">GitHub</a>
          </div>
          <div class="about-license">MIT License</div>
        </div>
      </div>
    `;
  }
}

customElements.define('synthux-settings', SynthuxSettings);
