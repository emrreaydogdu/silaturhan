(() => {
  const arrow = '<span aria-hidden="true">↗</span>';
  const standardLinks = [
    ["/#hizmetler", "Hizmetler"],
    ["/#yaklasim", "Yaklaşımımız"],
    ["/uzmanlar", "Uzmanlarımız"],
    ["/multisport", "MultiSport"],
    ["/blog/", "Makaleler"],
    ["/#iletisim", "İletişim"],
  ];

  function applyNavigation(navigation) {
    const isMobile = navigation.classList.contains("mobile-menu");
    const linksByPath = new Map([...navigation.querySelectorAll("a[href]")].map((link) => [link.getAttribute("href"), link]));
    const contact = linksByPath.get("/#iletisim");

    standardLinks.forEach(([href, label]) => {
      const legacyExpert = href === "/uzmanlar" ? linksByPath.get("/uzm-fzt-silasu-arikan") : null;
      const existing = linksByPath.get(href) ?? legacyExpert;
      if (existing) {
        existing.setAttribute("href", href);
        if (href === "/uzmanlar" || href === "/blog/") {
          existing.innerHTML = `${label}${isMobile ? arrow : ""}`;
        }
        return;
      }

      const link = document.createElement("a");
      link.href = href;
      link.innerHTML = `${label}${isMobile ? arrow : ""}`;
      navigation.insertBefore(link, contact ?? null);
    });
  }

  function normalizeAll() {
    document.querySelectorAll(".desktop-nav, .mobile-menu").forEach(applyNavigation);
  }

  normalizeAll();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      normalizeAll();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
