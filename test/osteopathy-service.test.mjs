import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { render } from "../api/index.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("osteopathy is listed as a homepage service", async () => {
  const response = await render(new Request("https://example.com/"));
  const homepage = await response.text();
  const osteopathyIndex = homepage.indexOf("data-osteopathy-service");

  assert.match(homepage, /data-osteopathy-service[\s\S]*?<h3[^>]*>Osteopati<\/h3>/);
  assert.ok(homepage.indexOf("Ortopedik Rehabilitasyon") < osteopathyIndex);
  assert.ok(osteopathyIndex < homepage.indexOf("Manuel Terapi"));
});

test("MultiSport appears in both homepage navigation menus before hydration", async () => {
  const response = await render(new Request("https://example.com/"));
  const homepage = await response.text();

  assert.equal((homepage.match(/data-multisport-menu-link/g) ?? []).length, 2);
  assert.match(homepage, /desktop-nav[\s\S]*?data-multisport-menu-link[^>]*>MultiSport/);
  assert.match(homepage, /mobile-menu[\s\S]*?data-multisport-menu-link[^>]*>MultiSport/);
});

test("appointment enhancement adds Osteopati to the service selector", () => {
  const enhancements = read("../public/site-enhancements.js");

  assert.match(enhancements, /\.booking-fields select/);
  assert.match(enhancements, /option\.textContent = "Osteopati"/);
});
