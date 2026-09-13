/* =============================================================
   WFBC — Contact Page JS  v1
   Smooth scroll, hero parallax, reveals, form, ticker, nav
============================================================= */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* ── TICKER ──────────────────────────────────────────────── */
  const ITEMS = [
    'Agro Chemicals', 'PGR', 'Fertilizer', 'Water Soluble Fertilizer',
    'Industrial Chemicals', 'Solvents', 'Speciality Chemicals',
    'Lab Chemicals', 'Food Colour', 'Food Preservatives', 'Glassware'
  ];
  const track = $('#ticker-track');
  if (track) {
    [...ITEMS, ...ITEMS].forEach(item => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.innerHTML = item + '<span class="ticker-dot" aria-hidden="true"></span>';
      track.appendChild(el);
    });
  }

  /* ── LENIS + GSAP ────────────────────────────────────────── */
  let lenis = null;

  function initSmoothScroll() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
      lenis.on('scroll', onScroll);
    } catch (e) {
      console.warn('Lenis error:', e);
    }
  }

  /* ── HERO PARALLAX ───────────────────────────────────────── */
  function initHeroParallax() {
    const layer = $('#hero-img-scroll');
    const hero  = $('section#hero');
    if (!layer || !hero || REDUCED) return;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(layer, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
    }
  }

  /* ── SCROLL REVEALS ──────────────────────────────────────── */
  let io;
  function initReveals() {
    const els = $$('.ct-rv');
    if (!els.length || REDUCED) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }
    io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.setProperty('--d', (i * 0.07) + 's');
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  /* ── NAV LIGHT MODE ──────────────────────────────────────── */
  function navLightMode() {
    const nav  = $('#nav');
    const body = document.body;
    if (!nav) return;
    const strip = $('.ct-strip');
    if (!strip) return;
    const start = strip.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    const sy    = window.scrollY;
    body.classList.toggle('nav-light', sy >= start);
    nav.classList.toggle('scrolled', sy > 40);
  }

  function onScroll() { navLightMode(); }

  /* ── SMOOTH ANCHORS ──────────────────────────────────────── */
  function initAnchors() {
    $$('a[href^="#"], [data-scroll]').forEach(a => {
      const href = a.getAttribute('href') || a.dataset.scroll;
      if (!href || href.length < 2) return;
      a.addEventListener('click', e => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const nav  = $('#nav');
        const navH = nav ? nav.offsetHeight : 58;
        if (lenis) {
          lenis.scrollTo(target, { offset: -navH, duration: 1.2 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ── MAGNETIC CTA ────────────────────────────────────────── */
  function initMagnetic() {
    if (REDUCED || window.matchMedia('(hover: none)').matches) return;
    $$('.hero-cta, .nav-cta, .ct-submit').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.5)' });
        }
      });
    });
  }

  /* ── FORM ────────────────────────────────────────────────── */
  function initForm() {
    const form = $('#contact-form');
    const btn  = $('#ct-submit');
    const succ = $('#ct-success');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!btn || !succ) return;

      const origHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="ct-submit-text">Sending…</span>';

      // Simulate send
      setTimeout(() => {
        succ.hidden = false;
        succ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = origHTML;
          succ.hidden = true;
        }, 5000);
      }, 900);
    });
  }

  /* ── SCROLL LOOP FALLBACK ────────────────────────────────── */
  function initScrollLoop() {
    let ticking = false;
    const tick = () => { onScroll(); ticking = false; };
    tick();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ── BOOT ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initHeroParallax();
    initReveals();
    initAnchors();
    initMagnetic();
    initForm();
    initScrollLoop();

    window.addEventListener('resize', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      navLightMode();
    }, { passive: true });
  });

})();
