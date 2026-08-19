#!/usr/bin/env node
/**
 * G9+ 썸메일 노출 게이트 — 빌드 산출물(out/)의 모든 HTML 페이지를 실측한다.
 *
 * 페이지마다 6개 항목을 검사하고 하나라도 실패하면 exit 1 (배포 금지).
 *  ① 본문 <img> 존재 (main 안, /og/*.png)
 *  ② og:image 와 본문 img 가 같은 파일
 *  ③ 메타 9종 완비: og:image / og:image:secure_url / og:image:width=1200 /
 *     og:image:height=1200 / og:image:type=image/png / og:image:alt /
 *     twitter:card=summary / twitter:image / meta[name=thumbnail]
 *  ④ PNG 실측 1200x1200
 *  ⑤ PNG 300KB 이하
 *  ⑥ img alt 에 가게이름(페이지 주체) 포함
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'out';
const LIMIT = 300 * 1024;

/* 페이지 주체(가게이름) — alt 에 반드시 들어가야 하는 문자열 */
function subject(rel) {
  if (rel === 'index.html') return '다시 시작하는 이야기';
  if (rel === '404.html') return '대전원나이트';
  if (rel === 'bulgwangdong-hobak.html') return '불광동호박나이트';
  if (rel.startsWith('night/')) return rel === 'night/index.html' ? '나이트 안내 목록' : null;
  if (rel.startsWith('start/')) return rel === 'start/index.html' ? '전국 나이트 입문 노트' : null;
  return '대전원나이트';
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next') continue;
      walk(p, out);
    } else if (e.name.endsWith('.html') && !/^google[a-z0-9]+\.html$/.test(e.name)) out.push(p); // 소유확인 스텁 제외
  }
  return out;
}

const dims = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });
const metaC = (html, re) => (html.match(re) || [])[1];

const rows = [];
let fails = 0;

for (const file of walk(ROOT).sort()) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];

  const imgTag = (main.match(/<img\b[^>]*src="(\/og\/[^"]+\.png)"[^>]*>/) || []);
  const bodyImg = imgTag[1];
  const alt = imgTag[0] ? (imgTag[0].match(/alt="([^"]*)"/) || [])[1] : undefined;

  const og = metaC(html, /<meta property="og:image" content="([^"]+)"/);
  const sec = metaC(html, /<meta property="og:image:secure_url" content="([^"]+)"/);
  const w = metaC(html, /<meta property="og:image:width" content="([^"]+)"/);
  const h = metaC(html, /<meta property="og:image:height" content="([^"]+)"/);
  const type = metaC(html, /<meta property="og:image:type" content="([^"]+)"/);
  const oalt = metaC(html, /<meta property="og:image:alt" content="([^"]+)"/);
  const tcard = metaC(html, /<meta name="twitter:card" content="([^"]+)"/);
  const timg = metaC(html, /<meta name="twitter:image" content="([^"]+)"/);
  const thumb = metaC(html, /<meta name="thumbnail" content="([^"]+)"/);

  const ogPath = og ? og.replace(/^https?:\/\/[^/]+/, '') : undefined;
  const errs = [];

  if (!bodyImg) errs.push('①본문img없음');
  if (!ogPath) errs.push('②og:image없음');
  else if (bodyImg && ogPath !== bodyImg) errs.push(`②불일치(og=${ogPath} img=${bodyImg})`);

  const meta9 = { 'og:image': og, 'og:image:secure_url': sec, 'og:image:width': w, 'og:image:height': h,
    'og:image:type': type, 'og:image:alt': oalt, 'twitter:card': tcard, 'twitter:image': timg, thumbnail: thumb };
  const missing = Object.entries(meta9).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) errs.push('③누락:' + missing.join(','));
  if (w && w !== '1200') errs.push('③width=' + w);
  if (h && h !== '1200') errs.push('③height=' + h);
  if (type && type !== 'image/png') errs.push('③type=' + type);
  if (tcard && tcard !== 'summary') errs.push('③twitter:card=' + tcard);
  if (og && sec && og !== sec) errs.push('③secure_url불일치');
  if (og && timg && og !== timg) errs.push('③twitter:image불일치');
  if (og && thumb && og !== thumb) errs.push('③thumbnail불일치');
  if (og && !/^https:\/\//.test(og)) errs.push('③og:image절대URL아님');

  let size = '-', kb = '-';
  const png = bodyImg ? path.join(ROOT, bodyImg.replace(/^\//, '')) : null;
  if (png && fs.existsSync(png)) {
    const buf = fs.readFileSync(png);
    const d = dims(buf);
    size = `${d.w}x${d.h}`;
    kb = Math.round(buf.length / 1024);
    if (d.w !== 1200 || d.h !== 1200) errs.push('④규격' + size);
    if (buf.length > LIMIT) errs.push('⑤용량' + kb + 'KB');
  } else if (bodyImg) errs.push('④파일없음');

  const sub = subject(rel);
  if (!alt) errs.push('⑥alt없음');
  else if (sub && !alt.includes(sub)) errs.push(`⑥alt에 "${sub}" 없음`);
  else if (!sub) {
    // /night/{slug}/, /start/{slug}/ — 업소명은 h1 에서 추출해 대조
    const h1 = (html.match(/<h1[^>]*>([^<]*)</) || [])[1] || '';
    const name = h1.split(/[ ,·—(]/)[0];
    if (name && !alt.includes(name)) errs.push(`⑥alt에 "${name}" 없음`);
  }

  if (errs.length) fails++;
  rows.push({ rel, img: bodyImg || '-', size, kb, verdict: errs.length ? 'FAIL ' + errs.join(' / ') : 'PASS' });
}

for (const r of rows) {
  console.log(`${r.verdict === 'PASS' ? 'PASS' : 'FAIL'} ${r.rel.padEnd(38)} ${String(r.img).padEnd(34)} ${r.size.padEnd(10)} ${String(r.kb).padStart(4)}KB  ${r.verdict === 'PASS' ? '' : r.verdict}`);
}
fs.writeFileSync('.thumb-audit.json', JSON.stringify(rows, null, 2));
console.log(`\n${rows.length}개 페이지 · 실패 ${fails}개`);
if (fails) { console.error('G9+ 게이트 실패 — 배포 금지'); process.exit(1); }
console.log('G9+ 게이트 통과');
