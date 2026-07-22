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
    font: {
      fontFiles: [FONT_PATH],
      loadSystemFonts: false,
      defaultFontFamily: 'Noto Sans KR',
    },
    background: 'transparent',
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, resvg.render().asPng());
  console.log(`${outPath} ${width}x${height || width}`);
}

const defs = `<defs>
<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#0A0E27"/>
<stop offset="55%" stop-color="#1A1F4E"/>
<stop offset="100%" stop-color="#0A0E27"/>
</linearGradient>
<linearGradient id="ac" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#00E5FF"/>
<stop offset="100%" stop-color="#B388FF"/>
</linearGradient>
<radialGradient id="glow" cx="50%" cy="40%" r="55%">
<stop offset="0%" stop-color="#00E5FF" stop-opacity="0.18"/>
<stop offset="100%" stop-color="#00E5FF" stop-opacity="0"/>
</radialGradient>
</defs>`;

const thumb = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
${defs}
<rect width="1080" height="1080" fill="url(#bg)"/>
<rect width="1080" height="1080" fill="url(#glow)"/>
<rect x="36" y="36" width="1008" height="1008" rx="24" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.55"/>
<text x="540" y="150" font-family="Noto Sans KR" font-size="34" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="10">DAEJEON ONE NIGHT</text>
<line x1="380" y1="186" x2="700" y2="186" stroke="url(#ac)" stroke-width="2"/>
<text x="540" y="232" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#B388FF" text-anchor="middle" letter-spacing="6">38세 이상 입장 · 까치 직통</text>
<text x="540" y="430" font-family="Noto Sans KR" font-size="148" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-4">대전원나이트</text>
<rect x="280" y="490" width="520" height="120" rx="60" fill="url(#ac)"/>
<text x="540" y="572" font-family="Noto Sans KR" font-size="78" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-2">까치 직통</text>
<rect x="60" y="670" width="960" height="120" rx="12" fill="rgba(0,229,255,0.10)" stroke="#00E5FF" stroke-width="2"/>
<text x="540" y="720" font-family="Noto Sans KR" font-size="28" font-weight="500" fill="#00E5FF" text-anchor="middle">38세 이상 · 신분증 확인 · 카드 결제</text>
<text x="540" y="762" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#FFFFFF" text-anchor="middle">평일 20:00 - 02:30 · 주말 20:00 - 03:30</text>
<rect x="60" y="820" width="960" height="180" rx="12" fill="#FFFFFF"/>
<text x="540" y="870" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#0A0E27" text-anchor="middle" letter-spacing="2">예약 · 안내 전화</text>
<text x="540" y="955" font-family="Noto Sans KR" font-size="72" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-2">010-3918-9414</text>
</svg>`;

render(thumb, 'public/og/og-thumb.png', 1080, 1080);

const home = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
${defs}
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.5"/>
<text x="600" y="92" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="10">DAEJEON ONE NIGHT</text>
<line x1="460" y1="118" x2="740" y2="118" stroke="url(#ac)" stroke-width="2"/>
<text x="600" y="252" font-family="Noto Sans KR" font-size="112" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-3">대전원나이트</text>
<rect x="420" y="290" width="360" height="84" rx="42" fill="url(#ac)"/>
<text x="600" y="350" font-family="Noto Sans KR" font-size="50" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-1">까치 직통</text>
<text x="600" y="418" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#B388FF" text-anchor="middle" letter-spacing="3">38세 이상 입장 · 평일 새벽 2시반 · 주말 새벽 3시반</text>
<rect x="280" y="460" width="640" height="118" rx="10" fill="rgba(0,229,255,0.10)" stroke="#00E5FF" stroke-width="2"/>
<text x="600" y="503" font-family="Noto Sans KR" font-size="22" font-weight="500" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">예약 · 안내</text>
<text x="600" y="555" font-family="Noto Sans KR" font-size="44" font-weight="900" fill="#00E5FF" text-anchor="middle" letter-spacing="-1">010-3918-9414</text>
</svg>`;

render(home, 'public/og/home.png', 1200, 630);

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

const pages = [
  { name: 'info', kicker: 'ENTRY GUIDE', title: '38세부터 들어가는 법', sub: '까치가 알려주는 첫 방문 가이드' },
  { name: 'hours', kicker: 'HOURS', title: '평일 새벽 2시반까지', sub: '주말은 새벽 3시반 · 까치 직통 응대' },
  { name: 'ladies', kicker: 'LADIES', title: '22시 전 입장 = 3만원 + 맥주', sub: '교통비 3만원 + 맥주 1병 · 까치 안내' },
  { name: 'faq', kicker: 'FAQ', title: '까치가 직접 답한 13가지', sub: '입장·예약·위치·결제 한 페이지에' },
  { name: 'contact', kicker: 'CONTACT', title: '까치 직통 010-3918-9414', sub: '예약·룸·단체 모두 까치가 응대' },
];

pages.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
${defs}
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.5"/>
<text x="600" y="84" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="8">${p.kicker}</text>
<line x1="470" y1="110" x2="730" y2="110" stroke="url(#ac)" stroke-width="2"/>
<text x="600" y="166" font-family="Noto Sans KR" font-size="40" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">대전원나이트</text>
<text x="600" y="404" font-family="Noto Sans KR" font-size="220" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">까치</text>
<text x="600" y="478" font-family="Noto Sans KR" font-size="32" font-weight="500" fill="#B388FF" text-anchor="middle">${p.title}</text>
<rect x="300" y="516" width="600" height="86" rx="43" fill="url(#ac)"/>
<text x="600" y="574" font-family="Noto Sans KR" font-size="40" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-1">까치 직통 010-3918-9414</text>
</svg>`;
  render(svg, `public/og/${p.name}.png`, 1200, 630);
});

console.log('done');
