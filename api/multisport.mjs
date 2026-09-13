import { universalContactCta } from "./contact-cta.mjs";

const logoUrl =
  "https://images.seeklogo.com/logo-png/55/1/multisport-logo-png_seeklogo-557663.png";

export const multisportPage = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="MultiSport üyelerine özel fizyoterapi uygulamaları ve indirimli destek seçenekleri." />
    <meta name="theme-color" content="#12343b" />
    <title>MultiSport Üyelerine Özel | Fizyoterapistler Sılasu Turhan &amp; Tilbe Meriç</title>
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/_next/static/css/index.C91Two5O.css" />
    <link rel="stylesheet" href="/multisport.css" />
    <link rel="stylesheet" href="/universal-contact.css?v=1" />
    <link rel="stylesheet" href="/liquid-glass.css" />
  </head>
  <body class="multisport-page">
    <a class="skip-link" href="#icerik">İçeriğe geç</a>
    <div class="site-header-shell">
      <header class="site-header">
        <a class="brand" href="/" aria-label="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a>
        <nav class="desktop-nav" aria-label="Ana menü"><a href="/#hizmetler">Hizmetler</a><a href="/#yaklasim">Yaklaşımımız</a><a href="/uzmanlar">Uzmanlarımız</a><a href="/multisport" aria-current="page">MultiSport</a><a href="/blog/">Makaleler</a><a href="/#iletisim">İletişim</a></nav>
        <div class="header-actions">
          <div class="language-switcher"><button class="language-trigger" type="button" aria-label="Dil seçin" aria-expanded="false"><img src="https://flagcdn.com/tr.svg" alt=""/><span>TR</span><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button><div id="google_translate_element" class="google-translate-element"></div></div>
          <button class="header-cta" type="button" data-contact-trigger><span>Randevu</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></button>
          <button class="menu-toggle" type="button" aria-label="Menüyü aç" aria-expanded="false"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg></button>
        </div>
        <nav class="mobile-menu" aria-label="Mobil menü"><a href="/#hizmetler">Hizmetler <span aria-hidden="true">↗</span></a><a href="/#yaklasim">Yaklaşımımız <span aria-hidden="true">↗</span></a><a href="/uzmanlar">Uzmanlarımız <span aria-hidden="true">↗</span></a><a href="/multisport" aria-current="page">MultiSport <span aria-hidden="true">↗</span></a><a href="/blog/">Makaleler <span aria-hidden="true">↗</span></a><a href="/#iletisim">İletişim <span aria-hidden="true">↗</span></a><button class="mobile-menu-cta" type="button" data-contact-trigger>Randevu oluştur <span aria-hidden="true">↗</span></button></nav>
      </header>
    </div>

    <main id="icerik">
      <section class="ms-hero" aria-labelledby="hero-title">
        <div class="hero-orbit orbit-one" aria-hidden="true"></div>
        <div class="hero-orbit orbit-two" aria-hidden="true"></div>
        <div class="hero-copy">
          <div class="partner-lockup">
            <span>İş ortağımız</span>
            <img class="multisport-logo" src="${logoUrl}" alt="MultiSport" width="236" height="128" />
          </div>
          <p class="eyebrow">HAREKETİNİZE YER AÇIN</p>
          <h1 id="hero-title">MultiSport üyeliğinizle<br /><em>hareketinize</em> destek.</h1>
          <p class="hero-lede">Kartınızla kapsam dahilindeki uygulamalardan yararlanın; kapsam dışındaki klinik hizmetlerde ise size özel indirimli seçenekleri birlikte planlayalım.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/?randevu=1">Randevu planla <span aria-hidden="true">→</span></a>
            <a class="button button-quiet" href="#nasil-calisir">Nasıl çalışır?</a>
          </div>
        </div>
        <aside class="member-note" aria-label="MultiSport üyelik notu">
          <span class="note-icon" aria-hidden="true">✓</span>
          <p><strong>Kartınızı getirin.</strong> Randevu öncesinde kart türünüzü ve planlanan uygulamayı birlikte teyit edelim.</p>
        </aside>
      </section>

      <section class="benefit-intro" aria-labelledby="benefits-title">
        <div>
          <p class="eyebrow">ÜYELİK AVANTAJLARI</p>
          <h2 id="benefits-title">İki net yol,<br /><em>tek kişisel plan.</em></h2>
        </div>
        <p>Her ihtiyacın aynı olmadığını biliyoruz. Bu yüzden MultiSport kapsamınızı ve tedavi hedefinizi randevu öncesinde birlikte değerlendiriyoruz.</p>
      </section>

      <section class="benefit-grid" aria-label="MultiSport üyelik seçenekleri">
        <article class="benefit-card covered">
          <div class="card-topline"><span>01</span><span>KART KAPSAMI</span></div>
          <div class="card-disc" aria-hidden="true"><span>↗</span></div>
          <h3>Kapsamda olan<br /><em>uygulamalar</em></h3>
          <p>MultiSport anlaşması içinde yer alan, hareket ve egzersiz odaklı uygulamalar için kartınızı kullanabilirsiniz.</p>
          <ul>
            <li>Hareket ve egzersiz odaklı seanslar</li>
            <li>Duruş ve mobilite çalışmaları</li>
            <li>Randevu öncesi kapsam teyidi</li>
          </ul>
        </article>
        <article class="benefit-card discounted">
          <div class="card-topline"><span>02</span><span>ÜYE AVANTAJI</span></div>
          <div class="card-disc" aria-hidden="true"><span>%</span></div>
          <h3>İndirimli destek<br /><em>seçenekleri</em></h3>
          <p>Kart kapsamı dışındaki klinik hizmetler için MultiSport üyelerine özel indirimli seçenekler sunuyoruz.</p>
          <ul>
            <li>Kişiselleştirilmiş tedavi planları</li>
            <li>Klinik değerlendirme gerektiren hizmetler</li>
            <li>Seans planına göre netleşen fiyatlandırma</li>
          </ul>
        </article>
      </section>

      <section class="how-it-works" id="nasil-calisir" aria-labelledby="steps-title">
        <div class="steps-intro">
          <p class="eyebrow">RANDEVUDAN ÖNCE</p>
          <h2 id="steps-title">Kolayca <em>planlayalım.</em></h2>
          <p>İlk görüşmede doğru uygulamayı ve üyelik avantajınızı netleştiriyoruz.</p>
        </div>
        <ol class="steps-list">
          <li><span>1</span><div><strong>Randevu talebinizi bırakın</strong><p>İletişime geçerken MultiSport üyesi olduğunuzu belirtin.</p></div></li>
          <li><span>2</span><div><strong>Kart ve uygulama uygunluğunu teyit edelim</strong><p>Planlanan seansın kapsamını güncel koşullara göre birlikte kontrol edelim.</p></div></li>
          <li><span>3</span><div><strong>Size uygun planla başlayın</strong><p>Kapsam dahilinde ya da indirimli seçeneğinizle hareketinize yer açın.</p></div></li>
        </ol>
      </section>

      <section class="clarity-panel" aria-labelledby="clarity-title">
        <div class="clarity-stamp" aria-hidden="true">MS<br /><span>+</span></div>
        <div>
          <p class="eyebrow">ŞEFFAF BİLGİLENDİRME</p>
          <h2 id="clarity-title">Kapsam, kart türünüze ve güncel anlaşma koşullarına göre randevu öncesinde teyit edilir.</h2>
        </div>
        <a class="button button-primary" href="/?randevu=1">İletişime geçin <span aria-hidden="true">→</span></a>
      </section>
    </main>
    ${universalContactCta}

    <footer>
      <a class="brand footer-brand" href="/"><span class="brand-mark"><span></span></span><span>Fizyoterapist<small>Sılasu Turhan · Tilbe Meriç</small></span></a>
      <p>© 2026 Fizyoterapist Sılasu Turhan</p>
      <p><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6h4"></path></svg> Randevu ile hizmet verilmektedir.</p>
    </footer>
    <script>
      document.querySelectorAll('[data-contact-trigger]').forEach((button) => button.addEventListener('click', () => { window.location.href = '/?randevu=1'; }));
    </script>
    <script defer src="/navigation-unifier.js?v=fast-3"></script>
    <script defer src="/header-runtime.js?v=header-2"></script>
  </body>
</html>`;

export default function handler(_request, response) {
  response.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(multisportPage);
}
