import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { multisportPage } from "../api/multisport.mjs";
import { tilbeMericPage } from "../api/tilbe-meric.mjs";
import { silasuArikanPage } from "../api/silasu-arikan.mjs";
import { expertsPage } from "../api/uzmanlar.mjs";
import { blogArticles, renderArticlePage, renderBlogIndex } from "../api/blog.mjs";
import { render } from "../api/index.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = resolve(projectRoot, "public");
const outputRoot = resolve(process.env.SITE_OUTPUT_DIR ?? "dist");
const staticNavigationScript = `<script data-static-document-navigation>
document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const link = target?.closest("a[href]");
  if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
  event.preventDefault();
  window.location.assign(destination.href);
}, true);
</script>`;
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

async function fetchPublicAsset(request) {
  const url = new URL(request.url);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const assetPath = resolve(publicRoot, `.${pathname}`);
  const relativePath = relative(publicRoot, assetPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) ||
    isAbsolute(relativePath)
  ) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const contents = await readFile(assetPath);
    return new Response(contents, {
      headers: {
        "Content-Type": contentTypes.get(extname(assetPath).toLowerCase()) ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

async function renderHome(pathname = "/") {
  const response = await render(
    new Request(`https://www.turhanmeric.com${pathname}`),
    fetchPublicAsset,
  );
  if (!response.ok) {
    throw new Error(`Page render failed for ${pathname}: ${response.status}`);
  }
  const markup = await response.text();
  return markup.replace("</head>", `${staticNavigationScript}</head>`);
}

await mkdir(outputRoot, { recursive: true });
await cp(publicRoot, outputRoot, { recursive: true, force: true });

const homePage = await renderHome();
await writeFile(resolve(outputRoot, "index.html"), homePage);

const multisportDirectory = resolve(outputRoot, "multisport");
await mkdir(multisportDirectory, { recursive: true });
await writeFile(
  resolve(multisportDirectory, "index.html"),
  multisportPage.replace("</head>", `${staticNavigationScript}</head>`),
);

const expertiseDirectory = resolve(outputRoot, "uzm-fzt-silasu-arikan");
await mkdir(expertiseDirectory, { recursive: true });
await writeFile(
  resolve(expertiseDirectory, "index.html"),
  silasuArikanPage.replace("</head>", `${staticNavigationScript}</head>`),
);

const tilbeProfileDirectory = resolve(outputRoot, "fzt-tilbe-meric");
await mkdir(tilbeProfileDirectory, { recursive: true });
await writeFile(
  resolve(tilbeProfileDirectory, "index.html"),
  tilbeMericPage.replace("</head>", `${staticNavigationScript}</head>`),
);

const expertsDirectory = resolve(outputRoot, "uzmanlar");
await mkdir(expertsDirectory, { recursive: true });
await writeFile(
  resolve(expertsDirectory, "index.html"),
  expertsPage.replace("</head>", `${staticNavigationScript}</head>`),
);

const blogDirectory = resolve(outputRoot, "blog");
await mkdir(blogDirectory, { recursive: true });
await writeFile(
  resolve(blogDirectory, "index.html"),
  renderBlogIndex().replace("</head>", `${staticNavigationScript}</head>`),
);
for (const article of blogArticles) {
  const articleDirectory = resolve(blogDirectory, article.slug);
  await mkdir(articleDirectory, { recursive: true });
  await writeFile(
    resolve(articleDirectory, "index.html"),
    renderArticlePage(article).replace("</head>", `${staticNavigationScript}</head>`),
  );
}

const sitemapPaths = [
  "/",
  "/multisport/",
  "/uzm-fzt-silasu-arikan/",
  "/fzt-tilbe-meric/",
  "/uzmanlar/",
  "/blog/",
  ...blogArticles.map((article) => `/blog/${article.slug}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((pathname) => `  <url><loc>https://www.turhanmeric.com${pathname}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(resolve(outputRoot, "sitemap.xml"), sitemap);

console.log(`Static site generated at ${outputRoot}`);
