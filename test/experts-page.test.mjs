import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = async (path) => readFile(new URL(path, root), "utf8").catch(() => "");

test("Uzmanlarımız page introduces both physiotherapists and links to their profiles", async () => {
  const [page, styles, config, buildScript] = await Promise.all([
    source("api/uzmanlar.mjs"),
    source("public/uzmanlar.css"),
    source("vercel.json"),
    source("scripts/build-static.mjs"),
  ]);

  assert.match(config, /"source": "\/uzmanlar"/);
  assert.match(buildScript, /"uzmanlar"/);
  assert.match(page, /Uzmanlarımız/);
  assert.match(page, /\/images\/team\/silasu-turhan\.webp/);
  assert.match(page, /\/images\/team\/tilbe-meric\.webp/);
  assert.match(page, /href="\/uzm-fzt-silasu-arikan"/);
  assert.match(page, /href="\/fzt-tilbe-meric"/);
  assert.match(page, /Profili inceleyin/);
  assert.match(page, /class="desktop-nav"/);
  assert.match(page, /href="\/uzmanlar" aria-current="page">Uzmanlarımız/);
  assert.match(page, /universalContactCta/);
  assert.match(styles, /\.experts-grid/);
});
