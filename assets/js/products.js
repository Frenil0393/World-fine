/* =====================================================================
   WFBC — Product Catalog JS v11
   Awwwards-level redesign — light theme, no custom cursor.
   Clean JS: filter + sort + render + reveal + ticker + rail indicator
             + scroll parallax + magnetic hero CTA + nav light-mode toggle
             + reading progress + smooth anchors.
===================================================================== */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ── State ──────────────────────────────────────────────── */
  let activeCat  = 'all';
  let activeSort = 'featured';
  let plates     = [];   // [{el, product}]

  const CAT_ORDER = ['agro','pgr','fertilizer','industrial','lab','food'];

  const CAT_COPY = {
    all:        { h: 'All products',            p: 'Twelve lines across six categories, supplied in bulk from Ahmedabad.' },
    agro:       { h: 'Agro chemicals',          p: 'Crop protection and support, formulated for Indian field conditions.' },
    pgr:        { h: 'Plant growth regulators', p: 'Flowering, ripening and vegetative control at measured dose rates.' },
    fertilizer: { h: 'Fertilizers',             p: 'Water-soluble and bulk nutrition, blended to the ratio you order.' },
    industrial: { h: 'Industrial chemicals',    p: 'Solvents, cleaners and process chemistry for plant-scale use.' },
    lab:        { h: 'Lab and glassware',       p: 'Analytical-grade reagents and borosilicate glassware for QC benches.' },
    food:       { h: 'Food grade',              p: 'Colours and preservatives certified for food processing.' }
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  }

  /* ══════════════════════════════════════════════════════════
     1 · TICKER
  ══════════════════════════════════════════════════════════ */
  function initTicker() {
    const track = $('#ticker-track');
    if (!track) return;
    const ITEMS = [
      'Agro Chemicals', 'Plant Growth Regulators', 'Fertilizer',
      'Water Soluble Fertilizer', 'Industrial Chemicals', 'Solvents',
      'Speciality Chemicals', 'Lab Chemicals', 'Food Colour',
      'Food Preservatives', 'Glassware'
    ];
    [...ITEMS, ...ITEMS].forEach(item => {
      const span = document.createElement('span');
      span.className = 'ticker-item';
      span.innerHTML = item + '<span class="ticker-dot" aria-hidden="true"></span>';
      track.appendChild(span);
    });
  }

  /* ══════════════════════════════════════════════════════════
     2 · SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════════════════════════ */
  const io = ('IntersectionObserver' in window) && !REDUCED
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 })
    : null;

  function reveal(els) {
    els.forEach((el, i) => {
      el.style.setProperty('--d', (Math.min(i, 7) * 0.065).toFixed(3) + 's');
      if (io) { io.observe(el); }
      else { el.classList.add('is-in'); }
    });
  }

  function revealStatics() {
    /* Reveal static sections */
    reveal($$('.rv'));
  }

  /* ══════════════════════════════════════════════════════════
     3 · STAT COUNTERS — mirrors index.html initCounters()
  ══════════════════════════════════════════════════════════ */
  function initCounters() {
    const els = $$('.cat-stats [data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;

    const run = el => {
      const target = +el.getAttribute('data-count');
      const t0 = performance.now(), dur = 1300;
      const step = now => {
        const q = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - q, 3)) * target);
        if (q < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    };

    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        run(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    els.forEach(el => cio.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     4 · BUILD PRODUCT CARD
  ══════════════════════════════════════════════════════════ */
  function buildCard(p) {
    const a = document.createElement('a');
    a.className  = 'plate';
    a.href       = 'product-detail.html?id=' + encodeURIComponent(p.id);
    a.dataset.cat = p.category;
    a.setAttribute('role', 'listitem');
    a.setAttribute('aria-label', p.name + ' — ' + p.categoryLabel);

    const img = p.images && p.images[0];

    a.innerHTML =
      /* Figure */
      '<span class="plate-fig">' +
        (img
          ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy" width="800" height="600"/>'
          : '') +
        '<span class="plate-badge">' + esc(p.categoryLabel) + '</span>' +
        '<span class="plate-arrow" aria-hidden="true">' +
          '<svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5.5h9M5.5 1l4.5 4.5-4.5 4.5"/></svg>' +
        '</span>' +
      '</span>' +
      /* Body */
      '<span class="plate-body">' +
        '<span class="plate-cat">' + esc(p.categoryLabel) + '</span>' +
        '<span class="plate-name">' + esc(p.name) + '</span>' +
        '<span class="plate-tag">'  + esc(p.tagline) + '</span>' +
        '<span class="plate-spec">' +
          '<span class="plate-spec-r">' +
            '<span class="plate-spec-k">Grade</span>' +
            '<span class="plate-spec-v">' + esc(p.purity) + '</span>' +
          '</span>' +
          '<span class="plate-spec-r">' +
            '<span class="plate-spec-k">Packs</span>' +
            '<span class="plate-spec-v">' + esc((p.packSizes || []).join(', ')) + '</span>' +
          '</span>' +
        '</span>' +
      '</span>';

    return a;
  }

  function buildPlates() {
    if (typeof WFBC_PRODUCTS === 'undefined') return;
    plates = WFBC_PRODUCTS.map(p => ({ el: buildCard(p), product: p }));
  }

  /* ══════════════════════════════════════════════════════════
     5 · RAIL FILTER BUTTONS
  ══════════════════════════════════════════════════════════ */
  function categories() {
    if (typeof WFBC_PRODUCTS === 'undefined') return [];
    const labels = {};
    WFBC_PRODUCTS.forEach(p => { labels[p.category] = p.categoryLabel; });
    const list = [{ id: 'all', label: 'All', count: WFBC_PRODUCTS.length }];
    CAT_ORDER.forEach(id => {
      const c = WFBC_PRODUCTS.filter(p => p.category === id).length;
      if (!c) return;
      list.push({ id, label: labels[id] || id, count: c });
    });
    return list;
  }

  function buildRail() {
    const wrap = $('#rail-filters');
    if (!wrap) return;
    /* rail-ind span lives at end of #rail-filters in HTML */
    const ind  = wrap.querySelector('#rail-ind') || $('#rail-ind');

    categories().forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail-f';
      b.dataset.cat = c.id;
      b.setAttribute('aria-pressed', String(c.id === activeCat));
      b.innerHTML =
        '<span class="rail-f-text">' + esc(c.label) + '</span>' +
        '<sup class="rail-f-n" aria-hidden="true">' + c.count + '</sup>';
      b.addEventListener('click', () => setCategory(c.id, true));
      /* Insert before indicator if present; else just append */
      ind ? wrap.insertBefore(b, ind) : wrap.appendChild(b);
    });

    moveIndicator();
  }

  /* Move the sliding indicator under active filter */
  function moveIndicator() {
    const ind    = $('#rail-ind');
    const active = $('.rail-f[aria-pressed="true"]');
    if (!ind || !active) return;

    const wrap = $('#rail-filters');
    const wr   = wrap.getBoundingClientRect();
    const ar   = active.getBoundingClientRect();
    ind.style.transform = 'translate3d(' + (ar.left - wr.left + wrap.scrollLeft) + 'px,0,0)';
    ind.style.width     = ar.width + 'px';
  }

  /* ══════════════════════════════════════════════════════════
     6 · SORT
  ══════════════════════════════════════════════════════════ */
  const SORT_LABELS = { featured:'Featured', az:'Name A–Z', za:'Name Z–A', cat:'Category' };

  function initSort() {
    const btn  = $('#sort-btn');
    const menu = $('#sort-menu');
    if (!btn || !menu) return;

    let isOpen = false;

    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
      if (isOpen) return;
      isOpen = true;
      menu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      const checked = menu.querySelector('[aria-checked="true"]');
      if (checked) checked.focus();
    };

    btn.addEventListener('click', e => {
      e.stopPropagation();
      isOpen ? close() : open();
    });

    menu.addEventListener('click', e => {
      /* Guard: text nodes and SVG elements may not have .closest */
      const t    = e.target && e.target.nodeType === 1 ? e.target : null;
      const item = t ? t.closest('[data-sort]') : null;
      if (!item) return;
      setSort(item.dataset.sort);
      close();
      btn.focus();
    });

    document.addEventListener('click', e => {
      const t = e.target;
      if (isOpen && t && !btn.contains(t) && !menu.contains(t)) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) { close(); btn.focus(); }
    });

    menu.addEventListener('keydown', e => {
      const items = Array.from(menu.querySelectorAll('[data-sort]'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[(idx + 1) % items.length];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        if (prev) prev.focus();
      }
    });
  }

  function setSort(sort) {
    if (!SORT_LABELS[sort]) return;
    activeSort = sort;
    const val = $('#sort-val');
    if (val) val.textContent = SORT_LABELS[sort];
    $$('#sort-menu [data-sort]').forEach(b =>
      b.setAttribute('aria-checked', String(b.dataset.sort === sort)));
    render();
  }

  /* ══════════════════════════════════════════════════════════
     7 · RENDER — filter + sort in one pass
  ══════════════════════════════════════════════════════════ */
  function sortedPlates(list) {
    const copy = list.slice();
    if (activeSort === 'az')  copy.sort((a,b) => a.product.name.localeCompare(b.product.name));
    if (activeSort === 'za')  copy.sort((a,b) => b.product.name.localeCompare(a.product.name));
    if (activeSort === 'cat') copy.sort((a,b) => {
      const d = CAT_ORDER.indexOf(a.product.category) - CAT_ORDER.indexOf(b.product.category);
      return d !== 0 ? d : a.product.name.localeCompare(b.product.name);
    });
    return copy;
  }

  function render() {
    const grid  = $('#plates');
    const empty = $('#cat-empty');
    if (!grid) return;

    const matched = plates.filter(p => activeCat === 'all' || p.product.category === activeCat);
    const ordered = sortedPlates(matched);

    const frag = document.createDocumentFragment();
    ordered.forEach(p => {
      p.el.classList.remove('is-in');
      p.el.style.removeProperty('--d');
      frag.appendChild(p.el);
    });
    grid.replaceChildren(frag);

    if (empty) empty.hidden = ordered.length > 0;
    /* Slight delay so browser gets a paint tick before we observe */
    setTimeout(() => reveal(ordered.map(p => p.el)), 40);
    updateStatus(ordered.length);
  }

  function updateStatus(n) {
    const box  = $('.cat-status');
    const h    = $('#cat-status-h');
    const p    = $('#cat-status-p');
    const cnt  = $('#cat-count');
    const copy = CAT_COPY[activeCat] || CAT_COPY.all;

    if (cnt) cnt.textContent = n;

    const write = () => {
      if (h) h.textContent = copy.h;
      if (p) p.textContent = copy.p;
    };

    if (!box || REDUCED) { write(); return; }
    box.classList.add('is-swapping');
    setTimeout(() => { write(); box.classList.remove('is-swapping'); }, 220);
  }

  /* ══════════════════════════════════════════════════════════
     8 · CATEGORY SELECTION
  ══════════════════════════════════════════════════════════ */
  function setCategory(cat, fromClick) {
    activeCat = cat;
    $$('.rail-f').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    moveIndicator();
    render();

    const hash = cat === 'all' ? '#catalog' : '#c-' + cat;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);

    if (fromClick) {
      /* Keep the visible catalog area in view after filter */
      const rail   = $('#rail');
      const navH   = ($('#nav') ? $('#nav').offsetHeight : 58);
      const railH  = (rail ? rail.offsetHeight : 44);
      const status = $('.cat-status');
      if (status) {
        const top = status.getBoundingClientRect().top + window.scrollY - navH - railH;
        if (top < window.scrollY) {
          if (lenis) {
            lenis.scrollTo(status, { offset: -(navH + railH), duration: 0.9 });
          } else {
            window.scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
          }
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     9 · LENIS SMOOTH SCROLL + GSAP TICKER
  ══════════════════════════════════════════════════════════ */
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
        const raf = time => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }

      lenis.on('scroll', onScrollTick);
    } catch (e) {
      console.warn('Lenis initialization error:', e);
    }
  }

  /* ══════════════════════════════════════════════════════════
     10 · HERO PARALLAX — 100% jitter-free GSAP ScrollTrigger
  ══════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const layer = $('#hero-img-scroll');
    const hero  = $('section#hero');
    if (!layer || !hero || REDUCED) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(layer, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }
  }

  function heroParallaxFallback() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;
    const layer = $('#hero-img-scroll');
    const hero  = $('section#hero');
    if (!layer || !hero || REDUCED) return;

    const sy = window.scrollY;
    const hh = hero.offsetHeight;
    if (sy > hh) return;
    layer.style.transform = 'translate3d(0,' + (sy * 0.35).toFixed(1) + 'px,0)';
  }

  /* ══════════════════════════════════════════════════════════
     11 · READING PROGRESS (thin green bar at rail bottom)
  ══════════════════════════════════════════════════════════ */
  function progressBar() {
    const bar    = $('#rail-progress');
    const main   = $('.catalog');
    if (!bar || !main) return;

    const r   = main.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p    = span <= 0 ? (r.top <= 0 ? 1 : 0)
                           : Math.min(1, Math.max(0, -r.top / span));
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  /* ══════════════════════════════════════════════════════════
     12 · NAV LIGHT MODE — switch at catalog intro
  ══════════════════════════════════════════════════════════ */
  function navLightMode() {
    const nav  = $('#nav');
    const body = document.body;
    if (!nav) return;

    /* Threshold: start of catalog intro section */
    const catalog = $('#catalog');
    if (!catalog) return;

    const start = catalog.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    const enq   = $('.enq');
    const end   = enq ? enq.getBoundingClientRect().top + window.scrollY - nav.offsetHeight : Infinity;
    const sy    = window.scrollY;

    const inLight = sy >= start && sy < end;
    body.classList.toggle('nav-light', inLight);

    const isScrolled = sy > 40;
    nav.classList.toggle('scrolled', isScrolled);

    const nh = nav.offsetHeight;
    if (nh > 0) {
      document.documentElement.style.setProperty('--nav-h', nh + 'px');
    }
  }

  function onScrollTick() {
    heroParallaxFallback();
    progressBar();
    navLightMode();
  }

  /* ══════════════════════════════════════════════════════════
     13 · MAGNETIC CTA (hero button) — matches index.js
  ══════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (REDUCED || window.matchMedia('(hover: none)').matches) return;
    $$('.hero-cta, .nav-cta, .cat-empty-btn').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.36;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.36;
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' });
        } else {
          el.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';
          el.style.transform  = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,.5)' });
        } else {
          el.style.transition = 'transform .65s cubic-bezier(0.34,1.56,0.64,1)';
          el.style.transform  = 'translate(0,0)';
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     14 · SMOOTH ANCHOR SCROLL
  ══════════════════════════════════════════════════════════ */
  function initAnchors() {
    $$('a[href^="#"], [data-scroll]').forEach(a => {
      const href = a.getAttribute('href') || a.dataset.scroll;
      if (!href || href.length < 2) return;
      a.addEventListener('click', e => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const nav = $('#nav');
        const navH = (nav ? nav.offsetHeight : 58);
        if (lenis) {
          lenis.scrollTo(target, { offset: -navH, duration: 1.2 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
        }
      });
    });

    const reset = $('[data-reset]');
    if (reset) {
      reset.addEventListener('click', () => {
        setCategory('all', true);
        const catalog = $('#catalog');
        if (catalog && lenis) {
          const nav = $('#nav');
          lenis.scrollTo(catalog, { offset: -(nav ? nav.offsetHeight : 58), duration: 1.0 });
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     15 · SCROLL LOOP (Passive window scroll fallback & indicator)
  ══════════════════════════════════════════════════════════ */
  function initScrollLoop() {
    let ticking = false;
    const tick  = () => {
      onScrollTick();
      ticking = false;
    };
    tick();
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     16 · RESIZE
  ══════════════════════════════════════════════════════════ */
  function initResize() {
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        moveIndicator();
        onScrollTick();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 120);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initTicker();
    buildPlates();
    buildRail();
    initSort();
    initAnchors();
    initMagnetic();
    initCounters();
    revealStatics();
    initHeroParallax();

    /* Deep-link: products.html#c-industrial */
    const m = /^#c-([a-z]+)$/.exec(window.location.hash || '');
    const start = m && CAT_ORDER.indexOf(m[1]) !== -1 ? m[1] : 'all';
    activeCat = start;
    $$('.rail-f').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === start)));
    render();

    /* Scroll to catalog section on deep-link */
    if (start !== 'all') {
      setTimeout(() => {
        const catalog = $('#catalog');
        const nav     = $('#nav');
        const offset  = nav ? nav.offsetHeight : 58;
        if (catalog) {
          if (lenis) {
            lenis.scrollTo(catalog, { offset: -offset, immediate: true });
          } else {
            window.scrollTo({
              top: catalog.getBoundingClientRect().top + window.scrollY - offset,
              behavior: 'auto'
            });
          }
        }
      }, 60);
    }

    initScrollLoop();
    initResize();

    /* After all images load: refresh observers */
    window.addEventListener('load', () => {
      if (io) {
        $$('.plate:not(.is-in)').forEach(el => io.observe(el));
        $$('.rv:not(.is-in)').forEach(el => io.observe(el));
      }
      moveIndicator();
    });
  });

})();
