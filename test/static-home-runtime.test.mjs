import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static homepage does not boot the unavailable RSC client runtime", async () => {
  const [page, runtime, builder] = await Promise.all([
    readFile(new URL("../dist/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/static-home.js", import.meta.url), "utf8").catch(() => ""),
    readFile(new URL("../scripts/build-static.mjs", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /<script[^>]+src="\/_next\/static\/chunks\//);
  assert.doesNotMatch(page, /rel="modulepreload"/);
  assert.doesNotMatch(page, /vinext\.navigationRuntime/);
  assert.match(page, /static-home\.js/);
  assert.match(runtime, /entry-experience/);
  assert.match(runtime, /sessionStorage/);
  assert.match(builder, /stripClientHydration/);
});
