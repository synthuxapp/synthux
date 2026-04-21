/**
 * synthux — Scanner Component
 * 
 * <synthux-scanner> — Main scanning control panel
 * Minimal design: profile toggles, mode selector, analyze button
 */

import { LitElement, html, css } from 'lit';
import './synthux-score.js';

export class SynthuxScanner extends LitElement {
  static properties = {
    ollamaStatus: { type: Object },
    isAnalyzing: { type: Boolean },
    progress: { type: Object },
    pageInfo: { type: Object },
    selectedProfiles: { type: Array },
    mode: { type: String },
    logEntries: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    /* ─── Page Info ──────────────────────────── */
    .page-info {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 3px;
    }

    .page-url {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ─── Section Headers ────────────────────── */
    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    /* ─── Profile Cards ──────────────────────── */
    .profiles {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
      user-select: none;
    }

    .profile-card:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .profile-card.selected {
      border-color: var(--sx-accent, #3b82f6);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .profile-details {
      flex: 1;
      min-width: 0;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
    }

    .profile-desc {
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-top: 1px;
    }

    .profile-check {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1.5px solid var(--sx-border-hover, rgba(255,255,255,0.10));
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms ease;
      font-size: 10px;
    }

    .profile-card.selected .profile-check {
      background: var(--sx-accent, #3b82f6);
      border-color: var(--sx-accent, #3b82f6);
      color: white;
    }

    .profile-card.selected .profile-check::after {
      content: '✓';
      font-weight: 700;
    }

    /* ─── Mode Selector ──────────────────────── */
    .mode-selector {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
    }

    .mode-btn {
      flex: 1;
      padding: 9px;
      border-radius: 8px;
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

    .mode-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .mode-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .mode-label {
      font-size: 13px;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .mode-desc {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 400;
    }

    /* ─── Analyze Button ─────────────────────── */
    .analyze-btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .analyze-btn:hover:not(:disabled) {
      background: var(--sx-accent-hover, #60a5fa);
    }

    .analyze-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .analyze-btn.analyzing {
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    /* ─── Progress Display ───────────────────── */
    .progress-container {
      margin-top: 16px;
    }

    .progress-bar-wrapper {
      width: 100%;
      height: 3px;
      background: var(--sx-bg-tertiary, #202024);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .progress-bar-fill {
      height: 100%;
      background: var(--sx-accent, #3b82f6);
      border-radius: 2px;
      transition: width 400ms ease;
    }

    .cancel-btn {
      width: 100%;
      margin-top: 10px;
      padding: 7px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 11px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .cancel-btn:hover {
      color: var(--sx-error, #ef4444);
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* ─── Offline Notice ─────────────────────── */
    .offline-notice {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
    }

    .offline-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sx-warning, #eab308);
      flex-shrink: 0;
      margin-top: 6px;
    }

    .page-warning {
      font-size: 12px;
      color: var(--sx-text-tertiary, #8a8a96);
      text-align: center;
      padding: 8px;
      font-style: italic;
    }

    /* ─── Terminal Log ─────────────────────── */
    .terminal {
      margin-top: 12px;
      background: #0a0a0c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .terminal-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .terminal-dot.red { background: #ff5f57; }
    .terminal-dot.yellow { background: #febc2e; }
    .terminal-dot.green { background: #28c840; }

    .terminal-title {
      flex: 1;
      text-align: center;
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-family: 'SF Mono', Monaco, monospace;
    }

    .terminal-body {
      padding: 8px 10px;
      max-height: 140px;
      overflow-y: auto;
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 10px;
      line-height: 1.7;
    }

    .terminal-body::-webkit-scrollbar { width: 3px; }
    .terminal-body::-webkit-scrollbar-track { background: transparent; }
    .terminal-body::-webkit-scrollbar-thumb { background: #1a1a1e; border-radius: 3px; }

    .log-line {
      display: flex;
      gap: 6px;
      white-space: nowrap;
    }

    .log-time {
      color: #555;
      flex-shrink: 0;
    }

    .log-prefix {
      color: var(--sx-accent, #3b82f6);
      flex-shrink: 0;
    }

    .log-msg {
      color: #8b8b8b;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .log-msg.success { color: var(--sx-success, #22c55e); }
    .log-msg.active { color: var(--sx-text-primary, #ededf0); }
  `;

  constructor() {
    super();
    this.ollamaStatus = { connected: false, models: [] };
    this.isAnalyzing = false;
    this.progress = null;
    this.pageInfo = null;
    this.selectedProfiles = ['first-time', 'power-user', 'accessibility'];
    this.mode = 'deep';
    this.logEntries = [];

    this._fetchPageInfo();
    chrome.tabs?.onActivated?.addListener(() => this._fetchPageInfo());
    chrome.tabs?.onUpdated?.addListener((_, info) => {
      if (info.status === 'complete') this._fetchPageInfo();
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('progress') && this.progress) {
      this._addLogEntry(this.progress);
    }
    if (changedProperties.has('isAnalyzing')) {
      if (this.isAnalyzing) {
        this.logEntries = [{ time: this._logTime(), msg: 'Starting analysis...', done: false }];
      } else if (this.logEntries.length > 0) {
        const last = { ...this.logEntries[this.logEntries.length - 1], done: true };
        this.logEntries = [...this.logEntries.slice(0, -1), last, { time: this._logTime(), msg: 'Done.', done: true }];
      }
    }
    const el = this.shadowRoot?.getElementById('terminal-log');
    if (el) el.scrollTop = el.scrollHeight;
  }

  _addLogEntry(progress) {
    const msg = progress.message || '';
    if (!msg) return;
    const last = this.logEntries[this.logEntries.length - 1];
    if (last && last.msg === msg) return;
    this.logEntries = [...this.logEntries, { time: this._logTime(), msg, done: false }];
  }

  _logTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
  }

  get _isAnalyzablePage() {
    const url = this.pageInfo?.url || '';
    return url.startsWith('http://') || url.startsWith('https://');
  }

  async _fetchPageInfo() {
    if (this.isAnalyzing) return;
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.pageInfo = {
          title: tab.title || 'Untitled',
          url: tab.url || ''
        };
      }
    } catch {
      this.pageInfo = { title: 'Unable to detect page', url: '' };
    }
  }

  _toggleProfile(profileId) {
    if (this.isAnalyzing) return;
    const profiles = [...this.selectedProfiles];
    const index = profiles.indexOf(profileId);
    if (index > -1) {
      if (profiles.length > 1) profiles.splice(index, 1);
    } else {
      profiles.push(profileId);
    }
    this.selectedProfiles = profiles;
  }

  _setMode(mode) {
    if (!this.isAnalyzing) this.mode = mode;
  }

  async _startAnalysis() {
    if (this.isAnalyzing || !this.ollamaStatus?.connected) return;
    this.dispatchEvent(new CustomEvent('analysis-start'));
    try {
      await chrome.runtime.sendMessage({
        type: 'START_ANALYSIS',
        payload: { mode: this.mode, profiles: this.selectedProfiles }
      });
    } catch (err) {
      console.error('[synthux] Failed to start analysis:', err);
      this.dispatchEvent(new CustomEvent('analysis-end'));
    }
  }

  async _cancelAnalysis() {
    try {
      await chrome.runtime.sendMessage({ type: 'CANCEL_ANALYSIS' });
    } catch { /* ignore */ }
    this.dispatchEvent(new CustomEvent('analysis-end'));
  }

  _renderProfileCard(id, name, desc) {
    const isSelected = this.selectedProfiles.includes(id);
    return html`
      <div 
        class="profile-card ${isSelected ? 'selected' : ''}"
        @click="${() => this._toggleProfile(id)}"
        role="checkbox"
        aria-checked="${isSelected}"
        tabindex="0"
        @keydown="${(e) => e.key === 'Enter' && this._toggleProfile(id)}"
      >
        <div class="profile-details">
          <div class="profile-name">${name}</div>
          <div class="profile-desc">${desc}</div>
        </div>
        <div class="profile-check"></div>
      </div>
    `;
  }

  render() {
    const isConnected = this.ollamaStatus?.connected;
    const canAnalyze = isConnected && this._isAnalyzablePage && this.selectedProfiles.length > 0;

    return html`
      ${this.pageInfo ? html`
        <div class="page-info">
          <div class="page-title">${this.pageInfo.title}</div>
          <div class="page-url">${this.pageInfo.url}</div>
          ${!this._isAnalyzablePage && this.pageInfo.url ? html`
            <div class="page-warning">Navigate to a website to analyze.</div>
          ` : ''}
        </div>
      ` : ''}

      ${!isConnected ? html`
        <div class="offline-notice">
          <span class="offline-dot"></span>
          <div>
            <strong>Ollama not connected.</strong> Check Settings to configure your connection.
          </div>
        </div>
      ` : ''}

      <div class="section-header">Profiles</div>
      <div class="profiles">
        ${this._renderProfileCard('first-time', 'First-Time Visitor', 'New to the site, exploring for the first time')}
        ${this._renderProfileCard('power-user', 'Power User', 'Experienced, focused on speed and efficiency')}
        ${this._renderProfileCard('accessibility', 'Accessibility User', 'Relies on screen reader and keyboard')}
      </div>

      <div class="section-header">Mode</div>
      <div class="mode-selector">
        <button class="mode-btn ${this.mode === 'quick' ? 'active' : ''}" @click="${() => this._setMode('quick')}">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">3 heuristics · ~9 min</span>
        </button>
        <button class="mode-btn ${this.mode === 'deep' ? 'active' : ''}" @click="${() => this._setMode('deep')}">
          <span class="mode-label">Deep</span>
          <span class="mode-desc">10 heuristics · ~20 min</span>
        </button>
      </div>

      ${this.isAnalyzing ? html`
        <button class="analyze-btn analyzing" disabled>Analyzing...</button>
      ` : html`
        <button 
          class="analyze-btn"
          ?disabled="${!canAnalyze}"
          @click="${this._startAnalysis}"
        >Analyze Page</button>
      `}

      ${this.isAnalyzing && this.progress ? html`
        <div class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${this.progress.percent || 0}%"></div>
          </div>

          <div class="terminal">
            <div class="terminal-header">
              <span class="terminal-title">synthux — analysis</span>
            </div>
            <div class="terminal-body" id="terminal-log">
              ${this.logEntries.map((entry, i) => html`
                <div class="log-line">
                  <span class="log-time">${entry.time}</span>
                  <span class="log-prefix">▶</span>
                  <span class="log-msg ${i === this.logEntries.length - 1 ? 'active' : ''} ${entry.done ? 'success' : ''}">${entry.msg}</span>
                </div>
              `)}
            </div>
          </div>

          <button class="cancel-btn" @click="${this._cancelAnalysis}">Cancel</button>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('synthux-scanner', SynthuxScanner);
