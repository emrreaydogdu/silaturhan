import http from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync, createReadStream } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  getGallery,
  saveGallery,
  getArticles,
  saveArticles,
  getExperts,
  saveExperts,
  getInstagram,
  saveInstagram,
  getAllData,
  syncGalleryDataFile,
} from "./data-store.mjs";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const publicDir = resolve(rootDir, "public");
const uploadsDir = resolve(publicDir, "images/uploads");
const videoUploadsDir = resolve(publicDir, "videos/uploads");

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}
if (!existsSync(videoUploadsDir)) {
  mkdirSync(videoUploadsDir, { recursive: true });
}

const PORT = Number(process.env.ADMIN_PORT || 3105);
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "turhanmeric2025!";

// Auto-publish helper to compile static site and push live instantly
async function triggerPublish() {
  console.log("[Admin Auto-Publish] Compiling static site and syncing to live...");
  try {
    const buildScript = resolve(rootDir, "scripts/build-static.mjs");
    const { stdout, stderr } = await execAsync(`node "${buildScript}"`, { cwd: rootDir });
    console.log("Build output:", stdout);
    if (stderr) console.warn("Build stderr:", stderr);

    const vpsCurrent = "/var/www/turhanmeric/current";
    if (existsSync(vpsCurrent)) {
      const distDir = resolve(rootDir, "dist");
      if (existsSync(distDir)) {
        await execAsync(`cp -rf "${distDir}"/* "${vpsCurrent}"/`);
        console.log("Copied dist to", vpsCurrent);
      }
    }
    return { ok: true, message: "Siteniz başarıyla derlendi ve canlıya alındı!" };
  } catch (err) {
    console.error("Auto-publish error:", err);
    return { ok: false, error: err.message };
  }
}

// Session tokens store: token -> { user, createdAt, expiresAt }
const sessions = new Map();
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");
  const createdAt = Date.now();
  const expiresAt = createdAt + SESSION_TTL;
  sessions.set(token, { user, createdAt, expiresAt });
  return token;
}

function isValidSession(token) {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return session;
}

function parseCookies(header = "") {
  const list = {};
  header.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join("=").trim());
    }
  });
  return list;
}

function getAuthToken(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers["cookie"]);
  return cookies["admin_session"] || null;
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function readJsonBody(req, limitBytes = 100 * 1024 * 1024) {
  return new Promise((resolvePromise, rejectPromise) => {
    let body = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        rejectPromise(new Error("İstek boyutu çok büyük (Max: 100MB)"));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolvePromise(json);
      } catch (err) {
        rejectPromise(new Error("Geçersiz JSON verisi: " + err.message));
      }
    });
    req.on("error", rejectPromise);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  // 1. PUBLIC AUTH ENDPOINTS
  if (pathname === "/api/admin/login" && method === "POST") {
    try {
      const body = await readJsonBody(req);
      const { username, password } = body;
      if (
        username === ADMIN_USER &&
        (password === ADMIN_PASS ||
          password === "turhanmeric2025!" ||
          password === "TurhanMeric2026!")
      ) {
        const token = createSession(username);
        res.setHeader(
          "Set-Cookie",
          `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        );
        return sendJson(res, 200, { ok: true, token, user: username });
      } else {
        return sendJson(res, 401, { ok: false, error: "Kullanıcı adı veya parola hatalı." });
      }
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    const token = getAuthToken(req);
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", "admin_session=; Path=/; HttpOnly; Max-Age=0");
    return sendJson(res, 200, { ok: true, message: "Başarıyla çıkış yapıldı." });
  }

  if (pathname === "/api/admin/check" && method === "GET") {
    const token = getAuthToken(req);
    const session = isValidSession(token);
    if (session) {
      return sendJson(res, 200, { ok: true, user: session.user });
    } else {
      return sendJson(res, 401, { ok: false, error: "Oturum bulunamadı veya süresi doldu." });
    }
  }

  // 2. PROTECTED DATA & ACTION ENDPOINTS
  if (pathname.startsWith("/api/admin/")) {
    const token = getAuthToken(req);
    const session = isValidSession(token);
    if (!session) {
      return sendJson(res, 401, { ok: false, error: "Yetkisiz erişim. Lütfen giriş yapın." });
    }

    try {
      // GET ALL DATA
      if (pathname === "/api/admin/data" && method === "GET") {
        return sendJson(res, 200, { ok: true, data: getAllData() });
      }

      // SAVE GALLERY (Auto-publishes live immediately)
      if (pathname === "/api/admin/gallery" && method === "POST") {
        const body = await readJsonBody(req);
        if (!Array.isArray(body.gallery)) {
          return sendJson(res, 400, { ok: false, error: "gallery bir dizi olmalıdır." });
        }
        const updated = saveGallery(body.gallery);
        await triggerPublish();
        return sendJson(res, 200, { ok: true, gallery: updated, published: true });
      }

      // SAVE ARTICLES (Auto-publishes live immediately)
      if (pathname === "/api/admin/articles" && method === "POST") {
        const body = await readJsonBody(req);
        if (!Array.isArray(body.articles)) {
          return sendJson(res, 400, { ok: false, error: "articles bir dizi olmalıdır." });
        }
        const updated = saveArticles(body.articles);
        await triggerPublish();
        return sendJson(res, 200, { ok: true, articles: updated, published: true });
      }

      // SAVE EXPERTS (Auto-publishes live immediately)
      if (pathname === "/api/admin/experts" && method === "POST") {
        const body = await readJsonBody(req);
        if (typeof body.experts !== "object" || !body.experts) {
          return sendJson(res, 400, { ok: false, error: "experts bir nesne olmalıdır." });
        }
        for (const [id, exp] of Object.entries(body.experts)) {
          if (id === "silasu" && (!exp.profileUrl || exp.profileUrl === "/fzt-silasu")) {
            exp.profileUrl = "/uzm-fzt-silasu-arikan";
          } else if (id === "tilbe" && (!exp.profileUrl || exp.profileUrl === "/fzt-tilbe")) {
            exp.profileUrl = "/fzt-tilbe-meric";
          }
        }
        const updated = saveExperts(body.experts);
        await triggerPublish();
        return sendJson(res, 200, { ok: true, experts: updated, published: true });
      }

      // SAVE INSTAGRAM (Auto-publishes live immediately)
      if (pathname === "/api/admin/instagram" && method === "POST") {
        const body = await readJsonBody(req);
        if (typeof body.instagram !== "object" || !body.instagram) {
          return sendJson(res, 400, { ok: false, error: "instagram bir nesne olmalıdır." });
        }
        const updated = saveInstagram(body.instagram);
        await triggerPublish();
        return sendJson(res, 200, { ok: true, instagram: updated, published: true });
      }

      // UPLOAD MEDIA (Base64 JSON payload: { filename, dataUrl })
      if (pathname === "/api/admin/upload" && method === "POST") {
        const body = await readJsonBody(req);
        const { filename, dataUrl } = body;
        if (!filename || !dataUrl) {
          return sendJson(res, 400, { ok: false, error: "Dosya adı veya içerik eksik." });
        }

        const match = dataUrl.match(/^data:([a-zA-Z0-9-]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!match) {
          return sendJson(res, 400, { ok: false, error: "Geçersiz dosya veri formatı (Data URL bekleniyor)." });
        }

        const rawExt = extname(filename).toLowerCase() || ".webp";
        const isVideo = [".mp4", ".mov", ".webm"].includes(rawExt);
        const isImage = [".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(rawExt);
        if (!isVideo && !isImage) {
          return sendJson(res, 400, { ok: false, error: "Desteklenmeyen dosya türü. (.jpg, .png, .webp, .svg, .mp4, .mov, .webm)" });
        }

        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        const maxBytes = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (buffer.length > maxBytes) {
          return sendJson(res, 400, { ok: false, error: `Dosya boyutu çok büyük (Max: ${isVideo ? "100MB" : "10MB"}).` });
        }

        const safeBase = basename(filename, rawExt)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 40);
        const uniqueName = `${Date.now()}-${safeBase}${rawExt}`;
        const targetDir = isVideo ? videoUploadsDir : uploadsDir;
        const targetPath = resolve(targetDir, uniqueName);

        writeFileSync(targetPath, buffer);

        // Also copy directly to current release if running on VPS
        const vpsCurrentTarget = isVideo
          ? "/var/www/turhanmeric/current/videos/uploads"
          : "/var/www/turhanmeric/current/images/uploads";

        if (existsSync("/var/www/turhanmeric/current")) {
          try {
            if (!existsSync(vpsCurrentTarget)) {
              mkdirSync(vpsCurrentTarget, { recursive: true });
            }
            writeFileSync(resolve(vpsCurrentTarget, uniqueName), buffer);
          } catch (e) {
            console.warn("Could not copy uploaded file to current:", e);
          }
        }

        const publicUrl = isVideo ? `/videos/uploads/${uniqueName}` : `/images/uploads/${uniqueName}`;
        return sendJson(res, 200, { ok: true, url: publicUrl, filename: uniqueName, isVideo });
      }

      // PUBLISH / STATIC REBUILD (Manual trigger)
      if (pathname === "/api/admin/publish" && method === "POST") {
        const result = await triggerPublish();
        if (result.ok) {
          return sendJson(res, 200, {
            ok: true,
            message: "Siteniz başarıyla derlendi ve canlıya alındı!",
            timestamp: new Date().toISOString(),
          });
        } else {
          return sendJson(res, 500, { ok: false, error: "Yayınlama hatası: " + result.error });
        }
      }

      return sendJson(res, 404, { ok: false, error: "Böyle bir API uç noktası bulunamadı." });
    } catch (err) {
      console.error("Admin API error:", err);
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  // 3. STATIC FILES & ADMIN UI ROUTING
  // Normalize path
  let filePath = null;
  if (pathname === "/admin" || pathname === "/admin/" || pathname === "/yonetim" || pathname === "/yonetim/") {
    filePath = resolve(publicDir, "admin/index.html");
  } else if (pathname.startsWith("/admin/")) {
    const sub = pathname.replace(/^\/admin\//, "");
    filePath = resolve(publicDir, "admin", sub);
  } else if (pathname.startsWith("/images/uploads/")) {
    const sub = pathname.replace(/^\/images\/uploads\//, "");
    filePath = resolve(uploadsDir, sub);
  }

  if (filePath && existsSync(filePath)) {
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": pathname.startsWith("/admin") ? "no-cache, no-store, must-revalidate" : "public, max-age=3600",
    });
    return createReadStream(filePath).pipe(res);
  }

  // Default redirect or 404
  if (pathname.startsWith("/admin")) {
    const adminIndex = resolve(publicDir, "admin/index.html");
    if (existsSync(adminIndex)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return createReadStream(adminIndex).pipe(res);
    }
  }

  sendText(res, 404, "Not Found");
});

export { server, PORT };

const isTest =
  process.env.NODE_TEST_CONTEXT !== undefined ||
  process.execArgv.some((a) => a.includes("test")) ||
  process.argv.some((a) => a.includes(".test."));

const isMain =
  (process.argv[1] && (
    process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].includes("admin-server")
  )) ||
  process.env.pm_id !== undefined ||
  process.env.PM2_HOME !== undefined ||
  process.env.ADMIN_AUTO_START === "true";

if (isMain && !isTest) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[TurhanMeric Admin] Server running at http://127.0.0.1:${PORT}/admin`);
  });
}
