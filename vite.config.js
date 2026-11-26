import { defineConfig } from 'vite';
import htmlPartials from './build/html-partials.js';

const root = new URL('.', import.meta.url).pathname;

export default defineConfig({
  plugins: [
    htmlPartials({
      root,
      data: { site: 'src/data/site.json', images: 'src/data/images.json' },
    }),
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  server: { host: true, port: 5173 },
  preview: { port: 4173 },
});
