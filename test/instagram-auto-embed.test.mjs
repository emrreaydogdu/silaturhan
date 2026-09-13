import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

test("Instagram embeds start automatically for every post on page entry", async () => {
  const source = await readFile(new URL("../public/instagram-feed.js", import.meta.url), "utf8");
  const cards = Array.from({ length: 6 }, (_, index) => {
    const classes = new Set(["instagram-preview-card"]);
    return {
      classList: {
        add: (value) => classes.add(value),
        remove: (value) => classes.delete(value),
        contains: (value) => classes.has(value),
      },
      button: { dataset: { instagramPermalink: `https://www.instagram.com/reel/test-${index}/` } },
      querySelector(selector) {
        if (selector === "[data-instagram-permalink]") return this.button;
        if (selector === ".instagram-preview-author") return { textContent: index < 3 ? "Sılasu Turhan" : "Tilbe Meriç" };
        return null;
      },
      replaceChildren(child) {
        this.child = child;
      },
    };
  });
  const loadedScripts = [];
  const document = {
    readyState: "complete",
    querySelectorAll(selector) {
      return selector === ".instagram-preview-card"
        ? cards.filter((card) => card.classList.contains("instagram-preview-card"))
        : [];
    },
    querySelector: () => null,
    createElement(tagName) {
      return {
        tagName,
        dataset: {},
        attributes: {},
        addEventListener() {},
        append() {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      };
    },
    head: {
      append(script) {
        loadedScripts.push(script);
      },
    },
  };

  runInNewContext(source, {
    document,
    window: {},
    MutationObserver: class { observe() {} },
    Promise,
  });

  const silaCards = cards.slice(0, 3);
  const tilbeCards = cards.slice(3);
  assert.equal(silaCards.filter((card) => card.classList.contains("instagram-curated-card")).length, 3);
  assert.ok(silaCards.every((card) => !card.child));
  assert.equal(tilbeCards.filter((card) => card.classList.contains("instagram-embed-card")).length, 3);
  assert.ok(tilbeCards.every((card) => card.child.className === "instagram-media"));
  assert.ok(tilbeCards.every((card) => card.child.dataset.instgrmPermalink.startsWith("https://www.instagram.com/reel/")));
  assert.equal(loadedScripts.length, 1);
  assert.equal(loadedScripts[0].src, "https://www.instagram.com/embed.js");
});
