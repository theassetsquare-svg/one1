/* /start/ 입문 노트 40개 데이터 집합
   - 콘셉트: "처음 가는 사람 입문 노트"
   - 광고주 4업소(group 'A')만 전화 노출, 나머지는 광고문의 카톡 besta12 */
const SITE = 'https://onee-w8t.pages.dev';
const KAKAO = 'besta12';
const TODAY = '2026-08-16';

const PAGES = [].concat(
  require('./start-pages-01.js'),
  require('./start-pages-02.js'),
  require('./start-pages-03.js'),
  require('./start-pages-04.js'),
  require('./start-pages-05.js')
);

/* 업소 고유 추가 섹션 — 마지막 소제목 앞에 끼워 넣는다 (소제목 4~6개 유지) */
const EXTRA = require('./start-extra.js');
PAGES.forEach((p) => {
  const ex = EXTRA[p.slug];
  if (!ex) return;
  const at = Math.max(0, p.secs.length - 1);
  p.secs.splice(at, 0, ex);
});

/* G10 허용표 — 이 slug 이외의 페이지(홈 포함)에서 010- 발견 시 실패 */
const PHONE_ALLOW = PAGES.filter((p) => p.group === 'A').map((p) => p.slug);

module.exports = { SITE, KAKAO, TODAY, PAGES, PHONE_ALLOW };
