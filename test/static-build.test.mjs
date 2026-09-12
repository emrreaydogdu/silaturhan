import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("static build exports the homepage, MultiSport page, and runtime assets", async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), "turhanmeric-static-"));
  try {
    const buildScript = fileURLToPath(
      new URL("../scripts/build-static.mjs", import.meta.url),
    );
    const build = spawnSync(process.execPath, [buildScript], {
      encoding: "utf8",
      env: { ...process.env, SITE_OUTPUT_DIR: outputDirectory },
    });

    assert.equal(build.status, 0, build.stderr || build.stdout);

    const [home, multisport, instagramScript] = await Promise.all([
      readFile(join(outputDirectory, "index.html"), "utf8"),
      readFile(join(outputDirectory, "multisport", "index.html"), "utf8"),
      stat(join(outputDirectory, "instagram-feed.js")),
    ]);

    assert.match(home, /Fizyoterapist Sılasu Turhan/);
    assert.match(home, /instagram-section/);
    assert.doesNotMatch(home, /instagram\.com\/embed\.js/);
    assert.match(multisport, /MultiSport üyeliğinizle/);
    assert.ok(instagramScript.size > 0);
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
