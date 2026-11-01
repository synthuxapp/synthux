/**
 * synthux — Report Generator (Enhanced Reporting v2.0)
 * 
 * Produces structured reports in multiple formats:
 * 1. Interactive object (for Side Panel UI & PDF rendering)
 * 2. Rich Markdown (GitHub / Notion / Jira ready, with KPI dashboard, 2×2 Priority Matrix, score bars & collapsible code fixes)
 * 3. JSON (programmatic access)
 */

/**
 * Generate a complete report object from analysis results
 */
export function generateReport(data) {
  const {
    url,
    title,
    timestamp,
    model,
    mode,
    provider,
    rulePackId = 'nielsen-10',
    rulePackName = "Nielsen's 10 Usability Heuristics",
    rulePackShortName = 'Nielsen 10',
    ruleCount = 10,
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    screenshot,
    annotatedScreenshot = null,
    costSummary
  } = data;

  return {
    version: '2.0.0',
    url,
    title,
    timestamp,
    model,
    mode,
    provider: provider || 'ollama',
    rulePackId,
    rulePackName,
    rulePackShortName,
    ruleCount,
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    annotatedScreenshot: annotatedScreenshot || null,
    visionEnabled: !!screenshot,
    costSummary: costSummary || null,
    markdown: generateMarkdown(data),
    json: generateJSON(data)
  };
}

/**
 * Generate Enhanced Markdown report for clipboard/export
 */
function generateMarkdown(data) {
  const {
    url,
    title,
    timestamp,
    model,
    mode,
    rulePackName = "Nielsen's 10 Usability Heuristics",
    ruleCount = 10,
    overallScore,
    profileResults = {},
    accessibilityResults,
    issues = []
  } = data;

  const lines = [];

  const critical = issues.filter(i => i.severity === 'critical');
  const moderate = issues.filter(i => i.severity === 'moderate');
  const minor = issues.filter(i => i.severity === 'minor');
  const quickWins = issues.filter(i => i.isQuickWin || (i.priority === 'high' && i.fixEffort === 'easy'));

  // ─── 1. Header & Audit Metadata ────────────────────────────────────────────
  lines.push('# 📊 synthux UX Audit Report');
  lines.push('');
  lines.push('| Audit Property | Details |');
  lines.push('|:---|:---|');
  lines.push(`| **URL** | ${url} |`);
  lines.push(`| **Page Title** | ${title || 'N/A'} |`);
  lines.push(`| **Date** | ${new Date(timestamp).toLocaleString()} |`);
  lines.push(`| **Rule Pack** | **${rulePackName}** |`);
  const modeLabel = mode === 'deep'
    ? `🔬 Deep (${ruleCount} rules)`
    : mode === 'custom'
      ? '🎯 Custom Selection'
      : `⚡ Quick (${Math.min(3, ruleCount)} rules)`;
  lines.push(`| **Analysis Mode** | ${modeLabel} |`);
  lines.push(`| **AI Engine** | \`${model}\` (${data.provider || 'ollama'}${data.screenshot ? ' · Vision' : ''}) |`);
  if (data.costSummary) {
    lines.push(`| **Token / Cost** | ${data.costSummary.formatted} |`);
  }
  lines.push('');

  // ─── 2. Executive Summary & KPI Scorecard ──────────────────────────────────
  lines.push('## 📈 Executive Summary & KPI Scorecard');
  lines.push('');
  lines.push('| Metric | Score / Count | Visual Bar / Breakdown |');
  lines.push('|:---|:---|:---|');
  lines.push(`| **Overall UX Score** | **${overallScore}/100** ${getScoreEmoji(overallScore)} | \`${renderScoreBar(overallScore)}\` (${getScoreGrade(overallScore)}) |`);
  if (accessibilityResults) {
    lines.push(`| **Accessibility (WCAG)** | **${accessibilityResults.score}/100** ${getScoreEmoji(accessibilityResults.score)} | \`${renderScoreBar(accessibilityResults.score)}\` (${accessibilityResults.wcagViolations?.length || 0} WCAG violations) |`);
  }
  Object.values(profileResults).forEach(pr => {
    const pName = pr.profile?.name?.en || pr.profile?.name || 'Profile';
    lines.push(`| **${pr.profile?.icon || '👤'} ${pName}** | **${pr.score}/100** ${getScoreEmoji(pr.score)} | \`${renderScoreBar(pr.score)}\` |`);
  });
  lines.push(`| **Total Unique Issues** | **${issues.length}** | 🔴 ${critical.length} Critical · 🟡 ${moderate.length} Moderate · 🟢 ${minor.length} Minor |`);
  lines.push(`| **Quick Wins** | **${quickWins.length}** | ⚡ High-impact, easy-effort fixes ready for immediate action |`);
  lines.push('');

  // ─── 3. 2×2 Impact × Effort Priority Matrix ────────────────────────────────
  if (issues.length > 0) {
    const majorProjects = issues.filter(i => i.priority === 'high' && i.fixEffort !== 'easy');
    const fillIns = issues.filter(i => i.priority !== 'high' && i.fixEffort === 'easy');
    const backlog = issues.filter(i => i.priority !== 'high' && i.fixEffort !== 'easy');

    lines.push('---');
    lines.push('');
    lines.push('## 🧭 2×2 Impact × Effort Priority Matrix');
    lines.push('');
    lines.push('| Quadrant | Impact × Effort | Count | Top Actionable Focus |');
    lines.push('|:---|:---|:---:|:---|');
    lines.push(`| **⚡ 1. Quick Wins** | High Impact · Easy Fix | **${quickWins.length}** | ${quickWins[0]?.description || 'None identified'} |`);
    lines.push(`| **🚀 2. Major Projects** | High Impact · Mod/Hard Fix | **${majorProjects.length}** | ${majorProjects[0]?.description || 'None identified'} |`);
    lines.push(`| **🔧 3. Fill-Ins** | Med/Low Impact · Easy Fix | **${fillIns.length}** | ${fillIns[0]?.description || 'None identified'} |`);
    lines.push(`| **📋 4. Backlog** | Med/Low Impact · Mod/Hard Fix | **${backlog.length}** | ${backlog[0]?.description || 'None identified'} |`);
    lines.push('');

    // Quick Wins Action List
    if (quickWins.length > 0) {
      lines.push('### ⚡ Top Quick Wins (Do First)');
      lines.push('');
      quickWins.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **[${issue.severity.toUpperCase()}] ${issue.description}**`);
        if (issue.element) lines.push(`   - **Selector:** \`${issue.element}\``);
        lines.push(`   - **Action:** ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`   - **Fix (\`${issue.codeFix.language}\`):** \`${issue.codeFix.after.replace(/\n/g, ' ')}\``);
        }
      });
      lines.push('');
    }
  }

  // ─── 4. Per-Profile Detailed Evaluation ────────────────────────────────────
  Object.values(profileResults).forEach(pr => {
    const pName = pr.profile?.name?.en || pr.profile?.name || 'Profile';
    lines.push('---');
    lines.push('');
    lines.push(`## ${pr.profile?.icon || '👤'} ${pName} — ${pr.score}/100 (${getScoreGrade(pr.score)})`);
    lines.push('');

    // Custom profile details
    if (pr.profile?.custom) {
      const details = [];
      if (pr.profile.ageRange) details.push(`**Age:** ${pr.profile.ageRange}`);
      if (pr.profile.techLevel) details.push(`**Tech Level:** ${pr.profile.techLevel}`);
      if (pr.profile.disabilities?.length) details.push(`**Accessibility:** ${pr.profile.disabilities.join(', ')}`);
      if (pr.profile.goal) details.push(`**Goal:** ${pr.profile.goal}`);
      if (details.length > 0) {
        lines.push(`> 👤 **Custom Persona** — ${details.join(' · ')}`);
        lines.push('');
      }
    }

    // Heuristic scores table with visual progress bar
    lines.push('| Heuristic / Rule | Score | Bar | Summary |');
    lines.push('|:---|:---:|:---|:---|');
    pr.evaluations.forEach(ev => {
      const name = ev.heuristicName?.en || ev.heuristicName;
      const emoji = getScoreEmoji(ev.score);
      const summary = String(ev.summary || '').replace(/\|/g, '\\|');
      lines.push(`| **${name}** | ${ev.score}/100 ${emoji} | \`${renderScoreBar(ev.score, 8)}\` | ${summary} |`);
    });
    lines.push('');

    // Issues for this profile
    const profileIssues = pr.evaluations.flatMap(ev =>
      (ev.issues || []).map(i => ({ ...i, heuristic: ev.heuristicName?.en || ev.heuristicName }))
    );

    if (profileIssues.length > 0) {
      lines.push('### 🔍 Identified Issues & Code Fixes');
      lines.push('');
      profileIssues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'moderate' ? '🟡' : '🟢';
        const priorityTag = issue.priority === 'high' ? ' · `HIGH IMPACT`' : issue.priority === 'low' ? ' · `low impact`' : '';
        const effortTag = issue.fixEffort === 'easy' ? ' · `EASY FIX`' : issue.fixEffort === 'hard' ? ' · `HARD FIX`' : '';
        const qwTag = (issue.priority === 'high' && issue.fixEffort === 'easy') ? ' · 🏆 **Quick Win**' : '';
        lines.push(`- ${icon} **[${issue.severity.toUpperCase()}]** *(${issue.heuristic})*${priorityTag}${effortTag}${qwTag}`);
        lines.push(`  - **Issue:** ${issue.description}`);
        if (issue.element) lines.push(`  - **Element:** \`${issue.element}\``);
        lines.push(`  - **Recommendation:** ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`  - <details><summary>💻 Suggested Code Fix (${issue.codeFix.language})</summary>`);
          lines.push('');
          if (issue.codeFix.before) {
            lines.push(`    **Before:**`);
            lines.push(`    \`\`\`${issue.codeFix.language}`);
            lines.push(`    ${issue.codeFix.before}`);
            lines.push(`    \`\`\``);
          }
          lines.push(`    **After:**`);
          lines.push(`    \`\`\`${issue.codeFix.language}`);
          lines.push(`    ${issue.codeFix.after}`);
          lines.push(`    \`\`\``);
          lines.push(`    </details>`);
        }
      });
      lines.push('');
    }

    // Positives
    const positives = pr.evaluations.flatMap(ev => ev.positives || []);
    if (positives.length > 0) {
      lines.push('### ✅ Strengths & Positives');
      lines.push('');
      positives.forEach(p => {
        lines.push(`- ✅ ${p}`);
      });
      lines.push('');
    }
  });

  // ─── 5. Accessibility Results ──────────────────────────────────────────────
  if (accessibilityResults) {
    lines.push('---');
    lines.push('');
    lines.push(`## ♿ Accessibility & WCAG 2.2 AA Audit — ${accessibilityResults.score}/100`);
    lines.push('');
    lines.push('| Automated Check | Status | Details |');
    lines.push('|:---|:---|:---|');

    (accessibilityResults.checks || []).forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
      lines.push(`| **${check.name}** | ${icon} ${check.status} | ${check.message} |`);
    });
    lines.push('');

    // WCAG violations from axe-core
    if (accessibilityResults.wcagViolations?.length > 0) {
      lines.push(`### WCAG Violations (axe-core) — ${accessibilityResults.wcagViolations.length} issue${accessibilityResults.wcagViolations.length > 1 ? 's' : ''}`);
      lines.push('');
      accessibilityResults.wcagViolations.forEach(v => {
        const impactIcon = v.impact === 'critical' ? '🔴' : v.impact === 'serious' ? '🟡' : v.impact === 'moderate' ? '🔵' : '⚪';
        lines.push(`- ${impactIcon} **[${v.impact}]** **${v.help}**`);
        lines.push(`  - ${v.description}`);
        if (v.tags?.length) lines.push(`  - **Standard:** \`${v.tags.join('`, `')}\``);
        if (v.nodes?.length) {
          v.nodes.slice(0, 3).forEach(n => {
            lines.push(`  - **Element:** \`${n.target || n.html}\``);
          });
        }
        if (v.helpUrl) lines.push(`  - [WCAG Reference](${v.helpUrl})`);
      });
      lines.push('');
    }

    if (accessibilityResults.wcagPasses) {
      lines.push(`> ✓ **${accessibilityResults.wcagPasses}** automated WCAG 2.2 rules passed`);
      lines.push('');
    }
  }

  // ─── 6. Consolidated Priority Issues by Severity ───────────────────────────
  if (issues.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## 🎯 Consolidated Issues by Severity');
    lines.push('');

    if (critical.length > 0) {
      lines.push(`### 🔴 Critical (${critical.length})`);
      critical.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ''}`);
        lines.push(`   - 💡 ${issue.recommendation}`);
      });
      lines.push('');
    }

    if (moderate.length > 0) {
      lines.push(`### 🟡 Moderate (${moderate.length})`);
      moderate.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ''}`);
        lines.push(`   - 💡 ${issue.recommendation}`);
      });
      lines.push('');
    }

    if (minor.length > 0) {
      lines.push(`### 🟢 Minor (${minor.length})`);
      minor.forEach((issue, idx) => {
        lines.push(`${idx + 1}. **${issue.description}** ${issue.element ? `(\`${issue.element}\`)` : ''}`);
        lines.push(`   - 💡 ${issue.recommendation}`);
      });
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Generated by [synthux v2.0](https://synthux.app) — Open Source AI-Powered UX Audit.*');

  return lines.join('\n');
}

/**
 * Generate clean JSON export
 */
function generateJSON(data) {
  return {
    version: '2.0.0',
    url: data.url,
    title: data.title,
    timestamp: data.timestamp,
    model: data.model,
    mode: data.mode,
    rulePackId: data.rulePackId || 'nielsen-10',
    rulePackName: data.rulePackName || "Nielsen's 10 Usability Heuristics",
    overallScore: data.overallScore,
    profiles: Object.fromEntries(
      Object.entries(data.profileResults || {}).map(([id, pr]) => [
        id,
        {
          score: pr.score,
          evaluations: (pr.evaluations || []).map(ev => ({
            heuristic: ev.heuristicId,
            score: ev.score,
            summary: ev.summary,
            issues: ev.issues,
            positives: ev.positives
          }))
        }
      ])
    ),
    accessibility: {
      score: data.accessibilityResults?.score,
      checks: data.accessibilityResults?.checks?.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        message: c.message
      }))
    },
    topIssues: (data.issues || []).slice(0, 15).map(i => ({
      severity: i.severity,
      priority: i.priority,
      fixEffort: i.fixEffort,
      isQuickWin: i.isQuickWin || false,
      element: i.element || '',
      description: i.description,
      recommendation: i.recommendation,
      codeFix: i.codeFix || null
    }))
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getScoreEmoji(score) {
  if (score >= 81) return '✅';
  if (score >= 61) return '🟡';
  if (score >= 41) return '⚠️';
  return '❌';
}

function getScoreGrade(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Critical';
}

function renderScoreBar(score, length = 10) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const filled = Math.round((clamped / 100) * length);
  return '█'.repeat(filled) + '░'.repeat(Math.max(0, length - filled));
}
