/**
 * synthux — Report Component
 * 
 * <synthux-report> — Minimal report viewer
 * Score gauge, profile tabs, expandable heuristic cards, accessibility audit
 */

import { LitElement, html, css } from 'lit';
import './synthux-score.js';

export class SynthuxReport extends LitElement {
  static properties = {
    report: { type: Object },
    history: { type: Array },
    showHistory: { type: Boolean },
    activeProfile: { type: String },
    expandedHeuristic: { type: String },
    copied: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    /* ─── Empty State ────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 4px;
    }

    .empty-desc {
      font-size: 12px;
      color: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Overall Score ──────────────────────── */
    .overall-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0;
      margin-bottom: 16px;
    }

    .report-meta {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 10px;
      text-align: center;
      line-height: 1.6;
    }

    /* ─── Profile Tabs ───────────────────────── */
    .profile-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      overflow-x: auto;
    }

    .profile-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .profile-tab:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .profile-tab.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .profile-tab-score {
      font-weight: 700;
      font-size: 11px;
    }

    /* ─── Section Header ─────────────────────── */
    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
      margin-top: 8px;
    }

    /* ─── Heuristic Cards ────────────────────── */
    .heuristic-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
    }

    .heuristic-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .heuristic-card:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .heuristic-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .heuristic-score-badge {
      min-width: 36px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
    }

    .heuristic-score-badge.high {
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
      color: var(--sx-success, #22c55e);
    }

    .heuristic-score-badge.mid {
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
      color: var(--sx-warning, #eab308);
    }

    .heuristic-score-badge.low {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-error, #ef4444);
    }

    .heuristic-name {
      flex: 1;
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
    }

    .heuristic-chevron {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      transition: transform 150ms ease;
    }

    .heuristic-chevron.open {
      transform: rotate(90deg);
    }

    .heuristic-detail {
      padding: 0 12px 12px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.04));
    }

    .heuristic-summary {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      padding-top: 10px;
      margin-bottom: 10px;
    }

    /* ─── Issues ──────────────────────────────── */
    .issue-item {
      display: flex;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.04));
    }

    .issue-item:last-child { border-bottom: none; }

    .severity-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 6px;
    }

    .severity-dot.critical { background: var(--sx-error, #ef4444); }
    .severity-dot.moderate { background: var(--sx-warning, #eab308); }
    .severity-dot.minor { background: var(--sx-success, #22c55e); }

    .issue-content { flex: 1; }

    .issue-desc {
      font-size: 12px;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.4;
    }

    .issue-recommendation {
      font-size: 11px;
      color: var(--sx-accent, #3b82f6);
      margin-top: 3px;
      line-height: 1.4;
    }

    .issue-element {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      font-family: 'SF Mono', Monaco, monospace;
    }

    /* ─── Positives ──────────────────────────── */
    .positive-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 3px 0;
      font-size: 12px;
      color: var(--sx-success, #22c55e);
    }

    .positive-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--sx-success, #22c55e);
      flex-shrink: 0;
      margin-top: 6px;
    }

    /* ─── Accessibility Audit ────────────────── */
    .a11y-section { margin-bottom: 20px; }

    .a11y-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      overflow: hidden;
    }

    .a11y-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
    }

    .a11y-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .a11y-score-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .a11y-check {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.04));
      font-size: 12px;
    }

    .check-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .check-dot.pass { background: var(--sx-success, #22c55e); }
    .check-dot.warning { background: var(--sx-warning, #eab308); }
    .check-dot.fail { background: var(--sx-error, #ef4444); }

    .a11y-name {
      flex: 1;
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .a11y-message {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      max-width: 45%;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ─── Export Button ───────────────────────── */
    .export-bar {
      position: sticky;
      bottom: 0;
      padding: 12px 0;
      background: linear-gradient(transparent, var(--sx-bg-primary, #111113) 25%);
    }

    .export-btn {
      width: 100%;
      padding: 9px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .export-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-primary, #ededf0);
    }

    .export-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.2);
    }

    /* ─── History List ────────────────────────── */
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
    }

    .history-item:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .history-score {
      min-width: 36px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }

    .history-score.high {
      background: var(--sx-success-dim);
      color: var(--sx-success);
    }
    .history-score.mid {
      background: var(--sx-warning-dim);
      color: var(--sx-warning);
    }
    .history-score.low {
      background: var(--sx-error-dim);
      color: var(--sx-error);
    }

    .history-details {
      flex: 1;
      min-width: 0;
    }

    .history-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-meta {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-delete {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms ease;
      flex-shrink: 0;
    }

    .history-delete:hover {
      color: var(--sx-error, #ef4444);
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
    }

    .history-empty {
      text-align: center;
      padding: 32px 16px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
    }
  `;

  constructor() {
    super();
    this.report = null;
    this.history = [];
    this.showHistory = false;
    this.activeProfile = '';
    this.expandedHeuristic = '';
    this.copied = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('report') && this.report) {
      const profileIds = Object.keys(this.report.profileResults || {});
      if (profileIds.length > 0 && !this.activeProfile) {
        this.activeProfile = profileIds[0];
      }
    }
  }

  _toggleHeuristic(id) {
    this.expandedHeuristic = this.expandedHeuristic === id ? '' : id;
  }

  _getScoreClass(score) {
    if (score >= 71) return 'high';
    if (score >= 41) return 'mid';
    return 'low';
  }

  _downloadMarkdown() {
    if (!this.report?.markdown) return;
    const hostname = this._shortenUrl(this.report.url).replace(/[\/:.]/g, '-').replace(/-+/g, '-');
    const filename = `design-change-${hostname}.md`;
    const blob = new Blob([this.report.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.copied = true;
    setTimeout(() => { this.copied = false; }, 2000);
  }

  render() {
    // History mode
    if (this.showHistory) {
      return this._renderHistory();
    }

    if (!this.report) {
      return html`
        <div class="empty-state">
          <div class="empty-title">No report yet</div>
          <div class="empty-desc">Go to Scan tab to analyze a page.</div>
        </div>
      `;
    }

    const r = this.report;
    const activeResults = r.profileResults?.[this.activeProfile];

    return html`
      <div class="overall-section">
        <synthux-score value="${r.overallScore || 0}" label="Overall UX Score" size="lg"></synthux-score>
        <div class="report-meta">
          ${this._shortenUrl(r.url)}${r.model ? html`<br>${r.model} · ` : ''}${r.mode === 'deep' ? 'Deep' : 'Quick'}
          ${r.timestamp ? html` · ${new Date(r.timestamp).toLocaleString()}` : ''}
        </div>
      </div>

      <div class="profile-tabs">
        ${Object.entries(r.profileResults || {}).map(([id, pr]) => html`
          <button class="profile-tab ${this.activeProfile === id ? 'active' : ''}" @click="${() => this.activeProfile = id}">
            <span>${pr.profile.name?.en || id}</span>
            <span class="profile-tab-score">${pr.score}</span>
          </button>
        `)}
      </div>

      ${activeResults ? html`
        <div class="section-header">Evaluations</div>
        <div class="heuristic-list">
          ${(activeResults.evaluations || []).map(ev => html`
            <div class="heuristic-card">
              <div class="heuristic-header" @click="${() => this._toggleHeuristic(ev.heuristicId)}">
                <span class="heuristic-score-badge ${this._getScoreClass(ev.score)}">${ev.score}</span>
                <span class="heuristic-name">${ev.heuristicName?.en || ev.heuristicId}</span>
                <span class="heuristic-chevron ${this.expandedHeuristic === ev.heuristicId ? 'open' : ''}">▶</span>
              </div>
              ${this.expandedHeuristic === ev.heuristicId ? html`
                <div class="heuristic-detail">
                  <div class="heuristic-summary">${ev.summary}</div>
                  ${(ev.issues || []).map(issue => html`
                    <div class="issue-item">
                      <span class="severity-dot ${issue.severity}"></span>
                      <div class="issue-content">
                        <div class="issue-desc">${issue.description}</div>
                        ${issue.element ? html`<div class="issue-element">${issue.element}</div>` : ''}
                        ${issue.recommendation ? html`<div class="issue-recommendation">${issue.recommendation}</div>` : ''}
                      </div>
                    </div>
                  `)}
                  ${(ev.positives || []).map(p => html`
                    <div class="positive-item">
                      <span class="positive-dot"></span>
                      <span>${p}</span>
                    </div>
                  `)}
                </div>
              ` : ''}
            </div>
          `)}
        </div>
      ` : ''}

      ${r.accessibilityResults ? html`
        <div class="section-header">Accessibility Audit</div>
        <div class="a11y-section">
          <div class="a11y-card">
            <div class="a11y-header">
              <span class="a11y-title">${r.accessibilityResults.passCount} pass · ${r.accessibilityResults.warnCount} warn · ${r.accessibilityResults.failCount} fail</span>
              <span class="a11y-score-badge ${this._getScoreClass(r.accessibilityResults.score)}">${r.accessibilityResults.score}</span>
            </div>
            ${(r.accessibilityResults.checks || []).map(check => html`
              <div class="a11y-check">
                <span class="check-dot ${check.status}"></span>
                <span class="a11y-name">${check.name}</span>
                <span class="a11y-message" title="${check.message}">${check.message}</span>
              </div>
            `)}
          </div>
        </div>
      ` : ''}

      <div class="export-bar">
        <button class="export-btn ${this.copied ? 'copied' : ''}" @click="${this._downloadMarkdown}">
          ${this.copied ? 'Downloaded ✓' : 'Download as Markdown'}
        </button>
      </div>
    `;
  }

  _renderHistory() {
    if (!this.history || this.history.length === 0) {
      return html`
        <div class="history-empty">
          No past reports yet. Analyze a page to start building history.
        </div>
      `;
    }

    return html`
      <div class="section-header" style="padding: 0 0 2px;">Past reports (${this.history.length})</div>
      <div class="history-list">
        ${this.history.map(entry => html`
          <div class="history-item" @click="${() => this._loadFromHistory(entry.id)}">
            <span class="history-score ${this._getScoreClass(entry.score)}">${entry.score}</span>
            <div class="history-details">
              <div class="history-title">${entry.title || entry.url || 'Untitled'}</div>
              <div class="history-meta">${this._formatDate(entry.timestamp)} · ${entry.mode} · ${entry.model}</div>
            </div>
            <button class="history-delete" @click="${(e) => { e.stopPropagation(); this._deleteFromHistory(entry.id); }}" title="Delete">×</button>
          </div>
        `)}
      </div>
    `;
  }

  _loadFromHistory(id) {
    this.dispatchEvent(new CustomEvent('load-report', { detail: { id }, bubbles: true, composed: true }));
  }

  _deleteFromHistory(id) {
    this.dispatchEvent(new CustomEvent('delete-report', { detail: { id }, bubbles: true, composed: true }));
  }

  _shortenUrl(url) {
    if (!url) return '';
    try {
      const u = new URL(url);
      return u.hostname + (u.pathname !== '/' ? u.pathname.substring(0, 30) + (u.pathname.length > 30 ? '...' : '') : '');
    } catch {
      return url.substring(0, 40) + (url.length > 40 ? '...' : '');
    }
  }

  _formatDate(ts) {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      const now = new Date();
      const diff = now - d;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
      return d.toLocaleDateString();
    } catch { return ''; }
  }
}

customElements.define('synthux-report', SynthuxReport);
