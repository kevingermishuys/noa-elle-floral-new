const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

const SRC = '/home/user/noa-elle-floral-new/assets/raw/brand/logo-master.jpeg';
const OUT_DIR = '/home/user/noa-elle-floral-new/images/brand';

async function trimAndPad(buffer) {
  const trimmed = await sharp(buffer).trim({ threshold: 12 }).toBuffer();
  return sharp(trimmed)
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 255, g: 255, b: 255 } })
    .toBuffer();
}

function trace(buffer, color, outFile, label) {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, {
      threshold: 180,
      color,
      background: 'transparent',
      optTolerance: 0.4,
      turdSize: 8,
    }, (err, svg) => {
      if (err) return reject(err);
      fs.writeFileSync(`${OUT_DIR}/${outFile}`, svg);
      console.log(`${label} written`, svg.length, 'bytes');
      resolve();
    });
  });
}

async function main() {
  // Crop to the mark only (drop the wordmark/strapline text below it) so we get
  // a reusable monogram, then trim the whitespace so it fills its box, then trace.
  const meta = await sharp(SRC).metadata();
  const w = meta.width, h = meta.height;
  const markHeight = Math.round(h * 0.615);

  const markRaw = await sharp(SRC)
    .extract({ left: 0, top: 0, width: w, height: markHeight })
    .greyscale()
    .normalise()
    .toBuffer();
  const markBuffer = await trimAndPad(markRaw);

  await trace(markBuffer, '#E8E1D6', 'logo-mark.svg', 'mark svg');
  await trace(markBuffer, '#241F1A', 'logo-mark-dark.svg', 'mark dark svg');

  // Full lockup (mark + wordmark), same treatment, for places we want the full logo.
  const fullRaw = await sharp(SRC).greyscale().normalise().toBuffer();
  const fullBuffer = await trimAndPad(fullRaw);

  await trace(fullBuffer, '#E8E1D6', 'logo-full.svg', 'full svg');
  await trace(fullBuffer, '#241F1A', 'logo-full-dark.svg', 'full dark svg');
}

main().catch(e => { console.error(e); process.exit(1); });
