const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const FONT = fs.readFileSync(path.join(__dirname, '../assets/fonts/NotoSansKR-VF.ttf'));

function render(svg, outPath, width, height) {
  const sized = svg.replace(/<svg([^>]*)>/, (m, attrs) => {
    const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, '');
    return `<svg${cleaned} width="${width}" height="${height || width}">`;
  });
  const resvg = new Resvg(sized, {
    font: { fontBuffers: [FONT], defaultFontFamily: 'Noto Sans KR' },
    background: 'transparent',
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, resvg.render().asPng());
  console.log(`${outPath} ${width}x${height || width}`);
}

const thumb = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs>
<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#0A0E27"/>
<stop offset="50%" stop-color="#1A1F4E"/>
<stop offset="100%" stop-color="#0A0E27"/>
</linearGradient>
<linearGradient id="ac" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#00E5FF"/>
<stop offset="100%" stop-color="#B388FF"/>
</linearGradient>
</defs>
<rect width="1080" height="1080" fill="url(#bg)"/>
<line x1="60" y1="180" x2="1020" y2="180" stroke="url(#ac)" stroke-width="2"/>
<text x="540" y="110" font-family="Noto Sans KR" font-size="36" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="8">DAEJEON ONE NIGHT</text>
<text x="540" y="160" font-family="Noto Sans KR" font-size="22" font-weight="300" fill="#B388FF" text-anchor="middle" letter-spacing="4">막내 직통 안내 · 38세 이상 입장</text>
<text x="540" y="290" font-family="Noto Sans KR" font-size="78" font-weight="900" fill="#FFFFFF" text-anchor="middle">대전원나이트</text>
<text x="540" y="370" font-family="Noto Sans KR" font-size="44" font-weight="700" fill="url(#ac)" text-anchor="middle">막내가 직접 받습니다</text>
<rect x="60" y="430" width="960" height="110" rx="8" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" stroke-width="2"/>
<text x="540" y="478" font-family="Noto Sans KR" font-size="30" font-weight="700" fill="#00E5FF" text-anchor="middle">38세 이상 입장 · 신분증 확인</text>
<text x="540" y="518" font-family="Noto Sans KR" font-size="22" font-weight="400" fill="#FFFFFF" text-anchor="middle">평일 20:00 - 02:30 / 주말 20:00 - 03:30</text>
<rect x="60" y="570" width="960" height="260" rx="8" fill="rgba(179,136,255,0.08)" stroke="#B388FF" stroke-width="2"/>
<text x="540" y="625" font-family="Noto Sans KR" font-size="28" font-weight="700" fill="#B388FF" text-anchor="middle">22시 이전 입장 여성 손님</text>
<line x1="200" y1="655" x2="880" y2="655" stroke="#B388FF" stroke-width="1" opacity="0.5"/>
<text x="540" y="710" font-family="Noto Sans KR" font-size="30" font-weight="700" fill="#00E5FF" text-anchor="middle">교통비 3만원 지원</text>
<text x="540" y="760" font-family="Noto Sans KR" font-size="30" font-weight="700" fill="#00E5FF" text-anchor="middle">맥주 1병 기본 제공</text>
<text x="540" y="810" font-family="Noto Sans KR" font-size="18" font-weight="400" fill="#A6ACD4" text-anchor="middle">신분증 확인 후 적용 · 운영 정책에 따라 변경될 수 있습니다</text>
<rect x="60" y="870" width="960" height="160" rx="8" fill="#FFFFFF"/>
<text x="540" y="920" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#0A0E27" text-anchor="middle">예약 · 안내</text>
<text x="540" y="975" font-family="Noto Sans KR" font-size="40" font-weight="900" fill="#0A0E27" text-anchor="middle">막내 직통</text>
<text x="540" y="1015" font-family="Noto Sans KR" font-size="40" font-weight="900" fill="#0A0E27" text-anchor="middle">010-8677-1258</text>
</svg>`;

render(thumb, 'public/og/og-thumb.png', 1080, 1080);

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
  { name: 'home', kicker: 'DAEJEON ONE NIGHT', title: '대전원나이트', sub: '막내가 직접 받습니다 · 38세 이상 입장' },
  { name: 'info', kicker: 'ENTRY GUIDE', title: '38세부터 들어가는 법', sub: '막내가 알려주는 첫 방문 가이드' },
  { name: 'hours', kicker: 'HOURS', title: '평일 새벽 2시반까지', sub: '주말은 새벽 3시반 · 막내 직통 응대' },
  { name: 'ladies', kicker: 'LADIES', title: '22시 전 입장 = 3만원 + 맥주', sub: '교통비 3만원 + 맥주 1병 · 막내 안내' },
  { name: 'faq', kicker: 'FAQ', title: '막내가 직접 답한 13가지', sub: '입장·예약·위치·결제 한 페이지에' },
  { name: 'contact', kicker: 'CONTACT', title: '막내 직통 010-8677-1258', sub: '예약·룸·단체 모두 막내가 응대' },
];

pages.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#0A0E27"/>
<stop offset="100%" stop-color="#1A1F4E"/>
</linearGradient>
<linearGradient id="ac" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#00E5FF"/>
<stop offset="100%" stop-color="#B388FF"/>
</linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<line x1="80" y1="100" x2="1120" y2="100" stroke="url(#ac)" stroke-width="2"/>
<text x="600" y="80" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="5">${p.kicker}</text>
<text x="600" y="270" font-family="Noto Sans KR" font-size="60" font-weight="900" fill="#FFFFFF" text-anchor="middle">${p.title}</text>
<text x="600" y="345" font-family="Noto Sans KR" font-size="28" font-weight="400" fill="#B388FF" text-anchor="middle">${p.sub}</text>
<rect x="280" y="440" width="640" height="110" rx="8" fill="rgba(0,229,255,0.1)" stroke="#00E5FF" stroke-width="2"/>
<text x="600" y="485" font-family="Noto Sans KR" font-size="24" font-weight="500" fill="#FFFFFF" text-anchor="middle">예약 · 안내</text>
<text x="600" y="525" font-family="Noto Sans KR" font-size="34" font-weight="900" fill="#00E5FF" text-anchor="middle">막내 직통 010-8677-1258</text>
</svg>`;
  render(svg, `public/og/${p.name}.png`, 1200, 630);
});

console.log('done');
