/**
 * synthux — Report Component
 * 
 * <synthux-report> — Minimal report viewer
 * Score gauge, profile tabs, expandable heuristic cards, accessibility audit
 */

import { LitElement, html, css } from 'lit';
import './synthux-score.js';
import { compareReports, generateAiFixPrompt } from '../../../extension/core/business-context.js';

export class SynthuxReport extends LitElement {
  static properties = {
    report: { type: Object },
    history: { type: Array },
    showHistory: { type: Boolean },
    activeProfile: { type: String },
    expandedHeuristic: { type: String },
    expandAllHeuristics: { type: Boolean },
    issueSearch: { type: String },
    copied: { type: Boolean },
    copiedMdClip: { type: Boolean },
    copiedFixPrompt: { type: Boolean },
    activeFilter: { type: String },
    copiedFix: { type: String },
    heatmapActive: { type: Boolean },
    historySearch: { type: String },
    compareMode: { type: Boolean },
    compareIds: { type: Array },
    comparisonResult: { type: Object },
    copiedDiffMd: { type: Boolean }
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
      padding: 8px 4px;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.04));
      border-radius: 4px;
      cursor: pointer;
      transition: background 150ms ease;
    }

    .issue-item:hover {
      background: rgba(59, 130, 246, 0.06);
    }

    .issue-item:last-child { border-bottom: none; }

    /* ─── Heatmap Toggle ────────────────────────── */
    .heatmap-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0 0 14px;
    }

    .heatmap-label {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 500;
    }

    .heatmap-switch {
      position: relative;
      width: 36px;
      height: 20px;
      background: var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 10px;
      cursor: pointer;
      transition: background 200ms ease;
      border: none;
      padding: 0;
    }

    .heatmap-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--sx-text-tertiary, #8a8a96);
      transition: transform 200ms ease, background 200ms ease;
    }

    .heatmap-switch.active {
      background: rgba(239, 68, 68, 0.25);
    }

    .heatmap-switch.active::after {
      transform: translateX(16px);
      background: #ef4444;
    }

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

    /* ─── Code Fix Block ──────────────────────── */
    .code-fix-block {
      margin-top: 6px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    .code-fix-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      background: rgba(59,130,246,0.08);
      font-size: 10px;
      color: var(--sx-accent, #3b82f6);
    }

    .code-fix-copy {
      padding: 2px 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 3px;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 9px;
      cursor: pointer;
      font-family: inherit;
      transition: all 150ms ease;
    }

    .code-fix-copy:hover {
      color: var(--sx-accent, #3b82f6);
      border-color: var(--sx-accent, #3b82f6);
    }

    .code-fix-copy.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34,197,94,0.3);
    }

    .code-fix-pre {
      padding: 8px;
      background: rgba(0,0,0,0.3);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 11px;
      line-height: 1.5;
      color: var(--sx-text-secondary, #b4b4bc);
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
    }

    .code-fix-label {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      padding: 2px 8px 0;
      background: rgba(0,0,0,0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .code-fix-label:first-of-type { padding-top: 4px; }

    /* ─── Priority Badge ──────────────────────── */
    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 600;
      margin-left: 4px;
      letter-spacing: 0.3px;
    }

    .priority-badge.quick-win {
      background: rgba(234,179,8,0.12);
      color: #eab308;
    }

    .priority-badge.high {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-error, #ef4444);
    }

    .effort-tag {
      display: inline-flex;
      align-items: center;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 9px;
      margin-left: 3px;
    }

    .effort-tag.easy {
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
      color: var(--sx-success, #22c55e);
    }

    .effort-tag.hard {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Filter Bar ─────────────────────────── */
    .filter-bar {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      overflow-x: auto;
    }

    .filter-btn {
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      white-space: nowrap;
    }

    .filter-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .filter-btn.active {
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .filter-count {
      font-weight: 700;
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

    .export-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .export-btn {
      width: 100%;
      height: 34px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 6px;
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      white-space: nowrap;
      box-sizing: border-box;
    }

    .export-btn svg {
      flex-shrink: 0;
    }

    .export-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.14));
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-bg-tertiary, #202024);
    }

    .export-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.25);
    }

    .export-btn.pdf {
      border-color: rgba(59,130,246,0.28);
      color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.06);
    }

    .export-btn.pdf:hover {
      background: rgba(59,130,246,0.12);
      border-color: var(--sx-accent, #3b82f6);
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

    /* ─── v2.2 KPI Strip, Business Context, Matrix & Diff ─── */
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 6px;
      margin-bottom: 14px;
    }

    .kpi-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      padding: 8px 6px;
      text-align: center;
    }

    .kpi-val {
      font-size: 15px;
      font-weight: 700;
      color: var(--sx-text-primary, #ededf0);
    }

    .kpi-val.high { color: var(--sx-success, #22c55e); }
    .kpi-val.mid { color: var(--sx-warning, #eab308); }
    .kpi-val.low { color: var(--sx-error, #ef4444); }
    .kpi-val.accent { color: var(--sx-accent, #3b82f6); }

    .kpi-lbl {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 2px;
    }

    .biz-report-card {
      background: linear-gradient(180deg, rgba(59,130,246,0.07), rgba(28,28,31,0.96));
      border: 1px solid rgba(59,130,246,0.28);
      border-radius: 8px;
      padding: 11px 12px;
      margin-bottom: 16px;
    }

    .biz-report-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .biz-report-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .must-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 5px 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 11px;
    }

    .must-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .must-badge.pass { background: rgba(34,197,94,0.14); color: #22c55e; }
    .must-badge.partial { background: rgba(234,179,8,0.14); color: #eab308; }
    .must-badge.missing { background: rgba(239,68,68,0.14); color: #ef4444; }

    .matrix-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 14px;
    }

    .matrix-cell {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 7px;
      padding: 7px 9px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 150ms ease;
    }

    .matrix-cell:hover, .matrix-cell.active {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.08);
    }

    .matrix-cell-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .matrix-cell-sub {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }

    .search-input {
      flex: 1;
      padding: 6px 9px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-primary, #ededf0);
      font-size: 11px;
      font-family: inherit;
    }

    .mini-action-btn {
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 10px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
    }

    .mini-action-btn:hover, .mini-action-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .history-item.selected-compare {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.10);
    }

    .diff-box {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid rgba(59,130,246,0.35);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
    }
  `;

  constructor() {
    super();
    this.report = null;
    this.history = [];
    this.showHistory = false;
    this.activeProfile = '';
    this.expandedHeuristic = '';
    this.expandAllHeuristics = false;
    this.issueSearch = '';
    this.copied = false;
    this.copiedMdClip = false;
    this.copiedFixPrompt = false;
    this.activeFilter = 'all';
    this.copiedFix = '';
    this.heatmapActive = false;
    this.historySearch = '';
    this.compareMode = false;
    this.compareIds = [];
    this.comparisonResult = null;
    this.copiedDiffMd = false;
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

  // ─── Overlay Methods ──────────────────────────────────────────────────

  _highlightIssue(issue) {
    if (!issue.element) return;
    chrome.runtime.sendMessage({
      type: 'HIGHLIGHT_ELEMENT',
      payload: {
        selector: issue.element,
        description: issue.description,
        severity: issue.severity
      }
    }).catch(() => {});
  }

  _clearHighlight() {
    chrome.runtime.sendMessage({
      type: 'CLEAR_HIGHLIGHT',
      payload: {}
    }).catch(() => {});
  }

  _toggleHeatmap() {
    this.heatmapActive = !this.heatmapActive;

    if (this.heatmapActive) {
      // Collect all issues with element selectors from all profiles
      const allIssues = [];
      Object.values(this.report?.profileResults || {}).forEach(pr => {
        (pr.evaluations || []).forEach(ev => {
          (ev.issues || []).forEach(issue => {
            if (issue.element) {
              allIssues.push({
                element: issue.element,
                severity: issue.severity,
                description: issue.description
              });
            }
          });
        });
      });

      chrome.runtime.sendMessage({
        type: 'SHOW_HEATMAP',
        payload: { issues: allIssues }
      }).catch(() => {});
    } else {
      chrome.runtime.sendMessage({
        type: 'CLEAR_HEATMAP',
        payload: {}
      }).catch(() => {});
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up overlays when component is removed
    chrome.runtime.sendMessage({ type: 'CLEAR_OVERLAYS', payload: {} }).catch(() => {});
  }

  _getScoreClass(score) {
    if (score >= 71) return 'high';
    if (score >= 41) return 'mid';
    return 'low';
  }

  _copyMarkdownToClipboard() {
    if (!this.report?.markdown) return;
    navigator.clipboard.writeText(this.report.markdown).then(() => {
      this.copiedMdClip = true;
      setTimeout(() => { this.copiedMdClip = false; }, 2000);
    });
  }

  _copyAiFixPromptToClipboard() {
    if (!this.report) return;
    const text = this.report.aiFixPrompt || generateAiFixPrompt(this.report);
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedFixPrompt = true;
      setTimeout(() => { this.copiedFixPrompt = false; }, 2000);
    });
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

  async _downloadPDF() {
    if (!this.report) return;
    try {
      // Lazy load PDF module to avoid ~800KB bundle bloat
      const { generatePDF } = await import('../../../extension/core/pdf-export.js');
      const blob = generatePDF(this.report);
      const hostname = this._shortenUrl(this.report.url).replace(/[\/:.]/g, '-').replace(/-+/g, '-');
      const filename = `synthux-report-${hostname}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[synthux] PDF generation failed:', err);
    }
  }

  _renderBusinessAlignmentSection(r) {
    const ba = r.businessAlignment;
    if (!ba) return '';
    return html`
      <div class="biz-report-card">
        <div class="biz-report-head">
          <div class="biz-report-title" style="display:flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--sx-accent,#3b82f6);flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            <span>${ba.contextName || 'Business & Goal Alignment'}</span>
          </div>
          <span class="heuristic-score-badge ${this._getScoreClass(ba.goalAlignmentScore)}">${ba.goalAlignmentScore}/100</span>
        </div>
        ${ba.primaryGoal ? html`<div style="font-size:11px;color:var(--sx-accent,#3b82f6);font-weight:500;margin-bottom:4px;">Goal: ${ba.primaryGoal}</div>` : ''}
        ${ba.goalSummary ? html`<div style="font-size:11px;color:var(--sx-text-secondary,#b4b4bc);line-height:1.45;margin-bottom:8px;">${ba.goalSummary}</div>` : ''}

        ${(ba.mustHavesAudit || []).length > 0 ? html`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Non-Negotiable Must-Haves</div>
          ${ba.mustHavesAudit.map(m => html`
            <div class="must-row">
              <span class="must-badge ${m.status}">${m.status}</span>
              <div style="flex:1;min-width:0;">
                <div style="color:var(--sx-text-primary,#ededf0);font-weight:500;">${m.item}</div>
                ${m.evidence ? html`<div style="font-size:10px;color:var(--sx-text-tertiary,#8a8a96);margin-top:1px;">${m.evidence}</div>` : ''}
                ${m.status !== 'pass' && m.recommendation ? html`<div style="font-size:10px;color:var(--sx-accent,#3b82f6);margin-top:2px;">→ ${m.recommendation}</div>` : ''}
              </div>
            </div>
          `)}
        ` : ''}

        ${(ba.metricInsights || []).length > 0 ? html`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 4px;">Metric Bottleneck Diagnosis</div>
          ${ba.metricInsights.map(mi => html`
            <div class="must-row">
              <div style="flex:1;">
                <div style="color:var(--sx-text-primary,#ededf0);font-weight:600;">${mi.metric}</div>
                ${mi.rootCause ? html`<div style="font-size:10px;color:var(--sx-text-secondary,#b4b4bc);margin-top:1px;">Cause: ${mi.rootCause}</div>` : ''}
                ${mi.action ? html`<div style="font-size:10px;color:var(--sx-accent,#3b82f6);margin-top:1px;">Action: ${mi.action}</div>` : ''}
              </div>
            </div>
          `)}
        ` : ''}

        ${(ba.departmentFindings || []).length > 0 ? html`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 4px;">Department Lenses</div>
          ${ba.departmentFindings.map(df => html`
            <div class="must-row">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:var(--sx-text-primary,#ededf0);font-weight:600;">${df.departmentName}</span>
                  <span style="font-size:10px;font-weight:700;color:var(--sx-accent,#3b82f6);">${df.score}/100</span>
                </div>
                ${df.summary ? html`<div style="font-size:10px;color:var(--sx-text-secondary,#b4b4bc);margin-top:1px;">${df.summary}</div>` : ''}
              </div>
            </div>
          `)}
        ` : ''}
      </div>
    `;
  }

  _renderPriorityMatrix(activeResults) {
    const allIssues = (activeResults?.evaluations || []).flatMap(ev => ev.issues || []);
    if (allIssues.length === 0) return '';
    const qw = allIssues.filter(i => i.isQuickWin || (i.priority === 'high' && i.fixEffort === 'easy')).length;
    const major = allIssues.filter(i => i.priority === 'high' && i.fixEffort !== 'easy').length;
    const fill = allIssues.filter(i => i.priority !== 'high' && i.fixEffort === 'easy').length;
    const backlog = allIssues.filter(i => i.priority !== 'high' && i.fixEffort !== 'easy').length;

    return html`
      <div class="section-header">2×2 Impact × Effort Matrix</div>
      <div class="matrix-grid">
        <button class="matrix-cell ${this.activeFilter === 'quick-wins' ? 'active' : ''}" @click="${() => { this.activeFilter = this.activeFilter === 'quick-wins' ? 'all' : 'quick-wins'; }}">
          <div class="matrix-cell-top"><span>Quick Wins</span><span style="color:#22c55e;">${qw}</span></div>
          <div class="matrix-cell-sub">High Impact · Easy Fix</div>
        </button>
        <button class="matrix-cell ${this.activeFilter === 'major' ? 'active' : ''}" @click="${() => { this.activeFilter = this.activeFilter === 'major' ? 'all' : 'major'; }}">
          <div class="matrix-cell-top"><span>Major Projects</span><span style="color:#eab308;">${major}</span></div>
          <div class="matrix-cell-sub">High Impact · Mod/Hard</div>
        </button>
        <button class="matrix-cell ${this.activeFilter === 'easy-fixes' ? 'active' : ''}" @click="${() => { this.activeFilter = this.activeFilter === 'easy-fixes' ? 'all' : 'easy-fixes'; }}">
          <div class="matrix-cell-top"><span>Fill-Ins</span><span style="color:#3b82f6;">${fill}</span></div>
          <div class="matrix-cell-sub">Med/Low Impact · Easy</div>
        </button>
        <button class="matrix-cell ${this.activeFilter === 'backlog' ? 'active' : ''}" @click="${() => { this.activeFilter = this.activeFilter === 'backlog' ? 'all' : 'backlog'; }}">
          <div class="matrix-cell-top"><span>Backlog</span><span style="color:#8a8a96;">${backlog}</span></div>
          <div class="matrix-cell-sub">Med/Low Impact · Hard</div>
        </button>
      </div>
    `;
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
    const quickWinsCount = (r.issues || []).filter(i => i.isQuickWin || (i.priority === 'high' && i.fixEffort === 'easy')).length;

    return html`
      <div class="overall-section">
        <synthux-score value="${r.overallScore || 0}" label="Overall UX Score" size="lg"></synthux-score>
        <div class="report-meta">
          ${this._shortenUrl(r.url)}${r.model ? html`<br>${r.model} · ` : ''}${r.mode === 'deep' ? 'Deep' : r.mode === 'custom' ? 'Custom' : r.mode === 'wcag-only' ? 'Instant WCAG' : 'Quick'}${r.rulePackShortName || r.rulePackName ? html` · <span style="color: var(--sx-accent, #3b82f6); font-weight: 500;">${r.rulePackShortName || r.rulePackName}</span>` : ''}
          ${r.timestamp ? html` · ${new Date(r.timestamp).toLocaleString()}` : ''}
          ${r.costSummary ? html`<br><span style="color: ${r.costSummary.isLocal ? 'var(--sx-success, #22c55e)' : 'var(--sx-warning, #eab308)'}">${r.costSummary.formatted}</span>` : ''}
        </div>
      </div>

      <!-- KPI Strip -->
      <div class="kpi-strip">
        <div class="kpi-card">
          <div class="kpi-val ${this._getScoreClass(r.overallScore || 0)}">${r.overallScore || 0}</div>
          <div class="kpi-lbl">UX Score</div>
        </div>
        ${r.accessibilityResults ? html`
          <div class="kpi-card">
            <div class="kpi-val ${this._getScoreClass(r.accessibilityResults.score || 0)}">${r.accessibilityResults.score || 0}</div>
            <div class="kpi-lbl">WCAG 2.2</div>
          </div>
        ` : ''}
        ${r.businessAlignment ? html`
          <div class="kpi-card">
            <div class="kpi-val ${this._getScoreClass(r.businessAlignment.goalAlignmentScore || 0)}">${r.businessAlignment.goalAlignmentScore || 0}</div>
            <div class="kpi-lbl">Goal Fit</div>
          </div>
        ` : ''}
        <div class="kpi-card">
          <div class="kpi-val accent">${quickWinsCount}</div>
          <div class="kpi-lbl">Quick Wins</div>
        </div>
      </div>

      <div class="heatmap-toggle">
        <span class="heatmap-label">Heatmap</span>
        <button class="heatmap-switch ${this.heatmapActive ? 'active' : ''}" 
          @click="${this._toggleHeatmap}" 
          title="${this.heatmapActive ? 'Heatmap is ON — click to hide' : 'Show issue heatmap on page'}">
        </button>
      </div>

      ${this._renderBusinessAlignmentSection(r)}

      <div class="profile-tabs">
        ${Object.entries(r.profileResults || {}).map(([id, pr]) => html`
          <button class="profile-tab ${this.activeProfile === id ? 'active' : ''}" @click="${() => this.activeProfile = id}" title="${pr.profile.custom ? `${pr.profile.ageRange || ''} · ${pr.profile.techLevel || ''} tech${pr.profile.goal ? ` · ${pr.profile.goal}` : ''}` : pr.profile.description?.en || ''}">
            <span>${pr.profile.name?.en || id}${pr.profile.custom ? html`<span style="font-size: 8px; background: rgba(0,126,255,0.1); color: #007eff; padding: 0 4px; border-radius: 4px; margin-left: 4px; vertical-align: middle;">C</span>` : ''}</span>
            <span class="profile-tab-score">${pr.score}</span>
          </button>
        `)}
      </div>

      ${activeResults ? html`
        ${this._renderPriorityMatrix(activeResults)}
        ${this._renderFilterBar(activeResults)}
        <div class="search-row">
          <input
            type="text"
            class="search-input"
            placeholder="Search issues, selectors, or recommendations..."
            .value="${this.issueSearch || ''}"
            @input="${(e) => { this.issueSearch = e.target.value; }}"
          />
          <button class="mini-action-btn" @click="${() => { this.expandAllHeuristics = !this.expandAllHeuristics; }}">
            ${this.expandAllHeuristics ? 'Collapse' : 'Expand All'}
          </button>
        </div>
        <div class="section-header">Evaluations</div>
        <div class="heuristic-list">
          ${(activeResults.evaluations || []).map(ev => {
            const filteredIssues = this._filterIssues(ev.issues || []);
            // Hide cards with no matching issues when filter or search is active
            if ((this.activeFilter !== 'all' || this.issueSearch) && filteredIssues.length === 0) return '';
            // Auto-expand when filter/search/expandAll is active
            const isExpanded = this.expandAllHeuristics || this.activeFilter !== 'all' || Boolean(this.issueSearch) || this.expandedHeuristic === ev.heuristicId;
            return html`
            <div class="heuristic-card">
              <div class="heuristic-header" @click="${() => this._toggleHeuristic(ev.heuristicId)}">
                <span class="heuristic-score-badge ${this._getScoreClass(ev.score)}">${ev.score}</span>
                <span class="heuristic-name">${ev.heuristicName?.en || ev.heuristicId}</span>
                <span class="heuristic-chevron ${isExpanded ? 'open' : ''}">▶</span>
              </div>
              ${isExpanded ? html`
                <div class="heuristic-detail">
                  <div class="heuristic-summary">${ev.summary}</div>
                  ${filteredIssues.map(issue => html`
                    <div class="issue-item"
                      @mouseenter="${() => this._highlightIssue(issue)}"
                      @mouseleave="${() => this._clearHighlight()}">
                      <span class="severity-dot ${issue.severity}"></span>
                      <div class="issue-content">
                        <div class="issue-desc">
                          ${issue.description}
                          ${issue.isQuickWin ? html`<span class="priority-badge quick-win">Quick Win</span>` : 
                            issue.priority === 'high' ? html`<span class="priority-badge high">HIGH</span>` : ''}
                          ${issue.fixEffort === 'easy' ? html`<span class="effort-tag easy">Easy fix</span>` :
                            issue.fixEffort === 'hard' ? html`<span class="effort-tag hard">Hard</span>` : ''}
                        </div>
                        ${issue.element ? html`<div class="issue-element">${issue.element}</div>` : ''}
                        ${issue.recommendation ? html`<div class="issue-recommendation">${issue.recommendation}</div>` : ''}
                        ${issue.codeFix ? html`
                          <div class="code-fix-block">
                            <div class="code-fix-header">
                              <span>${issue.codeFix.language.toUpperCase()} fix</span>
                              <button class="code-fix-copy ${this.copiedFix === issue.element ? 'copied' : ''}" 
                                @click="${(e) => { e.stopPropagation(); this._copyFix(issue); }}">
                                ${this.copiedFix === issue.element ? 'Copied ✓' : 'Copy'}
                              </button>
                            </div>
                            ${issue.codeFix.before ? html`
                              <div class="code-fix-label">Before</div>
                              <pre class="code-fix-pre">${issue.codeFix.before}</pre>
                            ` : ''}
                            <div class="code-fix-label">After</div>
                            <pre class="code-fix-pre">${issue.codeFix.after}</pre>
                          </div>
                        ` : ''}
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
          `})}
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

        ${(r.accessibilityResults.wcagViolations?.length > 0) ? html`
          <div class="section-header">WCAG Violations <span style="font-weight: 400; font-size: 10px; text-transform: none; letter-spacing: 0; color: var(--sx-text-tertiary, #8a8a96);">(axe-core)</span></div>
          <div class="a11y-section">
            ${r.accessibilityResults.wcagViolations.map(v => html`
              <div class="a11y-card" style="margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="
                    font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 4px;
                    background: ${v.impact === 'critical' ? 'rgba(239,68,68,0.15)' : v.impact === 'serious' ? 'rgba(234,179,8,0.15)' : v.impact === 'moderate' ? 'rgba(59,130,246,0.15)' : 'rgba(138,138,150,0.15)'};
                    color: ${v.impact === 'critical' ? '#ef4444' : v.impact === 'serious' ? '#eab308' : v.impact === 'moderate' ? '#3b82f6' : '#8a8a96'};
                  ">${v.impact}</span>
                  ${v.tags?.length ? html`<span style="font-size: 9px; color: var(--sx-text-tertiary, #8a8a96);">${v.tags.join(', ')}</span>` : ''}
                </div>
                <div style="font-size: 12px; font-weight: 500; color: var(--sx-text-primary, #ededf0); margin-bottom: 3px;">${v.help}</div>
                <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); margin-bottom: 4px;">${v.description}</div>
                ${v.nodes?.length ? html`
                  <div style="font-size: 10px; color: var(--sx-text-tertiary, #8a8a96); margin-bottom: 3px;">Affected elements (${v.nodes.length}):</div>
                  ${v.nodes.slice(0, 3).map(n => html`
                    <div style="font-size: 10px; font-family: monospace; background: var(--sx-bg-main, #121214); padding: 4px 6px; border-radius: 4px; margin-bottom: 2px; color: var(--sx-text-secondary, #b4b4bc); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${n.target || n.html}</div>
                  `)}
                ` : ''}
                ${v.helpUrl ? html`<a href="${v.helpUrl}" target="_blank" rel="noopener" style="font-size: 10px; color: var(--sx-accent, #3b82f6); text-decoration: none;">Learn more →</a>` : ''}
              </div>
            `)}
          </div>
        ` : ''}

        ${r.accessibilityResults.wcagPasses ? html`
          <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); padding: 4px 0; margin-bottom: 12px;">
            ✓ ${r.accessibilityResults.wcagPasses} WCAG rules passed
          </div>
        ` : ''}
      ` : ''}

      <div class="export-bar">
        <div class="export-actions">
          <button class="export-btn ${this.copiedMdClip ? 'copied' : ''}" @click="${this._copyMarkdownToClipboard}" title="Copy full Markdown report to clipboard">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>${this.copiedMdClip ? 'Copied' : 'Copy MD'}</span>
          </button>
          <button class="export-btn ${this.copiedFixPrompt ? 'copied' : ''}" @click="${this._copyAiFixPromptToClipboard}" title="Copy actionable AI Coding Agent fix prompt">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>${this.copiedFixPrompt ? 'Copied' : 'Fix Prompt'}</span>
          </button>
          <button class="export-btn ${this.copied ? 'copied' : ''}" @click="${this._downloadMarkdown}" title="Download .md file">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${this.copied ? 'Saved' : '.MD'}</span>
          </button>
          <button class="export-btn pdf" @click="${this._downloadPDF}" title="Download vector PDF report">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>PDF</span>
          </button>
        </div>
      </div>
    `;
  }

  _toggleCompareSelection(id) {
    let ids = [...(this.compareIds || [])];
    if (ids.includes(id)) {
      ids = ids.filter(x => x !== id);
    } else {
      if (ids.length >= 2) ids.shift();
      ids.push(id);
    }
    this.compareIds = ids;

    if (ids.length === 2) {
      const e1 = (this.history || []).find(h => h.id === ids[0]);
      const e2 = (this.history || []).find(h => h.id === ids[1]);
      if (e1?.report && e2?.report) {
        const [older, newer] = new Date(e1.timestamp) <= new Date(e2.timestamp) ? [e1, e2] : [e2, e1];
        this.comparisonResult = compareReports(
          { ...older.report, id: older.id },
          { ...newer.report, id: newer.id }
        );
      }
    } else {
      this.comparisonResult = null;
    }
  }

  _copyDiffMarkdown() {
    if (!this.comparisonResult?.markdown) return;
    navigator.clipboard.writeText(this.comparisonResult.markdown).then(() => {
      this.copiedDiffMd = true;
      setTimeout(() => { this.copiedDiffMd = false; }, 2000);
    });
  }

  _renderHistory() {
    if (!this.history || this.history.length === 0) {
      return html`
        <div class="history-empty">
          No past reports yet. Analyze a page to start building history.
        </div>
      `;
    }

    const q = (this.historySearch || '').toLowerCase().trim();
    const filteredHistory = q
      ? this.history.filter(h => (h.title || '').toLowerCase().includes(q) || (h.url || '').toLowerCase().includes(q))
      : this.history;

    return html`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="section-header" style="margin:0;">Past reports (${this.history.length})</div>
        <div style="display:flex;gap:5px;">
          ${this.history.length >= 2 ? html`
            <button
              class="mini-action-btn ${this.compareMode ? 'active' : ''}"
              @click="${() => { this.compareMode = !this.compareMode; this.compareIds = []; this.comparisonResult = null; }}"
            >${this.compareMode ? 'Exit Compare' : 'Compare (Diff)'}</button>
          ` : ''}
          <button
            class="mini-action-btn"
            @click="${() => this.dispatchEvent(new CustomEvent('clear-history', { bubbles: true, composed: true }))}"
            title="Clear all saved reports"
          >Clear</button>
        </div>
      </div>

      <div class="search-row">
        <input
          type="text"
          class="search-input"
          placeholder="Search past reports by URL or title..."
          .value="${this.historySearch || ''}"
          @input="${(e) => { this.historySearch = e.target.value; }}"
        />
      </div>

      ${this.compareMode ? html`
        <div style="font-size:11px;color:var(--sx-accent,#3b82f6);margin-bottom:8px;">
          Select any 2 reports below to compare Before vs After (${this.compareIds.length}/2 selected).
        </div>
      ` : ''}

      ${this.comparisonResult ? html`
        <div class="diff-box">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:700;color:var(--sx-text-primary,#ededf0);">Before vs After Audit Diff</span>
            <button class="mini-action-btn" @click="${this._copyDiffMarkdown}">
              ${this.copiedDiffMd ? 'Copied' : 'Copy Diff MD'}
            </button>
          </div>
          <div class="kpi-strip" style="margin-bottom:10px;">
            <div class="kpi-card">
              <div class="kpi-val ${this.comparisonResult.scores.overallScoreDelta >= 0 ? 'high' : 'low'}">
                ${this.comparisonResult.scores.baseScore} → ${this.comparisonResult.scores.targetScore}
                (${this.comparisonResult.scores.overallScoreDelta > 0 ? '+' : ''}${this.comparisonResult.scores.overallScoreDelta})
              </div>
              <div class="kpi-lbl">UX Score Delta</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-val high">${this.comparisonResult.counts.resolvedCount}</div>
              <div class="kpi-lbl">Resolved</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-val low">${this.comparisonResult.counts.newCount}</div>
              <div class="kpi-lbl">New Issues</div>
            </div>
          </div>

          ${this.comparisonResult.resolvedIssues.length > 0 ? html`
            <div style="font-size:10px;font-weight:600;color:#22c55e;margin-bottom:3px;">Resolved Issues (${this.comparisonResult.resolvedIssues.length})</div>
            ${this.comparisonResult.resolvedIssues.slice(0, 5).map(i => html`
              <div style="font-size:11px;color:var(--sx-text-secondary,#b4b4bc);padding:2px 0;text-decoration:line-through;">• ${i.description}</div>
            `)}
          ` : ''}

          ${this.comparisonResult.newIssues.length > 0 ? html`
            <div style="font-size:10px;font-weight:600;color:#ef4444;margin:6px 0 3px;">New Issues (${this.comparisonResult.newIssues.length})</div>
            ${this.comparisonResult.newIssues.slice(0, 5).map(i => html`
              <div style="font-size:11px;color:var(--sx-text-primary,#ededf0);padding:2px 0;">• ${i.description}</div>
            `)}
          ` : ''}
        </div>
      ` : ''}

      <div class="history-list">
        ${filteredHistory.map(entry => {
          const isSelected = (this.compareIds || []).includes(entry.id);
          return html`
            <div
              class="history-item ${isSelected ? 'selected-compare' : ''}"
              @click="${() => this.compareMode ? this._toggleCompareSelection(entry.id) : this._loadFromHistory(entry.id)}"
            >
              <span class="history-score ${this._getScoreClass(entry.score)}">${entry.score}</span>
              <div class="history-details">
                <div class="history-title">${entry.title || entry.url || 'Untitled'}</div>
                <div class="history-meta">
                  ${this._formatDate(entry.timestamp)} · ${entry.mode} · ${entry.model}
                  ${entry.goalScore != null ? html` · <span style="color:var(--sx-accent,#3b82f6);">Goal ${entry.goalScore}</span>` : ''}
                </div>
              </div>
              <button class="history-delete" @click="${(e) => { e.stopPropagation(); this._deleteFromHistory(entry.id); }}" title="Delete">×</button>
            </div>
          `;
        })}
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

  _copyFix(issue) {
    if (!issue.codeFix) return;
    const text = issue.codeFix.after;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedFix = issue.element;
      setTimeout(() => { this.copiedFix = ''; }, 2000);
    });
  }

  _filterIssues(issues) {
    const q = (this.issueSearch || '').toLowerCase().trim();
    return issues.filter(issue => {
      if (q) {
        const hay = `${issue.description || ''} ${issue.element || ''} ${issue.recommendation || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (this.activeFilter === 'all') return true;
      switch (this.activeFilter) {
        case 'quick-wins': return issue.isQuickWin || (issue.priority === 'high' && issue.fixEffort === 'easy');
        case 'major': return issue.priority === 'high' && issue.fixEffort !== 'easy';
        case 'critical': return issue.severity === 'critical';
        case 'easy-fixes': return issue.fixEffort === 'easy';
        case 'backlog': return issue.priority !== 'high' && issue.fixEffort !== 'easy';
        default: return true;
      }
    });
  }

  _getFilterCounts(activeResults) {
    const allIssues = (activeResults.evaluations || []).flatMap(ev => ev.issues || []);
    return {
      all: allIssues.length,
      quickWins: allIssues.filter(i => i.isQuickWin || (i.priority === 'high' && i.fixEffort === 'easy')).length,
      critical: allIssues.filter(i => i.severity === 'critical').length,
      easyFixes: allIssues.filter(i => i.fixEffort === 'easy').length
    };
  }

  _renderFilterBar(activeResults) {
    const counts = this._getFilterCounts(activeResults);
    if (counts.all === 0) return '';

    const filters = [
      { id: 'all', label: 'All', count: counts.all },
      { id: 'quick-wins', label: 'Quick Wins', count: counts.quickWins },
      { id: 'critical', label: 'Critical', count: counts.critical },
      { id: 'easy-fixes', label: 'Easy Fixes', count: counts.easyFixes }
    ];

    return html`
      <div class="filter-bar">
        ${filters.map(f => html`
          <button class="filter-btn ${this.activeFilter === f.id ? 'active' : ''}"
            @click="${() => this.activeFilter = f.id}">
            ${f.label} <span class="filter-count">${f.count}</span>
          </button>
        `)}
      </div>
    `;
  }
}

customElements.define('synthux-report', SynthuxReport);
