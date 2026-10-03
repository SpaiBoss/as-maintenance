import sharp from "sharp";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0E2A5A"/>
  <text x="72" y="210" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="84" font-weight="700">A&amp;S Maintenance</text>
  <text x="72" y="280" fill="#F3F5F8" font-family="Arial, sans-serif" font-size="32">Quality work. Honest pricing. Reliable service.</text>
  <text x="72" y="390" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="42" font-weight="700">Call or text 612-707-3149</text>
  <text x="72" y="450" fill="#F3F5F8" font-family="Arial, sans-serif" font-size="30">Handyman services across the Twin Cities</text>
  <g>
    <rect y="540" width="1200" height="90" fill="#F5B800"/>
    ${Array.from({ length: 40 }, (_, i) => `<rect x="${i * 30}" y="540" width="2" height="${i % 5 === 0 ? 28 : 14}" fill="#151A22"/>`).join("")}
    <text x="72" y="608" fill="#151A22" font-family="Arial, sans-serif" font-size="28" font-weight="700">Twin Cities, MN</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile("public/og-default.jpg");
