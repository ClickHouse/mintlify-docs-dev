(function () {
  'use strict';

  // ── Desktop tab navigation ────────────────────────────────────────────────
  var TAB_URLS = {
    'Database':     '/',
    'Solutions':    '/products/cloud/getting-started/cloud-get-started',
    'Integrations': '/integrations/home',
  };

  function patchTabButtons() {
    // Only run on desktop
    if (window.innerWidth < 1024) return;

    document.querySelectorAll('button.nav-tabs-item, a.nav-tabs-item').forEach(function (el) {
      if (el.dataset.tabNavAttached) return;

      var labelDiv = el.querySelector('div');
      if (!labelDiv) return;

      var text = (labelDiv.textContent || '').trim();
      var url = TAB_URLS[text];
      if (!url) return;

      el.dataset.tabNavAttached = '1';

      if (el.tagName === 'A') {
        el.setAttribute('href', url);
        return;
      }

      labelDiv.style.cursor = 'pointer';
      labelDiv.addEventListener('click', function (e) {
        e.stopPropagation();
        window.location.href = url;
      });
    });
  }

  // ── Mobile section header styling ─────────────────────────────────────────
  var SECTION_HEADERS = ['ClickHouse', 'Open source'];

  function styleDropdownHeaders() {
    document.querySelectorAll('a.mobile-nav-tabs-item').forEach(function (a) {
      if (a.dataset.headerStyled) return;
      var text = (a.textContent || '').trim();
      if (SECTION_HEADERS.indexOf(text) === -1) return;

      a.dataset.headerStyled = '1';
      a.style.fontWeight = '700';
      a.style.fontSize = '0.75rem';
      a.style.letterSpacing = '0.05em';
      a.style.textTransform = 'uppercase';
      a.style.opacity = '0.5';
      a.style.pointerEvents = 'none';
      a.style.cursor = 'default';
      a.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      a.style.paddingBottom = '8px';
      a.style.marginBottom = '2px';

      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    patchTabButtons();
    styleDropdownHeaders();

    var observer = new MutationObserver(function () {
      patchTabButtons();
      styleDropdownHeaders();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('resize', patchTabButtons);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
