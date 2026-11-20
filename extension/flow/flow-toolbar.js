/**
 * synthux — Flow Toolbar & Studio Controller (v2.2.0)
 *
 * Manages:
 * - Add Page (with Step Goal & Drop-Off Metric), Pin Active Tab, Open Tabs Multi-Picker
 * - Auto-Layout, Add Note, Clear, Save/Load (with report persistence), Export/Import JSON
 * - Sub-Toolbar Config Bar: Rule Pack, Personas, and Business & Goal Context
 * - Floating Step & Transition Inspector Panel
 * - Live 2-way MCP Canvas Synchronization
 */

import { FlowCanvas } from './flow-canvas.js';

// ─── Init Canvas ────────────────────────────────────────────────────────────
const canvas = new FlowCanvas();
window.__synthux_canvas = canvas;

// ─── Config State (Rule Pack, Personas, Business Context) ───────────────────
let selectedRulePack = 'nielsen-10';
let selectedProfiles = ['first-time', 'power-user', 'accessibility'];
let bizState = { enabled: false, activeContextId: 'default-context', contexts: [], customDepartments: [] };

const rulePackSelect = document.getElementById('flow-rulepack-select');
const personasChipsEl = document.getElementById('flow-personas-chips');
const bizEnabledCheckbox = document.getElementById('flow-biz-enabled');
const bizSelect = document.getElementById('flow-biz-select');

async function loadFlowConfigBar() {
  try {
    const data = await chrome.storage.local.get({
      rulePackId: 'nielsen-10',
      customRulePacks: [],
      synthux_selected_profiles: ['first-time', 'power-user', 'accessibility'],
      customProfiles: [],
      synthux_business_context_state: null
    });

    selectedRulePack = data.rulePackId || 'nielsen-10';
    selectedProfiles = Array.isArray(data.synthux_selected_profiles) && data.synthux_selected_profiles.length > 0
      ? data.synthux_selected_profiles
      : ['first-time', 'power-user', 'accessibility'];

    // Populate Rule Packs
    if (rulePackSelect) {
      const builtIn = [
        { id: 'nielsen-10', name: "Nielsen's 10 Heuristics" },
        { id: 'ecommerce', name: 'E-Commerce & Conversion' },
        { id: 'saas', name: 'SaaS & Web Apps' },
        { id: 'fintech', name: 'Fintech & Banking' }
      ];
      const custom = (data.customRulePacks || []).map(p => ({ id: p.id, name: `${p.shortName || p.name} (Custom)` }));
      rulePackSelect.innerHTML = [...builtIn, ...custom]
        .map(p => `<option value="${escapeHtml(p.id)}" ${p.id === selectedRulePack ? 'selected' : ''}>${escapeHtml(p.name)}</option>`)
        .join('');
    }

    // Populate Persona Chips
    if (personasChipsEl) {
      const builtInPersonas = [
        { id: 'first-time', label: 'First-Time' },
        { id: 'power-user', label: 'Power User' },
        { id: 'accessibility', label: 'Accessibility' }
      ];
      const customPersonas = (data.customProfiles || []).map(cp => ({
        id: cp.id,
        label: cp.name?.en || cp.name || cp.id
      }));
      personasChipsEl.innerHTML = [...builtInPersonas, ...customPersonas]
        .map(p => `<button type="button" class="flow-chip ${selectedProfiles.includes(p.id) ? 'active' : ''}" data-profile="${escapeHtml(p.id)}">${escapeHtml(p.label)}</button>`)
        .join('');

      personasChipsEl.querySelectorAll('.flow-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.dataset.profile;
          if (selectedProfiles.includes(pid)) {
            if (selectedProfiles.length > 1) selectedProfiles = selectedProfiles.filter(x => x !== pid);
          } else {
            selectedProfiles = [...selectedProfiles, pid];
          }
          btn.classList.toggle('active', selectedProfiles.includes(pid));
          chrome.storage.local.set({ synthux_selected_profiles: selectedProfiles });
        });
      });
    }

    // Populate Business Context
    if (data.synthux_business_context_state) {
      bizState = data.synthux_business_context_state;
    }
    if (bizEnabledCheckbox) {
      bizEnabledCheckbox.checked = Boolean(bizState?.enabled);
    }
    if (bizSelect) {
      const contexts = Array.isArray(bizState?.contexts) && bizState.contexts.length > 0
        ? bizState.contexts
        : [{ id: 'default-context', name: 'Default Product Context' }];
      bizSelect.innerHTML = contexts
        .map(c => `<option value="${escapeHtml(c.id)}" ${c.id === bizState?.activeContextId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
        .join('');
    }
  } catch (err) {
    console.warn('[flow] Could not load config bar settings:', err);
  }
}

rulePackSelect?.addEventListener('change', (e) => {
  selectedRulePack = e.target.value;
  chrome.storage.local.set({ rulePackId: selectedRulePack });
});

bizEnabledCheckbox?.addEventListener('change', async (e) => {
  bizState.enabled = e.target.checked;
  await chrome.storage.local.set({ synthux_business_context_state: bizState });
});

bizSelect?.addEventListener('change', async (e) => {
  bizState.activeContextId = e.target.value;
  await chrome.storage.local.set({ synthux_business_context_state: bizState });
});

chrome.storage?.onChanged?.addListener((changes) => {
  if (changes.synthux_business_context_state || changes.customRulePacks || changes.customProfiles) {
    loadFlowConfigBar();
  }
});

loadFlowConfigBar();

// ─── Floating Step & Transition Inspector ───────────────────────────────────

const inspectorPanel = document.getElementById('inspector-panel');
const inspectorTitle = document.getElementById('inspector-title');
const inspectorBody = document.getElementById('inspector-body');
const inspectorClose = document.getElementById('inspector-close');

inspectorClose?.addEventListener('click', () => {
  inspectorPanel.hidden = true;
});

canvas.on('clearSelect', () => {
  inspectorPanel.hidden = true;
});

canvas.on('nodeClick', (node) => {
  if (!inspectorPanel || !inspectorBody) return;
  const stepIdx = Array.from(canvas.nodes.keys()).indexOf(node.id) + 1;
  inspectorTitle.textContent = `Step ${stepIdx} Inspector`;
  inspectorPanel.hidden = false;

  inspectorBody.innerHTML = `
    <label class="popover__label">Step Label</label>
    <input id="insp-label" type="text" class="popover__input" value="${escapeHtml(node.label || '')}">
    <label class="popover__label" style="margin-top:4px;">Page URL</label>
    <input id="insp-url" type="url" class="popover__input" value="${escapeHtml(node.url || '')}">
    <label class="popover__label" style="margin-top:4px;">Expected Step Goal / Action</label>
    <input id="insp-goal" type="text" class="popover__input" placeholder="e.g. Choose plan & click CTA" value="${escapeHtml(node.stepGoal || '')}">
    <label class="popover__label" style="margin-top:4px;">Step Metric / Drop-Off</label>
    <input id="insp-metric" type="text" class="popover__input" placeholder="e.g. Drop-off: 45%" value="${escapeHtml(node.dropOffMetric || '')}">
    <div style="display:flex;gap:6px;margin-top:8px;">
      <button id="insp-save" class="tb-btn tb-btn--accent" style="flex:1;">Apply</button>
      <button id="insp-open-url" class="tb-btn" title="Open URL in new tab">↗ Open</button>
      <button id="insp-add-note" class="tb-btn" title="Attach sticky note">+ Note</button>
    </div>
  `;

  document.getElementById('insp-save')?.addEventListener('click', () => {
    const newLabel = document.getElementById('insp-label')?.value?.trim();
    const newUrl = document.getElementById('insp-url')?.value?.trim();
    const newGoal = document.getElementById('insp-goal')?.value?.trim();
    const newMetric = document.getElementById('insp-metric')?.value?.trim();
    canvas.updateNode(node.id, {
      label: newLabel || node.label,
      url: newUrl || node.url,
      stepGoal: newGoal || '',
      dropOffMetric: newMetric || ''
    });
    updateSaveStatus('Step updated');
  });

  document.getElementById('insp-open-url')?.addEventListener('click', () => {
    if (node.url) window.open(node.url, '_blank');
  });

  document.getElementById('insp-add-note')?.addEventListener('click', () => {
    canvas.addNote(node.x + 10, node.y + 190, `Note for ${node.label}`, node.id);
  });
});

canvas.on('connectorClick', (conn) => {
  if (!inspectorPanel || !inspectorBody) return;
  const fromNode = canvas.nodes.get(conn.fromId);
  const toNode = canvas.nodes.get(conn.toId);
  inspectorTitle.textContent = `Transition Inspector`;
  inspectorPanel.hidden = false;

  inspectorBody.innerHTML = `
    <div style="font-size:11px;color:var(--sx-text-secondary);margin-bottom:4px;">
      <b>${escapeHtml(fromNode?.label || conn.fromId)}</b> ➔ <b>${escapeHtml(toNode?.label || conn.toId)}</b>
    </div>
    <label class="popover__label">Expected User Action / Trigger</label>
    <input id="insp-conn-label" type="text" class="popover__input" placeholder="e.g. Click 'Proceed to Checkout'" value="${escapeHtml(conn.label || '')}">
    ${conn.description ? `<div style="font-size:11px;color:var(--sx-text-tertiary);margin-top:4px;">AI Assessment: ${escapeHtml(conn.description)}</div>` : ''}
    <div style="display:flex;gap:6px;margin-top:8px;">
      <button id="insp-conn-save" class="tb-btn tb-btn--accent" style="flex:1;">Save Trigger</button>
      <button id="insp-conn-del" class="tb-btn" style="color:var(--sx-danger);">Delete Link</button>
    </div>
  `;

  document.getElementById('insp-conn-save')?.addEventListener('click', () => {
    const val = document.getElementById('insp-conn-label')?.value?.trim() || '';
    canvas.updateConnector(conn.fromId, conn.toId, { label: val });
    updateSaveStatus('Transition updated');
  });

  document.getElementById('insp-conn-del')?.addEventListener('click', () => {
    canvas.removeConnector(conn.fromId, conn.toId);
    inspectorPanel.hidden = true;
  });
});

// ─── Toolbar Buttons ────────────────────────────────────────────────────────

const addPageBtn = document.getElementById('btn-add-page');
const popover = document.getElementById('add-page-popover');
const urlInput = document.getElementById('add-page-url');
const labelInput = document.getElementById('add-page-label');
const goalInput = document.getElementById('add-page-goal');
const metricInput = document.getElementById('add-page-metric');

addPageBtn.addEventListener('click', () => {
  popover.hidden = !popover.hidden;
  if (!popover.hidden) {
    urlInput.value = '';
    labelInput.value = '';
    if (goalInput) goalInput.value = '';
    if (metricInput) metricInput.value = '';
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
  canvas.addNode(fullUrl, labelInput.value.trim() || null, x, y, {
    stepGoal: goalInput?.value?.trim() || '',
    dropOffMetric: metricInput?.value?.trim() || ''
  });
  popover.hidden = true;
});

document.getElementById('add-page-cancel').addEventListener('click', () => {
  popover.hidden = true;
  canvas._pendingNodePos = null;
});

[urlInput, labelInput, goalInput, metricInput].filter(Boolean).forEach(inp => {
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('add-page-confirm').click();
    if (e.key === 'Escape') {
      popover.hidden = true;
      canvas._pendingNodePos = null;
    }
  });
});

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

// 🌐 Open Browser Tabs Multi-Picker
const openTabsModal = document.getElementById('open-tabs-modal');
const openTabsBody = document.getElementById('open-tabs-body');
let availableOpenTabs = [];

document.getElementById('btn-open-tabs')?.addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TABS' });
    availableOpenTabs = (response?.tabs || []).filter(t => t.url && (t.url.startsWith('http://') || t.url.startsWith('https://')));
    if (availableOpenTabs.length === 0) {
      openTabsBody.innerHTML = '<div class="flow-list-empty">No open web tabs found. Open a few web pages in Chrome first.</div>';
    } else {
      openTabsBody.innerHTML = availableOpenTabs.map((t, idx) => `
        <label class="open-tab-row">
          <input type="checkbox" class="open-tab-check" value="${idx}" checked>
          <div style="min-width:0;flex:1;">
            <div style="font-size:12px;font-weight:600;color:var(--sx-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(t.title || t.url)}</div>
            <div style="font-size:10px;color:var(--sx-text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(t.url)}</div>
          </div>
        </label>
      `).join('');
    }
    openTabsModal.hidden = false;
  } catch (err) {
    console.warn('[flow] Failed to list open tabs:', err);
  }
});

document.getElementById('open-tabs-close')?.addEventListener('click', () => { openTabsModal.hidden = true; });
document.getElementById('open-tabs-cancel')?.addEventListener('click', () => { openTabsModal.hidden = true; });
document.getElementById('open-tabs-select-all')?.addEventListener('click', () => {
  const checks = openTabsBody.querySelectorAll('.open-tab-check');
  const allChecked = Array.from(checks).every(c => c.checked);
  checks.forEach(c => { c.checked = !allChecked; });
});

document.getElementById('open-tabs-confirm')?.addEventListener('click', () => {
  const checks = openTabsBody.querySelectorAll('.open-tab-check:checked');
  checks.forEach(c => {
    const tab = availableOpenTabs[Number(c.value)];
    if (tab) {
      canvas.addNode(tab.url, tab.title || null);
    }
  });
  openTabsModal.hidden = true;
  canvas.fitAll();
});

// Add Note & Auto-Layout
document.getElementById('btn-add-note').addEventListener('click', () => {
  canvas.addNote();
});

document.getElementById('btn-auto-layout')?.addEventListener('click', () => {
  canvas.autoLayout();
  updateSaveStatus('Auto-aligned');
});

// Export / Import Flow JSON
document.getElementById('btn-export-json')?.addEventListener('click', () => {
  const state = canvas.exportState();
  const payload = {
    synthuxFlowVersion: '2.2.0',
    exportedAt: new Date().toISOString(),
    rulePackId: selectedRulePack,
    profiles: selectedProfiles,
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `synthux-flow-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('input-import-json')?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const st = parsed.state || parsed;
    if (Array.isArray(st.nodes)) {
      canvas.importState(st);
      canvas.fitAll();
      updateSaveStatus('Imported Flow JSON');
    }
  } catch (err) {
    alert('Invalid Flow JSON file: ' + err.message);
  }
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
    inspectorPanel.hidden = true;
    document.getElementById('results-panel').hidden = true;
    updateSaveStatus('Cleared');
  }
});

// ─── Save & Load Flow (Multi-Flow with Report Persistence) ──────────────────

const savePopover = document.getElementById('save-popover');
const saveNameInput = document.getElementById('save-name-input');

document.getElementById('btn-save').addEventListener('click', () => {
  const pages = canvas.getPages();
  if (pages.length === 0 && canvas.notes.size === 0) return;
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

document.getElementById('save-confirm').addEventListener('click', () => performSave());
document.getElementById('save-cancel').addEventListener('click', () => { savePopover.hidden = true; });
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

    const existingIdx = flows.findIndex(f => f.name === name);
    const entry = {
      id: existingIdx >= 0 ? flows[existingIdx].id : `flow_${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      pageCount: state.nodes?.length || 0,
      flowScore: state.flowReport?.flowScore ?? null,
      goalScore: state.flowReport?.businessAlignment?.goalAlignmentScore ?? null,
      state
    };

    if (existingIdx >= 0) {
      flows[existingIdx] = entry;
    } else {
      flows.unshift(entry);
    }

    await chrome.storage.local.set({ synthux_flows: flows });
    updateSaveStatus('Saved');
    updateLoadBadge();
  } catch (err) {
    console.error('[flow] Save failed:', err);
  }
}

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
    const scoreBadge = f.flowScore != null ? `<span style="color:var(--sx-accent);font-weight:700;">Score: ${f.flowScore}/100</span>` : '';
    return `
      <li class="flow-list-item" data-index="${idx}">
        <div class="flow-list-item__info">
          <span class="flow-list-item__name">${escapeHtml(f.name)}</span>
          <span class="flow-list-item__meta">
            <span>${f.pageCount || 0} pages</span>
            ${scoreBadge}
            <span>${date}</span>
          </span>
        </div>
        <div class="flow-list-item__actions">
          <button class="flow-list-item__delete" data-delete-index="${idx}" title="Delete">×</button>
        </div>
      </li>`;
  }).join('')}</ul>`;

  loadModalBody.querySelectorAll('.flow-list-item').forEach(item => {
    item.addEventListener('click', async (e) => {
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
      await renderFlowList();
    });
  });
}

function updateSaveStatus(text) {
  const el = document.getElementById('status-progress');
  el.hidden = false;
  el.textContent = text;
  setTimeout(() => { el.hidden = true; }, 2000);
}

// ─── Analyze Flow & Cancel ──────────────────────────────────────────────────

const receiptModal = document.getElementById('receipt-modal');
const receiptBody = document.getElementById('receipt-body');
const analyzeBtn = document.getElementById('btn-analyze');
const cancelAnalyzeBtn = document.getElementById('btn-cancel-analyze');

function setAnalyzeBtnLabel(text) {
  const span = analyzeBtn?.querySelector('span');
  if (span) span.textContent = text;
  else if (analyzeBtn) analyzeBtn.textContent = text;
}

analyzeBtn.addEventListener('click', () => {
  const pages = canvas.getPages();
  if (pages.length === 0) return;
  showReceipt(pages);
});

cancelAnalyzeBtn?.addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ type: 'CANCEL_FLOW_ANALYSIS' });
  } catch {}
  isAnalyzing = false;
  currentSessionId = null;
  analyzeBtn.disabled = false;
  setAnalyzeBtnLabel('Analyze Flow');
  cancelAnalyzeBtn.hidden = true;
  addTerminalLine('Flow analysis cancelled by user.', 'error');
  if (flowTerminalClose) flowTerminalClose.hidden = false;
});

function showReceipt(pages) {
  const notes = canvas.getNotes();
  const activeBiz = bizState?.enabled
    ? (bizState.contexts?.find(c => c.id === bizState.activeContextId) || bizState.contexts?.[0])
    : null;

  receiptBody.innerHTML = `
    <div class="receipt-section">
      <div class="receipt-section__title">Journey Scope</div>
      <div class="receipt-row">
        <span class="receipt-row__label">Total steps</span>
        <span class="receipt-row__value">${pages.length}</span>
      </div>
      <ul class="receipt-page-list">
        ${pages.map((p, i) => `<li><b>S${i + 1}:</b> ${escapeHtml(p.label)}${p.stepGoal ? ` <span style="color:var(--sx-accent);">(${escapeHtml(p.stepGoal)})</span>` : ''}</li>`).join('')}
      </ul>
      <div class="receipt-row" style="margin-top:8px;">
        <span class="receipt-row__label">Rule Pack</span>
        <span class="receipt-row__value">${escapeHtml(selectedRulePack)}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Personas</span>
        <span class="receipt-row__value">${selectedProfiles.length} selected</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Business Context</span>
        <span class="receipt-row__value" style="color:${activeBiz ? 'var(--sx-accent)' : 'var(--sx-text-tertiary)'};">
          ${activeBiz ? escapeHtml(activeBiz.name) : 'Off (Standard UX Only)'}
        </span>
      </div>
      ${notes.length > 0 ? `
        <div class="receipt-row">
          <span class="receipt-row__label">Sticky notes</span>
          <span class="receipt-row__value">${notes.length}</span>
        </div>
      ` : ''}
    </div>
    <hr class="receipt-divider">
    <div class="receipt-section">
      <div class="receipt-section__title">AI Engine &amp; Estimate</div>
      <div class="receipt-row">
        <span class="receipt-row__label">Provider</span>
        <span class="receipt-row__value" id="receipt-provider">Loading...</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Est. time</span>
        <span class="receipt-row__value" id="receipt-time">~${pages.length * 2} min</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-row__label">Est. cost</span>
        <span class="receipt-row__value" id="receipt-cost">Calculating...</span>
      </div>
    </div>
  `;

  receiptModal.hidden = false;

  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }).then(settings => {
    const providerEl = document.getElementById('receipt-provider');
    const costEl = document.getElementById('receipt-cost');
    const timeEl = document.getElementById('receipt-time');
    const isLocal = ['ollama', 'apple', 'chromeai'].includes(settings.providerId);
    if (providerEl) {
      const providerNames = {
        ollama: 'Ollama (local)',
        apple: 'Apple Intelligence',
        chromeai: 'Chrome Built-in AI',
        openai: 'OpenAI',
        gemini: 'Gemini',
        claude: 'Claude',
        anthropic: 'Claude'
      };
      providerEl.textContent = `${providerNames[settings.providerId] || settings.providerId} · ${settings.ollamaModel}`;
    }
    if (costEl) {
      costEl.textContent = isLocal ? 'Free (On-Device)' : `~$${(pages.length * 0.03).toFixed(2)}`;
    }
    if (timeEl) {
      const perPage = isLocal ? 2 : 0.5;
      timeEl.textContent = `~${Math.max(1, Math.round(pages.length * perPage))} min`;
    }
  }).catch(() => {});
}

document.getElementById('receipt-close').addEventListener('click', () => { receiptModal.hidden = true; });
document.getElementById('receipt-cancel').addEventListener('click', () => { receiptModal.hidden = true; });

document.getElementById('receipt-start').addEventListener('click', () => {
  receiptModal.hidden = true;
  startFlowAnalysis();
});

let isAnalyzing = false;
let currentSessionId = null;

async function startFlowAnalysis() {
  if (isAnalyzing) return;
  isAnalyzing = true;
  currentSessionId = null;

  const pages = canvas.getPages();
  const connectors = canvas.getConnectors();
  const notes = canvas.getNotes();

  canvas.clearAllResults();

  analyzeBtn.disabled = true;
  setAnalyzeBtnLabel('Analyzing...');
  if (cancelAnalyzeBtn) cancelAnalyzeBtn.hidden = false;

  const statusText = document.getElementById('status-text');
  const statusProgress = document.getElementById('status-progress');
  statusText.textContent = `Starting flow analysis...`;
  statusProgress.textContent = 'Preparing...';
  statusProgress.hidden = false;

  if (flowTerminal) {
    flowTerminal.hidden = false;
    if (flowTerminalClose) flowTerminalClose.hidden = true;
    if (flowTerminalBody) flowTerminalBody.innerHTML = '';
    addTerminalLine(`Starting flow analysis journey (${selectedRulePack})...`, 'info');
    addTerminalLine(`Found ${pages.length} step(s) and ${connectors.length} transition(s).`, 'info');
  }

  try {
    const result = await chrome.runtime.sendMessage({
      type: 'START_FLOW_ANALYSIS',
      payload: {
        pages,
        connectors,
        notes,
        rulePackId: selectedRulePack,
        profiles: selectedProfiles
      }
    });

    if (result?.error) {
      statusProgress.textContent = 'Error: ' + result.error;
      addTerminalLine(`Failed to start analysis: ${result.error}`, 'error');
      if (flowTerminalClose) flowTerminalClose.hidden = false;
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      setAnalyzeBtnLabel('Analyze Flow');
      if (cancelAnalyzeBtn) cancelAnalyzeBtn.hidden = true;
    } else if (result?.sessionId) {
      currentSessionId = result.sessionId;
      addTerminalLine(`Session started: ${result.sessionId}`, 'info');
    }
  } catch (err) {
    addTerminalLine(`Analysis failed during execution: ${err.message || err}`, 'error');
    if (flowTerminalClose) flowTerminalClose.hidden = false;
    isAnalyzing = false;
    currentSessionId = null;
    analyzeBtn.disabled = false;
    setAnalyzeBtnLabel('Analyze Flow');
    if (cancelAnalyzeBtn) cancelAnalyzeBtn.hidden = true;
  }
}

// ─── Runtime Message Listener (Progress + Live MCP Canvas Control) ──────────

if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 1. Live MCP Flow Canvas Remote Control
    if (message.type === 'MCP_FLOW_CANVAS_ACTION') {
      const { action, params = {} } = message.payload || {};
      try {
        switch (action) {
          case 'get_canvas':
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'add_node': {
            const node = canvas.addNode(params.url, params.label || null, params.x ?? null, params.y ?? null, {
              stepGoal: params.stepGoal || '',
              dropOffMetric: params.dropOffMetric || '',
              autoConnect: params.autoConnect !== false
            });
            canvas.fitAll();
            sendResponse({ success: true, nodeId: node.id, canvas: canvas.exportState() });
            return false;
          }
          case 'update_node': {
            const updated = canvas.updateNode(params.nodeId || params.id, params);
            sendResponse({ success: Boolean(updated), canvas: canvas.exportState() });
            return false;
          }
          case 'remove_node':
            canvas.removeNode(params.nodeId || params.id);
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'add_connector':
            canvas.addConnector(params.fromId, params.toId, params.label || '');
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'update_connector':
            canvas.updateConnector(params.fromId, params.toId, params);
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'remove_connector':
            canvas.removeConnector(params.fromId, params.toId);
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'add_note': {
            const note = canvas.addNote(params.x ?? null, params.y ?? null, params.text || '', params.attachedTo || null);
            sendResponse({ success: true, noteId: note.id, canvas: canvas.exportState() });
            return false;
          }
          case 'remove_note':
            canvas.removeNote(params.noteId || params.id);
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'auto_layout':
            canvas.autoLayout();
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'clear_canvas':
            canvas.clearAll();
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'import_state':
            if (params.state) {
              canvas.importState(params.state);
              canvas.fitAll();
            }
            sendResponse({ success: true, canvas: canvas.exportState() });
            return false;
          case 'apply_flow_report':
            if (params.flowReport) {
              applyCompletedFlowReport(params.flowReport);
            }
            sendResponse({ success: true });
            return false;
        }
      } catch (err) {
        sendResponse({ error: err.message });
        return false;
      }
    }

    // 2. Flow Analysis Progress Messages
    const msgSessionId = message.payload?.sessionId;
    if (msgSessionId && currentSessionId && msgSessionId !== currentSessionId) {
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
        statusText.textContent = `Analyzing step ${pageIndex + 1} of ${totalPages}`;
        statusProgress.textContent = msg || phase;
        statusProgress.hidden = false;
        if (pageId) canvas.setNodeAnalyzing(pageId, true);
        const node = pageId ? canvas.nodes.get(pageId) : null;
        const label = node?.label || pageId || 'journey';
        addTerminalLine(`[Step ${pageIndex + 1}/${totalPages}] ${label} -> ${phase} ${msg ? `(${msg})` : ''}`, 'info');
      }
    }

    if (message.type === 'FLOW_PAGE_COMPLETE') {
      const { pageId, score, report, thumbnail } = message.payload;
      canvas.updateNodeResult(pageId, { score, report, thumbnail });
      canvas.setNodeAnalyzing(pageId, false);
      const node = canvas.nodes.get(pageId);
      const label = node?.label || pageId;
      addTerminalLine(`[Step Complete] ${label} scanned`, 'success');
    }

    if (message.type === 'FLOW_COMPLETE') {
      const { flowReport } = message.payload;
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      setAnalyzeBtnLabel('Analyze Flow');
      if (cancelAnalyzeBtn) cancelAnalyzeBtn.hidden = true;

      const statusText = document.getElementById('status-text');
      const statusProgress = document.getElementById('status-progress');
      statusText.textContent = `${canvas.nodes.size} pages · Analysis complete`;
      statusProgress.hidden = true;

      addTerminalLine(`Flow analysis completed! Overall Flow Score: ${flowReport.flowScore || 0}/100`, 'success');
      if (flowTerminalClose) flowTerminalClose.hidden = false;

      applyCompletedFlowReport(flowReport);
    }

    if (message.type === 'FLOW_ERROR') {
      isAnalyzing = false;
      currentSessionId = null;
      analyzeBtn.disabled = false;
      setAnalyzeBtnLabel('Analyze Flow');
      if (cancelAnalyzeBtn) cancelAnalyzeBtn.hidden = true;

      const statusProgress = document.getElementById('status-progress');
      statusProgress.textContent = 'Error: ' + (message.payload?.error || 'Unknown');
      statusProgress.hidden = false;

      addTerminalLine(`Flow analysis failed: ${message.payload?.error || 'Unknown'}`, 'error');
      if (flowTerminalClose) flowTerminalClose.hidden = false;
    }
  });
}

function applyCompletedFlowReport(flowReport) {
  canvas.flowReport = flowReport;
  if (flowReport.pages) {
    for (const p of flowReport.pages) {
      const pid = p.page?.id || p.id;
      canvas.updateNodeResult(pid, {
        score: p.score,
        report: p.report
      });
    }
  }
  if (flowReport.transitions) {
    for (const t of flowReport.transitions) {
      canvas.updateConnectorResult(t.fromId, t.toId, {
        quality: t.quality,
        description: t.description
      });
    }
  }
  canvas._syncLiveCanvas();
  window.__synthux_showResults?.(flowReport);
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

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
  const badgeEl = document.getElementById('load-count-badge');
  if (!badgeEl) return;
  try {
    const data = await chrome.storage.local.get('synthux_flows');
    const flows = data.synthux_flows || [];
    if (flows.length > 0) {
      badgeEl.textContent = String(flows.length);
      badgeEl.hidden = false;
    } else {
      badgeEl.hidden = true;
    }
  } catch {
    badgeEl.hidden = true;
  }
}

updateLoadBadge();

// Restore live canvas or initial URL param
const params = new URLSearchParams(window.location.search);
const initialUrl = params.get('url');
const initialTitle = params.get('title');

if (initialUrl) {
  setTimeout(() => {
    canvas.addNode(initialUrl, initialTitle || null);
    canvas.fitAll();
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, 100);
} else {
  // Restore previous live canvas if available
  chrome.storage?.local?.get('synthux_live_flow_canvas').then(data => {
    if (data?.synthux_live_flow_canvas?.nodes?.length > 0 && canvas.nodes.size === 0) {
      canvas.importState(data.synthux_live_flow_canvas);
    }
  }).catch(() => {});
}
