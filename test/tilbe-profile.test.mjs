import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Tilbe Meriç has a dedicated profile page with her portrait and expertise areas", async () => {
  const [page, config, buildScript] = await Promise.all([
    readFile(new URL("../api/tilbe-meric.mjs", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/build-static.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Fizyoterapist Tilbe Meriç \| Maltepe Fizyoterapi/);
  assert.match(page, /\/images\/team\/tilbe-meric\.webp/);
  assert.match(page, /Uzmanlık alanları/);
  assert.match(page, /Kinezyoterapi/);
  assert.match(page, /href="\/\?randevu=1"/);
  assert.match(config, /"source": "\/fzt-tilbe-meric"/);
  assert.match(buildScript, /"fzt-tilbe-meric"/);
});

test("Sılasu Arıkan's profile uses her own portrait", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(new Request("https://example.com/uzm-fzt-silasu-arikan"));
  const markup = await response.text();

  assert.match(markup, /\/images\/team\/silasu-turhan\.webp/);
  assert.match(markup, /Uzm\. Fzt\. Sılasu Arıkan \| Maltepe Fizyoterapi/);
});
