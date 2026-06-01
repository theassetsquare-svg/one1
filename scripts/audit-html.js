#!/usr/bin/env node
/**
 * HTML quality audit per page.
 *
 * Checks:
 *  - <title> present and 10–70 chars
 *  - <meta name="description"> present and 50–170 chars
 *  - exactly one <h1>
 *  - canonical link present
 *  - all <img> have width, height, alt
 *  - internal links resolve to a known route or file in out/
 *  - no http:// links (must be https or relative)
 *  - lang attribute on <html>
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'out';
const PAGES = ['index', 'info', 'hours', 'ladies', 'faq', 'contact'];
const ROUTES = new Set(['/', '/info', '/hours', '/ladies', '/faq', '/contact']);

let fails = 0;
const log = (level, page, msg) => {
  if (level === 'FAIL') fails++;
  console.log(`${level.padEnd(5)} ${page.padEnd(8)} ${msg}`);
};

function pageBuiltExists(p) {
  return fs.existsSync(path.join(ROOT, p === 'index' ? 'index.html' : `${p}.html`));
}

function readHtml(p) {
  return fs.readFileSync(path.join(ROOT, p === 'index' ? 'index.html' : `${p}.html`), 'utf8');
}

for (const p of PAGES) {
  if (!pageBuiltExists(p)) {
    log('FAIL', p, 'built file missing');
    continue;
  }
  const html = readHtml(p);

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/);
  if (!titleMatch) log('FAIL', p, 'no <title>');
  else {
    const t = titleMatch[1].trim();
    if (t.length < 10 || t.length > 70)
      log('FAIL', p, `title length ${t.length} (want 10–70): "${t.slice(0, 60)}"`);
    else log('OK   ', p, `title ${t.length}ch`);
  }

  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (!descMatch) log('FAIL', p, 'no meta description');
  else {
    const d = descMatch[1];
    if (d.length < 50 || d.length > 170)
      log('FAIL', p, `description length ${d.length} (want 50–170)`);
    else log('OK   ', p, `description ${d.length}ch`);
  }

  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) log('FAIL', p, `h1 count = ${h1Count} (want 1)`);
  else log('OK   ', p, 'h1 = 1');

  if (!/<link[^>]+rel="canonical"/.test(html)) log('FAIL', p, 'no canonical link');
  else log('OK   ', p, 'canonical');

  if (!/<html[^>]+lang="ko"/.test(html)) log('FAIL', p, 'no <html lang="ko">');
  else log('OK   ', p, 'lang=ko');

  const imgs = [...html.matchAll(/<img\b([^>]*)>/g)];
  for (const m of imgs) {
    const attrs = m[1];
    if (!/\swidth=/.test(attrs)) log('FAIL', p, 'img missing width');
    if (!/\sheight=/.test(attrs)) log('FAIL', p, 'img missing height');
    if (!/\salt=/.test(attrs)) log('FAIL', p, 'img missing alt');
  }
  if (imgs.length === 0) log('OK   ', p, 'no <img> tags (background-only)');

  const internalLinks = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const href of internalLinks) {
    if (ROUTES.has(href)) continue;
    const asFile = path.join(ROOT, href.replace(/^\//, ''));
    if (fs.existsSync(asFile)) continue;
    log('FAIL', p, `broken internal link href="${href}"`);
  }

  if (/href="http:\/\//.test(html)) log('FAIL', p, 'plain http:// link present');

  if (/<a[^>]*href="tel:[^"]*"/.test(html)) log('OK   ', p, 'tel: link present');
  else log('FAIL', p, 'no tel: link');
}

if (fails) {
  console.error(`\n${fails} failure(s).`);
  process.exit(1);
}
console.log('\nAll HTML audits PASS.');
