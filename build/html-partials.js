// Tiny build-time templating for static HTML pages + partials.
// Deliberately minimal so each construct has a 1:1 WordPress equivalent:
//
//   <!-- @page key=service service=dental-implants --> page context (title, nav state, data) → WP template + query
//   <!-- @include src/sections/hero/hero.html -->     → get_template_part()
//   {{site.phone.display}}                             → theme option / ACF field (HTML-escaped)
//   {{@json service.faqSchema}}                        → wp_json_encode() inside <script type="application/ld+json">
//   {{#each site.services as svc}}…{{/each}}           → foreach in PHP   ({{@n}} = 01, 02…; {{@index}} = 0, 1…)
//   {{#if x}}…{{/if}} / {{#unless x}}…{{/unless}}      → if / if ( ! … ) in PHP
//   <!-- @picture name ratio sizes="…" [eager] [class="…"] [alt="…"] [art="ratio|media|sizes"]
//                 [slot="gi-icon|What photo is needed"] -->
//                                                      → wp_get_attachment_image() with srcset
//     If the image isn't in the manifest yet and `slot` is given, a branded "photo slot"
//     (mesh + glass icon) is rendered instead, tagged data-dummy="true".
//
// Production guard: `vite build` (mode "production") FAILS if any page still contains
// data-dummy="true", a review-only element or a "[BRACKETED]" placeholder, or if any
// src/data/*.json entry has "dummy": true. `vite build --mode preview` allows them.
import fs from 'node:fs';
import path from 'node:path';

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const get = (ctx, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);

const BLOCKS = ['each', 'if', 'unless'];

function findBlockEnd(tpl, from, kind) {
  const re = new RegExp(`\\{\\{#${kind} [^}]+\\}\\}|\\{\\{/${kind}\\}\\}`, 'g');
  re.lastIndex = from;
  let depth = 1; let m;
  while ((m = re.exec(tpl))) {
    depth += m[0].startsWith('{{#') ? 1 : -1;
    if (depth === 0) return { start: m.index, end: m.index + m[0].length };
  }
  throw new Error(`Unclosed {{#${kind}}} block`);
}

const truthy = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));

export function render(tpl, ctx) {
  let out = ''; let i = 0;
  const blockRe = new RegExp(`\\{\\{#(${BLOCKS.join('|')}) ([\\w.@-]+)(?: as (\\w+))?\\}\\}`, 'g');
  let m;
  while ((m = blockRe.exec(tpl))) {
    out += tpl.slice(i, m.index);
    const [, kind, expr, alias] = m;
    const bodyStart = m.index + m[0].length;
    const { start, end } = findBlockEnd(tpl, bodyStart, kind);
    const body = tpl.slice(bodyStart, start);
    const val = get(ctx, expr);
    if (kind === 'each') {
      (Array.isArray(val) ? val : []).forEach((item, index, arr) => {
        out += render(body, { ...ctx, [alias || 'this']: item, '@index': index, '@n': String(index + 1).padStart(2, '0'), '@first': index === 0, '@last': index === arr.length - 1 });
      });
    } else if (kind === 'if' ? truthy(val) : !truthy(val)) {
      out += render(body, ctx);
    }
    i = end; blockRe.lastIndex = end;
  }
  out += tpl.slice(i);
  return out
    .replace(/\{\{@json ([\w.@-]+)\}\}/g, (_, p) => JSON.stringify(get(ctx, p) ?? null).replace(/</g, '\\u003c'))
    .replace(/\{\{([\w.@-]+)\}\}/g, (_, p) => {
      const v = get(ctx, p);
      if (v === undefined) throw new Error(`Template value not found: {{${p}}}`);
      return esc(v);
    });
}

/* ---------------- @picture ---------------- */
function photoSlot(args, attr) {
  const [icon = 'gi-general', need = 'Photo needed'] = (attr('slot') || '').split('|');
  const ratio = args.trim().split(/\s+/)[1] || '4x3';
  const [rw, rh] = ratio.split('x').map(Number);
  return `<div class="photo-slot${attr('class') ? ` ${attr('class')}` : ''}" style="--slot-ratio:${rw} / ${rh}" role="img" aria-label="${esc(attr('alt') || need)}" data-dummy="true" data-note="Stock photo slot: ${esc(need)}">
  <span class="photo-slot__tile glass-tile" aria-hidden="true"><svg><use href="#${esc(icon)}"/></svg></span>
</div>`;
}

function picture(args, images) {
  const [name, ratio] = args.trim().split(/\s+/);
  const attr = (k) => (args.match(new RegExp(`${k}="([^"]*)"`)) || [])[1];
  const img = images[name];
  const crop = img?.crops?.[ratio];
  if (!crop) {
    if (attr('slot')) return photoSlot(args, attr);
    throw new Error(img ? `@picture: "${name}" has no ${ratio} crop` : `@picture: unknown image "${name}" (add slot="icon|need" to allow a placeholder)`);
  }
  const eager = /\beager\b/.test(args);
  const base = attr('base') || img.dir || '/images/holland/';
  const set = (c, fmt) => c.files.map((f) => `${base}${f[fmt]} ${f.w}w`).join(', ');
  const largest = crop.files.at(-1);
  const sizes = attr('sizes') || '100vw';
  let artSources = '';
  const art = attr('art');
  if (art) {
    const [artRatio, media, artSizes = sizes] = art.split('|');
    const ac = img.crops[artRatio]; if (!ac) throw new Error(`@picture: "${name}" has no ${artRatio} crop`);
    artSources = `
  <source type="image/avif" media="${media}" srcset="${set(ac, 'avif')}" sizes="${artSizes}">
  <source type="image/webp" media="${media}" srcset="${set(ac, 'webp')}" sizes="${artSizes}">`;
  }
  const dummy = img.dummy ? ` data-dummy="true" data-note="${esc(img.note || 'Dummy stock photo: replace with practice photography')}"` : '';
  return `<picture${dummy}>${artSources}
  <source type="image/avif" srcset="${set(crop, 'avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set(crop, 'webp')}" sizes="${sizes}">
  <img src="${base}${largest.webp}" width="${largest.w}" height="${largest.h}" alt="${esc(attr('alt') ?? img.alt)}"${attr('class') ? ` class="${attr('class')}"` : ''} ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
</picture>`;
}

/* ---------------- page context ---------------- */
function pageContext(html, data, file) {
  const m = html.match(/<!--\s*@page\s+([^>]*?)-->/);
  const params = Object.fromEntries([...(m?.[1] || 'key=home').matchAll(/(\w+)=([\w-]+)/g)].map((x) => [x[1], x[2]]));
  const pages = data.pages || {};
  const page = { key: params.key, ...(pages[params.key] || {}) };
  const ctx = { ...data, page };
  if (params.service) {
    const svc = data.services?.categories?.find((s) => s.slug === params.service);
    if (!svc) throw new Error(`${file}: unknown service "${params.service}"`);
    ctx.service = svc;
    ctx.serviceTech = (svc.tech || []).map((icon) => data.site.technology.find((t) => t.icon === icon)).filter(Boolean);
    page.title = `${svc.name} in Holland, PA | ${data.site.name}`;
    page.description = svc.metaDescription || svc.summary;
    page.path = `/services/${svc.slug}/`;
  }
  page.title = (page.title || data.site.name).replace('{name}', data.site.name);
  // Book links stay on-page where the form exists, else go to the contact page's form
  ctx.bookHref = page.hasForm ? '#appointment' : '/contact/#appointment';
  ctx.year = new Date().getFullYear();
  // nav state for the header
  ctx.nav = data.site.nav.map((n) => ({ ...n, current: n.section === (page.section || params.key) }));
  return ctx;
}

/* ---------------- production guard ---------------- */
function findLeftovers(html) {
  const issues = [];
  const strip = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/g, '');
  const dummy = [...strip.matchAll(/<(\w+)[^>]*\bdata-dummy="true"[^>]*>/g)];
  dummy.forEach((d) => {
    const note = (d[0].match(/data-note="([^"]*)"/) || [])[1];
    issues.push(`dummy  <${d[1]}>${note ? ` — ${note}` : ''}`);
  });
  [...strip.matchAll(/<(\w+)[^>]*class="[^"]*\breview-only\b[^"]*"[^>]*>/g)].forEach((r) => issues.push(`review-only <${r[1]}>`));
  const text = strip.replace(/<[^>]+>/g, ' ');
  [...text.matchAll(/\[[A-Z][A-Z0-9 &/.,'’-]{2,}\]/g)].forEach((p) => issues.push(`placeholder ${p[0]}`));
  return issues;
}

export default function htmlPartials({ root, data }) {
  const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
  const expand = (html, depth = 0) => {
    if (depth > 12) throw new Error('@include nested too deeply');
    return html.replace(/<!--\s*@include\s+([^\s]+)\s*-->/g, (_, file) => expand(fs.readFileSync(path.join(root, file), 'utf8'), depth + 1));
  };
  let mode = 'development';
  let command = 'serve';
  const report = new Map();

  return {
    name: 'html-partials',
    configResolved(cfg) { mode = cfg.mode; command = cfg.command; },
    handleHotUpdate({ file, server }) {
      if (/\.(html|json|svg)$/.test(file)) server.ws.send({ type: 'full-reload' });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, { filename }) {
        const loaded = Object.fromEntries(Object.entries(data).map(([k, f]) => [k, readJSON(f)]));
        const rel = path.relative(root, filename);
        const ctx = pageContext(html, loaded, rel);
        const rendered = render(expand(html), ctx)
          .replace(/<!--\s*@page[^>]*?-->\s*/g, '')
          .replace(/<!--\s*@picture\s+([\s\S]*?)-->/g, (_, a) => picture(a, ctx.images));
        if (command === 'build') report.set(rel, findLeftovers(rendered));
        return rendered;
      },
    },
    closeBundle() {
      if (command !== 'build') return;
      // data files
      const dataIssues = [];
      for (const f of fs.readdirSync(path.join(root, 'src/data')).filter((x) => x.endsWith('.json'))) {
        const n = (fs.readFileSync(path.join(root, 'src/data', f), 'utf8').match(/"dummy":\s*true/g) || []).length;
        if (n) dataIssues.push(`${n} × "dummy": true`);
        if (n) report.set(`src/data/${f}`, [`${n} entries marked "dummy": true`]);
      }
      const total = [...report.values()].reduce((a, v) => a + v.length, 0);
      if (!total) { console.log('\n✓ content guard: no dummy content, placeholders or review-only elements'); return; }
      const lines = [];
      for (const [page, issues] of report) {
        if (!issues.length) continue;
        const counts = issues.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
        lines.push(`\n  ${page}  (${issues.length})`);
        for (const [msg, n] of counts) lines.push(`    ${n > 1 ? `${n} × ` : ''}${msg}`);
      }
      const summary = `content guard: ${total} item(s) still dummy / placeholder / review-only${lines.join('\n')}`;
      if (mode === 'production') {
        throw new Error(`\n✗ PRODUCTION BUILD BLOCKED: ${summary}\n\n  Replace them (see docs/content-gaps.md) or build a preview with: npm run build:preview\n`);
      }
      console.log(`\n⚠ ${summary}\n  (allowed in "${mode}" mode)`);
    },
  };
}
