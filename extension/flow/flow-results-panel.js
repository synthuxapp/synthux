import { generateFlowPDF } from './pdf-export.bundled.js';

const resultsPanel = document.getElementById('results-panel');
const resultsBody = document.getElementById('results-body');
const resultsToggle = document.getElementById('results-toggle');

// Toggle collapse
resultsToggle?.addEventListener('click', () => {
  resultsPanel.classList.toggle('collapsed');
});

// Expose show function
window.__synthux_showResults = function showResults(flowReport) {
  if (!flowReport) return;
  resultsPanel.hidden = false;

  const { flowScore, pages, crossPage, notes, transitions } = flowReport;

  // Score color
  const scoreClass = flowScore >= 70 ? 'node-score--good' : flowScore >= 50 ? 'node-score--warning' : 'node-score--bad';

  // Cross-page findings
  const findingsHtml = (crossPage?.findings || []).map(f => `
    <div class="finding-card">
      <div class="finding-card__title">${escapeHtml(f.title)}</div>
      <div class="finding-card__desc">${escapeHtml(f.description)}</div>
    </div>
  `).join('');

  // Transitions analysis HTML
  const transitionsHtml = (transitions || []).map(t => {
    const fromPage = (pages || []).find(p => (p.page?.id || p.id) === t.fromId);
    const toPage = (pages || []).find(p => (p.page?.id || p.id) === t.toId);
    const fromLabel = fromPage?.page?.label || t.fromId;
    const toLabel = toPage?.page?.label || t.toId;
    const qClass = t.quality === 'smooth' ? 'node-score--good' : t.quality === 'friction' ? 'node-score--warning' : 'node-score--bad';
    return `
      <div class="finding-card">
        <div class="finding-card__title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
          <span style="font-weight: 500;">${escapeHtml(fromLabel)} ➔ ${escapeHtml(toLabel)}</span>
          <span class="node-score ${qClass}" style="font-size:10px; font-weight:600; padding:2px 6px; border-radius:4px; min-width:auto; height:auto; text-transform:uppercase;">${t.quality}</span>
        </div>
        <div class="finding-card__desc">${escapeHtml(t.description)}</div>
      </div>
    `;
  }).join('');

  // Page cards
  const pagesHtml = (pages || []).map(p => {
    const sc = p.report?.overallScore || p.score || 0;
    const scClass = sc >= 70 ? 'node-score--good' : sc >= 50 ? 'node-score--warning' : 'node-score--bad';
    return `
      <div class="result-page-card" data-node-id="${p.page?.id || ''}" title="Click to focus">
        <div class="result-page-card__title">${escapeHtml(p.page?.label || p.page?.url || '')}</div>
        <div class="result-page-card__score ${scClass}">${sc}</div>
      </div>
    `;
  }).join('');

  // User notes section
  const notesHtml = notes && notes.length > 0 ? `
    <div style="margin-top:16px;">
      <div class="receipt-section__title">User Notes</div>
      ${notes.map(n => `
        <div class="finding-card" style="border-color:var(--sx-note-border);background:var(--sx-note-bg);">
          <div class="finding-card__desc" style="color:var(--sx-note-text);">${escapeHtml(n.text)}</div>
          ${n.attachedTo ? `<div style="font-size:9px;color:var(--sx-text-tertiary);margin-top:4px;">Attached to: ${escapeHtml(n.attachedToLabel || n.attachedTo)}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  // Export button
  const exportHtml = `
    <div style="margin-top:16px;display:flex;gap:8px;">
      <button id="export-md" class="tb-btn tb-btn--primary">Export Markdown</button>
      <button id="export-pdf" class="tb-btn tb-btn--primary">Export PDF</button>
    </div>
  `;

  resultsBody.innerHTML = `
    <div class="flow-score">
      <div>
        <div class="flow-score__value ${scoreClass}">${flowScore || '--'}</div>
        <div class="flow-score__label">Flow Score</div>
      </div>
      <div>
        <div class="flow-score__breakdown">${pages?.length || 0} pages analyzed</div>
        <div class="flow-score__breakdown">${crossPage?.findings?.length || 0} cross-page findings</div>
        ${transitions?.length ? `<div class="flow-score__breakdown">${transitions.length} transitions assessed</div>` : ''}
        ${notes?.length ? `<div class="flow-score__breakdown">${notes.length} user notes</div>` : ''}
      </div>
    </div>
    ${findingsHtml ? `<div class="receipt-section__title">Cross-Page Findings</div>${findingsHtml}` : ''}
    ${transitionsHtml ? `<div class="receipt-section__title" style="margin-top:16px;">Transitions</div>${transitionsHtml}` : ''}
    <div class="receipt-section__title" style="margin-top:16px;">Pages</div>
    <div class="result-pages">${pagesHtml}</div>
    ${notesHtml}
    ${exportHtml}
  `;

  // Page card click → zoom to node
  resultsBody.querySelectorAll('.result-page-card').forEach(card => {
    card.addEventListener('click', () => {
      const nodeId = card.dataset.nodeId;
      const canvas = window.__synthux_canvas;
      if (canvas && nodeId) {
        const node = canvas.nodes.get(nodeId);
        if (node) {
          canvas.viewport.x = -node.x * canvas.viewport.zoom + canvas._viewportEl.clientWidth / 2 - 100;
          canvas.viewport.y = -node.y * canvas.viewport.zoom + canvas._viewportEl.clientHeight / 2 - 80;
          canvas._applyTransform();
          canvas._select('node', nodeId);
        }
      }
    });
  });

  // Export Markdown
  resultsBody.querySelector('#export-md')?.addEventListener('click', () => {
    const md = generateMarkdown(flowReport);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthux-flow-report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Export PDF
  resultsBody.querySelector('#export-pdf')?.addEventListener('click', () => {
    try {
      const blob = generateFlowPDF(flowReport);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `synthux-flow-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[flow] Export PDF failed:', err);
    }
  });
};

function generateMarkdown(report) {
  const lines = [
    '# synthux Flow Analysis Report',
    '',
    `**Flow Score: ${report.flowScore}/100**`,
    `**Date:** ${new Date().toLocaleDateString()}`,
    `**Pages:** ${report.pages?.length || 0}`,
    '',
    '---',
    '',
    '## Page Results',
    ''
  ];

  for (const p of (report.pages || [])) {
    const score = p.report?.overallScore || p.score || 0;
    lines.push(`### ${p.page?.label || p.page?.url}`);
    lines.push(`- **Score:** ${score}/100`);
    lines.push(`- **URL:** ${p.page?.url}`);
    if (p.report?.summary) lines.push(`- **Summary:** ${p.report.summary}`);
    lines.push('');
  }

  if (report.transitions?.length) {
    lines.push('## Transitions');
    lines.push('');
    for (const t of report.transitions) {
      const fromPage = report.pages.find(p => (p.page?.id || p.id) === t.fromId);
      const toPage = report.pages.find(p => (p.page?.id || p.id) === t.toId);
      const fromLabel = fromPage?.page?.label || t.fromId;
      const toLabel = toPage?.page?.label || t.toId;
      lines.push(`### ${fromLabel} ➔ ${toLabel}`);
      lines.push(`- **Quality:** ${t.quality.toUpperCase()}`);
      lines.push(`- **Details:** ${t.description}`);
      lines.push('');
    }
  }

  if (report.crossPage?.findings?.length) {
    lines.push('## Cross-Page Findings');
    lines.push('');
    for (const f of report.crossPage.findings) {
      lines.push(`### ${f.title}`);
      lines.push(f.description);
      lines.push('');
    }
  }

  if (report.notes?.length) {
    lines.push('## User Notes');
    lines.push('');
    for (const n of report.notes) {
      const prefix = n.attachedToLabel ? `[${n.attachedToLabel}] ` : '';
      lines.push(`- ${prefix}${n.text}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Generated by synthux Flow Builder*');
  return lines.join('\n');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
