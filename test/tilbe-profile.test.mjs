import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Tilbe Meriç has a dedicated profile page with her portrait and expertise areas", async () => {
  const [page, config, buildScript] = await Promise.all([
    readFile(new URL("../api/tilbe-meric.mjs", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/build-static.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Fizyoterapist Tilbe Meriç \| Maltepe Fizyoterapi/);
  assert.match(page, /\/images\/team\/tilbe-meric\.webp/);
  assert.match(page, /Uzmanlık alanları/);
  assert.match(page, /href="#uzmanlik">Uzmanlık profilini inceleyin/);
  assert.match(page, /Kinezyoterapi/);
  for (const service of [
    "Manuel Terapi",
    "Medikal Masaj",
    "Nörolojik Rehabilitasyon",
    "İnme Rehabilitasyonu",
    "Parkinson Rehabilitasyonu",
    "MS Rehabilitasyonu",
    "El Rehabilitasyonu",
    "Diz Protezi Sonrası Rehabilitasyon",
    "Omuz Ameliyatı Sonrası Rehabilitasyon",
    "Çapraz Bağ Yırtıkları Rehabilitasyonu",
    "Menisküs Rehabilitasyonu",
    "Skolyoz Rehabilitasyonu",
    "Evde Fizyoterapi",
    "Hamile Pilatesi",
    "İnkontinans Rehabilitasyonu",
    "Migren Rehabilitasyonu",
    "Oyun Terapisi",
  ]) {
    assert.match(page, new RegExp(service, "i"));
  }
  assert.match(page, /href="\/\?randevu=1"/);
  assert.match(config, /"source": "\/fzt-tilbe-meric"/);
  assert.match(buildScript, /"fzt-tilbe-meric"/);
});

test("Sılasu Arıkan's profile uses her own portrait", async () => {
  const { silasuArikanPage } = await import("../api/silasu-arikan.mjs");

  assert.match(silasuArikanPage, /\/images\/team\/silasu-turhan\.webp/);
  assert.match(silasuArikanPage, /Uzm\. Fzt\. Sılasu Arıkan \| Maltepe Fizyoterapi/);
  assert.match(silasuArikanPage, /class="profile-hero"/);
  assert.match(silasuArikanPage, /class="interests-section"/);
  assert.doesNotMatch(silasuArikanPage, /Hareketi<br\/>anlayarak|Hareket<br\/>ile iyileşme/);
});
