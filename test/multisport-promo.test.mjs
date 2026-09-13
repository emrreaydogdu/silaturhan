import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("homepage loads the MultiSport promotion and its responsive assets", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const [markup, script, styles] = await Promise.all([
    response.text(),
    source("public/site-enhancements.js"),
    source("public/multisport-promo.css"),
  ]);

  assert.match(markup, /href="\/multisport-promo\.css"/);
  assert.match(markup, /src="\/site-enhancements\.js"/);
  assert.match(script, /promotion\.className = "multisport-home-promo"/);
  assert.match(script, /MultiSport/);
  assert.match(script, /multisport-logo-png/);
  assert.match(script, /Üyelik avantajlarını incele/);
  assert.match(script, /desktop-nav/);
  assert.match(script, /mobile-menu/);
  assert.match(script, /services-section/);
  assert.match(script, /business-gallery-section/);
  assert.match(styles, /\.multisport-home-promo/);
  assert.match(styles, /@media\s*\(max-width:\s*700px\)/);
});
