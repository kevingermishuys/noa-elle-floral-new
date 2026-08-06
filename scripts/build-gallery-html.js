const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "images/gallery/manifest.json"), "utf8"));

// Only sizes that were actually generated get listed. A file is never upscaled
// past the source, so a photo narrower than its size slot (e.g. a tight privacy
// crop) is described by its real width, not the slot it sits in.
function srcset(dir, id, nativeWidth) {
  const sizes = [480, 800, 1160].filter((s) => fs.existsSync(path.join(ROOT, `images/gallery/${dir}/${id}-${s}.webp`)));
  return sizes.map((s) => `/images/gallery/${dir}/${id}-${s}.webp ${Math.min(s, nativeWidth)}w`).join(", ");
}

function itemHtml(category, entry, index, tailClass) {
  const { id, dir, width, height, stems, alt, placeholder } = entry;
  const src = `/images/gallery/${dir}/${id}-480.webp`;
  const lazy = index === 0 ? "eager" : "lazy";
  const fetchPriority = index === 0 ? ' fetchpriority="high"' : "";
  const cls = tailClass ? `gallery-item ${tailClass}` : "gallery-item";
  return `      <figure class="${cls}" data-category="${category}" style="background-image:url('${placeholder}')">
        <img src="${src}" srcset="${srcset(dir, id, width)}" sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 50vw" width="${width}" height="${height}" alt="${alt}" loading="${lazy}"${fetchPriority}>
        <figcaption class="stems">${stems}</figcaption>
      </figure>`;
}

// One continuous colour journey across every category — no filter tabs
// anymore, so the display order is the only thing that keeps this neat.
// Groups are colour/style families; events and bouquets slot in next to
// the wedding sets they read closest to.
const COLOUR_ORDER = [
  { cat: "weddings", group: "red-white" },
  { cat: "weddings", group: "pink-coral" },
  { cat: "events", group: null },
  { cat: "weddings", group: "orange-yellow" },
  { cat: "bouquets", group: null },
  { cat: "weddings", group: "dried-neutral" },
  { cat: "weddings", group: "white-blush" },
  { cat: "weddings", group: "legacy" },
  { cat: "weddings", group: "white-neutral" },
  { cat: "weddings", group: "meadow-white" },
];

function weddingGroupOf(id) {
  if (id.startsWith("img_")) return "legacy";
  return id.replace(/-\d+$/, "");
}

const ordered = [];
for (const { cat, group } of COLOUR_ORDER) {
  const entries = group ? manifest[cat].filter((e) => weddingGroupOf(e.id) === group) : manifest[cat];
  entries.forEach((entry) => ordered.push({ cat, entry }));
}

// The tile rhythm repeats every 8 items and covers 13 grid cells per cycle. A
// trailing part-cycle would leave big tiles stranded and tear a hole in the last
// row, so the tail is overridden: plain squares, plus enough wide tiles to round
// the total cell count up to a multiple of 12. Twelve divides the 2-, 3- and
// 4-column layouts alike, so the grid finishes flush at every breakpoint.
const CELLS_PER_CYCLE = 13;
const lastWholeCycle = Math.floor(ordered.length / 8) * 8;
const tailCount = ordered.length - lastWholeCycle;
const cellsSoFar = (lastWholeCycle / 8) * CELLS_PER_CYCLE + tailCount;
const widened = Math.min(tailCount, (12 - (cellsSoFar % 12)) % 12);

const all = ordered.map(({ cat, entry }, i) => {
  if (i < lastWholeCycle) return itemHtml(cat, entry, i);
  return itemHtml(cat, entry, i, i - lastWholeCycle < widened ? "is-tail-wide" : "is-plain");
});

fs.writeFileSync(path.join(ROOT, "partials/gallery-items.html"), all.join("\n\n") + "\n");
console.log(`wrote ${all.length} gallery items`);

// Teaser set for Home + Weddings pages: 3 strongest weddings shots.
const teaserIds = ["img_7988", "img_7990", "img_7994"];
const teaserHtml = teaserIds
  .map((id) => {
    const entry = manifest.weddings.find((e) => e.id === id);
    return `      <a class="teaser-card" href="/gallery.html">
        <img src="/images/gallery/${entry.dir}/${id}-480.webp" srcset="${srcset(entry.dir, id, entry.width)}" sizes="(min-width: 48rem) 33vw, 100vw" width="${entry.width}" height="${entry.height}" alt="${entry.alt}" loading="lazy">
        <figcaption>${entry.stems}</figcaption>
      </a>`;
  })
  .join("\n\n");
fs.writeFileSync(path.join(ROOT, "partials/wedding-teaser.html"), teaserHtml + "\n");
console.log("wrote wedding teaser");
