import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const bookingBundles = [
  "../public/_next/static/chunks/appointment-booking-9CIoC0ma.js",
  "../server/ssr/_next/static/appointment-booking-DK1O_E2f.js",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

test("appointment booking captures contact details without a time picker", () => {
  for (const bundle of bookingBundles) {
    assert.match(bundle, /Telefon numaranız/);
    assert.match(bundle, /Diğer/);
    assert.match(bundle, /Müsait danışman/);
    assert.match(bundle, /booking-note/);
    assert.match(bundle, /📞 Telefon:/);
    assert.doesNotMatch(bundle, /Saat seçin/);
    assert.doesNotMatch(bundle, /Saat Tercihi/);
    assert.doesNotMatch(bundle, /09:00/);
  }
});

test("booking modal opens from a direct appointment link", () => {
  const clientBundle = bookingBundles[0];

  assert.match(clientBundle, /URLSearchParams\(window\.location\.search\)/);
  assert.match(clientBundle, /randevu/);
});
