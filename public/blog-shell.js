(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-blog-menu-toggle]");

  toggle?.addEventListener("click", () => {
    const isOpen = header?.classList.toggle("menu-open") ?? false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
  });

  document.querySelectorAll("[data-blog-menu] a").forEach((link) => {
    link.addEventListener("click", () => header?.classList.remove("menu-open"));
  });

  document.querySelectorAll("[data-blog-appointment]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.assign("/?randevu=1");
    });
  });
})();
