/**
 * synthux — Accessibility Checks (Rule-Based, No AI)
 * 
 * Deterministic accessibility checks that run on extracted DOM data.
 * These produce reliable, consistent results without AI.
 */

/**
 * Run all accessibility checks on extracted page data
 */
export function runAccessibilityChecks(pageData) {
  const checks = [];

  // 1. Alt Text Check
  checks.push(checkAltText(pageData));

  // 2. Heading Hierarchy Check
  checks.push(checkHeadingHierarchy(pageData));

  // 3. Color Contrast Check
  checks.push(checkColorContrast(pageData));

  // 4. Form Labels Check
  checks.push(checkFormLabels(pageData));

  // 5. Language Attribute Check
  checks.push(checkLanguageAttribute(pageData));

  // 6. Skip Navigation Check
  checks.push(checkSkipNavigation(pageData));

  // 7. ARIA Landmarks Check
  checks.push(checkLandmarks(pageData));

  // 8. Tab Order Check
  checks.push(checkTabOrder(pageData));

  // 9. Focus Indicators Check
  checks.push(checkFocusIndicators(pageData));

  // 10. Unlabeled Interactive Elements Check
  checks.push(checkInteractiveLabels(pageData));

  // Calculate overall accessibility score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const totalChecks = checks.length;

  const score = Math.round(
    ((passCount * 100) + (warnCount * 50) + (failCount * 0)) / totalChecks
  );

  return {
    score,
    passCount,
    warnCount,
    failCount,
    totalChecks,
    checks
  };
}

// ─── Individual Checks ───────────────────────────────────────────────────────

function checkAltText(pageData) {
  const images = pageData.content?.images || [];
  const total = images.length;
  const withAlt = images.filter(i => i.hasAlt).length;
  const withoutAlt = images.filter(i => !i.hasAlt).length;

  if (total === 0) {
    return {
      id: 'alt-text',
      name: 'Image Alt Text',
      status: 'pass',
      message: 'No images found on page',
      details: { total: 0, withAlt: 0, withoutAlt: 0 }
    };
  }

  const ratio = withAlt / total;

  return {
    id: 'alt-text',
    name: 'Image Alt Text',
    status: ratio >= 1 ? 'pass' : ratio >= 0.8 ? 'warning' : 'fail',
    message: `${withAlt}/${total} images have alt text (${Math.round(ratio * 100)}%)`,
    details: {
      total,
      withAlt,
      withoutAlt,
      missingElements: images
        .filter(i => !i.hasAlt)
        .slice(0, 5)
        .map(i => i.src?.substring(0, 80))
    }
  };
}

function checkHeadingHierarchy(pageData) {
  const headings = pageData.structure?.headings || [];

  if (headings.length === 0) {
    return {
      id: 'heading-hierarchy',
      name: 'Heading Hierarchy',
      status: 'warning',
      message: 'No headings found on page',
      details: { headings: [] }
    };
  }

  const issues = [];

  // Check H1 count
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push('No H1 heading found');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
  }

  // Check for skipped levels
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      issues.push(`Heading level skipped: H${prev} → H${curr} (expected H${prev + 1})`);
    }
  }

  return {
    id: 'heading-hierarchy',
    name: 'Heading Hierarchy',
    status: issues.length === 0 ? 'pass' : issues.length <= 1 ? 'warning' : 'fail',
    message: issues.length === 0
      ? `${headings.length} headings in correct order`
      : `${issues.length} heading issues found`,
    details: {
      headingCount: headings.length,
      h1Count,
      issues,
      structure: headings.map(h => `H${h.level}: ${h.text.substring(0, 60)}`)
    }
  };
}

function checkColorContrast(pageData) {
  const results = pageData.accessibility?.contrastResults || [];

  if (results.length === 0) {
    return {
      id: 'color-contrast',
      name: 'Color Contrast (WCAG AA)',
      status: 'warning',
      message: 'Unable to sample color contrast',
      details: { sampled: 0 }
    };
  }

  const passing = results.filter(r => r.passes).length;
  const failing = results.filter(r => !r.passes).length;
  const ratio = passing / results.length;

  return {
    id: 'color-contrast',
    name: 'Color Contrast (WCAG AA)',
    status: ratio >= 1 ? 'pass' : ratio >= 0.8 ? 'warning' : 'fail',
    message: `${passing}/${results.length} sampled elements pass WCAG AA`,
    details: {
      sampled: results.length,
      passing,
      failing,
      failingElements: results
        .filter(r => !r.passes)
        .slice(0, 5)
        .map(r => ({
          element: r.element,
          ratio: r.ratio,
          required: r.required
        }))
    }
  };
}

function checkFormLabels(pageData) {
  const forms = pageData.structure?.forms || [];

  if (forms.length === 0) {
    return {
      id: 'form-labels',
      name: 'Form Field Labels',
      status: 'pass',
      message: 'No forms found on page',
      details: { formCount: 0 }
    };
  }

  let totalFields = 0;
  let labeledFields = 0;
  const unlabeledFields = [];

  forms.forEach(form => {
    (form.fields || []).forEach(field => {
      // Skip hidden and submit fields
      if (field.type === 'hidden' || field.type === 'submit') return;
      totalFields++;
      if (field.label) {
        labeledFields++;
      } else {
        unlabeledFields.push(`${field.type}${field.name ? `[name="${field.name}"]` : ''}`);
      }
    });
  });

  if (totalFields === 0) {
    return {
      id: 'form-labels',
      name: 'Form Field Labels',
      status: 'pass',
      message: 'No input fields found',
      details: { formCount: forms.length, totalFields: 0 }
    };
  }

  const ratio = labeledFields / totalFields;

  return {
    id: 'form-labels',
    name: 'Form Field Labels',
    status: ratio >= 1 ? 'pass' : ratio >= 0.8 ? 'warning' : 'fail',
    message: `${labeledFields}/${totalFields} form fields have labels`,
    details: {
      formCount: forms.length,
      totalFields,
      labeledFields,
      unlabeledFields: unlabeledFields.slice(0, 10)
    }
  };
}

function checkLanguageAttribute(pageData) {
  const hasLang = pageData.accessibility?.hasLangAttr;

  return {
    id: 'lang-attribute',
    name: 'Language Attribute',
    status: hasLang ? 'pass' : 'fail',
    message: hasLang
      ? `Page language is set to "${pageData.meta?.lang}"`
      : 'No lang attribute on <html> element',
    details: { lang: pageData.meta?.lang || null }
  };
}

function checkSkipNavigation(pageData) {
  const hasSkip = pageData.navigation?.skipLinks;

  return {
    id: 'skip-nav',
    name: 'Skip Navigation',
    status: hasSkip ? 'pass' : 'warning',
    message: hasSkip
      ? 'Skip navigation link found'
      : 'No skip navigation link detected',
    details: {}
  };
}

function checkLandmarks(pageData) {
  const landmarks = pageData.structure?.landmarks || [];
  const roles = landmarks.map(l => l.role);

  const hasMain = roles.includes('main');
  const hasNav = roles.includes('navigation');
  const hasBanner = roles.includes('banner');

  const issues = [];
  if (!hasMain) issues.push('No <main> or role="main" landmark');
  if (!hasNav) issues.push('No <nav> or role="navigation" landmark');

  return {
    id: 'landmarks',
    name: 'ARIA Landmarks',
    status: issues.length === 0 ? 'pass' : issues.length === 1 ? 'warning' : 'fail',
    message: `${landmarks.length} landmarks found (${roles.join(', ') || 'none'})`,
    details: {
      landmarkCount: landmarks.length,
      roles,
      hasMain,
      hasNav,
      hasBanner,
      issues
    }
  };
}

function checkTabOrder(pageData) {
  const issues = pageData.accessibility?.tabOrderIssues || [];

  return {
    id: 'tab-order',
    name: 'Tab Order',
    status: issues.length === 0 ? 'pass' : 'warning',
    message: issues.length === 0
      ? 'No positive tabindex values found'
      : `${issues.length} elements use positive tabindex (disrupts natural order)`,
    details: {
      issues: issues.slice(0, 5)
    }
  };
}

function checkFocusIndicators(pageData) {
  const focusInfo = pageData.accessibility?.focusIndicators || {};

  return {
    id: 'focus-indicators',
    name: 'Focus Indicators',
    status: focusInfo.removesOutlines ? 'fail' : 'pass',
    message: focusInfo.note || 'Unable to check focus indicators',
    details: focusInfo
  };
}

function checkInteractiveLabels(pageData) {
  const unlabeled = pageData.accessibility?.unlabeledInteractives || [];

  return {
    id: 'interactive-labels',
    name: 'Interactive Element Labels',
    status: unlabeled.length === 0 ? 'pass' : unlabeled.length <= 3 ? 'warning' : 'fail',
    message: unlabeled.length === 0
      ? 'All interactive elements have accessible names'
      : `${unlabeled.length} interactive elements lack accessible names`,
    details: {
      unlabeledCount: unlabeled.length,
      elements: unlabeled.slice(0, 10)
    }
  };
}
