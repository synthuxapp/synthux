/**
 * synthux — Flow Toolbar
 * 
 * Manages toolbar actions: Add Page, Pin Tab, Add Note, Analyze, Save/Load.
 * Also handles the receipt modal and analysis progress.
 */

import { FlowCanvas } from './flow-canvas.js';

// ─── Init Canvas ────────────────────────────────────────────────────────────
const canvas = new FlowCanvas();
window.__synthux_canvas = canvas; // expose for results panel

// ─── Toolbar Buttons ────────────────────────────────────────────────────────

// Add Page
const addPageBtn = document.getElementById('btn-add-page');
const popover = document.getElementById('add-page-popover');
const urlInput = document.getElementById('add-page-url');
const labelInput = document.getElementById('add-page-label');

addPageBtn.addEventListener('click', () => {
  popover.hidden = !popover.hidden;
  if (!popover.hidden) {
    urlInput.value = '';
    labelInput.value = '';
    setTimeout(() => urlInput.focus(), 50);
  }
});

document.getElementById('add-page-confirm').addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!url) { urlInput.focus(); return; }
  const fullUrl = url.startsWith('http') ? url : 'https://' + url;
  let x = null;
  let y = null;
  if (canvas._pendingNodePos) {
    x = canvas._pendingNodePos.x;
    y = canvas._pendingNodePos.y;
    canvas._pendingNodePos = null;
  }
  canvas.addNode(fullUrl, labelInput.value.trim() || null, x, y);
  popover.hidden = true;
});

document.getElementById('add-page-cancel').addEventListener('click', () => {
  popover.hidden = true;
  canvas._pendingNodePos = null;
});

// Enter to submit
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-page-confirm').click();
  if (e.key === 'Escape') {
    popover.hidden = true;
    canvas._pendingNodePos = null;
  }
});
labelInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-page-confirm').click();
  if (e.key === 'Escape') {
    popover.hidden = true;
    canvas._pendingNodePos = null;
  }
});

// Close popover on outside click
document.addEventListener('click', e => {
  if (!popover.hidden && !popover.contains(e.target) && e.target !== addPageBtn) {
    popover.hidden = true;
    canvas._pendingNodePos = null;
  }
});

// Pin Current Tab
document.getElementById('btn-pin-tab').addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TABS' });
    if (response) {
      const { tabs, lastActiveTab } = response;
      if (lastActiveTab) {
        canvas.addNode(lastActiveTab.url, lastActiveTab.title || null);
      } else if (tabs && tabs.length > 0) {
        const tab = tabs.find(t => t.active && !t.url.startsWith('chrome'));
        if (tab) {
          canvas.addNode(tab.url, tab.title || null);
        }
      }
    }
  } catch (err) {
    console.warn('[flow] Could not get active tabs:', err);
  }
});

// Add Note
document.getElementById('btn-add-note').addEventListener('click', () => {
  canvas.addNote();
});
// Zoom
document.getElementById('btn-zoom-in').addEventListener('click', () => {
  canvas.setZoom(canvas.viewport.zoom * 1.2);
});
document.getElementById('btn-zoom-out').addEventListener('click', () => {
  canvas.setZoom(canvas.viewport.zoom / 1.2);
});
document.getElementById('btn-fit').addEventListener('click', () => {
  canvas.fitAll();
});

// Clear Canvas
document.getElementById('btn-clear').addEventListener('click', () => {
  if (canvas.nodes.size === 0 && canvas.notes.size === 0) return;
  if (confirm('Clear the entire canvas? This cannot be undone.')) {
    canvas.clearAll();
    updateSaveStatus('Cleared');
  }
});

// ─── Save Flow (Multi-Flow) ─────────────────────────────────────────────────

const savePopover = document.getElementById('save-popover');
const saveNameInput = document.getElementById('save-name-input');

document.getElementById('btn-save').addEventListener('click', () => {
  const pages = canvas.getPages();
  if (pages.length === 0 && canvas.notes.size === 0) return;
  // Default name from first page label or timestamp
  const defaultName = pages.length > 0
    ? pages[0].label
    : `Flow ${new Date().toLocaleDateString()}`;
  saveNameInput.value = defaultName;
  savePopover.hidden = false;
  setTimeout(() => {
    saveNameInput.focus();
    saveNameInput.select();
  }, 50);
});

document.getElementById('save-confirm').addEventListener('click', () => {
  performSave();
});

document.getElementById('save-cancel').addEventListener('click', () => {
  savePopover.hidden = true;
});

saveNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') performSave();
  if (e.key === 'Escape') savePopover.hidden = true;
});

async function performSave() {
  const name = saveNameInput.value.trim() || `Flow ${new Date().toLocaleDateString()}`;
  const state = canvas.exportState();
  savePopover.hidden = true;

  try {
    const data = await chrome.storage.local.get('synthux_flows');
    const flows = data.synthux_flows || [];

    // Check if a flow with the same name already exists
    const existingIdx = flows.findIndex(f => f.name === name);
    const entry = {
      id: existingIdx >= 0 ? flows[existingIdx].id : `flow_${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      pageCount: state.nodes?.length || 0,
      state
    };

    if (existingIdx >= 0) {
      flows[existingIdx] = entry; // Update existing
    } else {
      flows.unshift(entry); // Add to front
    }

    await chrome.storage.local.set({ synthux_flows: flows });
    updateSaveStatus('Saved');
    updateLoadBadge();
  } catch (err) {
    console.error('[flow] Save failed:', err);
  }
}

// ─── Load Flow (Multi-Flow) ─────────────────────────────────────────────────

const loadModal = document.getElementById('load-modal');
const loadModalBody = document.getElementById('load-modal-body');

document.getElementById('btn-load').addEventListener('click', async () => {
  await renderFlowList();
  loadModal.hidden = false;
});

document.getElementById('load-modal-close').addEventListener('click', () => { loadModal.hidden = true; });
document.getElementById('load-modal-cancel').addEventListener('click', () => { loadModal.hidden = true; });

async function renderFlowList() {
  const data = await chrome.storage.local.get('synthux_flows');
  const flows = data.synthux_flows || [];

  if (flows.length === 0) {
    loadModalBody.innerHTML = '<div class="flow-list-empty">No saved flows yet.<br>Use <b>Save</b> to create your first one.</div>';
    return;
  }

  loadModalBody.innerHTML = `<ul class="flow-list">${flows.map((f, idx) => {
    const date = new Date(f.timestamp).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    return `
      <li class="flow-list-item" data-index="${idx}">
        <div class="flow-list-item__info">
          <span class="flow-list-item__name">${escapeHtml(f.name)}</span>
          <span class="flow-list-item__meta">
            <span>${f.pageCount || 0} pages</span>
            <span>${date}</span>
          </span>
        </div>
        <div class="flow-list-item__actions">
          <button class="flow-list-item__delete" data-delete-index="${idx}" title="Delete">×</button>
        </div>
      </li>`;
  }).join('')}</ul>`;

  // Bind click handlers
  loadModalBody.querySelectorAll('.flow-list-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      // Don't load if clicking delete button
      if (e.target.closest('.flow-list-item__delete')) return;
      const idx = parseInt(item.dataset.index, 10);
      const flow = flows[idx];
      if (flow?.state) {
        canvas.importState(flow.state);
        loadModal.hidden = true;
        updateSaveStatus(`Loaded: ${flow.name}`);
      }
    });
  });

  loadModalBody.querySelectorAll('.flow-list-item__delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.deleteIndex, 10);
      const flow = flows[idx];
      if (!confirm(`Delete "${flow.name}"?`)) return;
      flows.splice(idx, 1);
      await chrome.storage.local.set({ synthux_flows: flows });
      updateLoadBadge();
      await renderFlowList(); // Re-render the list
    });
  });
}

function updateSaveStatus(text) {
  const el = document.getElementById('status-progress');
  el.hidden = false;
  el.textContent = text;
  setTimeout(() => { el.hidden = true; }, 2000);
}

// ─── Analyze Flow ───────────────────────────────────────────────────────────

const receiptModal = document.getElementById('receipt-modal');
const receiptBody = document.getElementById('receipt-body');
const analyzeBtn = document.getElementById('btn-analyze');

analyzeBtn.addEventListener('click', () => {
  const pages = canvas.getPages();
  if (pages.length === 0) return;
  showReceipt(pages);
});

function showReceipt(pages) {
  const notes = canvas.getNotes();
  const attachedNotes = notes.filter(n => n.attachedTo);

  receiptBody.innerHTML = `
    <div class="receipt-section">
      <div class="receipt-section__title">Pages</div>
      <div class="receipt-row">
        <span class="receipt-row__label">Total pages</span>
        <span class="receipt-row__value">${pages.length}</span>
      </div>
      <ul class="receipt-page-list">
        ${pages.map(p => `<li>${escapeHtml(p.label)}</li>`).join('')}
      </ul>
      <div class="receipt-row" style="margin-top:8px;">
        <span class="receipt-row__label">Cross-page checks</span>
        <span class="receipt-row__value">4</span>
      </div>
      ${attachedNotes.length > 0 ? `
        <div class="receipt-row">
          <span class="receipt-row__label">User notes attached</span>
          <span class="receipt-row__value">${attachedNotes.length}</span>
        </div>
      ` : ''}
    </div>
    <hr class="receipt-divider">
    <div class="receipt-section">
      <div class="receipt-section__title">Estimate</div>
      <div class="receipt-row">
        <span class="receipt-row__label">Mode</span>
        <span class="receipt-row__value">Quick</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Provider</span>
        <span class="receipt-row__value" id="receipt-provider">Loading...</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Est. time</span>
        <span class="receipt-row__value" id="receipt-time">~${pages.length * 8} min</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Est. cost</span>
        <span class="receipt-row__value" id="receipt-cost">Calculating...</span>
      </div>
    </div>
  `;

  receiptModal.hidden = false;

  // Fetch provider info
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }).then(settings => {
    const providerEl = document.getElementById('receipt-provider');
    const costEl = document.getElementById('receipt-cost');
    const timeEl = document.getElementById('receipt-time');
    if (providerEl) {
      const providerNames = { ollama: 'Ollama (local)', openai: 'OpenAI', gemini: 'Gemini', anthropic: 'Anthropic' };
      providerEl.textContent = `${providerNames[settings.providerId] || settings.providerId} · ${settings.ollamaModel}`;
    }
    if (costEl) {
      costEl.textContent = settings.providerId === 'ollama' ? 'Free (local)' : `~$${(pages.length * 0.03).toFixed(2)}`;
    }
    if (timeEl) {
      const perPage = settings.providerId === 'ollama' ? 8 : 2;
      timeEl.textContent = `~${pages.length * perPage} min`;
    }
  }).catch(() => {});
}

document.getElementById('receipt-close').addEventListener('click', () => { receiptModal.hidden = true; });
document.getElementById('receipt-cancel').addEventListener('click', () => { receiptModal.hidden = true; });

document.getElementById('receipt-start').addEventListener('click', () => {
  receiptModal.hidden = true;
  startFlowAnalysis();
});

// ─── Flow Analysis Execution ────────────────────────────────────────────────

let isAnalyzing = false;
let currentSessionId = null;

async function startFlowAnalysis() {
  if (isAnalyzing) return;
  isAnalyzing = true;
  currentSessionId = null; // Reset until we get a new one from service worker

  const pages = canvas.getPages();
  const connectors = canvas.getConnectors();
  const notes = canvas.getNotes();

  // Clear previous analysis results from canvas
  canvas.clearAllResults();

  // Update UI immediately
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';

  const statusText = document.getElementById('status-text');
  const statusProgress = document.getElementById('status-progress');
  statusText.textContent = `Starting flow analysis...`;
  statusProgress.textContent = 'Preparing...';
  statusProgress.hidden = false;

  // Initialize and clear terminal
  if (flowTerminal) {
    flowTerminal.hidden = false;
    if (flowTerminalClose) flowTerminalClose.hidden = true;
    if (flowTerminalBody) flowTerminalBody.innerHTML = '';
    addTerminalLine(`Starting flow analysis journey...`, 'info');
    addTerminalLine(`Found ${pages.length} page(s) and ${connectors.length} transition(s) to scan.`, 'info');
  }

  try {
    const result = await chrome.runtime.sendMessage({
      type: 'START_FLOW_ANALYSIS',
      payload: { pages, connectors, notes }
    });

    if (result?.error) {
      console.error('[flow] Analysis start error:', result.error);
      statusProgress.textContent = 'Error: ' + result.error;
      addTerminalLine(`Failed to start analysis: ${result.error}`, 'error');
      if (flowTerminalClose) flowTerminalClose.hidden = false;
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Flow';
    } else if (result?.sessionId) {
      // Store the session ID to validate incoming messages
      currentSessionId = result.sessionId;
      addTerminalLine(`Session started: ${result.sessionId}`, 'info');
    }
  } catch (err) {
    console.error('[flow] Analysis failed:', err);
    addTerminalLine(`Analysis failed during execution: ${err.message || err}`, 'error');
    if (flowTerminalClose) flowTerminalClose.hidden = false;
    isAnalyzing = false;
    currentSessionId = null;
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Flow';
  }
}

// Listen for flow analysis progress from service worker
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    // Ignore messages from stale/previous sessions
    const msgSessionId = message.payload?.sessionId;
    if (msgSessionId && currentSessionId && msgSessionId !== currentSessionId) {
      console.warn(`[flow] Ignoring stale message (type=${message.type}, session=${msgSessionId}, current=${currentSessionId})`);
      return;
    }

    if (message.type === 'FLOW_PAGE_PROGRESS') {
      const { pageId, pageIndex, totalPages, phase, message: msg } = message.payload;
      const statusText = document.getElementById('status-text');
      const statusProgress = document.getElementById('status-progress');

      if (phase === 'error') {
        statusText.textContent = `Analysis error`;
        statusProgress.textContent = msg || 'Unknown error';
        statusProgress.hidden = false;
        addTerminalLine(msg || 'Unknown error', 'error');
      } else {
        statusText.textContent = `Analyzing page ${pageIndex + 1} of ${totalPages}`;
        statusProgress.textContent = msg || phase;
        statusProgress.hidden = false;

        // Show analyzing state on node
        if (pageId) canvas.setNodeAnalyzing(pageId, true);

        // Terminal log
        const node = pageId ? canvas.nodes.get(pageId) : null;
        const label = node?.label || pageId || 'journey';
        addTerminalLine(`[Page ${pageIndex + 1}/${totalPages}] ${label} -> Phase: ${phase} ${msg ? `(${msg})` : ''}`, 'info');
      }
    }

    if (message.type === 'FLOW_PAGE_COMPLETE') {
      const { pageId, score, report, thumbnail } = message.payload;
      canvas.updateNodeResult(pageId, { score, report, thumbnail });
      canvas.setNodeAnalyzing(pageId, false);

      // Terminal log
      const node = canvas.nodes.get(pageId);
      const label = node?.label || pageId;
      addTerminalLine(`[Page Complete] ${label} scored ${score || 0}/100`, 'success');
    }

    if (message.type === 'FLOW_COMPLETE') {
      const { flowReport } = message.payload;
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Flow';

      const statusText = document.getElementById('status-text');
      const statusProgress = document.getElementById('status-progress');
      statusText.textContent = `${canvas.nodes.size} pages · Analysis complete`;
      statusProgress.hidden = true;

      // Terminal log
      addTerminalLine(`Flow analysis completed! Overall Flow Score: ${flowReport.flowScore || 0}/100`, 'success');
      if (flowTerminalClose) flowTerminalClose.hidden = false;

      // Update node results (scores + reports)
      if (flowReport.pages) {
        for (const p of flowReport.pages) {
          canvas.updateNodeResult(p.page.id, {
            score: p.score,
            report: p.report
          });
        }
      }

      // Update connector results (transition quality + description)
      if (flowReport.transitions) {
        for (const t of flowReport.transitions) {
          canvas.updateConnectorResult(t.fromId, t.toId, {
            quality: t.quality,
            description: t.description
          });
        }
      }

      // Show results panel
      window.__synthux_showResults?.(flowReport);

      // Auto-save is not performed here — user must explicitly Save to name their flow
    }

    if (message.type === 'FLOW_ERROR') {
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Flow';

      const statusProgress = document.getElementById('status-progress');
      statusProgress.textContent = 'Error: ' + (message.payload?.error || 'Unknown');
      statusProgress.hidden = false;

      // Terminal log
      addTerminalLine(`Flow analysis failed: ${message.payload?.error || 'Unknown'}`, 'error');
      if (flowTerminalClose) flowTerminalClose.hidden = false;
    }
  });
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// Terminal and Load Badge DOM references & helpers
const flowTerminal = document.getElementById('flow-terminal');
const flowTerminalBody = document.getElementById('flow-terminal-body');
const flowTerminalClose = document.getElementById('flow-terminal-close');

flowTerminalClose?.addEventListener('click', () => {
  if (flowTerminal) flowTerminal.hidden = true;
});

function addTerminalLine(text, type = 'info') {
  if (!flowTerminalBody) return;
  const timeStr = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.className = 'terminal-line';
  if (type === 'success') line.classList.add('terminal-line--success');
  else if (type === 'error') line.classList.add('terminal-line--error');
  
  line.innerHTML = `<span class="terminal-line--time">[${timeStr}]</span>${escapeHtml(text)}`;
  flowTerminalBody.appendChild(line);
  flowTerminalBody.scrollTop = flowTerminalBody.scrollHeight;
}

async function updateLoadBadge() {
  const loadBtn = document.getElementById('btn-load');
  if (!loadBtn) return;
  try {
    const data = await chrome.storage.local.get('synthux_flows');
    const flows = data.synthux_flows || [];
    if (flows.length > 0) {
      loadBtn.innerHTML = `Load <span class="badge-pill">+${flows.length}</span>`;
    } else {
      loadBtn.innerHTML = `Load`;
    }
  } catch (err) {
    loadBtn.innerHTML = `Load`;
  }
}

// Initial calls
updateLoadBadge();

// Migrate old single-save format to multi-save
(async function migrateOldSave() {
  try {
    const data = await chrome.storage.local.get(['synthux_flow', 'synthux_flows']);
    if (data.synthux_flow && (!data.synthux_flows || data.synthux_flows.length === 0)) {
      const oldState = data.synthux_flow;
      const entry = {
        id: `flow_migrated_${Date.now()}`,
        name: 'Previous Flow',
        timestamp: new Date().toISOString(),
        pageCount: oldState.nodes?.length || 0,
        state: oldState
      };
      await chrome.storage.local.set({ synthux_flows: [entry] });
      await chrome.storage.local.remove('synthux_flow');
      updateLoadBadge();
      console.info('[flow] Migrated old single-save to multi-save format');
    }
  } catch (err) {
    console.warn('[flow] Migration check failed:', err);
  }
})();

// Auto-add page from query params if present
const params = new URLSearchParams(window.location.search);
const initialUrl = params.get('url');
const initialTitle = params.get('title');
if (initialUrl) {
  setTimeout(() => {
    canvas.addNode(initialUrl, initialTitle || null);
    canvas.fitAll();
    // Clear query params from URL without reloading
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, 100);
}
