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

  updated(changedProperties) {
    // When ollamaStatus arrives from parent, auto-populate models for Ollama
    if (changedProperties.has('ollamaStatus') && this.ollamaStatus?.connected && this.providerId === 'ollama') {
      const newModels = (this.ollamaStatus.models || []).map(m => m.name || m.id || m);
      if (newModels.length > 0 && JSON.stringify(newModels) !== JSON.stringify(this.models)) {
        this.models = newModels;
        // Keep saved model if it exists in the list, otherwise don't override
        if (this.model && !this.models.includes(this.model) && this.models.length > 0) {
          // Saved model not available — keep the text input value, don't auto-switch
        }
      }
    }
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
    } catch { /* defaults */ }
  }

  async _testConnection() {
    this.connectionState = 'testing';
    this.errorType = '';
    const provider = getProvider(this.providerId);

    try {
      const pingResult = await provider.ping(this.endpoint, this.apiKey);

      // Ollama returns status object, cloud providers return boolean
      const isConnected = typeof pingResult === 'object'
        ? pingResult.status === 'connected'
        : !!pingResult;
      const isCorsBlocked = typeof pingResult === 'object' && pingResult.status === 'cors-blocked';

      if (isConnected) {
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
      } else if (isCorsBlocked) {
        this.connectionState = 'failed';
        this.errorType = 'cors';
        this.showSetupGuide = true;
        this.dispatchEvent(new CustomEvent('status-changed', { detail: { connected: false, corsBlocked: true, models: [] } }));
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
      // Only reset model if current model is not in list and no saved model exists
      if (this.models.length > 0 && !this.models.includes(this.model)) {
        // Saved model not in Ollama — keep it as typed text, don't auto-switch
      } else if (!this.model) {
        this.model = this.models[0] || 'gemma4:31b';
      }
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

  _detectOS() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) return 'mac';
    if (ua.includes('win')) return 'win';
    return 'linux';
  }

  _getCorsCommand() {
    const os = this._detectOS();
    if (os === 'mac') return 'launchctl setenv OLLAMA_ORIGINS "*"';
    if (os === 'win') return '[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")';
    return 'sudo systemctl edit ollama';
  }

  _getCorsNote() {
    const os = this._detectOS();
    if (os === 'win') return 'Run in PowerShell as Administrator';
    if (os === 'linux') return 'Add under [Service]: Environment="OLLAMA_ORIGINS=*"';
    return null;
  }

  _getOtherPlatformCommands() {
    const os = this._detectOS();
    const all = {
      mac: { name: 'macOS', cmd: 'launchctl setenv OLLAMA_ORIGINS "*"' },
      linux: { name: 'Linux', cmd: 'sudo systemctl edit ollama → Environment="OLLAMA_ORIGINS=*"' },
      win: { name: 'Windows', cmd: '[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")' }
    };
    const others = Object.entries(all).filter(([k]) => k !== os);
    return html`${others.map(([, p]) => html`<div style="margin-bottom: 4px;"><strong>${p.name}:</strong> <code style="font-size: 10px;">${p.cmd}</code></div>`)}`;
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
              <div class="step-desc">Download from ollama.com and install.</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'url' ? 'copied' : ''}" @click="${() => this._copyCommand('https://ollama.com/download', 'url')}">${this._copiedCmd === 'url' ? 'Copied' : 'Copy'}</button>
                <code>https://ollama.com/download</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Download a model</div>
              <div class="step-desc">Pull a language model. Any model works:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'pull' ? 'copied' : ''}" @click="${() => this._copyCommand('ollama pull gemma4', 'pull')}">${this._copiedCmd === 'pull' ? 'Copied' : 'Copy'}</button>
                <code>ollama pull gemma4</code>
              </div>
              <div class="step-desc" style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary);">Alternatives: <code style="font-size: 10px;">ollama pull gemma4:e4b</code> (smaller) or <code style="font-size: 10px;">ollama pull qwen3.5</code></div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Allow extension access</div>
              <div class="step-desc">Ollama blocks browser extensions by default. Run this in Terminal:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd === 'cors' ? 'copied' : ''}" @click="${() => this._copyCommand(this._getCorsCommand(), 'cors')}">${this._copiedCmd === 'cors' ? 'Copied' : 'Copy'}</button>
                <code>${this._getCorsCommand()}</code>
              </div>
              ${this._getCorsNote() ? html`<div class="step-desc" style="margin-top: 4px; font-size: 10px; color: var(--sx-text-tertiary);">${this._getCorsNote()}</div>` : ''}
              <details style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary);">
                <summary style="cursor: pointer;">Other platforms</summary>
                <div style="padding: 6px 0;">${this._getOtherPlatformCommands()}</div>
              </details>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">4</span> Quit and restart Ollama</div>
              <div class="step-desc">Close Ollama completely, then reopen it. The CORS setting won't take effect until restarted.</div>
              <div class="step-desc" style="font-size: 10px; color: var(--sx-text-tertiary);">Ollama updates may reset this setting. If you get a CORS error after updating, repeat step 3 and restart.</div>
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
          <div class="about-version">v${chrome.runtime?.getManifest?.()?.version || '1.9.0'}</div>
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
