/**
 * synthux — Root Application Component
 * 
 * <synthux-app> — Main container with tab navigation
 * Tabs: Scan | Report | Settings
 */

import { LitElement, html, css } from 'lit';
import './components/synthux-scanner.js';
import './components/synthux-report.js';
import './components/synthux-settings.js';

export class SynthuxApp extends LitElement {
  static properties = {
    activeTab: { type: String },
    ollamaStatus: { type: Object },
    report: { type: Object },
    reportHistory: { type: Array },
    analysisProgress: { type: Object },
    isAnalyzing: { type: Boolean }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--sx-bg-primary, #111113);
      color: var(--sx-text-primary, #ededf0);
      font-family: var(--sx-font-family, 'Inter', sans-serif);
    }

    /* ─── Header ─────────────────────────────── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-secondary, #18181b);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-img {
      height: 20px;
      width: auto;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
    }

    .status-badge.connected {
      color: var(--sx-success, #22c55e);
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
    }

    .status-badge.cors-error {
      color: var(--sx-warning, #eab308);
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
    }

    .status-badge.version-warn {
      color: #f97316;
      background: rgba(249,115,22,0.10);
    }

    .status-badge.disconnected {
      color: var(--sx-text-tertiary, #8a8a96);
      background: var(--sx-bg-tertiary, #202024);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-dot.connected {
      background: var(--sx-success, #22c55e);
    }

    .status-dot.cors-error {
      background: var(--sx-warning, #eab308);
    }

    .status-dot.version-warn {
      background: #f97316;
    }

    .status-dot.disconnected {
      background: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Tabs ────────────────────────────────── */
    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-secondary, #18181b);
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      letter-spacing: 0.2px;
    }

    .tab:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .tab.active {
      color: var(--sx-text-primary, #ededf0);
      border-bottom-color: var(--sx-accent, #3b82f6);
    }

    /* ─── Content ─────────────────────────────── */
    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 200ms ease;
    }

    .tab-panel.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ─── Rating Toast ───────────────────────── */
    #rating-toast {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 12px;
      animation: slideUp 0.3s ease;
    }

    #rating-toast.rating-toast-exit {
      animation: slideDown 0.3s ease forwards;
    }

    .rating-toast {
      background: var(--sx-bg-secondary, #18181b);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 14px 16px;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
    }

    .rating-toast__header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }

    .rating-toast__icon {
      color: #eab308;
      font-size: 14px;
    }

    .rating-toast__title {
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .rating-toast__desc {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .rating-toast__actions {
      display: flex;
      gap: 8px;
    }

    .rating-toast__btn {
      flex: 1;
      padding: 7px 0;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 150ms ease;
    }

    .rating-toast__btn--primary {
      background: var(--sx-accent, #3b82f6);
      color: #fff;
    }

    .rating-toast__btn--primary:hover {
      background: #2563eb;
    }

    .rating-toast__btn--secondary {
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-tertiary, #8a8a96);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    .rating-toast__btn--secondary:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
  `;

  constructor() {
    super();
    this.activeTab = 'scan';
    this.ollamaStatus = { connected: false, models: [] };
    this.report = null;
    this.reportHistory = [];
    this.analysisProgress = null;
    this.isAnalyzing = false;

    // Connect port so service worker can detect panel close
    try { this._port = chrome.runtime.connect({ name: 'sidepanel' }); } catch {}

    this._setupMessageListeners();
    this._checkOllamaStatus();
    this._startHealthCheck();
    this._loadLastReport();
    this._loadHistory();
  }

  _setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message) => {
      switch (message.type) {
        case 'ANALYSIS_PROGRESS':
          this.analysisProgress = message.payload;
          this.isAnalyzing = true;
          break;

        case 'ANALYSIS_COMPLETE':
          this.report = message.payload;
          this.isAnalyzing = false;
          this.analysisProgress = null;
          this.activeTab = 'report';
          this._loadHistory(); // refresh history
          this._maybeShowRatingPrompt();
          break;

        case 'ANALYSIS_ERROR':
          this.isAnalyzing = false;
          this.analysisProgress = null;
          // If CORS error, switch to scan tab and show fix wizard
          if (msg.payload?.errorType === 'cors') {
            this.ollamaStatus = { ...this.ollamaStatus, connected: false, corsBlocked: true };
            this.activeTab = 'scan';
          }
          break;

        case 'ANALYSIS_CANCELLED':
          this.isAnalyzing = false;
          this.analysisProgress = null;
          break;
      }
    });
  }

  async _checkOllamaStatus() {
    try {
      const status = await chrome.runtime.sendMessage({ type: 'GET_OLLAMA_STATUS' });
      this.ollamaStatus = status || { connected: false, models: [] };
    } catch {
      this.ollamaStatus = { connected: false, models: [] };
    }
  }

  _startHealthCheck() {
    this._healthInterval = setInterval(() => this._checkOllamaStatus(), 15000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._healthInterval) clearInterval(this._healthInterval);
  }

  async _loadLastReport() {
    try {
      const data = await chrome.storage.local.get('lastReport');
      if (data.lastReport) {
        this.report = data.lastReport;
      }
    } catch {
      // No saved report
    }
  }

  async _loadHistory() {
    try {
      const history = await chrome.runtime.sendMessage({ type: 'GET_REPORT_HISTORY' });
      this.reportHistory = history || [];
    } catch {
      this.reportHistory = [];
    }
  }

  async _loadHistoryReport(e) {
    const { id } = e.detail;
    try {
      const result = await chrome.runtime.sendMessage({ type: 'LOAD_REPORT', payload: { id } });
      if (result?.report) {
        this.report = result.report;
        this.activeTab = 'report';
      }
    } catch (err) {
      console.error('[synthux] Failed to load report:', err);
    }
  }

  async _deleteHistoryReport(e) {
    const { id } = e.detail;
    try {
      const result = await chrome.runtime.sendMessage({ type: 'DELETE_REPORT', payload: { id } });
      if (result?.success) {
        this.reportHistory = result.history;
      }
    } catch (err) {
      console.error('[synthux] Failed to delete report:', err);
    }
  }

  _setTab(tab) {
    this.activeTab = tab;
    if (tab === 'scan') this._checkOllamaStatus();
  }

  _handleAnalysisStart() {
    this.isAnalyzing = true;
  }

  _handleAnalysisEnd() {
    this.isAnalyzing = false;
    this.analysisProgress = null;
  }

  _getStatusInfo() {
    const s = this.ollamaStatus;
    if (s?.connected && s?.versionChanged) return { cls: 'version-warn', label: `Updated (${s.newVersion})` };
    if (s?.connected) return { cls: 'connected', label: 'Connected' };
    if (s?.corsBlocked) return { cls: 'cors-error', label: 'CORS Error' };
    return { cls: 'disconnected', label: 'Offline' };
  }

  render() {
    const status = this._getStatusInfo();

    return html`
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img class="logo-img" src="../assets/logo.svg" alt="synthux" />
        </div>
        <div class="status-badge ${status.cls}">
          <span class="status-dot ${status.cls}"></span>
          ${status.label}
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar" role="tablist">
        <button 
          class="tab ${this.activeTab === 'scan' ? 'active' : ''}"
          role="tab"
          aria-selected="${this.activeTab === 'scan'}"
          @click="${() => this._setTab('scan')}"
        >Scan</button>
        <button 
          class="tab ${this.activeTab === 'report' ? 'active' : ''}"
          role="tab"
          aria-selected="${this.activeTab === 'report'}"
          @click="${() => this._setTab('report')}"
        >Report</button>
        <button 
          class="tab ${this.activeTab === 'history' ? 'active' : ''}"
          role="tab"
          aria-selected="${this.activeTab === 'history'}"
          @click="${() => { this._setTab('history'); this._loadHistory(); }}"
        >History</button>
        <button 
          class="tab ${this.activeTab === 'settings' ? 'active' : ''}"
          role="tab"
          aria-selected="${this.activeTab === 'settings'}"
          @click="${() => this._setTab('settings')}"
        >Settings</button>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="tab-panel ${this.activeTab === 'scan' ? 'active' : ''}" role="tabpanel">
          <synthux-scanner
            .ollamaStatus="${this.ollamaStatus}"
            .isAnalyzing="${this.isAnalyzing}"
            .progress="${this.analysisProgress}"
            @analysis-start="${this._handleAnalysisStart}"
            @analysis-end="${this._handleAnalysisEnd}"
          ></synthux-scanner>
        </div>

        <div class="tab-panel ${this.activeTab === 'report' ? 'active' : ''}" role="tabpanel">
          <synthux-report
            .report="${this.report}"
          ></synthux-report>
        </div>

        <div class="tab-panel ${this.activeTab === 'history' ? 'active' : ''}" role="tabpanel">
          <synthux-report
            .report="${null}"
            .history="${this.reportHistory}"
            showHistory
            @load-report="${this._loadHistoryReport}"
            @delete-report="${this._deleteHistoryReport}"
          ></synthux-report>
        </div>

        <div class="tab-panel ${this.activeTab === 'settings' ? 'active' : ''}" role="tabpanel">
          <synthux-settings
            .ollamaStatus="${this.ollamaStatus}"
            @status-changed="${(e) => this.ollamaStatus = e.detail}"
          ></synthux-settings>
        </div>
      </div>
    `;
  }
  async _maybeShowRatingPrompt() {
    try {
      const data = await chrome.storage.local.get(['synthux_rating_dismissed', 'synthux_analysis_count']);
      if (data.synthux_rating_dismissed) return;

      const count = (data.synthux_analysis_count || 0) + 1;
      await chrome.storage.local.set({ synthux_analysis_count: count });

      if (count < 1) return; // Show after 1st analysis

      // Small delay so report renders first
      setTimeout(() => this._showRatingToast(), 2000);
    } catch { /* storage error — skip */ }
  }

  _showRatingToast() {
    // Don't show if already visible
    if (this.shadowRoot.getElementById('rating-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'rating-toast';
    toast.innerHTML = `
      <div class="rating-toast">
        <div class="rating-toast__header">
          <span class="rating-toast__icon">★</span>
          <span class="rating-toast__title">Enjoying synthux?</span>
        </div>
        <p class="rating-toast__desc">A quick rating on the Chrome Web Store helps others discover synthux.</p>
        <div class="rating-toast__actions">
          <button class="rating-toast__btn rating-toast__btn--primary" id="rating-rate">Rate synthux</button>
          <button class="rating-toast__btn rating-toast__btn--secondary" id="rating-dismiss">Maybe later</button>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(toast);

    toast.querySelector('#rating-rate').addEventListener('click', () => {
      window.open('https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm/reviews', '_blank');
      chrome.storage.local.set({ synthux_rating_dismissed: true });
      toast.remove();
    });

    toast.querySelector('#rating-dismiss').addEventListener('click', () => {
      chrome.storage.local.set({ synthux_rating_dismissed: true });
      toast.classList.add('rating-toast-exit');
      setTimeout(() => toast.remove(), 300);
    });
  }
}

customElements.define('synthux-app', SynthuxApp);
