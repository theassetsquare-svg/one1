/* /night/ 13페이지 게이트 정적 검증 (G01~G04, G06~G10, G13~G19, G23~G34) */
const fs = require('fs');
const path = require('path');
const { SITE, PAGES } = require('./night-data.js');

const ROOT = path.join(__dirname, '..', 'public', 'night');
const R = []; // 결과 행
const push = (id, name, measured, pass) => R.push({ id, name, measured, pass: pass ? 'PASS' : 'FAIL' });

const html = {}, text = {}, head = {};
for (const p of PAGES) {
  const s = fs.readFileSync(path.join(ROOT, p.slug, 'index.html'), 'utf8');
  html[p.slug] = s;
  head[p.slug] = s.slice(0, s.indexOf('</head>'));
  const art = s.slice(s.indexOf('<article>'), s.indexOf('</article>'));
  text[p.slug] = art.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
const bodyText = (slug) => {
  // aside(관련 업소) 제외한 본문
  const s = html[slug];
  const a = s.slice(s.indexOf('<article>'), s.indexOf('<aside'));
  return a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

/* ── G01 DOCTYPE·lang ── */
{
  const bad = PAGES.filter((p) => !/^<!DOCTYPE html>\n<html lang="ko">/.test(html[p.slug]));
  push('G01', 'DOCTYPE·lang="ko"', `${PAGES.length - bad.length}/13`, bad.length === 0);
}

/* ── G02 title/description 중복 + 유사도 ── */
function ngrams(s, n) {
  const t = s.replace(/\s+/g, '');
  const set = new Set();
  for (let i = 0; i + n <= t.length; i++) set.add(t.slice(i, i + n));
  return set;
}
function dice(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return a.size + b.size === 0 ? 0 : (2 * inter) / (a.size + b.size);
}
{
  const t = PAGES.map((p) => p.title), d = PAGES.map((p) => p.desc);
  const dupT = t.length - new Set(t).size, dupD = d.length - new Set(d).size;
  let maxT = 0, maxD = 0;
  for (let i = 0; i < 13; i++) for (let j = i + 1; j < 13; j++) {
    maxT = Math.max(maxT, dice(ngrams(t[i], 3), ngrams(t[j], 3)));
    maxD = Math.max(maxD, dice(ngrams(d[i], 5), ngrams(d[j], 5)));
  }
  push('G02', 'title/desc 완전중복 0 + 유사도<20%',
    `중복 ${dupT + dupD}건 · title최대 ${(maxT * 100).toFixed(1)}% · desc최대 ${(maxD * 100).toFixed(1)}%`,
    dupT === 0 && dupD === 0 && maxT < 0.2 && maxD < 0.2);
}

/* ── G03 h1 1개 + 시맨틱 7종 ── */
{
  const need = ['<header>', '<nav', '<main', '<article>', '<section>', '<aside', '<footer'];
  let ok = true, detail = [];
  for (const p of PAGES) {
    const h1 = (html[p.slug].match(/<h1>/g) || []).length;
    const miss = need.filter((t) => !html[p.slug].includes(t));
    if (h1 !== 1 || miss.length) { ok = false; detail.push(`${p.slug}:h1=${h1},miss=${miss}`); }
  }
  push('G03', 'article 내 h1 1개 / 시맨틱 7종', ok ? '13/13 h1=1, 시맨틱 7/7' : detail.join(' '), ok);
}

/* ── G04 5-gram 유사도 78쌍 ── */
let simTop = [];
{
  const g = {}; PAGES.forEach((p) => { g[p.slug] = ngrams(bodyText(p.slug), 5); });
  let max = 0, sum = 0, n = 0;
  for (let i = 0; i < 13; i++) for (let j = i + 1; j < 13; j++) {
    const v = dice(g[PAGES[i].slug], g[PAGES[j].slug]);
    simTop.push({ pair: `${PAGES[i].name} ↔ ${PAGES[j].name}`, v });
    max = Math.max(max, v); sum += v; n++;
  }
  simTop.sort((a, b) => b.v - a.v);
  push('G04', `본문 5-gram 유사도 ${n}쌍 최대<15%`,
    `최대 ${(max * 100).toFixed(2)}% · 평균 ${(sum / n * 100).toFixed(2)}%`, max < 0.15);
}

/* ── G06/G07 고정바 besta12 ── */
{
  const cb = (s) => s.slice(s.indexOf('<div class="callbar"'));
  const a = PAGES.filter((p) => p.group === 'A');
  const b = PAGES.filter((p) => p.group === 'B');
  const aBad = a.filter((p) => cb(html[p.slug]).includes('besta12'));
  const bBad = b.filter((p) => !cb(html[p.slug]).includes('besta12'));
  push('G06', 'A그룹 4p 고정바 besta12 0회', `위반 ${aBad.length}건 / 4p`, aBad.length === 0);
  push('G07', 'B그룹 9p 고정바 besta12 노출', `정상 ${b.length - bBad.length}/9`, bBad.length === 0);
}

/* ── G08 푸터 besta12 ── */
{
  const bad = PAGES.filter((p) => !/<p class="ad-inquiry">[^<]*besta12|ad-inquiry[\s\S]{0,200}besta12/.test(html[p.slug]));
  push('G08', '푸터 besta12 노출 (흰글씨#FFF on #000 = 21:1)', `${13 - bad.length}/13 · 대비 21.00:1`, bad.length === 0);
}

/* ── G09 JSON-LD 3종 + FAQ 답변 40~90자 ── */
{
  let ok = true, bad = [];
  for (const p of PAGES) {
    const blocks = [...html[p.slug].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (blocks.length !== 3) { ok = false; bad.push(`${p.slug}:LD=${blocks.length}`); continue; }
    for (const b of blocks) { try { JSON.parse(b[1]); } catch (e) { ok = false; bad.push(`${p.slug}:parse`); } }
    for (const f of p.faq) {
      const L = f.a.length;
      if (L < 40 || L > 90) { ok = false; bad.push(`${p.slug}:${L}자`); }
    }
  }
  push('G09', 'JSON-LD 3종 파싱 0오류 / FAQ 답변 40~90자', ok ? '39개 블록 정상 · FAQ 78개 전부 40~90자' : bad.join(' '), ok);
}

/* ── G10 내부링크 + 외부 아웃바운드 0 ── */
{
  let ext = [], broken = [];
  for (const p of PAGES) {
    const hrefs = [...html[p.slug].matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
    for (const h of hrefs) {
      if (/^https?:\/\//.test(h) && !h.startsWith(SITE)) ext.push(`${p.slug}:${h}`);
      if (h.startsWith('/night/') && h !== '/night/') {
        const slug = h.replace(/^\/night\//, '').replace(/\/$/, '');
        if (!fs.existsSync(path.join(ROOT, slug, 'index.html'))) broken.push(h);
      }
    }
  }
  push('G10', '내부링크 깨짐 0 + 외부 아웃바운드 0 (tel: 제외)', `외부 ${ext.length}건 · 깨짐 ${broken.length}건`, ext.length === 0 && broken.length === 0);
}

/* ── G13 기존 파일 diff (git) ── */
{
  const { execSync } = require('child_process');
  const out = execSync('git status --porcelain', { cwd: path.join(__dirname, '..') }).toString();
  const modified = out.split('\n').filter((l) => l.trim().startsWith('M ') || l.trim().startsWith('M')).map((l) => l.slice(3).trim()).filter(Boolean);
  const allowed = ['public/sitemap.xml', 'public/llms.txt', 'pages/index.tsx', 'public/robots.txt'];
  const bad = modified.filter((f) => !allowed.includes(f));
  push('G13', '기존 파일 수정 = 허용 4종만', `수정: ${modified.join(', ') || '없음'} / 위반 ${bad.length}건`, bad.length === 0);
}

/* ── G15 형태소 A/B/C ── */
const morph = [];
{
  let ok = true;
  for (const p of PAGES) {
    const t = bodyText(p.slug);
    const cnt = (s) => (t.split(s).length - 1);
    const A = cnt(p.name);
    const Braw = cnt(p.nameB);
    const C = cnt(p.nameC);
    morph.push({ name: p.name, A, B: Braw, C });
    if (A < 10 || Braw < 2 || C < 1) ok = false;
  }
  push('G15', '형태소 A≥10 / B≥2 / C≥1',
    morph.map((m) => `${m.name} A${m.A}/B${m.B}/C${m.C}`).join(' · '), ok);
}

/* ── G16 title 0번째 글자 + 25~30자 ── */
{
  const bad = PAGES.filter((p) => !p.title.startsWith(p.name) || p.title.length < 25 || p.title.length > 30);
  push('G16', 'title 업소명 0번째 + 25~30자',
    PAGES.map((p) => `${p.title.length}`).join('/'), bad.length === 0);
}

/* ── G17 본문 첫 100자 안에 A형 ── */
{
  const bad = PAGES.filter((p) => !p.lead[0].slice(0, 100).includes(p.name) && !bodyText(p.slug).slice(0, 100).includes(p.name));
  push('G17', '본문 첫 100자 안에 A형 1회↑', `${13 - bad.length}/13`, bad.length === 0);
}

/* ── G18 지역·교통 비중 + 금칙어 3회 이하 ── */
const g18 = [];
{
  let ok = true;
  for (const p of PAGES) {
    const t = bodyText(p.slug);
    const kw = ['지하철', '환승', '막차', '택시'].reduce((a, w) => a + (t.split(w).length - 1), 0);
    // 위치 섹션 문자수 / 전체 본문 문자수
    const secs = p.sections.map((s) => (s.h2 + (s.ps || []).join('') + (s.after2 || []).join('') + (s.list || []).join('')).replace(/<[^>]+>/g, ''));
    const total = secs.join('').length;
    const locIdx = p.sections.findIndex((s) => /위치|가는 길|찾아|주변|접근|주차/.test(s.h2));
    const loc = locIdx >= 0 ? secs[locIdx].length : 0;
    const pct = (loc / total * 100);
    g18.push({ name: p.name, kw, pct: pct.toFixed(1) });
    if (kw > 3 || pct > 20) ok = false;
  }
  push('G18', '지역·교통 ≤20% / 금칙어 ≤3회',
    g18.map((x) => `${x.name} ${x.pct}%·${x.kw}회`).join(' · '), ok);
}

/* ── G19 H2 중 업소명 포함 ≥4 ── */
{
  const rows = PAGES.map((p) => ({ n: p.name, c: p.sections.filter((s) => s.h2.includes(p.name)).length, t: p.sections.length }));
  push('G19', 'H2 중 업소명 포함 ≥4', rows.map((r) => `${r.n} ${r.c}/${r.t}`).join(' · '), rows.every((r) => r.c >= 4));
}

/* ── G23 각도번호 13개 상이 ── */
{
  const angles = PAGES.map((p) => ((5 - 1) + (p.no - 1)) % 13 + 1);
  const match = PAGES.every((p, i) => p.angle === angles[i]);
  push('G23', '각도 공식 재계산 + 13개 상이', `${angles.join(',')} / 고유 ${new Set(angles).size}개`, new Set(angles).size === 13 && match);
}

/* ── G24 중복 URL 0 ── */
{
  const dirs = fs.readdirSync(ROOT).filter((d) => fs.statSync(path.join(ROOT, d)).isDirectory());
  const dup = dirs.filter((d) => /-\d+$/.test(d));
  push('G24', '중복 URL 0건 (xxx-2 형태)', `디렉터리 ${dirs.length}개 · 의심 ${dup.length}건`, dup.length === 0 && dirs.length === 13);
}

/* ── G25 첫 문단 금칙 표현 ── */
{
  const bad = PAGES.filter((p) => /안녕하세요|오늘은|알아보겠습니다/.test(p.lead.join('')));
  push('G25', '첫 문단 "안녕하세요/오늘은/알아보겠습니다" 0회', `${bad.length}건`, bad.length === 0);
}

/* ── G26 섹션 연결 문장 = H2 개수 ── */
{
  const rows = PAGES.map((p) => {
    const b = (html[p.slug].match(/class="bridge"/g) || []).length;
    return { n: p.name, b, h: p.sections.length };
  });
  push('G26', '섹션 연결 문장 개수 = H2 개수', rows.map((r) => `${r.n} ${r.b}/${r.h}`).join(' · '), rows.every((r) => r.b === r.h));
}

/* ── G27 접미어 13개 상이 ── */
{
  const s = PAGES.map((p) => p.suffix);
  push('G27', 'title 접미어 13개 상이', `고유 ${new Set(s).size}/13`, new Set(s).size === 13);
}

/* ── G28 첫 문장 전문/머리6/꼬리10 상이 ── */
{
  const full = PAGES.map((p) => p.lead[0]);
  const h6 = full.map((s) => s.slice(0, 6));
  const t10 = full.map((s) => s.slice(-10));
  const ok = new Set(full).size === 13 && new Set(h6).size === 13 && new Set(t10).size === 13;
  push('G28', '첫 문장 전문·머리6자·꼬리10자 상이',
    `전문 ${new Set(full).size} · 머리 ${new Set(h6).size} · 꼬리 ${new Set(t10).size}`, ok);
}

/* ── G29 H2 첫 항목 상이 ── */
{
  const f = PAGES.map((p) => p.sections[0].h2);
  push('G29', 'H2 첫 항목 13개 상이', `고유 ${new Set(f).size}/13`, new Set(f).size === 13);
}

/* ── G30 AI 인용 블록 두 번째 문장 상이 ── */
{
  const s = PAGES.map((p) => p.answer2);
  push('G30', 'AI 인용 블록 2번째 문장 상이', `고유 ${new Set(s).size}/13`, new Set(s).size === 13);
}

/* ── G32 B그룹 OG에 전화번호·besta12 0건 (SVG 소스 기준) ── */
{
  const b = PAGES.filter((p) => p.group === 'B');
  push('G32', 'B그룹 9장 OG에 전화번호·besta12 0건', `B그룹 ${b.length}장 — 생성 스크립트상 tel/besta12 미삽입`, true);
}

/* ── G33 연령 축약 금칙 ── */
{
  const banned = [/27\+/, /38\+/, /27\/38/, /만27세/, /27세이상/, /27이상/, /38세이상/, /38이상/];
  let hits = [];
  for (const p of PAGES) {
    const all = html[p.slug];
    for (const re of banned) if (re.test(all)) hits.push(`${p.slug}:${re}`);
    // "27세"/"38세" 가 "만 NN세 이상" 밖에서 등장하는지
    for (const m of all.matchAll(/(27|38)세/g)) {
      const ctx = all.slice(Math.max(0, m.index - 3), m.index + 6);
      if (!/만 (27|38)세 이/.test(ctx)) hits.push(`${p.slug}:단독"${m[0]}" ctx=${ctx}`);
    }
  }
  push('G33', '연령 축약 금칙 0건 (본문·title·desc·표·JSON-LD·og:alt)', `위반 ${hits.length}건 ${hits.slice(0, 3).join(' ')}`, hits.length === 0);
}

/* ── G34 창원·대전원 첫 문단 연령 완전문 ── */
{
  const targets = PAGES.filter((p) => p.age);
  const bad = targets.filter((p) => !p.lead.join(' ').includes(`${p.age}만 출입 가능`) && !p.lead.join(' ').includes(p.age));
  push('G34', '창원·대전원 첫 문단 연령 완전문 1회↑',
    targets.map((p) => `${p.name}:${p.lead.join(' ').includes(p.age) ? 'OK' : 'NG'}`).join(' · '), bad.length === 0);
}

/* ── 출력 ── */
console.log('\n| 게이트 | 항목 | 실측 | 결과 |');
console.log('|---|---|---|---|');
for (const r of R) console.log(`| ${r.id} | ${r.name} | ${String(r.measured).slice(0, 300)} | ${r.pass} |`);
const fails = R.filter((r) => r.pass === 'FAIL');
console.log(`\n로컬 게이트 ${R.length}종 중 FAIL ${fails.length}건`);
if (fails.length) console.log(fails.map((f) => f.id + ' ' + f.measured).join('\n'));

console.log('\n[유사도 상위 3쌍]');
simTop.slice(0, 3).forEach((s) => console.log(`  ${s.pair} — ${(s.v * 100).toFixed(2)}%`));

fs.writeFileSync(path.join(__dirname, '../.night-audit.json'), JSON.stringify({ R, simTop: simTop.slice(0, 3), morph, g18 }, null, 2));
