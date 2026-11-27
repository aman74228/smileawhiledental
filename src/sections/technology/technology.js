// Advanced technology (signature 1). Desktop only, motion allowed:
//   • the item crossing the viewport centre becomes .is-active (counter follows)
//   • the progress bar scrubs from the first item to the last
// The intro "pin" is CSS position: sticky, so there's no pin-spacer and no scroll-jacking.
import { gsap, ScrollTrigger, isReduced } from '../../js/motion.js';

export function initTechnology() {
  const root = document.querySelector('[data-tech]');
  if (!root) return;
  const items = [...root.querySelectorAll('[data-tech-item]')];
  const current = root.querySelector('[data-tech-current]');
  const bar = root.querySelector('[data-tech-bar]');
  root.querySelector('[data-tech-total]').textContent = String(items.length).padStart(2, '0');

  const glow = root.querySelector('[data-tech-glow]');
  const list = root.querySelector('.tech__list');
  const setActive = (i) => {
    items.forEach((el, n) => el.classList.toggle('is-active', n === i));
    current.textContent = String(i + 1).padStart(2, '0');
    // Glow glides to the active item's centre (transform only).
    const el = items[i];
    const y = el.offsetTop + el.offsetHeight / 2;
    gsap.to(glow, { y, duration: isReduced() ? 0 : 0.7, ease: 'power3.out', overwrite: true });
  };

  // Mobile toggle: first 4 items, then "Show all technology".
  const toggle = root.querySelector('[data-tech-toggle]');
  const label = root.querySelector('[data-tech-toggle-label]');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('is-expanded', open);
    label.textContent = open ? 'Show fewer' : 'Show all technology';
    if (open) {
      const extra = list.querySelectorAll('.tech-item--extra');
      gsap.fromTo(extra, { opacity: 0, y: isReduced() ? 0 : 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' });
      extra[0]?.querySelector('.tech-item__title')?.setAttribute('tabindex', '-1');
      extra[0]?.querySelector('.tech-item__title')?.focus({ preventScroll: true });
    }
    ScrollTrigger.refresh();
  });

  gsap.matchMedia().add('(min-width: 64rem)', () => {
    root.classList.add('is-tracking');
    setActive(0);
    const triggers = items.map((el, i) => ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setActive(i); },
    }));
    const barTween = gsap.fromTo(bar, { scaleX: 1 / items.length }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.tech__list'), start: 'top 55%', end: 'bottom 55%', scrub: isReduced() ? false : 0.4 },
    });
    return () => {
      triggers.forEach((t) => t.kill()); barTween.scrollTrigger?.kill(); barTween.kill();
      root.classList.remove('is-tracking');
      items.forEach((el) => el.classList.remove('is-active'));
    };
  });
}
