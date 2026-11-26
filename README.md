# Smileawhile Dental: website redesign

Static, WordPress-portable build (Vite + semantic HTML + modern CSS + vanilla ES modules; GSAP/ScrollTrigger/SplitText + Lenis).

## Status
**Phase 1 / Step 0: design system + wireframe, awaiting approval.** No production UI yet.

## Structure
```
assets/fonts/GoogleSans-Variable-latin.woff2   77 KB Latin subset (opsz, wght 400–700, GRAD), use this
(original 5 MB GoogleSans-Variable.ttf is not committed; regenerate the subset with pyftsubset if needed)
assets/images/                                  client clinical photos (renamed, web-safe names)
src/styles/tokens.css                           design tokens (source of truth → theme.json later)
src/icons/glass-icons.svg                       glass icon sprite (6 service icons)
preview/system.src.html                         styleguide source
preview/system.html                             built styleguide (sprite inlined)
scripts/palette.py                              OKLCH ramp generator + contrast check
scripts/build-preview.py                        builds preview/system.html
docs/sitemap.md · docs/content-gaps.md
```

## View the preview
`preview/system.html` is fully self-contained (tokens, icons and font inlined, ~295 KB), so open it directly.

Rebuild after editing the source or icons:
```bash
python3 scripts/build-preview.py
```
