# Content gaps: replacement checklist

The site is complete with **realistic dummy content** so the client can judge the design. Everything dummy is tagged:

- HTML: `data-dummy="true"` (+ `data-note="what's needed"`). Open any page with **`?review=1`** to see every dummy item outlined in amber, with the note as a tooltip.
- Data: `"dummy": true` on entries in `src/data/*.json`.
- **A production build (`npm run build`) fails** while any dummy item, `[BRACKETED]` placeholder or review-only element remains, and lists them by page. Use `npm run build:preview` for review builds.

## Confirmed facts (not dummy)
- Doctor shown as **Dr. Patel** (full name not published). Lead to confirm: **Dr. Akshit Patel, D.M.D.** (from street sign, unconfirmed).
- Address **1030 Holland Rd, Holland, PA 18966** · Phone **(215) 355-4242**.
- **No emergency calls / no 24/7.** Emergency copy is "call during office hours and we'll prioritize you" everywhere.
- Real client photos: exterior, Dr. Patel (hero + doctor portrait), two team members at reception.

## Decisions pending
| Item | Current | Needed |
|---|---|---|
| Brand name | "SmileaDental" (site.json → `name`, `wordmark`) | Final: SmileaDental vs Smileawhile Dental |
| Logo | Temporary text wordmark | Final logo (SVG) |
| Trust logos (hero) | Text stand-ins in 24px slots | Official Invisalign, CEREC, ADA, CareCredit files from the provider portals + permission to display |
| "Accepting new patients" | Not shown anywhere | Confirm before using |
| "Serving Holland for 40 years" | Shown, dummy-flagged | Confirm it's the same practice |
| Form endpoint | Empty = demo mode | Gravity Forms form ID / endpoint (site.json → `form.endpoint`) |

## Photography
All stock-photo spots are **photo slots** (branded stand-in, `data-dummy`). Stock images could not be sourced automatically (see `docs/image-credits.md`). Each slot fills automatically when an image with the same name is added to the pipeline. Slots needed:

| Slot name | Used on | Subject | Ratio(s) |
|---|---|---|---|
| `interior-reception` | Home (office strip), Our Practice (gallery) | Reception desk | 3:2, 4:5 |
| `interior-waiting` | Home (tour step 1), Our Practice | Calm waiting area | 4:3, 4:5 |
| `interior-consult` | Home (tour step 2) | Dentist talking with a relaxed patient | 4:3 |
| `interior-treatment` | Home (office strip, tour step 3), Our Practice | Modern treatment room | 3:2, 4:3, 4:5 |
| `interior-technology` | Our Practice (gallery) | 3D imaging / intraoral scanner | 3:2 |
| `team-maria`, `team-karen` | Our Practice (team) | Friendly team portraits in scrubs | 4:5 |
| `service-<slug>` × 6 | Each service page hero | One image per category (no graphic clinical close-ups) | 4:3 |

Client-uploaded clinical photos (`assets/images/*.jpg|png|webp`) are **not used**: several appear to come from other clinics or stock libraries (e.g. `all-on-4-dental-implants-houston.jpg`, `teeth-whitening-2-licence-confirmed.webp`, a branded infographic). Confirm rights before any use.

## Copy notes
- US spelling throughout ("prioritize", "anesthesia", "judgment").
- Implants copy avoids absolute claims ("like natural teeth", not "exactly like").
- Patient reviews are sample text. Replace with real Google reviews used with permission; never edit a patient's words.
