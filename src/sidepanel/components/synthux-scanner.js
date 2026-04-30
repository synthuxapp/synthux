/**
 * synthux — Scanner Component
 * 
 * <synthux-scanner> — Main scanning control panel
 * Minimal design: profile toggles, mode selector, analyze button
 */

import { LitElement, html, css } from 'lit';
import { getCustomProfiles, saveCustomProfile, deleteCustomProfile } from '../../../extension/core/profiles.js';
import './synthux-score.js';

export class SynthuxScanner extends LitElement {
  static properties = {
    ollamaStatus: { type: Object },
    isAnalyzing: { type: Boolean },
    progress: { type: Object },
    pageInfo: { type: Object },
    selectedProfiles: { type: Array },
    mode: { type: String },
    logEntries: { type: Array },
    customProfiles: { type: Array },
    _showProfileForm: { type: Boolean, state: true },
    _editingProfile: { type: Object, state: true },
    _openMenuId: { type: String, state: true },
    _selectedHeuristics: { type: Array, state: true }
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

    .profile-actions {
      position: relative;
      margin-left: 4px;
    }

    .kebab-btn {
      background: none;
      border: none;
      color: var(--sx-text-tertiary, #8a8a96);
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.15s;
      line-height: 1;
      letter-spacing: 1px;
    }

    .kebab-btn:hover {
      background: var(--sx-bg-card-hover, rgba(255,255,255,0.05));
      color: var(--sx-text-primary, #ededf0);
    }

    .profile-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border-hover, rgba(255,255,255,0.10));
      border-radius: 8px;
      padding: 4px;
      min-width: 110px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 10;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 7px 10px;
      background: none;
      border: none;
      border-radius: 5px;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.1s;
      text-align: left;
    }

    .dropdown-item:hover {
      background: var(--sx-bg-card-hover, rgba(255,255,255,0.05));
      color: var(--sx-text-primary, #ededf0);
    }

    .dropdown-item.danger:hover {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
    }

    .add-profile-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px dashed var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
      font-family: inherit;
    }

    .add-profile-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .profile-form {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-accent, #3b82f6);
      border-radius: 8px;
      padding: 12px;
    }

    .pf-field { margin-bottom: 8px; }
    .pf-field:last-child { margin-bottom: 0; }

    .pf-label {
      display: block;
      font-size: 11px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 3px;
    }

    .pf-hint {
      display: block;
      font-size: 10px;
      font-weight: 400;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 4px;
    }

    .pf-input {
      width: 100%;
      padding: 6px 8px;
      background: var(--sx-bg-main, #121214);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 12px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .pf-input:focus {
      outline: none;
      border-color: var(--sx-accent, #3b82f6);
    }

    .pf-row {
      display: flex;
      gap: 8px;
    }

    .pf-row > * { flex: 1; }

    .pf-checks {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 3px;
    }

    .pf-check-label {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      cursor: pointer;
    }

    .pf-actions {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }

    .pf-save {
      flex: 1;
      padding: 7px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .pf-cancel {
      padding: 7px 12px;
      background: none;
      color: var(--sx-text-tertiary, #8a8a96);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
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
    this.customProfiles = [];
    this._showProfileForm = false;
    this._editingProfile = null;
    this._openMenuId = null;
    this._selectedHeuristics = [];

    this._fetchPageInfo();
    this._loadCustomProfiles();
    chrome.tabs?.onActivated?.addListener(() => this._fetchPageInfo());
    chrome.tabs?.onUpdated?.addListener((_, info) => {
      if (info.status === 'complete') this._fetchPageInfo();
    });

    // Listen for custom profile changes from settings
    window.addEventListener('profiles-changed', () => this._loadCustomProfiles());
    // Close dropdown on outside click
    this._onDocClick = () => { this._openMenuId = null; };
    document.addEventListener('click', this._onDocClick);
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

  get _isCloudProvider() {
    const provider = this.ollamaStatus?.provider || 'ollama';
    return provider !== 'ollama';
  }

  get _allHeuristics() {
    return [
      { id: 'visibility-of-system-status', name: { en: 'Visibility of System Status' } },
      { id: 'match-real-world', name: { en: 'Match Real World' } },
      { id: 'user-control-freedom', name: { en: 'User Control & Freedom' } },
      { id: 'consistency-standards', name: { en: 'Consistency & Standards' } },
      { id: 'error-prevention', name: { en: 'Error Prevention' } },
      { id: 'recognition-over-recall', name: { en: 'Recognition > Recall' } },
      { id: 'flexibility-efficiency', name: { en: 'Flexibility & Efficiency' } },
      { id: 'aesthetic-minimalist', name: { en: 'Aesthetic & Minimalist' } },
      { id: 'error-recovery', name: { en: 'Error Recovery' } },
      { id: 'help-documentation', name: { en: 'Help & Documentation' } }
    ];
  }

  _toggleHeuristic(id) {
    if (this.isAnalyzing) return;
    const list = [...this._selectedHeuristics];
    const idx = list.indexOf(id);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    this._selectedHeuristics = list;
  }

  /**
   * Estimate analysis time based on heuristic count, profile count, and provider
   * Local: ~4 min per heuristic per profile
   * Cloud: ~0.5 min per heuristic per profile
   */
  _estimateTime(heuristicCount) {
    const profiles = this.selectedProfiles?.length || 1;
    const perCall = this._isCloudProvider ? 0.5 : 4; // minutes per API call
    const totalMin = Math.round(heuristicCount * profiles * perCall);
    if (totalMin < 1) return '<1 min';
    if (totalMin >= 60) return `${Math.round(totalMin / 60)}h ${totalMin % 60}min`;
    return `${totalMin} min`;
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

  async _loadCustomProfiles() {
    try {
      this.customProfiles = await getCustomProfiles();
    } catch {
      this.customProfiles = [];
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
        payload: {
          mode: this.mode,
          profiles: this.selectedProfiles,
          ...(this.mode === 'custom' && this._selectedHeuristics.length > 0
            ? { heuristics: this._selectedHeuristics }
            : {})
        }
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

  _renderProfileCard(id, name, desc, isCustom = false) {
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
          <div class="profile-name">${name}${isCustom ? html`<span style="font-size: 9px; background: var(--sx-blue-dim, rgba(0,126,255,0.1)); color: var(--sx-blue, #007eff); padding: 1px 6px; border-radius: 8px; margin-left: 6px; font-weight: 600; vertical-align: middle;">Custom</span>` : ''}</div>
          <div class="profile-desc">${desc}</div>
        </div>
        ${isCustom ? html`
          <div class="profile-actions">
            <button class="kebab-btn" @click="${(e) => { e.stopPropagation(); this._openMenuId = this._openMenuId === id ? null : id; }}" title="Options">⋮</button>
            ${this._openMenuId === id ? html`
              <div class="profile-dropdown">
                <button class="dropdown-item" @click="${(e) => { e.stopPropagation(); this._openMenuId = null; this._editProfile(id); }}">✎ Edit</button>
                <button class="dropdown-item danger" @click="${(e) => { e.stopPropagation(); this._openMenuId = null; this._removeProfile(id); }}">✕ Delete</button>
              </div>
            ` : ''}
          </div>
        ` : ''}
        <div class="profile-check"></div>
      </div>
    `;
  }

  _renderProfileForm() {
    const ep = this._editingProfile;
    return html`
      <div class="profile-form">
        <div class="pf-field">
          <label class="pf-label">Persona Name *</label>
          <span class="pf-hint">Give this synthetic user a name</span>
          <input type="text" class="pf-input" id="pf-name" placeholder="e.g. Senior Executive" maxlength="40" .value="${ep?.name?.en || ''}" />
        </div>
        <div class="pf-row">
          <div class="pf-field">
            <label class="pf-label">Age Range</label>
            <select class="pf-input" id="pf-age">
              ${['18-25','25-35','35-50','50-65','65+'].map(v => html`<option value="${v}" ?selected="${(ep?.ageRange || '25-35') === v}">${v}</option>`)}
            </select>
          </div>
          <div class="pf-field">
            <label class="pf-label">Tech Savviness</label>
            <select class="pf-input" id="pf-tech">
              ${['low','medium','high'].map(v => html`<option value="${v}" ?selected="${(ep?.techLevel || 'medium') === v}">${v === 'low' ? 'Low — basic user' : v === 'medium' ? 'Medium — regular' : 'High — power user'}</option>`)}
            </select>
          </div>
        </div>
        <div class="pf-field">
          <label class="pf-label">Accessibility Needs</label>
          <span class="pf-hint">Does this persona have any disabilities?</span>
          <div class="pf-checks">
            ${[['vision','Low Vision'],['hearing','Hearing'],['motor','Motor'],['cognitive','Cognitive']].map(([d, label]) => html`
              <label class="pf-check-label">
                <input type="checkbox" class="pf-disability" value="${d}" ?checked="${(ep?.disabilities || []).includes(d)}" />
                ${label}
              </label>
            `)}
          </div>
        </div>
        <div class="pf-field">
          <label class="pf-label">Goal</label>
          <span class="pf-hint">What is this person trying to do on the page?</span>
          <input type="text" class="pf-input" id="pf-goal" placeholder="e.g. Find pricing and compare plans" maxlength="100" .value="${ep?.goal || ''}" />
        </div>
        <div class="pf-actions">
          <button class="pf-save" @click="${this._handleSaveProfile}">${ep ? 'Update' : 'Create'}</button>
          <button class="pf-cancel" @click="${() => { this._showProfileForm = false; this._editingProfile = null; }}">Cancel</button>
        </div>
      </div>
    `;
  }

  _editProfile(id) {
    const cp = this.customProfiles.find(p => p.id === id);
    if (!cp) return;
    this._editingProfile = cp;
    this._showProfileForm = true;
  }

  async _removeProfile(id) {
    try {
      await deleteCustomProfile(id);
      // Remove from selected if present
      this.selectedProfiles = this.selectedProfiles.filter(p => p !== id);
      await this._loadCustomProfiles();
    } catch (err) {
      console.error('[synthux] Failed to delete profile:', err);
    }
  }

  async _handleSaveProfile() {
    const name = this.shadowRoot.getElementById('pf-name')?.value?.trim();
    if (!name) return;

    const ageRange = this.shadowRoot.getElementById('pf-age')?.value || '25-35';
    const techLevel = this.shadowRoot.getElementById('pf-tech')?.value || 'medium';
    const goal = this.shadowRoot.getElementById('pf-goal')?.value?.trim() || '';
    const disabilities = Array.from(this.shadowRoot.querySelectorAll('.pf-disability:checked')).map(cb => cb.value);

    try {
      if (this._editingProfile) {
        // Delete old, save new (update)
        await deleteCustomProfile(this._editingProfile.id);
      }
      const newProfile = await saveCustomProfile({
        name,
        description: `${ageRange}, ${techLevel} tech${goal ? ` — ${goal}` : ''}`,
        ageRange,
        techLevel,
        disabilities,
        goal,
        priorityHeuristics: []
      });

      // If editing, replace the old ID in selectedProfiles
      if (this._editingProfile) {
        const idx = this.selectedProfiles.indexOf(this._editingProfile.id);
        if (idx > -1) {
          const newSelected = [...this.selectedProfiles];
          newSelected[idx] = newProfile.id;
          this.selectedProfiles = newSelected;
        }
      }

      this._showProfileForm = false;
      this._editingProfile = null;
      await this._loadCustomProfiles();
    } catch (err) {
      console.error('[synthux] Failed to save profile:', err);
    }
  }

  render() {
    const isConnected = this.ollamaStatus?.connected;
    const customValid = this.mode !== 'custom' || this._selectedHeuristics.length > 0;
    const canAnalyze = isConnected && this._isAnalyzablePage && this.selectedProfiles.length > 0 && customValid;

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
            <strong>AI not connected.</strong> Check Settings to configure your AI provider.
          </div>
        </div>
      ` : ''}

      <div class="section-header">Profiles</div>
      <div class="profiles">
        ${this._renderProfileCard('first-time', 'First-Time Visitor', 'New to the site, exploring for the first time')}
        ${this._renderProfileCard('power-user', 'Power User', 'Experienced, focused on speed and efficiency')}
        ${this._renderProfileCard('accessibility', 'Accessibility User', 'Relies on screen reader and keyboard')}
        ${this.customProfiles.map(cp => this._renderProfileCard(cp.id, `${cp.name.en}`, cp.description?.en || 'Custom profile', true))}
        ${this._showProfileForm ? this._renderProfileForm() : html`
          ${this.customProfiles.length < 5 ? html`
            <button class="add-profile-btn" @click="${() => { this._editingProfile = null; this._showProfileForm = true; }}">+ Add Custom Profile</button>
          ` : ''}
        `}
      </div>

      <div class="section-header">Mode</div>
      <div class="mode-selector">
        <button class="mode-btn ${this.mode === 'quick' ? 'active' : ''}" @click="${() => this._setMode('quick')}">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">3 heuristics · ~${this._estimateTime(3)}</span>
        </button>
        <button class="mode-btn ${this.mode === 'deep' ? 'active' : ''}" @click="${() => this._setMode('deep')}">
          <span class="mode-label">Deep</span>
          <span class="mode-desc">10 heuristics · ~${this._estimateTime(10)}</span>
        </button>
        <button class="mode-btn ${this.mode === 'custom' ? 'active' : ''}" @click="${() => this._setMode('custom')}">
          <span class="mode-label">Custom</span>
          <span class="mode-desc">${this._selectedHeuristics.length || 0} selected${this._selectedHeuristics.length > 0 ? ` · ~${this._estimateTime(this._selectedHeuristics.length)}` : ''}</span>
        </button>
      </div>

      ${this.mode === 'custom' ? html`
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px;">
          ${this._allHeuristics.map(h => {
            const isOn = this._selectedHeuristics.includes(h.id);
            return html`
              <button
                style="
                  padding: 4px 10px; font-size: 11px; border-radius: 12px; cursor: pointer;
                  font-family: inherit; transition: all 0.15s; border: 1px solid;
                  background: ${isOn ? 'var(--sx-accent-dim, rgba(59,130,246,0.1))' : 'var(--sx-bg-card, #1c1c1f)'};
                  border-color: ${isOn ? 'var(--sx-accent, #3b82f6)' : 'var(--sx-border, rgba(255,255,255,0.06))'};
                  color: ${isOn ? 'var(--sx-accent, #3b82f6)' : 'var(--sx-text-tertiary, #8a8a96)'};
                "
                @click="${() => this._toggleHeuristic(h.id)}"
              >${h.name?.en || h.id}</button>
            `;
          })}
        </div>
      ` : ''}

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
