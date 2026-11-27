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

## Stock photos (Unsplash): supplied by the client, all DUMMY

Supplied in `dental_images.zip` (Unsplash downloads; filenames keep photographer + photo ID). Graded with the house grade, focus-cropped by `scripts/process-images.mjs`, and tagged `data-dummy="true"` on every page until replaced by practice photography. Licence: Unsplash License (free commercial use; attribution appreciated, not required). **Confirm none is an Unsplash+ image** (Unsplash+ photos aren't covered by the free licence).

| Slot | Photo | Photographer | Where used |
|---|---|---|---|
| `interior-treatment` | https://unsplash.com/photos/e7MJLM5VGjY | Benyamin Bohlouli | Home office strip; Our Practice gallery |
| `interior-technology` | https://unsplash.com/photos/-m-4tYmtLlI | Caroline LM | Home tour step 3; Our Practice gallery |
| `interior-consult` | https://unsplash.com/photos/Bg81yWKZlMg | Harold Hisona | Our Practice gallery |
| `interior-xray` | https://unsplash.com/photos/v_2FRXEba94 | Jonathan Borba | Home office strip; Our Practice gallery |
| `service-emergency-dentistry` | https://unsplash.com/photos/v_2FRXEba94 | Jonathan Borba | Emergency Dentistry page |
| `service-dental-implants` | https://unsplash.com/photos/W9YEY6G8LVM | Jonathan Borba | Dental Implants page |
| `service-periodontal-treatment` | https://unsplash.com/photos/4u2fG9mqGvQ | Enis Yavuz | Periodontal Treatment page |
| `service-general-dentistry` | https://unsplash.com/photos/ux18C551ghI | Caroline LM | General Dentistry page |
| `service-cosmetic-dentistry` | https://unsplash.com/photos/RCQnbyQsnUg | Kamal Hoseinianzade | Cosmetic Dentistry page |
| `service-orthodontics` | https://unsplash.com/photos/uTUsnv_UCSQ | Harold Hisona | Orthodontics page |
| `treat-preventive` | https://unsplash.com/photos/Bg81yWKZlMg | Harold Hisona | Home featured treatments: Preventive Care (16:10) |
| `treat-invisalign` | https://unsplash.com/photos/uTUsnv_UCSQ | Harold Hisona | Home featured treatments: Invisalign (16:10) |
| `treat-implants` | https://unsplash.com/photos/W9YEY6G8LVM | Jonathan Borba | Home featured treatments: Dental Implants (16:10) |
| `treat-emergency` | https://unsplash.com/photos/-m-4tYmtLlI | Caroline LM | Home featured treatments: Emergency Dentistry (16:10) |
| `tour-explain` | https://unsplash.com/photos/4u2fG9mqGvQ | Enis Yavuz | Home tour step 2 |
| `tour-checkup` | https://unsplash.com/photos/ux18C551ghI | Caroline LM | Home tour step 3 |

**Supplied but not used:**
- `candid-WFsNCIn8OF4`: the aligner case shows a third-party brand name ("Candid").
- `caroline-lm-JiBssiZVPZA` (open-mouth exam with instruments) and `kamal-hoseinianzade-s5TU52ZjaFA` (cheek retractor): too clinical for the site.
- `tony-litvyak-glPVwPr1FKo`: no matching slot (vertical smile close-up). Available for later.

**Still needed:** team portraits for Maria and Karen (photo slots on Our Practice).

## Rules for any future stock image
- Unsplash / Pexels free licences only; exclude Unsplash+ / premium.
- No visible third-party logos or branding; no graphic clinical close-ups.
- Add to `scripts/process-images.mjs` (stock section) with `credit` + `id`, run `npm run images`, log it above.
