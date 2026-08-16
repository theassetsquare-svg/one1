/* /start/ 40장 + 허브 1장 OG 이미지 (1200x1200) — 웜 베이지·브라운 노트 스타일
   광고주 4곳: 하단 브라운 띠에 담당자 + 전화번호
   나머지 36곳: 하단에 "광고문의 카카오톡 besta12" (전화번호 없음) */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const { PAGES, KAKAO } = require('./start-data.js');

const FONT = path.join(__dirname, '../assets/fonts/NotoSansKR-VF.ttf');
const OUT = path.join(__dirname, '../public/og');
const SIZE = 1200;

const BG = '#F7EFE1';
const PAPER = '#FFFCF5';
const LINE = '#D0BC98';
const INK = '#3A2C21';
const AC = '#8A5A2B';
const BAND = '#3A2C21';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* 업소명을 최대 7자 단위로 2줄까지 분할 */
function split(name) {
  if (name.length <= 7) return [name];
  const cut = Math.ceil(name.length / 2);
  // 되도록 '나이트' 앞에서 자른다
  const idx = name.lastIndexOf('나이트');
  if (idx > 2 && idx <= 8) return [name.slice(0, idx), name.slice(idx)];
  return [name.slice(0, cut), name.slice(cut)];
}

function srgb(c) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function lum(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
const contrast = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

function svgFor(p, telFont) {
  const lines = split(p.name);
  const nameFont = lines.length === 2 ? 132 : 146;
  const nameY = lines.length === 2 ? [420, 570] : [500];
  const isA = p.group === 'A';

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
<rect x="44" y="44" width="${SIZE - 88}" height="${SIZE - 88}" rx="10" fill="${PAPER}" stroke="${LINE}" stroke-width="5"/>
<text x="600" y="180" font-family="Noto Sans KR" font-size="44" font-weight="800" fill="${AC}" text-anchor="middle" letter-spacing="6">처음 가는 사람 입문 노트</text>
<line x1="300" y1="222" x2="900" y2="222" stroke="${LINE}" stroke-width="4"/>
<text x="600" y="300" font-family="Noto Sans KR" font-size="42" font-weight="500" fill="#6E5B49" text-anchor="middle">${esc(p.region)}</text>`;

  lines.forEach((ln, i) => {
    s += `\n<text x="600" y="${nameY[i]}" font-family="Noto Sans KR" font-size="${nameFont}" font-weight="900" fill="${INK}" stroke="${INK}" stroke-width="5" text-anchor="middle" letter-spacing="-4">${esc(ln)}</text>`;
  });

  if (p.age && p.age !== '확인 불가') {
    s += `\n<rect x="760" y="86" width="390" height="88" rx="10" fill="#F6E2A8" stroke="${LINE}" stroke-width="3"/>
<text x="955" y="146" font-family="Noto Sans KR" font-size="42" font-weight="900" fill="${INK}" stroke="${INK}" stroke-width="1.5" text-anchor="middle">${esc(p.age)}</text>`;
  }

  s += `\n<text x="600" y="672" font-family="Noto Sans KR" font-size="40" font-weight="500" fill="#6E5B49" text-anchor="middle">${esc(p.station)}</text>`;

  if (isA) {
    s += `\n<rect x="0" y="740" width="${SIZE}" height="460" fill="${BAND}"/>
<text x="600" y="860" font-family="Noto Sans KR" font-size="92" font-weight="700" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="3" text-anchor="middle">${esc(p.manager)}</text>
<text x="600" y="1035" font-family="Noto Sans KR" font-size="${telFont}" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" text-anchor="middle" letter-spacing="-2">${esc(p.tel)}</text>
<text x="600" y="1120" font-family="Noto Sans KR" font-size="40" font-weight="500" fill="#FFE082" text-anchor="middle">예약문의</text>`;
  } else {
    s += `\n<rect x="0" y="800" width="${SIZE}" height="400" fill="${BAND}"/>
<text x="600" y="900" font-family="Noto Sans KR" font-size="46" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">가기 전 · 입장 · 처음 30분</text>
<text x="600" y="1010" font-family="Noto Sans KR" font-size="52" font-weight="700" fill="#FFFFFF" text-anchor="middle">광고문의 카카오톡</text>
<text x="600" y="1110" font-family="Noto Sans KR" font-size="84" font-weight="900" fill="#FFE082" stroke="#FFE082" stroke-width="2" text-anchor="middle" letter-spacing="-1">${KAKAO}</text>`;
  }
  s += '\n</svg>';
  return s;
}

function hubSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
<rect x="44" y="44" width="${SIZE - 88}" height="${SIZE - 88}" rx="10" fill="${PAPER}" stroke="${LINE}" stroke-width="5"/>
<text x="600" y="200" font-family="Noto Sans KR" font-size="46" font-weight="800" fill="${AC}" text-anchor="middle" letter-spacing="6">처음 가는 사람 입문 노트</text>
<line x1="280" y1="246" x2="920" y2="246" stroke="${LINE}" stroke-width="4"/>
<text x="600" y="420" font-family="Noto Sans KR" font-size="128" font-weight="900" fill="${INK}" stroke="${INK}" stroke-width="5" text-anchor="middle" letter-spacing="-5">전국 나이트</text>
<text x="600" y="570" font-family="Noto Sans KR" font-size="128" font-weight="900" fill="${INK}" stroke="${INK}" stroke-width="5" text-anchor="middle" letter-spacing="-5">입문 노트 40</text>
<text x="600" y="680" font-family="Noto Sans KR" font-size="42" font-weight="500" fill="#6E5B49" text-anchor="middle">지역별 40곳 · 주소 · 가까운 역 · 첫 방문 순서</text>
<rect x="0" y="800" width="${SIZE}" height="400" fill="${BAND}"/>
<text x="600" y="920" font-family="Noto Sans KR" font-size="56" font-weight="700" fill="#FFFFFF" text-anchor="middle">광고문의 카카오톡</text>
<text x="600" y="1040" font-family="Noto Sans KR" font-size="96" font-weight="900" fill="#FFE082" stroke="#FFE082" stroke-width="2" text-anchor="middle" letter-spacing="-1">${KAKAO}</text>
<text x="600" y="1120" font-family="Noto Sans KR" font-size="34" font-weight="400" fill="#FFFFFF" text-anchor="middle" opacity="0.85">업소 사장님 대상 광고 입점 채널</text>
</svg>`;
}

function render(svg) {
  return new Resvg(svg, {
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Noto Sans KR' },
    fitTo: { mode: 'width', value: SIZE },
  }).render();
}

function measureWhite(px, w, y0, y1) {
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (px[i] > 200 && px[i + 1] > 200 && px[i + 2] > 200 && px[i + 3] > 128) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

fs.mkdirSync(OUT, { recursive: true });
const report = [];

for (const p of PAGES) {
  let telFont = 150, out, meta = null;
  if (p.group === 'A') {
    for (const f of [156, 150, 144, 138, 132, 126]) {
      const img = render(svgFor(p, f));
      const m = measureWhite(img.pixels, img.width, 900, 1060);
      telFont = f; out = img; meta = m;
      if (m && m.w <= 1000 && m.h >= 100) break;
    }
  } else {
    out = render(svgFor(p, 0));
  }
  const png = out.asPng();
  fs.writeFileSync(path.join(OUT, `start-${p.slug}-og.png`), png);
  report.push({
    slug: p.slug, group: p.group, size: `${out.width}x${out.height}`, kb: Math.round(png.length / 1024),
    tel: p.group === 'A' ? p.tel : '-', telFont: p.group === 'A' ? telFont : '-',
    telH: meta ? meta.h : '-', telW: meta ? meta.w : '-',
    clipped: meta ? (meta.x > 4 && meta.x + meta.w < SIZE - 4 ? 'NO' : 'YES') : '-',
  });
}

const hub = render(hubSvg()).asPng();
fs.writeFileSync(path.join(OUT, 'start-hub-og.png'), hub);
report.push({ slug: 'hub', group: '-', size: `${SIZE}x${SIZE}`, kb: Math.round(hub.length / 1024), tel: '-' });

fs.writeFileSync(path.join(__dirname, '../.start-og-report.json'), JSON.stringify(report, null, 2));
console.log(`OG ${report.length}장 생성 · 본문 대비 ${contrast(PAPER, INK).toFixed(2)}:1 · 하단 띠 대비 ${contrast(BAND, '#FFFFFF').toFixed(2)}:1`);
const bad = report.filter((r) => r.clipped === 'YES');
console.log(bad.length ? `잘림 의심 ${bad.length}건: ${bad.map((b) => b.slug).join(',')}` : '잘림 0건');
