/**
 * synthux — MCP (Model Context Protocol) Extension Bridge
 *
 * Connects the Chrome Extension MV3 Service Worker to the local synthux MCP Server
 * over WebSocket (ws://127.0.0.1:17483/ws).
 *
 * Enables desktop AI agents (Google Antigravity, Claude Code / Desktop, Cursor,
 * OpenAI Codex, Windsurf, or Local LLM MCP hosts) and automated E2E test suites
 * to control 100% of synthux capabilities from start to finish:
 *   - Tab navigation & lifecycle management
 *   - Full DOM extraction & axe-core WCAG 2.2 AA auditing
 *   - Autonomous UX Audits (via Local Ollama or BYOK Cloud APIs)
 *   - Agent-Brain Passthrough Audits (the connected MCP Agent evaluates the page
 *     and synthux renders live overlays, annotated screenshots, and v2.0 reports)
 *   - Multi-page Flow Builder journey analysis
 *   - Live Issue Heatmap, Element Highlighting & Annotated Visual Audit screenshots
 *   - Sectoral Rule Pack & Custom Persona management
 */

import {
  getAllRulePacks,
  loadHeuristics,
  selectHeuristics,
  buildPrompt,
  parseEvaluation,
  calculateOverallScore,
  saveCustomRulePack,
  deleteCustomRulePack
} from './heuristics.js';
import {
  getAllProfiles,
  getProfileAsync,
  saveCustomProfile,
  deleteCustomProfile
} from './profiles.js';
import { runAccessibilityChecks } from './accessibility.js';
import { generateReport } from './report-generator.js';
import { captureScreenshot, captureAnnotatedScreenshot } from './screenshot.js';
import { FlowManager } from './flow-manager.js';

const DEFAULT_MCP_WS_URL = 'ws://127.0.0.1:17483/ws';
const RECONNECT_DELAY_MS = 5000;
const HEARTBEAT_INTERVAL_MS = 20000;

/**
 * Security Guard: Ensure MCP WebSocket URL is strictly loopback (127.0.0.1 / localhost).
 * Prevents accidental or malicious connection to external remote servers.
 */
export function isLoopbackWsUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'ws:') return false;
    return parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost' || parsed.hostname === '[::1]';
  } catch {
    return false;
  }
}

export class MCPBridge {
  constructor(handlers = {}) {
    this.handlers = handlers;
    this.ws = null;
    this.wsUrl = DEFAULT_MCP_WS_URL;
    this.mcpToken = '';
    this.enabled = true;
    this.connected = false;
    this.lastConnectedAt = null;
    this.lastCommand = null;
    this._reconnectTimer = null;
    this._heartbeatTimer = null;
  }

  /**
   * Initialize bridge and start connection loop
   */
  async init() {
    try {
      const stored = await chrome.storage.local.get({
        mcpEnabled: true,
        mcpWsUrl: DEFAULT_MCP_WS_URL,
        mcpToken: ''
      });
      this.enabled = stored.mcpEnabled !== false;
      this.wsUrl = isLoopbackWsUrl(stored.mcpWsUrl) ? stored.mcpWsUrl : DEFAULT_MCP_WS_URL;
      this.mcpToken = stored.mcpToken || '';
    } catch {
      this.enabled = true;
      this.wsUrl = DEFAULT_MCP_WS_URL;
      this.mcpToken = '';
    }

    if (this.enabled) {
      this.connect();
    }
  }

  /**
   * Enable/disable or change MCP WebSocket endpoint
   */
  async configure({ enabled, wsUrl, mcpToken } = {}) {
    if (typeof enabled === 'boolean') {
      this.enabled = enabled;
      await chrome.storage.local.set({ mcpEnabled: enabled });
    }
    if (wsUrl && typeof wsUrl === 'string') {
      const candidate = wsUrl.trim();
      if (!isLoopbackWsUrl(candidate)) {
        throw new Error('Security policy: MCP Bridge only allows local loopback (ws://127.0.0.1 or ws://localhost) connections.');
      }
      this.wsUrl = candidate;
      await chrome.storage.local.set({ mcpWsUrl: this.wsUrl });
    }
    if (typeof mcpToken === 'string') {
      this.mcpToken = mcpToken.trim();
      await chrome.storage.local.set({ mcpToken: this.mcpToken });
    }

    if (!this.enabled) {
      this.disconnect();
      return this.getStatus();
    }

    this.disconnect();
    this.connect();
    return this.getStatus();
  }

  getStatus() {
    return {
      enabled: this.enabled,
      connected: this.connected,
      wsUrl: this.wsUrl,
      tokenConfigured: !!this.mcpToken,
      securityMode: 'loopback-only (127.0.0.1)',
      lastConnectedAt: this.lastConnectedAt,
      lastCommand: this.lastCommand
    };
  }

  connect() {
    if (!this.enabled) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    clearTimeout(this._reconnectTimer);

    try {
      const ws = new WebSocket(this.wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.connected = true;
        this.lastConnectedAt = new Date().toISOString();
        console.info(`[synthux MCP] Connected to local MCP server at ${this.wsUrl}`);

        // Send registration handshake
        const manifest = chrome.runtime.getManifest?.() || { version: '2.1.0' };
        this._send({
          type: 'EXTENSION_HELLO',
          version: manifest.version,
          extensionId: chrome.runtime.id,
          token: this.mcpToken || undefined,
          timestamp: this.lastConnectedAt
        });

        this._startHeartbeat();
        this._broadcastStatus();
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PONG') return;
          if (msg.type === 'MCP_COMMAND' && msg.id) {
            this.lastCommand = {
              command: msg.command,
              timestamp: new Date().toISOString()
            };
            const result = await this._executeCommand(msg.command, msg.params || {});
            this._send({
              type: 'MCP_RESPONSE',
              id: msg.id,
              result
            });
          }
        } catch (err) {
          console.error('[synthux MCP] Command error:', err);
        }
      };

      ws.onclose = () => {
        const wasConnected = this.connected;
        this.connected = false;
        this.ws = null;
        this._stopHeartbeat();
        if (wasConnected) {
          this._broadcastStatus();
        }
        if (this.enabled) {
          this._reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        // Quietly close when MCP server is not running locally
        try { ws.close(); } catch {}
      };
    } catch {
      if (this.enabled) {
        this._reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
      }
    }
  }

  disconnect() {
    clearTimeout(this._reconnectTimer);
    this._stopHeartbeat();
    if (this.ws) {
      try { this.ws.close(); } catch {}
      this.ws = null;
    }
    this.connected = false;
    this._broadcastStatus();
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this._heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this._send({ type: 'PING', timestamp: Date.now() });
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  _stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  }

  _send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  _broadcastStatus() {
    chrome.runtime.sendMessage({
      type: 'MCP_STATUS_CHANGED',
      payload: this.getStatus()
    }).catch(() => {});
  }

  // ─── Command Dispatcher ────────────────────────────────────────────────────

  async _executeCommand(command, params = {}) {
    try {
      switch (command) {
        case 'PING_EXTENSION':
          return await this._handlePing();

        case 'LIST_TABS':
          return await this._handleListTabs();

        case 'OPEN_AND_WAIT_TAB':
          return await this._handleOpenAndWaitTab(params);

        case 'SCAN_PAGE':
          return await this._handleScanPage(params);

        case 'RUN_WCAG_AUDIT':
          return await this._handleRunWcagAudit(params);

        case 'START_ANALYSIS':
          return await this._handleStartAnalysis(params);

        case 'PREPARE_EXTERNAL_AUDIT':
          return await this._handlePrepareExternalAudit(params);

        case 'SUBMIT_EXTERNAL_AUDIT':
          return await this._handleSubmitExternalAudit(params);

        case 'START_FLOW_ANALYSIS':
          return await this._handleFlowAnalysis(params);

        case 'VISUAL_OVERLAY':
          return await this._handleVisualOverlay(params);

        case 'MANAGE_RULE_PACKS':
          return await this._handleManageRulePacks(params);

        case 'MANAGE_PERSONAS':
          return await this._handleManagePersonas(params);

        case 'CONFIGURE_AI':
          return await this._handleConfigureAI(params);

        case 'GET_REPORTS':
          return await this._handleGetReports(params);

        default:
          return { error: `Unknown MCP command: ${command}` };
      }
    } catch (err) {
      return { error: err.message || String(err) };
    }
  }

  // ─── Individual Command Handlers ───────────────────────────────────────────

  async _resolveTargetTab(params = {}) {
    if (params.url && params.openIfNeeded !== false) {
      const opened = await this._handleOpenAndWaitTab({
        url: params.url,
        newTab: params.newTab,
        active: params.active !== false
      });
      if (opened.tab) return opened.tab;
    }

    if (params.tabId) {
      try {
        const tab = await chrome.tabs.get(Number(params.tabId));
        if (tab) return tab;
      } catch {}
    }

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.url && /^https?:\/\//i.test(activeTab.url)) {
      return activeTab;
    }

    const allTabs = await chrome.tabs.query({});
    const webTab = allTabs.find(t => t.url && /^https?:\/\//i.test(t.url));
    return webTab || activeTab || null;
  }

  async _handlePing() {
    const manifest = chrome.runtime.getManifest?.() || { version: '2.1.0' };
    const tab = await this._resolveTargetTab({});
    const aiStatus = this.handlers.checkOllamaConnection
      ? await this.handlers.checkOllamaConnection()
      : { connected: false };

    return {
      success: true,
      extensionVersion: manifest.version,
      mcpBridge: this.getStatus(),
      activeTab: tab ? { id: tab.id, url: tab.url, title: tab.title } : null,
      aiStatus
    };
  }

  async _handleListTabs() {
    const tabs = await chrome.tabs.query({});
    return {
      success: true,
      tabs: tabs
        .filter(t => t.url && !t.url.startsWith('chrome-extension://'))
        .map(t => ({
          id: t.id,
          url: t.url,
          title: t.title,
          active: t.active,
          windowId: t.windowId
        }))
    };
  }

  async _handleOpenAndWaitTab({ url, tabId, newTab = false, active = true, timeoutMs = 20000 }) {
    if (!url || !/^https?:\/\//i.test(url)) {
      return { error: 'A valid http:// or https:// URL is required.' };
    }

    let tab = null;
    if (!newTab && tabId) {
      tab = await chrome.tabs.update(Number(tabId), { url, active });
    } else if (!newTab) {
      const existing = await chrome.tabs.query({});
      const match = existing.find(t => t.url === url);
      if (match) {
        tab = await chrome.tabs.update(match.id, { active });
      } else {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && activeTab.url && (activeTab.url === 'about:blank' || activeTab.url.startsWith('chrome://newtab'))) {
          tab = await chrome.tabs.update(activeTab.id, { url, active });
        } else {
          tab = await chrome.tabs.create({ url, active });
        }
      }
    } else {
      tab = await chrome.tabs.create({ url, active });
    }

    // Wait for page load complete
    await new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        chrome.tabs.onUpdated.removeListener(listener);
        clearTimeout(timer);
        setTimeout(resolve, 500);
      };

      const listener = (updatedTabId, info) => {
        if (updatedTabId === tab.id && info.status === 'complete') {
          done();
        }
      };

      const timer = setTimeout(done, timeoutMs);
      chrome.tabs.onUpdated.addListener(listener);

      chrome.tabs.get(tab.id).then(current => {
        if (current?.status === 'complete' && current.url === url) {
          done();
        }
      }).catch(() => done());
    });

    const refreshedTab = await chrome.tabs.get(tab.id);
    return {
      success: true,
      tab: {
        id: refreshedTab.id,
        url: refreshedTab.url,
        title: refreshedTab.title,
        status: refreshedTab.status
      }
    };
  }

  async _handleScanPage(params = {}) {
    const tab = await this._resolveTargetTab(params);
    if (!tab?.id) return { error: 'No target web tab found to scan.' };

    const pageData = await this.handlers.scanPage(tab.id);
    let screenshot = null;
    if (params.includeScreenshot) {
      try {
        screenshot = await captureScreenshot(tab.id);
      } catch {}
    }

    return {
      success: true,
      tab: { id: tab.id, url: tab.url, title: tab.title },
      pageData,
      screenshot
    };
  }

  async _handleRunWcagAudit(params = {}) {
    const tab = await this._resolveTargetTab(params);
    if (!tab?.id) return { error: 'No target web tab found for WCAG audit.' };

    const pageData = await this.handlers.scanPage(tab.id);
    const deterministicResults = runAccessibilityChecks(pageData);

    let axeResults = null;
    try {
      axeResults = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { type: 'RUN_AXE_AUDIT' }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response?.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
      });
    } catch (err) {
      console.warn('[synthux MCP] axe-core audit warning:', err.message);
    }

    if (axeResults) {
      deterministicResults.wcagViolations = axeResults.violations || [];
      deterministicResults.wcagPasses = axeResults.passes || 0;
      deterministicResults.wcagIncomplete = axeResults.incomplete || [];

      const axeViolationCount = axeResults.violations?.length || 0;
      const axePassCount = axeResults.passes || 0;
      const axeTotal = axeViolationCount + axePassCount;
      if (axeTotal > 0) {
        const axeScore = Math.round((axePassCount / axeTotal) * 100);
        deterministicResults.score = Math.round(
          deterministicResults.score * 0.4 + axeScore * 0.6
        );
      }
    }

    return {
      success: true,
      tab: { id: tab.id, url: tab.url, title: tab.title },
      accessibilityResults: deterministicResults
    };
  }

  async _handleStartAnalysis(params = {}) {
    if (params.url) {
      await this._handleOpenAndWaitTab({ url: params.url, active: true });
    }
    return await this.handlers.handleStartAnalysis(params);
  }

  /**
   * Agent-Brain Mode (Step 1):
   * Scans the target page, runs WCAG 2.2 AA audit, loads rule pack & persona prompts,
   * and returns the complete audit context so the external MCP Agent (e.g., Antigravity,
   * Claude, Cursor, Codex) can evaluate the page with its own LLM.
   */
  async _handlePrepareExternalAudit(params = {}) {
    const tab = await this._resolveTargetTab(params);
    if (!tab?.id) return { error: 'No target web tab found.' };

    const rulePackId = params.rulePackId || 'nielsen-10';
    const mode = params.mode || 'quick';
    const profileIds = Array.isArray(params.profiles) && params.profiles.length > 0
      ? params.profiles
      : ['first-time', 'power-user', 'accessibility'];

    const pageData = await this.handlers.scanPage(tab.id);
    const wcag = await this._handleRunWcagAudit({ tabId: tab.id });
    const accessibilityResults = wcag.accessibilityResults || runAccessibilityChecks(pageData);

    let screenshot = null;
    if (params.includeScreenshot !== false) {
      try {
        screenshot = await captureScreenshot(tab.id);
      } catch {}
    }

    const rules = await loadHeuristics(rulePackId);
    const evaluationTasks = [];

    for (const profileId of profileIds) {
      const profile = await getProfileAsync(profileId);
      if (!profile) continue;

      const selectedRules = (params.heuristics && params.heuristics.length > 0)
        ? (rules.rules || []).filter(r => params.heuristics.includes(r.id))
        : selectHeuristics(rules, mode, profileId);

      for (const heuristic of selectedRules) {
        evaluationTasks.push({
          profileId: profile.id,
          profileName: profile.name?.en || profile.name,
          heuristicId: heuristic.id,
          heuristicName: heuristic.name?.en || heuristic.name,
          weight: heuristic.weight || 1.0,
          prompt: buildPrompt(heuristic, profile, pageData, !!screenshot)
        });
      }
    }

    return {
      success: true,
      tab: { id: tab.id, url: tab.url, title: tab.title },
      rulePack: {
        id: rules.id || rulePackId,
        name: rules.name,
        shortName: rules.shortName,
        ruleCount: (rules.rules || []).length
      },
      mode,
      profiles: profileIds,
      pageData,
      accessibilityResults,
      screenshot: params.includeScreenshot ? screenshot : null,
      screenshotAvailable: !!screenshot,
      evaluationTasks
    };
  }

  /**
   * Agent-Brain Mode (Step 2):
   * Receives heuristic evaluations generated by the external MCP Agent,
   * computes weighted scores, deduplicates issues, renders live page overlays,
   * captures an annotated screenshot, saves the report to extension history,
   * updates the Side Panel UI, and returns the full v2.0 Markdown & JSON report.
   */
  async _handleSubmitExternalAudit(params = {}) {
    const tab = await this._resolveTargetTab(params);
    if (!tab?.id) return { error: 'No target web tab found.' };

    const rulePackId = params.rulePackId || 'nielsen-10';
    const mode = params.mode || 'deep';
    const modelName = params.model || 'mcp-agent (external)';
    const providerName = params.provider || 'mcp';
    const rules = await loadHeuristics(rulePackId);

    const pageData = await this.handlers.scanPage(tab.id);
    const wcag = await this._handleRunWcagAudit({ tabId: tab.id });
    const accessibilityResults = wcag.accessibilityResults || runAccessibilityChecks(pageData);

    const rawEvaluations = Array.isArray(params.evaluations) ? params.evaluations : [];
    const profileGroups = new Map();

    for (const item of rawEvaluations) {
      const profileId = item.profileId || 'first-time';
      if (!profileGroups.has(profileId)) {
        profileGroups.set(profileId, []);
      }
      const ruleObj = (rules.rules || []).find(r => r.id === item.heuristicId) || {
        id: item.heuristicId || 'general-usability',
        name: { en: item.heuristicName || item.heuristicId || 'General Usability' }
      };
      const parsed = parseEvaluation(item.evaluation || item);
      profileGroups.get(profileId).push({
        heuristicId: ruleObj.id,
        heuristicName: ruleObj.name,
        ...parsed
      });
    }

    const profileResults = {};
    for (const [profileId, evaluations] of profileGroups.entries()) {
      const profile = (await getProfileAsync(profileId)) || {
        id: profileId,
        icon: '👤',
        name: { en: profileId, tr: profileId },
        description: { en: 'MCP Agent Persona', tr: 'MCP Agent Personası' }
      };
      const profileScore = calculateOverallScore(evaluations, rules);
      profileResults[profileId] = {
        profile: {
          id: profile.id,
          icon: profile.icon || '👤',
          name: profile.name,
          description: profile.description,
          custom: profile.custom || false,
          ageRange: profile.ageRange || null,
          techLevel: profile.techLevel || null,
          disabilities: profile.disabilities || null,
          goal: profile.goal || null
        },
        score: profileScore,
        evaluations
      };
    }

    const allScores = Object.values(profileResults).map(r => r.score);
    const overallScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : (accessibilityResults.score || 75);

    const allIssues = [];
    Object.values(profileResults).forEach(pr => {
      pr.evaluations.forEach(ev => {
        (ev.issues || []).forEach(issue => {
          allIssues.push({
            ...issue,
            heuristic: ev.heuristicName?.en || ev.heuristicName || ev.heuristicId,
            profile: pr.profile.name?.en || pr.profile.name || pr.profile.id,
            profileIcon: pr.profile.icon || '👤'
          });
        });
      });
    });

    let annotatedScreenshot = null;
    if (allIssues.length > 0) {
      try {
        annotatedScreenshot = await captureAnnotatedScreenshot(tab.id, allIssues);
      } catch {}
    }

    if (params.showHeatmap !== false && allIssues.length > 0 && this.handlers.relayOverlayMessage) {
      try {
        await this.handlers.relayOverlayMessage('SHOW_HEATMAP', { issues: allIssues }, tab.id);
      } catch {}
    }

    const report = generateReport({
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString(),
      model: modelName,
      mode,
      provider: providerName,
      rulePackId: rules.id || rulePackId,
      rulePackName: rules.name || "Nielsen's 10 Usability Heuristics",
      rulePackShortName: rules.shortName || 'Nielsen 10',
      ruleCount: (rules.rules || []).length,
      overallScore,
      profileResults,
      accessibilityResults,
      issues: allIssues,
      screenshot: null,
      annotatedScreenshot,
      costSummary: null
    });

    if (this.handlers.saveCompletedReport) {
      await this.handlers.saveCompletedReport(report);
    }

    return {
      success: true,
      report
    };
  }

  async _handleFlowAnalysis(params = {}) {
    const pages = Array.isArray(params.pages) ? params.pages : [];
    if (pages.length < 2) {
      return { error: 'Flow analysis requires at least 2 pages.' };
    }

    const normalizedPages = pages.map((p, idx) => ({
      id: p.id || `n${idx + 1}`,
      url: p.url,
      label: p.label || p.title || `Step ${idx + 1}`
    }));

    const connectors = Array.isArray(params.connectors) && params.connectors.length > 0
      ? params.connectors
      : normalizedPages.slice(0, -1).map((p, idx) => ({
          fromId: p.id,
          toId: normalizedPages[idx + 1].id
        }));

    const settings = await chrome.storage.local.get({
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma4',
      providerId: 'ollama',
      apiKey: '',
      synthux_selected_profiles: ['first-time', 'power-user', 'accessibility'],
      synthux_selected_mode: 'deep'
    });

    if (params.provider) settings.providerId = params.provider;
    if (params.model) settings.ollamaModel = params.model;
    if (params.endpoint) settings.ollamaEndpoint = params.endpoint;
    if (params.apiKey) settings.apiKey = params.apiKey;

    const flowManager = new FlowManager({});
    const result = await flowManager.analyzeFlow({
      pages: normalizedPages,
      connectors,
      notes: params.notes || [],
      settings,
      profiles: params.profiles || settings.synthux_selected_profiles,
      mode: params.mode || settings.synthux_selected_mode,
      sourceTabId: null
    });

    if (result?.error) {
      return { error: result.error };
    }
    return {
      success: true,
      flowReport: result
    };
  }

  async _handleVisualOverlay(params = {}) {
    const tab = await this._resolveTargetTab(params);
    if (!tab?.id) return { error: 'No target web tab found for overlay.' };

    const action = params.action || 'highlight';
    if (action === 'annotated_screenshot') {
      const issues = Array.isArray(params.issues) ? params.issues : [];
      const dataUrl = await captureAnnotatedScreenshot(tab.id, issues);
      return { success: true, annotatedScreenshot: dataUrl };
    }

    if (action === 'full_screenshot') {
      const dataUrl = await captureScreenshot(tab.id);
      return { success: true, screenshot: dataUrl };
    }

    const typeMap = {
      highlight: 'HIGHLIGHT_ELEMENT',
      clear_highlight: 'CLEAR_HIGHLIGHT',
      heatmap: 'SHOW_HEATMAP',
      clear_heatmap: 'CLEAR_HEATMAP',
      clear_all: 'CLEAR_OVERLAYS'
    };

    const msgType = typeMap[action] || 'CLEAR_OVERLAYS';
    return await this.handlers.relayOverlayMessage(msgType, params, tab.id);
  }

  async _handleManageRulePacks(params = {}) {
    const action = params.action || 'list';
    if (action === 'list') {
      const packs = await getAllRulePacks();
      return { success: true, rulePacks: packs };
    }
    if (action === 'get') {
      const pack = await loadHeuristics(params.rulePackId || 'nielsen-10');
      return { success: true, rulePack: pack };
    }
    if (action === 'save') {
      const saved = await saveCustomRulePack(params.rulePack);
      return { success: true, rulePack: saved };
    }
    if (action === 'delete') {
      const remaining = await deleteCustomRulePack(params.rulePackId);
      return { success: true, customRulePacks: remaining };
    }
    return { error: `Unknown rule pack action: ${action}` };
  }

  async _handleManagePersonas(params = {}) {
    const action = params.action || 'list';
    if (action === 'list') {
      const profiles = await getAllProfiles();
      return { success: true, profiles };
    }
    if (action === 'save') {
      const saved = await saveCustomProfile(params.persona || params.profile);
      return { success: true, profile: saved };
    }
    if (action === 'delete') {
      const remaining = await deleteCustomProfile(params.profileId);
      return { success: true, customProfiles: remaining };
    }
    return { error: `Unknown persona action: ${action}` };
  }

  async _handleConfigureAI(params = {}) {
    const action = params.action || 'get';
    if (action === 'update') {
      const updates = {};
      if (params.provider) updates.providerId = params.provider;
      if (params.model) updates.ollamaModel = params.model;
      if (params.endpoint) updates.ollamaEndpoint = params.endpoint;
      if (typeof params.apiKey === 'string') {
        updates.apiKey = params.apiKey;
        if (params.provider && params.provider !== 'ollama') {
          updates[`apiKey_${params.provider}`] = params.apiKey;
        }
      }
      if (typeof params.enableVision === 'boolean') updates.enableVision = params.enableVision;
      if (params.rulePackId) updates.rulePackId = params.rulePackId;
      if (params.analysisMode) updates.analysisMode = params.analysisMode;
      if (params.language) updates.language = params.language;

      await chrome.storage.local.set(updates);
    }

    const settings = await chrome.storage.local.get({
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma4',
      language: 'en',
      analysisMode: 'deep',
      rulePackId: 'nielsen-10',
      providerId: 'ollama',
      apiKey: '',
      enableVision: true
    });

    const connectionStatus = this.handlers.checkOllamaConnection
      ? await this.handlers.checkOllamaConnection()
      : { connected: false };

    return {
      success: true,
      settings: {
        ...settings,
        apiKey: settings.apiKey ? '***configured***' : ''
      },
      connectionStatus
    };
  }

  async _handleGetReports(params = {}) {
    const action = params.action || 'latest';
    if (action === 'history') {
      const data = await chrome.storage.local.get({ reportHistory: [] });
      return {
        success: true,
        history: (data.reportHistory || []).map(item => ({
          id: item.id,
          url: item.url,
          title: item.title,
          score: item.score,
          mode: item.mode,
          model: item.model,
          timestamp: item.timestamp
        }))
      };
    }

    if (action === 'by_id' && params.id) {
      const data = await chrome.storage.local.get({ reportHistory: [] });
      const entry = (data.reportHistory || []).find(r => r.id === params.id);
      if (!entry?.report) return { error: `Report ${params.id} not found.` };
      return {
        success: true,
        report: params.format === 'markdown' ? entry.report.markdown : entry.report
      };
    }

    const data = await chrome.storage.local.get('lastReport');
    if (!data.lastReport) {
      return { error: 'No report available yet.' };
    }
    return {
      success: true,
      report: params.format === 'markdown' ? data.lastReport.markdown : data.lastReport
    };
  }
}
