/**
 * synthux — Background Service Worker
 * 
 * Responsibilities:
 * - Opens Side Panel on extension icon click
 * - Routes messages between Content Script ↔ Side Panel
 * - Captures page screenshots via chrome.tabs API
 * - Coordinates the scan → analyze → report workflow
 * - Monitors Ollama connection status
 */

import { AIClient } from '../core/ai-client.js';
import { Analyzer } from '../core/analyzer.js';
import { captureScreenshot } from '../core/screenshot.js';
import { FlowManager } from '../core/flow-manager.js';

// ─── Side Panel Management ───────────────────────────────────────────────────

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (err) {
    console.error('[synthux] Failed to open side panel:', err);
  }
});

// Enable side panel on all tabs
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error('[synthux] Failed to set panel behavior:', err));

// ─── State ───────────────────────────────────────────────────────────────────

let currentAnalysis = null;
let currentFlowManager = null;
let currentFlowSessionId = null;
let ollamaStatus = { connected: false, models: [] };
let sidePanelPort = null;
let lastActiveTab = null;

// Track last active website tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      lastActiveTab = { id: tab.id, url: tab.url, title: tab.title };
    }
  } catch {}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    lastActiveTab = { id: tab.id, url: tab.url, title: tab.title };
  }
});

// ─── Side Panel Disconnect → Clean Overlays ──────────────────────────────────

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    sidePanelPort = port;
    port.onDisconnect.addListener(async () => {
      sidePanelPort = null;
      // Clean up any overlays left on the page
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_OVERLAYS' }).catch(() => {});
        }
      } catch { /* tab may not exist */ }
    });
  }
});

// ─── Ollama Connection Monitor ───────────────────────────────────────────────

async function checkOllamaConnection() {
  try {
    const settings = await chrome.storage.local.get({
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma4:31b',
      providerId: 'ollama',
      apiKey: ''
    });

    const client = new AIClient(settings.ollamaEndpoint, {
      provider: settings.providerId,
      apiKey: settings.apiKey
    });
    const pingResult = await client.ping();

    // Cloud providers still return boolean from ping()
    const isConnected = typeof pingResult === 'object'
      ? pingResult.status === 'connected'
      : !!pingResult;
    const isCorsBlocked = typeof pingResult === 'object' && pingResult.status === 'cors-blocked';

    if (isConnected) {
      const models = await client.listModels();
      ollamaStatus = { connected: true, models, provider: settings.providerId };

      // Track Ollama version changes (Ollama provider only)
      if (settings.providerId === 'ollama' && pingResult.version) {
        const stored = await chrome.storage.local.get('ollamaVersion');
        if (stored.ollamaVersion && stored.ollamaVersion !== pingResult.version) {
          console.info(`[synthux] Ollama updated: ${stored.ollamaVersion} → ${pingResult.version}`);
          ollamaStatus.versionChanged = true;
          ollamaStatus.oldVersion = stored.ollamaVersion;
          ollamaStatus.newVersion = pingResult.version;
        }
        ollamaStatus.version = pingResult.version;
        await chrome.storage.local.set({ ollamaVersion: pingResult.version });
      }

      // Auto-fix: if saved model isn't available, switch to first available model
      const savedModel = settings.ollamaModel;
      const modelExists = models.some(m => (m.id || m.name) === savedModel);
      if (!modelExists && models.length > 0) {
        const newModel = models[0].id || models[0].name;
        console.info(`[synthux] Saved model "${savedModel}" not found for ${settings.providerId}. Using "${newModel}".`);
        await chrome.storage.local.set({ ollamaModel: newModel });
      }
    } else if (isCorsBlocked) {
      console.warn('[synthux] Ollama is running but CORS is blocking requests. Set OLLAMA_ORIGINS="*" and restart.');
      ollamaStatus = { connected: false, corsBlocked: true, models: [] };
    } else {
      ollamaStatus = { connected: false, models: [] };
    }
  } catch (err) {
    ollamaStatus = { connected: false, models: [] };
  }

  return ollamaStatus;
}

// Check connection on startup
checkOllamaConnection();

// Periodic connection check (every 30 seconds)
setInterval(checkOllamaConnection, 30000);

// ─── Message Handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'GET_OLLAMA_STATUS':
      checkOllamaConnection().then(status => sendResponse(status));
      return true; // async response

    case 'CHECK_CONNECTION':
      checkOllamaConnection().then(status => sendResponse(status));
      return true;

    case 'START_ANALYSIS':
      handleStartAnalysis(payload).then(sendResponse);
      return true;

    case 'CANCEL_ANALYSIS':
      handleCancelAnalysis();
      sendResponse({ success: true });
      break;

    case 'GET_ANALYSIS_STATUS':
      sendResponse({
        isRunning: currentAnalysis !== null,
        progress: currentAnalysis?.progress || null
      });
      break;

    case 'CAPTURE_SCREENSHOT':
      handleCaptureScreenshot(sender.tab?.id || payload?.tabId)
        .then(sendResponse);
      return true;

    case 'SCAN_PAGE':
      handleScanPage(payload?.tabId).then(sendResponse);
      return true;

    case 'GET_SETTINGS':
      chrome.storage.local.get({
        ollamaEndpoint: 'http://localhost:11434',
        ollamaModel: 'gemma4:31b',
        language: 'en',
        analysisMode: 'deep',
        providerId: 'ollama',
        apiKey: ''
      }).then(sendResponse);
      return true;

    case 'SAVE_SETTINGS':
      chrome.storage.local.set(payload).then(() => {
        checkOllamaConnection();
        sendResponse({ success: true });
      });
      return true;

    case 'GET_REPORT_HISTORY':
      chrome.storage.local.get({ reportHistory: [] }).then(data => {
        sendResponse(data.reportHistory || []);
      });
      return true;

    case 'LOAD_REPORT':
      chrome.storage.local.get({ reportHistory: [] }).then(data => {
        const entry = (data.reportHistory || []).find(r => r.id === payload?.id);
        if (entry?.report) {
          sendResponse({ success: true, report: entry.report });
        } else {
          sendResponse({ error: 'Report not found' });
        }
      });
      return true;

    case 'DELETE_REPORT':
      chrome.storage.local.get({ reportHistory: [] }).then(async (data) => {
        const history = (data.reportHistory || []).filter(r => r.id !== payload?.id);
        await chrome.storage.local.set({ reportHistory: history });
        sendResponse({ success: true, history });
      });
      return true;

    // ─── Overlay Relay (Side Panel → Content Script) ─────────────
    case 'INJECT_OVERLAY':
      injectOverlayManager(payload?.tabId).then(sendResponse);
      return true;

    case 'HIGHLIGHT_ELEMENT':
    case 'CLEAR_HIGHLIGHT':
    case 'SHOW_HEATMAP':
    case 'CLEAR_HEATMAP':
    case 'CLEAR_OVERLAYS':
      relayOverlayMessage(type, payload).then(sendResponse);
      return true;

    // ─── Flow Analysis ──────────────────────────────────────────────
    case 'START_FLOW_ANALYSIS':
      handleFlowAnalysis(payload, sender).then(sendResponse);
      return true;

    case 'CANCEL_FLOW_ANALYSIS':
      if (currentFlowManager) {
        currentFlowManager.cancel();
        currentFlowManager = null;
      }
      sendResponse({ success: true });
      break;

    case 'GET_ACTIVE_TABS':
      chrome.tabs.query({}, tabs => {
        sendResponse({
          tabs: tabs.filter(t => !t.url?.startsWith('chrome-extension://')),
          lastActiveTab: lastActiveTab
        });
      });
      return true;

    case 'SAVE_FLOW':
      chrome.storage.local.set({ synthux_flow: payload }).then(() => {
        sendResponse({ success: true });
      });
      return true;

    case 'LOAD_FLOW':
      chrome.storage.local.get('synthux_flow').then(data => {
        sendResponse(data.synthux_flow || null);
      });
      return true;

    default:
      console.warn('[synthux] Unknown message type:', type);
  }
});

// ─── Analysis Workflow ───────────────────────────────────────────────────────

async function handleStartAnalysis(options) {
  if (currentAnalysis) {
    return { error: 'Analysis already in progress' };
  }

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      return { error: 'No active tab found' };
    }

    // Get settings
    const settings = await chrome.storage.local.get({
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma4:31b',
      analysisMode: 'deep',
      providerId: 'ollama',
      apiKey: '',
      enableVision: true
    });

    const mode = options?.mode || settings.analysisMode;
    const profiles = options?.profiles || ['first-time', 'power-user', 'accessibility'];
    const customHeuristics = options?.heuristics || null;

    // Create analyzer
    const analyzer = new Analyzer({
      endpoint: settings.ollamaEndpoint,
      model: settings.ollamaModel,
      mode,
      profiles,
      heuristics: customHeuristics,
      provider: settings.providerId,
      apiKey: settings.apiKey,
      onProgress: (progress) => {
        currentAnalysis.progress = progress;
        // Broadcast progress to side panel
        broadcastToSidePanel({
          type: 'ANALYSIS_PROGRESS',
          payload: progress
        });
      }
    });

    currentAnalysis = {
      analyzer,
      tabId: tab.id,
      url: tab.url,
      title: tab.title,
      startTime: Date.now(),
      progress: { phase: 'scanning', percent: 0, message: 'Starting scan...' }
    };

    // Step 1: Scan page (inject content script and extract DOM)
    broadcastToSidePanel({
      type: 'ANALYSIS_PROGRESS',
      payload: { phase: 'scanning', percent: 5, message: 'Scanning page...' }
    });

    const pageData = await scanPage(tab.id);

    // Step 2: Capture screenshot (if vision enabled)
    let screenshot = null;
    if (settings.enableVision !== false) {
      broadcastToSidePanel({
        type: 'ANALYSIS_PROGRESS',
        payload: { phase: 'scanning', percent: 15, message: 'Capturing full-page screenshot...' }
      });
      screenshot = await captureScreenshot(tab.id);
    }

    // Step 2b: Run axe-core WCAG audit (non-blocking)
    let axeResults = null;
    try {
      broadcastToSidePanel({
        type: 'ANALYSIS_PROGRESS',
        payload: { phase: 'scanning', percent: 18, message: 'Running WCAG audit (axe-core)...' }
      });
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
      console.info(`[synthux] axe-core: ${axeResults?.violations?.length || 0} violations, ${axeResults?.passes || 0} passes`);
    } catch (axeErr) {
      console.warn('[synthux] axe-core audit skipped:', axeErr.message);
    }

    // Attach axe results to pageData for the analyzer
    if (axeResults) {
      pageData.axeResults = axeResults;
    }

    // Step 3: Run AI analysis
    broadcastToSidePanel({
      type: 'ANALYSIS_PROGRESS',
      payload: { phase: 'analyzing', percent: 20, message: 'Starting AI analysis...' }
    });

    const report = await analyzer.analyze({
      url: tab.url,
      title: tab.title,
      pageData,
      screenshot,
      timestamp: new Date().toISOString()
    });

    // Step 4: Store report and add to history (strip screenshot to save storage)
    const reportForStorage = { ...report };
    delete reportForStorage.screenshot; // base64 images are too large for chrome.storage
    await chrome.storage.local.set({
      lastReport: reportForStorage,
      lastReportTimestamp: Date.now()
    });

    // Save to history (max 20 reports) — without screenshot
    await addToHistory(reportForStorage);

    currentAnalysis = null;

    broadcastToSidePanel({
      type: 'ANALYSIS_COMPLETE',
      payload: report
    });

    return { success: true, report };
  } catch (err) {
    currentAnalysis = null;

    if (err.message === 'Analysis cancelled') {
      console.info('[synthux] Analysis cancelled by user');
      broadcastToSidePanel({
        type: 'ANALYSIS_CANCELLED',
        payload: {}
      });
      return { cancelled: true };
    }

    console.error('[synthux] Analysis failed:', err);

    // Friendly messages for known errors
    let errorMsg = err.message;
    if (err.message?.includes('cannot be scripted') || err.message?.includes('Cannot access')) {
      errorMsg = 'This page cannot be analyzed (restricted by Chrome). Navigate to a regular website.';
    }

    broadcastToSidePanel({
      type: 'ANALYSIS_ERROR',
      payload: {
        error: errorMsg,
        ...(err.type === 'cors' ? { errorType: 'cors' } : {})
      }
    });

    return { error: errorMsg, ...(err.type === 'cors' ? { errorType: 'cors' } : {}) };
  }
}

function handleCancelAnalysis() {
  if (currentAnalysis?.analyzer) {
    currentAnalysis.analyzer.cancel();
  }
  currentAnalysis = null;

  broadcastToSidePanel({
    type: 'ANALYSIS_CANCELLED',
    payload: {}
  });
}

// ─── Page Scanning ───────────────────────────────────────────────────────────

async function scanPage(tabId) {
  // Inject content script
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['content/content-script.js']
  });

  // Request DOM data from content script
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_DOM' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response?.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
}

async function handleScanPage(tabId) {
  try {
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab?.id;
    }
    if (!tabId) return { error: 'No active tab' };

    const data = await scanPage(tabId);
    return { success: true, data };
  } catch (err) {
    return { error: err.message };
  }
}

async function handleCaptureScreenshot(tabId) {
  try {
    const dataUrl = await captureScreenshot(tabId);
    return { success: true, screenshot: dataUrl };
  } catch (err) {
    return { error: err.message };
  }
}

// ─── Report History ──────────────────────────────────────────────────────────

const MAX_HISTORY = 20;

async function addToHistory(report) {
  try {
    const data = await chrome.storage.local.get({ reportHistory: [] });
    const history = data.reportHistory || [];

    // Create a history entry with summary + full report
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: report.url || '',
      title: report.title || '',
      score: report.overallScore || 0,
      mode: report.mode || 'deep',
      model: report.model || '',
      timestamp: report.timestamp || new Date().toISOString(),
      report // store full report for loading later
    };

    // Add to beginning and trim to max
    history.unshift(entry);
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    await chrome.storage.local.set({ reportHistory: history });
  } catch (err) {
    console.error('[synthux] Failed to save to history:', err);
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function broadcastToSidePanel(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // Side panel might not be open — ignore
  });
}

// ─── Overlay Management ──────────────────────────────────────────────────────

/**
 * Inject the overlay manager into the active tab.
 * Safe to call multiple times — the script guards against re-injection.
 */
async function injectOverlayManager(tabId) {
  try {
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab?.id;
    }
    if (!tabId) return { error: 'No active tab' };

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/overlay-manager.js']
    });

    return { success: true };
  } catch (err) {
    console.error('[synthux] Failed to inject overlay manager:', err);
    return { error: err.message };
  }
}

/**
 * Relay an overlay message from the side panel to the active tab's content script.
 * Automatically injects the overlay manager if needed.
 */
async function relayOverlayMessage(type, payload) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { error: 'No active tab' };

    // Ensure overlay manager is injected
    await injectOverlayManager(tab.id);

    // Forward message to content script
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { type, ...payload }, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ error: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: true });
        }
      });
    });
  } catch (err) {
    return { error: err.message };
  }
}

// ─── Flow Analysis Workflow ──────────────────────────────────────────────────

async function handleFlowAnalysis(payload, sender) {
  // Cancel any previous in-progress analysis instead of blocking
  if (currentFlowManager) {
    console.warn('[synthux] Cancelling previous flow analysis to start a new one.');
    currentFlowManager.cancel();
    currentFlowManager = null;
    currentFlowSessionId = null;
  }

  // Generate unique session ID so UI can ignore stale messages
  const sessionId = `flow_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  currentFlowSessionId = sessionId;

  const settings = await chrome.storage.local.get({
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: 'gemma4:31b',
    providerId: 'ollama',
    apiKey: '',
    synthux_selected_profiles: ['first-time', 'power-user', 'accessibility'],
    synthux_selected_mode: 'deep'
  });

  const flowManager = new FlowManager({
    onProgress: (progress) => {
      // Only broadcast if this session is still the active one
      if (currentFlowSessionId !== sessionId) return;
      chrome.runtime.sendMessage({
        type: 'FLOW_PAGE_PROGRESS',
        payload: { ...progress, sessionId }
      }).catch(() => {});
    },
    onPageComplete: (result) => {
      if (currentFlowSessionId !== sessionId) return;
      chrome.runtime.sendMessage({
        type: 'FLOW_PAGE_COMPLETE',
        payload: { ...result, sessionId }
      }).catch(() => {});
    }
  });

  currentFlowManager = flowManager;

  // Fire-and-forget — run analysis in background, broadcast results
  flowManager.analyzeFlow({
    pages: payload.pages || [],
    connectors: payload.connectors || [],
    notes: payload.notes || [],
    settings,
    profiles: settings.synthux_selected_profiles,
    mode: settings.synthux_selected_mode,
    sourceTabId: sender.tab?.id || null
  }).then(result => {
    // Only broadcast if this session is still active
    if (currentFlowSessionId !== sessionId) return;
    currentFlowManager = null;
    currentFlowSessionId = null;
    if (result.error) {
      chrome.runtime.sendMessage({
        type: 'FLOW_ERROR',
        payload: { error: result.error, sessionId }
      }).catch(() => {});
    } else {
      chrome.runtime.sendMessage({
        type: 'FLOW_COMPLETE',
        payload: { flowReport: result, sessionId }
      }).catch(() => {});
    }
  }).catch(err => {
    if (currentFlowSessionId !== sessionId) return;
    currentFlowManager = null;
    currentFlowSessionId = null;
    console.error('[synthux] Flow analysis error:', err);
    chrome.runtime.sendMessage({
      type: 'FLOW_ERROR',
      payload: { error: err.message, sessionId }
    }).catch(() => {});
  });

  // Return immediately — UI will listen for broadcast messages
  return { success: true, started: true, sessionId };
}
