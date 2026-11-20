/**
 * synthux — Main Analyzer Orchestrator
 * 
 * Coordinates the full UX evaluation pipeline:
 * 1. Load heuristic rules
 * 2. For each selected profile → for each heuristic → call AI
 * 3. Aggregate scores and generate report
 */

import { AIClient } from './ai-client.js';
import { loadHeuristics, selectHeuristics, buildPrompt, parseEvaluation, calculateOverallScore } from './heuristics.js';
import { getProfile, getProfileAsync, PROFILES } from './profiles.js';
import { runAccessibilityChecks } from './accessibility.js';
import { generateReport } from './report-generator.js';
import { calculateCost, aggregateCosts } from './cost-calculator.js';
import { checkVisionSupport } from './providers.js';
import { captureAnnotatedScreenshot } from './screenshot.js';
import {
  getActiveBusinessContext,
  getAllDepartments,
  buildBusinessAlignmentPrompt,
  parseBusinessAlignmentResponse,
  buildDeterministicBusinessAlignment
} from './business-context.js';

export class Analyzer {
  constructor(options = {}) {
    this.endpoint = options.endpoint || 'http://localhost:11434';
    this.model = options.model || 'gemma4';
    this.mode = options.mode || 'deep';
    this.rulePackId = options.rulePackId || 'nielsen-10';
    this.profileIds = options.profiles || ['first-time', 'power-user', 'accessibility'];
    this.customHeuristics = options.heuristics || null; // custom mode: array of heuristic IDs
    this.businessContext = options.businessContext || null;
    this.onProgress = options.onProgress || (() => {});
    this.cancelled = false;

    // Multi-provider support
    this.providerId = options.provider || 'ollama';
    this.apiKey = options.apiKey || '';

    this.client = new AIClient(this.endpoint, {
      provider: this.providerId,
      apiKey: this.apiKey,
    });
  }

  /**
   * Run full page analysis
   */
  async analyze(input) {
    const { url, title, pageData, screenshot, timestamp, tabId } = input;

    // Check vision capability before sending screenshots
    const visionSupported = await checkVisionSupport(this.providerId, this.model, this.endpoint);
    const safeScreenshot = visionSupported ? screenshot : null;
    if (screenshot && !visionSupported) {
      console.info(`[synthux] Model "${this.model}" does not support vision — skipping screenshot.`);
    }

    this.cancelled = false;

    // Step 1: Load heuristic rules for selected rule pack & resolve Business Context if enabled
    const rules = await loadHeuristics(this.rulePackId);
    const activeBusinessContext = this.businessContext || await getActiveBusinessContext();
    const allDepartments = await getAllDepartments();
    
    // Step 2: Run deterministic accessibility checks
    this.reportProgress('accessibility', 20, 'Running accessibility checks...');
    const accessibilityResults = runAccessibilityChecks(pageData);

    // Merge axe-core results if available
    if (pageData.axeResults) {
      const axe = pageData.axeResults;
      accessibilityResults.wcagViolations = axe.violations || [];
      accessibilityResults.wcagPasses = axe.passes || 0;
      accessibilityResults.wcagIncomplete = axe.incomplete || [];

      // Recalculate score: blend rule-based + axe
      const axeViolationCount = axe.violations?.length || 0;
      const axePassCount = axe.passes || 0;
      const axeTotal = axeViolationCount + axePassCount;
      if (axeTotal > 0) {
        const axeScore = Math.round((axePassCount / axeTotal) * 100);
        // Weighted blend: 40% rule-based, 60% axe-core
        accessibilityResults.score = Math.round(
          accessibilityResults.score * 0.4 + axeScore * 0.6
        );
      }
    }

    // Instant WCAG & DOM Quick Check Mode (No AI wait — completes in ~1s)
    if (this.mode === 'wcag-only') {
      const instantIssues = [
        ...(accessibilityResults.checks || [])
          .filter(c => c.status === 'fail' || c.status === 'warning')
          .map(c => ({
            severity: c.status === 'fail' ? 'critical' : 'moderate',
            priority: c.status === 'fail' ? 'high' : 'medium',
            fixEffort: 'easy',
            isQuickWin: c.status === 'fail',
            description: `${c.name}: ${c.message}`,
            element: '',
            recommendation: `Resolve ${c.name} issue in DOM markup.`,
            heuristic: 'WCAG 2.2 AA & DOM Health',
            profile: 'Accessibility & DOM Scanner'
          })),
        ...(accessibilityResults.wcagViolations || []).map(v => ({
          severity: v.impact === 'critical' || v.impact === 'serious' ? 'critical' : 'moderate',
          priority: v.impact === 'critical' || v.impact === 'serious' ? 'high' : 'medium',
          fixEffort: 'easy',
          isQuickWin: v.impact === 'critical' || v.impact === 'serious',
          description: `${v.help}: ${v.description}`,
          element: v.nodes?.[0]?.target?.[0] || v.nodes?.[0]?.target || '',
          recommendation: v.helpUrl ? `Fix WCAG violation (${v.id}). Reference: ${v.helpUrl}` : `Fix WCAG violation (${v.id}).`,
          heuristic: 'axe-core WCAG 2.2 AA',
          profile: 'Accessibility & DOM Scanner'
        }))
      ];

      const businessAlignment = activeBusinessContext
        ? buildDeterministicBusinessAlignment(activeBusinessContext, pageData, allDepartments)
        : null;

      let annotatedScreenshot = null;
      if (instantIssues.length > 0 && tabId) {
        try {
          annotatedScreenshot = await captureAnnotatedScreenshot(tabId, instantIssues);
        } catch {}
      }

      const instantReport = generateReport({
        url,
        title,
        timestamp,
        model: 'axe-core + DOM Engine',
        mode: 'wcag-only',
        provider: 'local',
        rulePackId: rules.id || this.rulePackId,
        rulePackName: 'Instant WCAG 2.2 AA & DOM Quick Audit',
        rulePackShortName: 'Instant WCAG',
        ruleCount: (accessibilityResults.checks || []).length,
        overallScore: accessibilityResults.score,
        profileResults: {
          accessibility: {
            profile: { id: 'accessibility', icon: '♿', name: { en: 'Instant WCAG & DOM' }, description: { en: 'Deterministic 1-second audit' } },
            score: accessibilityResults.score,
            evaluations: [
              {
                heuristicId: 'wcag-instant',
                heuristicName: { en: 'WCAG 2.2 AA & DOM Checks' },
                score: accessibilityResults.score,
                summary: `${accessibilityResults.passCount} checks passed, ${accessibilityResults.warnCount} warnings, ${accessibilityResults.failCount} failures, ${(accessibilityResults.wcagViolations || []).length} axe-core WCAG violations.`,
                issues: instantIssues,
                positives: (accessibilityResults.checks || []).filter(c => c.status === 'pass').map(c => `${c.name}: ${c.message}`)
              }
            ]
          }
        },
        accessibilityResults,
        businessContext: activeBusinessContext || null,
        businessAlignment,
        issues: instantIssues,
        screenshot,
        annotatedScreenshot,
        costSummary: { isLocal: true, totalTokens: 0, totalCost: 0, formatted: 'Free — Instant DOM & WCAG ✓' }
      });

      this.reportProgress('complete', 100, 'Instant WCAG audit complete!');
      return instantReport;
    }

    // Step 3: Run AI evaluation for each profile
    const profileResults = {};
    const totalProfiles = this.profileIds.length;

    for (let pi = 0; pi < totalProfiles; pi++) {
      if (this.cancelled) throw new Error('Analysis cancelled');

      const profileId = this.profileIds[pi];
      const profile = await getProfileAsync(profileId);
      console.info(`[synthux] Profile ${pi + 1}/${totalProfiles}: "${profileId}" → ${profile ? 'loaded' : 'NOT FOUND'}`);
      if (!profile) continue;

      let heuristics;
      if (this.customHeuristics && this.customHeuristics.length > 0) {
        // Custom mode: filter by selected heuristic IDs
        const allRules = rules.rules || [];
        heuristics = allRules.filter(r => this.customHeuristics.includes(r.id));
        if (heuristics.length === 0) heuristics = allRules.slice(0, 3); // fallback
      } else {
        heuristics = selectHeuristics(rules, this.mode, profileId);
      }
      const totalHeuristics = heuristics.length;
      console.info(`[synthux] → ${totalHeuristics} heuristics selected for mode="${this.mode}"`);
      const evaluations = [];

      for (let hi = 0; hi < totalHeuristics; hi++) {
        if (this.cancelled) throw new Error('Analysis cancelled');

        const heuristic = heuristics[hi];
        const overallPercent = 25 + ((pi * totalHeuristics + hi) / (totalProfiles * totalHeuristics)) * 65;

        this.reportProgress(
          'analyzing',
          Math.round(overallPercent),
          `${profile.name.en}: ${heuristic.name.en}`,
          {
            profile: profile.name.en,
            profileIcon: profile.icon,
            heuristic: heuristic.name.en,
            profileIndex: pi + 1,
            totalProfiles,
            heuristicIndex: hi + 1,
            totalHeuristics
          }
        );

        // Build and send prompt (with vision instructions & business context if enabled)
        const prompt = buildPrompt(heuristic, profile, pageData, !!safeScreenshot, activeBusinessContext);

        try {
          console.info(`[synthux] → Calling AI: ${heuristic.name.en} (model: ${this.model}, provider: ${this.providerId}, vision: ${!!safeScreenshot})`);
          const response = await this.client.evaluate(prompt, {
            model: this.model,
            systemPrompt: profile.systemPrompt,
            temperature: 0.3,
            format: 'json',
            images: safeScreenshot ? [safeScreenshot] : []
          });

          if (response.success) {
            const evaluation = parseEvaluation(response.result);
            evaluations.push({
              heuristicId: heuristic.id,
              heuristicName: heuristic.name,
              ...evaluation,
              _meta: response.meta || {}
            });
            console.info(`[synthux] → ✓ Score: ${evaluation.score}, Issues: ${evaluation.issues.length}`);
          } else {
            console.warn(`[synthux] → ✗ AI returned error: ${response.error}`);

            // CORS error from Ollama — abort entire analysis immediately,
            // no point running 11 more calls that will all fail the same way
            if (response.errorType === 'cors') {
              const corsError = new Error(response.error);
              corsError.type = 'cors';
              throw corsError;
            }

            // AI call failed — add fallback
            evaluations.push({
              heuristicId: heuristic.id,
              heuristicName: heuristic.name,
              score: 50,
              summary: `Unable to evaluate: ${response.error || 'Unknown error'}`,
              issues: [],
              positives: [],
              scoreJustification: 'Default score — AI evaluation failed'
            });
          }
        } catch (err) {
          // Re-throw CORS errors — they must escape the loop to abort analysis
          if (err.type === 'cors') throw err;

          console.error(`[synthux] → ✗ Evaluation exception for ${heuristic.id}:`, err);
          evaluations.push({
            heuristicId: heuristic.id,
            heuristicName: heuristic.name,
            score: 50,
            summary: `Evaluation error: ${err.message}`,
            issues: [],
            positives: [],
            scoreJustification: 'Default score — evaluation error'
          });
        }
      }

      // Calculate profile score
      const profileScore = calculateOverallScore(evaluations, rules);

      profileResults[profileId] = {
        profile: {
          id: profile.id,
          icon: profile.icon,
          name: profile.name,
          description: profile.description,
          // Custom profile metadata (if applicable)
          custom: profile.custom || false,
          ageRange: profile.ageRange || null,
          techLevel: profile.techLevel || null,
          disabilities: profile.disabilities || null,
          goal: profile.goal || null
        },
        score: profileScore,
        evaluations
      };
    }

    // Step 4: Calculate overall score (average of all profiles)
    const allScores = Object.values(profileResults).map(r => r.score);
    const overallScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // Step 5: Aggregate all issues
    const allIssues = [];
    Object.values(profileResults).forEach(pr => {
      pr.evaluations.forEach(ev => {
        ev.issues.forEach(issue => {
          allIssues.push({
            ...issue,
            heuristic: ev.heuristicName.en,
            profile: pr.profile.name.en,
            profileIcon: pr.profile.icon
          });
        });
      });
    });

    // Smart deduplicate and sort issues by severity
    const sortedIssues = deduplicateIssues(allIssues);

    // Step 6: Calculate costs — aggregate token usage from ALL API calls
    const costResults = [];
    Object.values(profileResults).forEach(pr => {
      pr.evaluations.forEach(ev => {
        if (ev._meta) {
          costResults.push({
            inputTokens: ev._meta.inputTokens || 0,
            outputTokens: ev._meta.outputTokens || 0,
            thinkingTokens: ev._meta.thinkingTokens || 0,
          });
        }
      });
    });

    // Debug: Log total API calls and token usage
    const totalInput = costResults.reduce((s, c) => s + c.inputTokens, 0);
    const totalOutput = costResults.reduce((s, c) => s + c.outputTokens, 0);
    const totalThinking = costResults.reduce((s, c) => s + (c.thinkingTokens || 0), 0);
    console.info(`[synthux] Cost summary: ${costResults.length} API calls, ${totalInput.toLocaleString()} input + ${totalOutput.toLocaleString()} output${totalThinking ? ` (incl. ${totalThinking.toLocaleString()} thinking)` : ''} = ${(totalInput + totalOutput).toLocaleString()} total tokens`);

    let costSummary = null;
    try {
      const costs = await Promise.all(
        costResults.map(c => calculateCost(this.model, c.inputTokens, c.outputTokens, this.providerId))
      );
      costSummary = aggregateCosts(costs);
      console.info(`[synthux] Estimated cost: ${costSummary.formatted}`);
    } catch {
      // Cost calculation failed — non-critical
    }

    // Step 6.5: Evaluate Business Goal Alignment, Must-Haves & Department Lenses (if enabled)
    let businessAlignment = null;
    if (activeBusinessContext && !this.cancelled) {
      this.reportProgress('analyzing', 90, `Evaluating Business Goals & Must-Haves (${activeBusinessContext.name})...`);
      try {
        const alignPrompt = buildBusinessAlignmentPrompt(
          activeBusinessContext,
          JSON.stringify({
            url,
            title,
            headings: (pageData.structure?.headings || []).slice(0, 12),
            ctas: pageData.content?.ctas || [],
            forms: pageData.structure?.forms || [],
            topIssues: sortedIssues.slice(0, 8).map(i => ({ severity: i.severity, description: i.description, element: i.element }))
          }),
          allDepartments
        );
        const alignRes = await this.client.evaluate(alignPrompt, {
          model: this.model,
          systemPrompt: 'You are a Principal Product & UX Strategist. Respond with valid JSON only.',
          temperature: 0.2,
          format: 'json'
        });
        if (alignRes?.success) {
          businessAlignment = parseBusinessAlignmentResponse(alignRes.result, activeBusinessContext, pageData, allDepartments);
          if (alignRes.meta) {
            costResults.push({
              inputTokens: alignRes.meta.inputTokens || 0,
              outputTokens: alignRes.meta.outputTokens || 0,
              thinkingTokens: alignRes.meta.thinkingTokens || 0
            });
          }
        } else {
          businessAlignment = buildDeterministicBusinessAlignment(activeBusinessContext, pageData, allDepartments);
        }
      } catch {
        businessAlignment = buildDeterministicBusinessAlignment(activeBusinessContext, pageData, allDepartments);
      }
    }

    // Step 7: Capture annotated viewport screenshot (non-blocking fallback) and generate report
    this.reportProgress('generating', 94, 'Generating report...');

    let annotatedScreenshot = null;
    if (sortedIssues.length > 0) {
      try {
        annotatedScreenshot = await captureAnnotatedScreenshot(tabId, sortedIssues);
      } catch (e) {
        console.warn('[synthux] Could not capture annotated screenshot:', e.message);
      }
    }

    const report = generateReport({
      url,
      title,
      timestamp,
      model: this.model,
      mode: this.mode,
      provider: this.providerId,
      rulePackId: rules.id || this.rulePackId,
      rulePackName: rules.name || "Nielsen's 10 Usability Heuristics",
      rulePackShortName: rules.shortName || 'Nielsen 10',
      ruleCount: (rules.rules || []).length,
      overallScore,
      profileResults,
      accessibilityResults,
      businessContext: activeBusinessContext || null,
      businessAlignment,
      issues: sortedIssues,
      screenshot,
      annotatedScreenshot,
      costSummary
    });

    this.reportProgress('complete', 100, 'Analysis complete!');

    return report;
  }

  /**
   * Cancel ongoing analysis
   */
  cancel() {
    this.cancelled = true;
    this.client.cancel();
  }

  /**
   * Report progress to callback
   */
  reportProgress(phase, percent, message, details = {}) {
    this.onProgress({
      phase,
      percent,
      message,
      ...details
    });
  }
}

// ─── Smart Deduplication ─────────────────────────────────────────────────────

/**
 * Deduplicate issues using element + normalized description fingerprinting.
 * Groups semantically similar issues across profiles and heuristics.
 * Sorts: Quick Wins first → Critical → by severity → by confirmation count
 */
function deduplicateIssues(issues) {
  const severityOrder = { critical: 0, moderate: 1, minor: 2 };
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const grouped = new Map();

  issues.forEach(issue => {
    // Create fingerprint: element selector + normalized description keywords
    const fingerprint = createFingerprint(issue);

    if (grouped.has(fingerprint)) {
      const existing = grouped.get(fingerprint);
      existing.seenCount++;

      // Keep the more severe version
      if (severityOrder[issue.severity] < severityOrder[existing.severity]) {
        existing.severity = issue.severity;
        existing.description = issue.description;
        existing.recommendation = issue.recommendation;
      }

      // Keep higher priority and easier fix
      if ((priorityOrder[issue.priority] || 1) < (priorityOrder[existing.priority] || 1)) {
        existing.priority = issue.priority;
      }
      if (issue.fixEffort === 'easy' && existing.fixEffort !== 'easy') {
        existing.fixEffort = issue.fixEffort;
      }

      // Keep the best code fix (prefer one that has before+after)
      if (issue.codeFix && (!existing.codeFix || (!existing.codeFix.before && issue.codeFix.before))) {
        existing.codeFix = issue.codeFix;
      }

      // Track which profiles/heuristics found this
      if (!existing.foundIn.includes(issue.profile)) {
        existing.foundIn.push(issue.profile);
      }
    } else {
      grouped.set(fingerprint, {
        ...issue,
        seenCount: 1,
        foundIn: [issue.profile]
      });
    }
  });

  // Tag Quick Wins
  const results = Array.from(grouped.values()).map(issue => ({
    ...issue,
    isQuickWin: issue.priority === 'high' && issue.fixEffort === 'easy'
  }));

  // Sort: Quick Wins → severity → seenCount
  return results.sort((a, b) => {
    // Quick wins always first
    if (a.isQuickWin && !b.isQuickWin) return -1;
    if (!a.isQuickWin && b.isQuickWin) return 1;

    const sevDiff = (severityOrder[a.severity] || 1) - (severityOrder[b.severity] || 1);
    if (sevDiff !== 0) return sevDiff;
    return b.seenCount - a.seenCount; // More confirmations = higher priority
  });
}

/**
 * Create a deduplication fingerprint from issue data.
 * Uses element + key description words to catch semantically similar issues.
 */
function createFingerprint(issue) {
  const element = normalizeElement(issue.element || '');
  const descWords = extractKeywords(issue.description || '');
  return `${element}::${descWords}`;
}

/**
 * Normalize element selectors for comparison
 */
function normalizeElement(element) {
  return element
    .toLowerCase()
    .replace(/\[.*?\]/g, '') // Remove attribute selectors
    .replace(/\d+/g, '#')    // Normalize numbers
    .replace(/\s+/g, ' ')
    .trim()
    || 'general';
}

/**
 * Extract 4 most significant keywords from description
 * Removes stop words & normalizes for comparison
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall',
    'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where',
    'this', 'that', 'these', 'those', 'it', 'its',
    'for', 'of', 'in', 'on', 'at', 'to', 'from', 'by', 'with',
    'not', 'no', 'nor', 'very', 'too', 'also', 'just',
    'any', 'some', 'all', 'each', 'every', 'both', 'few', 'more',
    'other', 'such', 'only', 'same', 'than', 'so'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Take the first 4 significant words as fingerprint
  return words.slice(0, 4).sort().join('-') || 'unknown';
}
