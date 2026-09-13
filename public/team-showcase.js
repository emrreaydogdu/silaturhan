import { teamShowcaseMarkup } from "./team-showcase-data.js";

function ensureTeamShowcase() {
  if (window.location.pathname !== "/") return;

  let section = document.querySelector(".team-section");
  if (section && !section.matches("[data-team-showcase]")) {
    section.outerHTML = teamShowcaseMarkup;
    section = document.querySelector("[data-team-showcase]");
  }

  const kinezyotherapy = document.querySelector(".kinezyo-section");
  if (section && kinezyotherapy && kinezyotherapy.previousElementSibling !== section) {
    kinezyotherapy.before(section);
  }
}

function observeTeamShowcase() {
  ensureTeamShowcase();
  if (!document.body || document.body.dataset.teamShowcaseObserver) return;

  document.body.dataset.teamShowcaseObserver = "true";
  new MutationObserver(ensureTeamShowcase).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeTeamShowcase, { once: true });
} else {
  observeTeamShowcase();
}
