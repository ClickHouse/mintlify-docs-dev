(function () {
  'use strict';

  // With an announcement banner configured, Next.js skips its scroll-to-top
  // on client-side navigation: the banner is position:fixed at the top of the
  // re-rendered segment, so the router considers the new page "already in
  // viewport" and leaves the scroll position where it was.
  //
  // Two-layer detection:
  //  1. Patch history.pushState/replaceState at eval time — covers tab-nav.js's
  //     own history.pushState() calls and any navigation before Next.js hydrates.
  //  2. setInterval at 100ms — covers the case where Next.js hydrates before
  //     this script runs and calls a cached reference to the original pushState,
  //     bypassing our wrapper. 100ms fires ~10×/sec (vs the original rAF loop
  //     at ~60×/sec) — same correctness guarantee with 6× less polling.
  //
  // Both paths are idempotent: check() compares lastPath before acting, so a
  // rapid pushState patch + interval tick never double-scrolls.
  //
  // Back/forward (popstate) is deliberately left alone so the browser and
  // router can restore the previous scroll position.

  (function patchHistory() {
    function wrap(orig) {
      return function () {
        var result = orig.apply(this, arguments);
        window.dispatchEvent(new Event('ch:navigate'));
        return result;
      };
    }
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
  })();

  var lastPath = window.location.pathname;
  var traversed = false;

  window.addEventListener('popstate', function () {
    if (window.location.pathname !== lastPath) {
      traversed = true;
    }
  });

  // The new page renders some frames after the path changes, so poll for the
  // anchor target before scrolling to it; if it never appears (bad anchor),
  // fall back to the top rather than keeping the old page's position.
  function scrollToAnchor(hash, framesLeft) {
    var id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (e) { id = hash.slice(1); }
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView();
      return;
    }
    if (framesLeft > 0 && window.location.hash === hash) {
      window.requestAnimationFrame(function () { scrollToAnchor(hash, framesLeft - 1); });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function check() {
    var path = window.location.pathname;
    if (path === lastPath) return;
    lastPath = path;
    if (traversed) {
      traversed = false;
    } else if (window.location.hash) {
      scrollToAnchor(window.location.hash, 180);
    } else {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('ch:navigate', check);
  setInterval(check, 100);
})();