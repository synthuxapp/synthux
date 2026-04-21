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

import { OllamaClient } from '../core/ai-client.js';
import { Analyzer } from '../core/analyzer.js';
import { captureScreenshot } from '../core/screenshot.js';

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
let ollamaStatus = { connected: false, models: [] };

// ─── Ollama Connection Monitor ───────────────────────────────────────────────

async function checkOllamaConnection() {
  try {
    const settings = await chrome.storage.local.get({
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'gemma4:31b'
    });

    const client = new OllamaClient(settings.ollamaEndpoint);
    const isConnected = await client.ping();

    if (isConnected) {
      const models = await client.listModels();
      ollamaStatus = { connected: true, models };
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
        analysisMode: 'deep'
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
      analysisMode: 'deep'
    });

    const mode = options?.mode || settings.analysisMode;
    const profiles = options?.profiles || ['first-time', 'power-user', 'accessibility'];

    // Create analyzer
    const analyzer = new Analyzer({
      endpoint: settings.ollamaEndpoint,
      model: settings.ollamaModel,
      mode,
      profiles,
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

    // Step 2: Capture screenshot
    broadcastToSidePanel({
      type: 'ANALYSIS_PROGRESS',
      payload: { phase: 'scanning', percent: 15, message: 'Capturing screenshot...' }
    });

    const screenshot = await captureScreenshot(tab.id);

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

    // Step 4: Store report and add to history
    await chrome.storage.local.set({
      lastReport: report,
      lastReportTimestamp: Date.now()
    });

    // Save to history (max 20 reports)
    await addToHistory(report);

    currentAnalysis = null;

    broadcastToSidePanel({
      type: 'ANALYSIS_COMPLETE',
      payload: report
    });

    return { success: true, report };
  } catch (err) {
    console.error('[synthux] Analysis failed:', err);
    currentAnalysis = null;

    broadcastToSidePanel({
      type: 'ANALYSIS_ERROR',
      payload: { error: err.message }
    });

    return { error: err.message };
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
