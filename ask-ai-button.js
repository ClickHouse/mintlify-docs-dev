(function () {
  'use strict';

  var BTN_ID = 'ch-ask-ai-btn';
  var MOBILE_BTN_ID = 'ch-ask-ai-btn-mobile';

  var sparkleSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"'
    + ' class="ch-ai-icon size-4 shrink-0 text-gray-700">'
    + '<g fill="currentColor">'
    + '<path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z" fill="currentColor" data-stroke="none" stroke="none"></path>'
    + '<polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polygon>'
    + '</g></svg>';

  function injectStyles() {
    if (document.getElementById('ch-ask-ai-styles')) return;
    var style = document.createElement('style');
    style.id = 'ch-ask-ai-styles';
    style.textContent = '.dark .ch-ai-icon { color: #fdff75; }';
    document.head.appendChild(style);
  }

  function injectButton() {
    if (document.getElementById(BTN_ID)) return true;

    var searchBar = document.getElementById('search-bar-entry');

    if (!searchBar) return false;

    injectStyles();

    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.className = 'group/ai flex-none hidden lg:flex items-center justify-center gap-1.5 h-9 rounded-xl shadow-sm bg-background-light dark:bg-background-dark dark:brightness-[1.1] dark:ring-1 dark:hover:brightness-[1.25] ring-1 ring-gray-400/20 hover:ring-gray-600/25 dark:ring-gray-600/30 dark:hover:ring-gray-500/30 w-9 p-0 ml-2';
    btn.setAttribute('aria-label', 'Ask AI');
    btn.innerHTML = sparkleSvg;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (window.RagChatWidget) {
        window.RagChatWidget.toggle();
      }
    });

    // Insert after the search button, as a sibling
    searchBar.parentNode.insertBefore(btn, searchBar.nextSibling);
    return true;
  }

  function injectMobileButton() {
    if (document.getElementById(MOBILE_BTN_ID)) return true;

    var mobileSearchBtn = document.getElementById('search-bar-entry-mobile');

    if (!mobileSearchBtn) return false;

    injectStyles();

    var btn = document.createElement('button');
    btn.id = MOBILE_BTN_ID;
    btn.type = 'button';
    btn.className = 'text-gray-500 w-8 h-8 flex items-center justify-center hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300';
    btn.setAttribute('aria-label', 'Ask AI');
    btn.innerHTML = sparkleSvg;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (window.RagChatWidget) {
        window.RagChatWidget.toggle();
      }
    });

    mobileSearchBtn.parentNode.insertBefore(btn, mobileSearchBtn.nextSibling);
    return true;
  }

  function isAskAiOption(el) {
    if (!el || el.nodeType !== 1) return false;
    var option = el.closest && el.closest('[role="option"]');
    if (!option) return false;
    return /^\s*Can you tell me about\b/i.test(option.textContent || '');
  }

  function getSearchQuery() {
    var input = document.querySelector('input[placeholder="Search..."]');
    return input ? input.value.trim() : '';
  }

  // The widget renders inside a shadow root at #rag-chat-host, so document
  // queries don't see it. Submit by setting the textarea value via the native
  // setter (so React's controlled input picks it up) then clicking send.
  function submitToWidget(query) {
    var host = document.getElementById('rag-chat-host');
    var sr = host && host.shadowRoot;
    if (!sr) return false;
    var ta = sr.querySelector('.rag-composer-input');
    var btn = sr.querySelector('.rag-composer-send');
    if (!ta || !btn) return false;
    ta.focus();
    var setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, query);
    ta.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    btn.click();
    return true;
  }

  function openCustomAskAi() {
    var query = getSearchQuery();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    if (!window.RagChatWidget || typeof window.RagChatWidget.open !== 'function') return;
    window.RagChatWidget.open();

    if (!query) return;
    var attempts = 0;
    var iv = setInterval(function () {
      attempts++;
      if (submitToWidget(query) || attempts > 40) clearInterval(iv);
    }, 50);
  }

  function interceptAskAi(e) {
    if (!isAskAiOption(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    openCustomAskAi();
  }

  function init() {
    injectButton();
    injectMobileButton();

    document.addEventListener('click', interceptAskAi, true);
    document.addEventListener('mousedown', interceptAskAi, true);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var active = document.querySelector('[role="option"][data-headlessui-state*="active"], [role="option"][aria-selected="true"]');
      if (active && /^\s*Can you tell me about\b/i.test(active.textContent || '')) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        openCustomAskAi();
      }
    }, true);

    var observer = new MutationObserver(function () {
      injectButton();
      injectMobileButton();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();