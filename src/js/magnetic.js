// Subtle magnetic pull for primary CTAs (fine pointers only, max 6px).
import { gsap, finePointer, isReduced } from './motion.js';

const MAX = 6;

export function initMagnetic(root = document) {
  if (!finePointer.matches || isReduced()) return;
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(gsap.utils.clamp(-1, 1, dx) * MAX);
      yTo(gsap.utils.clamp(-1, 1, dy) * MAX * 0.6);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
