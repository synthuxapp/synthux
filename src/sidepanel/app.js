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
  `;

  constructor() {
    super();
    this.activeTab = 'scan';
    this.ollamaStatus = { connected: false, models: [] };
    this.report = null;
    this.reportHistory = [];
    this.analysisProgress = null;
    this.isAnalyzing = false;

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
          break;

        case 'ANALYSIS_ERROR':
          this.isAnalyzing = false;
          this.analysisProgress = null;
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
      const response = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const data = await response.json();
        this.ollamaStatus = { connected: true, models: data.models || [] };
      } else {
        this.ollamaStatus = { connected: false, models: [] };
      }
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

  render() {
    const isConnected = this.ollamaStatus?.connected;

    return html`
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img class="logo-img" src="../assets/logo.svg" alt="synthux" />
        </div>
        <div class="status-badge ${isConnected ? 'connected' : 'disconnected'}">
          <span class="status-dot ${isConnected ? 'connected' : 'disconnected'}"></span>
          ${isConnected ? 'Connected' : 'Offline'}
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
}

customElements.define('synthux-app', SynthuxApp);
