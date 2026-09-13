import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { blogArticles, renderArticlePage, renderBlogIndex } from "../api/blog.mjs";
import { render } from "../api/index.mjs";

test("homepage provides a three-card article slider with ten crawlable articles", async () => {
  assert.equal(blogArticles.length, 10);
  assert.equal(new Set(blogArticles.map((article) => article.slug)).size, 10);

  const response = await render(
    new Request("https://www.turhanmeric.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();
  assert.match(markup, /class="blog-section"/);
  assert.match(markup, /data-blog-track/);
  assert.match(markup, /blog-slider\.js/);
  assert.match(markup, /blog-home\.js/);
  assert.match(markup, /id="blog-section-template"/);
  assert.ok(markup.indexOf("faq-section") < markup.indexOf("blog-section"));
  assert.ok(markup.indexOf("blog-section") < markup.indexOf("contact-section"));
  const archive = renderBlogIndex();
  assert.match(archive, new RegExp(blogArticles[9].slug));
  assert.match(archive, /class="site-header"/);
  assert.match(archive, /<footer>/);
  assert.match(archive, /blog-shell\.js/);
});

test("each article has canonical Article and breadcrumb structured data", () => {
  for (const article of blogArticles) {
    assert.match(article.cover, /^\/images\/articles\/.+\.webp$/);
    assert.ok(article.coverAlt);
    assert.ok(article.readingTime);
    const markup = renderArticlePage(article);
    assert.match(markup, new RegExp(`canonical" href="https://www\\.turhanmeric\\.com/blog/${article.slug}/`));
    assert.match(markup, /"@type":"Article"/);
    assert.match(markup, /"@type":"BreadcrumbList"/);
    assert.match(markup, new RegExp(`og:image" content="https://www\\.turhanmeric\\.com${article.cover}`));
    assert.match(markup, new RegExp(`src="${article.cover}"`));
    assert.match(markup, /Benzer <em>rehberler\.<\/em>/);
    assert.match(markup, /Bilgilendirme/);
    assert.match(markup, /class="site-header"/);
    assert.match(markup, /<footer>/);
  }
});

test("homepage has Maltepe and İstanbul local SEO markup and a published sitemap", async () => {
  const response = await render(
    new Request("https://www.turhanmeric.com/"),
    async () => new Response("Not found", { status: 404 }),
  );
  const markup = await response.text();
  assert.match(markup, /"MedicalBusiness"/);
  assert.match(markup, /Maltepe/);
  assert.match(markup, /İstanbul/);
  assert.match(markup, /"FAQPage"/);
  assert.match(markup, /rel="canonical" href="https:\/\/www\.turhanmeric\.com\//);
  assert.doesNotMatch(markup, /class="instagram-profile-link"/);

  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/www\.turhanmeric\.com\/sitemap\.xml/);
  const blogShell = await readFile(new URL("../public/blog-shell.js", import.meta.url), "utf8");
  assert.match(blogShell, /is-scrolled/);
  assert.match(blogShell, /window\.scrollY > 72/);
  const blogHome = await readFile(new URL("../public/blog-home.js", import.meta.url), "utf8");
  assert.match(blogHome, /MutationObserver/);
  assert.match(blogHome, /faq\.insertAdjacentElement\("afterend", section\)/);
  const liquidGlass = await readFile(new URL("../public/liquid-glass.css", import.meta.url), "utf8");
  assert.match(liquidGlass, /backdrop-filter: blur\(38px\)/);
  assert.match(liquidGlass, /\.site-header\.menu-open \.mobile-menu/);
});
