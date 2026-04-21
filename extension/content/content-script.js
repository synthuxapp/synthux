/**
 * synthux — Content Script
 * 
 * Injected into the active page to extract DOM data for UX analysis.
 * Runs in the page context and communicates with the Service Worker via messages.
 * 
 * Collected data:
 * - Meta tags (title, description, lang, viewport, OG)
 * - DOM structure (headings, landmarks, forms)
 * - Navigation (menus, breadcrumbs, footer links, skip links)
 * - Content (text, images, CTAs, links)
 * - Accessibility (ARIA, tab order, color contrast, focus indicators)
 * - Performance metrics (DOM size, resource counts)
 */

// Prevent multiple injections
if (window.__synthux_injected__) {
  // Already injected — just listen for new messages
} else {
  window.__synthux_injected__ = true;

  // ─── Message Listener ──────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACT_DOM') {
      try {
        const data = extractPageData();
        sendResponse(data);
      } catch (err) {
        sendResponse({ error: err.message });
      }
    }
    return false; // synchronous response
  });
}

// ─── Main Extraction ─────────────────────────────────────────────────────────

function extractPageData() {
  return {
    meta: extractMeta(),
    structure: extractStructure(),
    navigation: extractNavigation(),
    content: extractContent(),
    accessibility: extractAccessibility(),
    performance: extractPerformance()
  };
}

// ─── Meta Information ────────────────────────────────────────────────────────

function extractMeta() {
  const getMeta = (name) => {
    const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return el?.getAttribute('content') || null;
  };

  return {
    title: document.title || null,
    description: getMeta('description'),
    lang: document.documentElement.lang || null,
    viewport: getMeta('viewport'),
    charset: document.characterSet || null,
    ogTags: {
      title: getMeta('og:title'),
      description: getMeta('og:description'),
      image: getMeta('og:image'),
      type: getMeta('og:type'),
      url: getMeta('og:url')
    },
    canonical: document.querySelector('link[rel="canonical"]')?.href || null,
    favicon: document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.href || null
  };
}

// ─── DOM Structure ───────────────────────────────────────────────────────────

function extractStructure() {
  // Headings
  const headings = [];
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h, index) => {
    headings.push({
      level: parseInt(h.tagName[1]),
      text: h.textContent.trim().substring(0, 200),
      order: index
    });
  });

  // ARIA landmarks
  const landmarks = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  
  // Check role attributes
  landmarkRoles.forEach(role => {
    document.querySelectorAll(`[role="${role}"]`).forEach(el => {
      landmarks.push({
        role,
        label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || null,
        tag: el.tagName.toLowerCase()
      });
    });
  });

  // Check semantic HTML elements that are implicit landmarks
  const semanticLandmarks = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo'
  };

  Object.entries(semanticLandmarks).forEach(([tag, role]) => {
    document.querySelectorAll(tag).forEach(el => {
      if (!el.getAttribute('role')) {
        landmarks.push({
          role,
          label: el.getAttribute('aria-label') || null,
          tag
        });
      }
    });
  });

  // Forms
  const forms = [];
  document.querySelectorAll('form').forEach(form => {
    const fields = [];
    form.querySelectorAll('input, select, textarea').forEach(field => {
      const label = findLabelForField(field);
      fields.push({
        type: field.type || field.tagName.toLowerCase(),
        name: field.name || null,
        label: label,
        required: field.required || field.getAttribute('aria-required') === 'true',
        hasValidation: field.pattern || field.minLength > 0 || field.maxLength < Infinity || field.min || field.max,
        placeholder: field.placeholder || null,
        ariaDescribedBy: field.getAttribute('aria-describedby') || null
      });
    });

    forms.push({
      action: form.action || null,
      method: form.method || 'get',
      fields,
      hasSubmitButton: !!form.querySelector('[type="submit"], button:not([type="button"])'),
      hasErrorDisplay: !!form.querySelector('[role="alert"], .error, .invalid, .form-error')
    });
  });

  return { headings, landmarks, forms };
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function extractNavigation() {
  // Main navigation
  const navs = document.querySelectorAll('nav, [role="navigation"]');
  const mainMenu = { items: [], depth: 0 };

  if (navs.length > 0) {
    const primaryNav = navs[0]; // assume first nav is primary
    const { items, maxDepth } = extractMenuItems(primaryNav);
    mainMenu.items = items;
    mainMenu.depth = maxDepth;
  }

  // Breadcrumbs
  const breadcrumb = !!(
    document.querySelector('[aria-label*="breadcrumb" i]') ||
    document.querySelector('[role="navigation"][aria-label*="breadcrumb" i]') ||
    document.querySelector('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]') ||
    document.querySelector('ol[itemtype*="BreadcrumbList"]')
  );

  // Footer links
  const footer = document.querySelector('footer, [role="contentinfo"]');
  const footerLinks = [];
  if (footer) {
    footer.querySelectorAll('a[href]').forEach(a => {
      footerLinks.push({
        text: a.textContent.trim().substring(0, 100),
        href: a.href
      });
    });
  }

  // Skip navigation
  const skipLinks = !!(
    document.querySelector('a[href="#main"], a[href="#content"], a.skip-link, a.skip-nav, [class*="skip"]')
  );

  // Search functionality
  const hasSearch = !!(
    document.querySelector('[role="search"]') ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('input[name*="search" i], input[name*="query" i], input[name="q"]')
  );

  return {
    navCount: navs.length,
    mainMenu,
    breadcrumb,
    footerLinks: footerLinks.slice(0, 30), // limit
    skipLinks,
    hasSearch
  };
}

// ─── Content ─────────────────────────────────────────────────────────────────

function extractContent() {
  // Text content length
  const bodyText = document.body?.innerText || '';
  const textLength = bodyText.length;
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  // Images
  const images = [];
  document.querySelectorAll('img').forEach(img => {
    images.push({
      src: img.src?.substring(0, 200) || null,
      alt: img.alt || null,
      hasAlt: img.hasAttribute('alt'),
      isDecorative: img.getAttribute('role') === 'presentation' || img.alt === '',
      width: img.naturalWidth || img.width || null,
      height: img.naturalHeight || img.height || null
    });
  });

  // CTAs (buttons and prominent links)
  const ctas = [];
  document.querySelectorAll('button, [role="button"], a.btn, a.button, a[class*="cta"], input[type="submit"]').forEach(el => {
    ctas.push({
      text: el.textContent.trim().substring(0, 100),
      type: el.tagName.toLowerCase(),
      tag: el.tagName.toLowerCase(),
      isDisabled: el.disabled || el.getAttribute('aria-disabled') === 'true',
      hasIcon: !!el.querySelector('svg, img, i, [class*="icon"]')
    });
  });

  // Links
  const allLinks = document.querySelectorAll('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;
  const currentHost = window.location.hostname;

  allLinks.forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname === currentHost) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    } catch {
      internalLinks++;
    }
  });

  return {
    textLength,
    wordCount,
    images: images.slice(0, 50), // limit
    imageCount: images.length,
    imagesWithoutAlt: images.filter(i => !i.hasAlt).length,
    ctas: ctas.slice(0, 20),
    internalLinks,
    externalLinks,
    totalLinks: allLinks.length
  };
}

// ─── Accessibility ───────────────────────────────────────────────────────────

function extractAccessibility() {
  // ARIA roles
  const ariaRoles = [];
  document.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (!ariaRoles.includes(role)) {
      ariaRoles.push(role);
    }
  });

  // Tab order issues
  const tabOrderIssues = [];
  document.querySelectorAll('[tabindex]').forEach(el => {
    const tabindex = parseInt(el.getAttribute('tabindex'));
    if (tabindex > 0) {
      tabOrderIssues.push({
        element: describeElement(el),
        tabindex,
        issue: 'Positive tabindex disrupts natural tab order'
      });
    }
  });

  // Color contrast sampling (check key text elements)
  const contrastResults = sampleColorContrast();

  // Focus indicators
  const focusIndicators = checkFocusIndicators();

  // Interactive elements without accessible names
  const unlabeledInteractives = [];
  document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]').forEach(el => {
    const name = getAccessibleName(el);
    if (!name) {
      unlabeledInteractives.push({
        element: describeElement(el),
        tag: el.tagName.toLowerCase(),
        type: el.type || null
      });
    }
  });

  // Language attribute
  const hasLangAttr = !!document.documentElement.lang;

  return {
    ariaRoles,
    tabOrderIssues: tabOrderIssues.slice(0, 10),
    contrastResults: contrastResults.slice(0, 20),
    focusIndicators,
    unlabeledInteractives: unlabeledInteractives.slice(0, 20),
    hasLangAttr,
    hasSkipNav: !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link'),
    totalInteractiveElements: document.querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"]').length
  };
}

// ─── Performance ─────────────────────────────────────────────────────────────

function extractPerformance() {
  return {
    domSize: document.querySelectorAll('*').length,
    htmlSize: document.documentElement.outerHTML.length,
    imageCount: document.querySelectorAll('img').length,
    scriptCount: document.querySelectorAll('script').length,
    styleSheetCount: document.styleSheets.length,
    iframeCount: document.querySelectorAll('iframe').length,
    hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
    loadingState: {
      hasLoadingIndicators: !!(
        document.querySelector('[class*="loading"]') ||
        document.querySelector('[class*="spinner"]') ||
        document.querySelector('[aria-busy="true"]') ||
        document.querySelector('[role="progressbar"]')
      ),
      hasProgressBars: !!document.querySelector('progress, [role="progressbar"]'),
      hasSkeletons: !!document.querySelector('[class*="skeleton"]')
    }
  };
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function findLabelForField(field) {
  // Check for explicit label via for/id
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.textContent.trim().substring(0, 100);
  }

  // Check for wrapping label
  const parentLabel = field.closest('label');
  if (parentLabel) return parentLabel.textContent.trim().substring(0, 100);

  // Check aria-label
  if (field.getAttribute('aria-label')) return field.getAttribute('aria-label');

  // Check aria-labelledby
  const labelledBy = field.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent.trim().substring(0, 100);
  }

  return null;
}

function extractMenuItems(navElement, depth = 0) {
  let maxDepth = depth;
  const items = [];

  const links = navElement.querySelectorAll(':scope > ul > li, :scope > ol > li, :scope > a, :scope > div > a');
  
  links.forEach(item => {
    const link = item.tagName === 'A' ? item : item.querySelector('a');
    if (link) {
      const entry = {
        text: link.textContent.trim().substring(0, 100),
        href: link.href,
        depth
      };

      // Check for submenus
      const submenu = item.querySelector('ul, ol, [role="menu"]');
      if (submenu) {
        const sub = extractMenuItems(submenu, depth + 1);
        entry.children = sub.items;
        maxDepth = Math.max(maxDepth, sub.maxDepth);
      }

      items.push(entry);
    }
  });

  return { items: items.slice(0, 30), maxDepth };
}

function describeElement(el) {
  let desc = el.tagName.toLowerCase();
  if (el.id) desc += `#${el.id}`;
  if (el.className && typeof el.className === 'string') {
    desc += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
  }
  const text = el.textContent?.trim().substring(0, 50);
  if (text) desc += ` "${text}"`;
  return desc;
}

function getAccessibleName(el) {
  // aria-label
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  // aria-labelledby
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent.trim();
  }

  // Text content (for buttons, links)
  const text = el.textContent?.trim();
  if (text) return text;

  // title attribute
  const title = el.getAttribute('title');
  if (title) return title.trim();

  // alt for images inside
  const img = el.querySelector('img[alt]');
  if (img?.alt) return img.alt.trim();

  // value for inputs
  if (el.value) return el.value.trim();

  // placeholder
  if (el.placeholder) return el.placeholder.trim();

  return null;
}

function sampleColorContrast() {
  const results = [];
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, li');
  
  // Sample up to 20 elements
  const sample = Array.from(textElements).slice(0, 20);

  sample.forEach(el => {
    try {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = getEffectiveBackgroundColor(el);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight) || 400;

      if (color && bgColor) {
        const ratio = calculateContrastRatio(parseColor(color), parseColor(bgColor));
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const requiredRatio = isLargeText ? 3.0 : 4.5;

        results.push({
          element: describeElement(el),
          foreground: color,
          background: bgColor,
          ratio: Math.round(ratio * 100) / 100,
          passes: ratio >= requiredRatio,
          required: requiredRatio,
          isLargeText
        });
      }
    } catch {
      // Skip elements that can't be analyzed
    }
  });

  return results;
}

function getEffectiveBackgroundColor(el) {
  let current = el;
  while (current && current !== document.documentElement) {
    const bg = window.getComputedStyle(current).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    current = current.parentElement;
  }
  return 'rgb(255, 255, 255)'; // default white
}

function parseColor(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
  }
  return { r: 0, g: 0, b: 0 };
}

function calculateContrastRatio(fg, bg) {
  const lum1 = relativeLuminance(fg);
  const lum2 = relativeLuminance(bg);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function checkFocusIndicators() {
  // Can't fully test this without user interaction, but check for
  // CSS rules that remove outlines
  let removesOutlines = false;

  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.cssText && rule.cssText.includes('outline') && 
              (rule.cssText.includes('outline: none') || rule.cssText.includes('outline: 0'))) {
            if (rule.selectorText && 
                (rule.selectorText.includes(':focus') || rule.selectorText === '*')) {
              removesOutlines = true;
              break;
            }
          }
        }
      } catch {
        // Cross-origin stylesheets can't be read
      }
      if (removesOutlines) break;
    }
  } catch {
    // Stylesheet access might fail
  }

  return {
    removesOutlines,
    hasFocusVisibleStyles: !!document.querySelector('style, link[rel="stylesheet"]'), // Can't check this reliably
    note: removesOutlines 
      ? 'Warning: CSS rules detected that remove focus outlines'
      : 'No obvious focus indicator removal detected'
  };
}
