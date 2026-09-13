(() => {
  const source = document.getElementById("blog-section-template");
  if (!(source instanceof HTMLScriptElement)) return;

  let markup = "";
  try {
    markup = JSON.parse(source.textContent || '""');
  } catch {
    return;
  }

  const placeBlogSection = () => {
    const faq = document.querySelector(".faq-section");
    if (!faq) return;

    let section = document.querySelector(".blog-section");
    if (!section) {
      const template = document.createElement("template");
      template.innerHTML = markup;
      section = template.content.firstElementChild;
    }
    if (!(section instanceof HTMLElement)) return;

    if (faq.nextElementSibling !== section) {
      faq.insertAdjacentElement("afterend", section);
    }
  };

  let pending = false;
  const schedulePlacement = () => {
    if (pending) return;
    pending = true;
    window.setTimeout(() => {
      pending = false;
      placeBlogSection();
    }, 0);
  };

  placeBlogSection();
  [80, 400, 1200].forEach((delay) => window.setTimeout(placeBlogSection, delay));
  new MutationObserver(schedulePlacement).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
