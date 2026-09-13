import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("every static page loads the shared, interactive header runtime", async () => {
  const [builder, runtime] = await Promise.all([
    readFile(new URL("../scripts/build-static.mjs", import.meta.url), "utf8"),
    readFile(new URL("../public/header-runtime.js", import.meta.url), "utf8").catch(() => ""),
  ]);

  assert.match(builder, /header-runtime\.js\?v=header-1/);
  assert.match(runtime, /menu-toggle/);
  assert.match(runtime, /menu-open/);
  assert.match(runtime, /Uzmanlarımız/);
  assert.match(runtime, /Makaleler/);
  assert.match(runtime, /is-scrolled/);
});
