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

/* Gallery hover preview: pause belts and show full image overlay on hover */
(function () {
  function pauseBelts(paused) {
    document.querySelectorAll('.conveyor .belt').forEach(b => {
      b.style.animationPlayState = paused ? 'paused' : '';
    });
  }

  function showOverlay(src, alt) {
    let overlay = document.querySelector('.img-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'img-overlay';
      overlay.innerHTML = '<div class="close-hint">Click to close</div>';
      const img = document.createElement('img');
      overlay.appendChild(img);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 200);
        pauseBelts(false);
      });
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && document.querySelector('.img-overlay')) {
          const o = document.querySelector('.img-overlay');
          o.classList.remove('visible');
          setTimeout(() => o.remove(), 200);
          pauseBelts(false);
        }
      });
    }
    const imgEl = overlay.querySelector('img');
    imgEl.src = src;
    imgEl.alt = alt || '';
    pauseBelts(true);
    overlay.classList.add('visible');
  }

  function attach() {
    const imgs = document.querySelectorAll('.belt-img');
    imgs.forEach(img => {
      // Make images keyboard-focusable and announceable as interactive
      img.tabIndex = 0;
      img.setAttribute('role', 'button');

      // Use click/tap to open the overlay (no hover behavior)
      img.addEventListener('click', (e) => {
        showOverlay(img.src, img.alt);
      });

      // Support keyboard activation (Enter / Space)
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showOverlay(img.src, img.alt);
        }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach); else attach();
})();
