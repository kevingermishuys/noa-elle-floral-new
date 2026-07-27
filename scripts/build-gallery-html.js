const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "images/gallery/manifest.json"), "utf8"));

function srcset(dir, id) {
  const sizes = [480, 800, 1160].filter((s) => {
    // only include sizes that were actually generated
    return fs.existsSync(path.join(ROOT, `images/gallery/${dir}/${id}-${s}.webp`));
  });
  return sizes.map((s) => `/images/gallery/${dir}/${id}-${s}.webp ${s}w`).join(", ");
}

function itemHtml(category, entry, index) {
  const { id, dir, width, height, stems, alt, placeholder } = entry;
  const src = `/images/gallery/${dir}/${id}-480.webp`;
  const lazy = index === 0 ? "eager" : "lazy";
  const fetchPriority = index === 0 ? ' fetchpriority="high"' : "";
  return `      <figure class="gallery-item" data-category="${category}" style="background-image:url('${placeholder}')">
        <img src="${src}" srcset="${srcset(dir, id)}" sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw" width="${width}" height="${height}" alt="${alt}" loading="${lazy}"${fetchPriority}>
        <figcaption class="stems">${stems}</figcaption>
      </figure>`;
}

const order = ["weddings", "events", "bouquets"];
let all = [];
for (const cat of order) {
  manifest[cat].forEach((entry, i) => all.push(itemHtml(cat, entry, all.length)));
}

fs.writeFileSync(path.join(ROOT, "partials/gallery-items.html"), all.join("\n\n") + "\n");
console.log(`wrote ${all.length} gallery items`);

// Teaser set for Home + Weddings pages: 3 strongest weddings shots.
const teaserIds = ["img_7988", "img_7990", "img_7994"];
const teaserHtml = teaserIds
  .map((id) => {
    const entry = manifest.weddings.find((e) => e.id === id);
    return `      <a class="teaser-card" href="/gallery.html?filter=weddings">
        <img src="/images/gallery/${entry.dir}/${id}-480.webp" srcset="${srcset(entry.dir, id)}" sizes="(min-width: 48rem) 33vw, 100vw" width="${entry.width}" height="${entry.height}" alt="${entry.alt}" loading="lazy">
        <figcaption>${entry.stems}</figcaption>
      </a>`;
  })
  .join("\n\n");
fs.writeFileSync(path.join(ROOT, "partials/wedding-teaser.html"), teaserHtml + "\n");
console.log("wrote wedding teaser");
