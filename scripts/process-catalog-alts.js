// One-off: generate a second-angle crop for the two catalog cards (hover swap).
const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIZES = [480, 800, 1160];

const JOBS = [
  {
    src: 'assets/raw/everyday-bouquets/IMG_8001.jpeg',
    out: 'images/gallery/bouquets/img_8001-alt',
    crop: (w, h) => ({ left: Math.round(w * 0.32), top: 0, width: w - Math.round(w * 0.32), height: Math.round(h * 0.72) }),
  },
  {
    src: 'assets/raw/everyday-bouquets/IMG_7999.jpeg',
    out: 'images/gallery/bouquets/img_7999-alt',
    crop: (w, h) => ({ left: 0, top: Math.round(h * 0.38), width: w, height: h - Math.round(h * 0.38) }),
  },
];

async function main() {
  for (const job of JOBS) {
    const srcPath = path.join(ROOT, job.src);
    const meta = await sharp(srcPath).metadata();
    const box = job.crop(meta.width, meta.height);
    const nativeMax = Math.max(box.width, box.height);

    for (const size of SIZES) {
      if (size > nativeMax) continue;
      await sharp(srcPath)
        .extract(box)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(ROOT, `${job.out}-${size}.webp`));
    }
    console.log(`done ${job.out}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
