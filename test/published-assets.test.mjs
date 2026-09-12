import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

test("homepage assets published to Vercel contain their generated contents", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();
  const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
  const assetUrls = [
    ...markup.matchAll(/<(?:link|script|img)\b[^>]*?\b(?:href|src)="(\/[^\"]+)"/g),
  ]
    .map((match) => match[1])
    .filter((url) => /\.(?:css|js|png|svg|woff2?)(?:[?#]|$)/i.test(url));

  assert.ok(assetUrls.length > 0, "homepage should reference deployable assets");

  for (const assetUrl of new Set(assetUrls)) {
    const relativePath = assetUrl.split(/[?#]/, 1)[0].replace(/^\/+/, "");
    const assetPath = resolve(publicRoot, relativePath);
    const contents = await readFile(assetPath);
    assert.ok(contents.byteLength > 0, `${assetUrl} must not be empty`);
  }

  const stylesheet = await readFile(
    resolve(publicRoot, "_next/static/css/index.C91Two5O.css"),
    "utf8",
  );
  assert.match(stylesheet, /\.hero\s*\{/);
});
