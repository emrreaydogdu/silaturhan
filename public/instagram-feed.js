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

  function createNativeEmbed(card, permalink) {
    const frame = document.createElement("iframe");
    frame.className = "instagram-native-frame";
    frame.src = `${permalink.replace(/\/$/, "")}/embed/`;
    frame.title = `${card.querySelector(".instagram-preview-author")?.textContent ?? "Instagram"} Instagram Reels gönderisi`;
    frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

    card.classList.remove("instagram-preview-card");
    card.classList.add("instagram-native-embed-card");
    card.replaceChildren(frame);
  }

  async function processEmbeds() {
    const cards = [...document.querySelectorAll(previewSelector)];
    if (cards.length === 0) return;

    for (const card of cards) {
      const permalink = card.querySelector("[data-instagram-permalink]")?.dataset.instagramPermalink;
      const author = card.querySelector(".instagram-preview-author")?.textContent?.trim();
      if (!permalink) continue;

      if (author === "Sılasu Turhan") {
        createNativeEmbed(card, permalink);
      } else {
        createEmbed(card, permalink);
      }
    }

    try {
      await loadEmbedScript();
      window.instgrm?.Embeds?.process();
    } catch {
      // The in-blockquote link remains available if Instagram is unreachable.
    }
  }

  function placeInstagramBelowKinezyotherapy() {
    const section = document.querySelector(".instagram-section");
    const kinezyotherapy = document.querySelector(".kinezyo-section");
    if (section && kinezyotherapy && kinezyotherapy.nextElementSibling !== section) {
      kinezyotherapy.after(section);
    }
  }

  function start() {
    placeInstagramBelowKinezyotherapy();
    processEmbeds();

    if (document.body) {
      new MutationObserver(() => {
        placeInstagramBelowKinezyotherapy();
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
