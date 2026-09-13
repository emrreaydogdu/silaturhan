(() => {
  const logoUrl = "https://images.seeklogo.com/logo-png/55/1/multisport-logo-png_seeklogo-557663.png";
  const multisportNavigationLink = () => {
    const link = document.createElement("a");
    link.href = "/multisport";
    link.textContent = "MultiSport";
    link.dataset.multisportMenuLink = "true";
    return link;
  };

  function ensureMultiSportNavigation() {
    for (const selector of [".desktop-nav", ".mobile-menu"]) {
      const navigation = document.querySelector(selector);
      if (!navigation || navigation.querySelector("[data-multisport-menu-link]")) continue;

      const link = multisportNavigationLink();
      if (selector === ".mobile-menu") {
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        link.append(arrow);
      }
      const contactLink = navigation.querySelector('a[href="/#iletisim"]');
      navigation.insertBefore(link, contactLink ?? null);
    }
  }

  function ensureHomePromotion() {
    if (window.location.pathname !== "/" && window.location.pathname !== "/uzm-fzt-silasu-arikan") return;
    if (document.querySelector(".multisport-home-promo")) return;

    const services = document.querySelector(".services-section");
    if (!services) return;

    const promotion = document.createElement("section");
    promotion.className = "multisport-home-promo";
    promotion.setAttribute("aria-labelledby", "multisport-home-promo-title");
    promotion.innerHTML = `
      <a class="multisport-home-promo-logo" href="/multisport" aria-label="MultiSport üyelik avantajlarını incele">
        <img src="${logoUrl}" alt="MultiSport" width="118" height="64" loading="lazy" decoding="async" />
      </a>
      <div class="multisport-home-promo-copy">
        <p class="eyebrow">İŞ ORTAĞIMIZ</p>
        <h2 id="multisport-home-promo-title">MultiSport üyelerine özel <em>hareket avantajları.</em></h2>
        <p>MultiSport anlaşmamızla, üyeliğinize uygun uygulama ve indirim seçeneklerini keşfedin.</p>
      </div>
      <a class="multisport-home-promo-cta" href="/multisport">Üyelik avantajlarını incele <span aria-hidden="true">↗</span></a>
    `;
    const gallery = document.querySelector(".business-gallery-section");
    (gallery ?? services).insertAdjacentElement("afterend", promotion);
  }

  function ensureOsteopathyAppointmentOption() {
    const serviceSelect = document.querySelector(".booking-fields select");
    if (!serviceSelect) return;
    if ([...serviceSelect.options].some((option) => option.value === "Osteopati")) return;

    const option = document.createElement("option");
    option.value = "Osteopati";
    option.textContent = "Osteopati";
    serviceSelect.append(option);
  }

  function mountEnhancements() {
    ensureMultiSportNavigation();
    ensureHomePromotion();

    if (document.body && !document.body.dataset.siteEnhancementObserver) {
      document.body.dataset.siteEnhancementObserver = "true";
      new MutationObserver(() => {
        ensureMultiSportNavigation();
        ensureHomePromotion();
        ensureOsteopathyAppointmentOption();
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountEnhancements, { once: true });
  } else {
    mountEnhancements();
  }
})();
