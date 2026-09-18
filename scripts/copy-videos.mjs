import fs from "node:fs";
import path from "node:path";

const silaFiles = fs.readdirSync("Videolar/Sıla");
console.log("Sıla files count:", silaFiles.length);
const silaTargetNames = [
  "hareket-ve-denge-analizi.mp4",
  "klinik-pilates-ve-egzersiz.mp4",
  "agrisiz-fizyoterapi-yaklasimi.mp4"
];
silaFiles.forEach((file, idx) => {
  const src = path.join("Videolar/Sıla", file);
  const dest = path.join("public/videos/sila", silaTargetNames[idx]);
  fs.copyFileSync(src, dest);
  console.log("Copied", dest);
});

const tilbeFiles = fs.readdirSync("Videolar/Tilbe");
console.log("Tilbe files count:", tilbeFiles.length);
const tilbeTargetNames = [
  "fonksiyonel-egzersiz-ve-pilates.mp4",
  "postur-ve-durus-analizi.mp4",
  "norolojik-degerlendirme-ve-denge.mp4"
];
tilbeFiles.forEach((file, idx) => {
  const src = path.join("Videolar/Tilbe", file);
  const dest = path.join("public/videos/tilbe", tilbeTargetNames[idx]);
  fs.copyFileSync(src, dest);
  console.log("Copied", dest);
});
console.log("All videos copied successfully!");
