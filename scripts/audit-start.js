/* /start/ 40페이지 게이트 정적 검증 G1~G11 */
const fs = require('fs');
const path = require('path');
const { SITE, KAKAO, PAGES, PHONE_ALLOW } = require('./start-data.js');

const ROOT = path.join(__dirname, '..', 'public', 'start');
const OUT = path.join(__dirname, '..', 'out');
const R = [];
const push = (id, name, measured, pass) => R.push({ id, name, measured, pass: pass ? 'PASS' : 'FAIL' });

const html = {}, article = {};
for (const p of PAGES) {
  const s = fs.readFileSync(path.join(ROOT, p.slug, 'index.html'), 'utf8');
  html[p.slug] = s;
  article[p.slug] = s.slice(s.indexOf('<article>'), s.indexOf('<aside'));
}
const bodyText = (slug) => article[slug].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

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

/* ── G1 DOCTYPE·lang + 시맨틱 7종 ── */
{
  const need = ['<header>', '<nav', '<main', '<article>', '<section>', '<aside', '<footer'];
  const bad = [];
  for (const p of PAGES) {
    if (!/^<!DOCTYPE html>\n<html lang="ko">/.test(html[p.slug])) bad.push(`${p.slug}:doctype`);
    const miss = need.filter((t) => !html[p.slug].includes(t));
    if (miss.length) bad.push(`${p.slug}:${miss}`);
  }
  push('G1', 'DOCTYPE·lang="ko" + 시맨틱 7종', `${PAGES.length - bad.length}/${PAGES.length} 정상 · 위반 ${bad.length}건`, bad.length === 0);
}

/* ── G2 title 20~30자 · 업소명 맨 앞 · 전부 상이 ── */
{
  const lens = PAGES.map((p) => p.title.length);
  const bad = PAGES.filter((p) => !p.title.startsWith(p.name) || p.title.length < 20 || p.title.length > 30);
  const uniq = new Set(PAGES.map((p) => p.title)).size;
  push('G2', 'title 20~30자 · 업소명 0번째 · 40개 상이',
    `길이 ${Math.min(...lens)}~${Math.max(...lens)}자 · 고유 ${uniq}/40 · 위반 ${bad.length}건${bad.length ? ' (' + bad.map((p) => p.slug + ':' + p.title.length).join(',') + ')' : ''}`,
    bad.length === 0 && uniq === 40);
}

/* ── G3 description 중복 0 + 유사도 <20% ── */
{
  const d = PAGES.map((p) => p.desc);
  const dup = d.length - new Set(d).size;
  let max = 0, pair = '';
  for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) {
    const v = dice(ngrams(d[i], 5), ngrams(d[j], 5));
    if (v > max) { max = v; pair = `${PAGES[i].name}↔${PAGES[j].name}`; }
  }
  const lenBad = PAGES.filter((p) => p.desc.length < 50 || p.desc.length > 170);
  push('G3', 'description 완전중복 0 · 유사도<20% · 50~170자',
    `중복 ${dup}건 · 최대 ${(max * 100).toFixed(1)}% (${pair}) · 길이위반 ${lenBad.length}건`,
    dup === 0 && max < 0.2 && lenBad.length === 0);
}

/* ── G4 본문 5-gram 유사도 780쌍 최대 <15% ── */
let simTop = [];
{
  const g = {};
  PAGES.forEach((p) => { g[p.slug] = ngrams(bodyText(p.slug), 5); });
  let max = 0, sum = 0, n = 0;
  for (let i = 0; i < PAGES.length; i++) for (let j = i + 1; j < PAGES.length; j++) {
    const v = dice(g[PAGES[i].slug], g[PAGES[j].slug]);
    simTop.push({ pair: `${PAGES[i].name} ↔ ${PAGES[j].name}`, v });
    max = Math.max(max, v); sum += v; n++;
  }
  simTop.sort((a, b) => b.v - a.v);
  push('G4', `본문 5-gram 유사도 ${n}쌍 최대<15%`,
    `최대 ${(max * 100).toFixed(2)}% · 평균 ${(sum / n * 100).toFixed(2)}%`, max < 0.15);
}

/* ── G5 h1 1개 + 구조 블록 7종 ── */
{
  const bad = [];
  for (const p of PAGES) {
    const s = html[p.slug];
    const h1 = (s.match(/<h1>/g) || []).length;
    const miss = [];
    if (h1 !== 1) miss.push(`h1=${h1}`);
    if (!s.includes('class="answer-box"')) miss.push('핵심3줄');
    if (!s.includes('사실 표')) miss.push('사실표');
    if (!s.includes('class="final"')) miss.push('맨끝답');
    if (!s.includes('class="faq"')) miss.push('FAQ');
    if (!s.includes('class="oneline')) miss.push('한줄정리');
    if (!s.includes('class="lead"')) miss.push('도입');
    const nSec = p.secs.length;
    if (nSec < 4 || nSec > 6) miss.push(`입문소제목=${nSec}`);
    if (miss.length) bad.push(`${p.slug}:${miss.join('/')}`);
  }
  push('G5', 'h1 1개 + 7블록(도입·3줄·사실표·소제목4~6·끝답·FAQ·한줄)',
    bad.length ? bad.slice(0, 5).join(' ') : '40/40 전 블록 정상', bad.length === 0);
}

/* ── G6 질문형 H2 ≥2 + 용어 괄호 풀이 ≥1 ── */
{
  const rows = [];
  let bad = 0;
  for (const p of PAGES) {
    const q = p.secs.filter((s) => /\?$/.test(s.h2.trim())).length;
    const terms = (html[p.slug].match(/class="term"/g) || []).length;
    const gloss = /<span class="term">[^<]+<\/span>\([^)]+\)/.test(html[p.slug]);
    rows.push({ n: p.name, q, terms });
    if (q < 2 || terms < 1 || !gloss) bad++;
  }
  push('G6', '질문형 H2 ≥2 · 용어 괄호 풀이 ≥1',
    `질문형 H2 최소 ${Math.min(...rows.map((r) => r.q))}개 · 용어 표기 최소 ${Math.min(...rows.map((r) => r.terms))}회 · 위반 ${bad}건`,
    bad === 0);
}

/* ── G7 FAQ 3개 · 답변 40~90자 · JSON-LD 3종 파싱 ── */
{
  const bad = [];
  for (const p of PAGES) {
    if (p.faq.length !== 3) bad.push(`${p.slug}:FAQ=${p.faq.length}`);
    for (const f of p.faq) {
      if (f.a.length < 40 || f.a.length > 90) bad.push(`${p.slug}:${f.a.length}자`);
    }
    const blocks = [...html[p.slug].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (blocks.length !== 3) { bad.push(`${p.slug}:LD=${blocks.length}`); continue; }
    for (const b of blocks) { try { JSON.parse(b[1]); } catch (e) { bad.push(`${p.slug}:parse`); } }
  }
  push('G7', 'FAQ 3개·답변 40~90자 · JSON-LD 3종 파싱 0오류',
    bad.length ? bad.slice(0, 6).join(' ') : `FAQ 120개 전부 40~90자 · LD 120블록 정상`, bad.length === 0);
}

/* ── G8 고정바·푸터 문구 ── */
{
  const cb = (s) => s.slice(s.indexOf('<div class="callbar"'));
  const a = PAGES.filter((p) => p.group === 'A');
  const b = PAGES.filter((p) => p.group === 'B');
  const aBad = a.filter((p) => !cb(html[p.slug]).includes(p.tel));
  const bBad = b.filter((p) => !cb(html[p.slug]).includes(`💬 광고문의 카카오톡`) || !cb(html[p.slug]).includes(KAKAO));
  const footBad = PAGES.filter((p) => !/ad-inquiry[^>]*>💬 광고문의 카카오톡 <b>besta12<\/b>/.test(html[p.slug]));
  push('G8', `고정바 — 광고주 ${a.length}p 전화 / 나머지 ${b.length}p "💬 광고문의 카카오톡 besta12" · 푸터 40p`,
    `광고주 위반 ${aBad.length} · 일반 위반 ${bBad.length} · 푸터 위반 ${footBad.length} (푸터 #FFF on #000 = 21:1)`,
    aBad.length === 0 && bBad.length === 0 && footBad.length === 0);
}

/* ── G9 사실 표 5행 + 확인 불가 표기 + 인천아라비안 표기 규칙 ── */
{
  const bad = [];
  let unknownCells = 0;
  for (const p of PAGES) {
    const t = html[p.slug];
    const cap = `${p.name} 사실 표`;
    if (!t.includes(cap)) bad.push(`${p.slug}:표없음`);
    for (const th of ['주소', '가까운 역', '입장 연령', '층·구조', '확인 시점']) {
      if (!t.includes(`<th scope="row">${th}</th>`)) bad.push(`${p.slug}:${th}`);
    }
    [p.addr, p.station, p.age, p.floor].forEach((v) => { if (String(v).includes('확인 불가')) unknownCells++; });
  }
  const arab = PAGES.find((p) => p.slug === 'incheon-arabian');
  const arabOk = arab && html[arab.slug].includes('인천아라비안나이트') && html[arab.slug].includes('인천아라비아나이트');
  if (!arabOk) bad.push('incheon-arabian:표기규칙');
  push('G9', '사실 표 5행 전 페이지 + "확인 불가" 표기 + 인천아라비안 한 페이지 두 표기',
    `표 40/40 · 확인 불가 셀 ${unknownCells}개 · 인천아라비아나이트 병기 ${arabOk ? 'OK' : 'NG'} · 위반 ${bad.length}건`,
    bad.length === 0);
}

/* ── G10 전화번호 허용표 — 홈 포함 광고주 페이지 외 010- 0건 ── */
{
  const hits = [];
  for (const p of PAGES) {
    const found = html[p.slug].match(/010[-\s]?\d{3,4}[-\s]?\d{4}/g) || [];
    if (found.length && !PHONE_ALLOW.includes(p.slug)) hits.push(`/start/${p.slug}/:${found[0]}`);
    if (PHONE_ALLOW.includes(p.slug)) {
      const digits = (x) => x.replace(/\D/g, '');
      const wrong = found.filter((f) => digits(f) !== digits(p.tel));
      if (wrong.length) hits.push(`/start/${p.slug}/:타번호 ${wrong[0]}`);
    }
  }
  const hub = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  if (/010[-\s]?\d{3,4}[-\s]?\d{4}/.test(hub)) hits.push('/start/ 허브:010 발견');
  const homeFile = path.join(OUT, 'index.html');
  if (fs.existsSync(homeFile)) {
    const home = fs.readFileSync(homeFile, 'utf8');
    if (/010[-\s]?\d{3,4}[-\s]?\d{4}/.test(home)) hits.push('홈:010 발견');
  } else {
    hits.push('홈: out/index.html 미빌드 — 검증 불가');
  }
  push('G10', `허용표 = 광고주 ${PHONE_ALLOW.length}업소(${PHONE_ALLOW.join(',')}) · 홈 포함 그 외 010- 발견 시 실패`,
    hits.length ? hits.join(' / ') : `허용 ${PHONE_ALLOW.length}p 외 010- 0건 (허브·홈 포함 검사)`, hits.length === 0);
}

/* ── G11 내부링크 깨짐 0 + 외부 아웃바운드 0 ── */
{
  const ext = [], broken = [];
  const files = PAGES.map((p) => ({ id: p.slug, s: html[p.slug] }))
    .concat([{ id: 'hub', s: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8') }]);
  const known = new Set(['/', '/start/', '/info-guide', '/hours-guide', '/ladies-guide', '/faq-guide', '/contact-guide', '/night/', '/bulgwangdong-hobak']);
  for (const f of files) {
    for (const m of f.s.matchAll(/<a [^>]*href="([^"]+)"/g)) {
      const h = m[1];
      if (/^https?:\/\//.test(h) && !h.startsWith(SITE)) { ext.push(`${f.id}:${h}`); continue; }
      if (h.startsWith('#') || h.startsWith('tel:')) continue;
      if (known.has(h)) continue;
      if (h.startsWith('/start/')) {
        const slug = h.replace(/^\/start\//, '').replace(/\/$/, '');
        if (!slug) continue;
        if (!fs.existsSync(path.join(ROOT, slug, 'index.html'))) broken.push(`${f.id}→${h}`);
        continue;
      }
      broken.push(`${f.id}→${h}`);
    }
  }
  push('G11', '내부링크 깨짐 0 + 외부 아웃바운드 0 (tel: 제외)',
    `링크 검사 41파일 · 외부 ${ext.length}건 · 깨짐 ${broken.length}건${broken.length ? ' ' + broken.slice(0, 4).join(',') : ''}`,
    ext.length === 0 && broken.length === 0);
}

/* ── 출력 ── */
console.log('\n| 게이트 | 항목 | 실측 | 결과 |');
console.log('|---|---|---|---|');
for (const r of R) console.log(`| ${r.id} | ${r.name} | ${String(r.measured).slice(0, 320)} | ${r.pass} |`);
const fails = R.filter((r) => r.pass === 'FAIL');
console.log(`\n게이트 ${R.length}종 중 FAIL ${fails.length}건`);
console.log('\n[본문 유사도 상위 3쌍]');
simTop.slice(0, 3).forEach((s) => console.log(`  ${s.pair} — ${(s.v * 100).toFixed(2)}%`));
fs.writeFileSync(path.join(__dirname, '../.start-audit.json'), JSON.stringify({ R, simTop: simTop.slice(0, 5) }, null, 2));
if (fails.length) process.exit(1);
