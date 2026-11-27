// Image pipeline: crop → grade → responsive AVIF + WebP, plus a manifest with
// intrinsic sizes for width/height attributes (no CLS).
// Run: npm run images
// Source originals: assets/images/holland/_source/  (never served)
// Output:          public/images/holland/<name>-<ratio>-<width>.{avif,webp}
//                  src/data/images.json
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets/images/holland/_source');
const OUT = path.join(root, 'public/images/holland');
// Stock (dummy) photos: originals in assets/images/stock/_source → public/images/stock
const STOCK_SRC = path.join(root, 'assets/images/stock/_source');
const STOCK_OUT = path.join(root, 'public/images/stock');
const WIDTHS = [480, 800, 1200, 1600];

// One house grade so phone photos from different rooms sit together:
// slightly lower saturation, gentle contrast, neutralise the olive wall cast
// (pull green a touch, add a hint of warmth), lift deep shadows.
const GRADE = {
  saturation: 0.86,
  brightness: 1.02,
  contrast: 1.05,
  recomb: [
    [1.03, -0.01, -0.02],
    [-0.01, 0.985, 0.0],
    [0.0, -0.01, 0.99],
  ],
};

// Crop boxes are in source pixels. `glare` softens a highlight hot spot
// (radial multiply) — used only for the headlamp on the operatory portrait.
const PHOTOS = [
  { name: 'dr-patel-operatory', file: 'dr-patel-operatory.webp',
    crops: { '4x5': { left: 150, top: 0, width: 1800, height: 2250 },
             '3x2': { left: 0, top: 125, width: 3000, height: 2000 } },
    glare: { x: 1105, y: 1450, r: 230, strength: 0.62 },
    alt: 'Dr. Patel smiling in a treatment room' },
  { name: 'dr-patel-reception', file: 'dr-patel-reception.webp',
    crops: { '4x5': { left: 800, top: 0, width: 1229, height: 1536 },
             '3x2': { left: 0, top: 85, width: 2048, height: 1365 },
             'portrait': { left: 968, top: 196, width: 864, height: 1080 } },
    glare: { x: 1332, y: 812, r: 95, strength: 0.6 },   // loupe headlamp (located by brightness scan)
    // Meet the Doctor: mid-thigh up, centred, straightened 1.3° (measured from the wall corner),
    // right edge stops before the water cooler.
    straighten: { angle: -1.3, crops: ['portrait'] },
    alt: 'Dr. Patel standing beside the reception desk' },
  { name: 'team-member-reception-a', file: 'team-member-reception-a.webp',
    crops: { '4x5': { left: 1657, top: 0, width: 3427, height: 4284 } },
    alt: '[TEAM MEMBER NAME] at the reception desk' },
  { name: 'team-member-reception-b', file: 'team-member-reception-b.webp',
    crops: { '4x5': { left: 736, top: 0, width: 1229, height: 1536 },
             '4x3': { left: 0, top: 0, width: 2048, height: 1536 } },
    alt: 'Checking in at the reception desk' },
  { name: 'exterior-front', file: 'exterior-front.webp',
    // 4:3 anchored at the top: keeps the house, trims most of the driveway.
    crops: { '3x2': { left: 0, top: 60, width: 1280, height: 853 },
             '4x3': { left: 100, top: 0, width: 1080, height: 810 } },
    alt: 'The practice building on Holland Road, a converted family home with parking out front' },
  { name: 'exterior-wide', file: 'exterior-wide.webp',
    crops: { '3x2': { left: 0, top: 60, width: 1280, height: 853 } },
    alt: 'Wide view of the practice and car park in autumn' },
  { name: 'operatory', file: 'operatory.webp',
    crops: { '3x2': { left: 0, top: 168, width: 4032, height: 2688 } },
    alt: 'A bright treatment room with a dental chair and chairside screen' },
  { name: 'practice-sign', file: 'practice-sign.webp',
    crops: { '4x5': { left: 0, top: 40, width: 960, height: 1200 } },
    alt: 'The practice sign at 1030 Holland Road' },
  { name: 'team-group', file: 'team-group.jpg',
    crops: { '4x3': { left: 0, top: 0, width: 640, height: 480 } },
    alt: 'The practice team in the waiting room' },
  // ---------- STOCK (Unsplash, dummy until replaced by practice photography) ----------
  // crops: { ratio: { focus: [x, y] (0–1), zoom?: ≥1 } } → largest box of that ratio around the focus.
  ...[
    { name: 'interior-treatment', file: 'benyamin-bohlouli-e7MJLM5VGjY-unsplash.jpg', credit: 'Benyamin Bohlouli', id: 'e7MJLM5VGjY',
      crops: { '3x2': { focus: [0.5, 0.55] }, '4x3': { focus: [0.45, 0.55] }, '4x5': { focus: [0.42, 0.55] } },
      alt: 'A bright, modern treatment room' },
    { name: 'interior-technology', file: 'caroline-lm--m-4tYmtLlI-unsplash.jpg', credit: 'Caroline LM', id: '-m-4tYmtLlI',
      crops: { '3x2': { focus: [0.55, 0.45] }, '4x3': { focus: [0.58, 0.45] }, '4x5': { focus: [0.6, 0.45] } },
      alt: 'A dentist explaining X-ray images on a chairside screen' },
    { name: 'interior-consult', file: 'harold-hisona-Bg81yWKZlMg-unsplash.jpg', credit: 'Harold Hisona', id: 'Bg81yWKZlMg',
      crops: { '4x3': { focus: [0.45, 0.55] }, '4x5': { focus: [0.42, 0.55] }, '3x2': { focus: [0.45, 0.55] } },
      alt: 'A dentist chatting with a smiling, relaxed patient' },
    { name: 'interior-xray', file: 'jonathan-borba-v_2FRXEba94-unsplash.jpg', credit: 'Jonathan Borba', id: 'v_2FRXEba94',
      crops: { '3x2': { focus: [0.5, 0.45] }, '4x3': { focus: [0.5, 0.45] }, '4x5': { focus: [0.45, 0.45] } },
      alt: 'A dentist reviewing X-ray images on a lightbox' },
    { name: 'service-emergency-dentistry', file: 'jonathan-borba-v_2FRXEba94-unsplash.jpg', credit: 'Jonathan Borba', id: 'v_2FRXEba94',
      crops: { '4x3': { focus: [0.5, 0.45] } }, alt: 'A dentist reviewing X-rays to find the cause of tooth pain' },
    { name: 'service-dental-implants', file: 'jonathan-borba-W9YEY6G8LVM-unsplash.jpg', credit: 'Jonathan Borba', id: 'W9YEY6G8LVM',
      crops: { '4x3': { focus: [0.42, 0.55] } }, alt: 'A dental implant model beside natural teeth' },
    { name: 'service-periodontal-treatment', file: 'enis-yavuz-4u2fG9mqGvQ-unsplash.jpg', credit: 'Enis Yavuz', id: '4u2fG9mqGvQ',
      crops: { '4x3': { focus: [0.4, 0.5] } }, alt: 'A model of healthy teeth and gums' },
    { name: 'service-general-dentistry', file: 'caroline-lm-ux18C551ghI-unsplash.jpg', credit: 'Caroline LM', id: 'ux18C551ghI',
      crops: { '4x3': { focus: [0.5, 0.35] } }, alt: 'A dental mirror and probe used for check-ups' },
    { name: 'service-cosmetic-dentistry', file: 'kamal-hoseinianzade-RCQnbyQsnUg-unsplash.jpg', credit: 'Kamal Hoseinianzade', id: 'RCQnbyQsnUg',
      crops: { '4x3': { focus: [0.62, 0.45] } }, alt: 'A natural, bright smile' },
    { name: 'service-orthodontics', file: 'harold-hisona-uTUsnv_UCSQ-unsplash.jpg', credit: 'Harold Hisona', id: 'uTUsnv_UCSQ',
      crops: { '4x3': { focus: [0.5, 0.5] } }, alt: 'A woman fitting a clear aligner' },
  ].map((p) => ({ ...p, stock: true, dummy: true, note: `Dummy stock photo (Unsplash · ${p.credit}): replace with practice photography` })),
];

function glareOverlay(width, height, { x, y, r, strength }) {
  // White everywhere, darkening toward the hot-spot centre; composited with multiply.
  const g = Math.round(255 * (1 - strength));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><radialGradient id="g" cx="${x}" cy="${y}" r="${r}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(${g},${g},${g})"/><stop offset="0.55" stop-color="rgb(${Math.round((g + 255) / 2)},${Math.round((g + 255) / 2)},${Math.round((g + 255) / 2)})"/>
      <stop offset="1" stop-color="#fff"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#g)"/></svg>`;
  return Buffer.from(svg);
}

async function gradedBase(photo) {
  const input = path.join(photo.stock ? STOCK_SRC : SRC, photo.file);
  const meta = await sharp(input).metadata();
  let img = sharp(input).rotate().removeAlpha();
  if (photo.glare) {
    const buf = await img.toBuffer();
    img = sharp(buf).composite([{ input: glareOverlay(meta.width, meta.height, photo.glare), blend: 'multiply' }]);
  }
  const c = GRADE.contrast;
  const buf = await img
    .recomb(GRADE.recomb)
    .modulate({ saturation: GRADE.saturation, brightness: GRADE.brightness })
    .linear(c, -(128 * c) + 128 + 4)
    .toBuffer();
  return buf;
}

const manifest = {};
await mkdir(OUT, { recursive: true });
for (const photo of PHOTOS) {
  const base = await gradedBase(photo);
  const bm = await sharp(base).metadata();
  const out = photo.stock ? STOCK_OUT : OUT;
  await mkdir(out, { recursive: true });
  manifest[photo.name] = { alt: photo.alt, crops: {}, ...(photo.stock ? { dir: '/images/stock/', dummy: true, note: photo.note, credit: { photographer: photo.credit, unsplashId: photo.id, url: `https://unsplash.com/photos/${photo.id}` } } : {}) };
  for (const [ratio, def] of Object.entries(photo.crops)) {
    // Focus crops: the largest box of this ratio, centred on the focus point, kept inside the image.
    let box = def;
    if (def.focus) {
      const [rw, rh] = ratio.split('x').map(Number);
      const zoom = def.zoom || 1;
      let w = bm.width; let h = Math.round(w * rh / rw);
      if (h > bm.height) { h = bm.height; w = Math.round(h * rw / rh); }
      w = Math.round(w / zoom); h = Math.round(h / zoom);
      const left = Math.min(Math.max(0, Math.round(def.focus[0] * bm.width - w / 2)), bm.width - w);
      const top = Math.min(Math.max(0, Math.round(def.focus[1] * bm.height - h / 2)), bm.height - h);
      box = { left, top, width: w, height: h };
    }
    // Standard widths up to the crop's size; if the crop is smaller than the
    // largest standard width, also emit it at full native resolution.
    const widths = WIDTHS.filter((w) => w <= box.width);
    if (box.width < WIDTHS.at(-1)) widths.push(box.width);
    const sizes = [...new Set(widths)].sort((a, b) => a - b);
    const entry = { width: box.width, height: box.height, files: [] };
    // Optional straightening for selected crops: rotate the graded image, then
    // shift the crop box by the canvas growth so it still frames the same subject.
    let src = base; let rbox = box;
    if (photo.straighten?.crops.includes(ratio)) {
      const meta = await sharp(base).metadata();
      const rotated = await sharp(base).rotate(photo.straighten.angle, { background: '#ffffff' }).toBuffer();
      const rm = await sharp(rotated).metadata();
      src = rotated;
      rbox = { ...box, left: box.left + Math.round((rm.width - meta.width) / 2), top: box.top + Math.round((rm.height - meta.height) / 2) };
    }
    for (const w of sizes) {
      const h = Math.round((w * box.height) / box.width);
      const pipe = sharp(src).extract(rbox).resize(w, h, { kernel: 'lanczos3' }).withMetadata({ orientation: undefined });
      const stem = `${photo.name}-${ratio}-${w}`;
      await pipe.clone().avif({ quality: 52, effort: 6, chromaSubsampling: '4:2:0' }).toFile(path.join(out, `${stem}.avif`));
      await pipe.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(out, `${stem}.webp`));
      entry.files.push({ w, h, avif: `${stem}.avif`, webp: `${stem}.webp` });
    }
    manifest[photo.name].crops[ratio] = entry;
    console.log(`${photo.name} ${ratio}: ${sizes.join(', ')}`);
  }
}
await mkdir(path.join(root, 'src/data'), { recursive: true });
await writeFile(path.join(root, 'src/data/images.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/data/images.json');
