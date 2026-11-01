/**
 * synthux — PDF Export Module (Enhanced Reporting v2.0)
 * 
 * Generates branded, executive-ready PDF reports from analysis and flow results using jsPDF.
 * Includes:
 * - Executive Summary KPI Cards (Overall UX, Accessibility, Severity Breakdown, Quick Wins)
 * - Rule Pack & Model Metadata Card
 * - Annotated Viewport Screenshot Embedding (when available)
 * - 2×2 Impact × Effort Priority Matrix & Quick Wins Action Box
 * - Visual Heuristic Progress Bars, Positives, and Before/After Code Fixes
 * - Full Multi-Page Flow PDF with Per-Page Issues & Thumbnails
 */

import { jsPDF } from 'jspdf';

// ─── Color Palette ───────────────────────────────────────────────────────────
const COLORS = {
  bg: [17, 17, 19],         // #111113
  card: [28, 28, 31],       // #1c1c1f
  cardAlt: [22, 22, 26],    // #16161a
  accent: [59, 130, 246],   // #3b82f6
  textPrimary: [237, 237, 240],
  textSecondary: [180, 180, 188],
  textTertiary: [138, 138, 150],
  success: [34, 197, 94],   // #22c55e
  warning: [234, 179, 8],   // #eab308
  error: [239, 68, 68],     // #ef4444
  white: [255, 255, 255],
  divider: [40, 40, 45],
};

// ─── Text Sanitizer ──────────────────────────────────────────────────────────
// jsPDF built-in fonts (Helvetica, Courier, Times) only support Latin-1 (U+0000–U+00FF).
// Transliterate Turkish/extended chars and replace common unicode punctuation.
function sanitize(text) {
  if (!text) return '';
  return String(text)
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2026]/g, '...')
    .replace(/[\u2022\u00B7]/g, '-')
    .replace(/[\u00A0]/g, ' ')
    .replace(/[\u2192]/g, '->')
    .replace(/[\u2190]/g, '<-')
    .replace(/[\u2264]/g, '<=')
    .replace(/[\u2265]/g, '>=')
    .replace(/[\u2260]/g, '!=')
    .replace(/[\u00D7]/g, 'x')
    .replace(/[^\x00-\xFF]/g, '')
    .trim();
}

// ─── Main Export Function ────────────────────────────────────────────────────

/**
 * Generate a branded PDF report from analysis results
 * @param {Object} report — The full report object from analyzer
 * @returns {Blob} — PDF file as Blob
 */
export function generatePDF(report) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Helpers ──────────────────────────────────────────────────────────

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawPageBg(doc, pageWidth, pageHeight);
    }
  };

  // ─── Page Background ─────────────────────────────────────────────────
  drawPageBg(doc, pageWidth, pageHeight);

  // ─── Branded Header ──────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.text('synthux', margin, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textTertiary);
  doc.text('AI-Powered UX Audit Report', margin + 35, y + 6);

  // Rule Pack Badge (top-right)
  const packBadgeText = sanitize(report.rulePackShortName || report.rulePackName || 'Nielsen 10');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  const badgeW = Math.min(55, doc.getTextWidth(packBadgeText) + 8);
  doc.setFillColor(...COLORS.card);
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - margin - badgeW, y + 1, badgeW, 6.5, 1.5, 1.5, 'FD');
  doc.setTextColor(...COLORS.accent);
  doc.text(packBadgeText, pageWidth - margin - badgeW / 2, y + 5.2, { align: 'center' });

  y += 12;

  // Divider
  doc.setDrawColor(...COLORS.divider);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // ─── Audit Metadata Card ─────────────────────────────────────────────
  const ruleCount = report.ruleCount || 10;
  const modeLabel = report.mode === 'deep'
    ? `Deep (${ruleCount} rules)`
    : report.mode === 'custom'
      ? 'Custom Selection'
      : `Quick (${Math.min(3, ruleCount)} rules)`;

  doc.setFillColor(...COLORS.card);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textSecondary);

  const urlLine = doc.splitTextToSize(`URL: ${sanitize(report.url || 'N/A')}`, contentWidth - 8)[0];
  const pageLine = doc.splitTextToSize(`Page: ${sanitize(report.title || 'Untitled')}`, contentWidth - 8)[0];
  const packLine = `Rule Pack: ${sanitize(report.rulePackName || "Nielsen's 10 Usability Heuristics")}  |  Mode: ${modeLabel}`;
  const modelLine = `AI Engine: ${sanitize(report.model || 'N/A')} (${sanitize(report.provider || 'ollama')})${report.costSummary?.formatted ? `  |  Cost: ${sanitize(report.costSummary.formatted)}` : ''}  |  Date: ${report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'N/A'}`;

  doc.text(urlLine, margin + 4, y + 5);
  doc.text(pageLine, margin + 4, y + 9.5);
  doc.text(packLine, margin + 4, y + 14);
  doc.setTextColor(...COLORS.textTertiary);
  doc.text(modelLine, margin + 4, y + 18.5);
  y += 27;

  // ─── Executive Summary KPI Row (4 Cards) ─────────────────────────────
  const issues = report.issues || [];
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const moderateCount = issues.filter(i => i.severity === 'moderate').length;
  const minorCount = issues.filter(i => i.severity === 'minor').length;
  const quickWins = issues.filter(i => i.isQuickWin || (i.priority === 'high' && i.fixEffort === 'easy'));
  const a11yScore = report.accessibilityResults?.score ?? null;

  const kpiGap = 4;
  const kpiW = (contentWidth - kpiGap * 3) / 4;
  const kpiH = 22;

  const kpis = [
    {
      label: 'OVERALL UX SCORE',
      value: `${report.overallScore || 0}/100`,
      sub: getScoreGrade(report.overallScore || 0),
      color: getScoreColor(report.overallScore || 0)
    },
    {
      label: 'ACCESSIBILITY',
      value: a11yScore !== null ? `${a11yScore}/100` : 'N/A',
      sub: `${report.accessibilityResults?.wcagViolations?.length || 0} WCAG violations`,
      color: a11yScore !== null ? getScoreColor(a11yScore) : COLORS.textTertiary
    },
    {
      label: 'TOTAL ISSUES',
      value: `${issues.length}`,
      sub: `${criticalCount} Crit / ${moderateCount} Mod / ${minorCount} Min`,
      color: criticalCount > 0 ? COLORS.error : moderateCount > 0 ? COLORS.warning : COLORS.success
    },
    {
      label: 'QUICK WINS',
      value: `${quickWins.length}`,
      sub: 'High Impact + Easy Fix',
      color: COLORS.accent
    }
  ];

  kpis.forEach((kpi, idx) => {
    const kx = margin + idx * (kpiW + kpiGap);
    doc.setFillColor(...COLORS.card);
    doc.roundedRect(kx, y, kpiW, kpiH, 2, 2, 'F');

    // Top color accent strip
    doc.setFillColor(...kpi.color);
    doc.rect(kx, y, kpiW, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textTertiary);
    doc.text(kpi.label, kx + 3, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, kx + 3, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textSecondary);
    doc.text(kpi.sub, kx + 3, y + 19);
  });

  y += kpiH + 7;

  // ─── Annotated Viewport Screenshot (When Available) ──────────────────
  if (report.annotatedScreenshot && typeof report.annotatedScreenshot === 'string' && report.annotatedScreenshot.startsWith('data:image/')) {
    try {
      ensureSpace(78);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.white);
      doc.text('Annotated Viewport Issue Map', margin, y);
      y += 4;

      const imgH = 66;
      doc.setFillColor(...COLORS.card);
      doc.roundedRect(margin, y, contentWidth, imgH + 4, 2, 2, 'F');
      doc.addImage(report.annotatedScreenshot, 'JPEG', margin + 2, y + 2, contentWidth - 4, imgH, undefined, 'FAST');
      y += imgH + 9;
    } catch (e) {
      // Non-critical if image embedding fails
    }
  }

  // ─── 2×2 Priority Matrix & Quick Wins Summary ────────────────────────
  if (issues.length > 0) {
    ensureSpace(34);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text('2x2 Impact x Effort Priority Matrix', margin, y);
    y += 5;

    const majorProjects = issues.filter(i => i.priority === 'high' && i.fixEffort !== 'easy');
    const fillIns = issues.filter(i => i.priority !== 'high' && i.fixEffort === 'easy');
    const backlog = issues.filter(i => i.priority !== 'high' && i.fixEffort !== 'easy');

    const quadGap = 4;
    const quadW = (contentWidth - quadGap) / 2;
    const quadH = 14;

    const quadrants = [
      { title: `1. Quick Wins (${quickWins.length})`, desc: 'High Impact + Easy Effort (Do First)', item: quickWins[0]?.description, color: COLORS.success, col: 0, row: 0 },
      { title: `2. Major Projects (${majorProjects.length})`, desc: 'High Impact + Moderate/Hard Effort', item: majorProjects[0]?.description, color: COLORS.warning, col: 1, row: 0 },
      { title: `3. Fill-Ins (${fillIns.length})`, desc: 'Med/Low Impact + Easy Effort', item: fillIns[0]?.description, color: COLORS.accent, col: 0, row: 1 },
      { title: `4. Backlog (${backlog.length})`, desc: 'Med/Low Impact + Moderate/Hard Effort', item: backlog[0]?.description, color: COLORS.textTertiary, col: 1, row: 1 }
    ];

    quadrants.forEach(q => {
      const qx = margin + q.col * (quadW + quadGap);
      const qy = y + q.row * (quadH + 3);
      doc.setFillColor(...COLORS.card);
      doc.roundedRect(qx, qy, quadW, quadH, 1.5, 1.5, 'F');

      doc.setFillColor(...q.color);
      doc.rect(qx, qy, 1.5, quadH, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.white);
      doc.text(q.title, qx + 4, qy + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text(q.desc, qx + 4, qy + 8.2);

      const topText = sanitize(q.item || 'No issues in this quadrant');
      const topLine = doc.splitTextToSize(`Top: ${topText}`, quadW - 7)[0] || '';
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(topLine, qx + 4, qy + 12);
    });

    y += quadH * 2 + 10;

    // Highlighted Quick Wins Box (if any)
    if (quickWins.length > 0) {
      ensureSpace(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.warning);
      doc.text(`Top Quick Wins Action List (${quickWins.length})`, margin, y);
      y += 4.5;

      quickWins.slice(0, 5).forEach((qw, i) => {
        ensureSpace(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textPrimary);
        const qwDesc = doc.splitTextToSize(`${i + 1}. ${sanitize(qw.description)}`, contentWidth - 4);
        doc.text(qwDesc, margin + 2, y);
        y += qwDesc.length * 3.5;

        if (qw.recommendation) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(...COLORS.accent);
          const qwRec = doc.splitTextToSize(`   Fix: ${sanitize(qw.recommendation)}`, contentWidth - 6);
          doc.text(qwRec, margin + 2, y);
          y += qwRec.length * 3.2;
        }
        y += 1.5;
      });
      y += 4;
    }
  }

  // ─── Per-Profile Detailed Results ────────────────────────────────────
  const profiles = Object.values(report.profileResults || {});

  profiles.forEach(pr => {
    ensureSpace(24);

    // Profile Header Bar
    const profileName = sanitize(pr.profile.name?.en || pr.profile.name || 'Profile');
    const pScoreColor = getScoreColor(pr.score);

    doc.setFillColor(...COLORS.card);
    doc.roundedRect(margin, y - 4, contentWidth, 9, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text(`${profileName}`, margin + 3, y + 2);

    doc.setTextColor(...pScoreColor);
    doc.text(`${pr.score}/100 (${getScoreGrade(pr.score)})`, pageWidth - margin - 3, y + 2, { align: 'right' });
    y += 9;

    // Custom profile details subtitle
    if (pr.profile.custom) {
      const parts = [];
      if (pr.profile.ageRange) parts.push(`Age: ${pr.profile.ageRange}`);
      if (pr.profile.techLevel) parts.push(`Tech: ${pr.profile.techLevel}`);
      if (pr.profile.disabilities?.length) parts.push(`Needs: ${pr.profile.disabilities.join(', ')}`);
      if (pr.profile.goal) parts.push(`Goal: ${pr.profile.goal}`);
      if (parts.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textSecondary);
        const subtitle = sanitize(`Custom Persona - ${parts.join(' | ')}`);
        const lines = doc.splitTextToSize(subtitle, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 2;
      }
    }

    // Heuristic Table with Visual Progress Bars
    const evaluations = pr.evaluations || [];

    doc.setFillColor(...COLORS.cardAlt);
    doc.rect(margin, y - 3, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.textTertiary);
    doc.text('Heuristic / Rule', margin + 2, y + 0.5);
    doc.text('Score Bar', pageWidth - margin - 34, y + 0.5);
    doc.text('Score', pageWidth - margin - 2, y + 0.5, { align: 'right' });
    y += 5.5;

    evaluations.forEach(ev => {
      ensureSpace(6);
      const evColor = getScoreColor(ev.score);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      const hName = sanitize(ev.heuristicName?.en || ev.heuristicName || ev.heuristicId);
      const hNameMaxW = contentWidth - 48;
      const truncated = doc.splitTextToSize(hName, hNameMaxW);
      doc.text(truncated[0] || hName, margin + 2, y);

      // Draw visual score progress bar
      const barX = pageWidth - margin - 38;
      const barW = 24;
      const barH = 2.2;
      doc.setFillColor(...COLORS.divider);
      doc.roundedRect(barX, y - 2.1, barW, barH, 0.8, 0.8, 'F');
      const fillW = Math.max(1, (Math.min(100, Math.max(0, ev.score || 0)) / 100) * barW);
      doc.setFillColor(...evColor);
      doc.roundedRect(barX, y - 2.1, fillW, barH, 0.8, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...evColor);
      doc.text(`${ev.score}`, pageWidth - margin - 2, y, { align: 'right' });
      y += 4.8;
    });

    y += 3;

    // Issues for this profile
    const profileIssues = evaluations.flatMap(ev =>
      (ev.issues || []).map(i => ({ ...i, heuristic: ev.heuristicName?.en || ev.heuristicName || ev.heuristicId }))
    );

    if (profileIssues.length > 0) {
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text(`Identified Issues (${profileIssues.length})`, margin, y);
      y += 5;

      profileIssues.forEach(issue => {
        ensureSpace(16);
        const sevColor = issue.severity === 'critical' ? COLORS.error :
                         issue.severity === 'moderate' ? COLORS.warning : COLORS.success;

        const indentX = margin + 5;
        const textMaxW = pageWidth - margin - indentX;

        // Severity dot
        doc.setFillColor(...sevColor);
        doc.circle(margin + 2, y - 1, 1.2, 'F');

        // Metadata tags line
        const isQW = issue.isQuickWin || (issue.priority === 'high' && issue.fixEffort === 'easy');
        const tagLine = `[${(issue.severity || 'moderate').toUpperCase()}]  ${sanitize(issue.heuristic || '')}${issue.priority ? `  |  Impact: ${issue.priority.toUpperCase()}` : ''}${issue.fixEffort ? `  |  Effort: ${issue.fixEffort.toUpperCase()}` : ''}${isQW ? '  |  * QUICK WIN *' : ''}`;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...(isQW ? COLORS.warning : sevColor));
        doc.text(tagLine, indentX, y);
        y += 3.5;

        // Issue description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textPrimary);
        const descText = sanitize(issue.description || '');
        const descLines = doc.splitTextToSize(descText, textMaxW);
        ensureSpace(descLines.length * 3.5 + 2);
        doc.text(descLines, indentX, y);
        y += descLines.length * 3.5;

        // Element selector
        if (issue.element) {
          doc.setFont('courier', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(...COLORS.textTertiary);
          const elLines = doc.splitTextToSize(`Element: ${sanitize(issue.element)}`, textMaxW);
          doc.text(elLines[0] || '', indentX, y);
          y += 3.2;
        }

        // Recommendation
        if (issue.recommendation) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7.5);
          doc.setTextColor(...COLORS.accent);
          const recText = sanitize(issue.recommendation);
          const recLines = doc.splitTextToSize(`Recommendation: ${recText}`, textMaxW);
          ensureSpace(recLines.length * 3.2 + 1);
          doc.text(recLines, indentX, y);
          y += recLines.length * 3.2;
        }

        // Code fix (Before & After)
        if (issue.codeFix?.after) {
          const codeIndentX = margin + 7;
          const codeMaxW = (pageWidth - margin - codeIndentX) * 0.92;

          doc.setFont('courier', 'normal');
          doc.setFontSize(5.5);

          const beforeLines = issue.codeFix.before
            ? doc.splitTextToSize(`/* Before */\n${sanitize(issue.codeFix.before)}`, codeMaxW)
            : [];
          const afterLines = doc.splitTextToSize(`/* After */\n${sanitize(issue.codeFix.after)}`, codeMaxW);
          const combinedLines = [...beforeLines, ...afterLines];

          const lineH = 2.8;
          const boxH = combinedLines.length * lineH + 7;
          ensureSpace(boxH + 2);

          // Background box
          doc.setFillColor(10, 10, 14);
          doc.rect(indentX - 1, y - 1, textMaxW + 1, boxH, 'F');

          // Language label
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          doc.setTextColor(...COLORS.accent);
          doc.text(`${(issue.codeFix.language || 'css').toUpperCase()} CODE FIX:`, codeIndentX, y + 2);
          y += 5;

          doc.setFont('courier', 'normal');
          doc.setFontSize(5.5);
          doc.setTextColor(...COLORS.textSecondary);
          doc.text(combinedLines, codeIndentX, y);
          y += combinedLines.length * lineH + 2;

          doc.setFont('helvetica', 'normal');
        }

        y += 2.5;
      });
    }

    // Positives / Strengths for this profile
    const positives = evaluations.flatMap(ev => ev.positives || []);
    if (positives.length > 0) {
      ensureSpace(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.success);
      doc.text(`Strengths & Positives (${positives.length})`, margin, y);
      y += 4.5;

      positives.slice(0, 8).forEach(pos => {
        ensureSpace(5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textSecondary);
        const pLines = doc.splitTextToSize(`+ ${sanitize(pos)}`, contentWidth - 6);
        doc.text(pLines, margin + 4, y);
        y += pLines.length * 3.3 + 0.8;
      });
      y += 2;
    }

    // Divider between profiles
    y += 2;
    doc.setDrawColor(...COLORS.divider);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  });

  // ─── Accessibility Audit ─────────────────────────────────────────────
  if (report.accessibilityResults) {
    ensureSpace(20);
    const a11y = report.accessibilityResults;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.text(`Accessibility & WCAG Audit - ${a11y.score}/100`, margin, y);
    y += 7;

    (a11y.checks || []).forEach(check => {
      ensureSpace(5);
      const dotColor = check.status === 'pass' ? COLORS.success :
                       check.status === 'warning' ? COLORS.warning : COLORS.error;

      doc.setFillColor(...dotColor);
      doc.circle(margin + 2, y - 1, 1, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(sanitize(check.name || ''), margin + 5, y);

      doc.setTextColor(...COLORS.textTertiary);
      const msgMaxW = contentWidth * 0.5;
      const msg = sanitize(check.message || '');
      const msgTruncated = doc.splitTextToSize(msg, msgMaxW);
      doc.text(msgTruncated[0] || '', pageWidth - margin, y, { align: 'right' });
      y += 4;
    });

    y += 4;

    // WCAG violations from axe-core
    if (a11y.wcagViolations?.length > 0) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.white);
      doc.text(sanitize(`WCAG Violations (${a11y.wcagViolations.length})`), margin, y);
      y += 6;

      a11y.wcagViolations.forEach(v => {
        ensureSpace(10);
        const impactColor = v.impact === 'critical' ? COLORS.error :
                           v.impact === 'serious' ? COLORS.warning :
                           v.impact === 'moderate' ? COLORS.accent : COLORS.textTertiary;

        doc.setFillColor(...impactColor);
        doc.circle(margin + 2, y - 1, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...impactColor);
        doc.text(sanitize(`[${v.impact}]`), margin + 5, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COLORS.textPrimary);
        const helpText = sanitize(v.help || '');
        const helpLines = doc.splitTextToSize(helpText, contentWidth - 25);
        doc.text(helpLines[0] || '', margin + 25, y);
        y += 4;

        // Show first affected element
        if (v.nodes?.[0]) {
          doc.setFont('courier', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(...COLORS.textTertiary);
          const elText = sanitize(v.nodes[0].target || v.nodes[0].html || '');
          doc.text(elText.substring(0, 85), margin + 5, y);
          y += 3.5;
        }
        y += 1;
      });
    }

    if (a11y.wcagPasses) {
      ensureSpace(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...COLORS.success);
      doc.text(sanitize(`${a11y.wcagPasses} WCAG rules passed`), margin, y);
      y += 5;
    }
  }

  // ─── Footer ──────────────────────────────────────────────────────────
  const addFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text('Generated by synthux v2.0 - synthux.app', margin, pageHeight - 8);
      doc.text(`Page ${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  };
  addFooter();

  return doc.output('blob');
}

/**
 * Generate a branded PDF report from flow results
 * @param {Object} flowReport — The full flow report object
 * @returns {Blob} — PDF file as Blob
 */
export function generateFlowPDF(flowReport) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawPageBg(doc, pageWidth, pageHeight);
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...COLORS.white);
    doc.text('synthux', margin, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textTertiary);
    doc.text('AI-Powered Flow Journey Report', margin + 35, y + 6);

    y += 14;

    doc.setDrawColor(...COLORS.divider);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // Background for page 1
  drawPageBg(doc, pageWidth, pageHeight);
  drawHeader();

  // Meta Information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textSecondary);
  const metaLines = [
    `Date: ${new Date().toLocaleString()}`,
    `Total Pages Analyzed: ${flowReport.pages?.length || 0}`,
    `Cross-page Findings: ${flowReport.crossPage?.findings?.length || 0}`,
    `Transitions Assessed: ${flowReport.transitions?.length || 0}`,
  ];
  metaLines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4;
  });
  y += 4;

  // Overall Score
  ensureSpace(30);
  const scoreColor = getScoreColor(flowReport.flowScore);
  const circleCx = pageWidth / 2;
  doc.setFillColor(...scoreColor);
  doc.circle(circleCx, y + 10, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.text(String(flowReport.flowScore || 0), circleCx, y + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textTertiary);
  doc.text('Overall Flow Score', circleCx, y + 26, { align: 'center' });
  y += 34;

  // Cross-Page Findings
  if (flowReport.crossPage?.findings?.length > 0) {
    ensureSpace(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text('Cross-Page Findings', margin, y);
    y += 6;

    flowReport.crossPage.findings.forEach(f => {
      ensureSpace(16);
      doc.setFillColor(...COLORS.card);

      const titleLines = doc.splitTextToSize(sanitize(f.title), contentWidth - 8);
      const descLines = doc.splitTextToSize(sanitize(f.description), contentWidth - 8);
      const cardH = (titleLines.length + descLines.length) * 4 + 8;

      ensureSpace(cardH);
      doc.rect(margin, y, contentWidth, cardH, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.white);
      doc.text(titleLines, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(descLines, margin + 4, y + 5 + titleLines.length * 4);

      y += cardH + 4;
    });
    y += 2;
  }

  // Transitions
  if (flowReport.transitions?.length > 0) {
    ensureSpace(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text('Transitions Assessment', margin, y);
    y += 6;

    flowReport.transitions.forEach(t => {
      const fromPage = flowReport.pages.find(p => (p.page?.id || p.id) === t.fromId);
      const toPage = flowReport.pages.find(p => (p.page?.id || p.id) === t.toId);
      const fromLabel = fromPage?.page?.label || t.fromId;
      const toLabel = toPage?.page?.label || t.toId;
      const transitionTitle = `${fromLabel} -> ${toLabel}`;

      const qColor = t.quality === 'smooth' ? COLORS.success : t.quality === 'friction' ? COLORS.warning : COLORS.error;
      const titleLines = doc.splitTextToSize(sanitize(transitionTitle), contentWidth - 30);
      const descLines = doc.splitTextToSize(sanitize(t.description), contentWidth - 8);
      const cardH = Math.max(titleLines.length * 4, 6) + descLines.length * 4 + 8;

      ensureSpace(cardH);
      doc.setFillColor(...COLORS.card);
      doc.rect(margin, y, contentWidth, cardH, 'F');

      // Draw transition quality badge
      doc.setFillColor(...qColor);
      doc.rect(pageWidth - margin - 22, y + 3, 18, 5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.white);
      doc.text((t.quality || 'smooth').toUpperCase(), pageWidth - margin - 13, y + 6.5, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.white);
      doc.text(titleLines, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      doc.text(descLines, margin + 4, y + 6 + titleLines.length * 4);

      y += cardH + 4;
    });
    y += 2;
  }

  // Page-by-Page Audit Details
  if (flowReport.pages?.length > 0) {
    ensureSpace(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text('Individual Page Reports', margin, y);
    y += 6;

    flowReport.pages.forEach((p, idx) => {
      const score = p.report?.overallScore ?? p.score ?? 0;
      const pColor = getScoreColor(score);
      const title = p.page?.label || p.page?.url || `Step ${idx + 1}`;

      ensureSpace(30);
      doc.setDrawColor(...COLORS.divider);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.white);
      doc.text(sanitize(`Step ${idx + 1}: ${title}`), margin, y);

      doc.setTextColor(...pColor);
      doc.text(`${score}/100`, pageWidth - margin, y, { align: 'right' });
      y += 5;

      // URL
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text(sanitize(p.page?.url || ''), margin, y);
      y += 5;

      // Summary
      if (p.report?.summary) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textSecondary);
        const sumLines = doc.splitTextToSize(`Summary: ${sanitize(p.report.summary)}`, contentWidth);
        doc.text(sumLines, margin, y);
        y += sumLines.length * 4 + 2;
      }

      // Collect issues from flat p.report.issues AND/OR p.report.profileResults
      const pageIssues = [];
      if (Array.isArray(p.report?.issues)) {
        p.report.issues.forEach(issue => {
          const desc = typeof issue === 'string' ? issue : (issue.description || issue.title || '');
          if (desc && !pageIssues.some(pi => pi.description === desc)) {
            pageIssues.push(typeof issue === 'string' ? { description: desc, severity: 'moderate' } : { ...issue, description: desc });
          }
        });
      }
      const profileResults = Object.values(p.report?.profileResults || {});
      profileResults.forEach(pr => {
        (pr.evaluations || []).forEach(ev => {
          (ev.issues || []).forEach(issue => {
            if (issue.description && !pageIssues.some(pi => pi.description === issue.description)) {
              pageIssues.push(issue);
            }
          });
        });
      });

      if (pageIssues.length > 0) {
        ensureSpace(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.textTertiary);
        doc.text(`Identified Step Issues (${pageIssues.length})`, margin, y);
        y += 5;

        pageIssues.forEach(issue => {
          ensureSpace(12);
          const severity = issue.severity || 'moderate';
          const sevColor = severity === 'critical' ? COLORS.error :
                           severity === 'moderate' ? COLORS.warning : COLORS.success;

          const indentX = margin + 6;
          const textMaxW = pageWidth - margin - indentX;

          doc.setFillColor(...sevColor);
          doc.circle(margin + 2, y - 1, 1.2, 'F');

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...COLORS.textPrimary);

          const descLines = doc.splitTextToSize(sanitize(issue.description || ''), textMaxW);
          ensureSpace(descLines.length * 3.5 + 2);
          doc.text(descLines, indentX, y);
          y += descLines.length * 3.5;

          if (issue.recommendation) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.setTextColor(...COLORS.accent);
            const recLines = doc.splitTextToSize(`Recommendation: ${sanitize(issue.recommendation)}`, textMaxW);
            ensureSpace(recLines.length * 3 + 1);
            doc.text(recLines, indentX, y);
            y += recLines.length * 3;
          }
          y += 2;
        });
      }
      y += 4;
    });
  }

  // User Notes
  if (flowReport.notes?.length > 0) {
    ensureSpace(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text('User Notes', margin, y);
    y += 6;

    flowReport.notes.forEach(n => {
      const prefix = n.attachedToLabel ? `[Attached to ${n.attachedToLabel}] ` : '';
      const fullText = prefix + n.text;

      const wrapped = doc.splitTextToSize(sanitize(fullText), contentWidth - 8);
      const cardH = wrapped.length * 4 + 8;

      ensureSpace(cardH);
      doc.setFillColor(42, 37, 32);
      doc.rect(margin, y, contentWidth, cardH, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(232, 213, 168);
      doc.text(wrapped, margin + 4, y + 5);

      y += cardH + 4;
    });
  }

  // Add footer to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textTertiary);
    doc.text('Generated by synthux v2.0 - synthux.app', margin, pageHeight - 8);
    doc.text(`Page ${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return doc.output('blob');
}

// ─── Utility Functions ───────────────────────────────────────────────────────

function drawPageBg(doc, w, h) {
  doc.setFillColor(...COLORS.bg);
  doc.rect(0, 0, w, h, 'F');
}

function getScoreColor(score) {
  if (score >= 70) return COLORS.success;
  if (score >= 40) return COLORS.warning;
  return COLORS.error;
}

function getScoreGrade(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Critical';
}
