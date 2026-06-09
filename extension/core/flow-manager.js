/**
 * synthux — Flow Manager
 * 
 * Orchestrates sequential multi-page scanning and journey analysis.
 * Rather than analyzing pages individually, it captures pages sequentially and performs a whole-journey assessment.
 */

import { AIClient } from './ai-client.js';
import { captureScreenshot } from './screenshot.js';
import { getProfileAsync } from './profiles.js';
import { checkVisionSupport } from './providers.js';

export class FlowManager {
  constructor(options = {}) {
    this.options = options;
    this.cancelled = false;
    this.onProgress = options.onProgress || (() => {});
    this.onPageComplete = options.onPageComplete || (() => {});
    this._analyzeTabId = null;
  }

  cancel() {
    this.cancelled = true;
    // Clean up background tab
    if (this._analyzeTabId) {
      chrome.tabs.remove(this._analyzeTabId).catch(() => {});
      this._analyzeTabId = null;
    }
  }

  /**
   * Run full flow analysis
   */
  async analyzeFlow({ pages, connectors, notes, settings, profiles, mode, sourceTabId }) {
    this.cancelled = false;
    const scannedPages = [];

    // Create a background tab for analysis
    const analyzeTab = await chrome.tabs.create({
      url: 'about:blank',
      active: false
    });
    this._analyzeTabId = analyzeTab.id;

    try {
      for (let i = 0; i < pages.length; i++) {
        if (this.cancelled) break;

        const page = pages[i];

        // Report progress: navigating
        this.onProgress({
          pageId: page.id,
          pageIndex: i,
          totalPages: pages.length,
          phase: 'navigating',
          message: `Opening ${page.label}...`
        });

        // Navigate to page and make active so we can capture screenshot
        await chrome.tabs.update(analyzeTab.id, { url: page.url, active: true });
        await this._waitForLoad(analyzeTab.id);

        if (this.cancelled) break;

        // Report progress: scanning
        this.onProgress({
          pageId: page.id,
          pageIndex: i,
          totalPages: pages.length,
          phase: 'scanning',
          message: `Scanning ${page.label}...`
        });

        // Inject content script and extract DOM
        await this._injectContentScript(analyzeTab.id);
        const pageData = await this._extractDOM(analyzeTab.id);

        if (this.cancelled) break;

        // Capture screenshot for thumbnail
        let screenshot = null;
        try {
          screenshot = await captureScreenshot(analyzeTab.id);
        } catch (err) {
          console.warn('[flow] Screenshot failed for', page.url, err.message);
        }

        if (this.cancelled) break;

        // Save page details
        scannedPages.push({
          id: page.id,
          url: page.url,
          label: page.label,
          pageData,
          screenshot
        });

        // Report page scan complete (with screenshot thumbnail)
        this.onPageComplete({
          pageId: page.id,
          pageIndex: i,
          totalPages: pages.length,
          score: undefined,
          report: undefined,
          thumbnail: screenshot
        });
      }
    } finally {
      // Clean up background tab
      try {
        await chrome.tabs.remove(analyzeTab.id);
      } catch { /* tab may already be closed */ }
      this._analyzeTabId = null;

      // Reactivate Flow Builder tab
      if (sourceTabId) {
        chrome.tabs.update(sourceTabId, { active: true }).catch(() => {});
      }
    }

    if (this.cancelled) {
      return { error: 'Analysis cancelled' };
    }

    // Now run journey-focused AI analysis
    this.onProgress({
      pageId: null,
      pageIndex: pages.length,
      totalPages: pages.length,
      phase: 'journey',
      message: 'Running whole-journey flow analysis...'
    });

    let aiResult = null;
    let aiError = null;
    try {
      aiResult = await this._analyzeJourney(scannedPages, connectors, notes, settings, profiles);
    } catch (err) {
      console.error('[flow] Journey analysis failed:', err);
      aiError = err.message || err;
    }

    if (!aiResult) {
      return {
        error: aiError || 'AI evaluation returned an empty or invalid response. Please verify that your AI provider settings are correct and the model is running.'
      };
    }

    const finalPages = pages.map(page => {
      const aiPage = aiResult.pages?.find(p => p.id === page.id);
      const scannedInfo = scannedPages.find(s => s.id === page.id);
      
      const score = aiPage ? aiPage.score : 50;
      const report = {
        overallScore: score,
        summary: aiPage ? aiPage.summary : 'No summary.',
        issues: aiPage?.issues ? aiPage.issues.map(issueText => ({
          title: issueText,
          description: issueText,
          severity: 'moderate'
        })) : []
      };

      return {
        page,
        report,
        score,
        thumbnail: scannedInfo?.thumbnail || null
      };
    });

    const enrichedNotes = (notes || []).map(n => {
      const node = pages.find(p => p.id === n.attachedTo);
      return { ...n, attachedToLabel: node?.label || null };
    });

    return {
      type: 'flow',
      flowScore: aiResult.flowScore || 50,
      pages: finalPages,
      crossPage: aiResult.crossPage || { score: 50, findings: [] },
      transitions: aiResult.transitions || [],
      notes: enrichedNotes,
      connectors,
      timestamp: new Date().toISOString()
    };
  }

  // ─── Journey Analysis ───────────────────────────────────────────

  async _analyzeJourney(steps, connectors, notes, settings, profileIds) {
    const client = new AIClient(settings.ollamaEndpoint, {
      provider: settings.providerId,
      apiKey: settings.apiKey
    });

    // Load profile definitions
    const profiles = [];
    if (profileIds && profileIds.length > 0) {
      for (const pid of profileIds) {
        const p = await getProfileAsync(pid);
        if (p) profiles.push(p);
      }
    }

    const profilesContext = profiles.length > 0
      ? profiles.map(p => `### Profile: ${p.name.en} (${p.icon})\nPerspective:\n${p.systemPrompt}`).join('\n\n')
      : 'Standard user perspective.';

    // Generate summaries for each step
    const stepsContext = steps.map((s, idx) => {
      const domSummary = this._summarizePageData(s.pageData);
      return `Step ${idx + 1} (Page ID: "${s.id}"):
- Label: ${s.label}
- URL: ${s.url}
- DOM Summary:
${domSummary}`;
    }).join('\n\n');

    // Generate connectors context
    const connectorsContext = connectors.map((c, idx) => {
      const fromPage = steps.find(s => s.id === c.fromId);
      const toPage = steps.find(s => s.id === c.toId);
      return `- Transition ${idx + 1}: From "${fromPage?.label || c.fromId}" (ID: ${c.fromId}) to "${toPage?.label || c.toId}" (ID: ${c.toId})`;
    }).join('\n');

    // Generate notes context
    const notesContext = notes && notes.length > 0
      ? notes.map(n => {
          const page = steps.find(s => s.id === n.attachedTo);
          return `- Note: "${n.text}"${page ? ` (attached to page "${page.label}", ID: ${n.attachedTo})` : ''}`;
        }).join('\n')
      : 'None';

    const prompt = `You are a UX evaluation expert analyzing a multi-page user journey (flow).

## User Journey Details

### Steps / Pages
${stepsContext}

### Transitions / Connectors
${connectorsContext || 'None (no transitions between pages defined)'}

### User Context & Sticky Notes
${notesContext}

## User Persona Perspectives / Profiles
You must evaluate this user journey from the perspectives of the following user profiles. Consider how each profile experiences the pages and transitions:

${profilesContext}

## Evaluation Criteria

Evaluate this flow as a unified user journey along 4 main dimensions:
1. Navigation Consistency — Are global headers, footers, and menus identical/logical across all steps?
2. Visual & Brand Consistency — Are design tokens, typography, form styles, and spacing cohesive?
3. Flow Logic & Progression — Is it clear where to go next? Are there dead ends, friction-filled gates, or missing back routes?
4. Terminology Consistency — Do fields, labels, buttons, and terms mean the same thing in every step?

Also evaluate each page for its own friction score in the context of this journey.
Also evaluate each transition connector to determine if it is "smooth" (logical progression, low friction), "friction" (some confusion or extra steps), or "high-friction" (broken flow, missing links, or severe visual deviation).

## Response Requirements
You must respond with ONLY a valid JSON object. Do NOT include markdown fences, comments, or any other wrapper text.

### Required JSON Structure:
{
  "flowScore": <0-100 overall score for the journey>,
  "pages": [
    {
      "id": "<page ID, e.g. n1>",
      "score": <0-100 step score, where 100 means no friction at all>,
      "summary": "<1-2 sentence summary of step usability>",
      "issues": [
        "<issue description 1>",
        "<issue description 2>"
      ]
    }
  ],
  "transitions": [
    {
      "fromId": "<source page ID>",
      "toId": "<target page ID>",
      "quality": "smooth|friction|high-friction",
      "description": "<detailed assessment of the transition quality and logic>"
    }
  ],
  "crossPage": {
    "score": <0-100 consistency score>,
    "findings": [
      {
        "title": "<finding title, e.g., Visual Inconsistency>",
        "description": "<detailed finding description>",
        "severity": "critical|moderate|minor"
      }
    ]
  }
}`;

    // Dynamically check if the selected model supports vision (image input)
    const isVisionSupported = await checkVisionSupport(
      settings.providerId,
      settings.ollamaModel,
      settings.ollamaEndpoint
    );
    console.info(`[flow] Vision support for "${settings.ollamaModel}": ${isVisionSupported}`);

    // Resize screenshots to reduce payload — full-page stitched JPEGs can be enormous
    let images = [];
    if (isVisionSupported) {
      const rawScreenshots = steps.map(s => s.screenshot).filter(Boolean);
      console.info(`[flow] Found ${rawScreenshots.length} screenshot(s) to send`);

      for (const dataUrl of rawScreenshots) {
        try {
          const resized = await this._resizeScreenshot(dataUrl, 800, 600);
          images.push(resized);
        } catch (err) {
          console.warn('[flow] Screenshot resize failed, using original:', err.message);
          images.push(dataUrl);
        }
      }
      console.info(`[flow] Prepared ${images.length} image(s) for AI (resized to max 800×600)`);
    } else {
      console.info('[flow] Vision not supported, sending text-only prompt');
    }

    // Use higher token limit for flow analysis — JSON response is large
    const maxTokens = settings.providerId === 'ollama' ? 8192 : 4096;

    try {
      console.info(`[flow] Sending AI request (provider: ${settings.providerId}, model: ${settings.ollamaModel}, images: ${images.length}, maxTokens: ${maxTokens})`);
      const startTime = Date.now();

      const response = await client.evaluate(prompt, {
        model: settings.ollamaModel,
        systemPrompt: 'You are a UX user journey analyst. Respond only in valid JSON.',
        temperature: 0.3,
        format: 'json',
        images,
        maxTokens
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.info(`[flow] AI response received in ${elapsed}s`);

      // Check for AI-level errors
      if (response && response.success === false) {
        console.error('[flow] AI returned error:', response.error);
        this.onProgress({
          pageId: null,
          pageIndex: 0,
          totalPages: steps.length,
          phase: 'error',
          message: `AI error: ${response.error}`
        });
        return null;
      }

      const parsed = this._parseJsonResponse(response);
      if (!parsed) {
        console.error('[flow] Failed to parse AI response as JSON. Raw response:', JSON.stringify(response).substring(0, 500));
        this.onProgress({
          pageId: null,
          pageIndex: 0,
          totalPages: steps.length,
          phase: 'error',
          message: 'AI returned invalid JSON — try a different model or check Ollama logs'
        });
      } else {
        console.info(`[flow] Parsed result: flowScore=${parsed.flowScore}, pages=${parsed.pages?.length}, transitions=${parsed.transitions?.length}`);
      }
      return parsed;
    } catch (err) {
      console.error('[flow] AI evaluation failed:', err);
      this.onProgress({
        pageId: null,
        pageIndex: 0,
        totalPages: steps.length,
        phase: 'error',
        message: `AI call failed: ${err.message}`
      });
      return null;
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────

  _summarizePageData(pageData) {
    if (!pageData) return 'No DOM data available.';
    const parts = [];

    // Meta
    if (pageData.meta) {
      parts.push(`**Page Title:** ${pageData.meta.title || 'None'}`);
      parts.push(`**Language:** ${pageData.meta.lang || 'Not set'}`);
      parts.push(`**Description:** ${pageData.meta.description || 'None'}`);
    }

    // Structure
    if (pageData.structure) {
      const { headings, landmarks, forms } = pageData.structure;
      parts.push(`\n**Headings:** ${headings?.length || 0} total`);
      if (headings?.length > 0) {
        const h1Count = headings.filter(h => h.level === 1).length;
        parts.push(`  - H1 count: ${h1Count}`);
        const headingOrder = headings.map(h => `H${h.level}`).join(' → ');
        parts.push(`  - Order: ${headingOrder}`);
      }
      parts.push(`**Landmarks:** ${landmarks?.length || 0} (${landmarks?.map(l => l.role).join(', ') || 'none'})`);
      parts.push(`**Forms:** ${forms?.length || 0}`);
      if (forms?.length > 0) {
        forms.forEach((f, i) => {
          parts.push(`  Form ${i + 1}: ${f.fields?.length || 0} fields, submit button: ${f.hasSubmitButton ? 'yes' : 'no'}`);
          const unlabeled = f.fields?.filter(field => !field.label).length || 0;
          if (unlabeled > 0) parts.push(`    ${unlabeled} fields without labels`);
        });
      }
    }

    // Navigation
    if (pageData.navigation) {
      parts.push(`\n**Navigation:**`);
      parts.push(`  - Nav elements: ${pageData.navigation.navCount || 0}`);
      parts.push(`  - Menu depth: ${pageData.navigation.mainMenu?.depth || 0}`);
      parts.push(`  - Breadcrumbs: ${pageData.navigation.breadcrumb ? 'yes' : 'no'}`);
      parts.push(`  - Skip links: ${pageData.navigation.skipLinks ? 'yes' : 'no'}`);
      parts.push(`  - Search: ${pageData.navigation.hasSearch ? 'yes' : 'no'}`);
    }

    // Content
    if (pageData.content) {
      parts.push(`\n**Content:**`);
      parts.push(`  - Text length: ${pageData.content.textLength || 0} chars, ${pageData.content.wordCount || 0} words`);
      parts.push(`  - Images: ${pageData.content.imageCount || 0} total, ${pageData.content.imagesWithoutAlt || 0} without alt text`);
      parts.push(`  - CTAs: ${pageData.content.ctas?.length || 0}`);
      parts.push(`  - Links: ${pageData.content.internalLinks || 0} internal, ${pageData.content.externalLinks || 0} external`);
    }

    // Accessibility
    if (pageData.accessibility) {
      parts.push(`\n**Accessibility:**`);
      parts.push(`  - ARIA roles used: ${pageData.accessibility.ariaRoles?.join(', ') || 'none'}`);
      parts.push(`  - Tab order issues: ${pageData.accessibility.tabOrderIssues?.length || 0}`);
      parts.push(`  - Lang attribute: ${pageData.accessibility.hasLangAttr ? 'yes' : 'no'}`);
      parts.push(`  - Unlabeled interactive elements: ${pageData.accessibility.unlabeledInteractives?.length || 0}`);
    }

    return parts.join('\n');
  }

  _parseJsonResponse(response) {
    if (!response) return null;
    
    // Check for AI client level failures
    if (typeof response === 'object' && (response.success === false || response.error) && !response.result) {
      console.error('[flow] AI Client returned failure:', response.error || response.message);
      return null;
    }

    // Extract result
    let result = response;
    if (typeof response === 'object' && response.result !== undefined) {
      result = response.result;
    }

    // If result is an object with 'raw' property (e.g., fallback wrapper from provider.parseResponse),
    // extract it as text to run our robust clean-up and parsing logic.
    let text = null;
    if (result && typeof result === 'object') {
      if (result.raw !== undefined) {
        text = result.raw;
      } else {
        // If it's already a successfully parsed object containing required structure, return it
        if (result.flowScore !== undefined || result.pages !== undefined) {
          return result;
        }
        // Otherwise, serialize it to try parsing again or extract text
        text = JSON.stringify(result);
      }
    } else {
      text = String(result);
    }

    try {
      if (!text) return null;

      // Clean up markdown code fences if present
      let cleanText = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

      // Find JSON block matching {...}
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(cleanText);
    } catch (err) {
      console.error('[flow] JSON parsing failed:', err, response);
      return null;
    }
  }

  async _waitForLoad(tabId, timeout = 30000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(); // proceed even on timeout
      }, timeout);

      const listener = (updatedTabId, changeInfo) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          // Extra delay for dynamic content
          setTimeout(resolve, 1500);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
  }

  async _injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/content-script.js']
      });
    } catch (err) {
      console.warn('[flow] Content script injection failed:', err.message);
    }
  }

  async _extractDOM(tabId) {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_DOM' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('[flow] DOM extraction failed:', chrome.runtime.lastError.message);
          resolve({});
        } else {
          resolve(response || {});
        }
      });
    });
  }

  /**
   * Resize a base64 data URL screenshot to fit within maxWidth × maxHeight.
   * Uses OffscreenCanvas (available in service workers).
   * Returns a new base64 data URL (JPEG, quality 60%).
   */
  async _resizeScreenshot(dataUrl, maxWidth = 800, maxHeight = 600) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const bmp = await createImageBitmap(blob);

    let w = bmp.width;
    let h = bmp.height;

    // Calculate scale to fit within max dimensions
    const scale = Math.min(1, maxWidth / w, maxHeight / h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();

    const outBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.6 });

    // Convert blob to data URL
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(outBlob);
    });
  }
}
