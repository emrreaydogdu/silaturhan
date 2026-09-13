(() => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-blog-direction]");
    if (!button) return;

    const track = button.closest(".blog-section")?.querySelector("[data-blog-track]");
    if (!track) return;

    const direction = button.dataset.blogDirection === "next" ? 1 : -1;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.86, 280),
      behavior: "smooth",
    });
  });
})();
