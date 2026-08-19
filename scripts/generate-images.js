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
<text x="540" y="232" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#B388FF" text-anchor="middle" letter-spacing="6">38세 이상 입장 · 광고 문의</text>
<text x="540" y="430" font-family="Noto Sans KR" font-size="148" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-4">대전원나이트</text>
<rect x="280" y="490" width="520" height="120" rx="60" fill="url(#ac)"/>
<text x="540" y="572" font-family="Noto Sans KR" font-size="78" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-2">광고 문의</text>
<rect x="60" y="670" width="960" height="120" rx="12" fill="rgba(0,229,255,0.10)" stroke="#00E5FF" stroke-width="2"/>
<text x="540" y="720" font-family="Noto Sans KR" font-size="28" font-weight="500" fill="#00E5FF" text-anchor="middle">38세 이상 · 신분증 확인 · 카드 결제</text>
<text x="540" y="762" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#FFFFFF" text-anchor="middle">평일 20:00 - 02:30 · 주말 20:00 - 03:30</text>
<rect x="60" y="820" width="960" height="180" rx="12" fill="#FFFFFF"/>
<text x="540" y="870" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#0A0E27" text-anchor="middle" letter-spacing="2">광고문의 카카오톡</text>
<text x="540" y="955" font-family="Noto Sans KR" font-size="72" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-2">카톡 besta12</text>
</svg>`;

render(thumb, 'public/og/og-thumb.png', 1200, 1200);

/* 홈 썸네일 — 배경 단색 브라운, "광고문의"가 가장 크고 그 아래 "카카오톡 besta12" */
const home = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
<rect width="1200" height="1200" fill="#5A3A1E"/>
<rect x="26" y="26" width="1148" height="1148" rx="14" fill="none" stroke="#F7EFE1" stroke-width="3" opacity="0.55"/>
<g transform="translate(0,285)">
<text x="600" y="112" font-family="Noto Sans KR" font-size="34" font-weight="700" fill="#F7EFE1" text-anchor="middle" letter-spacing="8">다시 시작하는 이야기</text>
<text x="600" y="330" font-family="Noto Sans KR" font-size="184" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" text-anchor="middle" letter-spacing="-6">광고문의</text>
<rect x="180" y="404" width="840" height="150" rx="12" fill="#FFFFFF"/>
<text x="600" y="462" font-family="Noto Sans KR" font-size="34" font-weight="700" fill="#5A3A1E" text-anchor="middle" letter-spacing="4">카카오톡</text>
<text x="600" y="534" font-family="Noto Sans KR" font-size="76" font-weight="900" fill="#3A2C21" text-anchor="middle" letter-spacing="-1">besta12</text>
<text x="600" y="592" font-family="Noto Sans KR" font-size="24" font-weight="400" fill="#F7EFE1" text-anchor="middle" opacity="0.85">업소 사장님 대상 광고 입점 채널</text>
</g>
</svg>`;

render(home, 'public/og/home.png', 1200, 1200);

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
  { name: 'info', kicker: 'ENTRY GUIDE', title: '38세부터 들어가는 법', sub: '처음이라면 꼭 보는 첫 방문 가이드' },
  { name: 'hours', kicker: 'HOURS', title: '평일 새벽 2시반까지', sub: '주말은 새벽 3시반 · 카톡 문의 응대' },
  { name: 'ladies', kicker: 'LADIES', title: '22시 전 입장 = 3만원 + 맥주', sub: '교통비 3만원 + 맥주 1병 · 예약 안내' },
  { name: 'faq', kicker: 'FAQ', title: '자주 묻는 13가지 답변', sub: '입장·예약·위치·결제 한 페이지에' },
  { name: 'contact', kicker: 'CONTACT', title: '예약·룸·단체 문의 안내', sub: '예약·룸·단체 모두 안내' },
];

pages.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
${defs}
<rect width="1200" height="1200" fill="url(#bg)"/>
<rect width="1200" height="1200" fill="url(#glow)"/>
<rect x="24" y="24" width="1152" height="1152" rx="20" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.5"/>
<g transform="translate(0,285)">
<text x="600" y="84" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="8">${p.kicker}</text>
<line x1="470" y1="110" x2="730" y2="110" stroke="url(#ac)" stroke-width="2"/>
<text x="600" y="166" font-family="Noto Sans KR" font-size="40" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">대전원나이트</text>
<text x="600" y="404" font-family="Noto Sans KR" font-size="220" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">대전</text>
<text x="600" y="478" font-family="Noto Sans KR" font-size="32" font-weight="500" fill="#B388FF" text-anchor="middle">${p.title}</text>
<rect x="300" y="516" width="600" height="86" rx="43" fill="url(#ac)"/>
<text x="600" y="574" font-family="Noto Sans KR" font-size="40" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-1">광고문의 카톡 besta12</text>
</g>
</svg>`;
  render(svg, `public/og/${p.name}.png`, 1200, 1200);
});

// 불광동호박나이트 페이지 OG (1200x1200) — 대전 브랜드 컬러와 구분되는 호박(앰버) 계열
const hobak = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
<defs>
<linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#1A0E00"/>
<stop offset="55%" stop-color="#3D1F00"/>
<stop offset="100%" stop-color="#1A0E00"/>
</linearGradient>
<linearGradient id="hac" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#FFB300"/>
<stop offset="100%" stop-color="#FF7043"/>
</linearGradient>
<radialGradient id="hglow" cx="50%" cy="40%" r="55%">
<stop offset="0%" stop-color="#FFB300" stop-opacity="0.20"/>
<stop offset="100%" stop-color="#FFB300" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="1200" height="1200" fill="url(#hbg)"/>
<rect width="1200" height="1200" fill="url(#hglow)"/>
<rect x="24" y="24" width="1152" height="1152" rx="20" fill="none" stroke="url(#hac)" stroke-width="2" opacity="0.55"/>
<g transform="translate(0,285)">
<text x="600" y="92" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#FFB300" text-anchor="middle" letter-spacing="8">SEOUL EUNPYEONG</text>
<line x1="450" y1="118" x2="750" y2="118" stroke="url(#hac)" stroke-width="2"/>
<text x="600" y="252" font-family="Noto Sans KR" font-size="96" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">불광동호박나이트</text>
<text x="600" y="316" font-family="Noto Sans KR" font-size="28" font-weight="400" fill="#FFCC80" text-anchor="middle" letter-spacing="2">서울 은평구 불광동 · 불광역 인근 · 부킹 · 룸 · 단체</text>
<rect x="230" y="366" width="740" height="96" rx="48" fill="url(#hac)"/>
<text x="600" y="430" font-family="Noto Sans KR" font-size="46" font-weight="900" fill="#1A0E00" text-anchor="middle" letter-spacing="-1">예약문의 손흥민 010 2221 1937</text>
<rect x="300" y="492" width="600" height="86" rx="10" fill="rgba(255,179,0,0.10)" stroke="#FFB300" stroke-width="2"/>
<text x="600" y="545" font-family="Noto Sans KR" font-size="26" font-weight="500" fill="#FFFFFF" text-anchor="middle">신분증 지참 · 현금/카드 결제 · 사전 예약 권장</text>
</g>
</svg>`;

render(hobak, 'public/og/hobak.png', 1200, 1200);

// 네이버 플레이스 대표 이미지 (1:1) — 프로필로 크게 볼 때 정보까지, 목록에선 대전 대형
const place = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
${defs}
<rect width="1080" height="1080" fill="url(#bg)"/>
<rect width="1080" height="1080" fill="url(#glow)"/>
<rect x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.55"/>
<text x="540" y="150" font-family="Noto Sans KR" font-size="34" font-weight="500" fill="#00E5FF" text-anchor="middle" letter-spacing="12">DAEJEON ONE NIGHT</text>
<line x1="380" y1="188" x2="700" y2="188" stroke="url(#ac)" stroke-width="2"/>
<text x="540" y="278" font-family="Noto Sans KR" font-size="84" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">대전원나이트</text>
<text x="540" y="640" font-family="Noto Sans KR" font-size="300" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="10">대전</text>
<rect x="240" y="720" width="600" height="98" rx="49" fill="url(#ac)"/>
<text x="540" y="787" font-family="Noto Sans KR" font-size="44" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="1">광고문의 카카오톡</text>
<text x="540" y="910" font-family="Noto Sans KR" font-size="82" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">카톡 besta12</text>
<text x="540" y="972" font-family="Noto Sans KR" font-size="30" font-weight="400" fill="#B388FF" text-anchor="middle">평일 20:00 - 02:30 · 주말 20:00 - 03:30</text>
</svg>`;

render(place, 'public/og/place.png', 1200, 1200);

// 네이버 블로그 대표 이미지 (1:1) — VIEW/블로그 탭 작은 썸네일에서 확실히 읽히게 최소 구성
const blog = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
${defs}
<rect width="1080" height="1080" fill="url(#bg)"/>
<rect width="1080" height="1080" fill="url(#glow)"/>
<rect x="36" y="36" width="1008" height="1008" rx="28" fill="none" stroke="url(#ac)" stroke-width="2" opacity="0.55"/>
<rect x="346" y="112" width="388" height="78" rx="39" fill="url(#ac)"/>
<text x="540" y="167" font-family="Noto Sans KR" font-size="44" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="3">대전 최대 규모</text>
<text x="540" y="300" font-family="Noto Sans KR" font-size="90" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">대전원나이트</text>
<text x="540" y="702" font-family="Noto Sans KR" font-size="380" font-weight="900" fill="url(#ac)" text-anchor="middle" letter-spacing="12">대전</text>
<rect x="206" y="798" width="668" height="126" rx="63" fill="#FFFFFF"/>
<text x="540" y="884" font-family="Noto Sans KR" font-size="66" font-weight="900" fill="#0A0E27" text-anchor="middle" letter-spacing="-1">카톡 besta12</text>
<text x="540" y="1002" font-family="Noto Sans KR" font-size="42" font-weight="700" fill="#00E5FF" text-anchor="middle" letter-spacing="3">새벽까지 논스톱 · 광고문의 카톡</text>
</svg>`;

render(blog, 'public/og/blog.png', 1200, 1200);

console.log('done');
