/**
 * synthux — Main Analyzer Orchestrator
 * 
 * Coordinates the full UX evaluation pipeline:
 * 1. Load heuristic rules
 * 2. For each selected profile → for each heuristic → call AI
 * 3. Aggregate scores and generate report
 */

import { OllamaClient } from './ai-client.js';
import { loadHeuristics, selectHeuristics, buildPrompt, parseEvaluation, calculateOverallScore } from './heuristics.js';
import { getProfile, PROFILES } from './profiles.js';
import { runAccessibilityChecks } from './accessibility.js';
import { generateReport } from './report-generator.js';

export class Analyzer {
  constructor(options = {}) {
    this.endpoint = options.endpoint || 'http://localhost:11434';
    this.model = options.model || 'gemma4:31b';
    this.mode = options.mode || 'deep';
    this.profileIds = options.profiles || ['first-time', 'power-user', 'accessibility'];
    this.onProgress = options.onProgress || (() => {});
    this.cancelled = false;

    this.client = new OllamaClient(this.endpoint);
  }

  /**
   * Run full page analysis
   */
  async analyze(input) {
    const { url, title, pageData, screenshot, timestamp } = input;

    this.cancelled = false;

    // Step 1: Load heuristic rules
    const rules = await loadHeuristics();
    
    // Step 2: Run deterministic accessibility checks
    this.reportProgress('accessibility', 20, 'Running accessibility checks...');
    const accessibilityResults = runAccessibilityChecks(pageData);

    // Step 3: Run AI evaluation for each profile
    const profileResults = {};
    const totalProfiles = this.profileIds.length;

    for (let pi = 0; pi < totalProfiles; pi++) {
      if (this.cancelled) throw new Error('Analysis cancelled');

      const profileId = this.profileIds[pi];
      const profile = getProfile(profileId);
      if (!profile) continue;

      const heuristics = selectHeuristics(rules, this.mode, profileId);
      const totalHeuristics = heuristics.length;
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

        // Build and send prompt
        const prompt = buildPrompt(heuristic, profile, pageData);

        try {
          const response = await this.client.evaluate(prompt, {
            model: this.model,
            systemPrompt: profile.systemPrompt,
            temperature: 0.3,
            format: 'json'
          });

          if (response.success) {
            const evaluation = parseEvaluation(response.result);
            evaluations.push({
              heuristicId: heuristic.id,
              heuristicName: heuristic.name,
              ...evaluation
            });
          } else {
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
          console.error(`[synthux] Evaluation failed for ${heuristic.id}:`, err);
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
          description: profile.description
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

    // Step 6: Generate report object
    this.reportProgress('generating', 92, 'Generating report...');

    const report = generateReport({
      url,
      title,
      timestamp,
      model: this.model,
      mode: this.mode,
      overallScore,
      profileResults,
      accessibilityResults,
      issues: sortedIssues,
      screenshot
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
 */
function deduplicateIssues(issues) {
  const severityOrder = { critical: 0, moderate: 1, minor: 2 };
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

  // Sort by severity, then by seenCount (issues found by more profiles = more important)
  return Array.from(grouped.values()).sort((a, b) => {
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
