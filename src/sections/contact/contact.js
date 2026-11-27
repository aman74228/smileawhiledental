// Contact: live open/closed status from the hours data, and the click-to-load map.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const fmt = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

function openStatus(root) {
  const list = root.querySelector('[data-hours]');
  const out = root.querySelector('[data-open-status]');
  if (!list || !out) return;
  let days; try { days = JSON.parse(list.dataset.hours); } catch { return; }
  const byDay = (d) => days.find((x) => x.days.includes(d) && !x.closed);
  // Practice local time (America/New_York), regardless of the visitor's timezone.
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const today = byDay(now.getDay());
  const mins = now.getHours() * 60 + now.getMinutes();
  let text; let open = false;
  if (today && mins >= toMin(today.open) && mins < toMin(today.close)) {
    open = true; text = `Open now · until ${fmt(today.close)}`;
  } else {
    for (let i = 0; i < 8; i++) {
      const d = (now.getDay() + i) % 7; const h = byDay(d);
      if (!h) continue;
      if (i === 0 && mins >= toMin(h.open)) continue;
      text = `Closed now · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]} ${fmt(h.open)}`;
      break;
    }
  }
  out.querySelector('[data-open-status-text]').textContent = text;
  out.classList.toggle('is-open', open);
  out.hidden = false;
}

function mapFacade(root) {
  const facade = root.querySelector('[data-map]');
  const btn = facade?.querySelector('[data-map-load]');
  btn?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = facade.dataset.mapSrc;
    iframe.title = 'Map showing the practice location';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    facade.append(iframe);
    facade.classList.add('is-loaded');
    iframe.focus();
  });
}

export function initContact() {
  document.querySelectorAll('[data-contact]').forEach((root) => { openStatus(root); mapFacade(root); });
}
