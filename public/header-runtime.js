(() => {
  const links = [
    ["/#hizmetler", "Hizmetler"],
    ["/#yaklasim", "Yaklaşımımız"],
    ["/uzmanlar", "Uzmanlarımız"],
    ["/multisport", "MultiSport"],
    ["/blog/", "Makaleler"],
    ["/#iletisim", "İletişim"],
  ];
  const menuIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
  const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"></path><path d="M18 6 6 18"></path></svg>';

  function normalizeNavigation(navigation) {
    const mobile = navigation.classList.contains("mobile-menu");
    const known = new Map([...navigation.querySelectorAll("a[href]")].map((link) => [link.getAttribute("href"), link]));
    const contact = known.get("/#iletisim");

    links.forEach(([href, label]) => {
      const fallback = href === "/uzmanlar" ? known.get("/uzm-fzt-silasu-arikan") : href === "/blog/" ? known.get("/#makaleler") : null;
      const link = known.get(href) ?? fallback ?? document.createElement("a");
      link.href = href;
      link.innerHTML = `${label}${mobile ? '<span aria-hidden="true">↗</span>' : ""}`;
      link.toggleAttribute("aria-current", new URL(link.href, window.location.origin).pathname === window.location.pathname);
      if (!link.isConnected) navigation.insertBefore(link, contact ?? null);
    });
  }

  function setMenuState(header, toggle, isOpen) {
    header.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    toggle.innerHTML = isOpen ? closeIcon : menuIcon;
  }

  function mountHeader(header) {
    if (header.dataset.sharedHeaderMounted === "true") return;
    header.dataset.sharedHeaderMounted = "true";
    header.querySelectorAll(".desktop-nav, .mobile-menu").forEach(normalizeNavigation);

    const actions = header.querySelector(".header-actions");
    if (!actions) return;
    let toggle = actions.querySelector(".menu-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "menu-toggle";
      toggle.type = "button";
      actions.append(toggle);
    }
    setMenuState(header, toggle, false);
    toggle.addEventListener("click", () => setMenuState(header, toggle, !header.classList.contains("menu-open")));
    header.querySelectorAll(".mobile-menu a, .mobile-menu-cta").forEach((link) => {
      link.addEventListener("click", () => setMenuState(header, toggle, false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(header, toggle, false);
    });
    const updateScrollState = () => header.classList.toggle("is-scrolled", window.scrollY > 72);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
  }

  function mount() {
    document.querySelectorAll(".site-header").forEach(mountHeader);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
