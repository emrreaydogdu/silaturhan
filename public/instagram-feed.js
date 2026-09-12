const embedScriptUrl = "https://www.instagram.com/embed.js";
let embedScriptPromise;

function loadInstagramEmbedScript() {
  if (window.instgrm?.Embeds) return Promise.resolve();
  if (embedScriptPromise) return embedScriptPromise;

  embedScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = embedScriptUrl;
    script.onload = resolve;
    script.onerror = () => {
      embedScriptPromise = undefined;
      reject(new Error("Instagram embed script failed to load"));
    };
    document.head.append(script);
  });

  return embedScriptPromise;
}

function showInstagramFallback(card, permalink) {
  const link = document.createElement("a");
  link.className = "instagram-embed-fallback";
  link.href = permalink;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Gönderi yüklenemedi. Instagram’da görüntüle";
  card.replaceChildren(link);
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".instagram-load-button[data-instagram-permalink]");
  if (!button) return;

  event.preventDefault();
  const card = button.closest(".instagram-preview-card");
  const permalink = button.dataset.instagramPermalink;
  if (!card || !permalink || card.dataset.instagramLoading === "true") return;

  card.dataset.instagramLoading = "true";
  card.classList.add("is-embedded");
  card.setAttribute("aria-busy", "true");

  const quote = document.createElement("blockquote");
  quote.className = "instagram-media";
  quote.dataset.instgrmPermalink = permalink;
  quote.dataset.instgrmVersion = "14";
  quote.style.cssText = "background:#fff;border:0;border-radius:1rem;margin:0 auto;max-width:100%;min-width:0;padding:0;width:100%";
  card.replaceChildren(quote);

  try {
    await loadInstagramEmbedScript();
    window.instgrm.Embeds.process();
  } catch {
    showInstagramFallback(card, permalink);
  } finally {
    delete card.dataset.instagramLoading;
    card.removeAttribute("aria-busy");
  }
});
