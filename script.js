/**
 * VOXTOR BRASIL — script.js
 * Features: fade-in on scroll, mobile menu, smooth scroll,
 *           multistep form validation, header scroll effect, back-to-top
 */

/* ============================================================
   1. INTERSECTION OBSERVER — Fade-in on scroll
   ============================================================ */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  // Se o browser não suporta IntersectionObserver, mostra tudo
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  els.forEach((el) => observer.observe(el));

  // Dispara imediatamente para elementos já visíveis no viewport
  setTimeout(() => {
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, 50);
})();

/* ============================================================
   2. HEADER — sticky shadow on scroll
   ============================================================ */
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ============================================================
   3. MOBILE MENU — hamburger toggle
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   4. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.header')?.offsetHeight || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   5. BACK TO TOP button
   ============================================================ */
(function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   6. ACTIVE NAV LINK — highlight current page
   ============================================================ */
(function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav .nav__link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   7. MULTISTEP FORM (contact.html)
   ============================================================ */
(function initMultiStepForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const panes      = form.querySelectorAll('.form-pane');
  const indicators = form.querySelectorAll('.form-step-indicator');
  const successBox = document.getElementById('formSuccess');
  let currentStep  = 0;

  function showStep(idx) {
    panes.forEach((p, i) => p.classList.toggle('active', i === idx));
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === idx);
      ind.classList.toggle('done',   i < idx);
    });
    currentStep = idx;
  }

  // Validate a pane's required fields
  function validatePane(idx) {
    const pane = panes[idx];
    const inputs = pane.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach((input) => {
      const errEl = input.closest('.field')?.querySelector('.field-error');
      let fieldOk = true;

      if (!input.value.trim()) {
        fieldOk = false;
      } else if (input.tagName === 'SELECT' && input.value === '') {
        fieldOk = false;
      } else if (input.type === 'email') {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(input.value.trim())) fieldOk = false;
      } else if (input.type === 'tel') {
        // Brazilian phone formats: with/without +55, with/without DDD, with/without 9th digit
        const telRe = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-\s]?\d{4})$/;
        if (!telRe.test(input.value.trim().replace(/\s+/g, ' '))) fieldOk = false;
      }

      if (!fieldOk) {
        input.classList.add('error');
        if (errEl) errEl.classList.add('show');
        valid = false;
      } else {
        input.classList.remove('error');
        if (errEl) errEl.classList.remove('show');
      }
    });

    return valid;
  }

  // Next button
  form.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (validatePane(currentStep)) {
        showStep(currentStep + 1);
        form.closest('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Prev button
  form.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validatePane(currentStep)) return;

    // Simulate sending
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1400);
  });

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('blur', () => {
      const errEl = input.closest('.field')?.querySelector('.field-error');
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('error');
        if (errEl) errEl.classList.add('show');
      } else {
        input.classList.remove('error');
        if (errEl) errEl.classList.remove('show');
      }
    });
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = input.closest('.field')?.querySelector('.field-error');
      if (errEl) errEl.classList.remove('show');
    });
    // Also clear errors for selects on change
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        if (input.value !== '') {
          input.classList.remove('error');
          const errEl = input.closest('.field')?.querySelector('.field-error');
          if (errEl) errEl.classList.remove('show');
        }
      });
    }
  });

  showStep(0);
})();

/* ============================================================
   8. STATS COUNTER ANIMATION (about/home pages)
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : (String(target).includes('.') ? 1 : 0);
        const duration = 1400;
        const start  = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = (isDecimal > 0 ? current.toFixed(isDecimal) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();
