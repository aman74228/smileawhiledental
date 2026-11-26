# Photo inventory: holland-smiles.com

Source pages crawled 2026-11-26: `/`, `/about`, `/book-appointment`. Client approved reusing these photos.
All files are served from `cdn.prod.website-files.com/674457ee8493ea076550b188/`; sizes are the original (largest) file.

**Pipeline:** originals in `assets/images/holland/_source/` → `npm run images` (`scripts/process-images.mjs`) →
one crop per ratio + one house grade (sat 0.86, gentle contrast, olive-cast correction, +2% brightness) →
AVIF + WebP at 480 / 800 / 1200 / 1600 w (or native max) in `public/images/holland/`, with intrinsic sizes in `src/data/images.json`.

## Used (real office / team / doctor / clinic)

| # | Original file (page) | Size | What it shows | Saved as | Crops | Notes |
|---|---|---|---|---|---|---|
| 1 | `…65caec855ebb9c64_IMG_9481.webp` (/) | 3000×2250 | Dr. Patel smiling in a treatment room, loupes + headlamp | `dr-patel-operatory` | 4:5, 3:2 | **Hero image.** Headlamp hot spot softened (radial multiply). Olive walls; grade tames them. |
| 2 | `…9703169ffb737731_IMG_9482.webp` (/) | 2048×1536 | Dr. Patel full-length beside reception, diplomas behind | `dr-patel-reception` | 4:5 (1229 max), 3:2 | Good for "Meet the doctor". Smaller headlamp glare also softened. |
| 3 | `…4b12337739ee1c54_IMG_2829.webp` (/about) | 5712×4284 | Team member at reception desk, diplomas + plant | `team-member-reception-a` | 4:5 | Name/role needed: `[TEAM MEMBER NAME]`. |
| 4 | `…7e343002b6474388_IMG_9485.webp` (/) | 2048×1536 | Team member at reception desk | `team-member-reception-b` | 4:5 (1229 max) | Name/role needed. |
| 5 | `…65dd25a083bf9515_IMG_2654.webp` (/) | 1280×960 | Practice exterior (converted family home), autumn | `exterior-front` | 3:2 (1280 max) | Low-res for large use; fine up to ~640 CSS px. |
| 6 | `…45eb04d0ca36d04a_IMG_2835 Large.webp` (/about) | 1280×960 | Exterior wide with car park | `exterior-wide` | 3:2 (1280 max) | Strong lens flare top-left. Use small or crop. |
| 7 | `…45eb04d0ca36a809_IMG_9489.webp` (/) | 4032×3024 | Empty treatment room (chair, monitor, window) | `operatory` | 3:2 | Wide-angle distortion and a heavy yellow cast that the subtle grade can't fully fix. **Reshoot recommended.** |
| 8 | `…cc69bd5b3eac83b8_IMG_2658.webp` (/about) | 960×1280 | Street sign "1030 · Holland Smiles · Dr. Akshit Patel D.M.D." | `practice-sign` | 4:5 (960 max) | Shows the **old brand name**. Use only for driving directions, or not at all after rebrand. Also suggests doctor's first name + credential (see content-gaps). |
| 9 | `…3732a8dd9085346_Carl Medium.jpeg` (/) | 640×480 | Whole team (7 people) in the waiting room | `team-group` | 4:3 (640 max) | **Too small** for anything over ~320 CSS px wide. Ask for the original. |

## Skipped

| Original file | Size | What it is | Why skipped |
|---|---|---|---|
| `…67559d24ba9317ab3b741f9d_IMG_9481.webp` (/about) | 2052×1780 | Tighter crop of #1 | Duplicate; we crop from the larger original. |
| `…jonathan-borba-v_2FRXEba94-unsplash.webp` | 4624×3083 | Dentist reviewing X-rays on a lightbox | **Unsplash stock**, not this practice. |
| `…candid-WFsNCIn8OF4-unsplash.webp` | 3408×2434 | Hands holding clear aligners + case | **Unsplash stock** (aligner brand product shot). |
| `…jonathan-borba-hl6uG9cHW5A-unsplash.webp` | 3648×5472 | Masked clinicians treating a patient | **Unsplash stock.** |
| `…jonathan-borba-W9YEY6G8LVM-unsplash.webp` | 5472×3648 | Implant model on a table | **Unsplash stock.** |
| `…32x18-light-box-faces-revised2-_1_.png` | 704×396 | Before/after smile composite | Unknown origin (looks like template/stock); clinical close-up, not office. Confirm before any use. |
| `…Logo.svg`, `…Logo Alternative.svg` | vector | Holland Smiles logo (teal→plum gradient) | Logos; old brand. |

## Gaps
- No portrait of Dr. Patel with even, soft light (no headlamp). A 30-minute photo session would lift the hero and "Meet the doctor" noticeably.
- No photos of the waiting room alone, the sterilisation area, or the technology (CBCT, scanner, CEREC) for Phase 3's technology section.
- Original (uncompressed) files of #5, #6 and #9 if they exist.
