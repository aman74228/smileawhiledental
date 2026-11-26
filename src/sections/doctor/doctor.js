// Meet the doctor: credential ticks draw in one by one when the list enters
// (shows the credentials as a sequence). Reduced motion: ticks shown as-is.
import { gsap, ScrollTrigger, isReduced } from '../../js/motion.js';

export function initDoctor() {
  const root = document.querySelector('[data-doctor]');
  if (!root || isReduced()) return;
  const ticks = root.querySelectorAll('.doctor__tick path');
  ticks.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
  ScrollTrigger.create({
    trigger: root.querySelector('.doctor__creds'),
    start: 'top 85%',
    once: true,
    onEnter: () => gsap.to(ticks, { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.25 }),
  });
}
