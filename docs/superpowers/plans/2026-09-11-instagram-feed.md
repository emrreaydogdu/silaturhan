# Instagram Feed Alanı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meta API bağlanmadan önce, ana sayfada Instagram gönderileri için markaya uygun ve erişilebilir bir hazır alan oluşturmak.

**Architecture:** Sunucu tarafı sayfa paketi yeni bölümü HTML olarak üretir. `api/index.mjs`, yalnızca bu sayfaya özel stil dosyasını HTML head içine ekler. API bağlantısı daha sonra yeni bir Vercel fonksiyonunda ayrı tutulur; bu ilk değişiklikte herhangi bir token veya harici istek yoktur.

**Tech Stack:** Vinext sunucu çıktısı, Vercel Node fonksiyonu, statik CSS, Node test runner.

---

### Task 1: Sunucu çıktısı için regresyon testi

**Files:**
- Create: `test/instagram-section.test.mjs`
- Test: `test/instagram-section.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
assert.match(markup, /class="instagram-section"/);
assert.match(markup, /@fztsilasuarikanturhan/);
assert.match(markup, /href="\/instagram-feed\.css"/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/instagram-section.test.mjs`

Expected: FAIL because the current homepage has no Instagram feed section or stylesheet.

- [ ] **Step 3: Write minimal implementation**

Add the static section and stylesheet injection described in Tasks 2 and 3.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/instagram-section.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add test/instagram-section.test.mjs api/index.mjs server/_next/static/page-BESsBKlW.js public/instagram-feed.css
git commit -m "Add prepared Instagram feed section"
```

### Task 2: Instagram bölümünü sayfaya ekleme

**Files:**
- Modify: `server/_next/static/page-BESsBKlW.js`

- [ ] **Step 1: Add section markup**

Insert `section.instagram-section` after `.services-section` and before `.testimonials-section`, including heading, account link, a clear API-pending status, and six `instagram-feed-card` loading cards.

- [ ] **Step 2: Preserve honest content state**

Set the grid to `aria-live="polite"` and `aria-busy="true"`; do not introduce fake Instagram posts or API keys.

- [ ] **Step 3: Verify the rendered page**

Run: `node --test test/instagram-section.test.mjs`

Expected: the homepage contains the Instagram section and account handle.

### Task 3: Görsel sistem ve stil yükleme

**Files:**
- Create: `public/instagram-feed.css`
- Modify: `api/index.mjs`

- [ ] **Step 1: Add focused stylesheet**

Create styles for the section’s pale sage surface, dark ink typography, responsive three-column grid, rounded card geometry, skeleton shimmer, keyboard focus ring, and a one-column mobile layout.

- [ ] **Step 2: Inject stylesheet into rendered HTML**

Update `render` so that HTML responses contain one `<link rel="stylesheet" href="/instagram-feed.css">` before `</head>`. Preserve status, headers, and non-HTML responses.

- [ ] **Step 3: Verify all tests**

Run: `npm test`

Expected: all tests pass.

### Task 4: Production verification

**Files:**
- Modify: none

- [ ] **Step 1: Build production output**

Run: `vercel build --prod --yes`

Expected: successful Vercel build with `api/index` function.

- [ ] **Step 2: Deploy through GitHub**

Run: `git push origin main`

Expected: production deployment starts automatically.

- [ ] **Step 3: Verify production HTML**

Run: `Invoke-WebRequest -Uri 'https://sila-turhan.vercel.app/' -UseBasicParsing`

Expected: HTTP 200 and the Instagram section, profile link, and stylesheet reference are present.
