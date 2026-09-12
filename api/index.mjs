import worker from "../server/index.js";

const extraStylesheets = [
  '<link rel="stylesheet" href="/instagram-feed.css">',
  '<link rel="stylesheet" href="/booking-refinement.css">',
  '<link rel="stylesheet" href="/team-brand.css">',
].join("");
const instagramEmbedScript = '<script async src="https://www.instagram.com/embed.js"></script>';

export async function render(request, fetchAsset = fetch) {
  const response = await worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
  });

  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }

  const markup = await response.text();
  const hasExtraStylesheets =
    markup.includes('href="/instagram-feed.css"') &&
    markup.includes('href="/booking-refinement.css"') &&
    markup.includes('href="/team-brand.css"');
  const hasInstagramEmbedScript = markup.includes(instagramEmbedScript);
  const needsInstagramEmbedScript =
    markup.includes('class="instagram-section"') && !hasInstagramEmbedScript;

  if (hasExtraStylesheets && !needsInstagramEmbedScript) {
    return new Response(markup, response);
  }

  let enhancedMarkup = markup;
  if (needsInstagramEmbedScript) {
    enhancedMarkup = enhancedMarkup.replace(
      "</body>",
      `${instagramEmbedScript}</body>`,
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
