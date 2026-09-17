import assert from "node:assert/strict";
import test from "node:test";
import { server } from "../server/admin-server.mjs";
import { getGallery, getArticles, getExperts, getInstagram } from "../server/data-store.mjs";

const PORT = 3199;
let baseUrl = `http://127.0.0.1:${PORT}`;

test("Admin Server API tests", async (t) => {
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

  let authToken = "";

  await t.test("serves admin dashboard HTML", async () => {
    const res = await fetch(`${baseUrl}/admin`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /Yönetim Paneli/);
    assert.match(text, /Turhan &amp; Meriç/);
  });

  await t.test("rejects unauthenticated requests to protected endpoints", async () => {
    const resCheck = await fetch(`${baseUrl}/api/admin/check`);
    assert.equal(resCheck.status, 401);

    const resData = await fetch(`${baseUrl}/api/admin/data`);
    assert.equal(resData.status, 401);
  });

  await t.test("handles login credentials accurately", async () => {
    // Bad login
    const resBad = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrongpassword" }),
    });
    assert.equal(resBad.status, 401);

    // Good login
    const resGood = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "TurhanMeric2026!" }),
    });
    assert.equal(resGood.status, 200);
    const data = await resGood.json();
    assert.equal(data.ok, true);
    assert.ok(data.token);
    authToken = data.token;
  });

  await t.test("returns data store items for authenticated admin", async () => {
    const res = await fetch(`${baseUrl}/api/admin/data`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.data.gallery.length, 13);
    assert.equal(body.data.articles.length, 10);
    assert.ok(body.data.experts.silasu);
    assert.ok(body.data.experts.tilbe);
    assert.equal(body.data.instagram.silasu.length, 3);
    assert.equal(body.data.instagram.tilbe.length, 3);
  });

  await t.test("validates and accepts base64 image upload", async () => {
    // 1x1 transparent webp base64
    const sampleWebp = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vuUAAA=";
    const res = await fetch(`${baseUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: "test-upload.webp",
        dataUrl: sampleWebp,
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.match(data.url, /^\/images\/uploads\/\d+-test-upload\.webp$/);
  });

  await t.test("persists gallery items and syncs business-gallery-data.js", async () => {
    const current = getGallery();
    const updated = [
      ...current,
      { id: "test-item", image: "/images/business-gallery/01.webp", caption: "Test Görsel" },
    ];

    const res = await fetch(`${baseUrl}/api/admin/gallery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gallery: updated }),
    });
    assert.equal(res.status, 200);

    const saved = getGallery();
    assert.equal(saved.length, 14);

    // Clean up to restore original 13
    await fetch(`${baseUrl}/api/admin/gallery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gallery: current }),
    });
    assert.equal(getGallery().length, 13);
  });

  await new Promise((resolve) => server.close(resolve));
});
