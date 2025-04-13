const fs = require('fs');
const path = require('path');

const browser = process.argv[2]; // 'firefox' or 'chromium'
const version = process.argv[3]; // Version number passed as argument

if (!browser || !['firefox', 'chromium'].includes(browser)) {
  console.error("Please specify the target browser: firefox or chromium");
  process.exit(1);
}

if (!version) {
  console.error("Please specify the version number.");
  process.exit(1);
}

const distDir = path.join(__dirname, 'dist', `privy.${browser}.v.${version}`); // Create version-specific dist folder
const srcDir = path.join(__dirname, 'src');
const manifestFile = path.join(__dirname, `manifest.${browser}.json`);
const outputManifest = path.join(distDir, 'manifest.json');

// 1. Clean or create version-specific dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true }); // Ensure the version folder exists

// 2. Copy all files from src to version-specific dist folder
function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath);
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(srcDir, distDir);

// 3. Copy the correct manifest file
fs.copyFileSync(manifestFile, outputManifest);

// 4. Update the version number in the manifest
const manifest = JSON.parse(fs.readFileSync(outputManifest, 'utf-8'));

fs.writeFileSync(outputManifest, JSON.stringify(manifest, null, 2)); // Save the modified manifest

console.log(`✅ Build complete for ${browser} version ${version}. Files are in dist/privy.${browser}.v.${version}/`);