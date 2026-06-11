(function () {
  'use strict';

  var CHEVRON_LEFT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>';
  var CHEVRON_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // The maple pagination only renders the previous page's label, not its
  // title, so resolve the title from the matching sidebar link.
  function sidebarTitle(href) {
    if (!href) return '';
    var link = document.querySelector('#sidebar a[href="' + href + '"]');
    return link ? link.textContent.trim() : '';
  }

  function cardHTML(title, label, isNext) {
    var html = '<div class="ch-pagination-inner">';
    if (title) html += '<div class="ch-pagination-title">' + esc(title) + '</div>';
    html += '<div class="ch-pagination-label">'
      + (isNext ? CHEVRON_RIGHT : CHEVRON_LEFT)
      + '<span>' + esc(label) + '</span></div></div>';
    return html;
  }

  function restylePagination() {
    var pgn = document.getElementById('pagination');
    if (!pgn || pgn.dataset.chRestyled) return;

    var prev = null;
    var next = null;
    pgn.querySelectorAll(':scope > a').forEach(function (a) {
      if (a.querySelector('.lucide-chevron-left')) prev = a;
      else if (a.querySelector('.lucide-chevron-right')) next = a;
    });
    if (!prev && !next) return;

    pgn.dataset.chRestyled = '1';
    pgn.className = 'ch-pagination';

    if (prev) {
      var prevLabelEl = prev.querySelector('span');
      var prevLabel = prevLabelEl ? prevLabelEl.textContent.trim() : 'Previous';
      var prevTitle = sidebarTitle(prev.getAttribute('href'));
      prev.className = 'ch-pagination-prev';
      prev.innerHTML = cardHTML(prevTitle, prevLabel, false);
    }

    if (next) {
      var nextTitleEl = next.querySelector('.font-semibold');
      var nextTitle = nextTitleEl ? nextTitleEl.textContent.trim() : sidebarTitle(next.getAttribute('href'));
      var nextLabelEl = next.querySelector('.tracking-tight');
      var nextLabel = nextLabelEl ? nextLabelEl.textContent.trim() : 'Next';
      next.className = 'ch-pagination-next';
      next.innerHTML = cardHTML(nextTitle, nextLabel, true);
    }
  }

  function init() {
    restylePagination();
    new MutationObserver(restylePagination)
      .observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();