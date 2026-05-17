import { readdir, mkdir, stat, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public/assets/photography");
const THUMB_DIR = path.join(SRC_DIR, "thumbs");
const LARGE_DIR = path.join(SRC_DIR, "large");
const MANIFEST = path.join(ROOT, "src/data/photography.json");

const THUMB_MAX = 800;
const LARGE_MAX = 2000;
const THUMB_QUALITY = 82;
const LARGE_QUALITY = 85;

const isJpg = (f) => /\.(jpe?g)$/i.test(f);

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function isStale(srcPath, outPath) {
  if (!existsSync(outPath)) return true;
  const [s, o] = await Promise.all([stat(srcPath), stat(outPath)]);
  return s.mtimeMs > o.mtimeMs;
}

async function processOne(file) {
  const srcPath = path.join(SRC_DIR, file);
  const thumbPath = path.join(THUMB_DIR, file);
  const largePath = path.join(LARGE_DIR, file);

  const needThumb = await isStale(srcPath, thumbPath);
  const needLarge = await isStale(srcPath, largePath);

  if (needThumb) {
    await sharp(srcPath)
      .rotate()
      .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
      .toFile(thumbPath);
  }
  if (needLarge) {
    await sharp(srcPath)
      .rotate()
      .resize({ width: LARGE_MAX, height: LARGE_MAX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: LARGE_QUALITY, mozjpeg: true })
      .toFile(largePath);
  }

  const meta = await sharp(thumbPath).metadata();
  return {
    file,
    width: meta.width,
    height: meta.height,
    regenerated: needThumb || needLarge,
  };
}

async function main() {
  await ensureDir(THUMB_DIR);
  await ensureDir(LARGE_DIR);
  await ensureDir(path.dirname(MANIFEST));

  const entries = (await readdir(SRC_DIR)).filter(isJpg).sort();
  const sourceSet = new Set(entries);

  let cleaned = 0;
  for (const dir of [THUMB_DIR, LARGE_DIR]) {
    const existing = (await readdir(dir)).filter(isJpg);
    for (const f of existing) {
      if (!sourceSet.has(f)) {
        await unlink(path.join(dir, f));
        cleaned++;
        console.log(`[photos] removed orphan ${path.relative(ROOT, path.join(dir, f))}`);
      }
    }
  }

  if (entries.length === 0) {
    console.log("[photos] No source JPGs found in", SRC_DIR);
    await writeFile(MANIFEST, "[]\n");
    return;
  }

  const results = [];
  let regenerated = 0;
  for (const file of entries) {
    const r = await processOne(file);
    if (r.regenerated) {
      regenerated++;
      console.log(`[photos] processed ${file} (${r.width}x${r.height})`);
    }
    results.push({ file: r.file, width: r.width, height: r.height });
  }

  const manifest = results.map(({ file, width, height }) => ({ file, width, height }));
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `[photos] ${entries.length} photos, ${regenerated} regenerated, ${cleaned} orphans removed, manifest -> ${path.relative(ROOT, MANIFEST)}`
  );
}

main().catch((err) => {
  console.error("[photos] error:", err);
  process.exit(1);
});
