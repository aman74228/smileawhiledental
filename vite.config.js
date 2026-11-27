import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import htmlPartials from './build/html-partials.js';

const root = new URL('.', import.meta.url).pathname;

// Multi-page: every index.html under the page folders (+ 404.html) is an entry.
function pageEntries() {
  const entries = { home: path.join(root, 'index.html') };
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', 'dist', 'src', 'public', 'preview', 'assets', 'build', 'scripts', 'docs', '.git'].includes(f.name)) continue;
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name === 'index.html' && dir !== root) entries[path.relative(root, dir).replace(/\//g, '-')] = p;
    }
  };
  walk(root);
  if (fs.existsSync(path.join(root, '404.html'))) entries.notfound = path.join(root, '404.html');
  return entries;
}

export default defineConfig({
  appType: 'mpa',
  plugins: [
    htmlPartials({
      root,
      data: {
        site: 'src/data/site.json', images: 'src/data/images.json', pages: 'src/data/pages.json',
        services: 'src/data/services.json', reviews: 'src/data/reviews.json', team: 'src/data/team.json',
      },
    }),
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: { input: pageEntries() },
  },
  server: { host: true, port: 5173 },
  preview: { port: 4173 },
});
