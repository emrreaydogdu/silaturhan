import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeSshPath = "c:/Users/egem2/Desktop/Projeler/yazlikreklam/yazlik-kafe-menusu/node_modules/node-ssh";
const { NodeSSH } = require(nodeSshPath);

const HOST = "178.105.53.38";
const USERNAME = "root";
const PASSWORD = process.env.VPS_PASSWORD || "Egemo070425.";
const REMOTE_BASE = "/var/www/turhanmeric";

async function main() {
  console.log("=== Deploying turhanmeric.com to VPS ===");

  // 1. Get commit SHA
  const commitSha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  console.log(`Commit SHA: ${commitSha}`);

  // 2. Build static files
  console.log("\n[1/6] Building static site...");
  execSync("node scripts/build-static.mjs", { stdio: "inherit" });

  // 3. Package dist into tar.gz
  console.log("\n[2/6] Packaging dist/ archive...");
  const archiveName = "turhanmeric-dist.tar.gz";
  if (existsSync(archiveName)) {
    rmSync(archiveName);
  }
  execSync(`tar.exe --exclude="videos" -czf ${archiveName} -C dist .`, { stdio: "inherit" });

  // 4. Connect to SSH
  console.log(`\n[3/6] Connecting to Hetzner VPS (${HOST})...`);
  const ssh = new NodeSSH();
  await ssh.connect({
    host: HOST,
    username: USERNAME,
    password: PASSWORD,
    tryKeyboard: true,
    readyTimeout: 30000,
    keepaliveInterval: 10000,
    keepaliveCountMax: 10,
  });
  console.log("Connected successfully!");

  try {
    const releaseDir = `${REMOTE_BASE}/releases/${commitSha}/dist`;
    const remoteArchive = `${REMOTE_BASE}/releases/${commitSha}.tar.gz`;

    console.log(`\n[4/6] Creating release directory: ${releaseDir}`);
    await exec(ssh, `mkdir -p "${releaseDir}"`);

    console.log("Uploading archive to VPS...");
    await ssh.putFile(archiveName, remoteArchive);

    console.log("Extracting archive...");
    await exec(ssh, `tar -xzf "${remoteArchive}" -C "${releaseDir}"`);
    await exec(ssh, `rm -f "${remoteArchive}"`);

    // Ensure videos are present in releaseDir from current or app
    await exec(ssh, `if [ -d "${REMOTE_BASE}/current/videos" ]; then cp -rn "${REMOTE_BASE}/current/videos" "${releaseDir}/"; fi`);
    await exec(ssh, `if [ -d "${REMOTE_BASE}/app/public/videos" ]; then cp -rn "${REMOTE_BASE}/app/public/videos" "${releaseDir}/"; fi`);

    console.log("Setting correct permissions...");
    await exec(ssh, `find "${releaseDir}" -type d -exec chmod 755 {} + && find "${releaseDir}" -type f -exec chmod 644 {} +`);

    // 5. Package backend app into tar.gz
    console.log("\n[5/8] Packaging backend app...");
    const appArchive = "turhanmeric-app.tar.gz";
    if (existsSync(appArchive)) {
      rmSync(appArchive);
    }
    execSync(`tar.exe --exclude="public/videos" --exclude="public/images" -czf ${appArchive} server data public scripts api package.json`, { stdio: "inherit" });

    const remoteAppDir = `${REMOTE_BASE}/app`;
    const remoteAppArchive = `${REMOTE_BASE}/turhanmeric-app.tar.gz`;
    console.log(`Uploading backend app to VPS (${remoteAppDir})...`);
    await exec(ssh, `mkdir -p "${remoteAppDir}/public/images/uploads" "${remoteAppDir}/public/videos/uploads"`);
    await ssh.putFile(appArchive, remoteAppArchive);
    await exec(ssh, `tar -xzf "${remoteAppArchive}" -C "${remoteAppDir}"`);
    await exec(ssh, `rm -f "${remoteAppArchive}"`);

    // Sync media assets locally on VPS from releaseDir into app
    console.log("Syncing media assets into app on VPS...");
    await exec(ssh, `mkdir -p "${remoteAppDir}/public/videos" "${remoteAppDir}/public/images" "${remoteAppDir}/public/videos/uploads" "${remoteAppDir}/public/images/uploads"`);
    await exec(ssh, `if [ -d "${releaseDir}/videos" ]; then cp -rn "${releaseDir}/videos"/* "${remoteAppDir}/public/videos/"; fi`);
    await exec(ssh, `if [ -d "${releaseDir}/images" ]; then cp -rn "${releaseDir}/images"/* "${remoteAppDir}/public/images/"; fi`);

    // 6. Update Nginx configuration
    console.log("\n[6/8] Updating Nginx configuration on VPS...");
    await ssh.putFile("deploy/nginx-turhanmeric.conf", "/etc/nginx/sites-available/turhanmeric.com");
    await exec(ssh, "nginx -t");

    // 7. Start/Restart PM2 Admin Server
    console.log("\n[7/8] Starting / restarting PM2 admin server process...");
    await exec(ssh, `cd "${remoteAppDir}" && (pm2 restart turhanmeric-admin || pm2 start server/admin-server.mjs --name turhanmeric-admin --watch=false)`);
    await exec(ssh, "pm2 save");
    console.log("Waiting 2 seconds for PM2 server to initialize...");
    await new Promise((r) => setTimeout(r, 2000));

    // 8. Switch symlink atomically & reload Nginx
    console.log("\n[8/8] Activating release and reloading Nginx...");
    await exec(ssh, `ln -sfn "${releaseDir}" "${REMOTE_BASE}/current.next" && mv -Tf "${REMOTE_BASE}/current.next" "${REMOTE_BASE}/current"`);
    await exec(ssh, "systemctl reload nginx");

    const currentLink = await exec(ssh, `readlink -f "${REMOTE_BASE}/current"`);
    console.log(`Active release: ${currentLink.stdout.trim()}`);

    // Verify on VPS
    console.log("\n=== Verifying on VPS ===");
    const checkHome = await exec(ssh, `curl -s -H "Host: www.turhanmeric.com" http://127.0.0.1/`);
    const hasKvkk = checkHome.stdout.includes("KVKK") || checkHome.stdout.includes("kvkk");
    const hasTilbe = checkHome.stdout.includes("551 841 88 80");
    const checkKvkk = await exec(ssh, `curl -s -o /dev/null -w "%{http_code}" -H "Host: www.turhanmeric.com" http://127.0.0.1/kvkk`);
    const checkKvkkSlash = await exec(ssh, `curl -s -o /dev/null -w "%{http_code}" -H "Host: www.turhanmeric.com" http://127.0.0.1/kvkk/`);

    const checkAdminLocal = await exec(ssh, `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3105/admin`);
    const checkAdminNginx = await exec(ssh, `curl -s -o /dev/null -w "%{http_code}" -H "Host: www.turhanmeric.com" http://127.0.0.1/admin`);
    const checkAdminApi = await exec(ssh, `curl -s -o /dev/null -w "%{http_code}" -H "Host: www.turhanmeric.com" http://127.0.0.1/api/admin/check`);

    console.log(`- Homepage has KVKK: ${hasKvkk}`);
    console.log(`- Homepage has Tilbe number (+90 551 841 88 80): ${hasTilbe}`);
    console.log(`- /kvkk HTTP status: ${checkKvkk.stdout.trim()}`);
    console.log(`- /kvkk/ HTTP status: ${checkKvkkSlash.stdout.trim()}`);
    console.log(`- Admin local port 3105 status: ${checkAdminLocal.stdout.trim()}`);
    console.log(`- Admin via Nginx (/admin) status: ${checkAdminNginx.stdout.trim()}`);
    console.log(`- Admin auth check (/api/admin/check) status: ${checkAdminApi.stdout.trim()}`);

  } finally {
    ssh.dispose();
    if (existsSync(archiveName)) {
      rmSync(archiveName);
    }
    if (existsSync("turhanmeric-app.tar.gz")) {
      rmSync("turhanmeric-app.tar.gz");
    }
  }

  console.log("\n✅ Deployment to VPS completed successfully!");
}

async function exec(ssh, cmd) {
  const res = await ssh.execCommand(cmd);
  if (res.code !== 0 && res.code !== null) {
    throw new Error(`Command failed (${res.code}): ${cmd}\nSTDERR: ${res.stderr}\nSTDOUT: ${res.stdout}`);
  }
  return res;
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
