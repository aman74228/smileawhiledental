# Content gaps & open decisions

Status legend: **BLOCKER** = needed before the related phase · **NEEDED** = before that section ships · **CONFIRM** = we have a value, client must verify.
Anything unconfirmed is marked `data-placeholder="note"`. Markers are hidden in the default client view; open the page with **`?review=1`** to see dashed amber flags (hover for the note) and review-only tiles.

## Resolved
| # | Item | Decision |
|---|------|----------|
| 1 | Brand name | **PENDING:** "SmileaDental" (in use now) vs "Smileawhile Dental". Lives only in `src/data/site.json` (`name` + `wordmark`); header, `<title>`, meta, schema and the coming footer all read from it. |
| 2 | Doctor name | **Dr. Patel** (use exactly this until full name/credentials arrive) |
| 3 | Emergency / 24/7 | Practice does **not** take emergency calls. All "24/7", "Open 24/7", "day or night", "around-the-clock", "on-call" and "same evening" claims removed. Category renamed **Emergency Dentistry**: "Urgent tooth pain? Call us during office hours and we'll prioritise you." |
| 4 | Hero copy | Eyebrow "Family & cosmetic dentistry · Holland, PA" · H1 "Calm, expert dental care in Holland, PA." · subline as supplied |
| 5 | Photography | Client approved reuse of holland-smiles.com photos (see `docs/photo-inventory.md`) |
| 6 | Plum | It IS in the original palette (logo gradient end, #592C7B). Minor accents only: tags, hover tints, one gradient stop. Never CTAs or large surfaces. |
| 7 | Mobile sticky Call / Book bar | Approved and built (<1024px; hidden over hero, appointment form, footer and open menu). |
| 8 | Trust logos | Keep text stand-ins in fixed 24px monochrome slots until official files arrive. |

## Dropped from the content source (do not reintroduce)
- Featured testimonial "…fitted me in the same evening when I cracked a tooth." (implies emergency service)
- Stats "Open 24/7" and "24/7 emergency care"
- Location copy "Open 24/7, including emergencies" and the "Dental emergency? Call now, we are open 24/7" card
- Footer "Open 24/7" and brand line "…day or night"

## Clinic facts
- Phone: +1 (215) 355-4242 (CONFIRM; matches holland-smiles.com) → `src/data/site.json`
- Address: 1030 Holland Rd, Holland, PA 18966 (CONFIRM) → `src/data/site.json`
- **Hours: PLACEHOLDER** Mon–Thu 9:00 am – 5:00 pm · Fri 9:00 am – 2:00 pm · Sat–Sun Closed → `src/data/site.json` (`hours`). Not in schema (`openingHours` omitted) until confirmed. (The old site said Mon 11–8, Tue–Thu 9–5, Fri–Sun on-call; superseded.)
- Email: **[EMAIL]** (NEEDED)
- Social profile URLs: **[SOCIAL LINKS]** (NEEDED)
- Site URL / domain: **[SITE URL]** (NEEDED for canonical, og:url, schema `url`, sitemap)
- Google Business Profile URL / Place ID for map + reviews link (NEEDED)
- Parking: "Free parking right outside the practice" (CONFIRM)

## Doctor
- UI uses **"Dr. Patel"** only. Do not publish the full name yet.
- Lead to confirm: **Dr. Akshit Patel, D.M.D. (from street sign, unconfirmed)** (photo `practice-sign`, holland-smiles.com /about).
- First name: **[FIRST NAME]** (CONFIRM)
- Credentials: **[DDS/DMD]** (CONFIRM; the sign suggests D.M.D.)
- Bio, education, years in practice, memberships (NEEDED for "Meet the doctor")

## Brand assets
- **Logo:** the header uses a temporary Google Sans text wordmark ("Smileawhile Dental"). Final logo SVG needed.
- **Trust logos** (hero): Invisalign, CEREC, ADA, CareCredit render as text stand-ins in fixed 24px slots. **Official files are needed from the client's provider portals** (Invisalign Doctor Site, Dentsply Sirona / CEREC, ADA member toolkit, CareCredit Provider Center), plus confirmation that the practice may display each mark. Drop-in: replace `.logo-slot__text` with `<img class="logo-slot__img" … height="24">` (see comment in `hero.html`).

## Team
- **About section photo:** the woman at reception is unidentified. Caption shows **"[NAME], [ROLE]"** so visitors don't read her as the dentist. Need her name and role (and permission to feature her).
- Second team member photo (`team-member-reception-b`) and the group photo: names/roles needed for Meet the Team.

## Featured review (homepage)
- **NEEDED:** one real 5-star Google review (2–3 sentences), patient first name + last initial, and written permission. The section shows a bracketed placeholder until then.
- The content-source testimonials can't be used: one implies out-of-hours care ("same evening"); the other credits "Dr. Reyes", who doesn't exist. Patient quotes are never edited.
- **NEEDED:** Google Business Profile reviews URL ("Read our Google reviews").

## Meet the doctor (homepage)
- **NEEDED:** bio (2–3 sentences), dental school + year, years in practice, memberships, certifications. All show as bracketed placeholders.

## Kept off the site until confirmed
- **"Accepting new patients"**: claimed by the content source; not shown anywhere. CONFIRM before using.
- Google rating / review count
- "Free parking right outside" is shown in the Office section but flagged (`data-placeholder`)
- **"Serving Holland for 40 years"** (About) is shown but flagged: **confirm this is the same practice** as the 40-year claim on holland-smiles.com.

## Claims & numbers (not displayed until confirmed)
- Google rating and review count (content source said 4.9 / 250+). Hero shows **no** rating per Phase 2 brief.
- "40 years of dedicated service" (from holland-smiles.com)
- Doctor credentials: years of experience, ADA member, Invisalign & CEREC certified
- All 8 technologies are actually in the practice (3D CBCT, digital radiography, intraoral scanner, intraoral camera, CEREC, soft-tissue laser, digital smile design, computer-guided anaesthesia)

## Copy (NEEDED)
- Testimonials: only one usable source testimonial remains (Invisalign). Need **Emergency** and **Family** testimonials, plus patient names and permission. The emergency one must not imply out-of-hours care.
- Meet the Team: names, roles (two team members photographed at reception, one group photo)
- Driving directions text
- Service category + sub-service page copy (36 sub-services)
- Privacy policy, Terms of service

## Image rights (client uploads) — CONFIRM before any publication
These look sourced from other clinics or stock libraries, not this practice:
- `all-on-4-dental-implants-houston.jpg` (filename names a Houston clinic)
- `dental-all-on-4-implants-cost.webp`, `img-all-on-4-dental-implants-1.webp`
- `teeth-whitening-2-licence-confirmed.webp` (suggests a licensed stock image: whose licence?)
- `options-for-replacing-a-missing-tooth.jpg` (branded infographic)
- `overdenture.png` (3D illustration set)
Homepage Featured Treatments therefore uses brand visuals (glass icon + tags), not these photos. Clinical photos will be used on service pages only once rights are confirmed.

## Copy edits made (FYI)
- "Computer-guided anaesthesia" → US spelling "anesthesia".
- "calm, home-based" now appears only in the About statement (Office heading is "Easy to find, easy to park").
- US spelling applied: "prioritize" (client-supplied emergency line said "prioritise").
- Implants copy softened from "look, feel and function **exactly** like natural teeth" to "…like natural teeth" (avoids an absolute clinical claim).

## Photography (see `docs/photo-inventory.md`)
- The operatory photo is held back from the homepage (yellow cast). Dr. Patel's reception photo had a headlamp reflection (now toned down). Both strengthen the case for a short professional shoot.
- **Interior photos needed** (reception, waiting room, treatment rooms). Our Office shows the exterior only; a "coming soon" tile appears in review mode.
- **Exterior resolution:** the only exterior source is 1080 px wide; at full container width on large screens it is visibly soft. A higher-res original or reshoot is needed.
- Recommended: a short professional shoot (soft-light portrait of Dr. Patel without the headlamp, team, waiting room, technology)
- Higher-res originals of the exterior photos and the team group photo (640×480 today)
- Preventive / general care image for the featured treatments card
- `crowns-collage.png` (client upload) contains Instagram UI fragments; needs a crop or the originals

## Technical (NEEDED)
- Form submit endpoint (WordPress form plugin of choice: CF7 / Gravity Forms / WPForms)
- Google Maps embed key or share URL
