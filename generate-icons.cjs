const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = Buffer.from(`
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#7C3AED" rx="100"/>
  <text x="256" y="340" font-family="Arial" font-size="280" font-weight="bold" fill="white" text-anchor="middle">N</text>
</svg>
`);

async function generateIcons() {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile('public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile('public/pwa-512x512.png');
    
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile('public/apple-touch-icon.png');
    
  console.log("Icons generated successfully.");
}

generateIcons().catch(console.error);
