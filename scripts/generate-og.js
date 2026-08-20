#!/usr/bin/env node
/**
 * /og/*.png 65장 생성 — 모바일 가독성 우선 초대형 썸네일.
 *
 * · 캔버스 1200×1200, 좌우 안전여백 60px (사용 가능 폭 1080px)
 * · 크기는 고정 px 가 아니라 opentype.js 로 글자 path 의 실제 폭·높이를 재서
 *   목표 폭(%) 대역에 맞을 때까지 역산한다. 대역과 최소 높이가 동시에 성립하지 않으면
 *   가로/세로 배율을 따로 잡아(비균등 스케일) 두 조건을 모두 만족시킨다.
 * · 렌더 후 PNG 픽셀을 다시 훑어 각 줄의 잉크 경계(실측 폭·높이)를 manifest 에 기록한다.
 */
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const { Resvg } = require('@resvg/resvg-js');
const { SITE, KAKAO, ADVERTISERS, SPECS } = require('./og-spec.js');

const R = path.join(__dirname, '..');
const OUT = path.join(R, 'public', 'og');
const FONT = path.join(R, 'tools', 'fonts', 'Pretendard-Black.ttf');
const font = opentype.parse(fs.readFileSync(FONT).buffer);

const SIDE = 1200;
const MARGIN = 60;
const USABLE = SIDE - MARGIN * 2; // 1080
const pc = (p) => USABLE * p;

/* ── 글자 측정 ── */
const REF = 100;
const metricsCache = new Map();
function metrics(text) {
  if (metricsCache.has(text)) return metricsCache.get(text);
  const p = font.getPath(text, 0, 0, REF);
  const b = p.getBoundingBox();
  const m = { w: b.x2 - b.x1, h: b.y2 - b.y1, x1: b.x1, y1: b.y1, aspect: (b.x2 - b.x1) / (b.y2 - b.y1) };
  metricsCache.set(text, m);
  return m;
}

/**
 * 폭 대역 [wMin,wMax] · 높이 대역 [hMin,hMax] 안에서 배율을 정한다.
 * 균등 배율로 두 대역이 동시에 성립하면 균등(왜곡 0), 아니면 비균등.
 */
function fit(text, { wMin, wMax, hMin, hMax, hTarget }) {
  const m = metrics(text);
  const a = m.aspect;
  const hLo = Math.max(hMin, wMin / a);
  const hHi = Math.min(hMax, wMax / a);
  let h, w, uniform;
  if (hLo <= hHi) {
    h = Math.min(Math.max(hTarget, hLo), hHi);
    w = a * h;
    uniform = true;
  } else {
    h = Math.min(Math.max(hTarget, hMin), hMax);
    w = Math.min(Math.max(a * h, wMin), wMax);
    uniform = false;
  }
  return { text, w, h, sx: w / m.w, sy: h / m.h, m, uniform };
}

/* 스케일된 path 를 SVG 로 — 좌우 중앙, top 기준 배치 */
function draw(fitted, top, fill) {
  const { m, sx, sy } = fitted;
  const left = (SIDE - fitted.w) / 2;
  const tx = left - sx * m.x1;
  const ty = top - sy * m.y1;
  const d = font.getPath(fitted.text, 0, 0, REF).toPathData(3);
  return { svg: `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${sx.toFixed(5)} ${sy.toFixed(5)})"><path d="${d}" fill="${fill}"/></g>`,
           box: { x: left, y: top, w: fitted.w, h: fitted.h } };
}

/* ── 줄 규격 (사용 가능 폭 1080px 기준) ── */
const ROLE = {
  venueSub:  { wMin: pc(0.56), wMax: pc(0.645), hMin: 54,  hMax: 124, hTarget: 110 },   // (A)(B) 1행 보조 가게이름
  nickname:  { wMin: pc(0.46), wMax: pc(0.595), hMin: 172, hMax: 182, hTarget: 176 },   // (A) 2행 닉네임 · 최소 170
  phone:     { wMin: pc(0.91), wMax: pc(0.955), hMin: 196, hMax: 208, hTarget: 200 },   // (A) 3행 전화번호 ★주인공
  kakaoSub:  { wMin: pc(0.51), wMax: pc(0.595), hMin: 44,  hMax: 110, hTarget: 86 },    // (A) 4행 광고문의 카톡 besta12
  adHero:    { wMin: pc(0.76), wMax: pc(0.845), hMin: 244, hMax: 252, hTarget: 248 },   // (B) 2행 "광고문의" ★주인공
  adKakao:   { wMin: pc(0.71), wMax: pc(0.795), hMin: 124, hMax: 150, hTarget: 132 },   // (B) 3행 "카카오톡 besta12" · 최소 120
  venueHero: { wMin: pc(0.86), wMax: pc(0.945), hMin: 190, hMax: 215, hTarget: 200 },   // (C) 가게이름 ★주인공
  cKakao:    { wMin: pc(0.56), wMax: pc(0.645), hMin: 44,  hMax: 96,  hTarget: 80 },    // (C) 광고문의 카카오톡 besta12
};

const COL = { sub: '#F2DCA8', hero: '#FFFFFF', neon: '#F5FF3D', neon2: '#5CFFB1' };

/* ── 카테고리별 조판 ── */
function compose(spec) {
  const ad = spec.venue ? ADVERTISERS[spec.venue] : null;
  let lines;
  if (spec.cat === 'A') {
    if (!ad) throw new Error('A 카테고리인데 광고주 정답표에 없음: ' + spec.venue);
    lines = [
      { role: 'venueSub', text: spec.venue, fill: COL.sub, name: '가게이름' },
      { role: 'nickname', text: ad.nick, fill: COL.neon2, name: '닉네임' },
      { role: 'phone', text: ad.tel, fill: COL.hero, name: '전화번호', hero: true, underline: COL.neon },
      { role: 'kakaoSub', text: `광고문의 카톡 ${KAKAO}`, fill: COL.sub, name: '광고문의(보조)' },
    ];
  } else if (spec.cat === 'C') {
    lines = [
      { role: 'venueHero', text: spec.venue, fill: COL.hero, name: '가게이름', hero: true, underline: COL.neon },
      { role: 'cKakao', text: `광고문의 카카오톡 ${KAKAO}`, fill: COL.neon, name: '광고문의(보조)' },
    ];
  } else {
    const head = spec.head || spec.venue;
    lines = [
      { role: 'venueSub', text: head, fill: COL.sub, name: spec.venue ? '가게이름' : '중립문구' },
      { role: 'adHero', text: '광고문의', fill: COL.hero, name: '광고문의', hero: true },
      { role: 'adKakao', text: `카카오톡 ${KAKAO}`, fill: COL.neon, name: '카카오톡' },
    ];
  }
  const fitted = lines.map((l) => ({ ...l, ...fit(l.text, ROLE[l.role]) }));

  // 세로 배치 — 위/아래 여백과 줄 간격을 남는 높이에 비례 배분
  const content = fitted.reduce((s, f) => s + f.h, 0);
  const free = SIDE - content;
  // [위여백, 줄간격…, 아래여백] 가중치 — 남는 높이를 비례 배분
  const W = { A: [0.20, 0.20, 0.22, 0.18, 0.20], B: [0.24, 0.26, 0.26, 0.24], C: [0.38, 0.30, 0.32] }[spec.cat];
  const sum = W.reduce((a, b) => a + b, 0);
  const unit = W.map((w) => (free * w) / sum);
  let y = unit[0];
  const placed = fitted.map((f, i) => {
    const top = y;
    y += f.h + (unit[i + 1] || 0);
    return { ...f, top, idx: i };
  });

  const parts = [`<rect width="${SIDE}" height="${SIDE}" fill="${spec.bg}"/>`,
    `<rect x="24" y="24" width="${SIDE - 48}" height="${SIDE - 48}" rx="18" fill="none" stroke="${COL.neon}" stroke-width="3" opacity="0.45"/>`];
  const boxes = [];
  for (const p of placed) {
    const d = draw(p, p.top, p.fill);
    parts.push(d.svg);
    boxes.push({ ...p, box: d.box });
    if (p.underline) {
      const uy = p.top + p.h + 26;
      parts.push(`<rect x="${((SIDE - p.w) / 2).toFixed(1)}" y="${uy.toFixed(1)}" width="${p.w.toFixed(1)}" height="20" rx="10" fill="${p.underline}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIDE}" height="${SIDE}" viewBox="0 0 ${SIDE} ${SIDE}">${parts.join('')}</svg>`;
  return { svg, boxes };
}

/* ── 렌더 후 픽셀 실측: 각 줄의 y 대역을 훑어 잉크 경계를 잡는다 ── */
function measurePixels(img, boxes, bg) {
  const bgRGB = [parseInt(bg.slice(1, 3), 16), parseInt(bg.slice(3, 5), 16), parseInt(bg.slice(5, 7), 16)];
  const X0 = 44, X1 = SIDE - 44; // 테두리(inset 24) 바깥으로 스캔 범위를 좁힌다
  return boxes.map((b) => {
    const yTop = Math.max(0, Math.floor(b.box.y - 6));
    const yBot = Math.min(SIDE - 1, Math.ceil(b.box.y + b.box.h + 6));
    let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
    for (let y = yTop; y <= yBot; y++) {
      for (let x = X0; x < X1; x++) {
        const i = (y * SIDE + x) * 4;
        const d = Math.max(Math.abs(img[i] - bgRGB[0]), Math.abs(img[i + 1] - bgRGB[1]), Math.abs(img[i + 2] - bgRGB[2]));
        if (d > 45) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
    }
    return maxX < 0 ? { w: 0, h: 0 } : { w: maxX - minX + 1, h: maxY - minY + 1, x: minX, y: minY };
  });
}

/* ── 실행 ── */
fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
let n = 0;
for (const spec of SPECS) {
  const { svg, boxes } = compose(spec);
  const resvg = new Resvg(svg, { background: spec.bg, fitTo: { mode: 'width', value: SIDE } });
  const rendered = resvg.render();
  const png = rendered.asPng();
  const target = path.join(OUT, spec.file);
  fs.writeFileSync(target, png);

  const pix = measurePixels(rendered.pixels, boxes, spec.bg);
  const texts = boxes.map((b, i) => ({
    role: b.name,
    text: b.text,
    hero: !!b.hero,
    targetWidthPct: +((b.w / USABLE) * 100).toFixed(1),
    pathWidthPx: +b.w.toFixed(1),
    pathHeightPx: +b.h.toFixed(1),
    measuredWidthPx: pix[i].w,
    measuredHeightPx: pix[i].h,
    measuredWidthPct: +((pix[i].w / USABLE) * 100).toFixed(1),
    uniformScale: b.uniform,
  }));
  manifest.push({
    file: `/og/${spec.file}`,
    pageUrl: spec.url ? SITE + spec.url : null,
    venue: spec.venue,
    category: spec.cat,
    advertiser: spec.venue && ADVERTISERS[spec.venue] ? { nick: ADVERTISERS[spec.venue].nick, tel: ADVERTISERS[spec.venue].tel } : null,
    heroText: texts.find((t) => t.hero)?.text ?? null,
    heroRole: texts.find((t) => t.hero)?.role ?? null,
    drawnTexts: texts.map((t) => t.text),
    texts,
    bg: spec.bg,
    bytes: png.length,
    note: spec.note || null,
  });
  n++;
  const hero = texts.find((t) => t.hero);
  console.log(`${spec.cat} ${spec.file.padEnd(34)} hero="${hero.text}" ${hero.measuredWidthPx}x${hero.measuredHeightPx}px (${hero.measuredWidthPct}%)`);
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${n}장 생성 · /og/manifest.json 기록 완료`);
