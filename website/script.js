/* synthux Landing Page — Interactions */

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language
  applyLanguage(getLanguage());

  // Apply saved theme
  applyTheme(getSavedTheme());

  // Scroll fade-in observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 40
        ? 'var(--sx-nav-bg-scroll)'
        : 'var(--sx-nav-bg)';
    }, { passive: true });
  }

  // Fetch latest version from GitHub manifest.json
  const versionBadge = document.getElementById('version-badge');
  if (versionBadge) {
    fetch('https://raw.githubusercontent.com/synthuxapp/synthux/main/extension/manifest.json')
      .then(r => r.json())
      .then(manifest => {
        versionBadge.innerHTML = `v${manifest.version} · <a href="https://github.com/synthuxapp/synthux" target="_blank">Open Source</a>`;
      })
      .catch(() => {});
  }
});

/* ─── Theme System ─── */
const THEME_KEY = 'synthux_theme';
const THEMES = ['system', 'light', 'dark'];
const THEME_ICONS = { system: '◑', light: '☀️', dark: '🌙' };

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = THEME_ICONS[theme] || '◑';
    btn.title = `Theme: ${theme}`;
  }
}

function cycleTheme() {
  const current = getSavedTheme();
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
}
