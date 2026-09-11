const logoUrl =
  "https://images.seeklogo.com/logo-png/55/1/multisport-logo-png_seeklogo-557663.png";

export const multisportPage = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="MultiSport üyelerine özel fizyoterapi uygulamaları ve indirimli destek seçenekleri." />
    <meta name="theme-color" content="#12343b" />
    <title>MultiSport Üyelerine Özel | Fizyoterapist Sılasu Turhan · Tilbe Meriç</title>
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/multisport.css" />
  </head>
  <body class="multisport-page">
    <a class="skip-link" href="#icerik">İçeriğe geç</a>
    <header class="ms-header">
      <a class="clinic-mark" href="/" aria-label="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç ana sayfa">
        <span class="clinic-symbol" aria-hidden="true">×</span>
        <span><strong>Fizyoterapist</strong><small>SILASU TURHAN · TİLBE MERİÇ</small></span>
      </a>
      <nav class="ms-nav" aria-label="Ana menü">
        <a href="/#hizmetler">Hizmetler</a>
        <a href="/#yaklasim">Yaklaşımımız</a>
        <a href="/#iletisim">İletişim</a>
      </nav>
      <div class="header-links">
        <a class="back-link" href="/">Ana sayfa <span aria-hidden="true">↗</span></a>
        <a class="ms-header-cta" href="/#iletisim">Randevu <span aria-hidden="true">→</span></a>
      </div>
    </header>

    <main id="icerik">
      <section class="ms-hero" aria-labelledby="hero-title">
        <div class="hero-orbit orbit-one" aria-hidden="true"></div>
        <div class="hero-orbit orbit-two" aria-hidden="true"></div>
        <div class="hero-copy">
          <div class="partner-lockup">
            <span>İş ortağımız</span>
            <img src="${logoUrl}" alt="MultiSport" width="183" height="54" />
          </div>
          <p class="eyebrow">HAREKETİNİZE YER AÇIN</p>
          <h1 id="hero-title">MultiSport üyeliğinizle<br /><em>hareketinize</em> destek.</h1>
          <p class="hero-lede">Kartınızla kapsam dahilindeki uygulamalardan yararlanın; kapsam dışındaki klinik hizmetlerde ise size özel indirimli seçenekleri birlikte planlayalım.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/#iletisim">Randevu planla <span aria-hidden="true">→</span></a>
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
        <a class="button button-primary" href="/#iletisim">İletişime geçin <span aria-hidden="true">→</span></a>
      </section>
    </main>

    <footer class="ms-footer">
      <div class="footer-brand">
        <strong>Fizyoterapist</strong>
        <span>Sılasu Turhan · Tilbe Meriç</span>
      </div>
      <nav class="footer-nav" aria-label="Alt menü">
        <a href="/">Ana sayfa</a>
        <a href="/#hizmetler">Hizmetler</a>
        <a href="/#iletisim">İletişim</a>
        <a href="/multisport" aria-current="page">MultiSport sayfası</a>
      </nav>
      <div class="footer-meta">
        <p>© 2026 Fizyoterapist Sılasu Turhan · Tilbe Meriç</p>
        <p>MultiSport markası ilgili marka sahibine aittir.</p>
      </div>
    </footer>
  </body>
</html>`;

export default function handler(_request, response) {
  response.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(multisportPage);
}
