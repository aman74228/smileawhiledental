# Content gaps & open decisions

Status legend: **BLOCKER** = needed before the related phase · **NEEDED** = before that section ships · **CONFIRM** = we have a value, client must verify.
Anything unconfirmed that is visible on the site is marked `data-placeholder` (dashed amber underline/outline while `site.json → showPlaceholders` is `true`).

## Resolved
| # | Item | Decision |
|---|------|----------|
| 1 | Brand name | **Smileawhile Dental** (confirmed 2026-11-26) |
| 2 | Doctor name | **Dr. Patel** (use exactly this until full name/credentials arrive) |
| 3 | Emergency / 24/7 | Practice does **not** take emergency calls. All "24/7", "Open 24/7", "day or night", "around-the-clock", "on-call" and "same evening" claims removed. Category renamed **Emergency Dentistry**: "Urgent tooth pain? Call us during office hours and we'll prioritise you." |
| 4 | Hero copy | Eyebrow "Family & cosmetic dentistry · Holland, PA" · H1 "Calm, expert dental care in Holland, PA." · subline as supplied |
| 5 | Photography | Client approved reuse of holland-smiles.com photos (see `docs/photo-inventory.md`) |

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
- First name: **[FIRST NAME]** (CONFIRM). Lead: the practice sign reads "Dr. Akshit Patel D.M.D." (photo `practice-sign`); not used until the client confirms.
- Credentials: **[DDS/DMD]** (CONFIRM). Sign suggests D.M.D.
- Bio, education, years in practice, memberships (NEEDED for "Meet the doctor")

## Brand assets
- **Logo:** the header uses a temporary Google Sans text wordmark ("Smileawhile Dental"). Final logo SVG needed.
- **Trust logos** (hero): Invisalign, CEREC, ADA, CareCredit render as text placeholders. Need official monochrome SVGs and confirmation that the practice may display each (Invisalign provider status, CEREC use, ADA membership, CareCredit enrolment).
- **Accepting new patients?** Not shown anywhere yet (the content source claimed it). CONFIRM before using.

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

## Photography (see `docs/photo-inventory.md`)
- Recommended: a short professional shoot (soft-light portrait of Dr. Patel without the headlamp, team, waiting room, technology)
- Higher-res originals of the exterior photos and the team group photo (640×480 today)
- Preventive / general care image for the featured treatments card
- `crowns-collage.png` (client upload) contains Instagram UI fragments; needs a crop or the originals

## Technical (NEEDED)
- Form submit endpoint (WordPress form plugin of choice: CF7 / Gravity Forms / WPForms)
- Google Maps embed key or share URL
