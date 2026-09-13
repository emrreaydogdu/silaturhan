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
