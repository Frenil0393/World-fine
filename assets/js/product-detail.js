/* =============================================================
   WORLD FINE BIO CHEMICALS — Product Detail
   One template, twelve products. The page reads differently for
   each one because the ambient colour, the photography and the
   spec figures all come from WFBC_PRODUCTS.

   Motion: CSS keyframes carry the page-load sequence (they run
   whether or not the CDN answers); GSAP + ScrollTrigger carry
   everything that depends on scroll position.
============================================================= */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const HAS_GSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  let product = null;
  let lenis   = null;

  /* ═══════════════════════════════════════════════════════
     UTILITIES
  ═══════════════════════════════════════════════════════ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* The data file joins lists with middle dots; the page reads
     better with slashes, so normalise at render time. */
  function tidy(v) { return String(v).replace(/\s*·\s*/g, ' / '); }

  function specValue(p, re) {
    const row = (p.specs || []).find(s => re.test(s.label));
    return row ? tidy(row.value) : null;
  }

  function sentences(text) {
    return String(text).split(/(?<=\.)\s+/).filter(Boolean);
  }

  /* ── Application icons ──────────────────────────────────
     One line-art mark per kind of work the product does, drawn
     on a shared 24-unit grid so the row reads as a set. Titles
     are matched most-specific first; the three on any product
     always resolve to three different marks.
  ────────────────────────────────────────────────────────── */
  const APP_ICONS = {
    grain:
      '<path d="M12 21v-9"/>' +
      '<path d="M12 12c0-2.2 1.4-4 3.5-4 0 2.2-1.4 4-3.5 4Z"/>' +
      '<path d="M12 12c0-2.2-1.4-4-3.5-4 0 2.2 1.4 4 3.5 4Z"/>' +
      '<path d="M12 7.5c0-2.2 1.4-4 3.5-4 0 2.2-1.4 4-3.5 4Z"/>' +
      '<path d="M12 7.5c0-2.2-1.4-4-3.5-4 0 2.2 1.4 4 3.5 4Z"/>',
    veg:
      '<circle cx="12" cy="14.5" r="6"/>' +
      '<path d="M12 8.5V5.5"/>' +
      '<path d="M12 6.6c1.4-1.9 3.1-2.4 5-2.2-.2 1.9-1.5 3.3-3.6 3.7"/>',
    pod:
      '<path d="M4 15c0-6 4.2-10 9.6-10 3 0 5.4 1.9 5.4 4.4C19 15.2 14.4 19 9.2 19 6.1 19 4 17.4 4 15Z"/>' +
      '<circle cx="9" cy="14.3" r="1.1"/><circle cx="12.4" cy="11.6" r="1.1"/><circle cx="15.4" cy="8.9" r="1.1"/>',
    sprout:
      '<path d="M12 21v-8"/>' +
      '<path d="M12 13C12 9.7 9.3 7 6 7c0 3.3 2.7 6 6 6Z"/>' +
      '<path d="M12 13c0-2.8 2.2-5 5-5 0 2.8-2.2 5-5 5Z"/>',
    pot:
      '<path d="M5 10.5h14l-1.3 8.7a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8Z"/>' +
      '<path d="M12 10.5V6.4"/>' +
      '<path d="M12 7.4c-2.6 0-4.2-1.6-4.2-4.2 2.6 0 4.2 1.6 4.2 4.2Z"/>',
    droplet:
      '<path d="M12 3s6 6.3 6 10a6 6 0 0 1-12 0c0-3.7 6-10 6-10Z"/>',
    drip:
      '<path d="M3 5h18"/><path d="M8 5v3.2M16 5v3.2"/>' +
      '<path d="M8 11.4c1.4 1.8 2 3 2 3.9a2 2 0 0 1-4 0c0-.9.6-2.1 2-3.9Z"/>' +
      '<path d="M16 14.6c1.1 1.4 1.6 2.3 1.6 3a1.6 1.6 0 0 1-3.2 0c0-.7.5-1.6 1.6-3Z"/>',
    flower:
      '<circle cx="12" cy="7.4" r="1.9"/>' +
      '<circle cx="12" cy="4.1" r="1.9"/><circle cx="14.9" cy="6.3" r="1.9"/>' +
      '<circle cx="13.8" cy="9.8" r="1.9"/><circle cx="10.2" cy="9.8" r="1.9"/>' +
      '<circle cx="9.1" cy="6.3" r="1.9"/>' +
      '<path d="M12 12.2V21"/>' +
      '<path d="M12 17.4c-2.2 0-3.5-1.3-3.5-3.5 2.2 0 3.5 1.3 3.5 3.5Z"/>',
    berry:
      '<circle cx="8.6" cy="14.6" r="3.3"/><circle cx="15.4" cy="14.6" r="3.3"/>' +
      '<circle cx="12" cy="9.4" r="3.3"/>' +
      '<path d="M12 6.1V3.2"/><path d="M12 4.6c1.6-1.5 3.2-1.7 4.8-1.2-.4 1.6-1.7 2.7-3.6 2.9"/>',
    greenhouse:
      '<path d="M3 20.5v-7a9 9 0 0 1 18 0v7Z"/>' +
      '<path d="M9 20.5v-9.2M15 20.5v-9.2M3.2 15.4h17.6"/>',
    tree:
      '<path d="M12 21v-6.2"/>' +
      '<circle cx="12" cy="9" r="6"/>' +
      '<path d="M12 12.4 8.9 9.3M12 10.2l3-3"/>',
    factory:
      '<path d="M2.5 21h19"/>' +
      '<path d="M3.5 21V11.2l6 3.6v-3.6l6 3.6V6.5h5V21"/>' +
      '<path d="M17.5 10.5h2.2M17.5 14.2h2.2"/>',
    gear:
      '<circle cx="12" cy="12" r="7.2"/>' +
      '<circle cx="12" cy="12" r="2.9"/>' +
      '<path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4"/>' +
      '<path d="m5.2 5.2 1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/>',
    building:
      '<path d="M2.5 21h19"/>' +
      '<path d="M5 21V4.8a1.8 1.8 0 0 1 1.8-1.8h5.4A1.8 1.8 0 0 1 14 4.8V21"/>' +
      '<path d="M14 21V10.4h4.2a1.8 1.8 0 0 1 1.8 1.8V21"/>' +
      '<path d="M8 7h3M8 11h3M8 15h3"/>',
    brush:
      '<path d="M6.2 12h11.6v3.6a2 2 0 0 1-.6 1.4L15.8 18.4V21H8.2v-2.6L6.8 17a2 2 0 0 1-.6-1.4Z"/>' +
      '<path d="M7.8 12V4.6A1.6 1.6 0 0 1 9.4 3h5.2a1.6 1.6 0 0 1 1.6 1.6V12"/>' +
      '<path d="M9.8 12v3.4M12 12v3.4M14.2 12v3.4"/>',
    spray:
      '<path d="M7.6 9.4h5.2a2.2 2.2 0 0 1 2.2 2.2V20a1 1 0 0 1-1 1H8.6a1 1 0 0 1-1-1Z"/>' +
      '<path d="M9.8 9.4V6h4"/>' +
      '<path d="M17.4 4.4h2.2M18.8 8h2.2M17.8 11.6H20"/>',
    flask:
      '<path d="M9 3h6"/>' +
      '<path d="M10 3.2v6L4.7 18.5A1.6 1.6 0 0 0 6.1 21h11.8a1.6 1.6 0 0 0 1.4-2.5L14 9.2v-6"/>' +
      '<path d="M7.4 14.4h9.2"/>',
    cylinder:
      '<path d="M8 3.5h6V18a3 3 0 0 1-6 0Z"/>' +
      '<path d="M8 9h3M8 13h3"/>' +
      '<path d="M18.4 3.4c1.3 1.7 2 2.8 2 3.6a2 2 0 0 1-4 0c0-.8.7-1.9 2-3.6Z"/>',
    tower:
      '<path d="M4 21h16"/>' +
      '<path d="M7 4h10l-2.8 5.5L18 21H6l3.8-11.5Z"/>' +
      '<path d="M9.8 9.5h4.4"/>',
    flame:
      '<path d="M12 21a6.2 6.2 0 0 0 6.2-6.2c0-4.2-3.2-6.3-4.4-9.4-1.4 1.6-1.9 3.1-1.9 4.6-1-1.4-2-2.5-2.5-4-1.6 2.1-3.6 4.6-3.6 8.8A6.2 6.2 0 0 0 12 21Z"/>',
    waves:
      '<path d="M3 7.5c2.2 0 2.2 2 4.5 2s2.2-2 4.5-2 2.2 2 4.5 2 2.3-2 4.5-2"/>' +
      '<path d="M3 12.5c2.2 0 2.2 2 4.5 2s2.2-2 4.5-2 2.2 2 4.5 2 2.3-2 4.5-2"/>' +
      '<path d="M3 17.5c2.2 0 2.2 2 4.5 2s2.2-2 4.5-2 2.2 2 4.5 2 2.3-2 4.5-2"/>',
    weave:
      '<path d="M3 5h18v14H3Z"/>' +
      '<path d="M3 9.7h18M3 14.3h18"/>' +
      '<path d="M7.5 5v14M12 5v14M16.5 5v14"/>',
    microscope:
      '<path d="M5 21h14"/>' +
      '<path d="M9 21v-2.6h6V21"/>' +
      '<path d="M12 18.4a6.4 6.4 0 0 0 6.4-6.4"/>' +
      '<path d="M14.6 3.6 18.4 7.4l-4.2 4.2-3.8-3.8Z"/>' +
      '<path d="m11.4 9.9-3.4 3.4 2.7 2.7 3.4-3.4"/>',
    shield:
      '<path d="M12 2.6 20 6v6c0 4.6-3.3 8.4-8 9.4C7.3 20.4 4 16.6 4 12V6Z"/>' +
      '<path d="m8.5 12.2 2.5 2.5 4.5-4.7"/>',
    book:
      '<path d="M4 4.6A1.6 1.6 0 0 1 5.6 3H19v15.2H5.6A1.6 1.6 0 0 0 4 19.8Z"/>' +
      '<path d="M4 19.8A1.6 1.6 0 0 1 5.6 21.4H19v-3.2"/>' +
      '<path d="M8 7.4h7M8 10.8h5"/>',
    candy:
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M8.6 9.8 4 6.4v11.2l4.6-3.4"/>' +
      '<path d="M15.4 9.8 20 6.4v11.2l-4.6-3.4"/>',
    glass:
      '<path d="M6 3h12l-1.4 16.2a2 2 0 0 1-2 1.8H9.4a2 2 0 0 1-2-1.8Z"/>' +
      '<path d="M6.7 10.2h10.6"/>',
    bread:
      '<path d="M4 12.2C4 8.3 7.6 6.2 12 6.2s8 2.1 8 6c0 1.4-1 2.2-2 2.2V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4.6c-1 0-2-.8-2-2.2Z"/>' +
      '<path d="M9 9.6 7.6 12M12.6 9.4 11 12M16.2 9.8 14.7 12"/>',
    jar:
      '<path d="M8 3h8v3H8Z"/>' +
      '<path d="M6.5 8.6A2.6 2.6 0 0 1 9.1 6h5.8a2.6 2.6 0 0 1 2.6 2.6V20a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1Z"/>' +
      '<path d="M6.5 11.2h11"/>',
    milk:
      '<path d="m8 8 4-5 4 5"/>' +
      '<path d="M7 8h10v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z"/>' +
      '<path d="M10 12.4h4"/>',
    molecule:
      '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="9" r="2.5"/><circle cx="11" cy="17" r="2.5"/>' +
      '<path d="M8.4 7.3 15.6 8.5M16.6 11.1 12.7 15M9.5 9.2l.9 5.4"/>'
  };

  /* Most specific match wins, so the order of this list matters. */
  const APP_ICON_RULES = [
    [/cereal|grain|wheat/,                  'grain'],
    [/pulse|legume|bean|lentil/,            'pod'],
    [/vegetable/,                           'veg'],
    [/seedling|nursery|germinat/,           'sprout'],
    [/transplant|potted/,                   'pot'],
    [/hydroponic/,                          'droplet'],
    [/floricultur|flower|ornamental/,       'flower'],
    [/berry|fruit/,                         'berry'],
    [/greenhouse|polyhouse/,                'greenhouse'],
    [/orchard|plantation/,                  'tree'],
    [/drip|fertigation|irrigation/,         'drip'],
    [/confection|candy|sweet/,              'candy'],
    [/beverage|drink|juice/,                'glass'],
    [/baker|bread|pastry/,                  'bread'],
    [/sauce|pickle|preserve|jar/,           'jar'],
    [/dairy|milk|yog/,                      'milk'],
    [/research|microscop/,                  'microscope'],
    [/quality|\bqc\b|assurance|complian/,   'shield'],
    [/academ|educat|school|universit|teach/,'book'],
    [/boiler|steam|furnace|heat/,           'flame'],
    [/tower|condens/,                       'tower'],
    [/water|effluent|rins/,                 'waves'],
    [/coating|paint|varnish/,               'brush'],
    [/clean|wash|degreas/,                  'spray'],
    [/machine|maintenance|equipment|tool/,  'gear'],
    [/textile|fabric|surface|dye/,          'weave'],
    [/formulation|custom|blend|bespoke/,    'cylinder'],
    [/chemistr|specialty|solvent|reagent/,  'flask'],
    [/commercial|facilit|building|premis/,  'building'],
    [/manufactur|plant|industrial|factory/, 'factory'],
    [/lab/,                                 'flask']
  ];

  function appIcon(title) {
    const t = String(title).toLowerCase();
    const hit = APP_ICON_RULES.find(r => r[0].test(t));
    const d = APP_ICONS[hit ? hit[1] : 'molecule'];
    return '<span class="pd-app-ic" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + d + '</svg></span>';
  }

  /* Name → at most three display lines, never orphaning a
     one or two letter word ("LabPure Grade A" → 2 lines). */
  /* The first word is the brand mark and gets its own line; what
     follows sits on the next line unless it is long enough to need
     its own break. Keeps every product to the same two-line rhythm. */
  function titleLines(name) {
    const raw = String(name).split(/\s+/).filter(Boolean);
    if (raw.length < 2) return raw;

    const tail = raw.slice(1);
    if (tail.join(' ').length <= 14) return [raw[0], tail.join(' ')];

    const out = [raw[0]];
    tail.forEach(w => {
      if (w.length <= 2 && out.length > 1) out[out.length - 1] += ' ' + w;
      else out.push(w);
    });
    if (out.length > 3) out.splice(2, out.length - 2, out.slice(2).join(' '));
    return out;
  }

  /* ═══════════════════════════════════════════════════════
     1 · PRODUCT FROM URL
  ═══════════════════════════════════════════════════════ */
  function getProductFromURL() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || typeof WFBC_PRODUCTS === 'undefined') return null;
    return (typeof getProductById === 'function')
      ? getProductById(id)
      : WFBC_PRODUCTS.find(p => p.id === id) || null;
  }

  function notFound() {
    const hero = $('#pd-hero');
    document.title = 'Product not found — World Fine Bio Chemicals';

    $$('.pd-strip, .pd-gallery, .pd-desc, .pd-specs, .pd-apps, .pd-order, .pd-rel').forEach(el => el.remove());
    const drawer = $('#pd-drawer-root');
    if (drawer) drawer.remove();

    if (!hero) return;
    $('#pd-crumb-now').textContent = 'Not found';
    $('#pd-eyebrow').textContent   = 'Catalog';
    $('#pd-title').innerHTML =
      '<span class="pd-title-line"><span class="pd-title-word">Product</span></span>' +
      '<span class="pd-title-line"><span class="pd-title-word">not found.</span></span>';
    $('#pd-tagline').textContent =
      'That link points to an item we no longer list. The full range is one click away.';
    $('.pd-hero-act').innerHTML =
      '<a href="products.html" class="pd-btn pd-btn--fill">Browse the catalog' +
      '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
      '<path d="M2 5h6M5 2l3 3-3 3"/></svg></a>';
    const media = $('.pd-hero-media');
    if (media) media.remove();
    const inner = $('.pd-hero-inner');
    if (inner) {
      inner.style.gridTemplateColumns = '1fr';
      inner.style.paddingRight = 'clamp(24px,4vw,64px)';
    }
  }

  /* ═══════════════════════════════════════════════════════
     2 · HERO
  ═══════════════════════════════════════════════════════ */
  function renderHero(p) {
    document.documentElement.style.setProperty('--hero-color', p.heroColor || '#1C4A30');
    document.body.style.setProperty('--hero-color', p.heroColor || '#1C4A30');

    document.title = p.name + ' — World Fine Bio Chemicals';
    const t = $('#pg-title'); if (t) t.textContent = document.title;
    const d = $('#pg-desc');  if (d) d.setAttribute('content', p.tagline + ' ' + p.purity + ', supplied by World Fine Bio Chemicals, Ahmedabad.');

    $('#pd-crumb-now').textContent = p.name;
    $('#pd-eyebrow').textContent   = p.categoryLabel;
    $('#pd-tagline').textContent   = p.tagline;

    $('#pd-title').innerHTML = titleLines(p.name).map(w =>
      '<span class="pd-title-line"><span class="pd-title-word">' + esc(w) + '</span></span>'
    ).join('');

    const img = $('#pd-hero-img');
    if (img && p.images && p.images[0]) {
      img.src = p.images[0];
      img.alt = p.name + ' — ' + p.categoryLabel;
    }

    const field = $('#pd-f-product');
    if (field) field.value = p.name;

    const orderP = $('#pd-order-p');
    if (orderP) {
      orderP.textContent = 'Tell us the pack size and quantity of ' + p.name +
        '. We reply with pricing, availability and lead time within one working day.';
    }
    const doneSub = $('#pd-done-sub');
    if (doneSub) doneSub.textContent = 'Your enquiry for ' + p.name + ' is with our desk. Expect a reply within one working day.';
  }

  /* ═══════════════════════════════════════════════════════
     3 · KEY SPECS STRIP
     Purity / Form / Packs / Shelf Life where the product has
     them. The catalog is uneven — glassware has no shelf life,
     most products carry a positioning line rather than a real
     purity figure — so unresolved cells are dropped and the
     strip tops up from the product's own spec table instead of
     printing a fact under the wrong label.
  ═══════════════════════════════════════════════════════ */
  function renderStrip(p) {
    const wrap = $('#pd-strip');
    if (!wrap) return;

    const specs  = p.specs || [];
    const purity = specValue(p, /^purity$/i);
    const form   = specValue(p, /^form$/i);
    const shelf  = specValue(p, /shelf/i);
    const packs  = specValue(p, /^pack ?sizes?$/i) || (p.packSizes || []).join(' / ');

    /* "Grade" is what the catalog plate calls p.purity — keep the
       two pages speaking the same language. */
    const items = [
      purity ? ['Purity', purity] : (p.purity ? ['Grade', tidy(p.purity)] : null),
      form   ? ['Form', form] : null,
      packs  ? ['Packs', tidy(packs)] : null,
      shelf  ? ['Shelf Life', shelf] : null
    ].filter(Boolean);

    /* Top up to four from the remaining specs, skipping anything that
       repeats a label or a value already on the strip. */
    if (items.length < 4) {
      const usedK = items.map(i => i[0].toLowerCase());
      const usedV = items.map(i => i[1].toLowerCase());
      specs
        .filter(s => usedK.indexOf(s.label.toLowerCase()) === -1 &&
                     usedV.indexOf(tidy(s.value).toLowerCase()) === -1 &&
                     String(s.value).length <= 30)
        .slice(0, 4 - items.length)
        .forEach(s => items.push([s.label, tidy(s.value)]));
    }

    /* A custom property, not the grid property itself — an inline
       grid-template-columns would outrank the responsive rules. */
    wrap.style.setProperty('--pd-cols', String(Math.max(items.length, 1)));
    wrap.innerHTML = items.map(([k, v]) =>
      '<div class="pd-strip-item">' +
        '<div class="pd-strip-k">' + esc(k) + '</div>' +
        '<div class="pd-strip-v">' + esc(v) + '</div>' +
      '</div>'
    ).join('');
  }

  /* ═══════════════════════════════════════════════════════
     4 · GALLERY
  ═══════════════════════════════════════════════════════ */
  function renderGallery(p) {
    const track = $('#pd-gallery-track');
    if (!track) return;

    const imgs = (p.images || []).slice(0, 5);
    track.innerHTML = imgs.map((src, i) =>
      '<figure class="pd-gal-item">' +
        '<img src="' + esc(src) + '" alt="' + esc(p.name) + ' — view ' + (i + 1) + '"' +
        ' loading="' + (i === 0 ? 'eager' : 'lazy') + '" width="1200" height="900" />' +
        '<figcaption class="pd-gal-n">' + String(i + 1).padStart(2, '0') + '</figcaption>' +
      '</figure>'
    ).join('');

    const n = $('#pd-gal-n');
    if (n) n.textContent = String(imgs.length).padStart(2, '0');
  }

  /* ═══════════════════════════════════════════════════════
     5 · DESCRIPTION
     Pull-quote takes the opening claim; the body carries the
     rest plus how the product actually ships.
  ═══════════════════════════════════════════════════════ */
  function renderDescription(p) {
    const quoteEl = $('#pd-desc-quote');
    const bodyEl  = $('#pd-desc-body');
    if (!quoteEl || !bodyEl) return;

    const parts = sentences(p.description || '');
    let quote = parts[0] || p.tagline || '';
    if (quote.length > 175) quote = quote.slice(0, 168).replace(/\s+\S*$/, '') + '…';

    let rest = parts.slice(1).join(' ').trim();
    if (rest.length < 60) rest = p.description || '';

    /* Glassware has no Form — it has a supply format instead */
    const form  = specValue(p, /^form$/i) || specValue(p, /^supply format$/i);
    const shelf = specValue(p, /shelf/i);
    const store = specValue(p, /storage/i);

    /* Only sizes belong in a sentence about packs — "Custom" and
       "Sets / Individual" are supply formats, not quantities. */
    const sizes = (p.packSizes || []).filter(s => /\d/.test(s));
    const packs = sizes.length > 1
      ? sizes.slice(0, -1).join(', ') + ' and ' + sizes[sizes.length - 1]
      : (sizes[0] || '');

    const lower = s => s.charAt(0).toLowerCase() + s.slice(1);

    /* Mass nouns take no article: "supplied as fine powder", but
       "supplied as a powder blend". */
    function asForm(f) {
      if (/^as per/i.test(f)) return 'Supplied to your specification';
      const v = lower(f).replace(/\s*\/\s*/g, ' or ');
      const head = v.split(/\s+/).pop();
      if (/^(crystal|crystals|powder|granules|glassware|gel)$/.test(head) || / or /.test(v)) {
        return 'Supplied as ' + v;
      }
      return 'Supplied as ' + (/^[aeiou]/i.test(v) ? 'an ' : 'a ') + v;
    }

    function asShelf(s) {
      const m = /^(\d+)\s*(month|year|day)s?\b/i.exec(s);
      if (!m) return '';
      /* eight-, eleven- and eighteen- take "an" */
      const art = /^(8|11|18)/.test(m[1]) ? 'an ' : 'a ';
      return ', with ' + art + m[1] + '-' + m[2].toLowerCase() + ' shelf life';
    }

    function asStore(s) {
      const v = lower(s);
      return /(location|place|area|room|conditions)\.?$/i.test(v)
        ? '. Store in a ' + v
        : '. Store ' + v;
    }

    const supply = [
      form ? asForm(form) : 'Supplied',
      packs ? ' in ' + packs + ' packs' : '',
      ' from our Ahmedabad works',
      shelf ? asShelf(shelf) : '',
      store ? asStore(store) : '',
      '.'
    ].join('').replace(/\.+$/, '.');

    quoteEl.textContent = quote;
    bodyEl.innerHTML = '<p>' + esc(rest) + '</p><p>' + esc(supply) + '</p>';
  }

  /* ═══════════════════════════════════════════════════════
     6 · SPECIFICATIONS
  ═══════════════════════════════════════════════════════ */
  function renderSpecs(p) {
    const list = $('#pd-specs-list');
    if (!list) return;

    list.innerHTML = (p.specs || []).map(s => {
      const value = tidy(s.value);
      /* Only count up figures that are genuinely a quantity —
         not "500ml / 1L" pack lists or "5.5 – 7.0" pH ranges. */
      const lead  = /^(\d{2,})\s*(%|months?|years?|days?)\b/i.exec(value);
      const attr  = lead ? ' data-count="' + lead[1] + '"' : '';
      return '<div class="pd-spec-row">' +
               '<dt class="pd-spec-k">' + esc(s.label) + '</dt>' +
               '<dd class="pd-spec-v"' + attr + '>' + esc(value) + '</dd>' +
             '</div>';
    }).join('');
  }

  function initSpecCounters() {
    const els = $$('#pd-specs-list [data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;

    const run = el => {
      const target = +el.getAttribute('data-count');
      const full   = el.textContent;
      const tail   = full.slice(String(target).length);
      if (REDUCED) return;
      const t0 = performance.now(), dur = 1400;
      const step = now => {
        const q = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - q, 3)) * target) + tail;
        if (q < 1) requestAnimationFrame(step);
        else el.textContent = full;
      };
      el.textContent = '0' + tail;
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        run(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    els.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════
     7 · APPLICATIONS
  ═══════════════════════════════════════════════════════ */
  function renderApplications(p) {
    const grid = $('#pd-apps-grid');
    if (!grid) return;

    grid.innerHTML = (p.applications || []).map(a =>
      '<article class="pd-app">' +
        appIcon(a.title) +
        '<h3 class="pd-app-t">' + esc(a.title) + '</h3>' +
        '<p class="pd-app-d">' + esc(a.desc) + '</p>' +
      '</article>'
    ).join('');
  }

  /* ═══════════════════════════════════════════════════════
     8 · RELATED
  ═══════════════════════════════════════════════════════ */
  function renderRelated(p) {
    const grid = $('#pd-rel-grid');
    if (!grid) return;

    const list = (typeof getRelated === 'function')
      ? getRelated(p.related || [])
      : (p.related || []).map(id => WFBC_PRODUCTS.find(x => x.id === id)).filter(Boolean);

    const items = list.filter(x => x && x.id !== p.id).slice(0, 3);
    /* No neighbours to show: drop the heading and the grid, but keep
       the section so the catalog button survives. */
    if (!items.length) {
      const head = $('.pd-rel-head');
      if (head) head.remove();
      grid.remove();
      return;
    }

    grid.innerHTML = items.map(r =>
      '<a class="pd-rel-card" href="product-detail.html?id=' + encodeURIComponent(r.id) + '"' +
        ' aria-label="' + esc(r.name) + ' — ' + esc(r.categoryLabel) + '">' +
        '<span class="pd-rel-fig">' +
          '<img src="' + esc(r.images[0]) + '" alt="" loading="lazy" width="800" height="600" />' +
          '<span class="pd-rel-tag">' + esc(r.categoryLabel) + '</span>' +
        '</span>' +
        '<span class="pd-rel-b">' +
          '<span class="pd-rel-n">' + esc(r.name) + '</span>' +
          '<span class="pd-rel-t">' + esc(r.tagline) + '</span>' +
        '</span>' +
      '</a>'
    ).join('');
  }

  /* ═══════════════════════════════════════════════════════
     9 · SMOOTH SCROLL
  ═══════════════════════════════════════════════════════ */
  function initLenis() {
    if (REDUCED || typeof window.Lenis === 'undefined') return null;

    lenis = new window.Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    if (HAS_GSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    return lenis;
  }

  /* ═══════════════════════════════════════════════════════
     11 · GALLERY — vertical scroll drives horizontal travel
  ═══════════════════════════════════════════════════════ */
  function galleryFallback(section, vp) {
    section.style.height = 'auto';
    section.style.paddingTop = 'clamp(56px,8vw,110px)';
    section.style.paddingBottom = 'clamp(56px,8vw,110px)';
    vp.style.overflowX = 'auto';
    vp.style.scrollSnapType = 'x mandatory';
    $$('.pd-gal-item', vp).forEach(el => { el.style.scrollSnapAlign = 'center'; });
    const count = $('.pd-gallery-count');
    if (count) count.style.display = 'none';
  }

  function initGalleryScroll() {
    const section = $('#pd-gallery');
    const vp      = $('#pd-gallery-vp');
    const track   = $('#pd-gallery-track');
    if (!section || !vp || !track) return;

    /* Pinned scrubbing is a pointer gesture. On a phone the same
       content reads better as a swipeable filmstrip, so hand it to
       the native fallback rather than hijacking the touch scroll. */
    if (!HAS_GSAP || REDUCED || window.innerWidth <= 700) { galleryFallback(section, vp); return; }

    const idx   = $('#pd-gal-i');
    const total = track.children.length;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    if (distance() <= 0) { galleryFallback(section, vp); return; }

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (!idx) return;
          const n = Math.min(total, Math.max(1, Math.round(self.progress * (total - 1)) + 1));
          const s = String(n).padStart(2, '0');
          if (idx.textContent !== s) idx.textContent = s;
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     12 · SCROLL ANIMATIONS
  ═══════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    /* The strip starts clipped so it can wipe open. If GSAP never
       arrives, unclip it rather than leave the row invisible. */
    if (!HAS_GSAP || REDUCED) {
      $$('.pd-strip-item').forEach(el => { el.style.clipPath = 'none'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const from = (targets, vars, triggerSel, opts) => {
      const els = $$(targets);
      if (!els.length) return;
      gsap.from(els, Object.assign({
        ease: 'power3.out',
        duration: 1,
        scrollTrigger: Object.assign({
          trigger: triggerSel || els[0],
          start: 'top 85%'
        }, opts || {})
      }, vars));
    };

    /* Key-spec strip wipes open from the left */
    const stripItems = $$('.pd-strip-item');
    if (stripItems.length) {
      gsap.to(stripItems, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.05,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.pd-strip', start: 'top 88%' }
      });
    }

    from('.pd-desc-quote', { x: -44, autoAlpha: 0, duration: 1.15 }, '.pd-desc');
    from('.pd-desc-body',  { x: 44,  autoAlpha: 0, duration: 1.15 }, '.pd-desc');

    from('.pd-specs-head > *', { y: 26, autoAlpha: 0, stagger: 0.08 }, '.pd-specs');
    from('.pd-spec-row', { y: 20, autoAlpha: 0, duration: .8, stagger: 0.06 }, '#pd-specs-list', { start: 'top 88%' });

    from('.pd-apps .pd-h2', { y: 30, autoAlpha: 0 }, '.pd-apps');
    from('.pd-app', { y: 40, autoAlpha: 0, duration: 1.05, stagger: 0.1 }, '.pd-apps-grid');

    from('.pd-order-p, .pd-order-act', { y: 30, autoAlpha: 0, stagger: 0.1 }, '.pd-order', { start: 'top 78%' });

    from('.pd-rel-head > *', { y: 24, autoAlpha: 0, stagger: 0.08 }, '.pd-rel');
    from('.pd-rel-card', { y: 40, autoAlpha: 0, duration: 1.05, stagger: 0.1 }, '.pd-rel-grid');
    from('.pd-rel-more', { y: 24, autoAlpha: 0, duration: .9 }, '.pd-rel-more', { start: 'top 95%' });

    /* The order headline drifts slower than the page */
    const orderH = $('#pd-order-h');
    if (orderH) {
      gsap.fromTo(orderH, { yPercent: 12 }, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '#pd-order', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ═══════════════════════════════════════════════════════
     13 · ENQUIRY DRAWER
  ═══════════════════════════════════════════════════════ */
  function initEnquiryDrawer() {
    const root  = $('#pd-drawer-root');
    const panel = $('#pd-drawer');
    const scrim = $('#pd-drawer-scrim');
    const form  = $('#pd-form');
    const body  = $('#pd-drawer-body');
    const done  = $('#pd-drawer-done');
    const err   = $('#pd-form-err');
    if (!root || !panel || !form) return;

    let lastFocus = null;
    let open = false;

    const focusables = () => $$(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', panel
    ).filter(el => !el.disabled && el.offsetParent !== null);

    function show(trigger) {
      if (open) return;
      open = true;
      /* Prefer the button that opened us — a mouse click does not focus a
         button on every browser, so activeElement alone is unreliable */
      lastFocus = (trigger && trigger.focus) ? trigger : document.activeElement;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();

      /* Force a style flush so the CSS transition has a start value */
      void root.offsetWidth;
      root.classList.add('is-open');

      if (HAS_GSAP && !REDUCED) {
        gsap.from($$('.pd-drawer-k, .pd-drawer-h, .pd-drawer-sub, .pd-field, .pd-form-submit', panel),
          { y: 22, autoAlpha: 0, duration: .7, stagger: .05, ease: 'power3.out', delay: .22 });
      }

      const first = form.querySelector('input[name="name"]') || focusables()[0];
      setTimeout(() => { if (first) first.focus(); }, REDUCED ? 0 : 460);
    }

    function hide() {
      if (!open) return;
      open = false;
      root.classList.remove('is-open');

      const finish = () => {
        root.hidden = true;
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        if (lastFocus && lastFocus.focus) lastFocus.focus();
        /* Reset for the next enquiry */
        body.hidden = false;
        done.hidden = true;
        if (err) { err.hidden = true; err.textContent = ''; }
      };

      if (REDUCED) finish();
      else setTimeout(finish, 620);
    }

    $$('[data-enquiry]').forEach(b => b.addEventListener('click', () => show(b)));
    if (scrim) scrim.addEventListener('click', hide);
    const x = $('#pd-drawer-x'); if (x) x.addEventListener('click', hide);
    const dc = $('#pd-done-close'); if (dc) dc.addEventListener('click', hide);

    document.addEventListener('keydown', e => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
      if (e.key !== 'Tab') return;

      const list = focusables();
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = form.elements.name;
      const phone = form.elements.phone;

      [name, phone].forEach(f => f.removeAttribute('aria-invalid'));

      const missing = [];
      if (!name.value.trim())  { missing.push('your name');   name.setAttribute('aria-invalid', 'true'); }
      if (!phone.value.trim()) { missing.push('a phone number'); phone.setAttribute('aria-invalid', 'true'); }

      if (missing.length) {
        if (err) {
          err.textContent = 'We need ' + missing.join(' and ') + ' to reply.';
          err.hidden = false;
        }
        (missing.length && !name.value.trim() ? name : phone).focus();
        return;
      }

      if (err) { err.hidden = true; err.textContent = ''; }
      body.hidden = true;
      done.hidden = false;

      if (HAS_GSAP && !REDUCED) {
        /* opacity, not autoAlpha — autoAlpha would set visibility:hidden on
           frame 0 and the close button below could not take focus */
        gsap.from(done.children, { y: 24, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out' });
      }
      const close = $('#pd-done-close');
      if (close) close.focus();
    });
  }

  /* ═══════════════════════════════════════════════════════
     14 · NAV + MAGNETIC BUTTONS
  ═══════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;

    const update = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      document.body.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    };
    update();

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });

    window.addEventListener('resize', update, { passive: true });
  }

  function initMagnetic() {
    if (REDUCED || window.matchMedia('(hover: none)').matches) return;
    $$('.nav-cta, .pd-btn--fill, .pd-btn--green').forEach(el => {
      if (el.closest('#pd-drawer')) return;   // no drift inside the form
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transition = 'transform .4s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform =
          'translate(' + ((e.clientX - r.left - r.width / 2) * 0.38).toFixed(1) + 'px,' +
                         ((e.clientY - r.top - r.height / 2) * 0.38).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .65s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* Application cards — "Where it works" tilt effect.
     FIX: Write --tilt-x / --tilt-y CSS custom properties instead of
     setting style.transform directly. This lets CSS :hover handle the
     translateY(-8px) lift independently, and the CSS transition
     handles the smooth return — no more snap-back jitter on mouseleave. */
  function initCardTilt() {
    if (REDUCED || window.matchMedia('(hover: none)').matches) return;
    $$('.pd-app').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientX - r.left) / r.width  - 0.5) * 6;
        const ry = ((e.clientY - r.top)  / r.height - 0.5) * -5;
        /* Fast response while moving — CSS transition takes over on leave */
        card.style.transition =
          'transform .18s ease-out, box-shadow .55s cubic-bezier(0.16,1,0.3,1)';
        card.style.setProperty('--tilt-x', rx.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', ry.toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        /* Let the CSS transition in product-detail.css (.6s expo) carry
           the card cleanly back to 0,0 — do NOT reset style.transform */
        card.style.transition = '';
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════════════ */
  function boot() {
    initNav();
    initLenis();

    product = getProductFromURL();
    if (!product) { notFound(); return; }

    renderHero(product);
    renderStrip(product);
    renderGallery(product);
    renderDescription(product);
    renderSpecs(product);
    renderApplications(product);
    renderRelated(product);

    initGalleryScroll();
    initScrollAnimations();
    initSpecCounters();
    initEnquiryDrawer();
    initMagnetic();
    initCardTilt();

    if (HAS_GSAP && !REDUCED) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
