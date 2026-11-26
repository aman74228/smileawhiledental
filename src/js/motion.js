// Motion system — one place for easing, durations, smooth scroll and
// reduced-motion handling. Every section imports from here.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const EASE = 'expo.out';            // house curve ≈ cubic-bezier(0.16, 1, 0.3, 1)
export const DUR = { fast: 0.2, base: 0.4, slow: 0.7, slower: 0.9 };
export const STAGGER = 0.08;
export const REVEAL_Y = 24;

const mq = (q) => window.matchMedia(q);
export const reducedMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(hover: hover) and (pointer: fine)');
export const isReduced = () => reducedMotion.matches;

gsap.defaults({ ease: EASE, duration: DUR.slow });

let lenis = null;
export const getLenis = () => lenis;

/** Smooth scroll on mouse/trackpad only. Touch keeps native momentum. */
export function initSmoothScroll() {
  if (isReduced() || !finePointer.matches) return null;
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: { offset: -headerOffset() },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');
  return lenis;
}

export function headerOffset() {
  return document.querySelector('[data-header]')?.offsetHeight ?? 80;
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -headerOffset() });
  else el.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'start' });
}

export function lockScroll(lock) {
  if (lenis) (lock ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}

/** Fade-up used for every [data-reveal] element; opacity-only when reduced. */
export function revealFrom(targets, vars = {}) {
  const reduced = isReduced();
  return gsap.fromTo(
    targets,
    { opacity: 0, y: reduced ? 0 : (vars.y ?? REVEAL_Y) },
    { opacity: 1, y: 0, duration: reduced ? 0.5 : (vars.duration ?? DUR.slow), ease: reduced ? 'power1.out' : EASE, stagger: vars.stagger ?? STAGGER, delay: vars.delay ?? 0, clearProps: 'transform' },
  );
}

export { gsap, ScrollTrigger, SplitText };
