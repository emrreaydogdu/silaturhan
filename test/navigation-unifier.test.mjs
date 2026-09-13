import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("navigation runtime keeps Makaleler and Uzmanlarımız after client rendering", async () => {
  const script = await readFile(new URL("../public/navigation-unifier.js", import.meta.url), "utf8").catch(() => "");

  assert.match(script, /Makaleler/);
  assert.match(script, /Uzmanlarımız/);
  assert.match(script, /\/uzmanlar/);
  assert.match(script, /MutationObserver/);
});
