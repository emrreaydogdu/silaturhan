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

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const PORT = Number(process.env.ADMIN_PORT || 3105);
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "TurhanMeric2026!";

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

function readJsonBody(req, limitBytes = 15 * 1024 * 1024) {
  return new Promise((resolvePromise, rejectPromise) => {
    let body = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        rejectPromise(new Error("İstek boyutu çok büyük (Max: 15MB)"));
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
      if (username === ADMIN_USER && password === ADMIN_PASS) {
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

      // SAVE GALLERY
      if (pathname === "/api/admin/gallery" && method === "POST") {
        const body = await readJsonBody(req);
        if (!Array.isArray(body.gallery)) {
          return sendJson(res, 400, { ok: false, error: "gallery bir dizi olmalıdır." });
        }
        const updated = saveGallery(body.gallery);
        return sendJson(res, 200, { ok: true, gallery: updated });
      }

      // SAVE ARTICLES
      if (pathname === "/api/admin/articles" && method === "POST") {
        const body = await readJsonBody(req);
        if (!Array.isArray(body.articles)) {
          return sendJson(res, 400, { ok: false, error: "articles bir dizi olmalıdır." });
        }
        const updated = saveArticles(body.articles);
        return sendJson(res, 200, { ok: true, articles: updated });
      }

      // SAVE EXPERTS
      if (pathname === "/api/admin/experts" && method === "POST") {
        const body = await readJsonBody(req);
        if (typeof body.experts !== "object" || !body.experts) {
          return sendJson(res, 400, { ok: false, error: "experts bir nesne olmalıdır." });
        }
        const updated = saveExperts(body.experts);
        return sendJson(res, 200, { ok: true, experts: updated });
      }

      // SAVE INSTAGRAM
      if (pathname === "/api/admin/instagram" && method === "POST") {
        const body = await readJsonBody(req);
        if (typeof body.instagram !== "object" || !body.instagram) {
          return sendJson(res, 400, { ok: false, error: "instagram bir nesne olmalıdır." });
        }
        const updated = saveInstagram(body.instagram);
        return sendJson(res, 200, { ok: true, instagram: updated });
      }

      // UPLOAD IMAGE (Base64 JSON payload: { filename, dataUrl })
      if (pathname === "/api/admin/upload" && method === "POST") {
        const body = await readJsonBody(req);
        const { filename, dataUrl } = body;
        if (!filename || !dataUrl) {
          return sendJson(res, 400, { ok: false, error: "Dosya adı veya içerik eksik." });
        }

        const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!match) {
          return sendJson(res, 400, { ok: false, error: "Geçersiz resim veri formatı (Data URL bekleniyor)." });
        }

        const rawExt = extname(filename).toLowerCase() || ".webp";
        const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
        if (!allowedExts.includes(rawExt)) {
          return sendJson(res, 400, { ok: false, error: "Desteklenmeyen dosya türü. (.jpg, .png, .webp, .svg)" });
        }

        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, "base64");
        if (buffer.length > 10 * 1024 * 1024) {
          return sendJson(res, 400, { ok: false, error: "Dosya 10MB boyutunu aşamaz." });
        }

        const safeBase = basename(filename, rawExt)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 40);
        const uniqueName = `${Date.now()}-${safeBase}${rawExt}`;
        const targetPath = resolve(uploadsDir, uniqueName);

        writeFileSync(targetPath, buffer);
        const publicUrl = `/images/uploads/${uniqueName}`;

        return sendJson(res, 200, { ok: true, url: publicUrl, filename: uniqueName });
      }

      // PUBLISH / STATIC REBUILD
      if (pathname === "/api/admin/publish" && method === "POST") {
        console.log("Admin triggered build:static and publish...");
        try {
          // 1. Run static build
          const buildScript = resolve(rootDir, "scripts/build-static.mjs");
          const { stdout, stderr } = await execAsync(`node "${buildScript}"`, { cwd: rootDir });
          console.log("Build output:", stdout);
          if (stderr) console.warn("Build stderr:", stderr);

          // 2. If running on VPS /var/www/turhanmeric, sync dist to current release
          const vpsCurrent = "/var/www/turhanmeric/current";
          if (existsSync(vpsCurrent)) {
            const distDir = resolve(rootDir, "dist");
            if (existsSync(distDir)) {
              await execAsync(`cp -rf "${distDir}"/* "${vpsCurrent}"/`);
              console.log("Copied dist to", vpsCurrent);
            }
          }

          return sendJson(res, 200, {
            ok: true,
            message: "Siteniz başarıyla derlendi ve canlıya alındı!",
            timestamp: new Date().toISOString(),
          });
        } catch (buildErr) {
          console.error("Publish error:", buildErr);
          return sendJson(res, 500, { ok: false, error: "Yayınlama hatası: " + buildErr.message });
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
      "Cache-Control": ext === ".html" ? "no-cache, no-store, must-revalidate" : "public, max-age=3600",
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[TurhanMeric Admin] Server running at http://127.0.0.1:${PORT}/admin`);
  });
}
