import { universalContactCta } from "./contact-cta.mjs";

const arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';

export const expertsPage = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Maltepe'de fizyoterapi ve rehabilitasyon yaklaşımımızı Sılasu Arıkan Turhan ve Tilbe Meriç ile tanıyın." />
    <meta name="theme-color" content="#1d514c" />
    <link rel="canonical" href="https://www.turhanmeric.com/uzmanlar/" />
    <title>Uzmanlarımız | Sılasu Arıkan Turhan ve Tilbe Meriç</title>
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/_next/static/css/index.C91Two5O.css" />
    <link rel="stylesheet" href="/team-brand.css" />
    <link rel="stylesheet" href="/uzmanlar.css" />
    <link rel="stylesheet" href="/universal-contact.css?v=1" />
    <link rel="stylesheet" href="/liquid-glass.css" />
  </head>
  <body class="experts-page">
    <a class="skip-link" href="#icerik">İçeriğe geç</a>
    <div class="site-header-shell">
      <header class="site-header">
        <a class="brand" href="/" aria-label="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a>
        <nav class="desktop-nav" aria-label="Ana menü"><a href="/#hizmetler">Hizmetler</a><a href="/#yaklasim">Yaklaşımımız</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız</a><a href="/multisport">MultiSport</a><a href="/blog/">Makaleler</a><a href="/#iletisim">İletişim</a></nav>
        <div class="header-actions"><a class="header-cta" href="/?randevu=1"><span>Randevu</span>${arrow}</a><button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false" data-experts-menu-toggle><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg></button></div>
        <nav class="mobile-menu" aria-label="Mobil menü" data-experts-menu><a href="/#hizmetler">Hizmetler ${arrow}</a><a href="/#yaklasim">Yaklaşımımız ${arrow}</a><a href="/uzmanlar" aria-current="page">Uzmanlarımız ${arrow}</a><a href="/multisport">MultiSport ${arrow}</a><a href="/blog/">Makaleler ${arrow}</a><a href="/#iletisim">İletişim ${arrow}</a><a class="mobile-menu-cta" href="/?randevu=1">Randevu oluştur ${arrow}</a></nav>
      </header>
    </div>
    <main id="icerik">
      <section class="experts-hero" aria-labelledby="experts-title">
        <div class="experts-orbits" aria-hidden="true"><i></i><i></i><i></i></div>
        <p class="experts-kicker">EKİBİMİZ</p>
        <h1 id="experts-title">Hareketinize eşlik eden<br /><em>uzmanlarımız.</em></h1>
        <p>Değerlendirme, güven ve kişiye özel planlama ile sürecinize birlikte yön veriyoruz.</p>
      </section>
      <section class="experts-grid" aria-label="Fizyoterapistlerimiz">
        <article class="expert-card expert-card-silasu">
          <div class="expert-image"><img src="/images/team/silasu-turhan.webp" alt="Uzm. Fzt. Sılasu Arıkan Turhan" width="900" height="1200" /><span>Uzm. Fzt.</span></div>
          <div class="expert-copy"><p>FİZYOTERAPİ VE REHABİLİTASYON</p><h2>Sılasu Arıkan<br /><em>Turhan</em></h2><p>Kişiye özel değerlendirme, egzersiz planlama ve günlük yaşama uyumlu rehabilitasyon yaklaşımı.</p><a class="expert-link" href="/uzm-fzt-silasu-arikan">Profili inceleyin ${arrow}</a></div>
        </article>
        <article class="expert-card expert-card-tilbe">
          <div class="expert-image"><img src="/images/team/tilbe-meric.webp" alt="Fizyoterapist Tilbe Meriç" width="900" height="1200" /><span>Fzt.</span></div>
          <div class="expert-copy"><p>FİZYOTERAPİ VE HAREKET</p><h2>Tilbe<br /><em>Meriç</em></h2><p>Fonksiyonel hareket, kinezyoterapi ve sürdürülebilir seans planıyla ilerleyen yaklaşım.</p><a class="expert-link" href="/fzt-tilbe-meric">Profili inceleyin ${arrow}</a></div>
        </article>
      </section>
      <section class="experts-note" aria-label="Çalışma yaklaşımımız"><p>İlk görüşmede</p><h2>İhtiyacınızı dinler,<br /><em>birlikte</em> planlarız.</h2><a href="/?randevu=1">Randevu planlayın ${arrow}</a></section>
      ${universalContactCta}
    </main>
    <footer><a class="brand footer-brand" href="/"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a><p>© 2026 Fizyoterapist Sılasu Turhan · Tilbe Meriç</p><p>Randevu ile hizmet verilmektedir.</p></footer>
    <script defer src="/experts-shell.js"></script>
    <script defer src="/navigation-unifier.js?v=fast-2"></script>
  </body>
</html>`;

export default function handler(_request, response) {
  response.statusCode = 200;
  response.setHeader("content-type", "text/html; charset=utf-8");
  response.end(expertsPage);
}
