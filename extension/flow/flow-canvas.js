/**
 * synthux — Flow Canvas Engine
 * 
 * Manages nodes, connectors, sticky notes on an infinite pan/zoom canvas.
 * Pure vanilla JS — no framework dependency.
 */

let idCounter = 0;
function uid(prefix = 'n') { return `${prefix}${++idCounter}`; }

export class FlowCanvas {
  constructor() {
    this.nodes = new Map();       // id → {id,x,y,url,label,score,report,thumbnail,el}
    this.connectors = [];         // [{id,fromId,toId,pathEl}]
    this.notes = new Map();       // id → {id,x,y,text,attachedTo,el}
    this.viewport = { x: 0, y: 0, zoom: 1 };
    this.selected = null;         // {type:'node'|'note', id}
    this._connectFrom = null;     // node id when drawing connector
    this._tempPath = null;        // SVG temp path element
    this._dragState = null;

    // DOM refs
    this._viewportEl = document.getElementById('canvas-viewport');
    this._canvasEl = document.getElementById('canvas');
    this._svgEl = document.getElementById('connector-svg');

    this._callbacks = {};
    this._init();
  }

  // ─── Public API ─────────────────────────────────────────────────

  addNode(url, label, x, y) {
    const id = uid('n');
    if (x == null) x = (-this.viewport.x + this._viewportEl.clientWidth / 2) / this.viewport.zoom - 100;
    if (y == null) y = (-this.viewport.y + this._viewportEl.clientHeight / 2) / this.viewport.zoom - 80;
    const lastNode = Array.from(this.nodes.values()).pop();
    const node = { id, x, y, url, label: label || this._urlToLabel(url), score: null, report: null, thumbnail: null };
    this.nodes.set(id, node);
    this._renderNode(node);
    if (lastNode) {
      this.addConnector(lastNode.id, id);
    }
    this._updateStatus();
    this._emit('change');
    return node;
  }

  removeNode(id) {
    const node = this.nodes.get(id);
    if (!node) return;
    if (node.el) node.el.remove();
    this.nodes.delete(id);
    // Remove attached connectors
    this.connectors = this.connectors.filter(c => {
      if (c.fromId === id || c.toId === id) {
        if (c.pathEl) c.pathEl.remove();
        return false;
      }
      return true;
    });
    // Remove attached notes
    for (const [nid, note] of this.notes) {
      if (note.attachedTo === id) {
        note.attachedTo = null;
      }
    }
    this._updateStatus();
    this._emit('change');
  }

  updateNodeResult(id, { score, report, thumbnail }) {
    const node = this.nodes.get(id);
    if (!node) return;
    if (score !== undefined) node.score = score;
    if (report !== undefined) node.report = report;
    if (thumbnail !== undefined) node.thumbnail = thumbnail;
    this._renderNodeUpdate(node);
  }

  setNodeAnalyzing(id, analyzing) {
    const node = this.nodes.get(id);
    if (node?.el) {
      node.el.classList.toggle('analyzing', analyzing);
    }
  }

  /**
   * Clear all analysis results from nodes and connectors.
   * Called before starting a new analysis to prevent stale data.
   */
  clearAllResults() {
    for (const [, node] of this.nodes) {
      node.score = null;
      node.report = null;
      node.thumbnail = null;
      this._renderNodeUpdate(node);
    }
    for (const conn of this.connectors) {
      conn.quality = null;
      conn.description = null;
    }
  }

  /**
   * Remove everything from the canvas — all nodes, notes, and connectors.
   */
  clearAll() {
    // Remove all node DOM elements
    for (const [, node] of this.nodes) {
      if (node.el) node.el.remove();
    }
    this.nodes.clear();

    // Remove all note DOM elements
    for (const [, note] of this.notes) {
      if (note.el) note.el.remove();
    }
    this.notes.clear();

    // Remove all connector SVG paths
    for (const conn of this.connectors) {
      if (conn.pathEl) conn.pathEl.remove();
    }
    this.connectors = [];

    this._clearSelection();
    this._updateStatus();
    this._emit('change');
  }

  addNote(x, y, text, attachedTo) {
    const id = uid('s');
    if (x == null) x = (-this.viewport.x + this._viewportEl.clientWidth / 2) / this.viewport.zoom - 80;
    if (y == null) y = (-this.viewport.y + this._viewportEl.clientHeight / 2) / this.viewport.zoom;
    const note = { id, x, y, text: text || '', attachedTo: attachedTo || null };
    this.notes.set(id, note);
    this._renderNote(note);
    this._updateStatus();
    this._emit('change');
    return note;
  }

  removeNote(id) {
    const note = this.notes.get(id);
    if (!note) return;
    if (note.el) note.el.remove();
    this.notes.delete(id);
    this._updateStatus();
    this._emit('change');
  }

  addConnector(fromId, toId) {
    if (fromId === toId) return;
    if (this.connectors.some(c => c.fromId === fromId && c.toId === toId)) return;
    const id = uid('c');
    const conn = { id, fromId, toId, pathEl: null };
    this.connectors.push(conn);
    this._renderConnector(conn);
    this._emit('change');
  }

  removeConnector(fromId, toId) {
    this.connectors = this.connectors.filter(c => {
      if (c.fromId === fromId && c.toId === toId) {
        if (c.pathEl) c.pathEl.remove();
        return false;
      }
      return true;
    });
    this._emit('change');
  }

  updateConnectorResult(fromId, toId, { quality, description }) {
    const conn = this.connectors.find(c => c.fromId === fromId && c.toId === toId);
    if (!conn) return;
    conn.quality = quality;
    conn.description = description;
    this._renderConnectorUpdate(conn);
  }

  _renderConnectorUpdate(conn) {
    if (!conn.pathEl) return;
    conn.pathEl.classList.remove('connector-path--smooth', 'connector-path--friction', 'connector-path--high-friction');
    if (conn.quality === 'smooth') conn.pathEl.classList.add('connector-path--smooth');
    else if (conn.quality === 'friction') conn.pathEl.classList.add('connector-path--friction');
    else if (conn.quality === 'high-friction') conn.pathEl.classList.add('connector-path--high-friction');

    let titleEl = conn.pathEl.querySelector('title');
    if (!titleEl) {
      titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      conn.pathEl.appendChild(titleEl);
    }
    titleEl.textContent = `${conn.quality.toUpperCase()}: ${conn.description}`;
  }

  fitAll() {
    if (this.nodes.size === 0) {
      this.viewport = { x: 0, y: 0, zoom: 1 };
      this._applyTransform();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of this.nodes.values()) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + 200);
      maxY = Math.max(maxY, n.y + 180);
    }
    const vw = this._viewportEl.clientWidth;
    const vh = this._viewportEl.clientHeight;
    const padding = 60;
    const scaleX = (vw - padding * 2) / (maxX - minX || 1);
    const scaleY = (vh - padding * 2) / (maxY - minY || 1);
    const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 2);
    this.viewport.zoom = zoom;
    this.viewport.x = -minX * zoom + padding;
    this.viewport.y = -minY * zoom + padding;
    this._applyTransform();
    this._updateZoomDisplay();
  }

  setZoom(zoom) {
    const vw = this._viewportEl.clientWidth;
    const vh = this._viewportEl.clientHeight;
    const cx = vw / 2;
    const cy = vh / 2;
    const oldZoom = this.viewport.zoom;
    this.viewport.zoom = Math.min(Math.max(zoom, 0.25), 3);
    this.viewport.x = cx - (cx - this.viewport.x) * (this.viewport.zoom / oldZoom);
    this.viewport.y = cy - (cy - this.viewport.y) * (this.viewport.zoom / oldZoom);
    this._applyTransform();
    this._updateZoomDisplay();
  }

  on(event, fn) {
    this._callbacks[event] = fn;
  }

  exportState() {
    const nodes = [];
    for (const n of this.nodes.values()) {
      nodes.push({ id: n.id, x: n.x, y: n.y, url: n.url, label: n.label, score: n.score, thumbnail: n.thumbnail });
    }
    const notes = [];
    for (const n of this.notes.values()) {
      notes.push({ id: n.id, x: n.x, y: n.y, text: n.text, attachedTo: n.attachedTo });
    }
    return {
      nodes, notes,
      connectors: this.connectors.map(c => ({ fromId: c.fromId, toId: c.toId, quality: c.quality || null, description: c.description || null })),
      viewport: { ...this.viewport }
    };
  }

  importState(data) {
    // Clear
    for (const n of this.nodes.values()) n.el?.remove();
    for (const n of this.notes.values()) n.el?.remove();
    for (const c of this.connectors) c.pathEl?.remove();
    this.nodes.clear();
    this.notes.clear();
    this.connectors = [];

    // Import nodes
    for (const nd of (data.nodes || [])) {
      const node = { ...nd, report: null, el: null };
      this.nodes.set(node.id, node);
      this._renderNode(node);
      // Restore thumbnail if present
      if (node.thumbnail) this._renderNodeUpdate(node);
    }

    // Import notes
    for (const nd of (data.notes || [])) {
      const note = { ...nd, el: null };
      this.notes.set(note.id, note);
      this._renderNote(note);
    }

    // Import connectors
    for (const cd of (data.connectors || [])) {
      const conn = { id: uid('c'), fromId: cd.fromId, toId: cd.toId, quality: cd.quality || null, description: cd.description || null, pathEl: null };
      this.connectors.push(conn);
      this._renderConnector(conn);
      if (conn.quality) this._renderConnectorUpdate(conn);
    }

    // Restore viewport
    if (data.viewport) {
      this.viewport = { ...data.viewport };
      this._applyTransform();
      this._updateZoomDisplay();
    }

    // Update ID counter
    const allIds = [...(data.nodes || []), ...(data.notes || [])].map(x => x.id);
    const maxNum = allIds.reduce((m, id) => Math.max(m, parseInt(id.slice(1)) || 0), 0);
    if (maxNum > idCounter) idCounter = maxNum;

    this._updateStatus();
  }

  getPages() {
    return Array.from(this.nodes.values()).map(n => ({
      id: n.id, url: n.url, label: n.label
    }));
  }

  getNotes() {
    return Array.from(this.notes.values()).map(n => ({
      id: n.id, text: n.text, attachedTo: n.attachedTo
    }));
  }

  getConnectors() {
    return this.connectors.map(c => ({ fromId: c.fromId, toId: c.toId }));
  }

  // ─── Rendering ──────────────────────────────────────────────────

  _renderNode(node) {
    const el = document.createElement('div');
    el.className = 'flow-node';
    el.dataset.id = node.id;
    el.style.transform = `translate(${node.x}px, ${node.y}px)`;
    el.innerHTML = `
      <div class="node-header">
        <span class="node-drag">\u22EE\u22EE</span>
        <span class="node-title">${this._esc(node.label)}</span>
        <button class="node-remove">\u00D7</button>
      </div>
      <div class="node-thumbnail node-thumbnail--empty"></div>
      <div class="node-url">${this._esc(this._shortenUrl(node.url))}</div>
      <div class="node-footer">
        <span class="node-score">\u2014</span>
        <span class="node-score-label"></span>
      </div>
      <div class="node-port node-port--in"></div>
      <div class="node-port node-port--out"></div>
    `;

    node.el = el;
    this._canvasEl.appendChild(el);

    // Events
    el.querySelector('.node-drag').addEventListener('mousedown', e => this._onDragStart(e, node));
    el.querySelector('.node-remove').addEventListener('click', () => this.removeNode(node.id));
    el.querySelector('.node-port--out').addEventListener('mousedown', e => this._onConnectStart(e, node));
    el.querySelector('.node-port--in').addEventListener('mouseup', () => this._onConnectEnd(node));
    el.addEventListener('click', e => {
      if (e.target.closest('.node-remove, .node-port, .node-drag')) return;
      this._select('node', node.id);
      this._emit('nodeClick', node);
    });
  }

  _renderNodeUpdate(node) {
    if (!node.el) return;
    // Score
    const scoreEl = node.el.querySelector('.node-score');
    const labelEl = node.el.querySelector('.node-score-label');
    if (node.score != null) {
      scoreEl.textContent = node.score;
      scoreEl.className = 'node-score ' + (node.score >= 70 ? 'node-score--good' : node.score >= 50 ? 'node-score--warning' : 'node-score--bad');
      labelEl.textContent = '/100';
    }
    // Thumbnail
    const thumbEl = node.el.querySelector('.node-thumbnail');
    if (node.thumbnail) {
      thumbEl.className = 'node-thumbnail';
      thumbEl.innerHTML = `<img src="${node.thumbnail}" alt="Page preview">`;
    }
    // Remove analyzing state
    node.el.classList.remove('analyzing');
  }

  _renderNote(note) {
    const el = document.createElement('div');
    el.className = 'flow-note';
    el.dataset.id = note.id;
    el.style.transform = `translate(${note.x}px, ${note.y}px)`;
    el.innerHTML = `
      <div class="note-handle">\uD83D\uDCCC</div>
      <textarea class="note-text" placeholder="Add a note...">${this._esc(note.text)}</textarea>
      <button class="note-remove">\u00D7</button>
    `;

    note.el = el;
    this._canvasEl.appendChild(el);

    // Events
    el.querySelector('.note-handle').addEventListener('mousedown', e => this._onDragStart(e, note, true));
    el.querySelector('.note-remove').addEventListener('click', () => this.removeNote(note.id));
    el.querySelector('.note-text').addEventListener('input', e => {
      note.text = e.target.value;
    });
    el.querySelector('.note-text').addEventListener('mousedown', e => e.stopPropagation());
  }

  _renderConnector(conn) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('connector-path');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    this._svgEl.appendChild(path);
    conn.pathEl = path;
    this._updateConnectorPath(conn);

    // Listen to click to select connector
    path.addEventListener('click', (e) => {
      e.stopPropagation();
      this._select('connector', conn);
    });
  }

  _updateConnectorPath(conn) {
    const fromNode = this.nodes.get(conn.fromId);
    const toNode = this.nodes.get(conn.toId);
    if (!fromNode || !toNode || !conn.pathEl) return;

    // Out port: right center of from node
    const x1 = fromNode.x + 200;
    const y1 = fromNode.y + (fromNode.el?.offsetHeight || 160) / 2;
    // In port: left center of to node
    const x2 = toNode.x;
    const y2 = toNode.y + (toNode.el?.offsetHeight || 160) / 2;

    const dx = Math.abs(x2 - x1);
    const cp = Math.max(dx * 0.5, 60);
    const d = `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${x2 - cp} ${y2}, ${x2} ${y2}`;
    conn.pathEl.setAttribute('d', d);
  }

  _updateAllConnectors() {
    for (const conn of this.connectors) {
      this._updateConnectorPath(conn);
    }
  }

  // ─── Interaction Handlers ───────────────────────────────────────

  _init() {
    // Pan
    this._viewportEl.addEventListener('mousedown', e => {
      if (e.target !== this._viewportEl && e.target !== this._canvasEl) return;
      if (e.button !== 0 && e.button !== 1) return;
      this._startPan(e);
    });

    // Zoom
    this._viewportEl.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = this._viewportEl.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const oldZoom = this.viewport.zoom;
      const newZoom = Math.min(Math.max(oldZoom * delta, 0.25), 3);
      this.viewport.x = mx - (mx - this.viewport.x) * (newZoom / oldZoom);
      this.viewport.y = my - (my - this.viewport.y) * (newZoom / oldZoom);
      this.viewport.zoom = newZoom;
      this._applyTransform();
      this._updateZoomDisplay();
    }, { passive: false });

    // Show context menu on right click
    this._viewportEl.addEventListener('contextmenu', e => {
      if (e.target.closest('input, textarea, select, button')) return;
      e.preventDefault();
      this._showContextMenu(e.clientX, e.clientY);
    });

    // Connect end (global — in case mouse released outside port)
    document.addEventListener('mouseup', () => {
      if (this._connectFrom) {
        this._cancelConnect();
      }
      this._dragState = null;
    });

    // Connect move
    document.addEventListener('mousemove', e => {
      if (this._connectFrom && this._tempPath) {
        this._updateTempConnector(e);
      }
      if (this._dragState) {
        this._onDragMove(e);
      }
    });

    // Key shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;
        if (this.selected) {
          if (this.selected.type === 'node') this.removeNode(this.selected.id);
          else if (this.selected.type === 'note') this.removeNote(this.selected.id);
          else if (this.selected.type === 'connector') {
            this.removeConnector(this.selected.conn.fromId, this.selected.conn.toId);
          }
          this.selected = null;
        }
      }
      if (e.key === 'Escape') {
        this._cancelConnect();
        this.selected = null;
        this._clearSelection();
      }
    });

    // Click canvas to deselect
    this._canvasEl.addEventListener('click', e => {
      if (e.target === this._canvasEl) {
        this.selected = null;
        this._clearSelection();
      }
    });

    // Show empty state
    this._showEmptyState();
  }

  _startPan(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startVX = this.viewport.x;
    const startVY = this.viewport.y;
    this._viewportEl.classList.add('panning');

    const onMove = (ev) => {
      this.viewport.x = startVX + (ev.clientX - startX);
      this.viewport.y = startVY + (ev.clientY - startY);
      this._applyTransform();
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      this._viewportEl.classList.remove('panning');
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  _onDragStart(e, item, isNote = false) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startIX = item.x;
    const startIY = item.y;
    this._dragState = { item, isNote, startX, startY, startIX, startIY };
    this._hideEmptyState();
  }

  _onDragMove(e) {
    const d = this._dragState;
    if (!d) return;
    const dx = (e.clientX - d.startX) / this.viewport.zoom;
    const dy = (e.clientY - d.startY) / this.viewport.zoom;
    d.item.x = d.startIX + dx;
    d.item.y = d.startIY + dy;
    if (d.item.el) {
      d.item.el.style.transform = `translate(${d.item.x}px, ${d.item.y}px)`;
    }
    if (!d.isNote) {
      this._updateAllConnectors();
    }
  }

  _onConnectStart(e, node) {
    e.preventDefault();
    e.stopPropagation();
    this._connectFrom = node;
    this._viewportEl.classList.add('connecting');

    // Create temp SVG path
    this._tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this._tempPath.classList.add('connector-path', 'connector-path--temp');
    this._svgEl.appendChild(this._tempPath);
  }

  _updateTempConnector(e) {
    if (!this._connectFrom || !this._tempPath) return;
    const rect = this._viewportEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left - this.viewport.x) / this.viewport.zoom;
    const my = (e.clientY - rect.top - this.viewport.y) / this.viewport.zoom;
    const x1 = this._connectFrom.x + 200;
    const y1 = this._connectFrom.y + (this._connectFrom.el?.offsetHeight || 160) / 2;
    const dx = Math.abs(mx - x1);
    const cp = Math.max(dx * 0.5, 40);
    const d = `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${mx - cp} ${my}, ${mx} ${my}`;
    this._tempPath.setAttribute('d', d);
  }

  _onConnectEnd(node) {
    if (!this._connectFrom || this._connectFrom.id === node.id) return;
    this.addConnector(this._connectFrom.id, node.id);
    this._cancelConnect();
  }

  _cancelConnect() {
    this._connectFrom = null;
    if (this._tempPath) {
      this._tempPath.remove();
      this._tempPath = null;
    }
    this._viewportEl.classList.remove('connecting');
  }

  _select(type, item) {
    this._clearSelection();
    if (type === 'connector') {
      this.selected = { type, conn: item };
      if (item.pathEl) item.pathEl.classList.add('selected');
    } else {
      this.selected = { type, id: item };
      const map = type === 'node' ? this.nodes : this.notes;
      const nodeOrNote = map.get(item);
      if (nodeOrNote?.el) nodeOrNote.el.classList.add('selected');
    }
  }

  _clearSelection() {
    this._canvasEl.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    this._svgEl.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  }

  // ─── Transform ──────────────────────────────────────────────────

  _applyTransform() {
    this._canvasEl.style.transform = `translate(${this.viewport.x}px, ${this.viewport.y}px) scale(${this.viewport.zoom})`;
  }

  _updateZoomDisplay() {
    const el = document.getElementById('zoom-level');
    if (el) el.textContent = `${Math.round(this.viewport.zoom * 100)}%`;
  }

  // ─── Status ─────────────────────────────────────────────────────

  _updateStatus() {
    const el = document.getElementById('status-text');
    if (!el) return;
    const pageCount = this.nodes.size;
    const noteCount = this.notes.size;
    const parts = [`${pageCount} page${pageCount !== 1 ? 's' : ''}`];
    if (noteCount > 0) parts.push(`${noteCount} note${noteCount !== 1 ? 's' : ''}`);
    parts.push('Ready');
    el.textContent = parts.join(' \u00B7 ');

    // Toggle empty state
    if (pageCount === 0 && noteCount === 0) this._showEmptyState();
    else this._hideEmptyState();
  }

  _showEmptyState() {
    if (document.getElementById('empty-state')) return;
    const el = document.createElement('div');
    el.id = 'empty-state';
    el.className = 'empty-state';
    el.innerHTML = `
      <div class="empty-state__title">Start building your flow</div>
      <div class="empty-state__desc">
        Click "+ Add Page" to add pages<br>
        or "Pin Current Tab" to add the active tab
      </div>
    `;
    this._canvasEl.appendChild(el);
  }

  _hideEmptyState() {
    document.getElementById('empty-state')?.remove();
  }

  // ─── Utilities ──────────────────────────────────────────────────

  _esc(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  _urlToLabel(url) {
    try {
      const u = new URL(url);
      const path = u.pathname === '/' ? '' : u.pathname;
      return (u.hostname.replace('www.', '') + path).slice(0, 40);
    } catch {
      return url?.slice(0, 40) || 'Page';
    }
  }

  _shortenUrl(url) {
    try {
      const u = new URL(url);
      return (u.hostname.replace('www.', '') + u.pathname).slice(0, 35);
    } catch {
      return url?.slice(0, 35) || '';
    }
  }

  _emit(event, data) {
    if (this._callbacks[event]) this._callbacks[event](data);
  }

  _screenToCanvas(clientX, clientY) {
    const rect = this._viewportEl.getBoundingClientRect();
    const x = (clientX - rect.left - this.viewport.x) / this.viewport.zoom;
    const y = (clientY - rect.top - this.viewport.y) / this.viewport.zoom;
    return { x, y };
  }

  _showContextMenu(clientX, clientY) {
    this._closeContextMenu();

    const menu = document.createElement('div');
    menu.id = 'canvas-context-menu';
    menu.className = 'canvas-context-menu';
    menu.style.left = `${clientX}px`;
    menu.style.top = `${clientY}px`;

    const addPageItem = document.createElement('div');
    addPageItem.className = 'context-menu-item';
    addPageItem.innerHTML = `<span>➕</span> Add Page`;
    addPageItem.addEventListener('click', (e) => {
      e.stopPropagation();
      const pos = this._screenToCanvas(clientX, clientY);
      this._pendingNodePos = pos;
      
      const popover = document.getElementById('add-page-popover');
      const urlInput = document.getElementById('add-page-url');
      const labelInput = document.getElementById('add-page-label');
      if (popover && urlInput && labelInput) {
        popover.hidden = false;
        urlInput.value = '';
        labelInput.value = '';
        setTimeout(() => urlInput.focus(), 50);
      }
      this._closeContextMenu();
    });

    const addNoteItem = document.createElement('div');
    addNoteItem.className = 'context-menu-item';
    addNoteItem.innerHTML = `<span>📌</span> Add Note`;
    addNoteItem.addEventListener('click', (e) => {
      e.stopPropagation();
      const pos = this._screenToCanvas(clientX, clientY);
      this.addNote(pos.x, pos.y);
      this._closeContextMenu();
    });

    menu.appendChild(addPageItem);
    menu.appendChild(addNoteItem);

    document.body.appendChild(menu);

    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        this._closeContextMenu();
        document.removeEventListener('click', closeMenu);
        document.removeEventListener('contextmenu', closeMenu);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
      document.addEventListener('contextmenu', closeMenu);
    }, 10);
  }

  _closeContextMenu() {
    const existing = document.getElementById('canvas-context-menu');
    if (existing) existing.remove();
  }
}
