import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("navigation runtime keeps Makaleler and Uzmanlarımız after client rendering", async () => {
  const [script, ...pages] = await Promise.all([
    readFile(new URL("../public/navigation-unifier.js", import.meta.url), "utf8").catch(() => ""),
    ...["index", "blog", "multisport", "tilbe-meric", "uzmanlar"].map((name) => readFile(new URL(`../api/${name}.mjs`, import.meta.url), "utf8")),
  ]);

  assert.match(script, /Makaleler/);
  assert.match(script, /Uzmanlarımız/);
  assert.match(script, /\/uzmanlar/);
  assert.match(script, /\/#makaleler/);
  assert.doesNotMatch(script, /existing\.innerHTML\s*=/);
  assert.match(script, /if \(link\.innerHTML !== content\)/);
  assert.doesNotMatch(script, /MutationObserver/);
  assert.match(script, /window\.setTimeout\(normalizeAll, 900\)/);
  pages.forEach((page) => assert.match(page, /navigation-unifier\.js\?v=fast-3/));
});
