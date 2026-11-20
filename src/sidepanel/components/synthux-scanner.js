/**
 * synthux — Scanner Component
 * 
 * <synthux-scanner> — Main scanning control panel
 * Minimal design: profile toggles, mode selector, analyze button
 */

import { LitElement, html, css } from 'lit';
import { getCustomProfiles, saveCustomProfile, deleteCustomProfile } from '../../../extension/core/profiles.js';
import {
  BUILT_IN_RULE_PACKS,
  getAllRulePacks,
  loadHeuristics,
  saveCustomRulePack,
  deleteCustomRulePack
} from '../../../extension/core/heuristics.js';
import {
  BUILT_IN_DEPARTMENTS,
  getBusinessContextState,
  saveBusinessContextState,
  upsertBusinessContextProfile,
  deleteBusinessContextProfile,
  upsertCustomDepartment,
  deleteCustomDepartment
} from '../../../extension/core/business-context.js';
import './synthux-score.js';

export class SynthuxScanner extends LitElement {
  static properties = {
    ollamaStatus: { type: Object },
    isAnalyzing: { type: Boolean },
    progress: { type: Object },
    pageInfo: { type: Object },
    selectedProfiles: { type: Array },
    selectedRulePack: { type: String },
    rulePacks: { type: Array },
    mode: { type: String },
    logEntries: { type: Array },
    customProfiles: { type: Array },
    _packRules: { type: Array, state: true },
    _showRulePackImporter: { type: Boolean, state: true },
    _rulePackError: { type: String, state: true },
    _showProfileForm: { type: Boolean, state: true },
    _editingProfile: { type: Object, state: true },
    _openMenuId: { type: String, state: true },
    _selectedHeuristics: { type: Array, state: true },
    _copiedCmd: { type: String, state: true },
    _versionDismissed: { type: Boolean, state: true },
    _showCorsWizard: { type: Boolean, state: true },
    _checkingConnection: { type: Boolean, state: true },
    _bizState: { type: Object, state: true },
    _showBizEditor: { type: Boolean, state: true },
    _editingBizNew: { type: Boolean, state: true },
    _showCustomDeptForm: { type: Boolean, state: true },
    _selectedDeptsDraft: { type: Array, state: true }
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

    /* ─── Flow Analysis Button ──────────────── */
    .flow-btn {
      width: 100%;
      margin-top: 8px;
      padding: 11px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 10px;
      color: var(--sx-text-primary, #ededf0);
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      text-align: left;
      transition: all 150ms ease;
    }

    .flow-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59, 130, 246, 0.06);
    }

    .flow-btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.24);
      color: var(--sx-accent, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .flow-btn-content {
      flex: 1;
      min-width: 0;
    }

    .flow-btn-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.3;
    }

    .flow-desc {
      font-size: 11px;
      font-weight: 400;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .flow-btn-arrow {
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
      transition: transform 150ms ease, color 150ms ease;
    }

    .flow-btn:hover .flow-btn-arrow {
      color: var(--sx-accent, #3b82f6);
      transform: translateX(2px);
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

    /* ─── CORS Fix Wizard ──────────────────── */
    .cors-wizard {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid rgba(234, 179, 8, 0.25);
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 16px;
    }

    .cors-wizard-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-warning, #eab308);
      margin-bottom: 10px;
    }

    .cors-wizard-desc {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .cors-steps {
      background: #0a0a0c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }

    .cors-step-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 10px;
    }

    .cors-platform {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .cors-platform:last-of-type {
      border-bottom: none;
    }

    .cors-platform-label {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
      width: 55px;
    }

    .cors-cmd-block {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      margin-top: 8px;
    }

    .cors-cmd-code {
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 11px;
      color: var(--sx-text-primary, #ededf0);
      flex: 1;
      word-break: break-all;
      line-height: 1.4;
    }

    .cors-note {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 6px;
      line-height: 1.4;
    }

    .cors-other-platforms {
      margin-top: 10px;
      font-size: 11px;
    }

    .cors-other-platforms summary {
      color: var(--sx-text-tertiary, #8a8a96);
      cursor: pointer;
      font-size: 10px;
      padding: 4px 0;
    }

    .cors-other-platforms summary:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .cors-platform-alt {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .cors-platform-alt:last-child {
      border-bottom: none;
    }

    .cors-copy-btn {
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      padding: 2px 8px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
      flex-shrink: 0;
      margin-left: 6px;
    }

    .cors-copy-btn:hover {
      color: var(--sx-text-primary, #ededf0);
      border-color: rgba(255,255,255,0.15);
    }

    .cors-copy-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .cors-check-btn {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: transparent;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .cors-check-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    /* ─── Version Banner ───────────────────── */
    .version-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(249,115,22,0.06);
      border: 1px solid rgba(249,115,22,0.20);
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.4;
    }

    .version-banner-icon {
      font-size: 14px;
      flex-shrink: 0;
    }

    .version-banner-text {
      flex: 1;
    }

    .version-banner-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .version-btn {
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }

    .version-btn:hover {
      color: var(--sx-text-primary, #ededf0);
    }

    .version-btn.fix {
      color: #f97316;
      border-color: rgba(249,115,22,0.3);
    }

    .version-btn.fix:hover {
      background: rgba(249,115,22,0.08);
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

    /* ─── Rule Pack Selector ────────────────── */
    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .section-header-row .section-header {
      margin-bottom: 0;
    }

    .pack-import-link {
      background: transparent;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .pack-import-link:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-bottom: 8px;
    }

    .rule-pack-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 9px 10px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .rule-pack-card:hover {
      border-color: rgba(255,255,255,0.14);
    }

    .rule-pack-card.active {
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      border-color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 4px;
      margin-bottom: 2px;
    }

    .rule-pack-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rule-pack-card.active .rule-pack-name {
      color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-count {
      font-size: 9px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
    }

    .rule-pack-cat {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .rule-pack-del {
      background: transparent;
      border: none;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 11px;
      padding: 0 3px;
      cursor: pointer;
      line-height: 1;
    }

    .rule-pack-del:hover {
      color: var(--sx-error, #ef4444);
    }

    .rule-pack-desc-bar {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 18px;
      line-height: 1.4;
    }

    .pack-importer {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.1));
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 16px;
    }

    .pack-importer-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 4px;
    }

    .pack-importer-sub {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .pack-textarea {
      width: 100%;
      min-height: 90px;
      background: #121215;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 10px;
      padding: 8px;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 8px;
    }

    .pack-file-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    .pack-file-label {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px dashed rgba(255,255,255,0.16);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .pack-file-label:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .pack-error {
      font-size: 11px;
      color: var(--sx-error, #ef4444);
      margin-bottom: 8px;
    }

    /* ─── Instant WCAG Button in Page Card ────── */
    .page-info-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .page-info-meta {
      min-width: 0;
      flex: 1;
    }

    .instant-wcag-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid rgba(34, 197, 94, 0.28);
      background: rgba(34, 197, 94, 0.10);
      color: #22c55e;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 150ms ease;
      white-space: nowrap;
    }

    .instant-wcag-btn:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.18);
      border-color: #22c55e;
    }

    .instant-wcag-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ─── Business, Goal & Department Context Card ─── */
    .biz-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
      transition: border-color 150ms ease;
    }

    .biz-card.enabled {
      border-color: rgba(59, 130, 246, 0.38);
      background: linear-gradient(180deg, rgba(59,130,246,0.06), rgba(28,28,31,0.95));
    }

    .biz-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .biz-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .biz-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: rgba(59, 130, 246, 0.10);
      border: 1px solid rgba(59, 130, 246, 0.22);
      color: var(--sx-accent, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .biz-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.3;
    }

    .biz-sub {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      line-height: 1.35;
    }

    .biz-switch {
      position: relative;
      width: 36px;
      height: 20px;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      transition: background 180ms ease;
    }

    .biz-switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #8a8a96;
      transition: transform 180ms ease, background 180ms ease;
    }

    .biz-switch.on {
      background: rgba(59, 130, 246, 0.3);
    }

    .biz-switch.on::after {
      transform: translateX(16px);
      background: #3b82f6;
    }

    .biz-controls-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
    }

    .biz-select {
      flex: 1;
      min-width: 0;
      height: 30px;
      padding: 0 26px 0 9px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background-color: var(--sx-bg-primary, #111113);
      color: var(--sx-text-primary, #ededf0);
      font-size: 11px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8a96' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    .biz-select:focus {
      border-color: var(--sx-accent, #3b82f6);
    }

    .biz-mini-btn {
      height: 30px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      white-space: nowrap;
      transition: all 150ms ease;
    }

    .biz-mini-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
    }

    .biz-summary-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 9px;
    }

    .biz-pill {
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      color: var(--sx-text-secondary, #b4b4bc);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .biz-editor {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .dept-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }

    .dept-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-primary, #111113);
      color: var(--sx-text-tertiary, #8a8a96);
      transition: all 150ms ease;
    }

    .dept-chip.active {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.12);
      color: var(--sx-text-primary, #ededf0);
    }

    .dept-del {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-left: 2px;
      padding: 0 2px;
    }

    .dept-del:hover {
      color: var(--sx-error, #ef4444);
    }
  `;

  constructor() {
    super();
    this.ollamaStatus = { connected: false, models: [] };
    this.isAnalyzing = false;
    this.progress = null;
    this.pageInfo = null;
    this.selectedProfiles = ['first-time', 'power-user', 'accessibility'];
    this.selectedRulePack = 'nielsen-10';
    this.rulePacks = [...BUILT_IN_RULE_PACKS];
    this.mode = 'deep';
    this.logEntries = [];
    this.customProfiles = [];
    this._packRules = [];
    this._showRulePackImporter = false;
    this._rulePackError = '';
    this._showProfileForm = false;
    this._editingProfile = null;
    this._openMenuId = null;
    this._selectedHeuristics = [];
    this._copiedCmd = null;
    this._versionDismissed = false;
    this._showCorsWizard = false;
    this._checkingConnection = false;
    this._bizState = { enabled: false, activeContextId: 'default-context', customDepartments: [], contexts: [] };
    this._showBizEditor = false;
    this._editingBizNew = false;
    this._showCustomDeptForm = false;
    this._selectedDeptsDraft = ['product-ux', 'marketing-cro'];

    this._fetchPageInfo();
    this._loadCustomProfiles();
    this._loadSettings();
    this._loadRulePacks();
    this._loadBusinessContext();
    chrome.tabs?.onActivated?.addListener(() => this._fetchPageInfo());
    chrome.tabs?.onUpdated?.addListener((_, info) => {
      if (info.status === 'complete') this._fetchPageInfo();
    });

    // Listen for custom profile changes from settings
    window.addEventListener('profiles-changed', () => this._loadCustomProfiles());
    window.addEventListener('business-context-changed', () => this._loadBusinessContext());
    chrome.storage?.onChanged?.addListener((changes) => {
      if (changes.synthux_business_context_state) {
        this._loadBusinessContext();
      }
    });
    // Close dropdown on outside click
    this._onDocClick = () => { this._openMenuId = null; };
    document.addEventListener('click', this._onDocClick);
  }

  async _loadBusinessContext() {
    try {
      this._bizState = await getBusinessContextState();
      const active = this._activeBizProfile;
      if (active) {
        this._selectedDeptsDraft = [...(active.departments || ['product-ux', 'marketing-cro'])];
      }
    } catch {}
  }

  get _activeBizProfile() {
    const list = this._bizState?.contexts || [];
    return list.find(c => c.id === this._bizState?.activeContextId) || list[0] || null;
  }

  get _allDepartmentsList() {
    return [...BUILT_IN_DEPARTMENTS, ...(this._bizState?.customDepartments || [])];
  }

  async _toggleBusinessContextEnabled() {
    if (this.isAnalyzing) return;
    const nextEnabled = !this._bizState?.enabled;
    this._bizState = await saveBusinessContextState({
      ...this._bizState,
      enabled: nextEnabled
    });
  }

  async _selectBusinessContext(e) {
    const id = e.target.value;
    this._bizState = await saveBusinessContextState({
      ...this._bizState,
      activeContextId: id
    });
    const active = this._activeBizProfile;
    if (active) {
      this._selectedDeptsDraft = [...(active.departments || ['product-ux', 'marketing-cro'])];
    }
  }

  _openBizEditor(isNew = false) {
    this._editingBizNew = isNew;
    this._showBizEditor = true;
    const active = isNew ? null : this._activeBizProfile;
    this._selectedDeptsDraft = active?.departments?.length
      ? [...active.departments]
      : ['product-ux', 'marketing-cro'];
  }

  _toggleDraftDept(deptId) {
    const list = [...(this._selectedDeptsDraft || [])];
    const idx = list.indexOf(deptId);
    if (idx >= 0) {
      if (list.length > 1) list.splice(idx, 1);
    } else {
      list.push(deptId);
    }
    this._selectedDeptsDraft = list;
  }

  async _handleSaveBizContext() {
    const root = this.shadowRoot;
    if (!root) return;
    const active = this._editingBizNew ? null : this._activeBizProfile;
    const companyName = root.getElementById('biz-company')?.value?.trim() || '';
    const productName = root.getElementById('biz-product')?.value?.trim() || '';
    const industry = root.getElementById('biz-industry')?.value?.trim() || 'SaaS / Web Application';
    const primaryGoal = root.getElementById('biz-goal')?.value?.trim() || '';
    const valueProposition = root.getElementById('biz-valprop')?.value?.trim() || '';
    const mustHaves = (root.getElementById('biz-musts')?.value || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const metrics = (root.getElementById('biz-metrics')?.value || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const { state } = await upsertBusinessContextProfile({
      id: active?.id || undefined,
      name: [companyName, productName].filter(Boolean).join(' — ') || primaryGoal.slice(0, 32) || 'Company Context',
      companyName,
      productName,
      industry,
      primaryGoal,
      valueProposition,
      mustHaves,
      metrics,
      departments: this._selectedDeptsDraft
    }, { setActive: true, enabled: true });

    this._bizState = state;
    this._showBizEditor = false;
    this._editingBizNew = false;
  }

  async _handleDeleteBizContext() {
    const active = this._activeBizProfile;
    if (!active) return;
    this._bizState = await deleteBusinessContextProfile(active.id);
    this._showBizEditor = false;
  }

  async _handleAddCustomDepartment() {
    const root = this.shadowRoot;
    const name = root?.getElementById('cdept-name')?.value?.trim();
    const focus = root?.getElementById('cdept-focus')?.value?.trim() || '';
    if (!name) return;

    const { state, department } = await upsertCustomDepartment({
      name,
      icon: '',
      focus: focus || name,
      defaultCriteria: focus || name
    });
    this._bizState = state;
    if (!this._selectedDeptsDraft.includes(department.id)) {
      this._selectedDeptsDraft = [...this._selectedDeptsDraft, department.id];
    }
    this._showCustomDeptForm = false;
  }

  async _handleDeleteCustomDept(e, deptId) {
    e.stopPropagation();
    this._bizState = await deleteCustomDepartment(deptId);
    this._selectedDeptsDraft = this._selectedDeptsDraft.filter(id => id !== deptId);
  }

  async _startInstantWcagAudit() {
    if (this.isAnalyzing || !this._isAnalyzablePage) return;
    this.dispatchEvent(new CustomEvent('analysis-start'));
    try {
      await chrome.runtime.sendMessage({
        type: 'START_ANALYSIS',
        payload: {
          mode: 'wcag-only',
          rulePackId: this.selectedRulePack || 'nielsen-10',
          profiles: ['accessibility']
        }
      });
    } catch {
      this.dispatchEvent(new CustomEvent('analysis-end'));
    }
  }

  async _loadSettings() {
    try {
      const data = await chrome.storage.local.get({
        synthux_selected_profiles: ['first-time', 'power-user', 'accessibility'],
        synthux_selected_mode: 'deep',
        rulePackId: 'nielsen-10'
      });
      this.selectedProfiles = data.synthux_selected_profiles;
      this.mode = data.synthux_selected_mode;
      this.selectedRulePack = data.rulePackId || 'nielsen-10';
      await this._loadActivePackRules(this.selectedRulePack);
      this.requestUpdate();
    } catch {}
  }

  async _loadRulePacks() {
    try {
      this.rulePacks = await getAllRulePacks();
      await this._loadActivePackRules(this.selectedRulePack);
    } catch {
      this.rulePacks = [...BUILT_IN_RULE_PACKS];
    }
  }

  async _loadActivePackRules(packId) {
    try {
      const data = await loadHeuristics(packId);
      this._packRules = Array.isArray(data?.rules) ? data.rules : [];
    } catch {
      this._packRules = [];
    }
  }

  async _selectRulePack(packId) {
    if (this.isAnalyzing) return;
    this.selectedRulePack = packId;
    this._selectedHeuristics = [];
    await chrome.storage.local.set({ rulePackId: packId });
    await this._loadActivePackRules(packId);
  }

  async _handleRulePackFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const textarea = this.shadowRoot?.getElementById('pack-json-input');
      if (textarea) textarea.value = text;
      this._rulePackError = '';
    } catch (err) {
      this._rulePackError = 'Failed to read file: ' + err.message;
    }
  }

  async _handleSaveCustomRulePack() {
    const raw = this.shadowRoot?.getElementById('pack-json-input')?.value?.trim();
    if (!raw) {
      this._rulePackError = 'Please upload a .json file or paste JSON content.';
      return;
    }
    try {
      const saved = await saveCustomRulePack(raw);
      this._rulePackError = '';
      this._showRulePackImporter = false;
      await this._loadRulePacks();
      await this._selectRulePack(saved.id);
    } catch (err) {
      this._rulePackError = err.message || 'Invalid rule pack JSON.';
    }
  }

  async _handleDeleteCustomRulePack(e, packId) {
    e.stopPropagation();
    if (this.isAnalyzing) return;
    try {
      await deleteCustomRulePack(packId);
      if (this.selectedRulePack === packId) {
        await this._selectRulePack('nielsen-10');
      }
      await this._loadRulePacks();
    } catch (err) {
      console.error('[synthux] Failed to delete rule pack:', err);
    }
  }

  _downloadSamplePackTemplate() {
    const sample = {
      id: 'my-custom-ux-pack',
      name: 'Custom Healthcare UX Pack',
      shortName: 'Healthcare',
      category: 'Healthcare & Patient Portals',
      description: 'Custom UX evaluation rules for patient portals and telemedicine apps.',
      version: '1.0.0',
      rules: [
        {
          id: 'patient-clarity',
          name: { en: 'Plain Medical Language & Clarity', tr: 'Anlaşılır Tıbbi Dil ve Netlik' },
          description: {
            en: 'Medical terms, appointment instructions, and test results should be explained in plain, empathetic language.',
            tr: 'Tıbbi terimler, randevu talimatları ve sonuçlar sade ve anlaşılır bir dille açıklanmalıdır.'
          },
          weight: 1.2,
          evaluation_guide: 'Look for plain-language explanations, clear next steps for patients, and readable typography.'
        },
        {
          id: 'booking-simplicity',
          name: { en: 'Frictionless Appointment Booking', tr: 'Kolay Randevu Alma Deneyimi' },
          description: {
            en: 'Patients should be able to find providers, check availability, and book or reschedule appointments with minimal steps.',
            tr: 'Hastalar doktorları, uygun saatleri ve randevu adımlarını en az tıklamayla tamamlayabilmelidir.'
          },
          weight: 1.0,
          evaluation_guide: 'Look for clear CTAs, visible calendar/schedule availability, and accessible form controls.'
        }
      ]
    };
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synthux-rulepack-template.json';
    a.click();
    URL.revokeObjectURL(url);
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
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    // Chrome blocks content script injection on these pages
    const blocked = [
      'chromewebstore.google.com',
      'chrome.google.com/webstore',
      'microsoftedge.microsoft.com/addons',
      'addons.mozilla.org'
    ];
    return !blocked.some(domain => url.includes(domain));
  }

  get _isCloudProvider() {
    const provider = this.ollamaStatus?.provider || 'ollama';
    return provider !== 'ollama';
  }

  get _allHeuristics() {
    if (this._packRules && this._packRules.length > 0) {
      return this._packRules;
    }
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
    chrome.storage.local.set({ synthux_selected_profiles: profiles });
  }

  _setMode(mode) {
    if (!this.isAnalyzing) {
      this.mode = mode;
      chrome.storage.local.set({ synthux_selected_mode: mode });
    }
  }

  async _startAnalysis() {
    if (this.isAnalyzing || !this.ollamaStatus?.connected) return;
    this.dispatchEvent(new CustomEvent('analysis-start'));
    try {
      await chrome.runtime.sendMessage({
        type: 'START_ANALYSIS',
        payload: {
          mode: this.mode,
          rulePackId: this.selectedRulePack || 'nielsen-10',
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
                <button class="dropdown-item" @click="${(e) => { e.stopPropagation(); this._openMenuId = null; this._editProfile(id); }}">Edit</button>
                <button class="dropdown-item danger" @click="${(e) => { e.stopPropagation(); this._openMenuId = null; this._removeProfile(id); }}">Delete</button>
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

  _renderBusinessContextCard() {
    const enabled = Boolean(this._bizState?.enabled);
    const contexts = this._bizState?.contexts || [];
    const active = this._activeBizProfile;
    const allDepts = this._allDepartmentsList;
    const draft = this._editingBizNew ? {} : (active || {});

    return html`
      <div class="section-header-row" style="margin-top: 4px;">
        <div class="section-header" style="margin-bottom:0;">Business &amp; Goal Context</div>
        <span style="font-size:10px;color:${enabled ? 'var(--sx-accent,#3b82f6)' : 'var(--sx-text-tertiary,#8a8a96)'};font-weight:600;">
          ${enabled ? 'Active' : 'Optional (Off)'}
        </span>
      </div>
      <div class="biz-card ${enabled ? 'enabled' : ''}" style="margin-top:8px;">
        <div class="biz-top">
          <div class="biz-title-wrap">
            <div class="biz-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div>
              <div class="biz-title">Company, Must-Haves &amp; Departments</div>
              <div class="biz-sub">Evaluate against product goals, metrics &amp; non-negotiables</div>
            </div>
          </div>
          <button
            class="biz-switch ${enabled ? 'on' : ''}"
            @click="${this._toggleBusinessContextEnabled}"
            title="${enabled ? 'Business Context is ON — click to disable' : 'Enable Business & Goal Context in analysis'}"
          ></button>
        </div>

        <div class="biz-controls-row">
          <select class="biz-select" @change="${this._selectBusinessContext}" .value="${active?.id || ''}">
            ${contexts.map(c => html`<option value="${c.id}" ?selected="${c.id === active?.id}">${c.name}</option>`)}
          </select>
          <button class="biz-mini-btn" @click="${() => { this._showBizEditor = !this._showBizEditor; this._editingBizNew = false; }}" title="Edit selected context">
            ${this._showBizEditor && !this._editingBizNew ? 'Close' : 'Edit'}
          </button>
          <button class="biz-mini-btn" @click="${() => this._openBizEditor(true)}" title="Create new company/product context">+ New</button>
        </div>

        ${active && !this._showBizEditor ? html`
          <div class="biz-summary-pills">
            ${active.primaryGoal ? html`<span class="biz-pill">Goal: ${active.primaryGoal.slice(0, 32)}${active.primaryGoal.length > 32 ? '…' : ''}</span>` : ''}
            <span class="biz-pill">${(active.mustHaves || []).length} Must-Haves</span>
            <span class="biz-pill">${(active.departments || []).length} Departments</span>
            ${(active.metrics || []).length > 0 ? html`<span class="biz-pill">${active.metrics.length} Metrics</span>` : ''}
          </div>
        ` : ''}

        ${this._showBizEditor ? html`
          <div class="biz-editor">
            <div class="pf-row">
              <div class="pf-field">
                <label class="pf-label">Company / Brand</label>
                <input type="text" class="pf-input" id="biz-company" placeholder="e.g. Acme Corp" .value="${draft.companyName || ''}" />
              </div>
              <div class="pf-field">
                <label class="pf-label">Product / Project</label>
                <input type="text" class="pf-input" id="biz-product" placeholder="e.g. Checkout Flow" .value="${draft.productName || ''}" />
              </div>
            </div>
            <div class="pf-row">
              <div class="pf-field">
                <label class="pf-label">Industry / Sector</label>
                <input type="text" class="pf-input" id="biz-industry" placeholder="e.g. B2B SaaS / Fintech / E-Commerce" .value="${draft.industry || 'SaaS / Web Application'}" />
              </div>
              <div class="pf-field">
                <label class="pf-label">Value Proposition</label>
                <input type="text" class="pf-input" id="biz-valprop" placeholder="e.g. 5-min no-code setup" .value="${draft.valueProposition || ''}" />
              </div>
            </div>
            <div class="pf-field">
              <label class="pf-label">Primary Page / Flow Goal *</label>
              <input type="text" class="pf-input" id="biz-goal" placeholder="e.g. Convert free trial signups without credit card friction" .value="${draft.primaryGoal || ''}" />
            </div>
            <div class="pf-field">
              <label class="pf-label">Non-Negotiable Must-Haves (1 per line)</label>
              <textarea class="pack-textarea" id="biz-musts" style="min-height:56px;" placeholder="Free trial CTA visible above the fold&#10;No credit card required badge next to CTA&#10;GDPR / KVKK consent &amp; trust logos visible">${(draft.mustHaves || []).join('\n')}</textarea>
            </div>
            <div class="pf-field">
              <label class="pf-label">Marketing &amp; Usage Metrics / Bottlenecks (1 per line)</label>
              <textarea class="pack-textarea" id="biz-metrics" style="min-height:46px;" placeholder="Bounce Rate: 68%&#10;Cart Abandonment: 74%&#10;Mobile Signup Conversion: 1.2%">${(draft.metrics || []).join('\n')}</textarea>
            </div>
            <div class="pf-field">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <label class="pf-label">Department Lenses (Select or Add Custom)</label>
                <button class="pack-import-link" @click="${() => { this._showCustomDeptForm = !this._showCustomDeptForm; }}">
                  ${this._showCustomDeptForm ? 'Close' : '+ Add Department'}
                </button>
              </div>
              <div class="dept-chips">
                ${allDepts.map(dept => {
                  const isOn = (this._selectedDeptsDraft || []).includes(dept.id);
                  return html`
                    <button class="dept-chip ${isOn ? 'active' : ''}" @click="${() => this._toggleDraftDept(dept.id)}" title="${dept.focus || ''}">
                      <span>${dept.name?.en || dept.name}</span>
                      ${dept.isCustom ? html`
                        <span class="dept-del" title="Remove custom department" @click="${(e) => this._handleDeleteCustomDept(e, dept.id)}">×</span>
                      ` : ''}
                    </button>
                  `;
                })}
              </div>
            </div>

            ${this._showCustomDeptForm ? html`
              <div style="background:rgba(0,0,0,0.25);padding:8px;border-radius:6px;border:1px solid var(--sx-border,rgba(255,255,255,0.06));display:flex;flex-direction:column;gap:6px;">
                <div style="font-size:10px;font-weight:600;color:var(--sx-accent,#3b82f6);">New Custom Department</div>
                <input type="text" class="pf-input" id="cdept-name" placeholder="Department Name (e.g. Brand &amp; SEO)" />
                <input type="text" class="pf-input" id="cdept-focus" placeholder="Department criteria &amp; focus (e.g. Tone consistency, heading SEO, trust)" />
                <div class="pf-actions">
                  <button class="pf-save" @click="${this._handleAddCustomDepartment}">Add Department</button>
                  <button class="pf-cancel" @click="${() => { this._showCustomDeptForm = false; }}">Cancel</button>
                </div>
              </div>
            ` : ''}

            <div class="pf-actions" style="margin-top:4px;">
              <button class="pf-save" @click="${this._handleSaveBizContext}">Save &amp; Enable Context</button>
              ${!this._editingBizNew && contexts.length > 1 ? html`
                <button class="pf-cancel" style="color:var(--sx-error,#ef4444);" @click="${this._handleDeleteBizContext}">Delete</button>
              ` : ''}
              <button class="pf-cancel" @click="${() => { this._showBizEditor = false; this._editingBizNew = false; }}">Cancel</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  render() {
    const isConnected = this.ollamaStatus?.connected;
    const customValid = this.mode !== 'custom' || this._selectedHeuristics.length > 0;
    const canAnalyze = isConnected && this._isAnalyzablePage && this.selectedProfiles.length > 0 && customValid;

    return html`
      ${this.pageInfo ? html`
        <div class="page-info">
          <div class="page-info-top">
            <div class="page-info-meta">
              <div class="page-title">${this.pageInfo.title}</div>
              <div class="page-url">${this.pageInfo.url}</div>
            </div>
            <button
              class="instant-wcag-btn"
              ?disabled="${this.isAnalyzing || !this._isAnalyzablePage}"
              @click="${this._startInstantWcagAudit}"
              title="Run 1-second deterministic WCAG 2.2 AA &amp; DOM health audit (No AI wait)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Instant WCAG</span>
            </button>
          </div>
          ${!this._isAnalyzablePage && this.pageInfo.url ? html`
            <div class="page-warning">Navigate to a website to analyze.</div>
          ` : ''}
        </div>
      ` : ''}

      ${this.ollamaStatus?.corsBlocked || this._showCorsWizard ? this._renderCorsWizard() : ''}

      ${!isConnected && !this.ollamaStatus?.corsBlocked ? html`
        <div class="offline-notice">
          <span class="offline-dot"></span>
          <div>
            <strong>AI not connected.</strong> Check Settings to configure your AI provider.
          </div>
        </div>
      ` : ''}

      ${this.ollamaStatus?.versionChanged && !this._versionDismissed && !this.ollamaStatus?.corsBlocked ? html`
        <div class="version-banner">
          <span class="version-banner-icon" style="font-size: 14px;">i</span>
          <div class="version-banner-text">
            Ollama updated <strong>${this.ollamaStatus.oldVersion} → ${this.ollamaStatus.newVersion}</strong>.<br>
            If analysis fails, CORS may need reconfiguration.
          </div>
          <div class="version-banner-actions">
            <button class="version-btn fix" @click="${() => { this._showCorsWizard = true; }}">Fix Now</button>
            <button class="version-btn" @click="${() => { this._versionDismissed = true; }}">Dismiss</button>
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

      <div class="section-header-row">
        <div class="section-header">Rule Pack</div>
        <button
          class="pack-import-link"
          @click="${() => { this._showRulePackImporter = !this._showRulePackImporter; this._rulePackError = ''; }}"
        >${this._showRulePackImporter ? 'Close' : '+ Import JSON'}</button>
      </div>

      ${this._showRulePackImporter ? html`
        <div class="pack-importer">
          <div class="pack-importer-title">Import Custom Rule Pack (Plugin)</div>
          <div class="pack-importer-sub">Upload a custom sectoral UX rule pack (.json) or paste JSON below.</div>
          <div class="pack-file-row">
            <label class="pack-file-label">
              <input type="file" accept=".json,application/json" style="display:none" @change="${this._handleRulePackFileUpload}" />
              <span>Upload .json File</span>
            </label>
            <button class="pack-import-link" @click="${this._downloadSamplePackTemplate}">Download Template</button>
          </div>
          <textarea
            id="pack-json-input"
            class="pack-textarea"
            placeholder='{"name": "My UX Pack", "category": "Custom", "rules": [{"id": "rule-1", "name": "Clarity", "description": "..."}]}'
          ></textarea>
          ${this._rulePackError ? html`<div class="pack-error">${this._rulePackError}</div>` : ''}
          <div class="pf-actions">
            <button class="pf-save" @click="${this._handleSaveCustomRulePack}">Import Pack</button>
            <button class="pf-cancel" @click="${() => { this._showRulePackImporter = false; this._rulePackError = ''; }}">Cancel</button>
          </div>
        </div>
      ` : ''}

      <div class="rule-pack-grid">
        ${(this.rulePacks || BUILT_IN_RULE_PACKS).map(pack => {
          const isActive = (this.selectedRulePack || 'nielsen-10') === pack.id;
          const count = pack.ruleCount || pack.rules?.length || 10;
          return html`
            <button
              class="rule-pack-card ${isActive ? 'active' : ''}"
              @click="${() => this._selectRulePack(pack.id)}"
              title="${pack.description || pack.name}"
            >
              <div class="rule-pack-top">
                <span class="rule-pack-name">${pack.shortName || pack.name}</span>
                <div style="display:flex;align-items:center;gap:3px;">
                  <span class="rule-pack-count">${count}</span>
                  ${pack.isCustom ? html`
                    <span
                      class="rule-pack-del"
                      title="Delete custom rule pack"
                      @click="${(e) => this._handleDeleteCustomRulePack(e, pack.id)}"
                    >✕</span>
                  ` : ''}
                </div>
              </div>
              <span class="rule-pack-cat">${pack.category || 'UX Rules'}</span>
            </button>
          `;
        })}
      </div>
      ${(() => {
        const activePack = (this.rulePacks || BUILT_IN_RULE_PACKS).find(p => p.id === (this.selectedRulePack || 'nielsen-10'));
        return activePack?.description
          ? html`<div class="rule-pack-desc-bar">${activePack.description}</div>`
          : '';
      })()}

      ${this._renderBusinessContextCard()}

      <div class="section-header">Mode</div>
      <div class="mode-selector">
        <button class="mode-btn ${this.mode === 'quick' ? 'active' : ''}" @click="${() => this._setMode('quick')}">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">${Math.min(3, this._allHeuristics.length)} rules · ~${this._estimateTime(Math.min(3, this._allHeuristics.length))}</span>
        </button>
        <button class="mode-btn ${this.mode === 'deep' ? 'active' : ''}" @click="${() => this._setMode('deep')}">
          <span class="mode-label">Deep</span>
          <span class="mode-desc">${this._allHeuristics.length} rules · ~${this._estimateTime(this._allHeuristics.length)}</span>
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

      <div class="section-header" style="margin-top: 20px;">Multi-Page Journey Studio</div>
      <button
        class="flow-btn"
        @click="${this._openFlowBuilder}"
      >
        <div class="flow-btn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="7" height="6" rx="1.5"></rect>
            <rect x="15" y="14" width="7" height="6" rx="1.5"></rect>
            <path d="M9 7h3a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h-1"></path>
          </svg>
        </div>
        <div class="flow-btn-content">
          <div class="flow-btn-title">Flow Builder</div>
          <div class="flow-desc">Visual canvas, open tabs &amp; business goal flows</div>
        </div>
        <svg class="flow-btn-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;
  }

  _openFlowBuilder() {
    const url = this.pageInfo?.url || '';
    const title = this.pageInfo?.title || '';
    let flowUrl = chrome.runtime.getURL('flow/index.html');
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      flowUrl += `?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    }
    chrome.tabs.create({ url: flowUrl });
  }

  async _copyCmd(cmd, platform) {
    try {
      await navigator.clipboard.writeText(cmd);
      this._copiedCmd = platform;
      setTimeout(() => { this._copiedCmd = null; }, 2000);
    } catch {
      // Fallback for clipboard API failure
      this._copiedCmd = platform;
      setTimeout(() => { this._copiedCmd = null; }, 2000);
    }
  }

  async _checkConnection() {
    this._checkingConnection = true;
    try {
      const result = await chrome.runtime.sendMessage({ type: 'CHECK_CONNECTION' });
      if (result?.connected) {
        this._showCorsWizard = false;
        // Trigger parent refresh
        this.dispatchEvent(new CustomEvent('connection-fixed', { bubbles: true, composed: true }));
      }
    } catch { /* ignore */ }
    this._checkingConnection = false;
  }

  _renderCorsWizard() {
    const platform = this._detectPlatform();
    const cmd = platform.cmd;
    const isChecking = this._checkingConnection;

    return html`
      <div class="cors-wizard">
        <div class="cors-wizard-title">
          Ollama CORS Configuration Required
        </div>
        <div class="cors-wizard-desc">
          Ollama is running but blocking requests from this extension.
          Run the command below, then restart Ollama.
        </div>
        <div class="cors-steps">
          <div class="cors-step-header">Step 1 — Run in Terminal</div>
          <div class="cors-cmd-block">
            <code class="cors-cmd-code">${cmd}</code>
            <button
              class="cors-copy-btn ${this._copiedCmd ? 'copied' : ''}"
              @click="${() => this._copyCmd(cmd, 'main')}"
            >${this._copiedCmd ? 'Copied' : 'Copy'}</button>
          </div>
          ${platform.note ? html`<div class="cors-note">${platform.note}</div>` : ''}
          <div class="cors-step-header" style="margin-top: 14px;">Step 2 — Quit and restart Ollama</div>
          <div class="cors-note">Close Ollama completely (menu bar → Quit Ollama), then open it again. The setting won't take effect until Ollama is restarted.</div>
        </div>
        <button
          class="cors-check-btn"
          ?disabled="${isChecking}"
          @click="${this._checkConnection}"
        >${isChecking ? 'Checking...' : 'Check Connection'}</button>
        ${platform.others.length > 0 ? html`
          <details class="cors-other-platforms">
            <summary>Other platforms</summary>
            ${platform.others.map(p => html`
              <div class="cors-platform-alt">
                <span class="cors-platform-label">${p.name}</span>
                <code class="cors-platform-cmd">${p.cmd}</code>
                <button
                  class="cors-copy-btn ${this._copiedCmd === p.id ? 'copied' : ''}"
                  @click="${() => this._copyCmd(p.cmd, p.id)}"
                >${this._copiedCmd === p.id ? 'Copied' : 'Copy'}</button>
              </div>
            `)}
          </details>
        ` : ''}
      </div>
    `;
  }

  _detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    const isMac = ua.includes('mac');
    const isWin = ua.includes('win');
    // Default to Linux if not Mac or Windows

    const platforms = {
      mac: {
        name: 'macOS',
        id: 'macos',
        cmd: 'launchctl setenv OLLAMA_ORIGINS "*"',
        note: null
      },
      linux: {
        name: 'Linux',
        id: 'linux',
        cmd: 'sudo systemctl edit ollama',
        note: 'Add this line under [Service]: Environment="OLLAMA_ORIGINS=*"'
      },
      win: {
        name: 'Windows',
        id: 'win',
        cmd: '[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")',
        note: 'Run in PowerShell as Administrator'
      }
    };

    let primary, others;
    if (isMac) {
      primary = platforms.mac;
      others = [platforms.linux, platforms.win];
    } else if (isWin) {
      primary = platforms.win;
      others = [platforms.mac, platforms.linux];
    } else {
      primary = platforms.linux;
      others = [platforms.mac, platforms.win];
    }

    return { ...primary, others };
  }
}

customElements.define('synthux-scanner', SynthuxScanner);
