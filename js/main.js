// Nòa-Elle Floral Studio — shared behaviour. No libraries.

// Reveal images as they load (blur-up placeholders stay until the real file is in).
document.querySelectorAll("img[loading]").forEach((img) => {
  if (img.complete) {
    img.classList.add("is-loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  }
});

// Gallery filter tabs (Weddings / Events / Bouquets / All).
const tabs = document.querySelectorAll(".filter-tab");
const items = document.querySelectorAll(".gallery-item");
function applyFilter(filter) {
  tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.filter === filter)));
  items.forEach((item) => {
    item.hidden = !(filter === "all" || item.dataset.category === filter);
  });
}
tabs.forEach((tab) => tab.addEventListener("click", () => applyFilter(tab.dataset.filter)));
const requestedFilter = new URLSearchParams(location.search).get("filter");
if (requestedFilter && document.querySelector(`.filter-tab[data-filter="${requestedFilter}"]`)) {
  applyFilter(requestedFilter);
}

// Signature feature: tap to reveal stem names on touch devices (hover covers the rest).
items.forEach((item) => {
  item.addEventListener("click", () => {
    if (matchMedia("(hover: hover)").matches) return;
    const wasActive = item.classList.contains("is-active");
    items.forEach((i) => i.classList.remove("is-active"));
    if (!wasActive) item.classList.add("is-active");
  });
});

// Header goes solid once the hero has scrolled past, on pages that have one.
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
if (header && hero) {
  const onScroll = () => {
    header.classList.toggle("is-solid", window.scrollY > hero.offsetHeight - 80);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
} else if (header) {
  header.classList.add("is-solid");
}
