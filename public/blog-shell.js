(() => {
  const header = document.querySelector(".site-header");
  document.querySelectorAll("[data-blog-appointment]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.assign("/?randevu=1");
    });
  });
})();
