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

  const setActive = (i) => {
    items.forEach((el, n) => el.classList.toggle('is-active', n === i));
    current.textContent = String(i + 1).padStart(2, '0');
  };

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
