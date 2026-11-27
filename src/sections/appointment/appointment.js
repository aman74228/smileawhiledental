// Appointment form: validation on blur then live, error summary on submit,
// loading → success / error states. Endpoint from data-endpoint; empty = demo mode.
// Payload is FormData (works with Gravity Forms REST or a serverless handler).
const MESSAGES = {
  full_name: 'Please enter your full name.',
  phone: 'Please enter a phone number we can call (10 digits).',
  email: 'Please enter a valid email address, like name@example.com.',
  patient_type: 'Please choose new or existing patient.',
  reason: 'Please choose a reason for your visit.',
};

function validate(field) {
  const wrap = field.closest('[data-field]');
  const msg = wrap?.querySelector('[data-msg]');
  let ok = true;
  if (field.type === 'radio') {
    ok = !!wrap.querySelector('input:checked');
  } else if (field.required && !field.value.trim()) {
    ok = false;
  } else if (field.dataset.validate === 'phone') {
    ok = field.value.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length === 10;
  } else if (field.type === 'email') {
    ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
  }
  wrap.classList.toggle('is-invalid', !ok);
  wrap.classList.toggle('is-valid', ok && field.type !== 'radio' && !!field.value);
  const inputs = field.type === 'radio' ? wrap.querySelectorAll('input') : [field];
  inputs.forEach((i) => i.setAttribute('aria-invalid', String(!ok)));
  if (msg) msg.textContent = ok ? '' : MESSAGES[field.name] || 'Please check this field.';
  return ok;
}

export function initAppointmentForms() {
  document.querySelectorAll('[data-appt-form]').forEach((form) => {
    const panel = form.parentElement;
    const success = panel.querySelector('[data-form-success]');
    const errorBox = form.querySelector('[data-form-error]');
    const summary = form.querySelector('[data-form-summary]');
    const summaryList = form.querySelector('[data-form-summary-list]');
    const required = () => [...form.querySelectorAll('input[required], select[required]')];
    const touched = new WeakSet();

    form.addEventListener('focusout', (e) => {
      const f = e.target;
      if (!f.name || !(f.required || f.type === 'radio')) return;
      if (f.type === 'radio') { const g = f.closest('[data-field]'); if (g.contains(e.relatedTarget)) return; }
      touched.add(f.type === 'radio' ? f.closest('[data-field]') : f);
      validate(f);
    });
    form.addEventListener('input', (e) => {
      const f = e.target;
      const key = f.type === 'radio' ? f.closest('[data-field]') : f;
      if (touched.has(key)) validate(f);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.hidden = true;
      const firstOfGroup = required().filter((f, i, arr) => f.type !== 'radio' || arr.findIndex((x) => x.name === f.name) === i);
      const invalid = firstOfGroup.filter((f) => !validate(f));
      if (invalid.length) {
        summaryList.innerHTML = '';
        invalid.forEach((f) => {
          const li = document.createElement('li'); const a = document.createElement('a');
          a.href = `#${f.id || f.closest('[data-field]').querySelector('input').id || ''}`;
          a.textContent = MESSAGES[f.name];
          a.addEventListener('click', (ev) => { ev.preventDefault(); f.focus(); });
          li.append(a); summaryList.append(li);
        });
        summary.hidden = false; summary.focus();
        return;
      }
      summary.hidden = true;
      if (form.website.value) return; // honeypot

      form.classList.add('is-sending');
      form.querySelector('[data-submit-label]').textContent = 'Sending…';
      try {
        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } else {
          await new Promise((r) => setTimeout(r, 900)); // demo mode: no endpoint configured
        }
        const name = form.full_name.value.trim().split(/\s+/)[0];
        success.querySelector('[data-success-title]').textContent = `Thank you, ${name}. We've got your request.`;
        form.hidden = true; success.hidden = false;
        success.querySelector('[data-success-title]').focus();
      } catch {
        errorBox.hidden = false;
      } finally {
        form.classList.remove('is-sending');
        form.querySelector('[data-submit-label]').textContent = 'Request appointment';
      }
    });

    panel.querySelector('[data-form-reset]')?.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('[data-field]').forEach((w) => w.classList.remove('is-invalid', 'is-valid'));
      success.hidden = true; form.hidden = false;
      form.querySelector('input').focus();
    });
  });
}
