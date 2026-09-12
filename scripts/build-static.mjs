import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { multisportPage } from "../api/multisport.mjs";
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
await writeFile(resolve(expertiseDirectory, "index.html"), await renderHome("/uzm-fzt-silasu-arikan"));

console.log(`Static site generated at ${outputRoot}`);
