import { tilbeMericPage } from "./tilbe-meric.mjs";

export const silasuArikanPage = tilbeMericPage
  .replaceAll("Fizyoterapist Tilbe Meriç | Maltepe Fizyoterapi", "Uzm. Fzt. Sılasu Arıkan | Maltepe Fizyoterapi")
  .replaceAll("tilbe-title", "silasu-title")
  .replaceAll("Tilbe Meriç", "Sılasu Arıkan Turhan")
  .replace('Fzt.<br/><em>Sılasu Arıkan Turhan</em>', 'Uzm. Fzt.<br/><em>Sılasu Arıkan Turhan</em>')
  .replaceAll("/images/team/tilbe-meric.webp", "/images/team/silasu-turhan.webp")
  .replaceAll("Fizyoterapist Sılasu Arıkan Turhan", "Uzm. Fzt. Sılasu Arıkan Turhan")
  .replace("Fzt.</span></div></section>", "Uzm. Fzt.</span></div></section>")
  .replace("Tilbe Meriç</a><a href=\"/multisport\"", "Tilbe Meriç</a><a href=\"/multisport\"")
  .replace('href="/uzm-fzt-silasu-arikan">Sılasu Arıkan Turhan</a>', 'href="/uzm-fzt-silasu-arikan" aria-current="page">Sılasu Arıkan Turhan</a>')
  .replace('href="/fzt-tilbe-meric" aria-current="page">Sılasu Arıkan Turhan</a>', 'href="/fzt-tilbe-meric">Tilbe Meriç</a>')
  .replace("Tilbe Meriç, fizyoterapi sürecini", "Sılasu Arıkan Turhan, fizyoterapi sürecini")
  .replace("Fonksiyonel hareket eğitimi", "Egzersiz ve hareket eğitimi");

export default function handler(_request, response) {
  response.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(silasuArikanPage);
}
