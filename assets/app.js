/* Progressive enhancement only: the page is complete and readable with this
   file blocked. Everything here adds motion or polish, nothing adds content. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Tells the inline guard that this file made it, so it stops its own timer.
  root.dataset.revealReady = '1';

  /* ---------------------------------------------------------- theme ---- */
  const THEME_KEY = 'gatewayiran-theme';
  const stored = (() => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  })();
  const system = matchMedia('(prefers-color-scheme: light)');

  const apply = theme => {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#FFFFFF' : '#0A0D14';
  };

  apply(stored || (system.matches ? 'light' : 'dark'));

  // Follow the system only while the visitor has not made a choice.
  system.addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch { /* private mode */ }
    if (!saved) apply(e.matches ? 'light' : 'dark');
  });

  document.getElementById('theme')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode */ }
  });

  /* ------------------------------------------------- scroll progress ---- */
  const progress = document.getElementById('progress');
  const top = document.getElementById('top');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      const ratio = scrollable > 0 ? scrollY / scrollable : 0;
      if (progress) progress.style.width = (ratio * 100).toFixed(2) + '%';
      top?.classList.toggle('stuck', scrollY > 8);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------- reveal ------- */
  const targets = document.querySelectorAll('[data-reveal]');

  const revealAll = () => {
    targets.forEach(el => el.classList.add('in'));
    root.classList.remove('reveal-armed');
  };

  if (reduced.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    // Backstop: whatever the observer does or does not report, nothing stays
    // hidden past this point.
    setTimeout(revealAll, 2500);

    const seen = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // Stagger within a group so a row of cards arrives as a wave.
        const siblings = [...entry.target.parentElement.children]
          .filter(n => n.hasAttribute('data-reveal'));
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(index * 70, 420) + 'ms';
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(el => seen.observe(el));
  }

  /* ------------------------------------------ pointer-tracked glows ---- */
  if (!reduced.matches && matchMedia('(hover: hover)').matches) {
    const spotlight = document.getElementById('spotlight');
    let pending = null;

    addEventListener('pointermove', e => {
      pending = e;
      if (pending.__queued) return;
      pending.__queued = true;
      requestAnimationFrame(() => {
        const ev = pending;
        pending = null;
        if (!ev) return;
        if (spotlight) {
          spotlight.style.setProperty('--mx', (ev.clientX / innerWidth * 100).toFixed(2) + '%');
          spotlight.style.setProperty('--my', (ev.clientY / innerHeight * 100).toFixed(2) + '%');
        }
      });
    }, { passive: true });

    // Local glow inside cards and buttons, so the highlight tracks the cursor
    // rather than sitting in the middle of the element.
    const local = (selector, xVar, yVar) => {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('pointermove', e => {
          const box = el.getBoundingClientRect();
          el.style.setProperty(xVar, (e.clientX - box.left) + 'px');
          el.style.setProperty(yVar, (e.clientY - box.top) + 'px');
        }, { passive: true });
      });
    };
    local('.card', '--cx', '--cy');
    local('.btn-primary', '--bx', '--by');
  }

  /* ---------------------------------------------- theme-aware art ------ */
  // Artwork ships in two tones. Swapping the source with the theme beats
  // shipping one washed-out version that suits neither background.
  const themed = document.querySelectorAll('img.themed');
  if (themed.length) {
    const swap = () => {
      const key = root.dataset.theme === 'light' ? 'light' : 'dark';
      themed.forEach(img => {
        const want = img.dataset[key];
        if (want && !img.getAttribute('src').endsWith(want)) img.setAttribute('src', want);
      });
    };
    swap();
    new MutationObserver(swap).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* --------------------------------------------------- typed cursor ---- */
  // Nothing types itself: a caret that blinks reads as a live terminal without
  // hiding the output behind an animation the visitor has to wait out.
})();
