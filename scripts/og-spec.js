/* 전 페이지 ↔ 썸네일 스펙표 — 광고주 정답표(2026-08-20)가 유일한 기준 */
const night = require('./night-data.js');
const start = require('./start-data.js');

const SITE = 'https://onee-w8t.pages.dev';
const KAKAO = 'besta12';

/* ★광고주 정답표 */
const ADVERTISERS = {
  '울산챔피언나이트': { nick: '춘자', tel: '010-5653-0069' },
  '창원룰루랄라나이트': { nick: '로또', tel: '010-7528-4936' },
  '불광동호박나이트': { nick: '손흥민', tel: '010-2221-1937' },
  '청담나이트': { nick: '펩시맨', tel: '010-5655-4866' },
  '대전세븐나이트': { nick: '영탁', tel: '010-7770-0869' },
  '답십리미라클나이트': { nick: '유재석', tel: '010-8156-6558' },
};

/* 어두운 단색 배경 팔레트 */
const BG = ['#0B1B3A','#1A0E2E','#2A1206','#08221F','#231018','#0E1E14','#1C1430','#2B1A06','#101A2B','#241016','#062028','#2A0F22'];
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const bgOf = (slug) => BG[hash(slug) % BG.length];
const AD_BG = { '대전세븐나이트': '#5C3000', '울산챔피언나이트': '#0B1B3A', '창원룰루랄라나이트': '#2A0F22', '불광동호박나이트': '#2B1A06', '청담나이트': '#062028', '답십리미라클나이트': '#1A0E2E' };

/* cat: A=광고주 / B=비광고주 / C=가게 전용 사이트 자기 가게 페이지 / HUB=허브·목록(=B 규칙, 중립 문구) */
const SPECS = [];
const push = (o) => SPECS.push(o);

/* ── 루트(Next.js) ── */
push({ file: 'home.png', url: '/', venue: null, cat: 'B', head: '다시 시작하는 이야기', bg: '#2A1206',
       note: '홈 = 독립 성공스토리(“나이트” 금칙어) → 가게이름 없이 중립 문구' });
['info', 'hours', 'ladies', 'faq', 'contact'].forEach((n) =>
  push({ file: `${n}.png`, url: `/${n}`, venue: '대전원나이트', cat: 'C', bg: '#0B1B3A' }));
push({ file: 'og-thumb.png', url: '/404', venue: '대전원나이트', cat: 'C', bg: '#0B1B3A' });
push({ file: 'place.png', url: null, venue: '대전원나이트', cat: 'C', bg: '#101A2B', note: '네이버 플레이스 대표 이미지' });
push({ file: 'blog.png', url: null, venue: '대전원나이트', cat: 'C', bg: '#1C1430', note: '네이버 블로그 대표 이미지' });
push({ file: 'hobak.png', url: '/bulgwangdong-hobak', venue: '불광동호박나이트', cat: 'A', bg: AD_BG['불광동호박나이트'] });

/* ── /night/ ── */
push({ file: 'night-hub-og.png', url: '/night/', venue: null, cat: 'B', head: '나이트 안내 목록', bg: '#08221F' });
night.PAGES.forEach((p) => {
  const ad = ADVERTISERS[p.name];
  push({ file: `${p.slug}-og.png`, url: `/night/${p.slug}/`, venue: p.name, cat: ad ? 'A' : 'B',
         bg: ad ? AD_BG[p.name] : bgOf(p.slug) });
});

/* ── /start/ ── */
push({ file: 'start-hub-og.png', url: '/start/', venue: null, cat: 'B', head: '전국 나이트 입문 노트 40', bg: '#231018' });
start.PAGES.forEach((p) => {
  const ad = ADVERTISERS[p.name];
  push({ file: `start-${p.slug}-og.png`, url: `/start/${p.slug}/`, venue: p.name, cat: ad ? 'A' : 'B',
         bg: ad ? AD_BG[p.name] : bgOf('s' + p.slug) });
});

module.exports = { SITE, KAKAO, ADVERTISERS, SPECS };
