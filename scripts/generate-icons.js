/**
 * Generate PNG icons from the SVG source for Electron.
 * Run: node scripts/generate-icons.js
 * Produces: public/icon.png (256x256) and public/icon-16.png, icon-32.png etc.
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svgPath = path.join(__dirname, "../public/icon.svg");
const svg = fs.readFileSync(svgPath);

const sizes = [16, 32, 48, 64, 128, 256];

async function main() {
  // Generate individual PNGs
  for (const size of sizes) {
    const outPath = path.join(__dirname, `../public/icon-${size}.png`);
    await sharp(svg).resize(size, size).png().toFile(outPath);
    console.log(`  ✓ icon-${size}.png`);
  }

  // Main icon.png at 256
  const mainOut = path.join(__dirname, "../public/icon.png");
  await sharp(svg).resize(256, 256).png().toFile(mainOut);
  console.log("  ✓ icon.png (256x256)");

  // For Windows .ico we embed multiple sizes into one file
  // Electron on Windows accepts .png just fine, but for the taskbar
  // we'll also create a multi-size ICO manually.
  // ICO format: header + entries + raw PNG data
  const pngBuffers = [];
  for (const size of [16, 32, 48, 256]) {
    const buf = await sharp(svg).resize(size, size).png().toBuffer();
    pngBuffers.push({ size, buf });
  }

  const icoPath = path.join(__dirname, "../public/icon.ico");
  const ico = buildIco(pngBuffers);
  fs.writeFileSync(icoPath, ico);
  console.log("  ✓ icon.ico (multi-size)");
}

function buildIco(images) {
  // ICO header: 6 bytes
  // ICO entry: 16 bytes each
  // Then raw PNG data
  const headerSize = 6;
  const entrySize = 16;
  const numImages = images.length;
  let offset = headerSize + entrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(numImages, 4);

  const entries = [];
  for (const { size, buf } of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2);  // color palette
    entry.writeUInt8(0, 3);  // reserved
    entry.writeUInt16LE(1, 4);  // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // data size
    entry.writeUInt32LE(offset, 12);    // data offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...images.map(i => i.buf)]);
}

main().then(() => console.log("Done!")).catch(console.error);
