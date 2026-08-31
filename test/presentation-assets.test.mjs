import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("team section uses its own founders image", () => {
  assert.equal(existsSync(new URL("../public/images/team-founders.png", import.meta.url)), true);
  assert.match(read("../server/_next/static/page-BESsBKlW.js"), /\/images\/team-founders\.png/);
});

test("entry screen exits after 2.5 seconds", () => {
  const entryScript = read("../public/_next/static/chunks/entry-experience-MYJmJGQ8.js");
  assert.match(entryScript, /n\?0:2e3/);
  assert.match(entryScript, /n\?0:2500/);
});
