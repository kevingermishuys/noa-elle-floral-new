const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TRIM_RIGHT = 10;
const SIZES = [480, 800, 1160];

// Confirmed via pixel inspection: iOS screenshot scrollbar sliver on the right edge.
const AFFECTED = [
  { id: "img_7989", srcFolder: "weddings-white-green", srcFile: "IMG_7989.jpeg", outDir: "weddings" },
  { id: "img_7990", srcFolder: "weddings-white-green", srcFile: "IMG_7990.jpeg", outDir: "weddings" },
  { id: "img_7992", srcFolder: "weddings-white-green", srcFile: "IMG_7992.jpeg", outDir: "weddings" },
  { id: "img_7997", srcFolder: "events-warm-dried", srcFile: "IMG_7997.jpeg", outDir: "events" },
  { id: "img_7999", srcFolder: "everyday-bouquets", srcFile: "IMG_7999.jpeg", outDir: "bouquets" },
  { id: "img_8001", srcFolder: "everyday-bouquets", srcFile: "IMG_8001.jpeg", outDir: "bouquets" },
];

async function main() {
  const manifestPath = path.join(ROOT, "images/gallery/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  for (const { id, srcFolder, srcFile, outDir } of AFFECTED) {
    const srcPath = path.join(ROOT, "assets/raw", srcFolder, srcFile);
    const meta = await sharp(srcPath).metadata();
    const trimmedWidth = meta.width - TRIM_RIGHT;

    const trimmed = sharp(srcPath).extract({ left: 0, top: 0, width: trimmedWidth, height: meta.height });
    const trimmedBuffer = await trimmed.toBuffer();
    const trimmedMeta = await sharp(trimmedBuffer).metadata();

    for (const size of SIZES) {
      if (size > trimmedMeta.width) continue;
      await sharp(trimmedBuffer)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(ROOT, "images/gallery", outDir, `${id}-${size}.webp`));
    }

    // Update manifest width/height + regenerate the blur-up placeholder to match the new crop.
    const tinyBuffer = await sharp(trimmedBuffer).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
    for (const category of Object.keys(manifest)) {
      const entry = manifest[category].find((e) => e.id === id);
      if (entry) {
        entry.width = trimmedMeta.width;
        entry.height = trimmedMeta.height;
        entry.placeholder = `data:image/webp;base64,${tinyBuffer.toString("base64")}`;
      }
    }

    console.log(`recut ${id}: ${meta.width}x${meta.height} -> ${trimmedMeta.width}x${trimmedMeta.height}`);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("manifest updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
