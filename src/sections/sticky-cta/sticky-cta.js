// Sticky Call / Book bar (mobile + tablet).
// visible = scrolled past the hero AND no [data-hide-sticky] region in view AND menu closed
import { ScrollTrigger } from '../../js/motion.js';

export function initStickyCta() {
  const bar = document.querySelector('[data-sticky-cta]');
  if (!bar) return;
  const mq = window.matchMedia('(max-width: 63.99rem)');
  const hero = document.querySelector('[data-hero]');
  const state = { pastHero: !hero, hideZones: new Set(), menuOpen: false };

  const update = () => {
    const show = mq.matches && state.pastHero && state.hideZones.size === 0 && !state.menuOpen;
    bar.classList.toggle('is-visible', show);
    bar.inert = !show;            // keep hidden buttons out of the tab order
  };

  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',        // the hero's own CTAs are gone from view
      onEnter: () => { state.pastHero = true; update(); },
      onLeaveBack: () => { state.pastHero = false; update(); },
    });
  }

  // Appointment form + footer: any part on screen hides the bar.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? state.hideZones.add(e.target) : state.hideZones.delete(e.target)));
    update();
  }, { threshold: 0 });
  document.querySelectorAll('[data-hide-sticky]').forEach((el) => io.observe(el));

  document.addEventListener('menu:toggle', (e) => { state.menuOpen = e.detail.open; update(); });
  mq.addEventListener('change', update);
  update();
}
