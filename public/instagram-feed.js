(() => {
  const previewSelector = ".instagram-preview-card";
  const embedScriptUrl = "https://www.instagram.com/embed.js";
  let embedScriptPromise;

  function loadEmbedScript() {
    if (window.instgrm?.Embeds) return Promise.resolve();
    if (embedScriptPromise) return embedScriptPromise;

    embedScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${embedScriptUrl}"]`);
      const script = existingScript ?? document.createElement("script");
      script.async = true;
      script.src = embedScriptUrl;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      if (!existingScript) document.head.append(script);
    });

    return embedScriptPromise;
  }

  function createEmbed(card, permalink) {
    const quote = document.createElement("blockquote");
    quote.className = "instagram-media";
    quote.dataset.instgrmPermalink = permalink;
    quote.dataset.instgrmVersion = "14";
    quote.setAttribute("aria-label", `${card.querySelector(".instagram-preview-author")?.textContent ?? "Instagram"} Instagram gönderisi`);

    const fallback = document.createElement("a");
    fallback.className = "instagram-embed-fallback";
    fallback.href = permalink;
    fallback.target = "_blank";
    fallback.rel = "noreferrer";
    fallback.textContent = "Instagram gönderisini görüntüle";
    quote.append(fallback);

    card.classList.remove("instagram-preview-card");
    card.classList.add("instagram-embed-card");
    card.replaceChildren(quote);
  }

  async function processEmbeds() {
    const cards = [...document.querySelectorAll(previewSelector)];
    if (cards.length === 0) return;

    for (const card of cards) {
      const permalink = card.querySelector("[data-instagram-permalink]")?.dataset.instagramPermalink;
      if (permalink) createEmbed(card, permalink);
    }

    try {
      await loadEmbedScript();
      window.instgrm?.Embeds?.process();
    } catch {
      // The in-blockquote link remains available if Instagram is unreachable.
    }
  }

  function placeInstagramAboveHowItWorks() {
    const section = document.querySelector(".instagram-section");
    const howItWorks = document.querySelector(".kinezyo-flow");
    if (section && howItWorks && howItWorks.previousElementSibling !== section) {
      howItWorks.before(section);
    }
  }

  function start() {
    placeInstagramAboveHowItWorks();
    processEmbeds();

    if (document.body) {
      new MutationObserver(() => {
        placeInstagramAboveHowItWorks();
        processEmbeds();
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
