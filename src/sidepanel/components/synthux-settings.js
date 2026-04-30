/**
 * synthux — Settings Component
 * 
 * <synthux-settings> — Minimal settings panel
 * Ollama connection, setup guide, language, about
 */

import { LitElement, html, css } from 'lit';
import { getProvider, getProviderList } from '../../../extension/core/providers.js';
import { getCustomProfiles, saveCustomProfile, deleteCustomProfile } from '../../../extension/core/profiles.js';

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
    providerId: { type: String },
    apiKey: { type: String },
    enableVision: { type: Boolean },
    _saved: { type: Boolean, state: true },
    _customProfiles: { type: Array, state: true },
    _showProfileForm: { type: Boolean, state: true }
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

    /* ─── API Key ─────────────────────────── */
    .field-input.api-key {
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    .api-key-hint {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 4px;
      line-height: 1.4;
    }

    .api-key-hint a {
      color: var(--sx-accent, #3b82f6);
      text-decoration: none;
    }

    .provider-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      color: var(--sx-accent, #3b82f6);
      margin-left: 6px;
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

    /* ─── Toggle Switch ──────────────────────── */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 22px;
      transition: all 200ms ease;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      left: 2px;
      bottom: 2px;
      background: var(--sx-text-tertiary, #8a8a96);
      border-radius: 50%;
      transition: all 200ms ease;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--sx-accent-dim, rgba(59,130,246,0.15));
      border-color: var(--sx-accent, #3b82f6);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(18px);
      background: var(--sx-accent, #3b82f6);
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
    this.providerId = 'ollama';
    this.apiKey = '';
    this.enableVision = true;
    this._saved = false;
    this._copiedCmd = '';
    this._customProfiles = [];
    this._showProfileForm = false;
    this._loadSettings();
    this._loadCustomProfiles();
  }

  get _isCloudProvider() {
    return this.providerId !== 'ollama';
  }

  async _loadSettings() {
    try {
      const settings = await chrome.storage.local.get({
        ollamaEndpoint: 'http://localhost:11434',
        ollamaModel: 'gemma4:31b',
        language: 'en',
        providerId: 'ollama',
        apiKey: '',
        apiKey_openai: '',
        apiKey_gemini: '',
        apiKey_claude: '',
        enableVision: true
      });
      this.endpoint = settings.ollamaEndpoint;
      this.model = settings.ollamaModel;
      this.language = settings.language;
      this.providerId = settings.providerId;
      // Load provider-specific API key
      this.apiKey = settings[`apiKey_${this.providerId}`] || settings.apiKey || '';
      this.enableVision = settings.enableVision !== false; // default true

      // Load provider-specific models
      this._updateModelsForProvider();

      if (this.ollamaStatus?.connected && this.providerId === 'ollama') {
        this.models = (this.ollamaStatus.models || []).map(m => m.name || m);
      }
    } catch { /* defaults */ }
  }

  async _testConnection() {
    this.connectionState = 'testing';
    this.errorType = '';
    const provider = getProvider(this.providerId);

    try {
      const connected = await provider.ping(this.endpoint, this.apiKey);

      if (connected) {
        // Fetch models
        const fetchedModels = await provider.fetchModels(this.endpoint, this.apiKey);
        this.models = fetchedModels.map(m => m.id || m.name);
        this.connectionState = 'connected';
        this.errorType = '';
        if (this.models.length > 0 && !this.models.includes(this.model)) {
          this.model = this.models[0];
        }
        this.dispatchEvent(new CustomEvent('status-changed', {
          detail: { connected: true, models: fetchedModels, provider: this.providerId }
        }));
      } else {
        this.connectionState = 'failed';
        this.errorType = this._isCloudProvider ? 'auth' : 'offline';
        if (!this._isCloudProvider) this.showSetupGuide = true;
        this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, models: [] } }));
      }
    } catch (err) {
      this.connectionState = 'failed';
      this.errorType = err.name === 'TimeoutError' ? 'timeout' : (this._isCloudProvider ? 'auth' : 'offline');
      if (!this._isCloudProvider) this.showSetupGuide = true;
      this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, models: [] } }));
    }
    setTimeout(() => { 
      if (this.connectionState === 'connected') this.connectionState = 'idle'; 
    }, 3000);
  }

  _updateModelsForProvider() {
    const provider = getProvider(this.providerId);
    if (this.providerId === 'ollama') {
      this.endpoint = 'http://localhost:11434';
      // Use live Ollama models if available, otherwise empty
      if (this.ollamaStatus?.connected && this.ollamaStatus?.provider === 'ollama') {
        this.models = (this.ollamaStatus.models || []).map(m => m.name || m.id || m);
      } else {
        this.models = [];
      }
      // Reset to first available or default
      this.model = this.models[0] || 'gemma4:31b';
    } else {
      this.endpoint = provider.defaultEndpoint;
      this.models = (provider.models || []).map(m => m.id);
      if (this.models.length > 0 && !this.models.includes(this.model)) {
        this.model = this.models[0];
      }
    }
    this.connectionState = 'idle';
  }

  async _onProviderChange(e) {
    this.providerId = e.target.value;
    // Restore previously saved key for this provider
    try {
      const stored = await chrome.storage.local.get(`apiKey_${this.providerId}`);
      this.apiKey = stored[`apiKey_${this.providerId}`] || '';
    } catch {
      this.apiKey = '';
    }
    this._updateModelsForProvider();
    this._autoSave();
    // Auto-test if key exists
    if (this.apiKey && this.providerId !== 'ollama') {
      this._testConnection();
    }
  }

  _onApiKeyBlur() {
    if (this.apiKey && this.apiKey.length > 5) {
      this._autoSave();
      this._testConnection();
    }
  }

  _onModelChange(e) {
    this.model = e.target.value;
    this._autoSave();
  }

  _onLanguageChange(lang) {
    this.language = lang;
    this._autoSave();
  }

  _onEndpointBlur() {
    this._autoSave();
  }

  async _autoSave() {
    try {
      const saveData = {
        ollamaEndpoint: this.endpoint,
        ollamaModel: this.model,
        language: this.language,
        providerId: this.providerId,
        apiKey: this.apiKey,
        enableVision: this.enableVision
      };
      // Also save key per-provider so it persists across switches
      if (this.providerId !== 'ollama' && this.apiKey) {
        saveData[`apiKey_${this.providerId}`] = this.apiKey;
      }
      await chrome.runtime.sendMessage({
        type: 'SAVE_SETTINGS',
        payload: saveData
      });
      this._saved = true;
      clearTimeout(this._savedTimer);
      this._savedTimer = setTimeout(() => { this._saved = false; }, 2000);
    } catch (err) { console.error('[synthux] Auto-save failed:', err); }
  }

  async _saveSettings() {
    await this._autoSave();
  }

  async _loadCustomProfiles() {
    try {
      this._customProfiles = await getCustomProfiles();
    } catch {
      this._customProfiles = [];
    }
  }

  async _saveProfile() {
    const name = this.shadowRoot.getElementById('cp-name')?.value?.trim();
    if (!name) return;

    const ageRange = this.shadowRoot.getElementById('cp-age')?.value || '25-35';
    const techLevel = this.shadowRoot.getElementById('cp-tech')?.value || 'medium';
    const goal = this.shadowRoot.getElementById('cp-goal')?.value?.trim() || '';
    const disabilityCheckboxes = this.shadowRoot.querySelectorAll('.cp-disability:checked');
    const disabilities = Array.from(disabilityCheckboxes).map(cb => cb.value);

    try {
      await saveCustomProfile({
        name,
        description: `${ageRange}, ${techLevel} tech${goal ? ` — ${goal}` : ''}`,
        ageRange,
        techLevel,
        disabilities,
        goal,
        priorityHeuristics: [] // uses all heuristics by default
      });
      this._showProfileForm = false;
      await this._loadCustomProfiles();
      // Notify scanner to reload profiles
      this.dispatchEvent(new CustomEvent('profiles-changed', { bubbles: true, composed: true }));
    } catch (err) {
      console.error('[synthux] Failed to save profile:', err);
    }
  }

  async _deleteProfile(id) {
    try {
      await deleteCustomProfile(id);
      await this._loadCustomProfiles();
      this.dispatchEvent(new CustomEvent('profiles-changed', { bubbles: true, composed: true }));
    } catch (err) {
      console.error('[synthux] Failed to delete profile:', err);
    }
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
        if (this.errorType === 'auth') return 'Invalid API key';
        return 'Connection failed';
      default: return 'Test Connection';
    }
  }

  _getApiKeyHint() {
    switch (this.providerId) {
      case 'openai': return html`Get your key at <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a>`;
      case 'gemini': return html`Get your key at <a href="https://aistudio.google.com/apikey" target="_blank">AI Studio</a>`;
      case 'claude': return html`Get your key at <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>`;
      default: return '';
    }
  }

  render() {
    const providers = getProviderList();

    return html`
      <div class="section">
        <div class="section-header">AI Provider</div>
        <div class="settings-card">
          <div class="field">
            <label class="field-label">Provider</label>
            <select class="field-select" .value="${this.providerId}" @change="${this._onProviderChange}">
              ${providers.map(p => html`<option value="${p.id}" ?selected="${p.id === this.providerId}">${p.icon} ${p.name}</option>`)}
            </select>
          </div>

          ${this._isCloudProvider ? html`
            <div class="field">
              <label class="field-label">API Key</label>
              <input class="field-input api-key" type="password" .value="${this.apiKey}" @input="${(e) => this.apiKey = e.target.value}" @blur="${this._onApiKeyBlur}" placeholder="Enter API key..." />
              <div class="api-key-hint">${this._getApiKeyHint()}</div>
            </div>
          ` : html`
            <div class="field">
              <label class="field-label">Endpoint</label>
              <input class="field-input" type="url" .value="${this.endpoint}" @input="${(e) => this.endpoint = e.target.value}" @blur="${this._onEndpointBlur}" placeholder="http://localhost:11434" />
            </div>
          `}

          <div class="field">
            <label class="field-label">Model</label>
            ${this.models.length > 0 ? html`
              <select class="field-select" .value="${this.model}" @change="${this._onModelChange}">
                ${this.models.map(m => html`<option value="${m}" ?selected="${m === this.model}">${m}</option>`)}
              </select>
            ` : html`
              <input class="field-input" type="text" .value="${this.model}" @input="${(e) => this.model = e.target.value}" @blur="${() => this._autoSave()}" placeholder="gemma4:31b" />
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

        ${this.errorType === 'auth' ? html`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Invalid API key.</strong> Check your API key and try again.
            </div>
          </div>
        ` : ''}

        ${(this.errorType === 'offline' || this.errorType === 'timeout') && !this._isCloudProvider ? html`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Ollama not running.</strong> Make sure Ollama is installed and running on your machine.
            </div>
          </div>
        ` : ''}
      </div>

      ${!this._isCloudProvider ? html`
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
              <div class="step-desc">Pull a language model. Any model works — pick one that fits your hardware:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'pull' ? 'copied' : ''}" @click="${() => this._copyCommand('ollama pull gemma4', 'pull')}">${this._copiedCmd === 'pull' ? 'Copied' : 'Copy'}</button>
                <code>ollama pull gemma4</code>
              </div>
              <div class="step-desc" style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary, #8a8a96);">Alternatives: <code style="font-size: 10px;">ollama pull qwen3.5</code> or <code style="font-size: 10px;">ollama pull llama4</code></div>
              <div class="step-desc" style="margin-top: 4px; font-size: 10px; color: var(--sx-text-tertiary, #8a8a96);">Using <strong>LM Studio</strong>? Skip to step 3 — no model pull needed. Change the endpoint in Settings to <code style="font-size: 10px;">http://localhost:1234</code></div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Enable Chrome extension access</div>
              <div class="step-desc">Ollama blocks browser extensions by default. LM Studio users can skip this step.</div>
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
              <div class="step-desc" style="margin-top: 8px;"><strong>Windows (PowerShell):</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'win' ? 'copied' : ''}" @click="${() => this._copyCommand('[Environment]::SetEnvironmentVariable(\'OLLAMA_ORIGINS\', \'*\', \'User\')', 'win')}">${this._copiedCmd === 'win' ? 'Copied' : 'Copy'}</button>
                <code>[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")</code>
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
      ` : ''}

      <div class="section">
        <div class="section-header">Analysis</div>
        <div class="settings-card" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 13px; font-weight: 500; color: var(--sx-text-primary, #ededf0);">Screenshot Analysis</div>
            <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); margin-top: 2px;">Send page screenshot to AI for visual analysis</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" .checked="${this.enableVision}" @change="${(e) => { this.enableVision = e.target.checked; this._autoSave(); }}" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="save-indicator ${this._saved ? 'visible' : ''}" style="text-align: center; padding: 8px; font-size: 11px; color: var(--sx-success, #22c55e); opacity: ${this._saved ? '1' : '0'}; transition: opacity 300ms ease;">✓ Auto-saved</div>


      <div class="section" style="margin-top: 32px;">
        <div class="section-header">About</div>
        <div class="settings-card about-card">
          <div class="about-name">synthux</div>
          <div class="about-version">v${chrome.runtime?.getManifest?.()?.version || '1.7.0'}</div>
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
