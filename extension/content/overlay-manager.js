/**
 * synthux — Overlay Manager
 * 
 * Unified overlay system for highlighting, heatmaps, and annotations.
 * Injected into the target page via chrome.scripting.executeScript.
 * All overlays use a single container with proper z-index isolation.
 * 
 * Supported operations:
 * - HIGHLIGHT_ELEMENT: Show red border + tooltip on a single element
 * - CLEAR_HIGHLIGHT: Remove current highlight
 * - SHOW_HEATMAP: Render issue-density heatmap canvas
 * - CLEAR_HEATMAP: Remove heatmap canvas
 * - CLEAR_OVERLAYS: Remove all overlays
 * - GET_ELEMENT_RECTS: Return bounding rects for element selectors
 */

(function () {
  // Prevent multiple injections
  if (window.__synthux_overlay__) return;
  window.__synthux_overlay__ = true;

  const OVERLAY_ID = '__synthux-overlay-root__';
  const HIGHLIGHT_ID = '__synthux-highlight__';
  const TOOLTIP_ID = '__synthux-tooltip__';
  const HEATMAP_ID = '__synthux-heatmap__';

  // ─── Overlay Root ──────────────────────────────────────────────────────────

  function getRoot() {
    let root = document.getElementById(OVERLAY_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = OVERLAY_ID;
      root.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2147483646;
      `;
      document.body.appendChild(root);
    }
    return root;
  }

  // ─── Highlight ─────────────────────────────────────────────────────────────

  function showHighlight(selector, description, severity) {
    clearHighlight();

    let el;
    try {
      el = document.querySelector(selector);
    } catch {
      // Invalid selector — try partial match heuristics
      el = findElementByFuzzySelector(selector);
    }

    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const root = getRoot();

    // Highlight border box
    const highlight = document.createElement('div');
    highlight.id = HIGHLIGHT_ID;

    const severityColors = {
      critical: '#ef4444',
      moderate: '#eab308',
      minor: '#22c55e'
    };
    const color = severityColors[severity] || '#ef4444';

    highlight.style.cssText = `
      position: absolute;
      top: ${rect.top + scrollY - 3}px;
      left: ${rect.left + scrollX - 3}px;
      width: ${rect.width + 6}px;
      height: ${rect.height + 6}px;
      border: 2px solid ${color};
      border-radius: 4px;
      background: ${color}11;
      box-shadow: 0 0 0 4px ${color}22, 0 2px 12px ${color}33;
      pointer-events: none;
      transition: opacity 150ms ease;
      z-index: 2147483646;
    `;
    root.appendChild(highlight);

    // Tooltip
    if (description) {
      const tooltip = document.createElement('div');
      tooltip.id = TOOLTIP_ID;

      // Dot color for severity
      const dotHtml = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;flex-shrink:0;"></span>`;

      tooltip.innerHTML = `${dotHtml}<span>${escapeHtml(description)}</span>`;
      tooltip.style.cssText = `
        position: absolute;
        top: ${rect.top + scrollY - 38}px;
        left: ${rect.left + scrollX}px;
        max-width: 360px;
        padding: 6px 10px;
        background: #111113ee;
        color: #ededf0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        border-radius: 6px;
        border: 1px solid ${color}44;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      // If tooltip would go above viewport, place it below
      if (rect.top < 50) {
        tooltip.style.top = `${rect.bottom + scrollY + 8}px`;
      }

      // If tooltip would go off-screen to the right
      const tooltipWidth = Math.min(description.length * 7 + 40, 360);
      if (rect.left + tooltipWidth > window.innerWidth) {
        tooltip.style.left = `${Math.max(8, window.innerWidth - tooltipWidth - 8 + scrollX)}px`;
      }

      root.appendChild(tooltip);
    }

    // Smooth scroll into view if needed
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function clearHighlight() {
    const highlight = document.getElementById(HIGHLIGHT_ID);
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (highlight) highlight.remove();
    if (tooltip) tooltip.remove();
  }

  // ─── Heatmap ───────────────────────────────────────────────────────────────

  const LEGEND_ID = '__synthux-heatmap-legend__';
  const OUTLINES_ID = '__synthux-heatmap-outlines__';
  const PULSE_STYLE_ID = '__synthux-pulse-style__';

  function showHeatmap(issues) {
    clearHeatmap();

    const root = getRoot();
    const canvas = document.createElement('canvas');
    canvas.id = HEATMAP_ID;

    const docWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      document.documentElement.clientWidth
    );
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.clientHeight
    );

    canvas.width = docWidth;
    canvas.height = docHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${docWidth}px;
      height: ${docHeight}px;
      pointer-events: none;
      z-index: 2147483640;
      opacity: 0.25;
    `;

    root.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Inject pulse animation CSS
    if (!document.getElementById(PULSE_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = PULSE_STYLE_ID;
      style.textContent = `
        @keyframes __synthux-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .__synthux-outline--critical {
          animation: __synthux-pulse 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // Collect element positions
    const rawPoints = [];
    issues.forEach(issue => {
      let el;
      try { el = document.querySelector(issue.element); }
      catch { el = findElementByFuzzySelector(issue.element); }
      if (el) {
        const rect = el.getBoundingClientRect();
        rawPoints.push({
          el, selector: issue.element,
          rectX: rect.left + scrollX, rectY: rect.top + scrollY,
          rectW: rect.width, rectH: rect.height,
          severity: issue.severity, description: issue.description || ''
        });
      }
    });

    // Group by element position
    const groupMap = new Map();
    rawPoints.forEach(p => {
      const key = `${Math.round(p.rectX)}_${Math.round(p.rectY)}_${Math.round(p.rectW)}_${Math.round(p.rectH)}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, { el: p.el, selector: p.selector, rectX: p.rectX, rectY: p.rectY, rectW: p.rectW, rectH: p.rectH, issues: [] });
      }
      groupMap.get(key).issues.push({ severity: p.severity, description: p.description });
    });

    const sevColors = { critical: '#ef4444', moderate: '#eab308', minor: '#22c55e' };
    const sevLabels = { critical: 'Critical', moderate: 'Moderate', minor: 'Minor' };

    const points = Array.from(groupMap.values()).map(g => {
      const hasCritical = g.issues.some(i => i.severity === 'critical');
      const hasModerate = g.issues.some(i => i.severity === 'moderate');
      const severity = hasCritical ? 'critical' : hasModerate ? 'moderate' : 'minor';
      let label = '';
      try {
        const tag = g.el.tagName?.toLowerCase() || '';
        const id = g.el.id ? `#${g.el.id}` : '';
        const cls = g.el.className && typeof g.el.className === 'string' ? '.' + g.el.className.trim().split(/\s+/).slice(0, 1).join('.') : '';
        label = tag + (id || cls || '');
        if (label.length > 24) label = label.slice(0, 24) + '…';
      } catch { label = 'element'; }
      return { ...g, x: g.rectX + g.rectW / 2, y: g.rectY + g.rectH / 2, w: Math.max(g.rectW, 40), h: Math.max(g.rectH, 40), severity, count: g.issues.length, label };
    });

    // Draw gradient spots
    points.forEach(point => {
      const radius = Math.max(point.w, point.h) * 0.5;
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      if (point.severity === 'critical') {
        gradient.addColorStop(0, 'rgba(239,68,68,0.35)'); gradient.addColorStop(0.6, 'rgba(239,68,68,0.08)'); gradient.addColorStop(1, 'rgba(239,68,68,0)');
      } else if (point.severity === 'moderate') {
        gradient.addColorStop(0, 'rgba(234,179,8,0.25)'); gradient.addColorStop(0.6, 'rgba(234,179,8,0.06)'); gradient.addColorStop(1, 'rgba(234,179,8,0)');
      } else {
        gradient.addColorStop(0, 'rgba(34,197,94,0.18)'); gradient.addColorStop(0.6, 'rgba(34,197,94,0.04)'); gradient.addColorStop(1, 'rgba(34,197,94,0)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    });

    // Outlines
    const outlineContainer = document.createElement('div');
    outlineContainer.id = OUTLINES_ID;
    outlineContainer.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:2147483641;';

    points.forEach((point, index) => {
      const color = sevColors[point.severity] || sevColors.minor;
      const outline = document.createElement('div');
      outline.dataset.synthuxIndex = index;
      outline.style.cssText = `
        position:absolute; left:${point.rectX - 2}px; top:${point.rectY - 2}px;
        width:${point.rectW + 4}px; height:${point.rectH + 4}px;
        border:2px dashed ${color}66; border-radius:3px;
        pointer-events:auto; box-sizing:border-box; cursor:pointer;
        transition:all 150ms ease;
      `;
      outline.addEventListener('click', e => { e.stopPropagation(); _navigateToIssue(index); });

      if (point.count > 1) {
        const badge = document.createElement('span');
        badge.style.cssText = `
          position:absolute; top:-8px; right:-8px; min-width:16px; height:16px;
          border-radius:8px; background:${color}; color:#fff; font-size:9px; font-weight:700;
          font-family:-apple-system,system-ui,sans-serif;
          display:flex; align-items:center; justify-content:center; padding:0 4px; pointer-events:none;
        `;
        badge.textContent = point.count;
        outline.appendChild(badge);
      }
      outlineContainer.appendChild(outline);
    });
    root.appendChild(outlineContainer);

    window.__synthux_heatmap_points = points;
    window.__synthux_heatmap_index = -1;

    const totalIssues = points.reduce((s, p) => s + p.count, 0);

    // ─── Toolbar ─────────────────────────────────────────────────────────
    const toolbar = document.createElement('div');
    toolbar.id = LEGEND_ID;
    toolbar.style.cssText = `
      position:fixed; bottom:16px; right:16px; width:280px;
      background:rgba(17,17,19,0.96); backdrop-filter:blur(12px);
      border:1px solid rgba(255,255,255,0.08); border-radius:12px;
      padding:0; z-index:2147483647;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
      color:#ededf0; pointer-events:auto; user-select:none;
      box-shadow:0 8px 32px rgba(0,0,0,0.5);
      overflow:hidden;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'padding:10px 14px 8px; border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;';
    const hTitle = document.createElement('span');
    hTitle.style.cssText = 'font-weight:700;font-size:11px;';
    hTitle.textContent = 'Heatmap';
    const hCount = document.createElement('span');
    hCount.style.cssText = 'font-size:10px;color:#52525b;';
    hCount.textContent = `${totalIssues} issues · ${points.length} elements`;
    header.appendChild(hTitle);
    header.appendChild(hCount);
    toolbar.appendChild(header);

    // Info panel
    const infoPanel = document.createElement('div');
    infoPanel.id = '__synthux-nav-info';
    infoPanel.style.cssText = 'padding:10px 14px;min-height:48px;border-bottom:1px solid rgba(255,255,255,0.06);';
    const infoText = document.createElement('div');
    infoText.style.cssText = 'font-size:11px;color:#52525b;';
    infoText.textContent = 'Click arrows to navigate';
    infoPanel.appendChild(infoText);
    toolbar.appendChild(infoPanel);

    // Nav bar
    const navBar = document.createElement('div');
    navBar.style.cssText = 'display:flex;align-items:center;padding:8px 14px;';

    const btnStyle = `
      width:30px;height:26px;border:1px solid rgba(255,255,255,0.1);border-radius:5px;
      background:transparent;color:#71717a;cursor:pointer;font-size:10px;
      display:flex;align-items:center;justify-content:center;pointer-events:auto;
    `;

    const prevBtn = document.createElement('button');
    prevBtn.id = '__synthux-nav-prev';
    prevBtn.style.cssText = btnStyle;
    prevBtn.textContent = '\u25B2';

    const counter = document.createElement('span');
    counter.id = '__synthux-nav-counter';
    counter.style.cssText = 'flex:1;text-align:center;font-size:11px;color:#52525b;';
    counter.textContent = '\u2014';

    const nextBtn = document.createElement('button');
    nextBtn.id = '__synthux-nav-next';
    nextBtn.style.cssText = btnStyle;
    nextBtn.textContent = '\u25BC';

    navBar.appendChild(prevBtn);
    navBar.appendChild(counter);
    navBar.appendChild(nextBtn);
    toolbar.appendChild(navBar);

    document.body.appendChild(toolbar);

    // Event listeners — directly on button references
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = window.__synthux_heatmap_index;
      const total = (window.__synthux_heatmap_points || []).length;
      if (total === 0) return;
      _navigateToIssue(idx <= 0 ? total - 1 : idx - 1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = window.__synthux_heatmap_index;
      const total = (window.__synthux_heatmap_points || []).length;
      if (total === 0) return;
      _navigateToIssue(idx >= total - 1 ? 0 : idx + 1);
    });
  }

  function _navigateToIssue(index) {
    const points = window.__synthux_heatmap_points || [];
    if (index < 0 || index >= points.length) return;
    window.__synthux_heatmap_index = index;
    const point = points[index];
    if (!point) return;

    const sevColors = { critical: '#ef4444', moderate: '#eab308', minor: '#22c55e' };
    const sevLabels = { critical: 'Critical', moderate: 'Moderate', minor: 'Minor' };
    const sev = point.severity || 'minor';
    const color = sevColors[sev] || sevColors.minor;

    // Always update counter first (so it never gets stuck)
    const counter = document.getElementById('__synthux-nav-counter');
    if (counter) {
      counter.style.color = color;
      counter.textContent = `${index + 1} of ${points.length}`;
    }

    // Scroll to element (safe)
    try {
      if (point.el && typeof point.el.scrollIntoView === 'function') {
        point.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (e) { /* element may be detached */ }

    // Update outlines
    try {
      const container = document.getElementById(OUTLINES_ID);
      if (container) {
        container.querySelectorAll('[data-synthux-index]').forEach(el => {
          const i = parseInt(el.dataset.synthuxIndex);
          const p = points[i];
          const c = sevColors[p?.severity] || sevColors.minor;
          if (i === index) {
            el.style.border = `3px solid ${c}`;
            el.style.boxShadow = `0 0 16px ${c}55, 0 0 4px ${c}`;
          } else {
            el.style.border = `2px dashed ${c}66`;
            el.style.boxShadow = 'none';
          }
        });
      }
    } catch (e) { /* outline update failed */ }

    // Update info panel
    try {
      const info = document.getElementById('__synthux-nav-info');
      if (info) {
        const issues = point.issues || [];
        const desc = (issues[0]?.description || '').toString();
        const shortDesc = desc.length > 70 ? desc.slice(0, 70) + '…' : desc;
        const label = (point.label || 'element').toString();
        const count = point.count || issues.length || 1;
        const moreHtml = count > 1
          ? `<div style="font-size:9px; color:#52525b; margin-top:2px;">+ ${count - 1} more issue${count > 2 ? 's' : ''}</div>`
          : '';
        info.innerHTML = `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:3px;">
            <span style="width:7px;height:7px;border-radius:50%;background:${color};flex-shrink:0;"></span>
            <span style="font-size:10px;font-weight:600;color:${color};">${sevLabels[sev] || 'Issue'}</span>
            <span style="font-size:9px;color:#52525b;font-family:'SF Mono',Monaco,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(label)}</span>
          </div>
          <div style="font-size:11px;color:#a1a1aa;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(shortDesc)}</div>
          ${moreHtml}
        `;
      }
    } catch (e) { /* info panel update failed, counter still updated */ }
  }

  function clearHeatmap() {
    [HEATMAP_ID, OUTLINES_ID, LEGEND_ID, PULSE_STYLE_ID].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    delete window.__synthux_heatmap_points;
    delete window.__synthux_heatmap_index;
  }

  // ─── Element Rects ─────────────────────────────────────────────────────────

  function getElementRects(selectors) {
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    return selectors.map(selector => {
      let el;
      try {
        el = document.querySelector(selector);
      } catch {
        el = findElementByFuzzySelector(selector);
      }

      if (!el) return { selector, found: false };

      const rect = el.getBoundingClientRect();
      return {
        selector,
        found: true,
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        width: rect.width,
        height: rect.height
      };
    });
  }

  // ─── Clear All ─────────────────────────────────────────────────────────────

  function clearAll() {
    clearHighlight();
    clearHeatmap();
    const root = document.getElementById(OVERLAY_ID);
    if (root) root.remove();
  }

  // ─── Fuzzy Selector Matching ───────────────────────────────────────────────
  // AI sometimes returns descriptive selectors like "search input" or
  // "main navigation button". Try to find a reasonable match.

  function findElementByFuzzySelector(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    // Try common patterns
    // "input.search-field" → works directly
    // "search input" → try input[name*="search"], input[placeholder*="search"]
    // "nav button" → try nav button

    // Pattern: "X input" or "X button" or "X link"
    const tagMatch = lower.match(/(\w+)\s+(input|button|link|a|img|form|select|textarea)/);
    if (tagMatch) {
      const keyword = tagMatch[1];
      const tag = tagMatch[2] === 'link' ? 'a' : tagMatch[2];
      const candidates = [
        `${tag}[name*="${keyword}" i]`,
        `${tag}[class*="${keyword}" i]`,
        `${tag}[id*="${keyword}" i]`,
        `${tag}[placeholder*="${keyword}" i]`,
        `${tag}[aria-label*="${keyword}" i]`,
        `.${keyword} ${tag}`,
        `#${keyword} ${tag}`
      ];

      for (const sel of candidates) {
        try {
          const el = document.querySelector(sel);
          if (el) return el;
        } catch { /* invalid selector */ }
      }
    }

    // Try class or id-like patterns
    const cleanedSelector = lower
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_.#\[\]=*"]/g, '');

    try {
      return document.querySelector(`.${cleanedSelector}`) ||
             document.querySelector(`#${cleanedSelector}`) ||
             document.querySelector(`[class*="${cleanedSelector}"]`);
    } catch {
      return null;
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── Message Listener ──────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'HIGHLIGHT_ELEMENT':
        showHighlight(
          message.selector,
          message.description,
          message.severity
        );
        sendResponse({ success: true });
        break;

      case 'CLEAR_HIGHLIGHT':
        clearHighlight();
        sendResponse({ success: true });
        break;

      case 'SHOW_HEATMAP':
        showHeatmap(message.issues || []);
        sendResponse({ success: true });
        break;

      case 'CLEAR_HEATMAP':
        clearHeatmap();
        sendResponse({ success: true });
        break;

      case 'CLEAR_OVERLAYS':
        clearAll();
        sendResponse({ success: true });
        break;

      case 'GET_ELEMENT_RECTS':
        const rects = getElementRects(message.selectors || []);
        sendResponse({ success: true, rects });
        break;

      default:
        return false;
    }
    return false;
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', clearAll);

  console.info('[synthux] Overlay manager injected');
})();
