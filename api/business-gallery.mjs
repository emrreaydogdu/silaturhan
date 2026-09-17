import { getGallery } from "../server/data-store.mjs";

export function renderBusinessGallery(gallery = getGallery()) {
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

  return `<section class="business-gallery-section" id="isletmemizden-kareler" aria-labelledby="business-gallery-title"><div class="business-gallery-inner"><div class="business-gallery-heading"><p class="business-gallery-eyebrow"><span></span> KLİNİĞİMİZDEN</p><div><h2 id="business-gallery-title">İşletmemizden <em>kareler</em></h2><p>Hareketi ve iyilik hâlini destekleyen alanlarımızı yakından tanıyın.</p></div></div><div class="business-gallery-grid" data-business-gallery>${triggers}</div></div></section><dialog class="business-gallery-lightbox" aria-labelledby="business-gallery-lightbox-caption"><div class="business-gallery-lightbox-toolbar"><span class="business-gallery-lightbox-count" aria-live="polite"></span><button class="business-gallery-close" type="button" aria-label="Galeriyi kapat">×</button></div><div class="business-gallery-lightbox-stage"><button class="business-gallery-nav business-gallery-prev" type="button" aria-label="Önceki görsel">‹</button><img class="business-gallery-lightbox-image" alt=""/><button class="business-gallery-nav business-gallery-next" type="button" aria-label="Sonraki görsel">›</button></div><p class="business-gallery-lightbox-caption" id="business-gallery-lightbox-caption"></p></dialog>`;
}

export const businessGalleryMarkup = renderBusinessGallery();
