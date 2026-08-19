#!/usr/bin/env node
/**
 * /og/*.png 후처리 — 1200x1200 규격 유지 + 300KB 이하 압축.
 *
 * - 규격 미달(1200x1200 아님) 파일은 실패로 보고한다 (생성 스크립트에서 고쳐야 함).
 * - 300KB 초과분만 팔레트 양자화로 재인코딩한다. 글자 선명도 유지를 위해
 *   색 수를 256 → 64 순으로만 낮추고, 리사이즈나 블러는 하지 않는다.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'public', 'og');
const LIMIT = 300 * 1024;
const SIDE = 1200;

const dims = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

(async () => {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png')).sort();
  let fails = 0;
  const rows = [];

  for (const f of files) {
    const p = path.join(DIR, f);
    let buf = fs.readFileSync(p);
    const d = dims(buf);
    const before = buf.length;
    let colors = '-';

    if (buf.length > LIMIT) {
      for (const c of [256, 192, 128, 96, 64]) {
        const out = await sharp(buf).png({ palette: true, colors: c, effort: 10, dither: 0.5 }).toBuffer();
        if (out.length <= LIMIT) { buf = out; colors = c; break; }
        buf = out; colors = c;
      }
      fs.writeFileSync(p, buf);
    }

    const d2 = dims(fs.readFileSync(p));
    const okSize = d2.w === SIDE && d2.h === SIDE;
    const okKb = buf.length <= LIMIT;
    if (!okSize || !okKb) fails++;
    rows.push({
      file: f,
      size: `${d2.w}x${d2.h}`,
      beforeKB: Math.round(before / 1024),
      afterKB: Math.round(buf.length / 1024),
      colors,
      verdict: okSize && okKb ? 'PASS' : `FAIL(${!okSize ? '규격' : ''}${!okKb ? '용량' : ''})`,
    });
  }

  rows.forEach((r) =>
    console.log(
      `${r.verdict.padEnd(10)} ${r.file.padEnd(34)} ${r.size.padEnd(10)} ${String(r.beforeKB).padStart(4)}KB → ${String(r.afterKB).padStart(4)}KB  colors=${r.colors}`
    )
  );
  fs.writeFileSync(path.join(__dirname, '..', '.og-compress.json'), JSON.stringify(rows, null, 2));
  console.log(`\n${rows.length}개 검사 · 실패 ${fails}개`);
  if (fails) process.exit(1);
})();
