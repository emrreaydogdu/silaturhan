(() => {
  const toggle = document.querySelector("[data-experts-menu-toggle]");
  const header = document.querySelector(".site-header");
  const menu = document.querySelector("[data-experts-menu]");
  if (!toggle || !header || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.setAttribute("aria-label", expanded ? "Menüyü aç" : "Menüyü kapat");
    header.classList.toggle("menu-open", !expanded);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menüyü aç");
    header.classList.remove("menu-open");
  }));
})();
