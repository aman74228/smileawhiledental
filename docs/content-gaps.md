# Content gaps & open decisions

Status legend: **BLOCKER** = needed before Phase 2 · **NEEDED** = before that section ships · **CONFIRM** = we have a value, client must verify.

## Decisions (BLOCKER)
| # | Item | Sources disagree | Recommendation |
|---|------|------------------|----------------|
| 1 | Brand name | ~~Brief: "SmileaDental" vs sitemap/content site: "Smileawhile Dental"~~ | **RESOLVED: Smileawhile Dental** (confirmed by client, 2026-11-26) |
| 2 | Doctor name | Brief: [DOCTOR NAME] · Sitemap: "Meet Dr. Patel" · Content site: "Dr. Daniel Reyes" (likely filler) | Placeholder `[DOCTOR NAME]` until confirmed |
| 3 | 24/7 claim | Copy says "around the clock / Open 24/7" · Hours: Mon 11–8, Tue–Thu 9–5, Fri–Sun on-call | Say "Emergency care, day or night" and show real hours; avoid "Open 24/7" unless a staffed line exists |
| 4 | Hero headline | Source: "Your Trusted Dentist" | Proposed: "Your trusted dentist, day or night." |

## Clinic facts (CONFIRM)
- Address: 1030 Holland Rd, Holland, PA 18966 (matches holland-smiles.com)
- Phone: +1 (215) 355-4242 (matches holland-smiles.com)
- Hours: Mon 11:00 am–8:00 pm · Tue–Thu 9:00 am–5:00 pm · Fri–Sun on-call (matches holland-smiles.com)
- Email: **[EMAIL]** (NEEDED; content site shows `[hello@smileawhile.com]` placeholder)
- Parking: "Free parking right outside the practice" (CONFIRM)
- Social profile URLs: **[SOCIAL LINKS]** (NEEDED)
- Google Business Profile URL / Place ID for map + reviews link (NEEDED)

## Claims & numbers (CONFIRM, shown as placeholders)
- Rating "4.9" and "250+ Google reviews"
- "40 years of dedicated service" (from holland-smiles.com)
- Doctor: "Founder & Lead Dentist · DDS", "15+ years of clinical experience", "Member of the ADA", "Certified Invisalign and CEREC provider"
- Featured review: "[Patient name]", "Patient since 2019"
- All 8 technologies are actually in the practice (3D CBCT, digital radiography, intraoral scanner, intraoral camera, CEREC, soft-tissue laser, digital smile design, computer-guided anaesthesia)

## Copy (NEEDED)
- Testimonials: only 2 exist (featured quote; Invisalign). Need **Emergency** and **Family** testimonials + patient names/permission.
- Doctor bio (real), Meet the Team (names, roles, photos)
- Driving directions text
- Service category + sub-service page copy (36 sub-services)
- Privacy policy, Terms of service

## Assets (NEEDED)
- Office, team and doctor photography, high-res originals. None in the upload; holland-smiles.com has phone-quality shots (permission to reuse?)
- Preventive Care image for the featured treatments card
- Official logo SVGs + usage permission: Invisalign, CEREC, ADA, CareCredit
- Office tour video ("Watch the 90-second tour · 1:30"): does it exist?
- Brand logo/wordmark for the final name
- `crowns-collage.png` contains Instagram UI fragments at the edges and needs a crop or the original files

## Technical (NEEDED)
- Form submit endpoint (WordPress form plugin of choice: CF7 / Gravity Forms / WPForms)
- Google Maps embed key or share URL
