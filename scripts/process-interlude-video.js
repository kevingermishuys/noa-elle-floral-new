// Home page interlude video: crop the letterboxed source, trim off any
// trailing junk (export-app watermark / re-recorded UI chrome), encode
// small, and pull a poster frame.
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = process.argv[2];
const DURATION = process.argv[3]; // seconds, e.g. "12.5" — trim to a known-clean end point.
const CROP = process.argv[4]; // e.g. "886:488:0:716" — from `ffmpeg -vf cropdetect`, run manually first.
if (!SRC || !DURATION) {
  console.error('Usage: node scripts/process-interlude-video.js <source.mov> <durationSeconds> [cropW:cropH:cropX:cropY]');
  process.exit(1);
}

const OUT_VIDEO = path.join(ROOT, 'video/interlude.mp4');
const OUT_POSTER_JPG = path.join(ROOT, 'images/hero/interlude-poster-full.jpg');
const OUT_POSTER_WEBP = path.join(ROOT, 'images/hero/interlude-poster.webp');
const POSTER_AT = process.argv[5] || '1'; // seconds into the trimmed clip to grab the poster frame.

const vf = CROP ? `crop=${CROP},scale=960:-2` : 'scale=960:-2';

execFileSync(ffmpegPath, [
  '-y', '-i', SRC,
  '-t', DURATION,
  '-an', '-vf', vf,
  '-c:v', 'libx264', '-profile:v', 'main', '-pix_fmt', 'yuv420p',
  '-crf', '26', '-preset', 'slow', '-movflags', '+faststart',
  OUT_VIDEO,
], { stdio: 'inherit' });

execFileSync(ffmpegPath, ['-y', '-ss', POSTER_AT, '-i', OUT_VIDEO, '-frames:v', '1', OUT_POSTER_JPG], { stdio: 'inherit' });

sharp(OUT_POSTER_JPG).webp({ quality: 80 }).toFile(OUT_POSTER_WEBP).then(() => {
  require('fs').unlinkSync(OUT_POSTER_JPG);
  console.log('done:', OUT_VIDEO, OUT_POSTER_WEBP);
});
