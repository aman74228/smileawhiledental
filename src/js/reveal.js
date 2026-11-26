// Section reveals for everything below the hero.
//   [data-reveal]        fade up 24px, once, staggered per batch
//   [data-reveal-media]  clip-path inset → 0 + inner image scale 1.06 → 1, once
//   [data-parallax]      image drifts inside its frame (desktop, fine pointer, motion on)
// Reduced motion: opacity only; no clip, scale or parallax.
import { gsap, ScrollTrigger, EASE, DUR, STAGGER, REVEAL_Y, isReduced } from './motion.js';

const outsideHero = (el) => !el.closest('[data-hero]');

export function initReveals(root = document) {
  const reduced = isReduced();

  // 1 · Text / UI fade-ups, batched so siblings entering together stagger.
  const items = [...root.querySelectorAll('[data-reveal]')].filter(outsideHero);
  gsap.set(items, { opacity: 0, y: reduced ? 0 : REVEAL_Y });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0,
      duration: reduced ? 0.5 : DUR.slow,
      ease: reduced ? 'power1.out' : EASE,
      stagger: reduced ? 0 : STAGGER,
      clearProps: 'transform',
    }),
  });

  // 2 · Media frames: soft clip reveal + settle.
  [...root.querySelectorAll('[data-reveal-media]')].filter(outsideHero).forEach((frame) => {
    const img = frame.querySelector('img');
    if (reduced) {
      gsap.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out', scrollTrigger: { trigger: frame, start: 'top 90%', once: true } });
      return;
    }
    const radius = getComputedStyle(frame).borderRadius;
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
    tl.fromTo(frame, { clipPath: `inset(8% 6% 0% 6% round ${radius})`, opacity: 0.001 },
      { clipPath: `inset(0% 0% 0% 0% round ${radius})`, opacity: 1, duration: DUR.slower, ease: EASE, clearProps: 'clipPath' });
    if (img && !img.closest('[data-parallax]')) {
      tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: DUR.slower + 0.3, ease: 'power3.out', clearProps: 'transform' }, 0);
    }
  });

  // 3 · Parallax (desktop only). The image is oversized by 12% so it never shows an edge.
  if (reduced) return;
  gsap.matchMedia().add('(min-width: 64rem) and (hover: hover)', () => {
    [...root.querySelectorAll('[data-parallax]')].forEach((frame) => {
      const img = frame.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}
