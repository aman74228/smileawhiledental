// Review mode (?review=1): turn each dummy element's data-note into a tooltip and
// add a badge so reviewers know they're not looking at the client view.
export function initReviewMode() {
  if (!document.documentElement.classList.contains('review-mode')) return;
  const dummies = document.querySelectorAll('[data-dummy="true"]');
  dummies.forEach((el) => {
    const note = el.getAttribute('data-note');
    el.title = note ? `Dummy: ${note}` : 'Dummy content: replace before launch';
  });
  const badge = document.createElement('a');
  badge.className = 'review-badge';
  badge.href = location.pathname + location.hash;
  badge.textContent = `Review mode · ${dummies.length} dummy items · show client view`;
  document.body.append(badge);
}
