#!/usr/bin/env node
/**
 * sitemap.xml 의 <image:image> 를 각 페이지가 실제로 쓰는 썸네일(og:image)과 동기화한다.
 * 판단 기준은 빌드 산출물(out/)의 og:image / og:image:alt — 사이트맵이 유일한 진실이 되지 않게 한다.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'out';
const SITEMAP = 'public/sitemap.xml';
const SITE = 'https://f.nolcool.com';

function htmlFor(loc) {
  let p = loc.replace(SITE, '').replace(/^\//, '');
  if (p === '') p = 'index.html';
  else if (p.endsWith('/')) p += 'index.html';
  else p += '.html';
  const f = path.join(ROOT, p);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let xml = fs.readFileSync(SITEMAP, 'utf8');
let changed = 0, missing = 0;

xml = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
  const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  const html = loc ? htmlFor(loc) : null;
  if (!html) { missing++; console.log(`  SKIP (빌드 없음) ${loc}`); return block; }
  const og = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
  const alt = (html.match(/<meta property="og:image:alt" content="([^"]+)"/) || [])[1] || '';
  if (!og) { missing++; console.log(`  SKIP (og:image 없음) ${loc}`); return block; }
  const img = `    <image:image>\n      <image:loc>${esc(og)}</image:loc>\n      <image:caption>${esc(alt)}</image:caption>\n    </image:image>`;
  const stripped = block.replace(/\n?\s*<image:image>[\s\S]*?<\/image:image>/g, '');
  const out = stripped.replace('\n  </url>', `\n${img}\n  </url>`);
  if (out !== block) changed++;
  return out;
});

fs.writeFileSync(SITEMAP, xml);
console.log(`\nsitemap 이미지 동기화: 변경 ${changed}개 · 건너뜀 ${missing}개`);
if (missing) process.exit(1);
