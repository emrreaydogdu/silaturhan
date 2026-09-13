(() => {
  const track = document.querySelector("[data-blog-track]");
  if (!track) return;

  document.querySelectorAll("[data-blog-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.blogDirection === "next" ? 1 : -1;
      track.scrollBy({
        left: direction * Math.max(track.clientWidth * 0.86, 280),
        behavior: "smooth",
      });
    });
  });
})();
