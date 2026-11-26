// Header behaviour
//   • transparent over the hero → glass once the hero has scrolled past
//   • hides on scroll down, shows on scroll up (never while a menu is open,
//     or keyboard focus is inside it; disabled for reduced motion)
//   • Services mega-menu: click / Enter, hover-intent on fine pointers, Esc, outside click
//   • Mobile menu: full screen, staggered reveal, focus trap, Esc, scroll lock
import { gsap, ScrollTrigger, EASE, DUR, isReduced, finePointer, lockScroll, scrollToTarget } from '../../js/motion.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const state = { megaOpen: false, menuOpen: false };

  initScrollStates(header, state);
  initMega(header, state);
  initMobileMenu(header, state);
}

/* ---------------- Scroll states ---------------- */
function initScrollStates(header, state) {
  const hero = document.querySelector('[data-hero]');
  const setGlass = (on) => header.classList.toggle('is-glass', on);

  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: () => `bottom top+=${header.offsetHeight + 1}`,
      onEnter: () => setGlass(true),
      onLeaveBack: () => setGlass(false),
      invalidateOnRefresh: true,
    });
  } else {
    setGlass(true);
  }

  const show = () => header.classList.remove('is-hidden');
  header.addEventListener('focusin', () => { if (header.querySelector(':focus-visible')) show(); });
  if (isReduced()) return;

  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      const delta = y - last;
      last = y;
      // Keep it visible for keyboard users tabbing through it, but not just because a
      // tapped/clicked button inside it still holds focus.
      if (state.megaOpen || state.menuOpen || header.querySelector(':focus-visible')) return show();
      if (y < header.offsetHeight * 2) return show();
      if (delta > 6) header.classList.add('is-hidden');
      else if (delta < -6) show();
    },
  });
}

/* ---------------- Mega menu ---------------- */
function initMega(header, state) {
  const trigger = header.querySelector('[data-mega-trigger]');
  const mega = header.querySelector('[data-mega]');
  if (!trigger || !mega) return;
  const item = trigger.closest('.site-nav__item--mega');
  const panel = mega.querySelector('.mega__panel');
  const items = mega.querySelectorAll('[data-mega-item]');
  let closeTimer, openTimer, tween;

  const open = () => {
    clearTimeout(closeTimer);
    if (state.megaOpen) return;
    state.megaOpen = true;
    mega.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    header.classList.add('is-mega-open');
    header.classList.remove('is-hidden');
    tween?.kill();
    const reduced = isReduced();
    tween = gsap.timeline()
      .fromTo(panel, { opacity: 0, y: reduced ? 0 : -8 }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE })
      .fromTo(items, { opacity: 0, y: reduced ? 0 : 8 }, { opacity: 1, y: 0, duration: DUR.base, stagger: 0.035, ease: EASE, clearProps: 'transform' }, 0.05);
  };
  const close = ({ focusTrigger = false } = {}) => {
    clearTimeout(openTimer);
    if (!state.megaOpen) return;
    state.megaOpen = false;
    trigger.setAttribute('aria-expanded', 'false');
    tween?.kill();
    tween = gsap.to(panel, {
      opacity: 0, y: isReduced() ? 0 : -6, duration: DUR.fast, ease: 'power2.in',
      onComplete: () => { mega.hidden = true; header.classList.remove('is-mega-open'); },
    });
    if (focusTrigger) trigger.focus();
  };

  trigger.addEventListener('click', () => (state.megaOpen ? close() : open()));

  if (finePointer.matches) {
    item.addEventListener('pointerenter', () => { clearTimeout(closeTimer); openTimer = setTimeout(open, 90); });
    item.addEventListener('pointerleave', () => { clearTimeout(openTimer); closeTimer = setTimeout(close, 220); });
  }

  item.addEventListener('focusout', (e) => {
    if (!item.contains(e.relatedTarget)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.megaOpen) close({ focusTrigger: true });
  });
  document.addEventListener('pointerdown', (e) => {
    if (state.megaOpen && !item.contains(e.target)) close();
  });
  window.addEventListener('resize', () => { if (window.innerWidth < 1024) close(); });
}

/* ---------------- Mobile menu ---------------- */
function initMobileMenu(header, state) {
  const menu = document.querySelector('[data-menu]');
  const openBtn = header.querySelector('[data-menu-open]');
  if (!menu || !openBtn) return;
  const closeBtns = menu.querySelectorAll('[data-menu-close]');
  const items = menu.querySelectorAll('[data-menu-item]');
  let tween;

  const open = () => {
    if (state.menuOpen) return;
    state.menuOpen = true;
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    tween?.kill();
    const reduced = isReduced();
    tween = gsap.timeline()
      .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: DUR.base * 0.75, ease: 'power2.out' })
      .fromTo(items, { opacity: 0, y: reduced ? 0 : 24 }, { opacity: 1, y: 0, duration: DUR.slow, stagger: 0.06, ease: EASE, clearProps: 'transform' }, 0.08);
    menu.querySelector('[data-menu-close]')?.focus();
  };

  const close = ({ returnFocus = true } = {}) => {
    if (!state.menuOpen) return;
    state.menuOpen = false;
    openBtn.setAttribute('aria-expanded', 'false');
    tween?.kill();
    tween = gsap.to(menu, {
      opacity: 0, duration: DUR.fast, ease: 'power2.in',
      onComplete: () => { menu.hidden = true; lockScroll(false); },
    });
    if (returnFocus) openBtn.focus();
  };

  openBtn.addEventListener('click', open);
  closeBtns.forEach((b) => b.addEventListener('click', () => close()));

  // In-page links (e.g. Book Now → #appointment) close the menu, then scroll.
  menu.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    close({ returnFocus: false });
    setTimeout(() => scrollToTarget(a.getAttribute('href')), 260);
  }));

  // Services accordion
  menu.querySelectorAll('[data-accordion]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      if (!expanded) {
        gsap.fromTo(panel.querySelectorAll('li'), { opacity: 0, y: isReduced() ? 0 : 8 }, { opacity: 1, y: 0, duration: DUR.base, stagger: 0.03, ease: EASE, clearProps: 'transform' });
      }
    });
  });

  // Focus trap + Esc
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = [...menu.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    const first = f[0]; const last = f.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  window.addEventListener('resize', () => { if (state.menuOpen && window.innerWidth >= 1024) close({ returnFocus: false }); });
}
