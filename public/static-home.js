(() => {
  const entry = document.querySelector(".entry-experience");
  const appointmentUrl = "https://wa.me/905516467462?text=Merhaba%20%F0%9F%91%8B%20Fizyoterapist%20S%C4%B1lasu%20Turhan%20i%C3%A7in%20randevu%20talebi%20olu%C5%9Fturmak%20istiyorum.";

  function finishEntry() {
    entry?.remove();
  }

  try {
    if (window.sessionStorage.getItem("silasu-entry-seen") === "true") {
      finishEntry();
    } else {
      window.sessionStorage.setItem("silasu-entry-seen", "true");
      window.setTimeout(() => entry?.classList.add("is-leaving"), 2600);
      window.setTimeout(finishEntry, 3200);
    }
  } catch {
    window.setTimeout(() => entry?.classList.add("is-leaving"), 2600);
    window.setTimeout(finishEntry, 3200);
  }

  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  menuToggle?.addEventListener("click", () => {
    const open = header?.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => header?.classList.remove("menu-open")));

  function requestAppointment(event) {
    event.preventDefault();
    window.location.assign(appointmentUrl);
  }

  document.querySelectorAll(".header-cta, .hero-actions .button.primary, .mobile-menu-cta").forEach((button) => {
    button.addEventListener("click", requestAppointment);
  });

  if (new URLSearchParams(window.location.search).has("randevu")) {
    window.location.replace(appointmentUrl);
  }
})();
