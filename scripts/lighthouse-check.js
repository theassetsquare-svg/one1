#!/usr/bin/env node
/**
 * Lighthouse threshold parser.
 *
 * Reads reports/(m|d)*.json produced by `lighthouse --output=json`,
 * checks each category against THRESHOLDS, and fails CI if any
 * category drops below.
 */
const fs = require('fs');
const path = require('path');

const REPORTS = process.argv[2] || 'reports';
const THRESHOLDS = {
  performance: 70,
  accessibility: 90,
  'best-practices': 90,
  seo: 95,
};

if (!fs.existsSync(REPORTS)) {
  console.error(`Reports dir ${REPORTS} missing`);
  process.exit(1);
}

const files = fs.readdirSync(REPORTS).filter((f) => f.endsWith('.json'));
if (!files.length) {
  console.error('No JSON reports found');
  process.exit(1);
}

let fails = 0;
console.log(`form     page                 perf  a11y  bp    seo`);
console.log('-'.repeat(56));

for (const f of files.sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(REPORTS, f), 'utf8'));
  const cats = data.categories || {};
  const form = f.startsWith('m') ? 'mobile' : 'desktop';
  const page = f.replace(/^[md]/, '').replace('.json', '').replace(/^_/, '/').replace(/_/g, '/');
  const row = ['performance', 'accessibility', 'best-practices', 'seo'].map((k) => {
    const score = cats[k] ? Math.round(cats[k].score * 100) : null;
    const pass = score != null && score >= THRESHOLDS[k];
    if (!pass) fails++;
    return score == null ? ' --' : `${pass ? ' ' : '!'}${String(score).padStart(2)}`;
  });
  console.log(`${form.padEnd(8)} ${page.padEnd(20)} ${row.join('   ')}`);
}

if (fails) {
  console.error(`\n${fails} category(ies) below threshold.`);
  console.error(`Thresholds: ${JSON.stringify(THRESHOLDS)}`);
  process.exit(1);
}
console.log('\nAll Lighthouse categories meet thresholds.');
