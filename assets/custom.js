document.addEventListener('DOMContentLoaded', function() {
  const alignTabsWithHeaderTitle = () => {
    const title = document.querySelector('.md-header__title .md-header__topic:first-child .md-ellipsis')
      || document.querySelector('.md-header__title .md-ellipsis');
    const firstTab = document.querySelector('.md-tabs__item:first-child');

    if (!title || !firstTab) {
      return;
    }

    const titleLeft = title.getBoundingClientRect().left;
    const firstTabPadding = Number.parseFloat(window.getComputedStyle(firstTab).paddingLeft) || 0;
    const offset = Math.max(0, titleLeft - firstTabPadding);
    document.documentElement.style.setProperty('--mesh-tabs-offset', `${offset.toFixed(2)}px`);
  };

  alignTabsWithHeaderTitle();
  window.addEventListener('resize', alignTabsWithHeaderTitle, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignTabsWithHeaderTitle);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = href && href.length > 1 ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  document.querySelectorAll('.md-search__input').forEach(input => {
    input.removeAttribute('required');
    input.setAttribute('placeholder', '');
  });

  document.querySelectorAll('.md-search').forEach(search => {
    const input = search.querySelector('.md-search__input');
    const trigger = search.querySelector('.md-search__icon[for="__search"]');
    const reset = search.querySelector('.md-search__options button[type="reset"]');

    if (!input || !trigger) {
      return;
    }

    const openSearch = event => {
      if (event) {
        event.preventDefault();
      }

      search.classList.add('mesh-search-open');
      input.removeAttribute('required');
      input.setAttribute('placeholder', '');
      window.requestAnimationFrame(() => input.focus({ preventScroll: true }));
    };

    const closeSearch = () => {
      input.value = '';
      input.blur();
      search.classList.remove('mesh-search-open');
    };

    trigger.addEventListener('click', openSearch);
    input.addEventListener('focus', () => search.classList.add('mesh-search-open'));

    if (reset) {
      reset.addEventListener('click', event => {
        event.preventDefault();
        closeSearch();
      });
    }

    search.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    });

    document.addEventListener('click', event => {
      if (!search.contains(event.target) && !input.value) {
        search.classList.remove('mesh-search-open');
      }
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
});
