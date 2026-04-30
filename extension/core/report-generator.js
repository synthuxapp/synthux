/**
 * synthux — Report Generator
 * 
 * Produces structured reports in multiple formats:
 * 1. Interactive object (for Side Panel UI rendering)
 * 2. Markdown (clipboard-friendly)
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
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    screenshot,
    costSummary
  } = data;

  return {
    version: '1.6.0',
    url,
    title,
    timestamp,
    model,
    mode,
    provider: provider || 'ollama',
    overallScore,
    profileResults,
    accessibilityResults,
    issues,
    // screenshot intentionally excluded — too large for storage, used only during AI analysis
    visionEnabled: !!screenshot,
    costSummary: costSummary || null,
    markdown: generateMarkdown(data),
    json: generateJSON(data)
  };
}

/**
 * Generate Markdown report for clipboard/export
 */
function generateMarkdown(data) {
  const {
    url,
    title,
    timestamp,
    model,
    mode,
    overallScore,
    profileResults,
    accessibilityResults,
    issues
  } = data;

  const lines = [];

  // Header
  lines.push('# 📊 synthux UX Evaluation Report');
  lines.push('');
  lines.push(`| Field | Value |`);
  lines.push(`|:---|:---|`);
  lines.push(`| **URL** | ${url} |`);
  lines.push(`| **Page Title** | ${title || 'N/A'} |`);
  lines.push(`| **Date** | ${new Date(timestamp).toLocaleString()} |`);
  lines.push(`| **AI Model** | ${model} (${data.provider || 'Ollama'}) |`);
  const modeLabel = mode === 'deep' ? '🔬 Deep (10 heuristics)' : mode === 'custom' ? '🎯 Custom' : '⚡ Quick (3 heuristics)';
  lines.push(`| **Mode** | ${modeLabel} |`);
  if (data.costSummary) {
    lines.push(`| **Cost** | ${data.costSummary.formatted} |`);
  }
  lines.push('');

  // Overall Score
  lines.push(`## Overall UX Score: ${overallScore}/100 ${getScoreEmoji(overallScore)}`);
  lines.push('');

  // Per-profile Results
  Object.values(profileResults).forEach(pr => {
    lines.push(`---`);
    lines.push('');
    lines.push(`### ${pr.profile.icon} ${pr.profile.name.en} — ${pr.score}/100`);
    lines.push('');

    // Custom profile details
    if (pr.profile.custom) {
      const details = [];
      if (pr.profile.ageRange) details.push(`**Age:** ${pr.profile.ageRange}`);
      if (pr.profile.techLevel) details.push(`**Tech Level:** ${pr.profile.techLevel}`);
      if (pr.profile.disabilities?.length) details.push(`**Disabilities:** ${pr.profile.disabilities.join(', ')}`);
      if (pr.profile.goal) details.push(`**Goal:** ${pr.profile.goal}`);
      if (details.length > 0) {
        lines.push(`> 👤 **Custom Profile** — ${details.join(' · ')}`);
        lines.push('');
      }
    }

    // Heuristic scores table
    lines.push('| Heuristic | Score | Status |');
    lines.push('|:---|:---|:---|');
    pr.evaluations.forEach(ev => {
      const name = ev.heuristicName?.en || ev.heuristicName;
      const emoji = getScoreEmoji(ev.score);
      lines.push(`| ${name} | ${ev.score}/100 | ${emoji} |`);
    });
    lines.push('');

    // Issues for this profile
    const profileIssues = pr.evaluations.flatMap(ev =>
      ev.issues.map(i => ({ ...i, heuristic: ev.heuristicName?.en || ev.heuristicName }))
    );

    if (profileIssues.length > 0) {
      lines.push('**Issues:**');
      profileIssues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'moderate' ? '🟡' : '🟢';
        const priorityTag = issue.priority === 'high' ? ' **[HIGH]**' : issue.priority === 'low' ? ' [low]' : '';
        const effortTag = issue.fixEffort === 'easy' ? ' ⚡' : issue.fixEffort === 'hard' ? ' 🔧' : '';
        const qwTag = (issue.priority === 'high' && issue.fixEffort === 'easy') ? ' 🏆 Quick Win' : '';
        lines.push(`- ${icon} **[${issue.severity}]**${priorityTag}${effortTag}${qwTag} ${issue.description}`);
        lines.push(`  - Element: ${issue.element}`);
        lines.push(`  - 💡 Recommendation: ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`  - **Fix (${issue.codeFix.language}):**`);
          if (issue.codeFix.before) {
            lines.push(`    \`\`\`${issue.codeFix.language}`);
            lines.push(`    /* Before */`);
            lines.push(`    ${issue.codeFix.before}`);
            lines.push(`    \`\`\``);
          }
          lines.push(`    \`\`\`${issue.codeFix.language}`);
          lines.push(`    /* After */`);
          lines.push(`    ${issue.codeFix.after}`);
          lines.push(`    \`\`\``);
        }
      });
      lines.push('');
    }

    // Positives
    const positives = pr.evaluations.flatMap(ev => ev.positives || []);
    if (positives.length > 0) {
      lines.push('**Positives:**');
      positives.forEach(p => {
        lines.push(`- ✅ ${p}`);
      });
      lines.push('');
    }
  });

  // Accessibility Results
  if (accessibilityResults) {
    lines.push('---');
    lines.push('');
    lines.push(`## ♿ Accessibility Audit (Automated) — ${accessibilityResults.score}/100`);
    lines.push('');
    lines.push(`| Check | Status | Details |`);
    lines.push(`|:---|:---|:---|`);

    accessibilityResults.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
      lines.push(`| ${check.name} | ${icon} ${check.status} | ${check.message} |`);
    });
    lines.push('');

    // WCAG violations from axe-core
    if (accessibilityResults.wcagViolations?.length > 0) {
      lines.push(`### WCAG Violations (axe-core) — ${accessibilityResults.wcagViolations.length} issue${accessibilityResults.wcagViolations.length > 1 ? 's' : ''}`);
      lines.push('');
      accessibilityResults.wcagViolations.forEach(v => {
        const impactIcon = v.impact === 'critical' ? '🔴' : v.impact === 'serious' ? '🟡' : v.impact === 'moderate' ? '🔵' : '⚪';
        lines.push(`- ${impactIcon} **[${v.impact}]** ${v.help}`);
        lines.push(`  - ${v.description}`);
        if (v.tags?.length) lines.push(`  - WCAG: ${v.tags.join(', ')}`);
        if (v.nodes?.length) {
          v.nodes.slice(0, 3).forEach(n => {
            lines.push(`  - Element: \`${n.target || n.html}\``);
          });
        }
        if (v.helpUrl) lines.push(`  - [Learn more](${v.helpUrl})`);
      });
      lines.push('');
    }

    if (accessibilityResults.wcagPasses) {
      lines.push(`> ✓ ${accessibilityResults.wcagPasses} WCAG rules passed`);
      lines.push('');
    }
  }

  // Priority Matrix (top issues)
  if (issues.length > 0) {
    lines.push('---');
    lines.push('');

    // Quick Wins section
    const quickWins = issues.filter(i => i.isQuickWin);
    if (quickWins.length > 0) {
      lines.push('## ⚡ Quick Wins — High Impact, Easy Fix');
      lines.push('');
      quickWins.forEach(issue => {
        lines.push(`1. **${issue.description}**`);
        lines.push(`   - ${issue.recommendation}`);
        if (issue.codeFix) {
          lines.push(`   - Fix (${issue.codeFix.language}): \`${issue.codeFix.after}\``);
        }
      });
      lines.push('');
    }

    lines.push('## 🎯 Priority Issues');
    lines.push('');
    
    const critical = issues.filter(i => i.severity === 'critical');
    const moderate = issues.filter(i => i.severity === 'moderate');
    const minor = issues.filter(i => i.severity === 'minor');

    if (critical.length > 0) {
      lines.push(`### 🔴 Critical (${critical.length})`);
      critical.forEach(issue => {
        lines.push(`1. **${issue.description}**`);
        lines.push(`   - ${issue.recommendation}`);
      });
      lines.push('');
    }

    if (moderate.length > 0) {
      lines.push(`### 🟡 Moderate (${moderate.length})`);
      moderate.forEach(issue => {
        lines.push(`1. **${issue.description}**`);
        lines.push(`   - ${issue.recommendation}`);
      });
      lines.push('');
    }

    if (minor.length > 0) {
      lines.push(`### 🟢 Minor (${minor.length})`);
      minor.forEach(issue => {
        lines.push(`1. **${issue.description}**`);
        lines.push(`   - ${issue.recommendation}`);
      });
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Generated by [synthux](https://synthux.app) — AI-powered UX audit, open source.*');

  return lines.join('\n');
}

/**
 * Generate clean JSON export
 */
function generateJSON(data) {
  return {
    version: '1.0.0',
    url: data.url,
    title: data.title,
    timestamp: data.timestamp,
    model: data.model,
    mode: data.mode,
    overallScore: data.overallScore,
    profiles: Object.fromEntries(
      Object.entries(data.profileResults).map(([id, pr]) => [
        id,
        {
          score: pr.score,
          evaluations: pr.evaluations.map(ev => ({
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
    topIssues: data.issues.slice(0, 10).map(i => ({
      severity: i.severity,
      priority: i.priority,
      fixEffort: i.fixEffort,
      isQuickWin: i.isQuickWin || false,
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
