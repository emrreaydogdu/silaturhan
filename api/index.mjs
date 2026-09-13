import worker from "../server/index.js";
import { businessGalleryMarkup } from "./business-gallery.mjs";
import { teamShowcaseMarkup } from "./team-showcase.mjs";

const extraStylesheets = [
  '<link rel="stylesheet" href="/instagram-feed.css">',
  '<link rel="stylesheet" href="/booking-refinement.css">',
  '<link rel="stylesheet" href="/team-brand.css">',
  '<link rel="stylesheet" href="/multisport-promo.css">',
  '<link rel="stylesheet" href="/business-gallery.css">',
  '<link rel="stylesheet" href="/team-showcase.css">',
].join("");
const instagramClientScript = '<script defer src="/instagram-feed.js"></script>';
const siteEnhancementsScript = '<script defer src="/site-enhancements.js"></script>';
const businessGalleryScript = '<script type="module" src="/business-gallery.js"></script>';
const teamShowcaseScript = '<script type="module" src="/team-showcase.js"></script>';
const siteTitle = "Fizyoterapistler Sılasu Turhan & Tilbe Meriç | Kinezyoterapi";
const osteopathyServiceCard = '<article data-osteopathy-service style="display:flex;align-items:center;justify-content:center"><div style="text-align:center"><h3 style="margin:0 0 10px">Osteopati</h3><p>Bütüncül değerlendirme ve manuel yaklaşımla hareket sistemine yönelik destek.</p></div></article>';
const multiSportDesktopLink = '<a href="/multisport" data-multisport-menu-link="true">MultiSport</a>';
const multiSportMobileLink = '<a href="/multisport" data-multisport-menu-link="true">MultiSport<span aria-hidden="true">↗</span></a>';

function addNavigationLink(markup, navigationClass, link) {
  const navigationStart = markup.indexOf(`<nav class="${navigationClass}"`);
  if (navigationStart === -1) return markup;

  const navigationEnd = markup.indexOf("</nav>", navigationStart);
  if (navigationEnd === -1) return markup;

  const navigation = markup.slice(navigationStart, navigationEnd);
  if (navigation.includes("data-multisport-menu-link")) return markup;

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

export async function render(request, fetchAsset = fetch) {
  const response = await worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
  });

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const markup = await response.text();
  let enhancedMarkup = markup.replace(/<title>[^<]*<\/title>/, `<title>${siteTitle}</title>`);
  const isMultiSportPage = new URL(request.url).pathname === "/multisport";
  if (!isMultiSportPage) {
    enhancedMarkup = addNavigationLink(enhancedMarkup, "desktop-nav", multiSportDesktopLink);
    enhancedMarkup = addNavigationLink(enhancedMarkup, "mobile-menu", multiSportMobileLink);
  }
  const needsOsteopathyService =
    new URL(request.url).pathname === "/" &&
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
  const isHomepage = new URL(request.url).pathname === "/";
  if (isHomepage) {
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
    new URL(request.url).pathname === "/" &&
    !enhancedMarkup.includes('class="business-gallery-section"');
  if (needsBusinessGallery) {
    enhancedMarkup = enhancedMarkup.replace(
      /(<section class="services-section"[\s\S]*?<\/section>)/,
      `$1${businessGalleryMarkup}`,
    );
  }
  const hasExtraStylesheets = [
    'href="/instagram-feed.css"',
    'href="/booking-refinement.css"',
    'href="/team-brand.css"',
    'href="/multisport-promo.css"',
    'href="/business-gallery.css"',
    'href="/team-showcase.css"',
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
  const needsMultiSportNavigation =
    !isMultiSportPage &&
    (enhancedMarkup.match(/data-multisport-menu-link/g) ?? []).length < 2;

  if (
    hasExtraStylesheets &&
    !needsInstagramClientScript &&
    !needsSiteEnhancementsScript &&
    !needsBusinessGalleryScript &&
    !needsTeamShowcaseScript &&
    !needsBusinessGallery &&
    !needsTeamShowcase &&
    !needsOsteopathyService &&
    !needsMultiSportNavigation
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
