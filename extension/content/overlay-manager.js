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
      opacity: 0.6;
    `;

    root.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Collect element positions with severity weights
    const points = [];
    issues.forEach(issue => {
      let el;
      try {
        el = document.querySelector(issue.element);
      } catch {
        el = findElementByFuzzySelector(issue.element);
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        const weight = issue.severity === 'critical' ? 1.0 :
                       issue.severity === 'moderate' ? 0.6 : 0.3;
        points.push({
          x: rect.left + scrollX + rect.width / 2,
          y: rect.top + scrollY + rect.height / 2,
          w: Math.max(rect.width, 40),
          h: Math.max(rect.height, 40),
          weight,
          severity: issue.severity
        });
      }
    });

    // Draw heatmap spots
    points.forEach(point => {
      const radius = Math.max(point.w, point.h) * 0.8;
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );

      if (point.severity === 'critical') {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        gradient.addColorStop(0.4, 'rgba(239, 68, 68, 0.20)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else if (point.severity === 'moderate') {
        gradient.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
        gradient.addColorStop(0.4, 'rgba(234, 179, 8, 0.15)');
        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.20)');
        gradient.addColorStop(0.4, 'rgba(34, 197, 94, 0.08)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(
        point.x - radius, point.y - radius,
        radius * 2, radius * 2
      );
    });
  }

  function clearHeatmap() {
    const canvas = document.getElementById(HEATMAP_ID);
    if (canvas) canvas.remove();
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
