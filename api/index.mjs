import worker from "../server/index.js";

const extraStylesheets = [
  '<link rel="stylesheet" href="/instagram-feed.css">',
  '<link rel="stylesheet" href="/booking-refinement.css">',
  '<link rel="stylesheet" href="/team-brand.css">',
  '<link rel="stylesheet" href="/multisport-promo.css">',
].join("");
const instagramClientScript = '<script defer src="/instagram-feed.js"></script>';
const siteEnhancementsScript = '<script defer src="/site-enhancements.js"></script>';

export async function render(request, fetchAsset = fetch) {
  const response = await worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
  });

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const markup = await response.text();
  let enhancedMarkup = markup;
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

  if (hasExtraStylesheets && !needsInstagramClientScript && !needsSiteEnhancementsScript) {
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
