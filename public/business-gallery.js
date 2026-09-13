import { businessGalleryMarkup } from "./business-gallery-data.js";

function ensureBusinessGallery() {
  if (window.location.pathname !== "/") return;

  let section = document.querySelector("#isletmemizden-kareler");
  const introduction = document.querySelector(".intro-strip");
  if (!section && introduction) {
    introduction.insertAdjacentHTML("afterend", businessGalleryMarkup);
    section = document.querySelector("#isletmemizden-kareler");
  }

  if (section && !document.querySelector(".business-gallery-lightbox")) {
    section.insertAdjacentHTML(
      "afterend",
      businessGalleryMarkup.slice(businessGalleryMarkup.indexOf("<dialog")),
    );
  }
}

let activeIndex = 0;

function showImage(index) {
  const triggers = [...document.querySelectorAll(".business-gallery-trigger")];
  const lightbox = document.querySelector(".business-gallery-lightbox");
  if (!triggers.length || !lightbox) return;

  activeIndex = (index + triggers.length) % triggers.length;
  const trigger = triggers[activeIndex];
  const thumbnail = trigger.querySelector("img");
  const image = lightbox.querySelector(".business-gallery-lightbox-image");
  image.src = thumbnail.currentSrc || thumbnail.src;
  image.alt = thumbnail.alt;
  lightbox.querySelector(".business-gallery-lightbox-caption").textContent =
    trigger.dataset.galleryCaption;
  lightbox.querySelector(".business-gallery-lightbox-count").textContent =
    `${String(activeIndex + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")}`;
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const lightbox = document.querySelector(".business-gallery-lightbox");
  const trigger = target?.closest(".business-gallery-trigger");
  if (trigger && lightbox) {
    showImage(Number(trigger.dataset.galleryIndex));
    lightbox.showModal();
    return;
  }

  if (target?.closest(".business-gallery-close")) {
    lightbox?.close();
  } else if (target?.closest(".business-gallery-prev")) {
    showImage(activeIndex - 1);
  } else if (target?.closest(".business-gallery-next")) {
    showImage(activeIndex + 1);
  } else if (event.target === lightbox) {
    lightbox.close();
  }
});

function observeGallery() {
  ensureBusinessGallery();
  if (!document.body || document.body.dataset.businessGalleryObserver) return;

  document.body.dataset.businessGalleryObserver = "true";
  new MutationObserver(ensureBusinessGallery).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeGallery, { once: true });
} else {
  observeGallery();
}
