// Review mode (?review=1): turn each data-placeholder note into a tooltip and
// add a small badge so reviewers know they're not looking at the client view.
export function initReviewMode() {
  if (!document.documentElement.classList.contains('review-mode')) return;
  document.querySelectorAll('[data-placeholder]').forEach((el) => {
    const note = el.getAttribute('data-placeholder');
    if (note) el.title = note;
  });
  const badge = document.createElement('a');
  badge.className = 'review-badge';
  badge.href = location.pathname + location.hash;
  badge.textContent = 'Review mode · show client view';
  document.body.append(badge);
}
