# Image credits & sourcing log

## Images in use

| Image | Source | Licence / rights | Where used |
|---|---|---|---|
| `dr-patel-operatory` | holland-smiles.com (client's current site) | Client-approved reuse | Home hero |
| `dr-patel-reception` | holland-smiles.com | Client-approved reuse | Meet the doctor (Home, Our Practice); re-cropped + straightened 1.3° |
| `team-member-reception-a` | holland-smiles.com /about | Client-approved reuse | About (captioned with dummy name "Linda, Office Manager"); Team card |
| `team-member-reception-b` | holland-smiles.com | Client-approved reuse | Team card (dummy name "Jessica, Dental Assistant") |
| `exterior-front` | holland-smiles.com | Client-approved reuse | Our office (Home), Office tour gallery |

All real photos go through `scripts/process-images.mjs` (one crop per ratio + the house grade). Full inventory: `docs/photo-inventory.md`.

## Stock photos (Unsplash / Pexels): NOT YET SOURCED

**Status: blocked during the build, so every stock spot is a branded photo slot (`data-dummy="true"`).**

What was tried:
1. Unsplash's internal search endpoint was refused by this environment's safety check (it's not a sanctioned API).
2. Unsplash's public pages serve an automated-browser challenge (Anubis). Getting past it would mean defeating the site's bot protection, so it wasn't attempted.
3. The official Unsplash and Pexels APIs need an access key, and none was available.

### How to fill the slots (any one of these)
- **Fastest:** pick the photos on unsplash.com or pexels.com in a browser, download them, and drop them in `assets/images/stock/` named after the slot (e.g. `interior-reception.jpg`). Add each to the `PHOTOS` list in `scripts/process-images.mjs` with `dir: '/images/stock/'`, `dummy: true` and a crop per ratio. Run `npm run images` and the slots fill automatically.
- **Automated:** provide an Unsplash access key (free developer account) and I'll search, filter out Unsplash+ (paid) images, download, grade and log them here.

### Rules for any stock image
- Licence: Unsplash License or Pexels License only (free commercial use). **Exclude Unsplash+ / premium.**
- No visible third-party clinic logos, signage or branding. No graphic clinical close-ups (blood, surgery, extracted teeth).
- Mark as dummy (`dummy: true` in the pipeline → `data-dummy="true"` on the page) until replaced by practice photography.
- Log each here: slot · photo URL · photographer · licence · where used.

| Slot | Photo URL | Photographer | Licence | Where used |
|---|---|---|---|---|
| _none yet_ | | | | |
