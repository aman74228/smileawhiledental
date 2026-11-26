// Tiny build-time templating for static HTML partials.
// Deliberately minimal so each construct has a 1:1 WordPress equivalent:
//
//   <!-- @include src/sections/hero/hero.html -->   → get_template_part()
//   {{site.phone.display}}                           → theme option / ACF field (HTML-escaped)
//   {{#each site.services as svc}}…{{/each}}         → foreach in PHP
//   {{#if svc.items.length}}…{{/if}}                 → if in PHP
//   <!-- @picture name ratio sizes="…" [eager] [class="…"] [alt="…"] -->
//                                                    → wp_get_attachment_image() with srcset
import fs from 'node:fs';
import path from 'node:path';

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const get = (ctx, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);

function findBlockEnd(tpl, from, open, close) {
  let depth = 1; const re = new RegExp(`${open}|${close}`, 'g'); re.lastIndex = from;
  let m;
  while ((m = re.exec(tpl))) {
    depth += m[0].startsWith('{{#') ? 1 : -1;
    if (depth === 0) return { start: m.index, end: m.index + m[0].length };
  }
  throw new Error(`Unclosed block (${open})`);
}

export function render(tpl, ctx) {
  let out = ''; let i = 0;
  const blockRe = /\{\{#(each|if) ([\w.@]+)(?: as (\w+))?\}\}/g;
  let m;
  while ((m = blockRe.exec(tpl))) {
    out += tpl.slice(i, m.index);
    const [, kind, expr, alias] = m;
    const bodyStart = m.index + m[0].length;
    const endTag = kind === 'each' ? '\\{\\{/each\\}\\}' : '\\{\\{/if\\}\\}';
    const openTag = kind === 'each' ? '\\{\\{#each [^}]+\\}\\}' : '\\{\\{#if [^}]+\\}\\}';
    const { start, end } = findBlockEnd(tpl, bodyStart, openTag, endTag);
    const body = tpl.slice(bodyStart, start);
    const val = get(ctx, expr);
    if (kind === 'each') {
      (Array.isArray(val) ? val : []).forEach((item, index) => {
        out += render(body, { ...ctx, [alias || 'this']: item, '@index': index, '@n': String(index + 1).padStart(2, '0') });
      });
    } else if (val && (!Array.isArray(val) || val.length)) {
      out += render(body, ctx);
    }
    i = end; blockRe.lastIndex = end;
  }
  out += tpl.slice(i);
  return out.replace(/\{\{([\w.@]+)\}\}/g, (_, p) => {
    const v = get(ctx, p);
    if (v === undefined) throw new Error(`Template value not found: {{${p}}}`);
    return esc(v);
  });
}

function picture(args, images) {
  const [name, ratio] = args.trim().split(/\s+/);
  const attr = (k) => (args.match(new RegExp(`${k}="([^"]*)"`)) || [])[1];
  const img = images[name]; if (!img) throw new Error(`@picture: unknown image "${name}"`);
  const crop = img.crops[ratio]; if (!crop) throw new Error(`@picture: "${name}" has no ${ratio} crop`);
  const eager = /\beager\b/.test(args);
  const base = attr('base') || '/images/holland/';
  const set = (fmt) => crop.files.map((f) => `${base}${f[fmt]} ${f.w}w`).join(', ');
  const largest = crop.files.at(-1);
  const sizes = attr('sizes') || '100vw';
  // Art direction: art="3x2|(min-width: 768px) and (max-width: 1023.98px)|80vw"
  let artSources = '';
  const art = attr('art');
  if (art) {
    const [artRatio, media, artSizes = sizes] = art.split('|');
    const ac = img.crops[artRatio]; if (!ac) throw new Error(`@picture: "${name}" has no ${artRatio} crop`);
    const aset = (fmt) => ac.files.map((f) => `${base}${f[fmt]} ${f.w}w`).join(', ');
    artSources = `
  <source type="image/avif" media="${media}" srcset="${aset('avif')}" sizes="${artSizes}">
  <source type="image/webp" media="${media}" srcset="${aset('webp')}" sizes="${artSizes}">`;
  }
  return `<picture>${artSources}
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
  <img src="${base}${largest.webp}" width="${largest.w}" height="${largest.h}" alt="${esc(attr('alt') ?? img.alt)}"${attr('class') ? ` class="${attr('class')}"` : ''} ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
</picture>`;
}

export default function htmlPartials({ root, data }) {
  const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
  const expand = (html, depth = 0) => {
    if (depth > 10) throw new Error('@include nested too deeply');
    return html.replace(/<!--\s*@include\s+([^\s]+)\s*-->/g, (_, file) => {
      const full = path.join(root, file);
      return expand(fs.readFileSync(full, 'utf8'), depth + 1);
    });
  };
  return {
    name: 'html-partials',
    handleHotUpdate({ file, server }) {
      if (/\.(html|json|svg)$/.test(file)) server.ws.send({ type: 'full-reload' });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const ctx = Object.fromEntries(Object.entries(data).map(([k, f]) => [k, readJSON(f)]));
        const expanded = expand(html);
        const withPictures = expanded.replace(/<!--\s*@picture\s+([\s\S]*?)-->/g, (_, a) => picture(a, ctx.images));
        return render(withPictures, ctx);
      },
    },
  };
}
