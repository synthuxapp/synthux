/**
 * synthux — Screenshot Capture
 * 
 * Captures visible tab screenshot via Chrome API.
 * MVP: Used as visual reference in reports.
 * v1.5: Will be sent to multimodal AI for vision analysis.
 */

/**
 * Capture the visible area of a tab as a data URL
 * @param {number} tabId - Target tab ID (null for active tab)
 * @returns {Promise<string>} Base64 PNG data URL
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

    const dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
      format: 'png',
      quality: 90
    });

    return dataUrl;
  } catch (err) {
    console.error('[synthux] Screenshot capture failed:', err);
    return null;
  }
}
