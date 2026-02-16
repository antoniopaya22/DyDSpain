/**
 * svg-to-png.js
 *
 * Converts the generated SVG icon assets to PNG format using sharp.
 * Run this after generate-icons.js to produce the final PNG assets
 * that Expo expects.
 *
 * Usage:
 *   node scripts/generate-icons.js   # Generate SVGs first
 *   node scripts/svg-to-png.js       # Convert to PNGs
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const assetsDir = path.join(__dirname, "..", "assets");

const conversions = [
  {
    input: "icon.svg",
    output: "icon.png",
    width: 1024,
    height: 1024,
    background: { r: 13, g: 13, b: 26, alpha: 1 }, // #0d0d1a
  },
  {
    input: "adaptive-icon.svg",
    output: "adaptive-icon.png",
    width: 1024,
    height: 1024,
    background: { r: 13, g: 13, b: 26, alpha: 1 },
  },
  {
    input: "splash-icon.svg",
    output: "splash-icon.png",
    width: 512,
    height: 512,
    background: null, // transparent — splash bg color is set in app.json
  },
  {
    input: "favicon.svg",
    output: "favicon.png",
    width: 48,
    height: 48,
    background: { r: 13, g: 13, b: 26, alpha: 1 },
  },
];

async function convert(entry) {
  const inputPath = path.join(assetsDir, entry.input);
  const outputPath = path.join(assetsDir, entry.output);

  if (!fs.existsSync(inputPath)) {
    console.error(`  ❌ ${entry.input} not found — run generate-icons.js first`);
    return false;
  }

  const svgBuffer = fs.readFileSync(inputPath);

  let pipeline = sharp(svgBuffer, { density: 300 }).resize(
    entry.width,
    entry.height,
    {
      fit: "contain",
      background: entry.background || { r: 0, g: 0, b: 0, alpha: 0 },
    }
  );

  if (entry.background) {
    pipeline = pipeline.flatten({ background: entry.background });
  }

  await pipeline.png({ compressionLevel: 9, quality: 100 }).toFile(outputPath);

  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(
    `  ✅ ${entry.output} (${entry.width}×${entry.height}, ${sizeKB} KB)`
  );
  return true;
}

async function main() {
  console.log("🎲 Converting SVG icons to PNG...\n");

  let success = 0;
  let failed = 0;

  for (const entry of conversions) {
    try {
      const ok = await convert(entry);
      if (ok) success++;
      else failed++;
    } catch (err) {
      console.error(`  ❌ ${entry.output} — ${err.message}`);
      failed++;
    }
  }

  console.log("");
  if (failed === 0) {
    console.log(`🎉 All ${success} icons converted successfully!`);
    console.log("   The PNG files in assets/ are ready for Expo.");
  } else {
    console.log(
      `⚠️  ${success} succeeded, ${failed} failed. Check errors above.`
    );
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
