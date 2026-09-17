(() => {
  const entry = document.querySelector(".entry-experience");
  const getAppointmentUrl = () => {
    const isTilbe = Math.random() < 0.5;
    const phone = isTilbe ? "905518418880" : "905516467462";
    const name = isTilbe ? "Tilbe%20Meri%C3%A7" : "S%C4%B1lasu%20Turhan";
    return `https://wa.me/${phone}?text=Merhaba%20%F0%9F%91%8B%20Fizyoterapist%20${name}%20i%C3%A7in%20randevu%20talebi%20olu%C5%9Fturmak%20istiyorum.`;
  };

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
    window.location.assign(getAppointmentUrl());
  }

  document.querySelectorAll(".header-cta, .hero-actions .button.primary, .mobile-menu-cta").forEach((button) => {
    button.addEventListener("click", requestAppointment);
  });

  if (new URLSearchParams(window.location.search).has("randevu")) {
    window.location.replace(getAppointmentUrl());
  }
})();
