import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("homepage introduces both physiotherapists in the redesigned team section", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(new Request("https://example.com/"));
  const markup = await response.text();
  const runtime = read("../public/team-showcase.js");

  assert.match(markup, /class="team-section team-showcase"/);
  assert.match(markup, /Sılasu Arıkan Turhan/);
  assert.match(markup, /Tilbe Meriç/);
  assert.equal((markup.match(/class="team-showcase-person/g) ?? []).length, 2);
  assert.match(markup, /\/images\/team\/silasu-turhan\.webp/);
  assert.match(markup, /\/images\/team\/tilbe-meric\.webp/);
  assert.match(markup, /href="\/team-showcase\.css"/);
  assert.match(markup, /src="\/team-showcase\.js"/);
  assert.match(markup, /Randevu planlayın/);
  assert.doesNotMatch(markup.slice(markup.indexOf('data-team-showcase="true"'), markup.indexOf('</section>', markup.indexOf('data-team-showcase="true"'))), /<span>0[12]<\/span>/);
  assert.match(runtime, /new MutationObserver/);
  assert.match(runtime, /outerHTML = teamShowcaseMarkup/);
});

test("optimized team portraits are available for the homepage", () => {
  assert.equal(existsSync(new URL("../public/images/team/silasu-turhan.webp", import.meta.url)), true);
  assert.equal(existsSync(new URL("../public/images/team/tilbe-meric.webp", import.meta.url)), true);
});
