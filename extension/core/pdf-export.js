/**
 * synthux — PDF Export Module
 * 
 * Generates branded PDF reports from analysis results using jsPDF.
 * Produces vector text (selectable/searchable) with the Synthux design system.
 * 
 * Note: jsPDF built-in fonts only support Latin-1 characters.
 * All emoji/unicode symbols are stripped via sanitize().
 */

import { jsPDF } from 'jspdf';

// ─── Color Palette ───────────────────────────────────────────────────────────
const COLORS = {
  bg: [17, 17, 19],         // #111113
  card: [28, 28, 31],       // #1c1c1f
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
// Replace known unicode chars with Latin-1 equivalents, strip everything else.
function sanitize(text) {
  if (!text) return '';
  return String(text)
    // Replace common unicode punctuation with Latin-1 equivalents
    .replace(/[\u2018\u2019\u201A]/g, "'")   // Smart single quotes → '
    .replace(/[\u201C\u201D\u201E]/g, '"')   // Smart double quotes → "
    .replace(/[\u2013\u2014]/g, '-')          // En/em dash → -
    .replace(/[\u2026]/g, '...')              // Ellipsis → ...
    .replace(/[\u2022]/g, '*')               // Bullet → *
    .replace(/[\u00A0]/g, ' ')               // Non-breaking space → space
    .replace(/[\u2019]/g, "'")               // Right single quotation
    .replace(/[\u2192]/g, '->')              // Arrow →
    .replace(/[\u2190]/g, '<-')              // Arrow ←
    .replace(/[\u2264]/g, '<=')              // ≤
    .replace(/[\u2265]/g, '>=')              // ≥
    .replace(/[\u2260]/g, '!=')              // ≠
    // Remove emoji and symbols (all chars above Latin-1 that weren't replaced)
    .replace(/[^\x00-\xFF]/g, '')            // Strip ALL non-Latin-1
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
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawPageBg(doc, pageWidth, pageHeight);
    }
  };

  // Wrapped text helper: sets font, splits, draws, returns lines used
  const drawWrapped = (text, x, fontSize, color, fontStyle = 'normal', fontName = 'helvetica') => {
    doc.setFont(fontName, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const maxW = pageWidth - margin - x;
    const lines = doc.splitTextToSize(sanitize(text), maxW);
    ensureSpace(lines.length * (fontSize * 0.45) + 2);
    doc.text(lines, x, y);
    return lines;
  };

  // ─── Page Background ─────────────────────────────────────────────────
  drawPageBg(doc, pageWidth, pageHeight);

  // ─── Header ──────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.text('synthux', margin, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textTertiary);
  doc.text('AI-Powered UX Audit Report', margin + 38, y + 6);

  y += 14;

  // Divider
  doc.setDrawColor(...COLORS.divider);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ─── Meta Information ────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textSecondary);

  const metaMaxW = contentWidth;
  const metaLines = [
    `URL: ${report.url || 'N/A'}`,
    `Page: ${sanitize(report.title) || 'Untitled'}`,
    `Date: ${report.timestamp ? new Date(report.timestamp).toLocaleString() : 'N/A'}`,
    `Model: ${report.model || 'N/A'} - Mode: ${report.mode === 'deep' ? 'Deep (10 heuristics)' : 'Quick (3 heuristics)'}`,
  ];
  metaLines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, metaMaxW);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4;
  });
  y += 4;

  // ─── Overall Score ───────────────────────────────────────────────────
  ensureSpace(30);
  const scoreColor = getScoreColor(report.overallScore);
  
  // Score circle
  const circleCx = pageWidth / 2;
  doc.setFillColor(...scoreColor);
  doc.circle(circleCx, y + 10, 12, 'F');
  
  // Score number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.text(String(report.overallScore || 0), circleCx, y + 12, { align: 'center' });

  // Label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textTertiary);
  doc.text('Overall UX Score', circleCx, y + 26, { align: 'center' });
  y += 34;

  // ─── Per-Profile Results ─────────────────────────────────────────────
  const profiles = Object.values(report.profileResults || {});
  
  profiles.forEach(pr => {
    ensureSpace(20);

    // Profile header (strip emoji from profile icon)
    const profileName = sanitize(pr.profile.name?.en || 'Profile');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.white);
    doc.text(`${profileName} - ${pr.score}/100`, margin, y);
    y += 7;

    // Heuristic table
    const evaluations = pr.evaluations || [];
    
    // Table header
    doc.setFillColor(...COLORS.card);
    doc.rect(margin, y - 3, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textTertiary);
    doc.text('Heuristic', margin + 2, y);
    doc.text('Score', pageWidth - margin - 2, y, { align: 'right' });
    y += 5;

    evaluations.forEach(ev => {
      ensureSpace(6);
      const evColor = getScoreColor(ev.score);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.textSecondary);
      const hName = sanitize(ev.heuristicName?.en || ev.heuristicId);
      // Truncate long names to fit
      const hNameMaxW = contentWidth - 20;
      const truncated = doc.splitTextToSize(hName, hNameMaxW);
      doc.text(truncated[0] || hName, margin + 2, y);
      
      doc.setTextColor(...evColor);
      doc.text(`${ev.score}`, pageWidth - margin - 2, y, { align: 'right' });
      y += 4.5;
    });

    y += 4;

    // Issues for this profile
    const profileIssues = evaluations.flatMap(ev =>
      (ev.issues || []).map(i => ({ ...i, heuristic: ev.heuristicName?.en || ev.heuristicId }))
    );

    if (profileIssues.length > 0) {
      ensureSpace(8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text(`Issues (${profileIssues.length})`, margin, y);
      y += 5;

      profileIssues.forEach(issue => {
        ensureSpace(14);
        const sevColor = issue.severity === 'critical' ? COLORS.error :
                         issue.severity === 'moderate' ? COLORS.warning : COLORS.success;

        const indentX = margin + 6;
        const textMaxW = pageWidth - margin - indentX;

        // Severity dot
        doc.setFillColor(...sevColor);
        doc.circle(margin + 2, y - 1, 1.2, 'F');

        // Issue description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.textPrimary);
        const descText = sanitize(issue.description || '');
        const descLines = doc.splitTextToSize(descText, textMaxW);
        ensureSpace(descLines.length * 3.5 + 2);
        doc.text(descLines, indentX, y);
        y += descLines.length * 3.5;

        // Quick Win / Priority badge
        if (issue.isQuickWin || (issue.priority === 'high' && issue.fixEffort === 'easy')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(...COLORS.warning);
          doc.text('[Quick Win]', indentX, y);
          y += 3.5;
        }

        // Recommendation
        if (issue.recommendation) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7);
          doc.setTextColor(...COLORS.accent);
          const recText = sanitize(issue.recommendation);
          const recLines = doc.splitTextToSize(`> ${recText}`, textMaxW);
          ensureSpace(recLines.length * 3 + 1);
          doc.text(recLines, indentX, y);
          y += recLines.length * 3;
        }

        // Code fix
        if (issue.codeFix?.after) {
          const codeIndentX = margin + 8;
          // Courier is ~60% wider per char than Helvetica at same size
          // Use very conservative width for monospace
          const codeMaxW = (pageWidth - margin - codeIndentX) * 0.92;

          doc.setFont('courier', 'normal');
          doc.setFontSize(5);
          const fixText = sanitize(issue.codeFix.after);
          const fixLines = doc.splitTextToSize(fixText, codeMaxW);

          const lineH = 2.8;
          const boxH = fixLines.length * lineH + 7;
          ensureSpace(boxH + 2);

          // Background box
          doc.setFillColor(10, 10, 14);
          doc.rect(indentX - 1, y - 1, textMaxW + 1, boxH, 'F');

          // Language label
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6);
          doc.setTextColor(...COLORS.accent);
          doc.text(`${(issue.codeFix.language || 'css').toUpperCase()} fix:`, codeIndentX, y + 2);
          y += 5;

          // Code text
          doc.setFont('courier', 'normal');
          doc.setFontSize(5.5);
          doc.setTextColor(...COLORS.textSecondary);
          doc.text(fixLines, codeIndentX, y);
          y += fixLines.length * lineH + 2;

          // Reset font
          doc.setFont('helvetica', 'normal');
        }

        y += 2;
      });
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
    doc.text(`Accessibility Audit - ${a11y.score}/100`, margin, y);
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
  }

  // ─── Footer ──────────────────────────────────────────────────────────
  const addFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.textTertiary);
      doc.text('Generated by synthux - synthux.app', margin, pageHeight - 8);
      doc.text(`Page ${i}/${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  };
  addFooter();

  // Return as Blob
  return doc.output('blob');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function drawPageBg(doc, w, h) {
  doc.setFillColor(...COLORS.bg);
  doc.rect(0, 0, w, h, 'F');
}

function getScoreColor(score) {
  if (score >= 71) return COLORS.success;
  if (score >= 41) return COLORS.warning;
  return COLORS.error;
}
