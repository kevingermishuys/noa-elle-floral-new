const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SIZES = [480, 800, 1160];

const SOURCES = {
  'weddings-white-green': { category: 'weddings', dir: 'weddings' },
  'events-warm-dried': { category: 'events', dir: 'events' },
  'everyday-bouquets': { category: 'bouquets', dir: 'bouquets' },
};

async function processOne(srcPath, outDir, baseName) {
  const meta = await sharp(srcPath).metadata();
  const nativeMax = Math.max(meta.width, meta.height);

  for (const size of SIZES) {
    if (size > nativeMax) continue; // never upscale
    await sharp(srcPath)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(outDir, `${baseName}-${size}.webp`));
  }

  // Tiny blur-up placeholder, inlined as base64 in the manifest
  const tinyBuffer = await sharp(srcPath)
    .resize({ width: 24 })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    width: meta.width,
    height: meta.height,
    placeholder: `data:image/webp;base64,${tinyBuffer.toString('base64')}`,
  };
}

async function main() {
  const manifest = {};

  for (const [srcFolder, { category, dir }] of Object.entries(SOURCES)) {
    const srcDir = path.join(ROOT, 'assets/raw', srcFolder);
    const outDir = path.join(ROOT, 'images/gallery', dir);
    fs.mkdirSync(outDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter(f => /\.jpe?g$/i.test(f));
    manifest[category] = [];

    for (const file of files) {
      const baseName = path.basename(file, path.extname(file)).toLowerCase();
      const info = await processOne(path.join(srcDir, file), outDir, baseName);
      manifest[category].push({ id: baseName, dir, ...info });
      console.log(`processed ${srcFolder}/${file} -> ${dir}/${baseName}-*.webp`);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'images/gallery/manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('manifest written');
}

main().catch(e => { console.error(e); process.exit(1); });
