(function () {
  document.body.classList.add('js-ready');
  var number = window.PACIFIC_WHATSAPP_NUMBER || '92XXXXXXXXXX';
  var message = window.PACIFIC_WHATSAPP_MESSAGE || '';
  var base = 'https://wa.me/' + number;
  var url = message ? base + '?text=' + encodeURIComponent(message) : base;

  function setContactLinks() {
    var links = document.querySelectorAll('.btn-contact, a[href="#"].btn-contact');
    links.forEach(function (el) {
      el.href = url;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function setYear() {
    var span = document.getElementById('year');
    if (span) span.textContent = new Date().getFullYear();
  }

  function navToggle() {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      btn.classList.toggle('is-open');
    });
  }

  function navDropdown() {
    var trigger = document.querySelector('.nav-dropdown-trigger');
    var dropdown = document.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('is-open');
      }
    });
  }

  function initScrollReveal() {
    var hero = document.querySelector('.hero');
    var pageHero = document.querySelector('.page-hero');
    var heroReveals = hero ? hero.querySelectorAll('.reveal') : [];

    if (heroReveals.length) {
      heroReveals.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('visible');
        }, 120 + i * 80);
      });
    }

    /* Inner pages: animate hero and main content on load */
    if (pageHero && !hero) {
      var pageHeroReveals = pageHero.querySelectorAll('.reveal');
      pageHeroReveals.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('visible');
        }, 150 + i * 100);
      });
      /* Stagger first section content below hero */
      var firstSection = document.querySelector('.board-cards .reveal, .businesses .reveal');
      if (firstSection) {
        var firstReveals = document.querySelector('.board-cards, .businesses');
        if (firstReveals) {
          var items = firstReveals.querySelectorAll('.reveal');
          items.forEach(function (el, i) {
            setTimeout(function () {
              el.classList.add('visible');
            }, 400 + i * 80);
          });
        }
      }
    }

    var allReveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    allReveals.forEach(function (el) {
      if (hero && hero.contains(el)) return;
      if (pageHero && !hero && pageHero.contains(el)) return;
      observer.observe(el);
    });
  }

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
  }

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function updateVisibility() {
      if (window.scrollY > 400) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateVisibility);
    }, { passive: true });
    updateVisibility();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Cross-fading hero slideshow.
     Degrades to the single .is-active slide already in the markup if JS
     is unavailable, if there is only one slide, or if the visitor has
     asked for reduced motion. Rotation pauses while the tab is hidden so
     a backgrounded page isn't decoding images for nobody. */
  function initHeroSlideshow() {
    var root = document.querySelector('.hero-slideshow');
    if (!root) return;

    var slides = [].slice.call(root.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return;

    var HOLD = 6000;
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var current = 0;
    var timer = null;

    function schedule() {
      stop();
      if (motionQuery.matches || document.hidden) return;
      timer = setTimeout(advance, HOLD);
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function show(next) {
      slides[current].classList.remove('is-active');
      slides[next].classList.add('is-active');
      current = next;
    }

    function advance() {
      var next = (current + 1) % slides.length;
      var img = slides[next].querySelector('img');
      /* Decode off the main thread first so the cross-fade never reveals
         a half-painted image on a slow connection. */
      if (img && typeof img.decode === 'function') {
        img.decode().then(function () { show(next); schedule(); },
                          function () { show(next); schedule(); });
      } else {
        show(next);
        schedule();
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else schedule();
    });

    function onMotionChange() {
      if (motionQuery.matches) stop(); else schedule();
    }
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(onMotionChange);
    }

    schedule();
  }

  function initStatsCountUp() {
    var strip = document.querySelector('.stats-strip');
    if (!strip) return;

    var duration = 1600;
    var easeOutExpo = function (t) {
      return t === 0 ? 0 : t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    function runCount(el) {
      var to = parseInt(el.getAttribute('data-to'), 10);
      if (isNaN(to)) return;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = easeOutExpo(progress);
        var current = Math.round(start + (to - start) * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + to + suffix;
      }
      requestAnimationFrame(step);
    }

    function revealText(el) {
      el.classList.add('stat-visible');
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var stripEl = entry.target;
          stripEl.querySelectorAll('.stat-num[data-to]').forEach(function (el, i) {
            setTimeout(function () { runCount(el); }, i * 120);
          });
          stripEl.querySelectorAll('.stat-num-text').forEach(function (el, i) {
            setTimeout(function () { revealText(el); }, 400 + i * 100);
          });
          observer.unobserve(stripEl);
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(strip);
  }

  setContactLinks();
  setYear();
  navToggle();
  navDropdown();
  initScrollReveal();
  initHeaderScroll();
  initBackToTop();
  initHeroSlideshow();
  initStatsCountUp();
})();
