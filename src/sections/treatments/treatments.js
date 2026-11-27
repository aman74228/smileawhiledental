// Featured treatments
//   ≥1024px + motion → PINNED stage. Scroll progress picks the active treatment (4 segments of
//     ~62.5vh = 250vh pin). Rest points snap to each segment's centre (0.45s, house easing), so
//     the switch happens halfway between rests and scrubbing back never bounces forward.
//     The active tab's line fills top→bottom with progress through its segment.
//     Card change: incoming image clip-wipes in (from the bottom going forward, from the top going
//     back) while scaling 1.08 → 1; the outgoing image scales to 0.96 and dims underneath.
//     Text + tags: old fade out up 12px, new fade in up 12px, stagger 0.06. Transform/opacity/clip only.
//     Tabs (ARIA tablist): click / Enter / ←↑→↓ / Home / End scroll (Lenis) to that step.
//   <1024px → swipeable carousel, counter follows the card in view, cards fade up on entry.
//   Reduced motion (any width) → .is-stacked: plain list, fade-in only, no pin, no wipe.
import { gsap, ScrollTrigger, EASE, isReduced, getLenis } from '../../js/motion.js';

const SEGMENT_VH = 0.625;           // scroll per treatment, as a fraction of the viewport height
const EXPO = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function initTreatments() {
  const root = document.querySelector('[data-treatments]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-treatments-tab]')];
  const cards = [...root.querySelectorAll('[data-treatment]')];
  const fills = tabs.map((t) => t.querySelector('[data-tab-fill]'));
  const tablist = root.querySelector('[data-treatments-tabs]');
  const list = root.querySelector('[data-treatments-list]');
  const current = root.querySelector('[data-treatments-current]');
  const n = cards.length;
  const pad = (i) => String(i + 1).padStart(2, '0');
  root.querySelector('[data-treatments-total]').textContent = pad(n - 1);
  const parts = (card) => ({
    img: card.querySelector('[data-treatment-img]'),
    dim: card.querySelector('[data-treatment-dim]'),
    text: [...card.querySelectorAll('[data-treatment-tags] li, [data-treatment-body] > *')],
  });

  /* ---------- Reduced motion: stacked list, fade-in only ---------- */
  if (isReduced()) {
    root.classList.add('is-stacked');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      gsap.fromTo(e.target, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' });
      io.unobserve(e.target);
    }), { threshold: 0.15 });
    cards.forEach((c) => { gsap.set(c, { opacity: 0 }); io.observe(c); });
    return;
  }

  // Pre-warm every image before the section is reached, so a swap never shows a blank.
  const warm = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    root.querySelectorAll('.treatment-card__img').forEach((img) => { img.loading = 'eager'; img.decode?.().catch(() => {}); });
    warm.disconnect();
  }, { rootMargin: '150% 0px' });
  warm.observe(root);

  const mm = gsap.matchMedia();

  /* ---------- Mobile / tablet: carousel ---------- */
  mm.add('(max-width: 63.99rem)', () => {
    // Counter = card whose left edge is nearest the scroll start (2 cards can be visible on tablet).
    const onScroll = () => {
      const x = list.scrollLeft;
      let best = 0;
      cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - list.offsetLeft - x) < Math.abs(cards[best].offsetLeft - list.offsetLeft - x)) best = i; });
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 4) best = n - 1;
      current.textContent = pad(best);
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    const seen = new WeakSet();
    const fade = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting || seen.has(e.target)) return;
      seen.add(e.target);
      gsap.fromTo(e.target, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE, clearProps: 'transform,opacity' });
    }), { threshold: 0.25 });
    cards.forEach((c) => { fade.observe(c); gsap.set(c, { opacity: 0 }); });
    return () => { list.removeEventListener('scroll', onScroll); fade.disconnect(); gsap.set(cards, { clearProps: 'all' }); };
  });

  /* ---------- Desktop: pinned stage ---------- */
  mm.add('(min-width: 64rem)', () => {
    let active = 0;
    let tl;
    root.classList.add('is-pinned');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Featured treatments');
    tablist.setAttribute('aria-orientation', 'vertical');
    list.setAttribute('role', 'presentation');
    tabs.forEach((t, i) => {
      t.setAttribute('role', 'tab');
      t.dataset.href = t.getAttribute('href');
      t.removeAttribute('href');           // Lenis' anchor handling would hijack "#…" clicks
      t.setAttribute('aria-controls', cards[i].id);
      cards[i].setAttribute('role', 'tabpanel');
      cards[i].setAttribute('aria-labelledby', t.id);
    });

    const setAria = () => {
      tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === active)); t.tabIndex = i === active ? 0 : -1; });
      cards.forEach((c, i) => { c.setAttribute('aria-hidden', String(i !== active)); c.inert = i !== active; });
    };
    cards[0].classList.add('is-active');
    setAria();

    const go = (to, dir) => {
      const from = active;
      if (to === from) return;
      active = to;
      setAria();
      tl?.progress(1).kill();
      const inc = parts(cards[to]); const out = parts(cards[from]);
      cards.forEach((c) => c.classList.remove('is-active', 'is-leaving'));
      cards[to].classList.add('is-active');
      cards[from].classList.add('is-leaving');
      gsap.set(inc.dim, { opacity: 0 });
      tl = gsap.timeline({
        defaults: { ease: EASE },
        onComplete: () => {
          cards[from].classList.remove('is-leaving');
          gsap.set([out.img, out.dim, ...out.text], { clearProps: 'all' });
        },
      });
      tl.fromTo(inc.img, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.75 }, 0)
        .to(out.img, { scale: 0.96, duration: 0.75 }, 0)
        .to(out.dim, { opacity: 0.35, duration: 0.75 }, 0)
        .to(out.text, { opacity: 0, y: -12, duration: 0.28, stagger: 0.03, ease: 'power2.in' }, 0)
        .fromTo(inc.text, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, clearProps: 'transform' }, 0.2);
    };

    const setFills = (p) => {
      const seg = Math.min(n - 1, Math.floor(p * n));
      const local = Math.min(1, Math.max(0, p * n - seg));
      fills.forEach((f, i) => gsap.set(f, { scaleY: i === seg ? local : 0 }));
    };

    const lenis = getLenis();
    const SNAPS = [0, ...[...Array(n).keys()].map((i) => (i + 0.5) / n), 1];
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * SEGMENT_VH * n)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        setFills(p);
        const idx = Math.min(n - 1, Math.floor(p * n + 1e-4));
        if (idx !== active) go(idx, idx > active ? 1 : -1);
      },
      // Native snap only when Lenis isn't driving the scroll (it would fight the smoothing).
      snap: lenis ? false : { snapTo: SNAPS, duration: { min: 0.3, max: 0.5 }, ease: 'power3.out', delay: 0.08 },
    });

    // Lenis snap: when scrolling settles inside the pin, ease to the nearest step centre.
    const stepPos = (i) => st.start + ((i + 0.5) / n) * (st.end - st.start);
    let navigating = false;               // a tab-driven scroll is running: don't snap over it
    const onScrollEnd = () => {
      if (!lenis || !st.isActive || navigating || lenis.isScrolling) return;
      const p = st.progress;
      if (p <= 0.001 || p >= 0.999) return;
      const nearest = SNAPS.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a));
      if (Math.abs(nearest - p) * (st.end - st.start) < 2) return;
      lenis.scrollTo(st.start + nearest * (st.end - st.start), { duration: 0.45, easing: EXPO });
    };
    ScrollTrigger.addEventListener('scrollEnd', onScrollEnd);

    // Tabs: click / keys scroll to the step's rest point.
    const scrollToStep = (i) => {
      const y = stepPos(i);
      if (lenis) { navigating = true; lenis.scrollTo(y, { duration: 0.9, easing: EXPO, force: true, onComplete: () => { navigating = false; } }); }
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    const onClick = (e) => { e.preventDefault(); scrollToStep(tabs.indexOf(e.currentTarget)); };
    const onKey = (e) => {
      const i = tabs.indexOf(e.currentTarget);
      const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: n - 1 };
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToStep(i); return; }
      if (!(e.key in map)) return;
      e.preventDefault();
      const to = (map[e.key] + n) % n;
      tabs[to].focus();
      scrollToStep(to);
    };
    tabs.forEach((t) => { t.addEventListener('click', onClick); t.addEventListener('keydown', onKey); });

    return () => {
      ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd);
      tabs.forEach((t) => { t.removeEventListener('click', onClick); t.removeEventListener('keydown', onKey); });
      tl?.kill(); st.kill();
      root.classList.remove('is-pinned');
      ['role', 'aria-label', 'aria-orientation'].forEach((a) => tablist.removeAttribute(a));
      list.setAttribute('role', 'list');
      tabs.forEach((t) => { ['role', 'aria-controls', 'aria-selected', 'tabindex'].forEach((a) => t.removeAttribute(a)); t.setAttribute('href', t.dataset.href); });
      cards.forEach((c) => { c.setAttribute('role', 'listitem'); c.removeAttribute('aria-hidden'); c.inert = false; c.classList.remove('is-active', 'is-leaving'); });
      gsap.set(fills, { clearProps: 'all' });
    };
  });
}
