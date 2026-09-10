// Nòa-Elle Floral Studio — shared behaviour. No libraries.

// Reveal images as they load (blur-up placeholders stay until the real file is in).
document.querySelectorAll("img[loading]").forEach((img) => {
  if (img.complete) {
    img.classList.add("is-loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  }
});

const items = document.querySelectorAll(".gallery-item");

// Signature feature: tap to reveal stem names on touch devices (hover covers the rest).
items.forEach((item) => {
  item.addEventListener("click", () => {
    if (matchMedia("(hover: hover)").matches) return;
    const wasActive = item.classList.contains("is-active");
    items.forEach((i) => i.classList.remove("is-active"));
    if (!wasActive) item.classList.add("is-active");
  });
});

// Mobile nav toggle.
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  const closeNav = () => {
    navToggle.closest(".site-header").classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", () => {
    const open = navToggle.closest(".site-header").classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

// Motion pass (MOTION.md): choreographed hero entrance, once JS confirms it can run.
requestAnimationFrame(() => document.body.classList.add("is-ready"));

// Background video: play unless the visitor prefers reduced motion (poster shows instead).
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const interludeVideo = document.querySelector(".interlude-media video");
  if (interludeVideo) interludeVideo.play().catch(() => {});
}

// Scroll reveals: fade + rise once, staggered by position among their siblings.
const revealTargets = document.querySelectorAll(".section-head, .catalog-card, .delivery-list li, .teaser-card");
if (revealTargets.length) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0 });
  revealTargets.forEach((el) => {
    el.style.setProperty("--i", Array.from(el.parentElement.children).indexOf(el));
    revealer.observe(el);
  });
}

// Catalog card hover-swap: first tap reveals the second photo on touch devices, second tap follows the link.
document.querySelectorAll(".catalog-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (matchMedia("(hover: hover)").matches || card.classList.contains("is-active")) return;
    e.preventDefault();
    document.querySelectorAll(".catalog-card.is-active").forEach((c) => c.classList.remove("is-active"));
    card.classList.add("is-active");
  });
});
