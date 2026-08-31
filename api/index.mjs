import worker from "../server/index.js";

export async function render(request, fetchAsset = fetch) {
  return worker.fetch(request, {
    ASSETS: { fetch: fetchAsset },
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
