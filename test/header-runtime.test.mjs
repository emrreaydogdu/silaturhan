import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every page source loads the shared, interactive header runtime", async () => {
  const [runtime, ...pages] = await Promise.all([
    readFile(new URL("../public/header-runtime.js", import.meta.url), "utf8").catch(() => ""),
    ...["index", "blog", "multisport", "tilbe-meric", "uzmanlar"].map((name) => readFile(new URL(`../api/${name}.mjs`, import.meta.url), "utf8")),
  ]);

  pages.forEach((page) => assert.match(page, /header-runtime\.js\?v=header-2/));
  assert.match(runtime, /menu-toggle/);
  assert.match(runtime, /menu-open/);
  assert.match(runtime, /Uzmanlarımız/);
  assert.match(runtime, /Makaleler/);
  assert.match(runtime, /is-scrolled/);
});
