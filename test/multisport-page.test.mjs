import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = async (path) => readFile(new URL(path, root), "utf8").catch(() => "");

test("MultiSport members have a dedicated benefits page", async () => {
  const [config, page, styles] = await Promise.all([
    source("vercel.json"),
    source("api/multisport.mjs"),
    source("public/multisport.css"),
  ]);

  assert.match(config, /"source":\s*"\/multisport"/);
  assert.match(page, /MultiSport Üyelerine Özel/);
  assert.match(page, /Kapsamda olan[\s\S]*uygulamalar/);
  assert.match(page, /İndirimli destek[\s\S]*seçenekleri/);
  assert.match(page, /Randevu planla/);
  assert.match(page, /multisport\.css/);
  assert.match(page, /class="site-header-shell"/);
  assert.match(page, /class="site-header"/);
  assert.match(page, /class="desktop-nav"/);
  assert.match(page, /class="mobile-menu"/);
  assert.match(page, /href="\/#hizmetler"/);
  assert.match(page, /href="\/#yaklasim"/);
  assert.match(page, /class="brand footer-brand"/);
  assert.match(page, /Randevu ile hizmet verilmektedir/);
  assert.match(page, /index\.C91Two5O\.css/);
  assert.match(styles, /\.ms-hero/);
  assert.match(styles, /\.site-header-shell/);
});
