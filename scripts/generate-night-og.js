/* /night/ 13개 OG 이미지 생성 — 1200x1200 정사각 PNG
   A그룹 4장: 하단 검은 띠 + 담당자 닉네임 + 전화번호 (전화번호 글자높이 >=100px)
   B그룹 9장: 업소명 + 지역 + 사이트 브랜드명 (전화번호/besta12 없음)          */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const { PAGES } = require('./night-data.js');

const FONT = path.join(__dirname, '../assets/fonts/NotoSansKR-VF.ttf');
const OUT = path.join(__dirname, '../public/og');
const SIZE = 1200;
const BRAND = '대전원나이트 공식 안내';

/* 업소명 2줄 분할 (한 줄 최대 7자) */
const SPLIT = {
  'bulgwang-hobak-night': ['불광동', '호박나이트'],
  'changwon-lululala-night': ['창원', '룰루랄라나이트'],
  'ulsan-champion-night': ['울산', '챔피언나이트'],
  'cheongdam-night': ['청담나이트'],
  'daejeon-one-night': ['대전', '원나이트'],
  'sillim-grandprix-night': ['신림', '그랑프리나이트'],
  'sangbong-hangukgwan-night': ['상봉동', '한국관나이트'],
  'suyu-shampoo-night': ['수유', '샴푸나이트'],
  'busan-asiad-night': ['부산', '아시아드나이트'],
  'suwon-chance-dome-night': ['수원', '찬스돔나이트'],
  'ansan-hit-night': ['안산', '히트나이트'],
  'daejeon-seven-night': ['대전', '세븐나이트'],
  'ilsan-shampoo': ['일산', '샴푸나이트'],
};

/* 지역 짧은 표기 */
const AREA = {
  'bulgwang-hobak-night': '서울 은평구 불광동',
  'changwon-lululala-night': '경남 창원 상남동',
  'ulsan-champion-night': '울산 남구 삼산동',
  'cheongdam-night': '서울 강남구 청담동',
  'daejeon-one-night': '대전 중구 중앙로',
  'sillim-grandprix-night': '서울 관악구 신림동',
  'sangbong-hangukgwan-night': '서울 중랑구 상봉동',
  'suyu-shampoo-night': '서울 강북구 수유동',
  'busan-asiad-night': '부산 동래구 온천동',
  'suwon-chance-dome-night': '경기 수원 권선구',
  'ansan-hit-night': '경기 안산 상록구',
  'daejeon-seven-night': '대전 중구 유천동',
  'ilsan-shampoo': '경기 고양 일산동구',
};

function srgb(c) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
function lum(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
function contrast(a, b) {
  const l1 = lum(a), l2 = lum(b);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}

function svgFor(p, phoneFont) {
  const lines = SPLIT[p.slug];
  const area = AREA[p.slug];
  const isA = p.group === 'A';
  const nameFont = lines.length === 2 ? 138 : 150;
  const nameY = lines.length === 2 ? [300, 470] : [400];

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<rect width="${SIZE}" height="${SIZE}" fill="${p.bg}"/>
<rect x="30" y="30" width="${SIZE - 60}" height="${SIZE - 60}" rx="22" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.35"/>
<text x="600" y="150" font-family="Noto Sans KR" font-size="40" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="8" opacity="0.9">NIGHT GUIDE</text>`;

  lines.forEach((ln, i) => {
    s += `\n<text x="600" y="${nameY[i]}" font-family="Noto Sans KR" font-size="${nameFont}" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="6" text-anchor="middle" letter-spacing="-4">${ln}</text>`;
  });

  // 지역 (55~60% 구간)
  s += `\n<text x="600" y="${isA ? 640 : 620}" font-family="Noto Sans KR" font-size="52" font-weight="700" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5" text-anchor="middle" opacity="0.95">${area}</text>`;

  // 연령 배지 (우측 상단) — 완전문만 사용
  if (p.age) {
    s += `\n<rect x="770" y="60" width="380" height="86" rx="43" fill="#FFD54F"/>
<text x="960" y="118" font-family="Noto Sans KR" font-size="44" font-weight="900" fill="#1A1200" stroke="#1A1200" stroke-width="2" text-anchor="middle">${p.age}</text>`;
  }

  if (isA) {
    // 하단 60~100% 검은 띠 (불투명)
    s += `\n<rect x="0" y="720" width="${SIZE}" height="480" fill="#000000"/>
<text x="600" y="850" font-family="Noto Sans KR" font-size="98" font-weight="700" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="3" text-anchor="middle">${p.manager}</text>
<text x="600" y="1030" font-family="Noto Sans KR" font-size="${phoneFont}" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" text-anchor="middle" letter-spacing="-2">${p.tel}</text>
<text x="600" y="1120" font-family="Noto Sans KR" font-size="40" font-weight="500" fill="#FFFFFF" text-anchor="middle" opacity="0.85">예약문의</text>`;
  } else {
    s += `\n<rect x="150" y="780" width="900" height="4" fill="#FFFFFF" opacity="0.4"/>
<text x="600" y="900" font-family="Noto Sans KR" font-size="60" font-weight="800" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" text-anchor="middle">나이트 안내</text>
<text x="600" y="1010" font-family="Noto Sans KR" font-size="42" font-weight="500" fill="#FFFFFF" text-anchor="middle" opacity="0.9">${BRAND}</text>
<text x="600" y="1100" font-family="Noto Sans KR" font-size="34" font-weight="400" fill="#FFFFFF" text-anchor="middle" opacity="0.75">좌석 · 시간대 · 부킹 안내</text>`;
  }
  s += '\n</svg>';
  return s;
}

function render(svg) {
  const r = new Resvg(svg, {
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Noto Sans KR' },
    fitTo: { mode: 'width', value: SIZE },
  });
  return r.render();
}

/* 지정 y 범위에서 흰 픽셀 bbox 측정 */
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
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}


/* /night/ 목록 허브 카드 — B그룹과 동일한 내용 규칙 */
function hubSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<rect width="${SIZE}" height="${SIZE}" fill="#1A1F4E"/>
<rect x="30" y="30" width="${SIZE - 60}" height="${SIZE - 60}" rx="22" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.35"/>
<text x="600" y="150" font-family="Noto Sans KR" font-size="40" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="8" opacity="0.9">NIGHT GUIDE</text>
<text x="600" y="400" font-family="Noto Sans KR" font-size="150" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="6" text-anchor="middle" letter-spacing="-4">나이트 안내</text>
<text x="600" y="560" font-family="Noto Sans KR" font-size="150" font-weight="900" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="6" text-anchor="middle" letter-spacing="-4">목록 13곳</text>
<text x="600" y="660" font-family="Noto Sans KR" font-size="52" font-weight="700" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5" text-anchor="middle" opacity="0.95">서울 · 경기 · 부산 · 대전 · 울산 · 창원</text>
<rect x="150" y="780" width="900" height="4" fill="#FFFFFF" opacity="0.4"/>
<text x="600" y="900" font-family="Noto Sans KR" font-size="60" font-weight="800" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" text-anchor="middle">지역별 안내</text>
<text x="600" y="1010" font-family="Noto Sans KR" font-size="42" font-weight="500" fill="#FFFFFF" text-anchor="middle" opacity="0.9">${BRAND}</text>
<text x="600" y="1100" font-family="Noto Sans KR" font-size="34" font-weight="400" fill="#FFFFFF" text-anchor="middle" opacity="0.75">좌석 · 시간대 · 부킹 안내</text>
</svg>`;
}

const report = [];
fs.mkdirSync(OUT, { recursive: true });

for (const p of PAGES) {
  let phoneFont = 152;
  let out, meta = null;

  if (p.group === 'A') {
    // 전화번호가 잘리지 않도록 폭 <=1000px 이 될 때까지 축소, 글자높이 >=100px 유지
    for (const f of [160, 152, 146, 140, 134, 128]) {
      const img = render(svgFor(p, f));
      const m = measureWhite(img.pixels, img.width, 890, 1060);
      if (m && m.w <= 1000 && m.h >= 100) { phoneFont = f; out = img; meta = m; break; }
      if (!out) { phoneFont = f; out = img; meta = m; }
    }
  } else {
    out = render(svgFor(p, 0));
  }

  const png = out.asPng();
  const file = path.join(OUT, `${p.slug}-og.png`);
  fs.writeFileSync(file, png);

  const row = {
    slug: p.slug, group: p.group, bg: p.bg,
    size: `${out.width}x${out.height}`,
    kb: Math.round(png.length / 1024),
    bgContrast: contrast(p.bg, '#FFFFFF').toFixed(2),
    bandContrast: p.group === 'A' ? contrast('#000000', '#FFFFFF').toFixed(2) : '-',
    phoneFont: p.group === 'A' ? phoneFont : '-',
    phoneH: meta ? meta.h : '-',
    phoneW: meta ? meta.w : '-',
    phoneX: meta ? `${meta.x}~${meta.x + meta.w}` : '-',
    clipped: meta ? (meta.x > 4 && meta.x + meta.w < SIZE - 4 ? 'NO' : 'YES') : '-',
    age: p.age || '-',
  };
  report.push(row);
  console.log(JSON.stringify(row));
}

const hubPng = render(hubSvg()).asPng();
fs.writeFileSync(path.join(OUT, 'night-hub-og.png'), hubPng);
report.push({ slug: 'hub', group: '-', bg: '#1A1F4E', size: `${SIZE}x${SIZE}`, kb: Math.round(hubPng.length / 1024) });
console.log(JSON.stringify(report[report.length - 1]));

fs.writeFileSync(path.join(__dirname, '../.og-report.json'), JSON.stringify(report, null, 2));
console.log(`\n${report.length}장 생성 완료`);
