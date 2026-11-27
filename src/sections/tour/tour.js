// Tour the office (signature 2): the connector line scrubs as you scroll through the
// steps; each step's number lights up when the line reaches it. Reduced motion: static.
import { gsap, ScrollTrigger, isReduced } from '../../js/motion.js';

export function initTour() {
  const root = document.querySelector('[data-tour]');
  if (!root || isReduced()) return;
  const line = root.querySelector('[data-tour-line]');
  const steps = [...root.querySelectorAll('[data-tour-step]')];
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 64rem)', mobile: '(max-width: 63.99rem)' }, (c) => {
    const prop = c.conditions.desktop ? 'scaleX' : 'scaleY';
    const tween = gsap.fromTo(line, { [prop]: 0 }, {
      [prop]: 1, ease: 'none',
      scrollTrigger: {
        trigger: root.querySelector('.tour__steps'),
        start: c.conditions.desktop ? 'top 70%' : 'top 60%',
        end: c.conditions.desktop ? 'top 25%' : 'bottom 60%',
        scrub: 0.4,
        // The line runs from the first number to the last, so step i sits at i / (n - 1).
        onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle('is-lit', self.progress >= i / (steps.length - 1) - 0.02)),
      },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); steps.forEach((s) => s.classList.remove('is-lit')); };
  });
}
