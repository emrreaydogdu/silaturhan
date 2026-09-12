import worker from "../server/index.js";

const extraStylesheets = [
  '<link rel="stylesheet" href="/instagram-feed.css">',
  '<link rel="stylesheet" href="/booking-refinement.css">',
  '<link rel="stylesheet" href="/team-brand.css">',
  '<link rel="stylesheet" href="/multisport-promo.css">',
].join("");
const instagramClientScript = '<script defer src="/instagram-feed.js"></script>';
const siteEnhancementsScript = '<script defer src="/site-enhancements.js"></script>';
const osteopathyServiceCard = '<article data-osteopathy-service style="display:flex;align-items:center;justify-content:center"><div style="text-align:center"><h3 style="margin:0 0 10px">Osteopati</h3><p>Bütüncül değerlendirme ve manuel yaklaşımla hareket sistemine yönelik destek.</p></div></article>';

export async function render(request, fetchAsset = fetch) {
  const response = await worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
  });

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const markup = await response.text();
  let enhancedMarkup = markup;
  const needsOsteopathyService =
    new URL(request.url).pathname === "/" &&
    !enhancedMarkup.includes("data-osteopathy-service");
  if (needsOsteopathyService) {
    enhancedMarkup = enhancedMarkup.replace(
      /(<div class="services-grid">[\s\S]*?)(<\/div><\/section>)/,
      (_, serviceCards, sectionEnd) => `${serviceCards}${osteopathyServiceCard}${sectionEnd}`,
    );
  }
  const hasExtraStylesheets = [
    'href="/instagram-feed.css"',
    'href="/booking-refinement.css"',
    'href="/team-brand.css"',
    'href="/multisport-promo.css"',
  ].every((stylesheet) => enhancedMarkup.includes(stylesheet));
  const hasInstagramClientScript = enhancedMarkup.includes(instagramClientScript);
  const needsInstagramClientScript =
    enhancedMarkup.includes('class="instagram-section"') && !hasInstagramClientScript;
  const needsSiteEnhancementsScript =
    enhancedMarkup.includes('class="instagram-section"') &&
    !enhancedMarkup.includes(siteEnhancementsScript);

  if (
    hasExtraStylesheets &&
    !needsInstagramClientScript &&
    !needsSiteEnhancementsScript &&
    !needsOsteopathyService
  ) {
    return new Response(markup, response);
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
