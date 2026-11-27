// Inner-page widgets: page-hero entrance, accordions, review filters, gallery.
import { gsap, SplitText, EASE, DUR, STAGGER, isReduced } from './motion.js';

function pageHero() {
  const title = document.querySelector('.page-hero [data-hero-title]');
  if (!title) return;
  gsap.set(title, { visibility: 'visible' });
  if (isReduced()) { gsap.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.5 }); return; }
  document.fonts.ready.then(() => SplitText.create(title, {
    type: 'lines', mask: 'lines', linesClass: 'line', autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: DUR.slower, stagger: STAGGER, ease: EASE, delay: 0.05 }),
  }));
}

// Accordions: <button aria-expanded aria-controls> + region. Height animates via grid-rows (no layout thrash on transform-less content).
function accordions() {
  document.querySelectorAll('[data-accordion-item]').forEach((item) => {
    const btn = item.querySelector('[data-accordion-btn]');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = false;
      void panel.offsetHeight;          // reflow so the grid-rows transition runs from 0fr
      item.classList.toggle('is-open', open);
      if (!open) setTimeout(() => { if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true; }, isReduced() ? 0 : 400);
    });
  });
}

// Review filters (Testimonials page): chips filter cards by category; result count announced.
function reviewFilters() {
  const root = document.querySelector('[data-review-filter]');
  if (!root) return;
  const chips = [...root.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-review-list] [data-category]')];
  const status = document.querySelector('[data-filter-status]');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    cards.forEach((c) => {
      const show = f === 'all' || c.dataset.category === f;
      c.closest('[data-review-cell]').hidden = !show;
      if (show) n++;
    });
    const shown = cards.filter((c) => !c.closest('[data-review-cell]').hidden).map((c) => c.closest('[data-review-cell]'));
    if (!isReduced()) gsap.fromTo(shown, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: EASE, clearProps: 'transform' });
    status.textContent = `Showing ${n} ${n === 1 ? 'review' : 'reviews'}${f === 'all' ? '' : ` for ${f}`}.`;
  }));
}

export function initPageWidgets() {
  pageHero();
  accordions();
  reviewFilters();
  initScrollSpy();
}

// Service pages: highlight the in-page nav link for the section in view.
export function initScrollSpy() {
  const links = [...document.querySelectorAll('[data-spy-link]')];
  if (!links.length) return;
  const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
      const l = byId.get(e.target.id);
      if (l) { l.classList.add('is-active'); l.setAttribute('aria-current', 'location'); }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('[data-spy-target]').forEach((t) => io.observe(t));
}
