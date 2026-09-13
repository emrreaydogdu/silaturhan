import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Vercel entry renders the homepage", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );

  assert.equal(response.status, 200);
  assert.match(await response.text(), /Fizyoterapist Sılasu Turhan/);
});

test("homepage publishes the branded browser metadata", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();

  assert.match(
    markup,
    /<title>Maltepe Fizyoterapi \| Sılasu Turhan & Tilbe Meriç<\/title>/,
  );
  assert.match(markup, /<link[^>]+rel="icon"[^>]+href="\/favicon\.svg"/);

  const favicon = await readFile(new URL("../public/favicon.svg", import.meta.url), "utf8");
  assert.match(favicon, /Fizyoterapistler Sılasu Turhan ve Tilbe Meriç/);
  assert.match(favicon, /M18 19h19/);
});
