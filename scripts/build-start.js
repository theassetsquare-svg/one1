/* public/start/{slug}/index.html 40개 + 허브 /start/ 생성 */

/* 쪽마다 다른 안내 문단 — scripts/guide-extra.json 에서 읽는다.
   ★ 2026-09-01 — 본문이 1,800자에 못 미치던 쪽을 채우려고 넣었다.
     글을 생성기에 박지 않고 자료 파일에서 읽는다(문단을 바꿔도 생성기는 그대로). */

/* 가게이름 덜어내기 — 본문에 3~5회만 남긴다 (설계도 4장 G4).
   ★ 2026-09-01 — 소개 글이 길어지면서 가게이름이 9~12회씩 나왔다. 키워드 나열로 보인다.
     제목·h1·첫 문장은 그대로 두고, 그 뒤로 넘치는 것만 「이곳」으로 바꾼다.
     <head>·머리말·꼬리말·메뉴는 세지 않는다(게이트와 같은 기준). */
function thinVenueName(html, name, keep) {
  if (!name) return html;
  const 몫 = keep || 4;
  const 잘라낼곳 = [];
  const 가림 = html
    .replace(/<head[\s\S]*?<\/head>/gi, (m) => ' '.repeat(m.length))
    .replace(/<header[\s\S]*?<\/header>/gi, (m) => ' '.repeat(m.length))
    .replace(/<footer[\s\S]*?<\/footer>/gi, (m) => ' '.repeat(m.length))
    .replace(/<nav[\s\S]*?<\/nav>/gi, (m) => ' '.repeat(m.length))
    .replace(/<script[\s\S]*?<\/script>/gi, (m) => ' '.repeat(m.length))
    .replace(/<[^>]+>/g, (m) => ' '.repeat(m.length));
  let at = 가림.indexOf(name), 본수 = 0;
  while (at >= 0) {
    본수 += 1;
    if (본수 > 몫) 잘라낼곳.push(at);
    at = 가림.indexOf(name, at + name.length);
  }
  if (!잘라낼곳.length) return html;
  let 결과 = html;
  for (let i = 잘라낼곳.length - 1; i >= 0; i -= 1) {
    const p = 잘라낼곳[i];
    결과 = 결과.slice(0, p) + '이곳' + 결과.slice(p + name.length);
  }
  return 결과;
}

const GUIDE_EXTRA = (() => { try { return require('./guide-extra.json'); } catch { return {}; } })();
function guideExtra(pathname) {
  const 마디 = GUIDE_EXTRA[String(pathname).replace(/\/+$/, '')];
  if (!마디 || !마디.length) return '';
  const 줄 = [];
  for (const m of 마디) {
    줄.push('<section class="guide-more">');
    줄.push('<h2>' + m.소제목 + '</h2>');
    for (const p of m.문단) 줄.push('<p>' + p + '</p>');
    줄.push('</section>');
  }
  return '\n' + 줄.join('\n') + '\n';
}

const fs = require('fs');
const path = require('path');
const { SITE, KAKAO, TODAY, PAGES } = require('./start-data.js');

const OUT_ROOT = path.join(__dirname, '..', 'public', 'start');
const GSV = 'HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88';
const NSV = 'de7f572176f78093fb88bfb999b59fe0d65c37cb';

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => String(s).replace(/<[^>]+>/g, '');

/* ★★ 2026-08-30 — 아래 두 곳은 글은 그대로 두고 주소만 /night/ 쪽으로 옮겼다.
   여기서 /start/ 판을 또 만들면 같은 글이 두 주소에 올라가 네이버가 하나를 버린다.
   (실측: 어절 3-gram 전부 · 문장 전부 겹침) 링크도 옮긴 주소로 건다. */
const MOVED = {
  'gwangju-cheomdan': '/night/gwangju-cheomdan-night-1/',
  'indeogwon-gukbingwan': '/night/indeogwon-gukbingwan-night-1/',
};
const hrefFor = (slug) => MOVED[slug] || ('/start/' + slug + '/');

const byNo = {};
PAGES.forEach((p) => { byNo[p.no] = p; });

/* 전화바에 가게이름을 함께 노출하는 업소 (2026-08-20 청담나이트 승격) */
const BAR_WITH_VENUE = new Set(['청담나이트']);

function callbar(p) {
  if (p.group === 'A') {
    const who = (BAR_WITH_VENUE.has(p.name) ? p.name + ' ' : '') + p.manager;
    return `<div class="callbar" role="complementary" aria-label="전화 연결">
  <a href="tel:${p.telHref}">📞 ${who} ${p.tel}</a>
</div>`;
  }
  return `<div class="callbar" role="complementary" aria-label="광고 문의">
  <span>💬 광고문의 카카오톡 <b>${KAKAO}</b></span>
</div>`;
}

function jsonld(p) {
  const url = `${SITE}/start/${p.slug}/`;
  const club = {
    '@context': 'https://schema.org',
    '@type': 'NightClub',
    name: p.name,
    url,
    image: `${SITE}/og/start-${p.slug}-og.png`,
    description: strip(p.answer3[0]),
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.locality,
      addressRegion: p.addrRegion,
      addressCountry: 'KR',
      /* ★ 2026-09-01 — streetAddress 가 빠져 있어 빌드마다 주소가 지워졌다.
         지어내지 않는다: data/shops 의 verified 된 값만 넣는다(없으면 넣지 않는다). */
      ...(ADDR[p.name] ? { streetAddress: ADDR[p.name] } : {}),
    },
  };
  if (p.group === 'A') club.telephone = '+82-' + p.tel.replace(/^0/, '');
  if (p.age && p.age !== '확인 불가') club.typicalAgeRange = p.age;

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faq.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '나이트 입문 노트', item: `${SITE}/start/` },
      { '@type': 'ListItem', position: 3, name: p.name, item: url },
    ],
  };
  return [club, faq, crumb]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');
}

function renderSection(s) {
  let out = `<section>\n<h2>${s.h2}</h2>\n`;
  (s.ps || []).forEach((t) => { out += `<p>${t}</p>\n`; });
  if (s.list) out += '<ul class="check">\n' + s.list.map((li) => `<li>${li}</li>`).join('\n') + '\n</ul>\n';
  if (s.table) {
    out += `<table>\n<caption>${s.table.cap}</caption>\n<tbody>\n`;
    s.table.rows.forEach((r) => { out += `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>\n`; });
    out += '</tbody>\n</table>\n';
  }
  out += '</section>\n';
  return out;
}

function factTable(p) {
  const rows = [
    ['주소', p.addr],
    ['가까운 역', p.station],
    ['입장 연령', p.age],
    ['층·구조', p.floor],
    ['확인 시점', `${TODAY}`],
  ];
  return `<table>
<caption>${p.name} 사실 표 (공개 자료 기준)</caption>
<tbody>
${rows.map((r) => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join('\n')}
</tbody>
</table>`;
}

function renderPage(p) {
  const url = `${SITE}/start/${p.slug}/`;
  const og = `${SITE}/og/start-${p.slug}-og.png`;
  const rel = (p.related || []).map((n) => byNo[n]).filter(Boolean);

  const head = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${attr(p.title)}</title>
<meta name="description" content="${attr(p.desc)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="google-site-verification" content="${GSV}">
<meta name="naver-site-verification" content="${NSV}">
<meta name="keywords" content="${attr([p.name, p.nameB, p.nameC, p.locality + ' 나이트', '나이트 입문', '나이트 처음'].join(', '))}">
<meta name="theme-color" content="#F7EFE1">
<meta name="color-scheme" content="light">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko-KR" href="${url}">
<link rel="icon" type="image/png" sizes="32x32" href="https://f.nolcool.com/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://f.nolcool.com/favicon-16x16.png">
<link rel="apple-touch-icon" href="https://f.nolcool.com/icons/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${attr(p.title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:secure_url" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="1200">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${attr(p.ogAlt)}">
<meta name="thumbnail" content="${og}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${attr(p.title)}">
<meta name="twitter:description" content="${attr(p.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="stylesheet" href="/start/start.css">
${jsonld(p)}
</head>`;

  const body = `<body>
<header>
<a href="#main" class="skip-link">본문 바로가기</a>
<nav class="topnav" aria-label="주요 메뉴">
  <div class="topnav-in">
    <a href="/">홈</a>
    <a href="/start/">입문 노트 40</a>
    <a href="/start/${p.slug}/" aria-current="page">${p.name}</a>
  </div>
</nav>
</header>
<p class="crumb"><a href="/">홈</a> &gt; <a href="/start/">나이트 입문 노트</a> &gt; ${p.name}</p>
<main id="main">
<article>
<h1>${p.title}</h1>
<p class="meta-line">${p.region} · <time datetime="${TODAY}">${TODAY}</time> 기준 정리</p>
<p class="note-tag hand">처음 가는 사람 입문 노트</p>

<div class="answer-box">
<h2>핵심 3줄</h2>
<ol>
${p.answer3.map((t) => `<li>${t}</li>`).join('\n')}
</ol>
</div>

<div class="thumb-wrap"><img src="/og/start-${p.slug}-og.png" alt="${attr(p.ogAlt)}" width="1200" height="1200" style="max-width:100%;height:auto" loading="eager"></div>

<div class="lead">
${p.lead.map((t) => `<p>${t}</p>`).join('\n')}
</div>

<section>
<h2>${p.name} 기본 정보 한눈에</h2>
${factTable(p)}
</section>

${p.secs.map(renderSection).join('')}
<div class="final">
<h2>그래서, 제목의 답은</h2>
${p.final.map((t) => `<p>${t}</p>`).join('\n')}
</div>

<section class="faq">
<h2>${p.name} 자주 묻는 질문</h2>
<dl>
${p.faq.map((f) => `<dt>${f.q}</dt>\n<dd>${f.a}</dd>`).join('\n')}
</dl>
</section>

<p class="oneline hand">한 줄 정리 — ${p.oneline || strip(p.answer3[1])}</p>

<aside class="related">
<h2>같이 보면 좋은 입문 노트</h2>
<ul>
${rel.map((r) => `<li><a href="${hrefFor(r.slug)}">${r.name}</a> — ${r.region}</li>`).join('\n')}
<li><a href="/start/">전국 나이트 입문 노트 40 전체 보기</a></li>
</ul>
</aside>
</article>
</main>
<footer class="site">
<div class="footer-in">
<p>${p.name} 입문 노트 · ${p.region}</p>
<p class="ad-inquiry">💬 광고문의 카카오톡 <b>${KAKAO}</b></p>
<p class="footer-copy">© 2026 · 처음 가는 사람 입문 노트. 공개 자료를 정리한 안내 페이지이며, 확인되지 않은 항목은 "확인 불가"로 표기했습니다.</p>
</div>
</footer>
${guideExtra(`/start/${p.slug}/`)}
${callbar(p)}
<p class="age-notice" style="margin:18px 0 0;font-size:13px;line-height:1.7;color:#9aa0a6">성인(만 19세 이상) 전용 공간을 다룹니다. 청소년 출입과 고용은 금지되어 있습니다.</p>
<p class="rel-notice" style="margin:8px 0 0;font-size:13px;line-height:1.7;color:#9aa0a6">이 글은 업소와 무관한 안내입니다. 공개된 자료만 옮겼습니다.</p>
<p class="cafe-link" style="margin:14px 0 0;font-size:14px;line-height:1.7"><a href="https://nolcool.com/cafe/?utm_source=f&amp;utm_medium=site_link&amp;utm_campaign=cafe" rel="noopener">놀쿨 카페 안내 →</a></p>
</body>
</html>
`;
  return head + '\n' + body;
}

/* ── 허브 ── */
const REGION_ORDER = ['서울특별시', '경기도', '인천광역시', '충청남도', '충청북도', '대전광역시', '광주광역시', '대구광역시', '경상북도', '경상남도', '울산광역시', '부산광역시', '제주특별자치도'];
/* 확인된 주소표 (data/shops 에서 뽑아 둔 것) — 없으면 빈 표 */
const ADDR = (() => { try { return require('./start-addr.json'); } catch { return {}; } })();

function renderHub() {
  const url = `${SITE}/start/`;
  const groups = {};
  PAGES.forEach((p) => { (groups[p.addrRegion] = groups[p.addrRegion] || []).push(p); });
  const order = REGION_ORDER.filter((r) => groups[r]).concat(Object.keys(groups).filter((r) => !REGION_ORDER.includes(r)));

  const listHtml = order.map((r) => `<h3 class="region-h">${r} ${groups[r].length}곳</h3>
<ul class="hub-list">
${groups[r].map((p) => `<li><a href="${hrefFor(p.slug)}">${p.name}</a><span>${p.region} · ${p.station}</span></li>`).join('\n')}
</ul>`).join('\n');

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '전국 나이트 입문 노트 40',
    numberOfItems: PAGES.length,
    itemListElement: PAGES.map((p, i) => ({
      '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE}${hrefFor(p.slug)}`,
    })),
  };
  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '나이트 입문 노트', item: url },
    ],
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>전국 나이트 입문 노트 40 — 처음 가는 사람용 지역별 정리</title>
<meta name="description" content="전국 나이트클럽 40곳을 처음 가는 사람 눈높이로 정리한 입문 노트 모음입니다. 지역별로 주소와 가까운 역, 층 정보를 확인하고 첫 방문 순서를 미리 익혀 두세요.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="google-site-verification" content="${GSV}">
<meta name="naver-site-verification" content="${NSV}">
<meta name="theme-color" content="#F7EFE1">
<meta name="color-scheme" content="light">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko-KR" href="${url}">
<link rel="icon" type="image/png" sizes="32x32" href="https://f.nolcool.com/favicon-32x32.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="전국 나이트 입문 노트 40 — 처음 가는 사람용 지역별 정리">
<meta property="og:description" content="전국 나이트클럽 40곳을 초보 눈높이로 정리한 입문 노트 모음입니다.">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="전국 나이트 입문 노트 40 — 처음 가는 사람용 지역별 정리">
<link rel="stylesheet" href="/start/start.css">
<script type="application/ld+json">${JSON.stringify(itemList)}</script>
<script type="application/ld+json">${JSON.stringify(crumb)}</script>
</head>
<body>
<header>
<a href="#main" class="skip-link">본문 바로가기</a>
<nav class="topnav" aria-label="주요 메뉴"><div class="topnav-in"><a href="/">홈</a><a href="/start/" aria-current="page">입문 노트 40</a></div></nav>
</header>
<p class="crumb"><a href="/">홈</a> &gt; 나이트 입문 노트</p>
<main id="main">
<article>
<h1>전국 나이트 입문 노트 40</h1>
<p class="meta-line">지역별 ${PAGES.length}곳 · <time datetime="${TODAY}">${TODAY}</time> 기준 정리</p>
<p class="note-tag hand">처음 가는 사람 입문 노트</p>
<div class="answer-box">
<h2>이 목록을 쓰는 법</h2>
<ol>
<li>가려는 지역을 먼저 고릅니다. 지역별로 묶어 두었습니다.</li>
<li>업소 페이지에서 주소와 가까운 역, 층을 확인합니다. 확인되지 않은 항목은 "확인 불가"로 적었습니다.</li>
<li>첫 방문 순서(가기 전 → 입장 → 처음 30분 → 어색할 때)를 읽고 출발하면 됩니다.</li>
</ol>
</div>
<section>
<h2>지역별 입문 노트</h2>
${listHtml}
</section>
</article>
</main>
<footer class="site"><div class="footer-in">
<p>전국 나이트 입문 노트 40 · 처음 가는 사람용 안내</p>
<p class="ad-inquiry">💬 광고문의 카카오톡 <b>${KAKAO}</b></p>
<p class="footer-copy">© 2026 · 공개 자료를 정리한 안내 페이지이며, 확인되지 않은 항목은 "확인 불가"로 표기했습니다.</p>
</div></footer>
<div class="callbar" role="complementary" aria-label="광고 문의">
  <span>💬 광고문의 카카오톡 <b>${KAKAO}</b></span>
</div>
<p class="age-notice" style="margin:18px 0 0;font-size:13px;line-height:1.7;color:#9aa0a6">성인 대상 업소 안내입니다. 만 19세 미만의 출입·고용은 금지되어 있습니다.</p>
<p class="rel-notice" style="margin:8px 0 0;font-size:13px;line-height:1.7;color:#9aa0a6">해당 업소와 관계가 없는 제3자 안내 페이지입니다.</p>
<p class="cafe-link" style="margin:14px 0 0;font-size:14px;line-height:1.7"><a href="https://nolcool.com/cafe/?utm_source=f&amp;utm_medium=site_link&amp;utm_campaign=cafe" rel="noopener">놀쿨 카페 안내 →</a></p>
</body>
</html>
`;
}

let n = 0, moved = 0;
PAGES.forEach((p) => {
  const dir = path.join(OUT_ROOT, p.slug);
  if (MOVED[p.slug]) {                      /* 옮긴 주소는 여기서 만들지 않는다 */
    fs.rmSync(dir, { recursive: true, force: true });
    moved++;
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), thinVenueName(renderPage(p), p.name), 'utf8');
  n++;
});
fs.writeFileSync(path.join(OUT_ROOT, 'index.html'), renderHub(), 'utf8');
console.log(`/start/ ${n}개 페이지 + 허브 생성 완료 (옮긴 주소 ${moved}개는 만들지 않음)`);
