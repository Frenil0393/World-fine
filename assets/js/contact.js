/* =============================================================
   WFBC — Contact Page JS  v4
   Three.js 3D canvas, custom cursor, loader, 3D tilt cards,
   multi-step form, smooth scroll, magnetic CTA, reveals
============================================================= */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  let lenis = null;

  /* ════════════════════════════════════════════════════════
     THREE.JS HERO CANVAS
  ════════════════════════════════════════════════════════ */
  function initHeroCanvas() {
    const canvas = $('#ct-canvas');
    if (!canvas || typeof THREE === 'undefined' || REDUCED) return;

    const scene    = new THREE.Scene();
    const W        = canvas.offsetWidth;
    const H        = canvas.offsetHeight;
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    // ── Particle field (molecules floating) ──
    const PARTICLE_COUNT = 600;
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const sizes      = new Float32Array(PARTICLE_COUNT);
    const alphas     = new Float32Array(PARTICLE_COUNT);
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos(2 * Math.random() - 1);
      const radius = 6 + Math.random() * 20;
      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      sizes[i]  = 0.5 + Math.random() * 2.5;
      alphas[i] = 0.1 + Math.random() * 0.7;
      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ptGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const ptMat = new THREE.PointsMaterial({
      color: 0x2ecc71,
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // ── Connection lines (molecular bonds) ──
    const lineGeo  = new THREE.BufferGeometry();
    const linePos  = new Float32Array(300 * 6); // 300 lines × 2 points × 3 coords
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x1C4A30, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
    );
    scene.add(lineMat);

    // ── Floating geometric shapes ──
    const shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.8, 0),
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
      new THREE.IcosahedronGeometry(0.5, 1),
    ];
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1C4A30,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    for (let i = 0; i < 6; i++) {
      const geo  = geometries[i % geometries.length];
      const mesh = new THREE.Mesh(geo, wireMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.006,
        ry: (Math.random() - 0.5) * 0.008,
        fy: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Resize ──
    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Update connections ──
    function updateConnections(t) {
      const posArr = ptGeo.attributes.position.array;
      let li = 0;
      const lpa = lineGeo.attributes.position.array;
      const THRESHOLD = 5.5;
      const MAX_LINES = 300;
      for (let a = 0; a < PARTICLE_COUNT && li < MAX_LINES; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT && li < MAX_LINES; b++) {
          const dx = posArr[a*3]   - posArr[b*3];
          const dy = posArr[a*3+1] - posArr[b*3+1];
          const dz = posArr[a*3+2] - posArr[b*3+2];
          const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (d < THRESHOLD) {
            lpa[li*6]   = posArr[a*3];
            lpa[li*6+1] = posArr[a*3+1];
            lpa[li*6+2] = posArr[a*3+2];
            lpa[li*6+3] = posArr[b*3];
            lpa[li*6+4] = posArr[b*3+1];
            lpa[li*6+5] = posArr[b*3+2];
            li++;
          }
        }
      }
      // Clear remaining
      for (let k = li; k < MAX_LINES; k++) {
        lpa.fill(0, k*6, k*6+6);
      }
      lineGeo.attributes.position.needsUpdate = true;
    }

    // ── Animate ──
    let lastTime = 0;
    const animate = (time) => {
      requestAnimationFrame(animate);
      const dt = time - lastTime;
      lastTime = time;
      const t = time * 0.001;

      // Smooth mouse
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      // Camera drift
      camera.position.x = targetX * 3;
      camera.position.y = -targetY * 1.5;

      // Particle drift
      const posArr = ptGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const v = velocities[i];
        posArr[i*3]   += v.x;
        posArr[i*3+1] += v.y + Math.sin(t * 0.5 + v.phase) * 0.001;
        posArr[i*3+2] += v.z;
        // Wrap in sphere
        const px = posArr[i*3], py = posArr[i*3+1], pz = posArr[i*3+2];
        const dist = Math.sqrt(px*px + py*py + pz*pz);
        if (dist > 26) {
          posArr[i*3]   *= 0.1;
          posArr[i*3+1] *= 0.1;
          posArr[i*3+2] *= 0.1;
        }
      }
      ptGeo.attributes.position.needsUpdate = true;

      // Update connections (every 3 frames for perf)
      if (Math.floor(t * 20) % 3 === 0) updateConnections(t);

      // Rotate shapes
      shapes.forEach((mesh) => {
        const ud = mesh.userData;
        mesh.rotation.x += ud.rx;
        mesh.rotation.y += ud.ry;
        mesh.position.y = ud.baseY + Math.sin(t * 0.4 + ud.phase) * 0.8;
      });

      // Gently rotate whole particle field
      particles.rotation.y = t * 0.04 + targetX * 0.1;
      particles.rotation.x = t * 0.02 + targetY * 0.05;

      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
  }

  /* ════════════════════════════════════════════════════════
     TICKER
  ════════════════════════════════════════════════════════ */
  function initTicker() {
    const ITEMS = [
      'Agro Chemicals', 'PGR', 'Fertilizer', 'Water Soluble Fertilizer',
      'Industrial Chemicals', 'Solvents', 'Speciality Chemicals',
      'Lab Chemicals', 'Food Colour', 'Food Preservatives', 'Glassware'
    ];
    const track = $('#ticker-track');
    if (!track) return;
    [...ITEMS, ...ITEMS].forEach(item => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.innerHTML = item + '<span class="ticker-dot" aria-hidden="true"></span>';
      track.appendChild(el);
    });
  }

  /* ════════════════════════════════════════════════════════
     SMOOTH SCROLL (LENIS)
  ════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    try {
      lenis = new Lenis({
        duration: 1.25,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
      lenis.on('scroll', onScroll);
    } catch (e) { console.warn('Lenis:', e); }
  }

  /* ════════════════════════════════════════════════════════
     SCROLL REVEALS — handles .ct-rv and .rv
  ════════════════════════════════════════════════════════ */
  let io;
  function initReveals() {
    const els = $$('.ct-rv, .ct-main-section .rv, .ct-location-section .rv, .ct-cards-section .rv');
    if (!els.length) return;
    if (REDUCED) { els.forEach(el => el.classList.add('is-in')); return; }
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const baseDelay = parseFloat(getComputedStyle(e.target).getPropertyValue('--d') || '0');
          e.target.style.setProperty('--d', baseDelay + 's');
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }


  /* ════════════════════════════════════════════════════════
     3D TILT — disabled
  ════════════════════════════════════════════════════════ */
  function initTilt() {
    // Tilt removed per design decision — no perspective rotation on hover
  }

  /* ════════════════════════════════════════════════════════
     CLOCK
  ════════════════════════════════════════════════════════ */
  function initClock() {
    const hour = $('.ct-clock-hour');
    const min  = $('.ct-clock-min');
    if (!hour || !min) return;
    const tick = () => {
      const now = new Date();
      const h   = ((now.getHours() % 12) + now.getMinutes() / 60) / 12 * 360;
      const m   = now.getMinutes() / 60 * 360;
      hour.style.transform = `rotate(${h}deg)`;
      min.style.transform  = `rotate(${m}deg)`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ════════════════════════════════════════════════════════
     MULTI-STEP FORM
  ════════════════════════════════════════════════════════ */
  let currentStep = 1;

  function goToStep(step) {
    const panels = $$('.ct-form-panel');
    const steps  = $$('.ct-form-step');
    const lines  = $$('.ct-form-step-line');

    panels.forEach(p => p.classList.remove('is-active'));
    const target = $(`.ct-form-panel[data-panel="${step}"]`);
    if (target) target.classList.add('is-active');

    steps.forEach((s, i) => {
      const num = i + 1;
      s.classList.remove('is-active', 'is-done');
      if (num === step)     s.classList.add('is-active');
      else if (num < step)  s.classList.add('is-done');
    });

    currentStep = step;
  }

  function initForm() {
    const form = $('#contact-form');
    const btn  = $('#ct-submit');
    const succ = $('#ct-success');
    if (!form) return;

    // Step navigation
    const next1 = $('#ct-step1-next');
    const back2 = $('#ct-step2-back');
    const next2 = $('#ct-step2-next');
    const back3 = $('#ct-step3-back');

    if (next1) next1.addEventListener('click', () => {
      const name = $('#ct-fn');
      if (name && !name.value.trim()) { name.focus(); shakeEl(name); return; }
      goToStep(2);
    });
    if (back2) back2.addEventListener('click', () => goToStep(1));
    if (next2) next2.addEventListener('click', () => {
      const prod = $('#ct-product');
      if (prod && !prod.value.trim()) { prod.focus(); shakeEl(prod); return; }
      goToStep(3);
    });
    if (back3) back3.addEventListener('click', () => goToStep(2));

    // Quick category buttons
    $$('.ct-cat-btn').forEach(b => {
      b.addEventListener('click', () => {
        $$('.ct-cat-btn').forEach(x => x.classList.remove('is-selected'));
        b.classList.add('is-selected');
        const prod = $('#ct-product');
        if (prod) {
          prod.value = b.dataset.cat;
          prod.dispatchEvent(new Event('input'));
          // Trigger floating label
          prod.placeholder = ' ';
        }
      });
    });

    // Submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!btn || !succ) return;

      const origHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `
        <span class="ct-submit-label">Sending…</span>
        <div class="ct-submit-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="animation:ctSpinAnim .8s linear infinite">
            <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
          </svg>
        </div>`;

      setTimeout(() => {
        succ.hidden = false;
        form.querySelectorAll('.ct-form-panel').forEach(p => p.classList.remove('is-active'));
        succ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        $$('.ct-cat-btn').forEach(b => b.classList.remove('is-selected'));
        setTimeout(() => {
          succ.hidden = true;
          goToStep(1);
          btn.disabled = false;
          btn.innerHTML = origHTML;
        }, 6000);
      }, 1200);
    });
  }

  function shakeEl(el) {
    if (REDUCED) return;
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'ctShake .4s var(--expo)';
    // Inject keyframe if not exists
    if (!document.getElementById('ct-shake-kf')) {
      const s = document.createElement('style');
      s.id = 'ct-shake-kf';
      s.textContent = `
        @keyframes ctShake { 0%,100%{transform:none} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        @keyframes ctSpinAnim { to { transform: rotate(360deg); } }
      `;
      document.head.appendChild(s);
    }
  }

  /* ════════════════════════════════════════════════════════
     MAGNETIC CTA
  ════════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (REDUCED || window.matchMedia('(hover:none)').matches) return;
    $$('.ct-hero-btn--primary, .nav-cta, .ct-submit').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: dx, y: dy, duration: 0.45, ease: 'power3.out' });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.5)' });
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     SMOOTH ANCHORS
  ════════════════════════════════════════════════════════ */
  function initAnchors() {
    $$('a[href^="#"], [data-scroll]').forEach(a => {
      const href = a.getAttribute('href') || a.dataset.scroll;
      if (!href || href.length < 2) return;
      a.addEventListener('click', e => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = $('#nav') ? $('#nav').offsetHeight : 58;
        if (lenis) {
          lenis.scrollTo(target, { offset: -navH - 20, duration: 1.4 });
        } else {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: REDUCED ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     NAV
  ════════════════════════════════════════════════════════ */
  function navLightMode() {
    const nav  = $('#nav');
    const body = document.body;
    if (!nav) return;
    const strip = $('.ct-main-section');
    if (!strip) return;
    const startY = strip.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    const sy = window.scrollY;
    body.classList.toggle('nav-light', sy >= startY);
    nav.classList.toggle('scrolled', sy > 40);
  }

  function onScroll() { navLightMode(); }

  /* ════════════════════════════════════════════════════════
     PARALLAX HERO BG
  ════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const wrap = $('#ct-parallax-img');
    const hero = $('#ct-hero');
    if (!wrap || !hero || REDUCED) return;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(wrap, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
      });
    }
  }

  /* ════════════════════════════════════════════════════════
     HERO GSAP TEXT ANIMATIONS
  ════════════════════════════════════════════════════════ */
  function initHeroAnimations() {
    if (REDUCED || typeof gsap === 'undefined') return;
    // Depth cards hover parallax
    $$('.ct-depth-card').forEach(card => {
      document.addEventListener('mousemove', e => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 12;
        const dy = (e.clientY / window.innerHeight - 0.5) * 8;
        gsap.to(card, { x: dx, y: dy, duration: 1.5, ease: 'power2.out' });
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     SCROLL LOOP FALLBACK
  ════════════════════════════════════════════════════════ */
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

  /* ════════════════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initTicker();
    initSmoothScroll();
    initHeroCanvas();
    initHeroParallax();
    initHeroAnimations();
    initReveals();
    initTilt();
    initClock();
    initForm();
    initMagnetic();
    initAnchors();
    initScrollLoop();

    window.addEventListener('resize', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      navLightMode();
    }, { passive: true });
  });

})();
