#!/usr/bin/env node
/**
 * Per-page keyword stuffing audit.
 *
 * Strips: <nav>, <footer>, sticky float-call <a>, <script>, <style>,
 *         JSON-LD blocks, HTML attributes, comments. Keeps only visible
 *         body text from <main>.
 *
 * Fails if any tracked keyword exceeds density threshold (default 3%)
 * OR appears 3+ times in a single sentence.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'out';
const PAGES = ['index', 'info', 'hours', 'ladies', 'faq', 'contact'];
const KEYWORDS = ['대전원나이트', '대전 원나이트', '대전나이트', '대전 나이트'];
const DENSITY_MAX = 3.0;
const TRIPLE_MAX = 0;

function visibleText(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/g, ' ');
  s = s.replace(/<style[\s\S]*?<\/style>/g, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<nav[\s\S]*?<\/nav>/g, ' ');
  s = s.replace(/<footer[\s\S]*?<\/footer>/g, ' ');
  s = s.replace(/<a[^>]*class="[^"]*float-call[^"]*"[\s\S]*?<\/a>/g, ' ');
  const mainMatch = s.match(/<main[\s\S]*?<\/main>/);
  if (mainMatch) s = mainMatch[0];
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&[a-z]+;/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function countOccurrences(text, needle) {
  let n = 0;
  let i = 0;
  while ((i = text.indexOf(needle, i)) !== -1) {
    n++;
    i += needle.length;
  }
  return n;
}

let fails = 0;
const rows = [];

for (const p of PAGES) {
  const file = path.join(ROOT, p === 'index' ? 'index.html' : `${p}.html`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING ${file}`);
    fails++;
    continue;
  }
  const text = visibleText(fs.readFileSync(file, 'utf8'));
  const words = text.split(' ').filter(Boolean).length;

  for (const kw of KEYWORDS) {
    const count = countOccurrences(text, kw);
    const density = words ? (count / words) * 100 : 0;
    const overDensity = density > DENSITY_MAX;
    const sentences = text.split(/[.!?。]/);
    const tripleSentences = sentences.filter((sen) => countOccurrences(sen, kw) >= 3).length;
    const overTriple = tripleSentences > TRIPLE_MAX;
    const ok = !overDensity && !overTriple;
    if (!ok) fails++;
    rows.push({
      page: p,
      kw,
      count,
      words,
      density: density.toFixed(2),
      overDensity,
      tripleSentences,
      overTriple,
      ok,
    });
  }
}

const colW = { page: 8, kw: 14, count: 5, words: 6, density: 8, triples: 7, ok: 4 };
const header =
  `${'page'.padEnd(colW.page)} ${'keyword'.padEnd(colW.kw)} ${'cnt'.padStart(colW.count)} ` +
  `${'words'.padStart(colW.words)} ${'density%'.padStart(colW.density)} ${'3xS'.padStart(colW.triples)} ${'ok'.padStart(colW.ok)}`;
console.log(header);
console.log('-'.repeat(header.length));
for (const r of rows) {
  console.log(
    `${r.page.padEnd(colW.page)} ${r.kw.padEnd(colW.kw)} ${String(r.count).padStart(colW.count)} ` +
      `${String(r.words).padStart(colW.words)} ${r.density.padStart(colW.density)} ${String(r.tripleSentences).padStart(colW.triples)} ${(r.ok ? 'PASS' : 'FAIL').padStart(colW.ok)}`
  );
}

if (fails) {
  console.error(`\n${fails} failure(s). Density max ${DENSITY_MAX}% / triples-per-sentence max ${TRIPLE_MAX}.`);
  process.exit(1);
}
console.log('\nAll pages PASS.');
