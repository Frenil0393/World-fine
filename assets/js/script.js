/* =============================================================
   WFBC APP — Main Javascript
============================================================= */
(function() {
  'use strict';

  /* ── 1. TICKER ─────────────────────────────── */
  const ITEMS = [
    'Agro Chemicals', 'PGR', 'Fertilizer', 'Water Soluble Fertilizer',
    'Industrial Chemicals', 'Solvents', 'Speciality Chemicals',
    'Lab Chemicals', 'Food Colour', 'Food Preservatives', 'Glassware'
  ];
  const track = document.getElementById('ticker-track');
  if (track) {
    [...ITEMS, ...ITEMS].forEach(item => {
      const el = document.createElement('span');
      el.className = 'ticker-item';
      el.innerHTML = item + '<span class="ticker-dot" aria-hidden="true"></span>';
      track.appendChild(el);
    });
  }

  /* ── 2. TESTIMONIALS ───────────────────────── */
  const REVIEWS = [
    { i:'AK', n:'Amit Kumar',      r:'Organic Farmer, Gujarat',      t:'Since switching to their products, our crop yields have increased by 15% and soil health has improved. Exactly what modern sustainable farming needs.' },
    { i:'SP', n:'Suresh Patel',    r:'Agricultural Co-op Head',      t:'World Fine Bio Chemicals provides not just products, but a true partnership in sustainable agriculture. Their solutions are unmatched.' },
    { i:'RD', n:'Rajesh Deshmukh', r:'Orchard Owner, Maharashtra',   t:'The NutriBoost fertilizer has transformed our orchard. Fruit quality is noticeably better and we use far fewer synthetic additives.' },
    { i:'VS', n:'Vikram Singh',    r:'Horticulture Specialist',       t:'BioGuard has been a lifesaver during the monsoon season. Soil-borne diseases have been virtually eliminated in our greenhouses.' },
    { i:'MS', n:'Meera Sharma',    r:'Operations Manager, GreenFab', t:'Consistency and purity of their bio-solvents are impressive. They help us maintain our green certifications without compromising performance.' },
    { i:'NK', n:'Naresh Kothari',  r:'Dealer, Rajasthan',            t:'Great service, reliable delivery, and competitive pricing. We have been sourcing from them for 6 years. No complaints whatsoever.' },
  ];
  const grid = document.getElementById('testi-grid');
  if (grid) {
    REVIEWS.forEach(r => {
      const c = document.createElement('div');
      c.className = 'tcard r-up';
      c.innerHTML = `
        <div class="tcard-q">&ldquo;</div>
        <p class="tcard-text">${r.t}</p>
        <div class="tcard-auth">
          <div class="tcard-av">${r.i}</div>
          <div>
            <div class="tcard-name">${r.n}</div>
            <div class="tcard-role">${r.r}</div>
          </div>
        </div>`;
      grid.appendChild(c);
    });
  }

  /* ── 3. FIELD & FARMERS SLIDESHOW CONTROLLER ── */
  function initGallerySlideshow() {
    const slides = Array.from(document.querySelectorAll('.gallery-slide'));
    const thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
    const prevBtn = document.getElementById('gal-prev');
    const nextBtn = document.getElementById('gal-next');
    const currEl  = document.getElementById('gal-curr');
    const totalEl = document.getElementById('gal-total');
    const fillEl  = document.getElementById('gal-progress-fill');
    const sliderWrap = document.getElementById('gallery-slider-wrap');

    if (!slides.length) return;

    let currentIndex = 0;
    const total = slides.length;
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

    const DURATION = 6000; // 6s per slide
    let startTime = performance.now();
    let animFrame = null;
    let isPaused = false;

    function goToSlide(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      currentIndex = idx;

      slides.forEach((s, i) => {
        const isActive = i === currentIndex;
        s.classList.toggle('is-active', isActive);
        s.setAttribute('aria-hidden', !isActive);
      });

      thumbs.forEach((t, i) => {
        const isActive = i === currentIndex;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', isActive);
      });

      if (currEl) currEl.textContent = String(currentIndex + 1).padStart(2, '0');
      startTime = performance.now();
      if (fillEl) fillEl.style.width = '0%';
    }

    function tick(now) {
      if (!isPaused) {
        const elapsed = now - startTime;
        const pct = Math.min(100, (elapsed / DURATION) * 100);
        if (fillEl) fillEl.style.width = pct.toFixed(1) + '%';

        if (elapsed >= DURATION) {
          goToSlide(currentIndex + 1);
        }
      } else {
        startTime = now;
      }
      animFrame = requestAnimationFrame(tick);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }

    thumbs.forEach(t => {
      t.addEventListener('click', () => {
        const idx = parseInt(t.dataset.thumb, 10);
        if (!isNaN(idx)) goToSlide(idx);
      });
    });

    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', () => { isPaused = true; });
      sliderWrap.addEventListener('mouseleave', () => { isPaused = false; startTime = performance.now(); });

      let touchStartX = 0;
      let touchEndX = 0;
      sliderWrap.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        isPaused = true;
      }, { passive: true });

      sliderWrap.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        isPaused = false;
        startTime = performance.now();
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) goToSlide(currentIndex + 1);
          else goToSlide(currentIndex - 1);
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const rect = sliderWrap ? sliderWrap.getBoundingClientRect() : null;
      const inView = rect && rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
    });

    goToSlide(0);
    animFrame = requestAnimationFrame(tick);
  }

  /* ── 4. THREE.JS — ADVANCED DARK HERO PARTICLES */
  function initThree() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x080706, 1); 

    const scene  = new THREE.Scene();
    // Add subtle fog to blend into background deeply
    scene.fog = new THREE.Fog(0x080706, 30, 100);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.z = 65;

    const N   = 2200;
    const pos = new Float32Array(N * 3);
    const aC  = new Float32Array(N * 3);
    const aSz = new Float32Array(N);

    const PALETTE = [
      [0.97, 0.96, 0.94], // bright cream
      [0.88, 0.87, 0.83], // warm grey
      [0.11, 0.29, 0.19], // deep green
      [0.22, 0.52, 0.35], // bright green accent
    ];

    for (let i = 0; i < N; i++) {
      // Cylindrical spread for more dramatic swirl
      const radius = 10 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 100;
      
      pos[i*3]   = Math.cos(theta) * radius;
      pos[i*3+1] = y;
      pos[i*3+2] = Math.sin(theta) * radius;

      // Color distribution
      const p = Math.random() < .15
        ? (Math.random() < .3 ? PALETTE[3] : PALETTE[2])
        : (Math.random() < .5 ? PALETTE[0] : PALETTE[1]);

      aC[i*3] = p[0]; aC[i*3+1] = p[1]; aC[i*3+2] = p[2];
      aSz[i]  = Math.random() * 3.0 + 1.0; 
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aC',  new THREE.BufferAttribute(aC, 3));  
    geo.setAttribute('aSz', new THREE.BufferAttribute(aSz, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uT: { value: 0.0 },
        uM: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute vec3  aC;
        attribute float aSz;
        varying   vec3  vCol;
        varying   float vAlpha;
        uniform   float uT;
        uniform   vec2  uM;

        void main() {
          vCol = aC;
          vec3 p = position;

          // Organic complex swirl motion
          float angle = uT * 0.1 + length(p.xz) * 0.01;
          float s = sin(angle);
          float c = cos(angle);
          vec3 pRot = p;
          pRot.x = p.x * c - p.z * s;
          pRot.z = p.x * s + p.z * c;
          
          float w = sin(pRot.x * .04 + uT * .3) * 3.0
                  + cos(pRot.y * .03 + uT * .2) * 2.0;
          pRot.y += w;

          // Mouse parallax 
          pRot.x += uM.x * 6.0;
          pRot.y += uM.y * 6.0;

          float dist  = length(pRot) / 60.0;
          float pulse = .6 + .4 * sin(uT * 1.5 + length(p) * .1);
          vAlpha = pulse * (1.0 - smoothstep(0.6, 1.4, dist));

          vec4 mv = modelViewMatrix * vec4(pRot, 1.0);
          
          // Depth of field simulation via point size
          float zDist = -mv.z;
          float dof = 1.0 - smoothstep(40.0, 80.0, zDist);
          
          gl_PointSize = aSz * (400.0 / zDist) * (0.5 + dof * 0.5);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3  vCol;
        varying float vAlpha;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          
          // Soft glowing dot
          float a = pow(1.0 - (d * 2.0), 1.5) * vAlpha;
          gl_FragColor = vec4(vCol, a);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let mx = 0, my = 0, t = 0;
    let targetMx = 0, targetMy = 0;
    
    document.addEventListener('mousemove', e => {
      targetMx = (e.clientX / innerWidth  - .5) * 2;
      targetMy = (e.clientY / innerHeight - .5) * 2;
    }, { passive: true });

    window.addEventListener('resize', () => {
      const W2 = canvas.offsetWidth, H2 = canvas.offsetHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    });

    (function tick() {
      requestAnimationFrame(tick);
      t += .005;
      
      // Smooth mouse interpolation
      mx += (targetMx - mx) * 0.05;
      my += (targetMy - my) * 0.05;
      
      mat.uniforms.uT.value = t;
      mat.uniforms.uM.value.set(mx, my);
      
      pts.rotation.y = t * .05;
      pts.rotation.x = t * .02;
      
      camera.position.x += (mx * 4.0 - camera.position.x) * .02;
      camera.position.y += (-my * 4.0 - camera.position.y) * .02;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    })();
  }

  /* ── 5. GSAP + LENIS ANIMATIONS ────────────── */
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* Lenis smooth scroll */
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Smooth anchor nav */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { duration: 1.2 }); }
      });
    });

    /* Nav stick */
    ScrollTrigger.create({
      start: 80,
      onEnter:     () => document.getElementById('nav').classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('nav').classList.remove('scrolled'),
    });

    /* SplitType headings — SKIP hero-h1 (uses manual .hero-h1-word spans) */
    if (window.SplitType) {
      const SPLIT_HEADS = '.about-quote, .vision-h, .products-top-h, .founder-h, .contact-compact-h, .testi-h';
      document.querySelectorAll(SPLIT_HEADS).forEach(el => {
        const sp = new SplitType(el, { types: 'lines' });
        sp.lines.forEach(ln => {
          const wrap = document.createElement('span');
          wrap.style.cssText = 'display:block;overflow:hidden';
          ln.parentNode.insertBefore(wrap, ln);
          wrap.appendChild(ln);
        });
        gsap.fromTo(sp.lines,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out', stagger: .06,
            scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
          }
        );
      });
    }

    /* Hero entrance is handled via smooth CSS hardware-accelerated keyframe reveals */

    /* ── Scroll reveals ── */
    gsap.utils.toArray('.r-up').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0, duration: .9, ease: 'power3.out',
          delay: (i % 3) * .055,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
    gsap.utils.toArray('.r-fade').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1, duration: .8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });

    /* ── Product items reveal ── */
    document.querySelectorAll('.prod-item').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    /* ── Farm image parallax ── */
    const farmImg = document.getElementById('farm-parallax');
    if (farmImg) {
      gsap.to(farmImg, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '#farm-img', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ── Vision ghost parallax ── */
    const ghost = document.querySelector('.vision-ghost');
    if (ghost) {
      gsap.to(ghost, {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: '#vision', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }
    
    /* ── Contact Big Text Parallax ── */
    const contactBig = document.querySelector('.contact-compact-h');
    if (contactBig) {
      gsap.to(contactBig, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ── Testimonial cards stagger ── */
    const tcards = document.querySelectorAll('.tcard');
    if (tcards.length) {
      gsap.fromTo(tcards,
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .1,
          scrollTrigger: { trigger: '#testi-grid', start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    }

    /* ── Counters ── */
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.getAttribute('data-count');
      ScrollTrigger.create({
        trigger: el, start: 'top 86%',
        onEnter: () => {
          const t0 = performance.now();
          const dur = 1600;
          const run = now => {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(e * target);
            if (p < 1) requestAnimationFrame(run);
            else el.textContent = target;
          };
          requestAnimationFrame(run);
        }
      });
    });

    /* ── Magnetic elements ── */
    document.querySelectorAll('.hero-cta, .nav-cta, .gcta-btn, .gallery-arrow').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * .38;
        const dy = (e.clientY - r.top  - r.height / 2) * .38;
        gsap.to(el, { x: dx, y: dy, duration: .4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.5)' });
      });
    });

    ScrollTrigger.refresh();
  }

  /* 6. BOOT SEQUENCE */
  function boot() {
    try {
      initThree();
    } catch (e) {
      console.warn('Three.js initialization error:', e);
    }
    try {
      initGallerySlideshow();
    } catch (e) {
      console.warn('Gallery slideshow initialization error:', e);
    }
    try {
      initAnimations();
    } catch (e) {
      console.warn('Animations initialization error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
