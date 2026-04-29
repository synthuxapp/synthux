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
