#!/usr/bin/env node
/**
 * 배포 게이트 — G10(전화번호 위치) / G13(가게이름 오염) / G14(썸네일 텍스트 오염) / G15(썸네일 크기).
 * 하나라도 실패하면 exit 1 (배포 금지). 근거는 out/**.html 과 public/og/manifest.json 실측값.
 *
 * 예외 3개만 허용: (a) 허브·목록 페이지  (b) <a> 앵커 텍스트  (c) 인천아라비안 = 인천아라비아
 *  — 단 alt·caption·파일명에는 예외가 없다.
 */
const fs = require('fs');
const path = require('path');
const night = require('./night-data.js');
const start = require('./start-data.js');
const { ADVERTISERS, SPECS } = require('./og-spec.js');

const ROOT = process.argv[2] || 'out';
const MANIFEST = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'og', 'manifest.json'), 'utf8'));
const USABLE = 1080;

/* ── 가게이름 사전(정식 + 띄어쓰기 변형) ── */
const ALL = new Map();
const add = (n, v) => ALL.set(n, [...new Set([...(ALL.get(n) || []), n, v].filter(Boolean))]);
night.PAGES.forEach((p) => add(p.name, p.nameB));
start.PAGES.forEach((p) => add(p.name, p.nameB));
add('대전원나이트', '대전 원나이트');

const TEL_OWNER = Object.fromEntries(Object.entries(ADVERTISERS).map(([v, a]) => [a.tel.replace(/-/g, ''), v]));
const NICK_OWNER = Object.fromEntries(Object.entries(ADVERTISERS).map(([v, a]) => [a.nick, v]));

/* ── 페이지 목록: 파일 → {url, 자기 가게이름, 허브 여부} ──
   ★ 2026-08-24 — 주소교체로 파일 이름이 info.html → info-1.html 로 바뀌었는데
      이 표의 f 만 옛 이름이라 5개 페이지가 계속 "파일 없음"으로 실패했다. */
const PAGES = [
  { f: 'index.html', url: '/', own: [], hub: true },            // 홈 = 독립 성공스토리(가게이름 0)
  { f: 'info-2.html', url: '/info-2', own: ['대전원나이트'] },
  { f: 'hours-2.html', url: '/hours-2', own: ['대전원나이트'] },
  { f: 'ladies-1.html', url: '/ladies-1', own: ['대전원나이트'] },
  { f: 'faq-1.html', url: '/faq-1', own: ['대전원나이트'] },
  { f: 'contact-2.html', url: '/contact-2', own: ['대전원나이트'] },
  { f: '404.html', url: '/404', own: ['대전원나이트'] },
  { f: 'bulgwangdong-hobak.html', url: '/bulgwangdong-hobak', own: ['불광동호박나이트'] },
  { f: 'night/index.html', url: '/night/', own: [], hub: true },
  { f: 'start/index.html', url: '/start/', own: [], hub: true },
];
night.PAGES.forEach((p) => PAGES.push({ f: `night/${p.slug}/index.html`, url: `/night/${p.slug}/`, own: [p.name] }));
start.PAGES.forEach((p) => PAGES.push({ f: `start/${p.slug}/index.html`, url: `/start/${p.slug}/`, own: [p.name] }));

const stripAnchors = (h) => h.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, ' ');
const attrsOf = (h) =>
  [...h.matchAll(/\b(alt|content|aria-label|title)="([^"]*)"/g)].map((m) => m[2]).join('\n') +
  '\n' + [...h.matchAll(/<caption>([\s\S]*?)<\/caption>/g)].map((m) => m[1]).join('\n');

const fail = { G10: [], G13: [], G14: [], G15: [] };
let checked = 0;

for (const pg of PAGES) {
  const fp = path.join(ROOT, pg.f);
  if (!fs.existsSync(fp)) { fail.G13.push(`${pg.url} 파일 없음`); continue; }
  checked++;
  const html = fs.readFileSync(fp, 'utf8');
  const body = stripAnchors(html);
  const attrs = attrsOf(html);
  const ownVar = new Set(pg.own.flatMap((n) => ALL.get(n) || [n]));
  if (pg.own.includes('인천아라비안나이트')) ownVar.add('인천아라비아'); // 예외 (c)

  /* ── G10 전화번호 위치 ── */
  const tels = [...new Set([...html.matchAll(/010[-\s]?\d{3,4}[-\s]?\d{4}/g)].map((m) => m[0].replace(/[-\s]/g, '')))];
  if (tels.length > 1) fail.G10.push(`${pg.url} 한 페이지에 번호 ${tels.length}개: ${tels.join(', ')}`);
  for (const t of tels) {
    const owner = TEL_OWNER[t];
    if (!owner) fail.G10.push(`${pg.url} 정답표 밖 010 번호: ${t}`);
    else if (!pg.own.includes(owner)) fail.G10.push(`${pg.url} 타 광고주 번호: ${t} (주인=${owner})`);
  }
  for (const [nick, owner] of Object.entries(NICK_OWNER)) {
    if (!pg.own.includes(owner) && body.includes(nick)) fail.G10.push(`${pg.url} 타 광고주 닉네임: ${nick} (주인=${owner})`);
  }

  /* ── G13 가게이름 오염 ── */
  for (const [name, vars] of ALL) {
    if (pg.own.includes(name)) continue;
    for (const v of vars) {
      if ([...ownVar].some((o) => o.includes(v))) continue;
      if (!pg.hub && body.includes(v)) fail.G13.push(`${pg.url} 본문/메타에 타 가게이름: ${v}`);
      if (attrs.includes(v)) fail.G13.push(`${pg.url} alt·캡션·속성에 타 가게이름: ${v}`); // 허브도 예외 없음
    }
  }
}

/* ── G14 · G15 : manifest 실측 ── */
const specByFile = Object.fromEntries(SPECS.map((s) => [`/og/${s.file}`, s]));
for (const e of MANIFEST) {
  const spec = specByFile[e.file];
  if (!spec) { fail.G14.push(`${e.file} 스펙표에 없음`); continue; }
  const drawn = e.drawnTexts.join(' ');

  /* G14 — 그려진 글자에 자기 것 아닌 이름·번호가 있으면 실패 */
  for (const [name, vars] of ALL) {
    if (e.venue === name) continue;
    for (const v of vars) if (e.venue && (ALL.get(e.venue) || []).some((o) => o.includes(v))) continue; else if (drawn.includes(v)) fail.G14.push(`${e.file} 타 가게이름 렌더: ${v}`);
  }
  for (const [tel, owner] of Object.entries(TEL_OWNER)) {
    const dashed = owner && ADVERTISERS[owner].tel;
    if (drawn.includes(dashed) && e.venue !== owner) fail.G14.push(`${e.file} 타 광고주 번호 렌더: ${dashed} (주인=${owner})`);
  }
  for (const [nick, owner] of Object.entries(NICK_OWNER)) {
    if (e.drawnTexts.includes(nick) && e.venue !== owner) fail.G14.push(`${e.file} 타 광고주 닉네임 렌더: ${nick} (주인=${owner})`);
  }

  /* G15 — 주인공 크기 */
  const hero = e.texts.find((t) => t.hero);
  if (!hero) { fail.G15.push(`${e.file} 주인공 글자 없음`); continue; }
  const maxH = Math.max(...e.texts.map((t) => t.measuredHeightPx));
  if (hero.measuredHeightPx < maxH)
    fail.G15.push(`${e.file} 주인공("${hero.text}" ${hero.measuredHeightPx}px)보다 큰 글자 존재 (${maxH}px)`);
  if (e.category === 'A') {
    if (hero.measuredWidthPx < 972) fail.G15.push(`${e.file} 전화번호 폭 ${hero.measuredWidthPx}px < 972px`);
    const nick = e.texts.find((t) => t.role === '닉네임');
    if (!nick || nick.measuredHeightPx < 170) fail.G15.push(`${e.file} 닉네임 높이 ${nick && nick.measuredHeightPx}px < 170px`);
  } else if (e.category === 'C') {
    if (hero.measuredWidthPx < 918) fail.G15.push(`${e.file} 가게이름 폭 ${hero.measuredWidthPx}px < 918px`);
  } else {
    if (hero.text !== '광고문의') fail.G15.push(`${e.file} 주인공이 "광고문의"가 아님: ${hero.text}`);
    if (hero.measuredHeightPx < 240) fail.G15.push(`${e.file} "광고문의" 높이 ${hero.measuredHeightPx}px < 240px`);
  }
  /* 폭 대역 상한 확인 */
  for (const t of e.texts) {
    if (t.measuredWidthPct > 96.5) fail.G15.push(`${e.file} ${t.role} 폭 ${t.measuredWidthPct}% > 96%(안전여백 침범)`);
  }
}

/* ── 결과 ── */
const G = { G10: '전화번호 위치', G13: '가게이름 오염 0', G14: '썸네일 텍스트 오염 0', G15: '썸네일 크기(실측)' };
let bad = 0;
for (const [k, label] of Object.entries(G)) {
  const errs = fail[k];
  console.log(`${errs.length ? 'FAIL' : 'PASS'} ${k} — ${label} · 위반 ${errs.length}건`);
  errs.slice(0, 25).forEach((e) => console.log('     · ' + e));
  if (errs.length > 25) console.log(`     · … 외 ${errs.length - 25}건`);
  bad += errs.length;
}
console.log(`\n페이지 ${checked}개 · 썸네일 ${MANIFEST.length}장 검사`);
if (bad) { console.error('게이트 실패 — 배포 금지'); process.exit(1); }
console.log('G10 · G13 · G14 · G15 전부 통과');
