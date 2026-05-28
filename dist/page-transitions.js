(function () {
  const TRANSITION_MS = 180;

  function isInternalPageLink(link) {
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return false;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me') || href.startsWith('https://www.instagram.com')) return false;

    try {
      const next = new URL(href, window.location.href);
      return next.origin === window.location.origin && next.pathname !== window.location.pathname;
    } catch {
      return false;
    }
  }

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-ready');
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!isInternalPageLink(link) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => {
      window.location.href = link.href;
    }, TRANSITION_MS);
  });
})();
