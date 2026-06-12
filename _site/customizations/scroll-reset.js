(function () {
  'use strict';

  // With an announcement banner configured, Next.js skips its scroll-to-top
  // on client-side navigation: the banner is position:fixed at the top of the
  // re-rendered segment, so the router considers the new page "already in
  // viewport" and leaves the scroll position where it was. (Banner-less
  // Mintlify sites scroll to top as expected; dismissing the banner makes the
  // bug disappear.) Restore the expected behavior by scrolling to the top
  // whenever a forward navigation changes the path.
  //
  // The path is watched from a rAF loop rather than by wrapping
  // history.pushState — the router can hold a reference to the original
  // pushState from before this script runs, which would bypass a wrapper.
  //
  // Back/forward (popstate) is deliberately left alone so the browser and
  // router can restore the previous scroll position, and hash navigations are
  // skipped so deep links still land on their anchor.
  var lastPath = window.location.pathname;
  var traversed = false;

  window.addEventListener('popstate', function () {
    if (window.location.pathname !== lastPath) {
      traversed = true;
    }
  });

  function watch() {
    var path = window.location.pathname;
    if (path !== lastPath) {
      lastPath = path;
      if (traversed) {
        traversed = false;
      } else if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
    window.requestAnimationFrame(watch);
  }
  window.requestAnimationFrame(watch);
})();