# synthux — Design System Reference

> Bu dosya bir AI agent'a veya tasarımcıya tasarım kararları hakkında bağlam vermek için hazırlanmıştır.

## Brand Identity

- **Name:** synthux (tamamı küçük harf)
- **Tagline:** AI-powered UX audit in your browser
- **Logo:** Text-only typemark — "synth" beyaz + "ux" mavi (#007eff)
- **License:** MIT

## Color Palette

### Extension (Side Panel)
| Token | Value | Usage |
|:---|:---|:---|
| `--sx-accent` | `#3b82f6` | Primary interactive, active states |
| `--sx-accent-dim` | `rgba(59,130,246,0.08)` | Active backgrounds |
| `--sx-bg-primary` | `#111113` | Main background |
| `--sx-bg-card` | `#1c1c1f` | Card surfaces |
| `--sx-text-primary` | `#ededf0` | Headings, primary text |
| `--sx-text-secondary` | `#b4b4bc` | Body text |
| `--sx-text-tertiary` | `#8a8a96` | Captions, meta |
| `--sx-border` | `rgba(255,255,255,0.06)` | Subtle borders |
| `--sx-border-hover` | `rgba(255,255,255,0.10)` | Hover borders |
| `--sx-success` | `#22c55e` | Pass, positive |
| `--sx-warning` | `#eab308` | Warning, moderate |
| `--sx-error` | `#ef4444` | Fail, critical |

### Website (Landing Page)
| Token | Value | Usage |
|:---|:---|:---|
| `--sx-blue` | `#007eff` | Brand blue, CTA buttons |
| `--sx-bg-primary` | `#0a0a0c` | Page background |
| `--sx-bg-secondary` | `#111114` | Alternate section bg |
| `--sx-bg-card` | `rgba(255,255,255,0.03)` | Card glassmorphism |

## Typography

| Context | Font | Weights |
|:---|:---|:---|
| Website | Inter | 400, 500, 600, 700, 800 |
| Extension | System (-apple-system, sans-serif) | 400, 500, 600, 700 |

### Scale
- H1: clamp(36px, 6vw, 64px), weight 800, tracking -1.5px
- H2: clamp(28px, 4vw, 40px), weight 800, tracking -0.8px
- H3: 17px, weight 700
- Body: 14px, weight 400
- Caption: 12px, weight 500
- Mono: 10px (element references)

## Spacing & Radius

| Token | Value |
|:---|:---|
| Section padding | 96px vertical |
| Card padding | 32px (website), 10-12px (extension) |
| `--sx-radius` | 16px (large cards) |
| `--sx-radius-sm` | 10px (smaller elements) |
| Extension radius | 6-8px |

## Icon System

- **Feature icons:** 22×22 SVG, stroke only, `#007eff`, stroke-width 2
- **Privacy icons:** 18×18 SVG, stroke only, `#22c55e`, stroke-width 2
- **No emojis** in UI — all icons are inline SVGs
- Icon containers: 44×44 with rounded bg (`--sx-blue-dim` or `rgba(34,197,94,0.1)`)

## Component Patterns

### Cards
- Background: `--sx-bg-card`
- Border: 1px solid `--sx-border`
- Hover: background → `--sx-bg-card-hover`, border → `--sx-border-hover`, translateY(-4px)
- Transition: 250ms ease

### Buttons
| Type | Style |
|:---|:---|
| Primary | Solid `--sx-blue`, white text, 14px 28px, radius 12px |
| Secondary | `--sx-bg-card` bg, border, white text, 14px 28px, radius 12px |
| Nav CTA | Solid `--sx-blue`, 8px 18px, radius 8px |

### Score Badges
| Range | Color | Class |
|:---|:---|:---|
| 71-100 | `--sx-success` | `.high` |
| 41-70 | `--sx-warning` | `.mid` |
| 0-40 | `--sx-error` | `.low` |

### Severity Indicators
| Level | Color | Dot size |
|:---|:---|:---|
| Critical | `--sx-error` (#ef4444) | 6px |
| Moderate | `--sx-warning` (#eab308) | 6px |
| Minor | `--sx-success` (#22c55e) | 6px |

## Animation

- Fade-in: opacity 0→1, translateY(24px→0), 600ms ease (triggered by IntersectionObserver)
- Hover lift: translateY(-2px to -4px), box-shadow with `--sx-blue-glow`
- Transitions: 150ms ease (extension), 200-250ms ease (website)

## Layout

### Website
- Max width: 1120px, centered
- Grid: 3-column (features, steps), 2-column (privacy)
- Responsive breakpoints: 900px → 2-col, 600px → 1-col

### Extension Side Panel
- Fixed width browser panel (~380px)
- Single column, scrollable
- Sticky elements: export bar (bottom)

## Dark Theme

- Everything is dark-first, no light mode
- Background hierarchy: `#0a0a0c` → `#111114` → `rgba(255,255,255,0.03)`
- Text hierarchy: `#ededf0` → `#b4b4bc` → `#8a8a96`
- Borders are white with very low opacity (0.06-0.14)

## Export Format

- Reports export as `design-change.md` (Markdown)
- Includes: metadata table, overall score, per-profile heuristic scores, issues with severity/recommendation, accessibility audit, priority matrix
- Footer links back to synthux.app

## File Structure

```
website/           → Landing page (static HTML/CSS/JS)
  ├── index.html   → Main page
  ├── style.css    → Design system + all styles
  ├── script.js    → Animations, scroll effects
  ├── i18n.js      → EN/TR translations
  └── assets/      → Logo, favicon, screenshot

extension/         → Chrome extension
  └── sidepanel/   → Side panel UI (Lit components)

src/sidepanel/     → Source components (pre-build)
  └── components/  → synthux-scanner, synthux-report, synthux-score, synthux-settings
```
