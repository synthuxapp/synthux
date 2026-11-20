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
import {
  BUILT_IN_DEPARTMENTS,
  getBusinessContextState,
  saveBusinessContextState,
  getAllDepartments,
  getActiveBusinessContext,
  upsertBusinessContextProfile,
  deleteBusinessContextProfile,
  upsertCustomDepartment,
  deleteCustomDepartment,
  buildBusinessAlignmentPrompt,
  parseBusinessAlignmentResponse,
  buildDeterministicBusinessAlignment,
  generateDiscoveryQuestions,
  compareReports,
  generateAiFixPrompt
} from './business-context.js';

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

        case 'MANAGE_BUSINESS_CONTEXT':
          return await this._handleManageBusinessContext(params);

        case 'MANAGE_FLOWS':
          return await this._handleManageFlows(params);

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
    const activeBusinessContext = params.businessContext || await getActiveBusinessContext();
    const allDepartments = await getAllDepartments();
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
          prompt: buildPrompt(heuristic, profile, pageData, !!screenshot, activeBusinessContext)
        });
      }
    }

    const discoveryQuestions = generateDiscoveryQuestions({
      url: tab.url,
      title: tab.title,
      pageData,
      currentContext: activeBusinessContext
    });

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
      businessContext: activeBusinessContext || null,
      businessAlignmentPrompt: activeBusinessContext
        ? buildBusinessAlignmentPrompt(activeBusinessContext, JSON.stringify({ url: tab.url, title: tab.title, ctas: pageData?.content?.ctas || [] }), allDepartments)
        : null,
      discoveryQuestions,
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

    const activeBusinessContext = params.businessContext || await getActiveBusinessContext();
    const allDepartments = await getAllDepartments();
    const businessAlignment = activeBusinessContext
      ? (params.businessAlignment
          ? parseBusinessAlignmentResponse(params.businessAlignment, activeBusinessContext, pageData, allDepartments)
          : buildDeterministicBusinessAlignment(activeBusinessContext, pageData, allDepartments))
      : null;

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
      businessContext: activeBusinessContext || null,
      businessAlignment,
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

  async _handleManageBusinessContext(params = {}) {
    const action = params.action || 'get';
    if (action === 'get' || action === 'list') {
      const state = await getBusinessContextState();
      const departments = await getAllDepartments();
      const activeProfile = await getActiveBusinessContext();
      return {
        success: true,
        state,
        activeProfile,
        departments,
        builtInDepartments: BUILT_IN_DEPARTMENTS
      };
    }

    if (action === 'discover_questions') {
      const tab = await this._resolveTargetTab(params);
      let pageData = null;
      if (tab?.id) {
        try {
          pageData = await this.handlers.scanPage(tab.id);
        } catch {}
      }
      const activeProfile = await getActiveBusinessContext();
      return {
        success: true,
        discovery: generateDiscoveryQuestions({
          url: tab?.url || params.url || '',
          title: tab?.title || '',
          pageData,
          flowPages: params.flowPages || null,
          currentContext: activeProfile
        })
      };
    }

    if (action === 'save' || action === 'update') {
      const payload = params.context || params;
      const { state, profile } = await upsertBusinessContextProfile(payload, {
        setActive: params.setActive !== false,
        enabled: typeof params.enabled === 'boolean' ? params.enabled : true
      });
      return { success: true, state, profile };
    }

    if (action === 'toggle' || action === 'select') {
      const current = await getBusinessContextState();
      const next = await saveBusinessContextState({
        ...current,
        enabled: typeof params.enabled === 'boolean' ? params.enabled : !current.enabled,
        activeContextId: params.contextId || params.activeContextId || current.activeContextId
      });
      return { success: true, state: next };
    }

    if (action === 'delete') {
      const next = await deleteBusinessContextProfile(params.contextId || params.id);
      return { success: true, state: next };
    }

    if (action === 'add_department') {
      const deptInput = params.department || {
        id: params.departmentId || params.id,
        name: params.name,
        icon: params.icon,
        focus: params.focus || params.criteria,
        defaultCriteria: params.defaultCriteria || params.criteria || params.focus
      };
      const { state, department } = await upsertCustomDepartment(deptInput);
      return { success: true, department, state };
    }

    if (action === 'delete_department') {
      const next = await deleteCustomDepartment(params.departmentId || params.id);
      return { success: true, state: next };
    }

    return { error: `Unknown business context action: ${action}` };
  }

  async _sendToLiveFlowBuilder(action, params = {}) {
    try {
      const flowUrlPrefix = chrome.runtime.getURL('flow/index.html');
      const tabs = await chrome.tabs.query({});
      const flowTab = tabs.find(t => t.url && t.url.startsWith(flowUrlPrefix));
      if (flowTab?.id) {
        return await new Promise((resolve) => {
          chrome.tabs.sendMessage(
            flowTab.id,
            { type: 'MCP_FLOW_CANVAS_ACTION', payload: { action, params } },
            (res) => resolve(res || null)
          );
        });
      }
    } catch {}
    return null;
  }

  async _handleManageFlows(params = {}) {
    const action = params.action || 'get_canvas';

    if (action === 'open_canvas') {
      const flowUrl = chrome.runtime.getURL('flow/index.html');
      const tabs = await chrome.tabs.query({});
      const existing = tabs.find(t => t.url && t.url.startsWith(flowUrl));
      if (existing) {
        await chrome.tabs.update(existing.id, { active: true });
        return { success: true, tabId: existing.id, opened: 'focused_existing' };
      }
      const created = await chrome.tabs.create({ url: flowUrl, active: true });
      return { success: true, tabId: created.id, opened: 'created_new' };
    }

    if (action === 'list_saved') {
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      return {
        success: true,
        savedFlows: (data.synthux_flows || []).map(f => ({
          id: f.id,
          name: f.name,
          timestamp: f.timestamp,
          pageCount: f.pageCount || f.state?.nodes?.length || 0,
          flowScore: f.flowScore ?? f.state?.flowReport?.flowScore ?? null,
          goalScore: f.goalScore ?? f.state?.flowReport?.businessAlignment?.goalAlignmentScore ?? null
        }))
      };
    }

    if (action === 'get_saved') {
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      const flow = (data.synthux_flows || []).find(f => f.id === params.flowId || f.name === params.name);
      if (!flow) return { error: `Saved flow "${params.flowId || params.name}" not found.` };
      return { success: true, flow };
    }

    if (action === 'delete_flow') {
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      const remaining = (data.synthux_flows || []).filter(f => f.id !== params.flowId && f.name !== params.name);
      await chrome.storage.local.set({ synthux_flows: remaining });
      return { success: true, savedFlowsCount: remaining.length };
    }

    // Try live Flow Builder tab first; fallback to storage state manipulation
    const liveRes = await this._sendToLiveFlowBuilder(action, params);
    const storedData = await chrome.storage.local.get({
      synthux_live_flow_canvas: { nodes: [], notes: [], connectors: [], flowReport: null, viewport: { x: 0, y: 0, zoom: 1 } }
    });
    let canvasState = liveRes?.canvas || storedData.synthux_live_flow_canvas;

    if (!liveRes) {
      // Mutate storage state directly so when Flow Builder opens, it reflects all MCP edits
      const nodes = Array.isArray(canvasState.nodes) ? [...canvasState.nodes] : [];
      const notes = Array.isArray(canvasState.notes) ? [...canvasState.notes] : [];
      const connectors = Array.isArray(canvasState.connectors) ? [...canvasState.connectors] : [];

      if (action === 'add_node') {
        const id = params.id || `n${Date.now().toString(36).slice(-4)}`;
        const last = nodes[nodes.length - 1];
        const newNode = {
          id,
          url: params.url || 'https://example.com',
          label: params.label || params.url || `Step ${nodes.length + 1}`,
          stepGoal: params.stepGoal || '',
          dropOffMetric: params.dropOffMetric || '',
          x: params.x ?? (last ? last.x + 270 : 80),
          y: params.y ?? (last ? last.y : 120),
          score: null,
          report: null,
          thumbnail: null
        };
        nodes.push(newNode);
        if (last && params.autoConnect !== false) {
          connectors.push({ fromId: last.id, toId: id, label: params.connectorLabel || '' });
        }
      } else if (action === 'update_node') {
        const targetId = params.nodeId || params.id;
        const idx = nodes.findIndex(n => n.id === targetId);
        if (idx >= 0) {
          nodes[idx] = { ...nodes[idx], ...params, id: targetId };
        }
      } else if (action === 'remove_node') {
        const targetId = params.nodeId || params.id;
        const filteredNodes = nodes.filter(n => n.id !== targetId);
        const filteredConns = connectors.filter(c => c.fromId !== targetId && c.toId !== targetId);
        nodes.length = 0; nodes.push(...filteredNodes);
        connectors.length = 0; connectors.push(...filteredConns);
      } else if (action === 'add_connector') {
        if (params.fromId && params.toId && !connectors.some(c => c.fromId === params.fromId && c.toId === params.toId)) {
          connectors.push({ fromId: params.fromId, toId: params.toId, label: params.label || '' });
        }
      } else if (action === 'update_connector') {
        const idx = connectors.findIndex(c => c.fromId === params.fromId && c.toId === params.toId);
        if (idx >= 0) connectors[idx] = { ...connectors[idx], ...params };
      } else if (action === 'remove_connector') {
        const filtered = connectors.filter(c => !(c.fromId === params.fromId && c.toId === params.toId));
        connectors.length = 0; connectors.push(...filtered);
      } else if (action === 'add_note') {
        notes.push({
          id: `s${Date.now().toString(36).slice(-4)}`,
          x: params.x ?? 120,
          y: params.y ?? 320,
          text: params.text || '',
          attachedTo: params.attachedTo || null
        });
      } else if (action === 'remove_note') {
        const targetId = params.noteId || params.id;
        const filtered = notes.filter(n => n.id !== targetId);
        notes.length = 0; notes.push(...filtered);
      } else if (action === 'auto_layout') {
        nodes.forEach((n, idx) => { n.x = 80 + idx * 270; n.y = 120; });
      } else if (action === 'clear_canvas') {
        nodes.length = 0; notes.length = 0; connectors.length = 0;
        canvasState.flowReport = null;
      }

      canvasState = { ...canvasState, nodes, notes, connectors, updatedAt: new Date().toISOString() };
      await chrome.storage.local.set({ synthux_live_flow_canvas: canvasState });
    }

    if (action === 'save_flow') {
      const name = params.name || `Flow ${new Date().toLocaleDateString()}`;
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      const flows = data.synthux_flows || [];
      const existingIdx = flows.findIndex(f => f.name === name || (params.flowId && f.id === params.flowId));
      const entry = {
        id: existingIdx >= 0 ? flows[existingIdx].id : `flow_${Date.now()}`,
        name,
        timestamp: new Date().toISOString(),
        pageCount: canvasState.nodes?.length || 0,
        flowScore: canvasState.flowReport?.flowScore ?? null,
        goalScore: canvasState.flowReport?.businessAlignment?.goalAlignmentScore ?? null,
        state: canvasState
      };
      if (existingIdx >= 0) flows[existingIdx] = entry;
      else flows.unshift(entry);
      await chrome.storage.local.set({ synthux_flows: flows });
      return { success: true, savedFlow: entry };
    }

    if (action === 'load_flow') {
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      const flow = (data.synthux_flows || []).find(f => f.id === params.flowId || f.name === params.name);
      if (!flow) return { error: `Saved flow "${params.flowId || params.name}" not found.` };
      await chrome.storage.local.set({ synthux_live_flow_canvas: flow.state });
      await this._sendToLiveFlowBuilder('import_state', { state: flow.state });
      return { success: true, loadedFlow: flow.name, canvas: flow.state };
    }

    if (action === 'submit_external_flow' && params.flowReport) {
      const activeBiz = params.businessContext || await getActiveBusinessContext();
      const allDepts = await getAllDepartments();
      const flowReport = {
        type: 'flow',
        version: '2.2.0',
        ...params.flowReport,
        businessContext: activeBiz || null,
        businessAlignment: activeBiz
          ? (params.flowReport.businessAlignment
              ? parseBusinessAlignmentResponse(params.flowReport.businessAlignment, activeBiz, {}, allDepts)
              : buildDeterministicBusinessAlignment(activeBiz, {}, allDepts))
          : null,
        timestamp: new Date().toISOString()
      };
      canvasState.flowReport = flowReport;
      await chrome.storage.local.set({ synthux_live_flow_canvas: canvasState, lastFlowReport: flowReport });
      await this._sendToLiveFlowBuilder('apply_flow_report', { flowReport });
      return { success: true, flowReport };
    }

    return {
      success: true,
      action,
      liveWindowConnected: Boolean(liveRes),
      canvas: canvasState
    };
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
          wcagScore: item.wcagScore ?? item.report?.accessibilityResults?.score ?? null,
          goalScore: item.goalScore ?? item.report?.businessAlignment?.goalAlignmentScore ?? null,
          contextName: item.contextName ?? item.report?.businessAlignment?.contextName ?? null,
          mode: item.mode,
          model: item.model,
          timestamp: item.timestamp
        }))
      };
    }

    if (action === 'flows') {
      const data = await chrome.storage.local.get({ synthux_flows: [], lastFlowReport: null });
      return {
        success: true,
        lastFlowReport: data.lastFlowReport || null,
        savedFlows: (data.synthux_flows || []).map(f => ({
          id: f.id,
          name: f.name,
          timestamp: f.timestamp,
          pageCount: f.pageCount || f.state?.nodes?.length || 0,
          flowScore: f.flowScore ?? f.state?.flowReport?.flowScore ?? null,
          goalScore: f.goalScore ?? f.state?.flowReport?.businessAlignment?.goalAlignmentScore ?? null,
          hasReport: Boolean(f.state?.flowReport)
        }))
      };
    }

    if (action === 'flow_by_id' && (params.flowId || params.id)) {
      const data = await chrome.storage.local.get({ synthux_flows: [] });
      const targetId = params.flowId || params.id;
      const flow = (data.synthux_flows || []).find(f => f.id === targetId || f.name === targetId);
      if (!flow) return { error: `Saved flow "${targetId}" not found.` };
      return {
        success: true,
        flow,
        flowReport: flow.state?.flowReport || null
      };
    }

    if (action === 'compare') {
      const data = await chrome.storage.local.get({ reportHistory: [] });
      const hist = data.reportHistory || [];
      if (hist.length < 2) {
        return { error: 'At least 2 reports in history are required for comparison.' };
      }
      let baseEntry = params.baseId ? hist.find(r => r.id === params.baseId) : null;
      let targetEntry = params.targetId ? hist.find(r => r.id === params.targetId) : null;

      if (!targetEntry) targetEntry = hist[0];
      if (!baseEntry) {
        baseEntry = hist.find(r => r.id !== targetEntry.id && r.url === targetEntry.url) || hist.find(r => r.id !== targetEntry.id);
      }

      if (!baseEntry?.report || !targetEntry?.report) {
        return { error: 'Could not resolve base and target reports for comparison.' };
      }

      const comparison = compareReports(
        { ...baseEntry.report, id: baseEntry.id },
        { ...targetEntry.report, id: targetEntry.id }
      );
      return {
        success: true,
        comparison: params.format === 'markdown' ? comparison.markdown : comparison
      };
    }

    if (action === 'fix_prompt') {
      const data = await chrome.storage.local.get({ lastReport: null, reportHistory: [] });
      let targetReport = data.lastReport;
      if (params.id) {
        const entry = (data.reportHistory || []).find(r => r.id === params.id);
        if (entry?.report) targetReport = entry.report;
      }
      if (!targetReport) return { error: 'No report found to generate AI fix prompt.' };
      const fixPrompt = targetReport.aiFixPrompt || generateAiFixPrompt(targetReport);
      return {
        success: true,
        url: targetReport.url,
        overallScore: targetReport.overallScore,
        fixPrompt
      };
    }

    if (action === 'delete_report' && params.id) {
      const data = await chrome.storage.local.get({ reportHistory: [] });
      const filtered = (data.reportHistory || []).filter(r => r.id !== params.id);
      await chrome.storage.local.set({ reportHistory: filtered });
      return { success: true, remainingCount: filtered.length };
    }

    if (action === 'clear_history') {
      await chrome.storage.local.set({ reportHistory: [] });
      return { success: true, remainingCount: 0 };
    }

    if (action === 'export_workspace') {
      const data = await chrome.storage.local.get([
        'customProfiles',
        'customRulePacks',
        'synthux_business_context_state',
        'synthux_flows',
        'reportHistory'
      ]);
      return {
        success: true,
        workspace: {
          synthuxBackupVersion: '2.2.0',
          exportedAt: new Date().toISOString(),
          customProfiles: data.customProfiles || [],
          customRulePacks: data.customRulePacks || [],
          businessContextState: data.synthux_business_context_state || null,
          savedFlows: data.synthux_flows || [],
          reportHistory: data.reportHistory || []
        }
      };
    }

    if (action === 'import_workspace' && params.workspace) {
      const parsed = params.workspace;
      const updates = {};
      if (Array.isArray(parsed.customProfiles)) updates.customProfiles = parsed.customProfiles;
      if (Array.isArray(parsed.customRulePacks)) updates.customRulePacks = parsed.customRulePacks;
      if (parsed.businessContextState && typeof parsed.businessContextState === 'object') {
        updates.synthux_business_context_state = parsed.businessContextState;
      }
      if (Array.isArray(parsed.savedFlows)) updates.synthux_flows = parsed.savedFlows;
      if (Array.isArray(parsed.reportHistory)) updates.reportHistory = parsed.reportHistory;
      await chrome.storage.local.set(updates);
      return { success: true, importedKeys: Object.keys(updates) };
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
    const rep = { ...data.lastReport };
    if (!params.includeAnnotatedScreenshot) {
      delete rep.annotatedScreenshot;
    }
    return {
      success: true,
      report: params.format === 'markdown' ? rep.markdown : rep
    };
  }
}
