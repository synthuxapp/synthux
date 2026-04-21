/**
 * synthux — Score Component
 * 
 * <synthux-score> — Minimal circular score gauge
 * Animated SVG ring with muted color coding
 */

import { LitElement, html, css } from 'lit';

export class SynthuxScore extends LitElement {
  static properties = {
    value: { type: Number },
    label: { type: String },
    size: { type: String },
    animated: { type: Boolean },
    _displayValue: { type: Number, state: true }
  };

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .score-ring {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg { transform: rotate(-90deg); }

    .ring-bg {
      fill: none;
      stroke: var(--sx-bg-tertiary, #202024);
      stroke-width: 4;
    }

    .ring-fill {
      fill: none;
      stroke-width: 4;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ring-fill.high { stroke: var(--sx-score-high, #22c55e); }
    .ring-fill.mid { stroke: var(--sx-score-mid, #eab308); }
    .ring-fill.low { stroke: var(--sx-score-low, #ef4444); }

    .score-value {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .score-number {
      font-weight: 700;
      line-height: 1;
      color: var(--sx-text-primary, #ededf0);
    }

    .score-max {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 500;
    }

    .score-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.value = 0;
    this.label = '';
    this.size = 'md';
    this.animated = true;
    this._displayValue = 0;
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.animated ? this._animateValue() : (this._displayValue = this.value);
    }
  }

  _animateValue() {
    const start = this._displayValue || 0;
    const end = this.value || 0;
    const duration = 700;
    const startTime = performance.now();
    const animate = (t) => {
      const p = Math.min((t - startTime) / duration, 1);
      this._displayValue = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  _getColorClass() {
    if (this.value >= 71) return 'high';
    if (this.value >= 41) return 'mid';
    return 'low';
  }

  _getDims() {
    switch (this.size) {
      case 'sm': return { s: 56, r: 22, f: 14 };
      case 'lg': return { s: 110, r: 46, f: 28 };
      default: return { s: 80, r: 34, f: 20 };
    }
  }

  render() {
    const d = this._getDims();
    const c = 2 * Math.PI * d.r;
    const offset = c - (c * (this.value || 0)) / 100;

    return html`
      <div class="score-ring" style="width:${d.s}px;height:${d.s}px;">
        <svg width="${d.s}" height="${d.s}" viewBox="0 0 ${d.s} ${d.s}">
          <circle class="ring-bg" cx="${d.s/2}" cy="${d.s/2}" r="${d.r}"/>
          <circle class="ring-fill ${this._getColorClass()}" cx="${d.s/2}" cy="${d.s/2}" r="${d.r}" stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="score-value">
          <span class="score-number" style="font-size:${d.f}px">${this._displayValue}</span>
          <span class="score-max">/100</span>
        </div>
      </div>
      ${this.label ? html`<span class="score-label">${this.label}</span>` : ''}
    `;
  }
}

customElements.define('synthux-score', SynthuxScore);
