import { universalContactCta } from "./contact-cta.mjs";

const arrow = '<span aria-hidden="true">↗</span>';

export function renderGenericExpertPage(expert) {
  const exp = expert || {};
  const prefix = exp.prefix || "Fzt.";
  const name = exp.name || "Uzman Fizyoterapist";
  const category = exp.category || "Fizyoterapi ve Rehabilitasyon";
  const shortBio = exp.shortBio || "Kişiye özel değerlendirme, fonksiyonel hareket ve sürdürülebilir seans planıyla ilerleyen bir yaklaşım.";
  const fullBio = exp.fullBio || `${prefix} ${name}, fizyoterapi ve rehabilitasyon alanında klinik çalışmalarını sürdürmektedir.`;
  const image = exp.image || "/images/team/silasu-turhan.webp";
  const areas = (exp.expertiseAreas && exp.expertiseAreas.length) ? exp.expertiseAreas : [
    "Ortopedik Rehabilitasyon",
    "Sporcu Sağlığı ve Fonksiyonel Egzersiz",
    "Manuel Terapi",
    "Klinik Pilates"
  ];

  const defaultServices = [
    "Fizyoterapi ve Rehabilitasyon",
    "Osteopatik Değerlendirme",
    "Sporcu Sağlığı ve Fonksiyonel Egzersiz",
    "Core / Stabilizasyon Egzersizleri",
    "Ortopedik Rehabilitasyon",
    "Klinik Pilates",
    "Manuel Terapi",
    "Osteopati"
  ];

  const servicesList = (exp.sessionPlanServices && exp.sessionPlanServices.length)
    ? exp.sessionPlanServices
    : (exp.services && exp.services.length ? exp.services : defaultServices);

  const serviceArticles = servicesList
    .map((s, i) => `<article><span>${String(i + 1).padStart(2, "0")}</span><p>${s}</p></article>`)
    .join("");

  const bioParagraphs = fullBio.split("\n\n").filter(Boolean).map(p => `<p>${p.trim()}</p>`).join("");
  const interestSpans = areas.map(a => `<span>✓ ${a}</span>`).join("");

  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${prefix} ${name} ile Maltepe'de kişiye özel fizyoterapi, egzersiz planı ve hareket odaklı rehabilitasyon." />
    <meta name="theme-color" content="#12343b" />
    <title>${prefix} ${name} | Maltepe Fizyoterapi</title>
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/_next/static/css/index.C91Two5O.css" />
    <link rel="stylesheet" href="/team-brand.css" />
    <link rel="stylesheet" href="/universal-contact.css?v=1" />
    <link rel="stylesheet" href="/liquid-glass.css" />
  </head>
  <body>
    <main class="doctor-page">
      <div class="site-header-shell">
        <header class="site-header">
          <a class="brand" href="/" aria-label="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a>
          <nav class="desktop-nav" aria-label="Ana menü"><a href="/#hizmetler">Hizmetler</a><a href="/#yaklasim">Yaklaşımımız</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız</a><a href="/multisport">MultiSport</a><a href="/blog/">Makaleler</a><a href="/#iletisim">İletişim</a></nav>
          <div class="header-actions"><a class="header-cta" href="/?randevu=1"><span>Randevu</span> ${arrow}</a></div>
          <nav class="mobile-menu" aria-label="Mobil menü"><a href="/#hizmetler">Hizmetler ${arrow}</a><a href="/#yaklasim">Yaklaşımımız ${arrow}</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız ${arrow}</a><a href="/multisport">MultiSport ${arrow}</a><a href="/blog/">Makaleler ${arrow}</a><a href="/#iletisim">İletişim ${arrow}</a><a href="/?randevu=1">Randevu oluştur ${arrow}</a></nav>
        </header>
      </div>

      <section class="profile-hero" aria-labelledby="expert-title">
        <div class="profile-hero-copy">
          <p class="eyebrow"><span></span> ${category}</p>
          <h1 id="expert-title">${prefix}<br/><em>${name}</em></h1>
          <p>${shortBio}</p>
          <div class="profile-actions">
            <a class="button primary" href="/?randevu=1">Randevu oluştur ${arrow}</a>
          </div>
          <div class="profile-facts">
            <div class="profile-fact-card">
              <div class="profile-fact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </div>
              <div class="profile-fact-content">
                <strong>1:1 Seans</strong>
                <small>Kişiye Özel Değerlendirme</small>
              </div>
            </div>
            <div class="profile-fact-card">
              <div class="profile-fact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div class="profile-fact-content">
                <strong>Bütüncül Yaklaşım</strong>
                <small>Hareket ve Fonksiyon</small>
              </div>
            </div>
            <div class="profile-fact-card">
              <div class="profile-fact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="profile-fact-content">
                <strong>İstanbul · Maltepe</strong>
                <small>Klinik & Stüdyo</small>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-portrait">
          <img src="${image}" alt="${prefix} ${name}" />
          <div class="portrait-overlay"></div>
          <span>${prefix}</span>
        </div>
      </section>

      <section class="bio-section" id="ozgecmis">
        <div class="bio-aside">
          <p class="eyebrow"><span></span> Yaklaşımı</p>
          <h2>Her hedefe,<br/><em>kişiye özel</em> bir plan.</h2>
        </div>
        <div class="bio-copy">
          ${bioParagraphs}
        </div>
      </section>

      <section class="interests-section" id="uzmanlik">
        <div>
          <p class="eyebrow light"><span></span> Uzmanlık alanları</p>
          <h2>Hareketi<br/><em>güçlendiren</em> seanslar.</h2>
        </div>
        <div class="interest-list">
          ${interestSpans}
        </div>
      </section>

      <section class="profile-services" aria-labelledby="expert-services-title">
        <div class="profile-services-heading">
          <p class="eyebrow"><span></span> Seans planı</p>
          <h2 id="expert-services-title">İhtiyacınıza göre<br/><em>birlikte</em> şekillenir.</h2>
          <p>İlk görüşmede hedeflerinizi ve günlük yaşam ihtiyaçlarınızı dinleyerek size uygun başlangıç planını oluşturuyoruz.</p>
          <a class="button primary" href="/?randevu=1">Randevu Planlayın ${arrow}</a>
        </div>
        <div class="profile-service-list">${serviceArticles}</div>
      </section>

      ${universalContactCta}
      <footer>
        <a class="brand footer-brand" href="/"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a>
        <p>© 2026 Fizyoterapist Sılasu Turhan · Tilbe Meriç</p>
        <p>Randevu ile hizmet verilmektedir.</p>
      </footer>
    </main>
    <script defer src="/navigation-unifier.js?v=fast-3"></script>
    <script defer src="/header-runtime.js?v=header-2"></script>
  </body>
</html>`;
}
