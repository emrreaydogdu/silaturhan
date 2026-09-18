import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../data");

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

function readJson(filename, fallback) {
  const filePath = resolve(dataDir, filename);
  try {
    if (!existsSync(filePath)) return fallback;
    const raw = readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeJson(filename, data) {
  const filePath = resolve(dataDir, filename);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function syncGalleryDataFile() {
  const gallery = getGallery();
  const galleryPhotos = gallery.map((item) => item.caption);
  const escapeHtml = (val) =>
    String(val || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const triggers = gallery
    .map((item, index) => {
      return `<button class="business-gallery-trigger" type="button" data-gallery-index="${index}" data-gallery-caption="${escapeHtml(item.caption)}"><img src="${item.image}" alt="${escapeHtml(item.caption)}" loading="lazy" decoding="async"/><span class="business-gallery-expand" aria-hidden="true">↗</span></button>`;
    })
    .join("");

  const content = `export const galleryPhotos = ${JSON.stringify(galleryPhotos, null, 2)};\n\nexport const businessGalleryMarkup = \`<section class="business-gallery-section" id="isletmemizden-kareler" aria-labelledby="business-gallery-title"><div class="business-gallery-inner"><div class="business-gallery-heading"><p class="business-gallery-eyebrow"><span></span> KLİNİĞİMİZDEN</p><div><h2 id="business-gallery-title">İşletmemizden <em>kareler</em></h2><p>Hareketi ve iyilik hâlini destekleyen alanlarımızı yakından tanıyın.</p></div></div><div class="business-gallery-grid" data-business-gallery>${triggers}</div></div></section><dialog class="business-gallery-lightbox" aria-labelledby="business-gallery-lightbox-caption"><div class="business-gallery-lightbox-toolbar"><span class="business-gallery-lightbox-count" aria-live="polite"></span><button class="business-gallery-close" type="button" aria-label="Galeriyi kapat">×</button></div><div class="business-gallery-lightbox-stage"><button class="business-gallery-nav business-gallery-prev" type="button" aria-label="Önceki görsel">‹</button><img class="business-gallery-lightbox-image" alt=""/><button class="business-gallery-nav business-gallery-next" type="button" aria-label="Sonraki görsel">›</button></div><p class="business-gallery-lightbox-caption" id="business-gallery-lightbox-caption"></p></dialog>\`;\n`;

  const targetPath = resolve(__dirname, "../public/business-gallery-data.js");
  writeFileSync(targetPath, content, "utf8");
}

export function getGallery() {
  return readJson("gallery.json", []);
}

export function saveGallery(data) {
  if (!Array.isArray(data)) throw new Error("Gallery data must be an array");
  writeJson("gallery.json", data);
  syncGalleryDataFile();
  return data;
}

export function getArticles() {
  return readJson("articles.json", []);
}

export function saveArticles(data) {
  if (!Array.isArray(data)) throw new Error("Articles data must be an array");
  writeJson("articles.json", data);
  return data;
}

export function getExperts() {
  const experts = readJson("experts.json", {});
  if (experts && typeof experts === "object") {
    if (experts.silasu && (!experts.silasu.profileUrl || experts.silasu.profileUrl === "/fzt-silasu")) {
      experts.silasu.profileUrl = "/uzm-fzt-silasu-arikan";
    }
    if (experts.tilbe && (!experts.tilbe.profileUrl || experts.tilbe.profileUrl === "/fzt-tilbe")) {
      experts.tilbe.profileUrl = "/fzt-tilbe-meric";
    }
  }
  return experts;
}

export function saveExperts(data) {
  if (typeof data !== "object" || data === null) throw new Error("Experts data must be an object");
  writeJson("experts.json", data);
  return data;
}

export function getInstagram() {
  return readJson("instagram.json", { silasu: [], tilbe: [] });
}

export function saveInstagram(data) {
  if (typeof data !== "object" || data === null) throw new Error("Instagram data must be an object");
  writeJson("instagram.json", data);
  return data;
}

export function getAllData() {
  return {
    gallery: getGallery(),
    articles: getArticles(),
    experts: getExperts(),
    instagram: getInstagram(),
  };
}
