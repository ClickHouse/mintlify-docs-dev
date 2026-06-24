(function () {
  'use strict';

  // With an announcement banner configured, Next.js skips its scroll-to-top
  // on client-side navigation: the banner is position:fixed at the top of the
  // re-rendered segment, so the router considers the new page "already in
  // viewport" and leaves the scroll position where it was.
  //
  // Patch history.pushState/replaceState at eval time (before Next.js hydration)
  // to fire a synthetic 'ch:navigate' event on every SPA navigation. This replaces
  // the rAF polling loop the original used — the loop ran 60fps for the entire page
  // lifetime; the event fires only on actual navigations.
  //
  // Back/forward (popstate) is left alone so the browser and router can restore
  // the previous scroll position. Cross-page hash links (/page#anchor) scroll to
  // the anchor once the new page has rendered it.

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

  window.addEventListener('ch:navigate', function () {
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
  });
})();
