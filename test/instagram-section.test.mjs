import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

test("homepage publishes the prepared Instagram feed section", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();

  assert.match(markup, /class="instagram-section"/);
  assert.match(markup, /@fztsilasuarikanturhan/);
  assert.match(markup, /@fzt\.tilbemeric/);
  assert.match(markup, /href="https:\/\/www\.instagram\.com\/fzt\.tilbemeric\/"/);
  assert.equal((markup.match(/class="instagram-account instagram-account-/g) ?? []).length, 2);
  assert.match(markup, /Sılasu Turhan/);
  assert.match(markup, /Tilbe Meriç/);
  assert.equal((markup.match(/class="instagram-feed-card/g) ?? []).length, 6);
  assert.match(markup, /href="\/instagram-feed\.css"/);
  assert.equal(
    existsSync(new URL("../public/instagram-feed.css", import.meta.url)),
    true,
  );
});
