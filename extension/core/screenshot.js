/**
 * synthux — Screenshot Capture
 * 
 * Captures full-page screenshot via Chrome API by scrolling through
 * the page in viewport-sized chunks and stitching them.
 * 
 * v1.6: Full-page JPEG capture for multimodal AI vision analysis.
 */

/**
 * Capture the visible viewport of a tab as a JPEG data URL
 * @param {number} windowId - Window to capture
 * @returns {Promise<string>} Base64 JPEG data URL
 */
async function captureViewport(windowId) {
  return chrome.tabs.captureVisibleTab(windowId, {
    format: 'jpeg',
    quality: 70
  });
}

/**
 * Capture full page by scrolling and stitching viewport captures.
 * Falls back to single viewport capture on any error.
 * 
 * @param {number} tabId - Target tab ID
 * @returns {Promise<string|null>} Base64 JPEG data URL or null
 */
export async function captureScreenshot(tabId) {
  try {
    // Get the tab's window ID
    let windowId;
    if (tabId) {
      const tab = await chrome.tabs.get(tabId);
      windowId = tab.windowId;
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      windowId = tab?.windowId;
    }

    if (!windowId) {
      throw new Error('Could not determine window ID');
    }

    // Get page dimensions from content script
    let pageDims;
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => ({
          scrollHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
          viewportWidth: window.innerWidth,
          currentScroll: window.scrollY
        })
      });
      pageDims = result?.result;
    } catch {
      // Fallback: single viewport capture
      return captureViewport(windowId);
    }

    if (!pageDims || pageDims.scrollHeight <= pageDims.viewportHeight * 1.2) {
      // Page fits in viewport (or nearly) — single capture
      return captureViewport(windowId);
    }

    // Full page: scroll and capture chunks (max 3 to respect Chrome rate limit)
    const { scrollHeight, viewportHeight, viewportWidth, currentScroll } = pageDims;
    const maxCaptures = 3;
    const step = Math.max(viewportHeight, Math.ceil(scrollHeight / maxCaptures));
    const positions = [];
    for (let y = 0; y < scrollHeight; y += step) {
      positions.push(y);
      if (positions.length >= maxCaptures) break;
    }

    const captures = [];
    for (const scrollY of positions) {
      // Scroll to position
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (y) => window.scrollTo(0, y),
        args: [scrollY]
      });

      // Wait for render + respect captureVisibleTab rate limit (max 2/sec)
      await new Promise(r => setTimeout(r, 600));

      // Capture viewport
      const dataUrl = await captureViewport(windowId);
      captures.push(dataUrl);
    }

    // Restore original scroll position
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (y) => window.scrollTo(0, y),
      args: [currentScroll]
    });

    if (captures.length <= 1) {
      return captures[0] || null;
    }

    // Stitch captures into a single image using OffscreenCanvas
    try {
      const stitched = await stitchCaptures(captures, viewportWidth, viewportHeight, scrollHeight);
      return stitched;
    } catch (err) {
      console.warn('[synthux] Stitch failed, using first capture:', err);
      return captures[0];
    }
  } catch (err) {
    console.error('[synthux] Screenshot capture failed:', err);
    return null;
  }
}

/**
 * Stitch multiple viewport captures into one tall image
 */
async function stitchCaptures(dataUrls, width, viewportHeight, totalHeight) {
  // Load all images
  const blobs = await Promise.all(
    dataUrls.map(async (url) => {
      const res = await fetch(url);
      return res.blob();
    })
  );
  const bitmaps = await Promise.all(blobs.map(b => createImageBitmap(b)));

  // Calculate actual total height
  const actualHeight = Math.min(totalHeight, viewportHeight * bitmaps.length);

  // Create offscreen canvas
  const canvas = new OffscreenCanvas(width, actualHeight);
  const ctx = canvas.getContext('2d');

  // Draw each capture
  const step = actualHeight / bitmaps.length;
  bitmaps.forEach((bmp, i) => {
    ctx.drawImage(bmp, 0, Math.round(i * step), width, viewportHeight);
  });

  // Convert to JPEG blob and then to data URL
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Capture a viewport screenshot with numbered annotation markers at issue locations.
 * Requires overlay-manager.js to be injected in the tab for GET_ELEMENT_RECTS.
 * 
 * @param {number} tabId - Target tab ID
 * @param {Array} issues - Array of { element, severity, description } objects
 * @returns {Promise<string|null>} Base64 JPEG data URL with annotations, or null
 */
export async function captureAnnotatedScreenshot(tabId, issues) {
  try {
    if (!issues || issues.length === 0) return null;

    // Get the tab's window ID
    let windowId;
    if (tabId) {
      const tab = await chrome.tabs.get(tabId);
      windowId = tab.windowId;
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      windowId = tab?.windowId;
      tabId = tab?.id;
    }
    if (!windowId || !tabId) return null;

    // Inject overlay manager for GET_ELEMENT_RECTS
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/overlay-manager.js']
    });

    // Get element bounding rects from the page
    const selectors = issues
      .map(i => i.element)
      .filter(Boolean);

    if (selectors.length === 0) return null;

    const rectsResponse = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, {
        type: 'GET_ELEMENT_RECTS',
        selectors
      }, (response) => {
        resolve(response?.rects || []);
      });
    });

    const foundRects = rectsResponse.filter(r => r.found);
    if (foundRects.length === 0) return null;

    // Get viewport dimensions
    const [dimResult] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => ({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        dpr: window.devicePixelRatio || 1
      })
    });
    const dims = dimResult?.result;
    if (!dims) return null;

    // Capture current viewport
    const screenshotDataUrl = await captureViewport(windowId);
    if (!screenshotDataUrl) return null;

    // Draw annotations onto screenshot
    const res = await fetch(screenshotDataUrl);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);

    // Scale factor (DPR might affect coordinates)
    const scaleX = bitmap.width / dims.viewportWidth;
    const scaleY = bitmap.height / dims.viewportHeight;

    // Draw markers for each found element
    let markerIndex = 1;
    foundRects.forEach((rect) => {
      const issue = issues.find(i => i.element === rect.selector);
      if (!issue) return;

      // Convert page coordinates to viewport-relative
      const x = (rect.x - window.scrollX) * scaleX;
      const y = (rect.y - dims.scrollY) * scaleY;
      const w = rect.width * scaleX;
      const h = rect.height * scaleY;

      // Only annotate visible elements
      if (y + h < 0 || y > bitmap.height || x + w < 0 || x > bitmap.width) return;

      // Severity colors
      const colors = {
        critical: '#ef4444',
        moderate: '#eab308',
        minor: '#22c55e'
      };
      const color = colors[issue.severity] || '#ef4444';

      // Draw rectangle border
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, w, h);

      // Draw semi-transparent fill
      ctx.fillStyle = color + '15';
      ctx.fillRect(x, y, w, h);

      // Draw numbered marker circle
      const markerRadius = 12;
      const markerX = x + w - markerRadius;
      const markerY = y - markerRadius;

      ctx.beginPath();
      ctx.arc(markerX, markerY, markerRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Marker number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(markerIndex), markerX, markerY);

      markerIndex++;
    });

    // Convert annotated canvas to JPEG
    const annotatedBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(annotatedBlob);
    });
  } catch (err) {
    console.error('[synthux] Annotated screenshot failed:', err);
    return null;
  }
}

