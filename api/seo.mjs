const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MedicalBusiness", "LocalBusiness"],
      "@id": "https://www.turhanmeric.com/#business",
      name: "Fizyoterapistler Sılasu Turhan ve Tilbe Meriç",
      url: "https://www.turhanmeric.com/",
      image: "https://www.turhanmeric.com/images/hero-physio.png",
      telephone: "+905516467462",
      email: "silasuturhan@gmail.com",
      address: { "@type": "PostalAddress", streetAddress: "Bağlarbaşı Mah. Bağdat Cad. Yenice İş Merkezi, B Blok Daire: 26", addressLocality: "Maltepe", addressRegion: "İstanbul", addressCountry: "TR" },
      areaServed: [{ "@type": "City", name: "İstanbul" }, { "@type": "Place", name: "Maltepe" }],
      sameAs: ["https://www.instagram.com/fztsilasuarikanturhan/", "https://www.instagram.com/fzt.tilbemeric/"],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Fizyoterapi hizmetleri", itemListElement: ["Fizyoterapi ve Rehabilitasyon", "Kinezyoterapi", "Ortopedik Rehabilitasyon", "Klinik Pilates", "Manuel terapi rehabilitasyonu", "Osteopati"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })) }
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        ["Randevu nasıl oluşturabilirim?", "Randevu için 0551 646 74 62 numaralı telefondan bize doğrudan ulaşabilirsiniz. İhtiyacınızı dinleyip size uygun bir zaman planlarız."],
        ["İlk seansta neler yapılıyor?", "İlk görüşmede sizi, günlük yaşamınızdaki hedeflerinizi ve hareket ihtiyaçlarınızı dinliyor; size uygun bir yol haritası oluşturuyoruz."],
        ["Kinezyoterapi nedir?", "Kinezyoterapi; doğru dozda ve güvenli ilerleyen egzersizlerle hareket kapasitesini destekleyen, kişiye özel planlanan bir seans yaklaşımıdır."],
        ["Seansa gelirken yanımda ne getirmeliyim?", "Rahat hareket edebileceğiniz kıyafetleri tercih edebilirsiniz. Varsa önceki tetkik veya raporlarınızı yanınızda getirmeniz faydalı olur."]
      ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
    }
  ]
};

export const homeSeoMarkup = `<meta name="description" content="Maltepe, İstanbul'da Sılasu Turhan ve Tilbe Meriç ile kişiye özel fizyoterapi, kinezyoterapi ve rehabilitasyon." data-local-seo="true"/><meta name="robots" content="index,follow,max-image-preview:large" data-local-seo="true"/><link rel="canonical" href="https://www.turhanmeric.com/" data-local-seo="true"/><meta property="og:locale" content="tr_TR" data-local-seo="true"/><meta property="og:site_name" content="Fizyoterapistler Sılasu Turhan ve Tilbe Meriç" data-local-seo="true"/><script type="application/ld+json" data-local-seo="true">${JSON.stringify(homeStructuredData)}</script>`;
