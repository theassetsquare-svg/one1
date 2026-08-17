/* /night/{slug}/index.html 13개 생성 — public/ 정적 자산으로 배포 */
const fs = require('fs');
const path = require('path');
const { SITE, PAGES } = require('./night-data.js');

const TODAY = '2026-08-15';
const OUT_ROOT = path.join(__dirname, '..', 'public', 'night');
const GSV = 'HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88';
const NSV = '640ba0cfbfb8328f279f76e9cade5342aba13ece';
const KAKAO = 'besta12';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 본문 문자열에는 <b>/<span class="bridge"> 만 허용하므로 속성용 escape와 분리
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const byNo = {};
PAGES.forEach((p) => { byNo[p.no] = p; });

function callbar(p) {
  if (p.group === 'A') {
    return `<div class="callbar" role="complementary" aria-label="전화 연결">
  <a href="tel:${p.telHref}">📞 ${p.manager} ${p.tel}</a>
</div>`;
  }
  return `<div class="callbar" role="complementary" aria-label="광고 제휴 문의">
  <span>광고·제휴 입점 문의 카톡 <b>${KAKAO}</b></span>
</div>`;
}

function jsonld(p) {
  const url = `${SITE}/night/${p.slug}/`;
  const club = {
    '@context': 'https://schema.org',
    '@type': 'NightClub',
    name: p.name,
    url,
    image: `${SITE}/og/${p.slug}-og.png`,
    description: `${p.name}은 ${p.region}에 있는 나이트클럽입니다. ${p.answer2}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: p.locality,
      addressRegion: p.addrRegion,
      addressCountry: 'KR',
    },
  };
  if (p.group === 'A') club.telephone = '+82-' + p.tel.replace(/^0/, '').replace(/-/g, '-');
  if (p.openingHours) club.openingHours = p.openingHours;
  if (p.age) club.typicalAgeRange = p.age;

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
      { '@type': 'ListItem', position: 2, name: '나이트', item: `${SITE}/night/` },
      { '@type': 'ListItem', position: 3, name: p.name, item: url },
    ],
  };
  return [club, faq, crumb]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');
}

/* 형태소 A(붙여쓰기)/B(띄어쓰기)/C(지역+업종) 보강 문장 — 섹션 본문 안에 자연스럽게 삽입 */
const INJECT = {
  'bulgwang-hobak-night': [
    [0, '불광동 나이트클럽을 찾을 때 이 홀이 먼저 거론되는 것도 그래서다.'],
    [1, '불광동호박나이트에서도 이 원리는 똑같이 작동한다.'],
    [3, '불광동 호박나이트를 처음 찾는다면 이 시간대를 기준으로 잡으면 된다.'],
  ],
  'changwon-lululala-night': [
    [0, '창원룰루랄라나이트 입구에서 확인 절차가 진행되는 이유가 이것이다.'],
    [2, '창원 나이트클럽을 처음 찾는 사람이 가장 많이 헷갈리는 대목이다.'],
    [3, '창원룰루랄라나이트도 이 흐름에서 예외가 아니다.'],
    [5, '창원룰루랄라나이트 방문 계획을 세울 때 이 두 가지만 확인하면 된다.'],
  ],
  'ulsan-champion-night': [
    [4, '울산챔피언나이트 홀이 넓은 만큼 선택 폭도 그만큼 넓다.'],
    [5, '울산 나이트클럽 대부분이 비슷한 흐름을 따른다.'],
    [6, '울산 챔피언나이트도 이 차이가 뚜렷한 편이다.'],
    [7, '울산챔피언나이트 자리 배정도 이 숫자를 기준으로 갈린다.'],
    [10, '울산 챔피언나이트 입구에서 걸리는 경우는 대개 신발 때문이다.'],
  ],
  'cheongdam-night': [
    [0, '청담동 나이트클럽을 처음 찾는다면 이 시간을 놓치지 않는 게 좋다.'],
    [1, '청담 나이트 특유의 전환이 시작되는 지점이다.'],
    [3, '청담나이트 홀도 이 시점에 한 번 재편된다.'],
  ],
  'daejeon-one-night': [
    [0, '대전 나이트클럽 가운데서도 기준이 뚜렷한 편에 속한다.'],
    [1, '대전원나이트가 택한 방향이 바로 이쪽이다.'],
    [3, '대전 원나이트를 늦게 찾을 계획이라면 요일부터 확인해야 한다.'],
  ],
  'sillim-grandprix-night': [
    [1, '신림그랑프리나이트 홀에서도 이 구분은 그대로 적용된다.'],
    [2, '신림그랑프리나이트는 오픈이 이른 만큼 앞 구간이 길다.'],
    [3, '신림동 나이트클럽 중에서도 좌석 선택 폭이 넓은 편이다.'],
  ],
  'sangbong-hangukgwan-night': [
    [0, '상봉동한국관나이트에서 두 명이 받는 자리는 대체로 정해져 있다.'],
    [1, '상봉동 나이트클럽 가운데서도 좌석 형태가 다양한 축에 든다.'],
    [2, '상봉동 한국관나이트는 룸과 부스를 함께 두고 있어 선택지가 있다.'],
    [3, '상봉동한국관나이트 영업 구조를 알고 가면 훨씬 편하다.'],
  ],
  'suyu-shampoo-night': [
    [0, '수유 샴푸나이트 마감이 늦다는 점을 믿고 도착을 늦추는 경우가 많다.'],
    [1, '수유샴푸나이트에서도 이 한마디가 밤의 밀도를 바꾼다.'],
    [2, '수유동 나이트클럽 입구에서 걸리는 사유는 대개 이 둘이다.'],
    [3, '수유샴푸나이트 방문 계획은 이 순서대로 잡으면 된다.'],
  ],
  'busan-asiad-night': [
    [0, '동래구 나이트클럽 중에서도 규모가 큰 편에 속한다.'],
    [2, '부산 아시아드나이트에서도 이 원칙은 그대로 통한다.'],
    [3, '부산아시아드나이트를 두 번째로 찾을 때 가장 크게 바뀌는 선택이다.'],
  ],
  'suwon-chance-dome-night': [
    [0, '권선구 나이트클럽 가운데 좌석 구성이 넓은 축에 속한다.'],
    [1, '수원찬스돔나이트 좌석은 목적을 먼저 정해야 고르기 쉽다.'],
    [3, '수원찬스돔나이트에서도 이 흐름은 똑같이 굴러간다.'],
  ],
  'ansan-hit-night': [
    [0, '안산히트나이트에 이 질문이 몰리는 배경이 여기 있다.'],
    [1, '상록구 나이트클럽 중에서는 평일 여유가 있는 편에 든다.'],
    [2, '안산히트나이트 홀도 이 순서를 그대로 따른다.'],
    [3, '안산 히트나이트를 늦게 찾을 계획이라면 이 점을 감안해야 한다.'],
  ],
  'daejeon-seven-night': [
    [0, '대전세븐나이트 계단을 내려가는 동안 이미 밤이 시작된다.'],
    [1, '유천동 나이트클럽 가운데서도 밀도가 선명한 축이다.'],
    [2, '대전 세븐나이트 무대가 두 얼굴을 가진 이유다.'],
    [3, '대전세븐나이트 홀에서는 이 세 무리가 늘 함께 있다.'],
  ],
  'ilsan-shampoo': [
    [0, '일산동구 나이트클럽을 처음 찾는다면 이 절차만 기억하면 된다.'],
    [1, '일산샴푸나이트에서도 이 세 마디가 출발점이다.'],
    [3, '일산샴푸나이트 부킹도 이 방식으로 돌아간다.'],
  ],
};

function applyInject(p) {
  const list = INJECT[p.slug] || [];
  for (const [idx, sentence] of list) {
    const s = p.sections[idx];
    if (!s) continue;
    const arr = (s.after2 && s.after2.length) ? s.after2 : s.ps;
    const last = arr[arr.length - 1] || '';
    if (last.includes('class="bridge"')) arr.splice(arr.length - 1, 0, sentence);
    else arr.push(sentence);
  }
}
PAGES.forEach(applyInject);

function renderSection(s) {
  let out = `<section>\n<h2>${s.h2}</h2>\n`;
  (s.ps || []).forEach((t) => { out += `<p>${t}</p>\n`; });
  if (s.list) {
    out += '<ul>\n' + s.list.map((li) => `<li>${li}</li>`).join('\n') + '\n</ul>\n';
  }
  if (s.after2) (s.after2).forEach((t) => { out += `<p>${t}</p>\n`; });
  if (s.table) {
    out += `<table>\n<caption>${s.table.cap}</caption>\n<tbody>\n`;
    s.table.rows.forEach((r) => { out += `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>\n`; });
    out += '</tbody>\n</table>\n';
  }
  if (s.after) out += `<p>${s.after}</p>\n`;
  out += '</section>\n';
  return out;
}

function renderPage(p) {
  const url = `${SITE}/night/${p.slug}/`;
  const og = `${SITE}/og/${p.slug}-og.png`;
  const rel = p.related.map((n) => byNo[n]).filter(Boolean);

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
<meta name="theme-color" content="#0A0E27">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko-KR" href="${url}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${attr(p.title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="1200">
<meta property="og:image:alt" content="${attr(p.ogAlt)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${attr(p.title)}">
<meta name="twitter:description" content="${attr(p.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="stylesheet" href="/night/night.css">
${jsonld(p)}
</head>`;

  const nav = `<header>
<a href="#main" class="skip-link">본문 바로가기</a>
<nav class="topnav" aria-label="주요 메뉴">
  <div class="topnav-in">
    <a href="/">홈</a>
    <a href="/night/">나이트 목록</a>
    <a href="/night/${p.slug}/" aria-current="page">${p.name}</a>
  </div>
</nav>
</header>
<p class="crumb"><a href="/">홈</a> &gt; <a href="/night/">나이트</a> &gt; ${p.name}</p>`;

  const ageBadge = p.age ? `<p class="age-badge">${p.age}만 출입 가능</p>\n` : '';

  const body = `<body>
${nav}
<main id="main">
<article>
<h1>${p.name}</h1>
<p class="meta-line">${p.region} · 나이트클럽 · <time datetime="${TODAY}">${TODAY}</time> 기준</p>
${ageBadge}<div class="answer-box">
  <p><strong>${p.name}</strong>은 ${p.region}에 있는 나이트클럽입니다. ${p.answer2}.</p>
</div>
<div class="lead">
${p.lead.map((t) => `<p>${t}</p>`).join('\n')}
</div>
${p.sections.map(renderSection).join('')}<div class="wrapup">
${p.wrapup.map((t) => `<p>· ${t}</p>`).join('\n')}
</div>
<aside class="related">
<h2>가까운 지역 나이트 안내</h2>
<ul>
${rel.map((r) => `<li><a href="/night/${r.slug}/">${r.name}</a> — ${r.region}</li>`).join('\n')}
<li><a href="/night/">나이트 안내 전체 목록</a></li>
</ul>
</aside>
</article>
</main>
<footer class="site">
<div class="footer-in">
<p>${p.name} 안내 페이지 · ${p.region}</p>
<p class="ad-inquiry">광고·제휴 입점 문의 카톡 <b>${KAKAO}</b> (업소 사장님 대상 채널입니다)</p>
<p class="footer-copy">© 2026 · 본 페이지는 업소 안내 목적의 광고 페이지입니다.</p>
</div>
</footer>
${callbar(p)}
</body>
</html>
`;
  return head + '\n' + body;
}

function renderHub() {
  const url = `${SITE}/night/`;
  const rows = PAGES.map((p) =>
    `<li><a href="/night/${p.slug}/">${p.name}</a><span>${p.region} · ${p.suffix}</span></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>나이트 안내 목록 13곳 지역별 정리</title>
<meta name="description" content="서울·경기·부산·대전·울산·창원 나이트클럽 안내 페이지 13곳을 한 곳에 모았습니다. 지역과 좌석, 시간대 기준으로 원하는 업소를 골라 확인하세요.">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="google-site-verification" content="${GSV}">
<meta name="naver-site-verification" content="${NSV}">
<meta name="theme-color" content="#0A0E27">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="나이트 안내 목록 13곳 지역별 정리">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og/og-thumb.png">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/night/night.css">
</head>
<body>
<header>
<a href="#main" class="skip-link">본문 바로가기</a>
<nav class="topnav" aria-label="주요 메뉴"><div class="topnav-in"><a href="/">홈</a><a href="/night/" aria-current="page">나이트 목록</a></div></nav>
</header>
<main id="main">
<article>
<h1>나이트 안내 목록</h1>
<p class="meta-line">지역별 13곳 · <time datetime="${TODAY}">${TODAY}</time> 기준</p>
<section>
<h2>지역별 안내 페이지</h2>
<ul class="hub-list">
${rows}
</ul>
</section>
</article>
</main>
<footer class="site"><div class="footer-in">
<p>나이트 안내 목록</p>
<p class="ad-inquiry">광고·제휴 입점 문의 카톡 <b>${KAKAO}</b> (업소 사장님 대상 채널입니다)</p>
<p class="footer-copy">© 2026 · 본 페이지는 업소 안내 목적의 광고 페이지입니다.</p>
</div></footer>
<div class="callbar" role="complementary" aria-label="광고 제휴 문의">
  <span>광고·제휴 입점 문의 카톡 <b>${KAKAO}</b></span>
</div>
</body>
</html>
`;
}

let n = 0;
PAGES.forEach((p) => {
  const dir = path.join(OUT_ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPage(p), 'utf8');
  n++;
  console.log(`  /night/${p.slug}/  (각도${p.angle} · ${p.group}그룹)`);
});
fs.writeFileSync(path.join(OUT_ROOT, 'index.html'), renderHub(), 'utf8');
console.log(`\n${n}개 페이지 + 목록 허브 생성 완료`);
