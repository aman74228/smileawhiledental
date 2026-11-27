# Smileawhile Dental: website

Static, WordPress-portable multi-page site: Vite + HTML partials + modern CSS (custom properties, no framework) + vanilla ES modules, with GSAP (ScrollTrigger, SplitText) and Lenis.

## Status
**Complete with realistic dummy content, ready for client review.** 14 pages: Home, Our Practice, Services hub + 6 service pages, Testimonials, Contact, Privacy, Terms, 404.

- Preview (private claude.ai link, share from its Share menu): https://claude.ai/artifact/WQbpYa75ocDrxGgPH4XF5J
- Every dummy item is tagged `data-dummy="true"` (HTML) or `"dummy": true` (data). Add `?review=1` to any URL to see them outlined.
- **`npm run build` fails until all dummy content is replaced** (production guard). Review builds: `npm run build:preview`.
- Replacement checklist: `docs/content-gaps.md` (generated: `npm run content-report`).

## Commands
```bash
npm install
```
```bash
npm run dev
```
Review build (dummy content allowed):
```bash
npm run build:preview
```
Production build (fails while dummy content remains):
```bash
npm run build
```
Regenerate the replacement checklist:
```bash
npm run content-report
```
Regenerate responsive images after adding photos or changing crops:
```bash
npm run images
```
Package for a sub-path static host (artifact preview):
```bash
npm run artifact -- /path/to/out
```

## Structure
```
index.html, our-practice/, services/, services/<slug>/ (generated), testimonials/, contact/, privacy/, terms/, 404.html
src/partials/          page-start (head, header), page-end (footer, sticky bar), page-hero, map-facade, review-card
src/sections/<name>/   one folder per section: .html + .css + .js → WordPress template part
src/templates/         service.html (category page template), legal pages
src/data/              site.json · pages.json · services.json · reviews.json · team.json · images.json (generated)
src/styles/            tokens.css → theme.json · base.css · components.css · pages.css
src/js/                main.js (entry) · motion.js · reveal.js · pages.js · magnetic.js · review-mode.js
build/html-partials.js @page / @include / {{…}} / {{#each|if|unless}} / {{@json}} / @picture (+ photo slots) / production guard
scripts/               gen-pages.mjs · process-images.mjs · content-report.py · build-artifact.py · build-standalone.py
docs/                  content-gaps.md (checklist) · image-credits.md · photo-inventory.md · sitemap.md
```

## Adding photos
Missing photos render as branded **photo slots**. To fill one, add the image to `scripts/process-images.mjs` under the slot's name (listed in `docs/content-gaps.md`) and run `npm run images`; every slot with that name fills automatically.

## WordPress mapping
| Here | WordPress |
|---|---|
| `src/sections/*/*.html`, `src/partials/*` | `template-parts/*.php` |
| `src/templates/service.html` + `services.json` | `single-service.php` + Services CPT / ACF |
| `{{site.*}}` | Theme options / ACF options page |
| `reviews.json`, `team.json` | Reviews and Team CPTs |
| Appointment form (`data-gf-id`) | Gravity Forms (field map in `appointment.html`) |
| `<!-- @picture … -->` | `wp_get_attachment_image()` |
| `tokens.css` | `theme.json` |
