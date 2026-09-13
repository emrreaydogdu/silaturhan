import worker from "../server/index.js";
import { businessGalleryMarkup } from "./business-gallery.mjs";
import { teamShowcaseMarkup } from "./team-showcase.mjs";
import { blogSectionMarkup } from "./blog.mjs";
import { homeSeoMarkup } from "./seo.mjs";

const extraStylesheets = [
  '<link rel="stylesheet" href="/instagram-feed.css?v=silasu-curated-2">',
  '<link rel="stylesheet" href="/booking-refinement.css">',
  '<link rel="stylesheet" href="/team-brand.css">',
  '<link rel="stylesheet" href="/multisport-promo.css">',
  '<link rel="stylesheet" href="/business-gallery.css">',
  '<link rel="stylesheet" href="/team-showcase.css">',
  '<link rel="stylesheet" href="/blog.css?v=home-blog-button-1">',
  '<link rel="stylesheet" href="/link-refinement.css">',
  '<link rel="stylesheet" href="/liquid-glass.css">',
].join("");
const instagramClientScript = '<script defer src="/instagram-feed.js?v=silasu-curated-2"></script>';
const siteEnhancementsScript = '<script defer src="/site-enhancements.js"></script>';
const businessGalleryScript = '<script type="module" src="/business-gallery.js"></script>';
const teamShowcaseScript = '<script type="module" src="/team-showcase.js"></script>';
const blogSliderScript = '<script defer src="/blog-slider.js"></script>';
const blogHomeScript = '<script defer src="/blog-home.js"></script>';
const blogTemplateMarkup = `<script id="blog-section-template" type="application/json">${JSON.stringify(blogSectionMarkup).replaceAll("<", "\\u003c")}</script>`;
const siteTitle = "Maltepe Fizyoterapi | Sılasu Turhan & Tilbe Meriç";
const osteopathyServiceCard = '<article data-osteopathy-service style="display:flex;align-items:center;justify-content:center"><div style="text-align:center"><h3 style="margin:0 0 10px">Osteopati</h3><p>Bütüncül değerlendirme ve manuel yaklaşımla hareket sistemine yönelik destek.</p></div></article>';
const multiSportDesktopLink = '<a href="/multisport" data-multisport-menu-link="true">MultiSport</a>';
const multiSportMobileLink = '<a href="/multisport" data-multisport-menu-link="true">MultiSport<span aria-hidden="true">↗</span></a>';
const blogDesktopLink = '<a href="/#makaleler" data-blog-menu-link="true">Makaleler</a>';
const blogMobileLink = '<a href="/#makaleler" data-blog-menu-link="true">Makaleler<span aria-hidden="true">↗</span></a>';

function addNavigationLink(markup, navigationClass, link, marker) {
  const navigationStart = markup.indexOf(`<nav class="${navigationClass}"`);
  if (navigationStart === -1) return markup;

  const navigationEnd = markup.indexOf("</nav>", navigationStart);
  if (navigationEnd === -1) return markup;

  const navigation = markup.slice(navigationStart, navigationEnd);
  if (navigation.includes(marker)) return markup;

  const updatedNavigation = navigation.replace(
    '<a href="/#iletisim">',
    `${link}<a href="/#iletisim">`,
  );
  return markup.slice(0, navigationStart) + updatedNavigation + markup.slice(navigationEnd);
}

function moveSectionBefore(markup, sourceClass, targetClass) {
  const sourceStart = markup.indexOf(`<section class="${sourceClass}"`);
  if (sourceStart === -1) return markup;

  const sectionTag = /<\/?section\b[^>]*>/g;
  sectionTag.lastIndex = sourceStart;
  let depth = 0;
  let sourceEnd = -1;
  for (let match = sectionTag.exec(markup); match; match = sectionTag.exec(markup)) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        sourceEnd = sectionTag.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }
  if (sourceEnd === -1) return markup;

  const section = markup.slice(sourceStart, sourceEnd);
  const withoutSection = markup.slice(0, sourceStart) + markup.slice(sourceEnd);
  const targetStart = withoutSection.indexOf(`<section class="${targetClass}"`);
  if (targetStart === -1) return markup;

  return withoutSection.slice(0, targetStart) + section + withoutSection.slice(targetStart);
}

function moveSectionAfter(markup, sourceClass, targetClass) {
  const sourceStart = markup.indexOf(`<section class="${sourceClass}"`);
  if (sourceStart === -1) return markup;

  const sectionTag = /<\/?section\b[^>]*>/g;
  sectionTag.lastIndex = sourceStart;
  let depth = 0;
  let sourceEnd = -1;
  for (let match = sectionTag.exec(markup); match; match = sectionTag.exec(markup)) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        sourceEnd = sectionTag.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }
  if (sourceEnd === -1) return markup;

  const section = markup.slice(sourceStart, sourceEnd);
  const withoutSection = markup.slice(0, sourceStart) + markup.slice(sourceEnd);
  const targetStart = withoutSection.indexOf(`<section class="${targetClass}"`);
  if (targetStart === -1) return markup;

  sectionTag.lastIndex = targetStart;
  depth = 0;
  let targetEnd = -1;
  for (let match = sectionTag.exec(withoutSection); match; match = sectionTag.exec(withoutSection)) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        targetEnd = sectionTag.lastIndex;
        break;
      }
    } else {
      depth += 1;
    }
  }
  if (targetEnd === -1) return markup;

  return withoutSection.slice(0, targetEnd) + section + withoutSection.slice(targetEnd);
}

function insertAfterSection(markup, sectionClass, insertedMarkup) {
  const sectionStart = markup.indexOf(`<section class="${sectionClass}"`);
  if (sectionStart === -1) return markup;

  const sectionTag = /<\/?section\b[^>]*>/g;
  sectionTag.lastIndex = sectionStart;
  let depth = 0;
  for (let match = sectionTag.exec(markup); match; match = sectionTag.exec(markup)) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) {
      return markup.slice(0, sectionTag.lastIndex) + insertedMarkup + markup.slice(sectionTag.lastIndex);
    }
  }
  return markup;
}

export async function render(request, fetchAsset = fetch) {
  const response = await worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
  });

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const pathname = new URL(request.url).pathname;
  const pageTitle =
    pathname === "/uzm-fzt-silasu-arikan"
      ? "Uzm. Fzt. Sılasu Arıkan | Maltepe Fizyoterapi"
      : siteTitle;
  const markup = await response.text();
  let enhancedMarkup = markup.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);
  if (pathname === "/uzm-fzt-silasu-arikan") {
    enhancedMarkup = enhancedMarkup
      .replace('src="/images/hero-physio.png"', 'src="/images/team/silasu-turhan.webp"')
      .replace('alt="Fizyoterapi stüdyosunda hareket egzersizi"', 'alt="Fizyoterapist Sılasu Arıkan Turhan"');
  }
  const isMultiSportPage = pathname === "/multisport";
  if (!isMultiSportPage) {
    enhancedMarkup = addNavigationLink(enhancedMarkup, "desktop-nav", multiSportDesktopLink, "data-multisport-menu-link");
    enhancedMarkup = addNavigationLink(enhancedMarkup, "mobile-menu", multiSportMobileLink, "data-multisport-menu-link");
    enhancedMarkup = addNavigationLink(enhancedMarkup, "desktop-nav", blogDesktopLink, "data-blog-menu-link");
    enhancedMarkup = addNavigationLink(enhancedMarkup, "mobile-menu", blogMobileLink, "data-blog-menu-link");
  }
  const needsOsteopathyService =
    pathname === "/" &&
    !enhancedMarkup.includes("data-osteopathy-service");
  if (needsOsteopathyService) {
    enhancedMarkup = enhancedMarkup.replace(
      /(<div class="services-grid">[\s\S]*?<\/article>)/,
      (_, firstServiceCard) => `${firstServiceCard}${osteopathyServiceCard}`,
    );
  }
  const needsTeamShowcase =
    new URL(request.url).pathname === "/" &&
    !enhancedMarkup.includes('data-team-showcase="true"');
  if (needsTeamShowcase) {
    enhancedMarkup = enhancedMarkup.replace(
      /<section class="team-section"[\s\S]*?<\/section>/,
      teamShowcaseMarkup,
    );
  }
  const isHomepage = pathname === "/";
  if (isHomepage) {
    enhancedMarkup = enhancedMarkup.replace(
      /<a class="instagram-profile-link"[\s\S]*?<\/a>/,
      "",
    );
    enhancedMarkup = moveSectionBefore(
      enhancedMarkup,
      "team-section team-showcase",
      "kinezyo-section",
    );
    enhancedMarkup = moveSectionAfter(
      enhancedMarkup,
      "instagram-section",
      "kinezyo-section",
    );
  }
  const needsBusinessGallery =
    pathname === "/" &&
    !enhancedMarkup.includes('class="business-gallery-section"');
  if (needsBusinessGallery) {
    enhancedMarkup = enhancedMarkup.replace(
      /(<section class="services-section"[\s\S]*?<\/section>)/,
      `$1${businessGalleryMarkup}`,
    );
  }
  const needsBlogSection =
    pathname === "/" &&
    !enhancedMarkup.includes('class="blog-section"');
  if (needsBlogSection) {
    enhancedMarkup = insertAfterSection(
      enhancedMarkup,
      "instagram-section",
      blogSectionMarkup,
    );
  }
  if (pathname === "/" && enhancedMarkup.includes('class="blog-section"')) {
    enhancedMarkup = moveSectionAfter(
      enhancedMarkup,
      "blog-section",
      "faq-section",
    );
  }
  const needsHomeSeo = pathname === "/" && !enhancedMarkup.includes('data-local-seo="true"');
  if (needsHomeSeo) {
    enhancedMarkup = enhancedMarkup.replace("</head>", `${homeSeoMarkup}</head>`);
  }
  const hasExtraStylesheets = [
    'href="/instagram-feed.css?v=silasu-curated-2"',
    'href="/booking-refinement.css"',
    'href="/team-brand.css"',
    'href="/multisport-promo.css"',
    'href="/business-gallery.css"',
    'href="/team-showcase.css"',
    'href="/blog.css?v=home-blog-button-1"',
    'href="/link-refinement.css"',
    'href="/liquid-glass.css"',
  ].every((stylesheet) => enhancedMarkup.includes(stylesheet));
  const hasInstagramClientScript = enhancedMarkup.includes(instagramClientScript);
  const needsInstagramClientScript =
    enhancedMarkup.includes('class="instagram-section"') && !hasInstagramClientScript;
  const needsSiteEnhancementsScript =
    enhancedMarkup.includes('class="instagram-section"') &&
    !enhancedMarkup.includes(siteEnhancementsScript);
  const needsBusinessGalleryScript =
    enhancedMarkup.includes('class="business-gallery-section"') &&
    !enhancedMarkup.includes(businessGalleryScript);
  const needsTeamShowcaseScript =
    enhancedMarkup.includes('data-team-showcase="true"') &&
    !enhancedMarkup.includes(teamShowcaseScript);
  const needsBlogSliderScript =
    enhancedMarkup.includes('class="blog-section"') &&
    !enhancedMarkup.includes(blogSliderScript);
  const needsBlogHomeScript =
    pathname === "/" &&
    !enhancedMarkup.includes(blogHomeScript);
  const needsBlogTemplate =
    pathname === "/" &&
    !enhancedMarkup.includes('id="blog-section-template"');
  const needsMultiSportNavigation =
    !isMultiSportPage &&
    (enhancedMarkup.match(/data-multisport-menu-link/g) ?? []).length < 2;
  const needsBlogNavigation =
    !isMultiSportPage &&
    (enhancedMarkup.match(/data-blog-menu-link/g) ?? []).length < 2;

  if (
    hasExtraStylesheets &&
    !needsInstagramClientScript &&
    !needsSiteEnhancementsScript &&
    !needsBusinessGalleryScript &&
    !needsTeamShowcaseScript &&
    !needsBlogSliderScript &&
    !needsBlogHomeScript &&
    !needsBlogTemplate &&
    !needsBusinessGallery &&
    !needsTeamShowcase &&
    !needsOsteopathyService &&
    !needsBlogSection &&
    !needsHomeSeo &&
    !needsMultiSportNavigation
    && !needsBlogNavigation
  ) {
    return new Response(enhancedMarkup, response);
  }

  if (needsInstagramClientScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${instagramClientScript}</body>`,
    );
  }
  if (needsSiteEnhancementsScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${siteEnhancementsScript}</body>`,
    );
  }
  if (needsBusinessGalleryScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${businessGalleryScript}</body>`,
    );
  }
  if (needsTeamShowcaseScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${teamShowcaseScript}</body>`,
    );
  }
  if (needsBlogSliderScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${blogSliderScript}</body>`,
    );
  }
  if (needsBlogHomeScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${blogHomeScript}</body>`,
    );
  }
  if (needsBlogTemplate) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${blogTemplateMarkup}</body>`,
    );
  }
  if (!hasExtraStylesheets) {
    enhancedMarkup = enhancedMarkup.replace(
      "</head>",
      `${extraStylesheets}</head>`,
    );
  }

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(enhancedMarkup, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers.host ?? "localhost";
  const init = { method: req.method, headers: req.headers };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req;
    init.duplex = "half";
  }

  const response = await render(new Request(`${protocol}://${host}${req.url}`, init));
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
