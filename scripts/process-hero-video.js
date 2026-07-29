// Mobile hero video: crop the letterboxed source down to its actual content,
// re-encode small (no audio, H.264, single pass CRF), and pull a poster frame.
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = process.argv[2];
if (!SRC) {
  console.error('Usage: node scripts/process-hero-video.js <source.mov> [cropW:cropH:cropX:cropY]');
  process.exit(1);
}
const CROP = process.argv[3]; // e.g. "882:484:2:716" — from `ffmpeg -vf cropdetect`, run manually first.

const OUT_VIDEO = path.join(ROOT, 'video/hero-mobile.mp4');
const OUT_POSTER_JPG = path.join(ROOT, 'images/hero/hero-video-poster-full.jpg');
const OUT_POSTER_WEBP = path.join(ROOT, 'images/hero/hero-video-poster.webp');

const vf = CROP ? `crop=${CROP},scale=640:-2` : 'scale=640:-2';

execFileSync(ffmpegPath, [
  '-y', '-i', SRC,
  '-an', '-vf', vf,
  '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
  '-crf', '27', '-preset', 'slow', '-movflags', '+faststart',
  OUT_VIDEO,
], { stdio: 'inherit' });

execFileSync(ffmpegPath, ['-y', '-ss', '0.2', '-i', OUT_VIDEO, '-frames:v', '1', OUT_POSTER_JPG], { stdio: 'inherit' });

sharp(OUT_POSTER_JPG).webp({ quality: 78 }).toFile(OUT_POSTER_WEBP).then(() => {
  require('fs').unlinkSync(OUT_POSTER_JPG);
  console.log('done:', OUT_VIDEO, OUT_POSTER_WEBP);
});
