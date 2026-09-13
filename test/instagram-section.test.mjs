import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("homepage publishes the prepared Instagram feed section", async () => {
  const { render } = await import("../api/index.mjs");
  const response = await render(
    new Request("https://example.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();

  assert.match(markup, /class="instagram-section"/);
  assert.ok(markup.indexOf('class="kinezyo-section"') < markup.indexOf('class="instagram-section"'));
  assert.match(markup, /@fztsilasuarikanturhan/);
  assert.match(markup, /@fzt\.tilbemeric/);
  assert.match(markup, /href="https:\/\/www\.instagram\.com\/fzt\.tilbemeric\/"/);
  assert.equal((markup.match(/class="instagram-account instagram-account-/g) ?? []).length, 2);
  const silaStart = markup.indexOf('class="instagram-account instagram-account-silasu"');
  const tilbeStart = markup.indexOf('class="instagram-account instagram-account-tilbe"');
  const silaMarkup = markup.slice(silaStart, markup.indexOf("</section>", silaStart));
  const tilbeMarkup = markup.slice(tilbeStart, markup.indexOf("</section>", tilbeStart));

  for (const shortcode of ["DdE7j7gIKGg", "DcjNyjhI_nt", "DcOH_9AICJt"]) {
    assert.ok(silaMarkup.includes(shortcode), `Sılasu's feed should embed ${shortcode}`);
  }
  for (const shortcode of ["DXCmcpoClmk", "DX6IB74KQTA", "DWedsHlCrBp"]) {
    assert.ok(tilbeMarkup.includes(shortcode), `Tilbe's feed should embed ${shortcode}`);
  }

  assert.match(markup, /Sılasu Turhan/);
  assert.match(markup, /Tilbe Meriç/);
  assert.equal((markup.match(/class="instagram-feed-card instagram-preview-card"/g) ?? []).length, 6);
  assert.equal((markup.match(/class="instagram-media"/g) ?? []).length, 0);
  assert.doesNotMatch(markup, /https:\/\/www\.instagram\.com\/embed\.js/);
  assert.equal((markup.match(/src="\/instagram-feed\.js\?v=silasu-native-embed-1"/g) ?? []).length, 1);
  assert.doesNotMatch(markup, /instagram-skeleton|instagram-pending|aria-busy="true"/);
  assert.match(markup, /href="\/instagram-feed\.css\?v=silasu-native-embed-1"/);
  assert.equal(
    existsSync(new URL("../public/instagram-feed.css", import.meta.url)),
    true,
  );
  const feedScript = readFileSync(new URL("../public/instagram-feed.js", import.meta.url), "utf8");
  const feedStyles = readFileSync(new URL("../public/instagram-feed.css", import.meta.url), "utf8");
  assert.match(feedScript, /https:\/\/www\.instagram\.com\/embed\.js/);
  assert.match(feedScript, /querySelectorAll\(previewSelector\)/);
  assert.match(feedScript, /data-instagram-permalink/);
  assert.match(feedScript, /createElement\("blockquote"\)/);
  assert.match(feedScript, /createElement\("iframe"\)/);
  assert.match(feedScript, /author === "Sılasu Turhan"/);
  assert.match(feedScript, /DOMContentLoaded|document\.readyState/);
  assert.doesNotMatch(feedScript, /addEventListener\("click"/);
  assert.doesNotMatch(feedScript, /Gönderiyi yükle/);
  assert.match(feedStyles, /\.instagram-preview-actions\s*\{\s*display:\s*none;/);
  assert.match(feedStyles, /\.instagram-native-embed-card/);
});
