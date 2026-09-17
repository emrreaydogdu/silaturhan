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
  execSync(`tar.exe -czf ${archiveName} -C dist .`, { stdio: "inherit" });

  // 4. Connect to SSH
  console.log(`\n[3/6] Connecting to Hetzner VPS (${HOST})...`);
  const ssh = new NodeSSH();
  await ssh.connect({
    host: HOST,
    username: USERNAME,
    password: PASSWORD,
    tryKeyboard: true,
    readyTimeout: 20000,
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

    console.log("Setting correct permissions...");
    await exec(ssh, `find "${releaseDir}" -type d -exec chmod 755 {} + && find "${releaseDir}" -type f -exec chmod 644 {} +`);

    // 5. Update Nginx configuration
    console.log("\n[5/6] Updating Nginx configuration on VPS...");
    await ssh.putFile("deploy/nginx-turhanmeric.conf", "/etc/nginx/sites-available/turhanmeric.com");
    await exec(ssh, "nginx -t");

    // 6. Switch symlink atomically & reload Nginx
    console.log("\n[6/6] Activating release and reloading Nginx...");
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

    console.log(`- Homepage has KVKK: ${hasKvkk}`);
    console.log(`- Homepage has Tilbe number (+90 551 841 88 80): ${hasTilbe}`);
    console.log(`- /kvkk HTTP status: ${checkKvkk.stdout.trim()}`);
    console.log(`- /kvkk/ HTTP status: ${checkKvkkSlash.stdout.trim()}`);

  } finally {
    ssh.dispose();
    if (existsSync(archiveName)) {
      rmSync(archiveName);
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
