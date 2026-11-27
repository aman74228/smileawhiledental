# Content gaps: replacement checklist

The site is complete with **realistic dummy content** so the client can judge the design. Everything dummy is tagged:

- HTML: `data-dummy="true"` (+ `data-note="what's needed"`). Open any page with **`?review=1`** to see every dummy item outlined in amber, with the note as a tooltip.
- Data: `"dummy": true` on entries in `src/data/*.json`.
- **A production build (`npm run build`) fails** while any dummy item, `[BRACKETED]` placeholder or review-only element remains, and lists them by page. Use `npm run build:preview` for review builds.

## Confirmed facts (not dummy)
- Brand: **Smileawhile Dental**, with the supplied logo.
- Doctor shown as **Dr. Patel** (full name not published). Lead to confirm: **Dr. Akshit Patel, D.M.D.** (from street sign, unconfirmed).
- Address **1030 Holland Rd, Holland, PA 18966** · Phone **(215) 355-4242**.
- **No emergency calls / no 24/7.** Emergency copy is "call during office hours and we'll prioritize you" everywhere.
- Real client photos: exterior, Dr. Patel (hero + doctor portrait), two team members at reception.

## Decisions pending
| Item | Current | Needed |
|---|---|---|
| Logo file | Real logo as 321×110 PNG | SVG version for crisp rendering on high-density screens (optional) |
| Trust logos (hero) | Text stand-ins in 24px slots | Official Invisalign, CEREC, ADA, CareCredit files from the provider portals + permission to display |
| "Accepting new patients" | Not shown anywhere | Confirm before using |
| "Serving Holland for 40 years" | Shown, dummy-flagged | Confirm it's the same practice |
| Form endpoint | Empty = demo mode | Gravity Forms form ID / endpoint (site.json → `form.endpoint`) |

## Photography
- **Stock photos (dummy):** 10 slots filled from the client's Unsplash set. See `docs/image-credits.md` for credits; replace with practice photography where possible.
- **Still placeholders:** team portraits for Maria and Karen (`team-maria`, `team-karen`).
- Client-uploaded clinical photos (`assets/images/*.jpg|png|webp`) are **not used**: several appear to come from other clinics or stock libraries. Confirm rights before any use.

## Copy notes
- US spelling throughout ("prioritize", "anesthesia", "judgment").
- Implants copy avoids absolute claims ("like natural teeth", not "exactly like").
- Patient reviews are sample text. Replace with real Google reviews used with permission; never edit a patient's words.
