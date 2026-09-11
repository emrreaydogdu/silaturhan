import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("site branding credits both physiotherapists", async () => {
  const [publicHeader, ssrHeader, publicEntry, ssrEntry] = await Promise.all([
    source("public/_next/static/chunks/site-chrome-B6pmjcOc.js"),
    source("server/ssr/_next/static/site-chrome-CbUK7VMH.js"),
    source("public/_next/static/chunks/entry-experience-MYJmJGQ8.js"),
    source("server/ssr/_next/static/entry-experience-B9zn_QfN.js"),
  ]);

  for (const header of [publicHeader, ssrHeader]) {
    assert.match(header, /Sılasu Turhan · Tilbe Meriç/);
    assert.match(header, /Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa/);
  }

  for (const entry of [publicEntry, ssrEntry]) {
    assert.match(entry, /Fizyoterapistler/);
    assert.match(entry, /Sılasu Turhan/);
    assert.match(entry, /Tilbe Meriç/);
  }
});
