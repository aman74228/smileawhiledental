// Hero entrance: one timeline, plays once on load.
//   media   clip-path inset → 0 + image scale 1.06 → 1
//   title   line-by-line masked slide-up (SplitText)
//   support eyebrow, subline, CTAs, trust row, chip fade up
// Reduced motion: opacity fades only, no split, no clip, no scale.
import { gsap, SplitText, EASE, DUR, STAGGER, REVEAL_Y, isReduced } from '../../js/motion.js';

const imageReady = (img) => {
  if (!img) return Promise.resolve();
  const decoded = img.complete ? img.decode?.().catch(() => {}) : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); });
  // Never hold the page hostage for a slow image.
  return Promise.race([decoded, new Promise((r) => setTimeout(r, 700))]);
};

export async function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const title = hero.querySelector('[data-hero-title]');
  const frame = hero.querySelector('[data-hero-frame]');
  const img = frame?.querySelector('img');
  const [eyebrow, subline, ctas, trust, chip] = ['.hero__eyebrow', '.hero__subline', '.hero__ctas', '.hero__trust', '.hero__chip'].map((s) => hero.querySelector(s));

  if (isReduced()) {
    gsap.set(title, { visibility: 'visible' });
    gsap.fromTo([eyebrow, title, subline, ctas, trust, frame, chip], { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.06 });
    return;
  }

  await Promise.all([document.fonts.ready, imageReady(img)]);

  const radius = getComputedStyle(frame).borderRadius;
  const tl = gsap.timeline({ defaults: { ease: EASE } });

  tl.set(frame, { opacity: 1 }, 0);
  tl.fromTo(frame,
    { clipPath: `inset(7% 7% 7% 7% round ${radius})` },
    { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: DUR.slower, clearProps: 'clipPath' }, 0);
  tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: DUR.slower + 0.3, ease: 'power3.out', clearProps: 'transform' }, 0);

  tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.slow, clearProps: 'transform' }, 0.05);

  gsap.set(title, { visibility: 'visible' });
  SplitText.create(title, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'line',
    autoSplit: true,               // re-splits on resize / font load
    onSplit(self) {
      // Returning the tween lets SplitText carry its progress over to the
      // new lines if a re-split happens mid-animation (no stacking).
      return gsap.from(self.lines, { yPercent: 110, duration: DUR.slower, stagger: STAGGER, ease: EASE, delay: 0.1 });
    },
  });

  tl.fromTo([subline, ctas, trust], { opacity: 0, y: REVEAL_Y }, { opacity: 1, y: 0, duration: DUR.slow, stagger: STAGGER, clearProps: 'transform' }, 0.42);
  tl.fromTo(chip, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: DUR.slow, clearProps: 'transform' }, 0.7);
}
