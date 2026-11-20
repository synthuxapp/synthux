import { generateFlowPDF } from './pdf-export.bundled.js';

const resultsPanel = document.getElementById('results-panel');
const resultsBody = document.getElementById('results-body');
const resultsToggle = document.getElementById('results-toggle');

let currentTab = 'overview';
let lastFlowReport = null;

resultsToggle?.addEventListener('click', () => {
  resultsPanel.classList.toggle('collapsed');
});

window.__synthux_showResults = function showResults(flowReport) {
  if (!flowReport) return;
  lastFlowReport = flowReport;
  resultsPanel.hidden = false;
  resultsPanel.classList.remove('collapsed');
  renderResultsPanel();
};

function renderResultsPanel() {
  const flowReport = lastFlowReport;
  if (!flowReport) return;

  const { flowScore, pages = [], crossPage = {}, notes = [], transitions = [], businessAlignment = null } = flowReport;
  const scoreClass = flowScore >= 70 ? 'node-score--good' : flowScore >= 50 ? 'node-score--warning' : 'node-score--bad';

  const tabsHtml = `
    <div class="results-tabs">
      <button class="results-tab ${currentTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
      <button class="results-tab ${currentTab === 'steps' ? 'active' : ''}" data-tab="steps">Steps (${pages.length})</button>
      <button class="results-tab ${currentTab === 'transitions' ? 'active' : ''}" data-tab="transitions">Links (${transitions.length})</button>
      ${businessAlignment ? `<button class="results-tab ${currentTab === 'business' ? 'active' : ''}" data-tab="business">Goals</button>` : ''}
    </div>
  `;

  let tabContentHtml = '';

  if (currentTab === 'overview') {
    const findingsHtml = (crossPage?.findings || []).map(f => `
      <div class="finding-card">
        <div class="finding-card__title">${escapeHtml(f.title)}</div>
        <div class="finding-card__desc">${escapeHtml(f.description)}</div>
      </div>
    `).join('');

    const notesHtml = notes && notes.length > 0 ? `
      <div style="margin-top:12px;">
        <div class="receipt-section__title">Sticky Notes</div>
        ${notes.map(n => `
          <div class="finding-card" style="border-color:var(--sx-note-border);background:var(--sx-note-bg);">
            <div class="finding-card__desc" style="color:var(--sx-note-text);">${escapeHtml(n.text)}</div>
            ${n.attachedTo ? `<div style="font-size:9px;color:var(--sx-text-tertiary);margin-top:4px;">Attached to: ${escapeHtml(n.attachedToLabel || n.attachedTo)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    tabContentHtml = `
      <div class="flow-score">
        <div>
          <div class="flow-score__value ${scoreClass}">${flowScore || '--'}</div>
          <div class="flow-score__label">Flow Score</div>
        </div>
        <div>
          <div class="flow-score__breakdown">${pages.length} steps analyzed</div>
          <div class="flow-score__breakdown">Consistency: ${crossPage?.score ?? flowScore ?? '--'}/100</div>
          ${businessAlignment ? `<div class="flow-score__breakdown" style="color:var(--sx-accent);font-weight:600;">Goal Fit: ${businessAlignment.goalAlignmentScore}/100</div>` : ''}
        </div>
      </div>
      ${findingsHtml ? `<div class="receipt-section__title">Cross-Page Findings</div>${findingsHtml}` : '<div style="font-size:11px;color:var(--sx-text-tertiary);">No cross-page conflicts detected.</div>'}
      ${notesHtml}
    `;
  } else if (currentTab === 'steps') {
    tabContentHtml = pages.map((p, idx) => {
      const sc = p.report?.overallScore ?? p.score ?? 0;
      const scClass = sc >= 70 ? 'node-score--good' : sc >= 50 ? 'node-score--warning' : 'node-score--bad';
      const issuesList = (p.report?.issues || []).map(iss => {
        const desc = typeof iss === 'string' ? iss : (iss.description || iss.title || '');
        return `<div style="font-size:11px;color:var(--sx-text-secondary);padding:2px 0;">• ${escapeHtml(desc)}</div>`;
      }).join('');
      return `
        <div class="finding-card result-page-card" data-node-id="${escapeHtml(p.page?.id || '')}" style="cursor:pointer;display:block;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:12px;font-weight:600;color:var(--sx-text-primary);">S${idx + 1}: ${escapeHtml(p.page?.label || p.page?.url || '')}</span>
            <span class="result-page-card__score ${scClass}">${sc}/100</span>
          </div>
          ${p.report?.summary ? `<div style="font-size:11px;color:var(--sx-text-tertiary);margin-bottom:4px;">${escapeHtml(p.report.summary)}</div>` : ''}
          ${issuesList}
        </div>
      `;
    }).join('');
  } else if (currentTab === 'transitions') {
    tabContentHtml = transitions.length > 0 ? transitions.map(t => {
      const fromPage = pages.find(p => (p.page?.id || p.id) === t.fromId);
      const toPage = pages.find(p => (p.page?.id || p.id) === t.toId);
      const fromLabel = fromPage?.page?.label || t.fromId;
      const toLabel = toPage?.page?.label || t.toId;
      const qClass = t.quality === 'smooth' ? 'node-score--good' : t.quality === 'friction' ? 'node-score--warning' : 'node-score--bad';
      return `
        <div class="finding-card">
          <div class="finding-card__title" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-weight:600;">${escapeHtml(fromLabel)} ➔ ${escapeHtml(toLabel)}</span>
            <span class="node-score ${qClass}" style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;min-width:auto;height:auto;text-transform:uppercase;">${escapeHtml(t.quality)}</span>
          </div>
          <div class="finding-card__desc">${escapeHtml(t.description)}</div>
        </div>
      `;
    }).join('') : '<div style="font-size:11px;color:var(--sx-text-tertiary);">No transitions assessed.</div>';
  } else if (currentTab === 'business' && businessAlignment) {
    const ba = businessAlignment;
    const mustsHtml = (ba.mustHavesAudit || []).map(m => {
      const color = m.status === 'pass' ? '#22c55e' : m.status === 'partial' ? '#eab308' : '#ef4444';
      return `
        <div class="finding-card" style="margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span style="font-size:11px;font-weight:600;color:var(--sx-text-primary);">${escapeHtml(m.item)}</span>
            <span style="font-size:9px;font-weight:700;color:${color};text-transform:uppercase;">${escapeHtml(m.status)}</span>
          </div>
          ${m.evidence ? `<div style="font-size:10px;color:var(--sx-text-tertiary);">${escapeHtml(m.evidence)}</div>` : ''}
          ${m.status !== 'pass' && m.recommendation ? `<div style="font-size:10px;color:var(--sx-accent);margin-top:2px;">→ ${escapeHtml(m.recommendation)}</div>` : ''}
        </div>
      `;
    }).join('');

    const deptsHtml = (ba.departmentFindings || []).map(df => `
      <div class="finding-card" style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <span style="font-size:11px;font-weight:600;color:var(--sx-text-primary);">${escapeHtml(df.departmentName)}</span>
          <span style="font-size:10px;font-weight:700;color:var(--sx-accent);">${df.score}/100</span>
        </div>
        <div style="font-size:10px;color:var(--sx-text-secondary);">${escapeHtml(df.summary)}</div>
      </div>
    `).join('');

    tabContentHtml = `
      <div class="finding-card" style="border-color:rgba(59,130,246,0.35);margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:12px;font-weight:700;color:var(--sx-text-primary);">${escapeHtml(ba.contextName || 'Goal Alignment')}</span>
          <span style="font-size:12px;font-weight:700;color:var(--sx-accent);">${ba.goalAlignmentScore}/100</span>
        </div>
        ${ba.primaryGoal ? `<div style="font-size:11px;color:var(--sx-accent);margin-bottom:3px;">Goal: ${escapeHtml(ba.primaryGoal)}</div>` : ''}
        <div style="font-size:11px;color:var(--sx-text-secondary);">${escapeHtml(ba.goalSummary || '')}</div>
      </div>
      ${mustsHtml ? `<div class="receipt-section__title">Must-Haves Compliance</div>${mustsHtml}` : ''}
      ${deptsHtml ? `<div class="receipt-section__title" style="margin-top:10px;">Department Lenses</div>${deptsHtml}` : ''}
    `;
  }

  const exportHtml = `
    <div style="margin-top:14px;display:flex;gap:6px;">
      <button id="copy-flow-md" class="tb-btn" style="flex:1;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>Copy MD</span>
      </button>
      <button id="export-md" class="tb-btn tb-btn--primary" style="flex:1;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>.MD</span>
      </button>
      <button id="export-pdf" class="tb-btn tb-btn--accent" style="flex:1;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>PDF</span>
      </button>
    </div>
  `;

  resultsBody.innerHTML = `${tabsHtml}${tabContentHtml}${exportHtml}`;

  // Tab switch events
  resultsBody.querySelectorAll('.results-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      renderResultsPanel();
    });
  });

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

  // Copy Markdown
  resultsBody.querySelector('#copy-flow-md')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const span = btn.querySelector('span');
    const md = generateMarkdown(flowReport);
    navigator.clipboard.writeText(md).then(() => {
      if (span) span.textContent = 'Copied';
      setTimeout(() => { if (span) span.textContent = 'Copy MD'; }, 2000);
    });
  });

  // Download Markdown
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

  // Download PDF
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
}

export function generateMarkdown(report) {
  const lines = [
    '# synthux Flow Journey Report (v2.2)',
    '',
    '| Property | Value |',
    '|:---|:---|',
    `| **Overall Flow Score** | **${report.flowScore}/100** |`,
    `| **Cross-Page Consistency** | **${report.crossPage?.score ?? report.flowScore}/100** |`,
    ...(report.businessAlignment
      ? [`| **Business Goal Alignment** | **${report.businessAlignment.goalAlignmentScore}/100** (${report.businessAlignment.contextName || 'Active'}) |`]
      : []),
    `| **Date** | ${new Date().toLocaleString()} |`,
    `| **Total Pages** | ${report.pages?.length || 0} |`,
    `| **Transitions Assessed** | ${report.transitions?.length || 0} |`,
    ''
  ];

  if (report.businessAlignment) {
    const ba = report.businessAlignment;
    lines.push('---');
    lines.push('');
    lines.push(`## Business Goal, Must-Haves & Department Alignment — ${ba.goalAlignmentScore}/100`);
    if (ba.primaryGoal) lines.push(`- **Primary Goal:** ${ba.primaryGoal}`);
    if (ba.goalSummary) lines.push(`- **Summary:** ${ba.goalSummary}`);
    lines.push('');
    if (Array.isArray(ba.mustHavesAudit) && ba.mustHavesAudit.length > 0) {
      lines.push('### Non-Negotiable Must-Haves');
      ba.mustHavesAudit.forEach(m => {
        lines.push(`- **[${m.status.toUpperCase()}] ${m.item}** — ${m.evidence || ''} ${m.status !== 'pass' && m.recommendation ? `(Fix: ${m.recommendation})` : ''}`);
      });
      lines.push('');
    }
    if (Array.isArray(ba.departmentFindings) && ba.departmentFindings.length > 0) {
      lines.push('### Department Lenses');
      ba.departmentFindings.forEach(df => {
        lines.push(`- **${df.departmentName} (${df.score}/100):** ${df.summary}`);
      });
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('## Step-by-Step Page Results');
  lines.push('');

  for (let idx = 0; idx < (report.pages || []).length; idx++) {
    const p = report.pages[idx];
    const score = p.report?.overallScore ?? p.score ?? 0;
    lines.push(`### Step ${idx + 1}: ${p.page?.label || p.page?.url}`);
    lines.push(`- **Score:** ${score}/100`);
    lines.push(`- **URL:** ${p.page?.url}`);
    if (p.page?.stepGoal) lines.push(`- **Step Goal:** ${p.page.stepGoal}`);
    if (p.page?.dropOffMetric) lines.push(`- **Metric / Drop-Off:** ${p.page.dropOffMetric}`);
    if (p.report?.summary) lines.push(`- **Summary:** ${p.report.summary}`);
    if (Array.isArray(p.report?.issues) && p.report.issues.length > 0) {
      lines.push(`- **Identified Step Issues (${p.report.issues.length}):**`);
      p.report.issues.forEach(issue => {
        const desc = typeof issue === 'string' ? issue : (issue.description || issue.title || '');
        const sev = (typeof issue === 'object' && issue.severity) ? `[${issue.severity.toUpperCase()}] ` : '';
        if (desc) lines.push(`  - ${sev}${desc}`);
      });
    }
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
  lines.push('*Generated by synthux Flow Builder 2.0*');
  return lines.join('\n');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
