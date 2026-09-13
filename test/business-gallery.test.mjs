import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const assetRoot = new URL("../public/images/business-gallery/", import.meta.url);

test("homepage renders all clinic photos in a responsive, accessible gallery", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();

  assert.match(markup, /class="business-gallery-section"/);
  assert.match(markup, /İşletmemizden/);
  assert.match(markup, /aria-labelledby="business-gallery-title"/);
  assert.match(markup, /class="instagram-section"/);
  assert.ok(markup.indexOf('class="services-section"') < markup.indexOf('class="business-gallery-section"'));
  assert.ok(markup.indexOf('class="business-gallery-section"') < markup.indexOf('class="instagram-section"'));
  assert.equal((markup.match(/class="business-gallery-trigger/g) ?? []).length, 13);
  assert.match(markup, /loading="lazy"/);
  assert.match(markup, /<dialog[^>]*class="business-gallery-lightbox"/);
  assert.match(markup, /href="\/business-gallery\.css"/);
  assert.match(markup, /src="\/business-gallery\.js"/);
});

test("optimized gallery photos are available as WebP assets", async () => {
  const assets = await Promise.all(
    Array.from({ length: 13 }, (_, index) =>
      stat(new URL(`${String(index + 1).padStart(2, "0")}.webp`, assetRoot)),
    ),
  );

  assert.equal(assets.length, 13);
  assert.ok(assets.every((asset) => asset.size > 0 && asset.size < 700_000));
});

test("static build includes the gallery runtime and image assets", async () => {
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { spawnSync } = await import("node:child_process");
  const { fileURLToPath } = await import("node:url");
  const outputDirectory = await mkdtemp(join(tmpdir(), "turhanmeric-gallery-"));

  try {
    const buildScript = fileURLToPath(new URL("../scripts/build-static.mjs", import.meta.url));
    const build = spawnSync(process.execPath, [buildScript], {
      encoding: "utf8",
      env: { ...process.env, SITE_OUTPUT_DIR: outputDirectory },
    });
    assert.equal(build.status, 0, build.stderr || build.stdout);

    const home = await readFile(join(outputDirectory, "index.html"), "utf8");
    assert.match(home, /business-gallery-section/);
    assert.ok((await stat(join(outputDirectory, "business-gallery.js"))).size > 0);
    assert.ok((await stat(join(outputDirectory, "business-gallery.css"))).size > 0);
    assert.ok((await stat(join(outputDirectory, "images", "business-gallery", "01.webp"))).size > 0);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
