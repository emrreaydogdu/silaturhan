const gallery = document.querySelector("[data-business-gallery]");
const lightbox = document.querySelector(".business-gallery-lightbox");

if (gallery && lightbox) {
  const triggers = [...gallery.querySelectorAll(".business-gallery-trigger")];
  const image = lightbox.querySelector(".business-gallery-lightbox-image");
  const caption = lightbox.querySelector(".business-gallery-lightbox-caption");
  const count = lightbox.querySelector(".business-gallery-lightbox-count");
  let activeIndex = 0;

  const showImage = (index) => {
    activeIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[activeIndex];
    const thumbnail = trigger.querySelector("img");
    image.src = thumbnail.currentSrc || thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = trigger.dataset.galleryCaption;
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")}`;
  };

  gallery.addEventListener("click", (event) => {
    const trigger = event.target.closest(".business-gallery-trigger");
    if (!trigger) return;

    showImage(Number(trigger.dataset.galleryIndex));
    lightbox.showModal();
  });

  lightbox.querySelector(".business-gallery-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".business-gallery-prev").addEventListener("click", () => showImage(activeIndex - 1));
  lightbox.querySelector(".business-gallery-next").addEventListener("click", () => showImage(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}
