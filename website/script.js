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
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Close mobile drawer when clicking any link inside it
  document.querySelectorAll('.nav-mobile-drawer a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close desktop Solutions dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav-solutions-item')) {
      document.querySelectorAll('.nav-item.dropdown-open').forEach(el => {
        el.classList.remove('dropdown-open');
        const trigger = el.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns and mobile drawer on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-item.dropdown-open').forEach(el => {
        el.classList.remove('dropdown-open');
        const trigger = el.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.lang-picker.open').forEach(el => el.classList.remove('open'));
      closeMobileMenu();
    }
  });

  // Close mobile drawer automatically if viewport resizes above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
  }, { passive: true });

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 40
        ? 'var(--sx-nav-bg-scroll)'
        : 'var(--sx-nav-bg)';
    }, { passive: true });
  }

  // Fetch latest version from GitHub manifest.json and sync both hero badge and nav pill
  const versionBadge = document.getElementById('version-badge');
  const navVerPills = document.querySelectorAll('.nav-ver-pill');
  if (versionBadge || navVerPills.length > 0) {
    fetch('https://raw.githubusercontent.com/synthuxapp/synthux/main/extension/manifest.json')
      .then(r => r.json())
      .then(manifest => {
        if (versionBadge) {
          versionBadge.innerHTML = `v${manifest.version} · <a href="https://github.com/synthuxapp/synthux" target="_blank">Open Source</a>`;
        }
        const shortVer = manifest.version.split('.').slice(0, 2).join('.');
        navVerPills.forEach(pill => {
          pill.textContent = `v${shortVer}`;
        });
      })
      .catch(() => {});
  }
});

/* ─── Navigation Dropdown & Mobile Drawer ─── */
function toggleSolutionsDropdown(e) {
  if (e) e.stopPropagation();
  const item = document.getElementById('nav-solutions-item');
  if (!item) return;
  const isOpen = item.classList.toggle('dropdown-open');
  const trigger = item.querySelector('.nav-link');
  if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.querySelectorAll('.lang-picker.open').forEach(el => el.classList.remove('open'));
}

function toggleMobileMenu() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const isOpen = nav.classList.toggle('mobile-open');
  const btn = document.getElementById('nav-mobile-toggle');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  const nav = document.querySelector('.nav');
  if (!nav || !nav.classList.contains('mobile-open')) return;
  nav.classList.remove('mobile-open');
  const btn = document.getElementById('nav-mobile-toggle');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─── Theme System ─── */
const THEME_KEY = 'synthux_theme';
const THEMES = ['system', 'light', 'dark'];
const THEME_ICONS = {
  system: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><span>Auto</span>',
  light: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span>Light</span>',
  dark: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Dark</span>'
};

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = THEME_ICONS[theme] || THEME_ICONS.system;
    btn.title = `Theme: ${theme}`;
  }

  // Swap logo src based on resolved theme
  const isLight = theme === 'light' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.querySelectorAll('.logo-img').forEach(img => {
    const currentSrc = img.getAttribute('src') || '';
    const prefix = currentSrc.includes('../assets/') ? '../assets/' : (currentSrc.startsWith('/assets/') ? '/assets/' : 'assets/');
    img.src = prefix + (isLight ? 'logo-dark.svg' : 'logo.svg');
  });
}

function cycleTheme() {
  const current = getSavedTheme();
  const idx = THEMES.indexOf(current);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
}
