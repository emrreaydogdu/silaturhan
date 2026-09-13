import { teamShowcaseMarkup } from "./team-showcase-data.js";

function ensureTeamShowcase() {
  if (window.location.pathname !== "/") return;

  const section = document.querySelector(".team-section");
  if (section && !section.matches("[data-team-showcase]")) {
    section.outerHTML = teamShowcaseMarkup;
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
