import { universalContactCta } from "./contact-cta.mjs";
import { getExperts } from "../server/data-store.mjs";

const arrow = '<span aria-hidden="true">↗</span>';

export function renderTilbePage(expert = getExperts().tilbe) {
  const exp = expert || {};
  const prefix = exp.prefix || "Fzt.";
  const name = exp.name || "Tilbe Meriç";
  const category = exp.category || "Fizyoterapi ve Rehabilitasyon";
  const shortBio = exp.shortBio || "Kişiye özel değerlendirme, fonksiyonel hareket ve günlük yaşama uyumlu egzersiz planlarıyla ilerleyen bir fizyoterapi yaklaşımı.";
  const fullBio = exp.fullBio || "Tilbe Meriç, fizyoterapi sürecini yalnızca bir uygulama değil; kişinin günlük yaşamı, hareket alışkanlıkları ve hedefleriyle birlikte ele alınan bir yolculuk olarak görür.\n\nSeanslarda doğru değerlendirmeye, anlaşılır bir egzersiz planına ve sürdürülebilir ilerlemeye odaklanır. Amaç; vücudun ihtiyaçlarını dinleyerek hareketi günlük hayata daha güvenli ve rahat biçimde dahil etmektir.\n\nHer danışan için açık iletişim, güvenli ilerleme ve gerçekçi hedeflerle şekillenen bir çalışma alanı oluşturmayı önemser.";
  const image = exp.image || "/images/team/tilbe-meric.webp";
  const areas = (exp.expertiseAreas && exp.expertiseAreas.length) ? exp.expertiseAreas : [
    "Osteopatik değerlendirme",
    "Sporcu sağlığı ve fonksiyonel egzersiz",
    "Core ve stabilizasyon egzersizleri",
    "Ortopedik rehabilitasyon",
    "Nörolojik rehabilitasyon",
    "Geriatrik (yaşlı) rehabilitasyon",
    "Denge rehabilitasyonu",
    "Klinik pilates",
    "Manuel terapi yaklaşımları",
    "Kinezyolojik bantlama"
  ];

  const bioParagraphs = fullBio.split("\n\n").filter(Boolean).map(p => `<p>${p.trim()}</p>`).join("");
  const interestSpans = areas.map(a => `<span>✓ ${a}</span>`).join("");

  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Fizyoterapist Tilbe Meriç ile Maltepe'de kişiye özel fizyoterapi, osteopatik değerlendirme ve hareket odaklı rehabilitasyon." />
    <meta name="theme-color" content="#12343b" />
    <title>Fizyoterapist Tilbe Meriç | Maltepe Fizyoterapi</title>
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/_next/static/css/index.C91Two5O.css" />
    <link rel="stylesheet" href="/team-brand.css" />
    <link rel="stylesheet" href="/universal-contact.css?v=1" />
    <link rel="stylesheet" href="/liquid-glass.css" />
  </head>
  <body>
    <main class="doctor-page">
      <div class="site-header-shell"><header class="site-header"><a class="brand" href="/" aria-label="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a><nav class="desktop-nav" aria-label="Ana menü"><a href="/#hizmetler">Hizmetler</a><a href="/#yaklasim">Yaklaşımımız</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız</a><a href="/multisport">MultiSport</a><a href="/blog/">Makaleler</a><a href="/#iletisim">İletişim</a></nav><div class="header-actions"><a class="header-cta" href="/?randevu=1"><span>Randevu</span> ${arrow}</a></div><nav class="mobile-menu" aria-label="Mobil menü"><a href="/#hizmetler">Hizmetler ${arrow}</a><a href="/#yaklasim">Yaklaşımımız ${arrow}</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız ${arrow}</a><a href="/multisport">MultiSport ${arrow}</a><a href="/blog/">Makaleler ${arrow}</a><a href="/#iletisim">İletişim ${arrow}</a><a href="/?randevu=1">Randevu oluştur ${arrow}</a></nav></header></div>

      <section class="profile-hero" aria-labelledby="tilbe-title"><div class="profile-hero-copy"><p class="eyebrow"><span></span> ${category}</p><h1 id="tilbe-title">${prefix}<br/><em>${name}</em></h1><p>${shortBio}</p><div class="profile-actions"><a class="button primary" href="/?randevu=1">Randevu oluştur ${arrow}</a><a class="text-link" href="#uzmanlik">Uzmanlık profilini inceleyin ${arrow}</a></div><div class="profile-facts"><span><strong>1:1</strong> kişiye özel değerlendirme</span><span><strong>Hareket</strong> odaklı yaklaşım</span><span>İstanbul · Maltepe</span></div></div><div class="profile-portrait"><img src="${image}" alt="Fizyoterapist Tilbe Meriç" /><div class="portrait-overlay"></div><span>${prefix}</span></div></section>

      <section class="bio-section" id="ozgecmis"><div class="bio-aside"><p class="eyebrow"><span></span> Yaklaşımı</p><h2>Her hedefe,<br/><em>kişiye özel</em> bir plan.</h2></div><div class="bio-copy">${bioParagraphs}</div></section>

      <section class="interests-section" id="uzmanlik"><div><p class="eyebrow light"><span></span> Uzmanlık alanları</p><h2>Hareketi<br/><em>güçlendiren</em> seanslar.</h2></div><div class="interest-list">${interestSpans}</div></section>

      <section class="profile-services" aria-labelledby="tilbe-services-title"><div class="profile-services-heading"><p class="eyebrow"><span></span> Seans planı</p><h2 id="tilbe-services-title">İhtiyacınıza göre<br/><em>birlikte</em> şekillenir.</h2><p>İlk görüşmede hedeflerinizi ve günlük yaşam ihtiyaçlarınızı dinleyerek size uygun başlangıç planını oluşturuyoruz.</p><a class="button primary" href="#uzmanlik">Uzmanlık profilini inceleyin ${arrow}</a></div><div class="profile-service-list"><article><span>01</span><p>Fizyoterapi ve Rehabilitasyon</p></article><article><span>02</span><p>Osteopatik Değerlendirme</p></article><article><span>03</span><p>Sporcu Sağlığı ve Fonksiyonel Egzersiz</p></article><article><span>04</span><p>Core / Stabilizasyon Egzersizleri</p></article><article><span>05</span><p>Ortopedik Rehabilitasyon</p></article><article><span>06</span><p>Klinik Pilates</p></article><article><span>07</span><p>Manuel Terapi</p></article><article><span>08</span><p>Osteopati</p></article><article><span>09</span><p>Medikal Masaj</p></article><article><span>10</span><p>Nörolojik Rehabilitasyon</p></article><article><span>11</span><p>İnme Rehabilitasyonu</p></article><article><span>12</span><p>Parkinson Rehabilitasyonu</p></article><article><span>13</span><p>MS Rehabilitasyonu</p></article><article><span>14</span><p>El Rehabilitasyonu</p></article><article><span>15</span><p>Diz Protezi Sonrası Rehabilitasyon</p></article><article><span>16</span><p>Omuz Ameliyatı Sonrası Rehabilitasyon</p></article><article><span>17</span><p>Çapraz Bağ Yırtıkları Rehabilitasyonu</p></article><article><span>18</span><p>Menisküs Rehabilitasyonu</p></article><article><span>19</span><p>Skolyoz Rehabilitasyonu</p></article><article><span>20</span><p>Hamile Pilatesi</p></article><article><span>21</span><p>Pilates</p></article><article><span>22</span><p>İnkontinans Rehabilitasyonu</p></article><article><span>23</span><p>Migren Rehabilitasyonu</p></article><article><span>24</span><p>Oyun Terapisi</p></article></div></section>

      ${universalContactCta}<footer><a class="brand footer-brand" href="/"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a><p>© 2026 Fizyoterapist Sılasu Turhan · Tilbe Meriç</p><p>Randevu ile hizmet verilmektedir.</p></footer>
    </main>
    <script defer src="/navigation-unifier.js?v=fast-3"></script>
    <script defer src="/header-runtime.js?v=header-2"></script>
  </body>
</html>`;
}

export const tilbeMericPage = renderTilbePage();

export default function handler(_request, response) {
  response.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(tilbeMericPage);
}
