// Theme toggle with SVG icon swap (sun/moon)
(() => {
  const SUN_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2m16 0h2M6.35 17.65l1.42-1.42M16.23 6.35l1.42-1.42"/></svg>`;
  const MOON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z"/></svg>`;

  function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    try { localStorage.setItem('prefersDark', isDark ? '1' : '0'); } catch (e) {}
    updateIcon();
  }

  function updateIcon() {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    const iconSpan = toggle.querySelector('.icon');
    const isDark = document.body.classList.contains('dark-theme');
    if (iconSpan) iconSpan.innerHTML = isDark ? SUN_SVG : MOON_SVG;
    toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggle.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function init() {
    let isDark = false;
    try { isDark = localStorage.getItem('prefersDark') === '1'; } catch (e) {}
    if (isDark) document.body.classList.add('dark-theme');
    updateIcon();
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-theme')));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
