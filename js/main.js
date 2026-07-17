(function () {
  'use strict';

  /* ---------- Sticky header on scroll ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if (sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Scroll reveal animations ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Dark / light theme toggle ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var root = document.documentElement;
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('mfi-theme'); } catch (e) { /* storage unavailable */ }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (themeToggle) themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Вклучи светла тема' : 'Вклучи темна тема');
  }

  var initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('mfi-theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Testimonial slider ---------- */
  var slider = document.querySelector('.testimonial-slider');
  if (slider) {
    var track = slider.querySelector('.testimonial-slides');
    var slides = slider.querySelectorAll('.testimonial-slide');
    var dotsWrap = slider.querySelector('.testimonial-nav');
    var prevBtn = slider.querySelector('.testimonial-arrow--prev');
    var nextBtn = slider.querySelector('.testimonial-arrow--next');
    var current = 0;
    var total = slides.length;
    var autoTimer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Прикажи сведоштво ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('.testimonial-dot');

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }

    function startAuto() {
      autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); stopAuto(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); stopAuto(); startAuto(); });
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    if (total > 1) startAuto();
  }

  /* ---------- Contact / booking form validation ---------- */
  var forms = document.querySelectorAll('[data-validate]');
  forms.forEach(function (form) {
    var successBox = form.querySelector('.form-success');

    function showError(group, message) {
      group.classList.add('has-error');
      var errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.textContent = message;
    }
    function clearError(group) {
      group.classList.remove('has-error');
      var errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var groups = form.querySelectorAll('.form-group');

      groups.forEach(function (group) {
        var field = group.querySelector('input, textarea, select');
        if (!field) return;
        clearError(group);

        if (field.hasAttribute('required') && !field.value.trim()) {
          showError(group, 'Ова поле е задолжително.');
          valid = false;
          return;
        }
        if (field.type === 'email' && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            showError(group, 'Внеси валидна е-мејл адреса.');
            valid = false;
          }
        }
        if (field.type === 'tel' && field.value.trim()) {
          var phonePattern = /^[+\d][\d\s-]{5,}$/;
          if (!phonePattern.test(field.value.trim())) {
            showError(group, 'Внеси валиден телефонски број.');
            valid = false;
          }
        }
      });

      if (valid) {
        form.reset();
        if (successBox) {
          successBox.classList.add('is-visible');
          setTimeout(function () { successBox.classList.remove('is-visible'); }, 6000);
        }
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
