(function () {
  'use strict';

  // Inkeep search integration (official @inkeep/cxkit-mintlify package).
  //
  // Replaces Mintlify's native search with Inkeep's search-only modal. The
  // cxkit-mintlify bundle automatically wires itself to Mintlify's search
  // entry points — it opens the modal on:
  //   • clicks on #search-bar-entry / #search-bar-entry-mobile (navbar), and
  //     #home-search-entry (the home page hero button, see index.mdx)
  //   • the ⌘K / Ctrl+K hotkey
  //
  // We use Inkeep.ModalSearchAndChat — it is the ONLY component that installs
  // the native-search auto-hook (ModalSearch/SearchBar do not) — and force it
  // search-only with `defaultView: 'search'` + `canToggleView: false`. That
  // hides the chat toggle and the "Ask AI" card, so Inkeep does search only;
  // "Ask AI" is handled by Kapa (see kapa-init.js).

  // Inkeep integration API keys. These are client-side/public keys (they ship
  // in the browser bundle), so committing them is expected. Staging covers any
  // *.mintlify.app host (preview/staging deploys); every other host (localhost,
  // mint dev, a future prod domain) uses the local-dev key.
  var INKEEP_API_KEY_STAGING = 'd3e2792740610240ff7bcf2c2a78a33012812eb4f3e34d54';
  var INKEEP_API_KEY_LOCAL = 'b25e5cf856ec9da60d250578b59dace8417359feeedcbc6b';
  var INKEEP_API_KEY = /\.mintlify\.app$/.test(window.location.hostname)
    ? INKEEP_API_KEY_STAGING
    : INKEEP_API_KEY_LOCAL;

  // cxkit-mintlify CDN bundle. @0.5 resolves to the latest 0.5.x; pin a full
  // version (e.g. @0.5.119) when deploying for reproducible builds.
  var INKEEP_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/@inkeep/cxkit-mintlify@0.5/dist/index.js';

  function loadScript(url, callback) {
    if (document.getElementById('inkeep-cxkit-script')) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.id = 'inkeep-cxkit-script';
    script.src = url;
    script.type = 'text/javascript';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // When the Inkeep modal opens, its scroll lock (react-remove-scroll) marks
  // the body with [data-scroll-locked] and adds `padding-right` equal to the
  // scrollbar width to "compensate" for hiding the scrollbar. On systems with
  // classic (non-overlay) scrollbars that padding shrinks the body and shifts
  // centered page content sideways. We neutralize it — the selector is more
  // specific than react-remove-scroll's own rule so it wins regardless of
  // injection order.
  function injectNoShiftStyle() {
    if (document.getElementById('inkeep-no-shift-style')) return;
    var style = document.createElement('style');
    style.id = 'inkeep-no-shift-style';
    style.textContent =
      'html body[data-scroll-locked] { padding-right: 0 !important; margin-right: 0 !important; }';
    document.head.appendChild(style);
  }

  function initInkeep() {
    if (typeof Inkeep === 'undefined' || !Inkeep || typeof Inkeep.ModalSearchAndChat !== 'function') {
      console.log('Inkeep: cxkit-mintlify did not expose ModalSearchAndChat.');
      return;
    }

    var settings = {
      // Open straight to the search view. (canToggleView is honored by
      // SearchBar/ChatButton but NOT by ModalSearchAndChat, so we hide the
      // chat affordances via CSS below instead.)
      defaultView: 'search',
      baseSettings: {
        apiKey: INKEEP_API_KEY,
        primaryBrandColor: '#fdff75',
        organizationDisplayName: 'ClickHouse',
        // Follow Mintlify's `.dark` class on <html>.
        colorMode: {
          sync: {
            target: document.documentElement,
            attributes: ['class'],
            isDarkMode: function (attributes) {
              return ((attributes && attributes.class) || '').indexOf('dark') !== -1;
            },
          },
        },
        // Make the modal search-only: hide the Search/Ask AI view toggle and
        // the "Ask AI — Start conversation" card. Inkeep renders inside a
        // shadow root, so we inject CSS via theme.styles (which mounts inside
        // that shadow root). "Ask AI" stays exclusively on Kapa.
        theme: {
          styles: [
            {
              key: 'hide-inkeep-ai-chat',
              type: 'style',
              value: '.ikp-view_toggle, .ikp-ai-ask-ai-trigger { display: none !important; }',
            },
            {
              key: 'dark-search-overlay',
              type: 'style',
              value: '.dark\\:bg-overlay-dark { background-color: rgba(0, 0, 0, 0.75) !important; }',
            },
          ],
        },
      },
      searchSettings: {
        placeholder: 'Search ClickHouse docs...',
      },
    };

    // cxkit-mintlify auto-binds this to the Mintlify search bar entries
    // (#search-bar-entry / -mobile / #home-search-entry) and the ⌘K hotkey,
    // intercepting them (capture-phase preventDefault) so the native search
    // never opens.
    Inkeep.ModalSearchAndChat(settings);
  }

  function boot() {
    try {
      injectNoShiftStyle();
      loadScript(INKEEP_SCRIPT_URL, initInkeep);
    } catch (e) {
      console.log('Inkeep: failed to load widget:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();