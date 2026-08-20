/* 파비콘·앱 아이콘 전용. /og/*.png 썸네일은 scripts/generate-og.js 가 담당한다. */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const FONT_PATH = path.join(__dirname, '../assets/fonts/NotoSansKR-VF.ttf');

function render(svg, outPath, width, height) {
  const sized = svg.replace(/<svg([^>]*)>/, (m, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '');
    return `<svg${cleaned} width="${width}" height="${height || width}">`;
  });
  const resvg = new Resvg(sized, {
    font: { fontFiles: [FONT_PATH], loadSystemFonts: false, defaultFontFamily: 'Noto Sans KR' },
    background: 'transparent',
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, resvg.render().asPng());
  console.log(`${outPath} ${width}x${height || width}`);
}

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs>
<linearGradient id="ac" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#00E5FF"/>
<stop offset="100%" stop-color="#B388FF"/>
</linearGradient>
</defs>
<rect width="512" height="512" fill="#0A0E27" rx="80"/>
<rect x="40" y="40" width="432" height="432" fill="url(#ac)" rx="60" opacity="0.18"/>
<text x="256" y="190" font-family="Noto Sans KR" font-size="34" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="3">DAEJEON</text>
<text x="256" y="305" font-family="Noto Sans KR" font-size="120" font-weight="900" fill="#FFFFFF" text-anchor="middle">38+</text>
<text x="256" y="410" font-family="Noto Sans KR" font-size="36" font-weight="700" fill="#B388FF" text-anchor="middle">원나이트</text>
</svg>`;

[192, 512].forEach((s) => render(icon, `public/icons/icon-${s}.png`, s, s));
render(icon, 'public/icons/apple-touch-icon.png', 180, 180);
render(icon, 'public/favicon-32x32.png', 32, 32);
render(icon, 'public/favicon-16x16.png', 16, 16);

console.log('icons done');
