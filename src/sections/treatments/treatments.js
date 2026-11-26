// Featured treatments
//   ≥1024px  ARIA tablist (vertical): click / ←↑→↓ / Home / End switch the card.
//            Card change = 0.4s crossfade + one ring pulse from the tile; reduced motion = fade only. No auto-advance.
//   <1024px  native scroll-snap carousel; the "01 / 04" counter follows the
//            card in view. Tab semantics are removed so nothing is announced twice.
import { gsap, isReduced } from '../../js/motion.js';

export function initTreatments() {
  const root = document.querySelector('[data-treatments]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-treatments-tab]')];
  const cards = [...root.querySelectorAll('[data-treatment]')];
  const tablist = root.querySelector('[data-treatments-tabs]');
  const list = root.querySelector('[data-treatments-list]');
  const current = root.querySelector('[data-treatments-current]');
  root.querySelector('[data-treatments-total]').textContent = String(cards.length).padStart(2, '0');
  const pad = (i) => String(i + 1).padStart(2, '0');
  const mq = window.matchMedia('(min-width: 64rem)');
  let active = 0;

  /* ---------- Desktop: tabs ---------- */
  const select = (i, { focus = false, animate = true } = {}) => {
    const prev = active;
    active = (i + cards.length) % cards.length;
    tabs.forEach((t, n) => {
      const on = n === active;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    cards.forEach((c, n) => {
      c.setAttribute('aria-hidden', String(n !== active));
      c.inert = n !== active;
    });
    current.textContent = pad(active);
    if (focus) tabs[active].focus();
    if (animate && prev !== active) {
      // 0.4s crossfade (icon, tags and copy change together) + one soft ring pulse.
      gsap.to(cards[prev], { opacity: 0, duration: 0.4, ease: 'power1.inOut', overwrite: true });
      gsap.fromTo(cards[active], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.inOut', overwrite: true });
      if (!isReduced()) {
        const pulse = cards[active].querySelector('.treatment-card__pulse');
        gsap.fromTo(pulse, { scale: 1, opacity: 0.7 }, { scale: 1.55, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.1 });
      }
    }
  };

  const onClick = (e) => {
    const i = tabs.indexOf(e.currentTarget);
    if (!root.classList.contains('is-tabbed')) return;
    e.preventDefault();
    select(i);
  };
  const onKey = (e) => {
    if (!root.classList.contains('is-tabbed')) return;
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); select(active + keys[e.key], { focus: true }); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, { focus: true }); }
    else if (e.key === 'End') { e.preventDefault(); select(cards.length - 1, { focus: true }); }
  };
  tabs.forEach((t) => { t.addEventListener('click', onClick); t.addEventListener('keydown', onKey); });

  const enableTabs = () => {
    root.classList.add('is-tabbed');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Featured treatments');
    tablist.setAttribute('aria-orientation', 'vertical');
    list.setAttribute('role', 'presentation');      // cards become tab panels, not list items
    tabs.forEach((t, n) => {
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', cards[n].id);
      cards[n].setAttribute('role', 'tabpanel');
      cards[n].setAttribute('aria-labelledby', t.id);
    });
    gsap.set(cards, { opacity: 0 });
    gsap.set(cards[active], { opacity: 1 });
    select(active, { animate: false });
  };
  const disableTabs = () => {
    root.classList.remove('is-tabbed');
    ['role', 'aria-label', 'aria-orientation'].forEach((a) => tablist.removeAttribute(a));
    list.setAttribute('role', 'list');
    tabs.forEach((t) => { ['role', 'aria-controls', 'aria-selected'].forEach((a) => t.removeAttribute(a)); t.removeAttribute('tabindex'); });
    cards.forEach((c) => { ['aria-labelledby', 'aria-hidden'].forEach((a) => c.removeAttribute(a)); c.setAttribute('role', 'listitem'); c.inert = false; });
    gsap.set(cards, { clearProps: 'opacity' });
  };

  /* ---------- Mobile: counter follows the snapped card ---------- */
  const io = new IntersectionObserver((entries) => {
    if (mq.matches) return;
    entries.forEach((e) => { if (e.isIntersecting) current.textContent = pad(cards.indexOf(e.target)); });
  }, { root: list, threshold: 0.6 });
  cards.forEach((c) => io.observe(c));

  const apply = () => (mq.matches ? enableTabs() : disableTabs());
  mq.addEventListener('change', apply);
  apply();
}
