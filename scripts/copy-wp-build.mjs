#!/usr/bin/env node
/**
 * Copy the Vite/TanStack client build into the WordPress theme.
 *
 * Source candidates (checked in order — first match wins):
 *   1. dist-wp/                       (from `npm run build:wp`, plain SPA build)
 *   2. dist-wp/client/                (TanStack split build)
 *   3. .output/public/                (TanStack + Cloudflare default)
 *   4. dist/client/                   (alt TanStack output)
 *   5. dist/                          (legacy)
 *
 * A "valid" source contains either `.vite/manifest.json` OR
 * `assets/index-*.js` so the WP enqueue.php loader can resolve entries.
 *
 * Destination: wordpress-theme/ivan-sedative-theme/assets/app/
 * The destination is wiped before copy. Sibling folders inside the theme
 * (admin/, *.php, etc.) are NEVER touched.
 */
import { existsSync, rmSync, mkdirSync, cpSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const dest = join(root, "wordpress-theme/ivan-sedative-theme/assets/app");

const candidates = [
  "dist-wp",
  "dist-wp/client",
  ".output/public",
  "dist/client",
  "dist",
];

function hasClientAssets(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  if (existsSync(join(dir, ".vite/manifest.json"))) return true;
  if (existsSync(join(dir, "manifest.json"))) return true;
  const assetsDir = join(dir, "assets");
  if (existsSync(assetsDir) && statSync(assetsDir).isDirectory()) {
    const files = readdirSync(assetsDir);
    if (files.some((f) => /^index-.*\.(js|css)$/.test(f))) return true;
  }
  return false;
}

let source = null;
for (const c of candidates) {
  const full = join(root, c);
  if (hasClientAssets(full)) { source = full; break; }
}

if (!source) {
  console.error("[copy-wp-build] No client build found. Looked in:");
  for (const c of candidates) console.error("  - " + c);
  console.error("Run `npm run build:wp` first (or `npm run build` for TanStack default).");
  process.exit(1);
}

console.log("[copy-wp-build] Source: " + source);
console.log("[copy-wp-build] Dest:   " + dest);

// Wipe destination contents but keep the folder itself.
if (existsSync(dest)) {
  for (const entry of readdirSync(dest)) {
    rmSync(join(dest, entry), { recursive: true, force: true });
  }
} else {
  mkdirSync(dest, { recursive: true });
}

cpSync(source, dest, { recursive: true });

// Verify
const manifest = existsSync(join(dest, ".vite/manifest.json"));
const assetsDir = join(dest, "assets");
let jsCount = 0;
let cssCount = 0;
if (existsSync(assetsDir)) {
  for (const f of readdirSync(assetsDir)) {
    if (/^index-.*\.js$/.test(f)) jsCount++;
    if (/^index-.*\.css$/.test(f)) cssCount++;
  }
}
console.log(`[copy-wp-build] manifest.json: ${manifest ? "yes" : "no (fallback glob will be used)"}`);
console.log(`[copy-wp-build] index-*.js:    ${jsCount}`);
console.log(`[copy-wp-build] index-*.css:   ${cssCount}`);

if (!manifest && jsCount === 0) {
  console.error("[copy-wp-build] WARNING: no manifest and no index-*.js found. WP enqueue will fail.");
  process.exit(2);
}
console.log("[copy-wp-build] Done.");