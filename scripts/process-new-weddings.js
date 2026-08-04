// Processes the new client-supplied wedding photos (assets/raw/weddings-*,
// excluding the original weddings-white-green set already in the manifest)
// into responsive webp + blur placeholders, and appends them to
// images/gallery/manifest.json under "weddings". Folder names are colour/
// style descriptors, not couple names, and stay out of any public copy.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT, 'assets/raw');
const OUT_DIR = path.join(ROOT, 'images/gallery/weddings');
const SIZES = [480, 800, 1160];

// folder slug -> { file: { alt, stems } }
const CAPTIONS = {
  'weddings-red-white': {
    '01-arch-detail': { alt: 'Deep red and white floral garland dressing a wooden ceremony arch', stems: 'Red carnation, burgundy dahlia, white hydrangea, olive foliage' },
    '02-cake-detail': { alt: 'Naked wedding cake topped with red dahlias, blush roses and ranunculus', stems: 'Red dahlia, blush rose, red ranunculus' },
    '03-table-setting-close': { alt: 'Place setting with a red taper candle and a red-and-white floral runner', stems: 'Red rose, white carnation, eucalyptus' },
    '04-table-row-string-lights': { alt: 'Long reception table dressed in red garlands under string lights', stems: 'Red rose, dahlia, white carnation, olive foliage' },
    '05-centerpiece-macro': { alt: 'Macro detail of red and white roses with dahlias and eucalyptus', stems: 'Red rose, white rose, dahlia, eucalyptus' },
    '06-tables-overview-wide': { alt: 'Wide view of long reception tables dressed in red florals under string lights', stems: 'Red rose, dahlia, olive foliage, candlelight' },
    '07-tables-row-perspective': { alt: 'Reception tables in perspective at dusk, string lights overhead', stems: 'Red and white florals, olive foliage, candlelight' },
    '08-garland-single-rose': { alt: 'Table garland detail with a blush rose among red dahlias and white peonies', stems: 'Blush rose, red dahlia, white peony' },
    '09-chairs-aisle-view': { alt: 'White chiavari chairs lined along a wooden reception table', stems: 'Red and white florals, olive foliage' },
    '10-tables-candlelight': { alt: 'Candlelit reception tables dressed in red and white garlands', stems: 'Red rose, white carnation, candlelight' },
    '11-dusk-candles-photo': { alt: 'Dusk table detail with glass candle holders and red and pink roses', stems: 'Red rose, pink rose, eucalyptus' },
    '12-welcome-sign': { alt: 'Welcome sign topped with a red, white and blush floral swag', stems: 'White rose, blush rose, red carnation, eucalyptus' },
    '13-garland-close-detail': { alt: 'Close detail of a red and white rose and dahlia garland', stems: 'Red rose, white rose, dahlia, eucalyptus' },
  },
  'weddings-orange-yellow': {
    '01-bride-wildflower-bouquet': { alt: 'Bride holding a loose coral and yellow wildflower bouquet', stems: 'Coral tulip, orange ranunculus, freesia, wildflowers' },
    '02-table-number-childhood-photos': { alt: 'Table number styled with orange ranunculus and pale blue delphinium', stems: 'Orange ranunculus, pale blue delphinium, snapdragon' },
    '03-place-setting': { alt: 'Place setting with an orange, yellow and blue centerpiece', stems: 'Orange rose, yellow chrysanthemum, blue delphinium' },
    '04-evening-candlelit-table': { alt: 'Evening candlelit table with warm-toned bud vase florals', stems: 'Orange ranunculus, warm-toned florals' },
    '05-seating-chart-window': { alt: 'Vintage window frame seating chart trimmed with marigolds and roses', stems: 'Orange marigold, yellow rose, white chrysanthemum' },
    '06-centerpiece-barn-lights': { alt: 'Orange, yellow and blue centerpiece under string lights in a barn', stems: 'Orange rose, yellow carnation, blue delphinium, billy buttons' },
    '07-centerpiece-close-detail': { alt: 'Close detail of an orange, yellow and blue wildflower centerpiece', stems: 'Orange rose, yellow freesia, blue delphinium' },
  },
  'weddings-white-blush': {
    '01-dusk-tablescape-lights': { alt: 'Dusk reception tablescape with blush roses under hanging string lights', stems: 'Blush rose, white rose, olive foliage, candlelight' },
    '02-night-first-dance': { alt: 'Bride and groom sharing a first dance under string lights at night', stems: 'Night reception, string lights' },
    '03-evening-table-row': { alt: 'Evening reception table row under a canopy of string lights', stems: 'Blush and white florals, candlelight' },
    '04-hexagon-arch-night-kiss': { alt: 'Couple sharing a kiss beneath a white floral hexagon arch at night', stems: 'White rose, olive foliage, draped fabric' },
    '05-indoor-evening-roses': { alt: 'Indoor evening reception table dressed with cream roses and olive garland', stems: 'Cream rose, olive foliage, candlelight' },
  },
  'weddings-white-neutral': {
    '01-confetti-exit-pergola': { alt: 'Newlyweds walking through a confetti toss beneath a grapevine pergola', stems: 'White rose, baby\'s breath' },
    '02-lovelock-couple': { alt: 'Couple with a padlock keepsake beneath vines hung with love locks', stems: 'White boutonniere rose' },
    '03-ceremony-chairs-pergola': { alt: 'Rows of white ceremony chairs beneath a grapevine pergola', stems: 'White floral aisle accents' },
    '04-bride-studio-portrait': { alt: 'Bride portrait with a cascading white rose and orchid bouquet', stems: 'White rose, white orchid, baby\'s breath' },
    '05-couple-portrait-orchid-bouquet': { alt: 'Couple portrait with a cascading white orchid bouquet', stems: 'White orchid, white rose, baby\'s breath' },
    '06-reception-babys-breath-dusk': { alt: 'Reception tables dressed with baby\'s breath runners at dusk', stems: 'Baby\'s breath, candlelight' },
    '07-reception-babys-breath-day': { alt: 'Reception tables dressed with baby\'s breath runners in daylight', stems: 'Baby\'s breath, white florals' },
  },
  'weddings-pink-coral': {
    '01-bud-vases-dusk': { alt: 'Bud vases of pink, coral and orange blooms on a dusk-lit table', stems: 'Pink peony, coral rose, orange gerbera, delphinium' },
    '02-table-garland-runner': { alt: 'Vivid pink and coral floral garland runner along a reception table', stems: 'Pink rose, coral carnation, orange rose' },
    '03-bride-bouquet-circle': { alt: 'Bride encircled by vivid pink, coral and blue bridesmaid bouquets', stems: 'Pink gerbera, coral rose, blue delphinium, orchid' },
    '04-bride-bridesmaids-blue-dresses': { alt: 'Bride and bridesmaids in dusty blue holding vivid pink and coral bouquets', stems: 'Pink and coral roses, gerbera, delphinium' },
    '05-couple-embrace-tables-dusk': { alt: 'Couple embracing between reception tables dressed in pink and coral at dusk', stems: 'Pink and coral florals, string lights' },
  },
  'weddings-dried-neutral': {
    '01-bridal-prep-flatlay': { alt: 'Bridal getting-ready flatlay with a dried protea and pampas bouquet', stems: 'Dried protea, pampas grass, olive foliage' },
    '02-sweetheart-table-arch': { alt: 'Sweetheart table beneath a dried protea and pampas floral arch', stems: 'Dried protea, pampas grass, cream rose' },
    '03-centerpiece-protea-pampas': { alt: 'Centerpiece of dried protea, pampas grass and cream roses', stems: 'Dried protea, pampas grass, cream rose' },
  },
  'weddings-meadow-white': {
    '01-couple-walking-bw': { alt: 'Black-and-white photo of a couple walking hand in hand with a cascading white bouquet', stems: 'White rose, white orchid' },
    '02-couple-meadow-color': { alt: 'Couple walking through a dried-grass meadow with a white rose bouquet', stems: 'White rose, dried grasses' },
  },
};

async function processOne(srcPath, outDir, baseName) {
  const meta = await sharp(srcPath).metadata();
  const nativeMax = Math.max(meta.width, meta.height);

  for (const size of SIZES) {
    if (size > nativeMax) continue;
    await sharp(srcPath)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(outDir, `${baseName}-${size}.webp`));
  }

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
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifestPath = path.join(ROOT, 'images/gallery/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const [folder, files] of Object.entries(CAPTIONS)) {
    const slug = folder.replace(/^weddings-/, '');
    const srcDir = path.join(RAW_DIR, folder);

    for (const [fileBase, caption] of Object.entries(files)) {
      const srcPath = path.join(srcDir, `${fileBase}.jpeg`);
      if (!fs.existsSync(srcPath)) {
        console.warn(`MISSING: ${srcPath}`);
        continue;
      }
      const id = `${slug}-${fileBase.slice(0, 2)}`; // e.g. red-white-01
      const info = await processOne(srcPath, OUT_DIR, id);
      manifest.weddings.push({ id, dir: 'weddings', ...info, stems: caption.stems, alt: caption.alt });
      console.log(`processed ${folder}/${fileBase} -> weddings/${id}-*.webp`);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`manifest updated, weddings count: ${manifest.weddings.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
