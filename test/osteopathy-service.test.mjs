import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { render } from "../api/index.mjs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("osteopathy is listed as a homepage service", async () => {
  const response = await render(new Request("https://example.com/"));
  const homepage = await response.text();

  assert.match(homepage, /data-osteopathy-service[\s\S]*?<h3[^>]*>Osteopati<\/h3>/);
});

test("appointment enhancement adds Osteopati to the service selector", () => {
  const enhancements = read("../public/site-enhancements.js");

  assert.match(enhancements, /\.booking-fields select/);
  assert.match(enhancements, /option\.textContent = "Osteopati"/);
});
