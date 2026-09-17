import { renderTilbePage } from "./tilbe-meric.mjs";
import { getExperts } from "../server/data-store.mjs";

export function renderSilasuPage(expert = getExperts().silasu) {
  const exp = expert || {};
  const base = renderTilbePage({
    prefix: exp.prefix || "Uzm. Fzt.",
    name: exp.name || "Sılasu Arıkan Turhan",
    category: exp.category || "Fizyoterapi ve Rehabilitasyon",
    shortBio: exp.shortBio || "Kişiye özel değerlendirme, egzersiz planlama ve günlük yaşama uyumlu rehabilitasyon yaklaşımı.",
    fullBio: exp.fullBio || "Sılasu Arıkan Turhan, fizyoterapi sürecini yalnızca bir uygulama değil; kişinin günlük yaşamı, hareket alışkanlıkları ve hedefleriyle birlikte ele alınan bir yolculuk olarak görür.\n\nSeanslarda doğru değerlendirmeye, anlaşılır bir egzersiz planına ve sürdürülebilir ilerlemeye odaklanır. Amaç; vücudun ihtiyaçlarını dinleyerek hareketi günlük hayata daha güvenli ve rahat biçimde dahil etmektir.\n\nHer danışan için açık iletişim, güvenli ilerleme ve gerçekçi hedeflerle şekillenen bir çalışma alanı oluşturmayı önemser.",
    image: exp.image || "/images/team/silasu-turhan.webp",
    expertiseAreas: exp.expertiseAreas || [
      "Ortopedik rehabilitasyon",
      "Klinik pilates",
      "Manuel terapi yaklaşımları",
      "Core ve stabilizasyon egzersizleri",
      "Nörolojik rehabilitasyon",
      "Denge rehabilitasyonu",
      "Sporcu sağlığı ve fonksiyonel egzersiz",
      "Kinezyolojik bantlama"
    ]
  });

  return base
    .replaceAll("Fizyoterapist Tilbe Meriç | Maltepe Fizyoterapi", "Uzm. Fzt. Sılasu Arıkan | Maltepe Fizyoterapi")
    .replaceAll("tilbe-title", "silasu-title")
    .replaceAll("Tilbe Meriç", exp.name || "Sılasu Arıkan Turhan")
    .replace('Fzt.<br/><em>' + (exp.name || "Sılasu Arıkan Turhan") + '</em>', (exp.prefix || "Uzm. Fzt.") + '<br/><em>' + (exp.name || "Sılasu Arıkan Turhan") + '</em>')
    .replaceAll("/images/team/tilbe-meric.webp", exp.image || "/images/team/silasu-turhan.webp")
    .replaceAll("Fizyoterapist " + (exp.name || "Sılasu Arıkan Turhan"), (exp.prefix || "Uzm. Fzt.") + " " + (exp.name || "Sılasu Arıkan Turhan"))
    .replace("Fzt.</span></div></section>", (exp.prefix || "Uzm. Fzt.") + "</span></div></section>")
    .replace("Tilbe Meriç, fizyoterapi sürecini", (exp.name || "Sılasu Arıkan Turhan") + ", fizyoterapi sürecini")
    .replace("Fonksiyonel hareket eğitimi", "Egzersiz ve hareket eğitimi");
}

export const silasuArikanPage = renderSilasuPage();

export default function handler(_request, response) {
  response.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(silasuArikanPage);
}
