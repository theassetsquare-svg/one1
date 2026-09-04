/**
 * 옛 주소(onee-w8t.pages.dev) 로 들어온 요청을 새 주소(f.nolcool.com) 로 301 보낸다.
 *
 * 왜 _redirects 가 아니라 Function 인가
 *   두 주소는 같은 Cloudflare Pages 프로젝트다. _redirects 는 **경로만** 보고
 *   호스트를 구분하지 못하므로, 거기에 규칙을 넣으면 f.nolcool.com 도 자기 자신으로
 *   끝없이 되돌게 된다. 호스트를 보고 판단하려면 Function 이어야 한다.
 *
 * 규칙
 *   · 호스트가 *.pages.dev 일 때만 옮긴다. f.nolcool.com 은 그대로 통과시킨다.
 *   · 경로·쿼리는 그대로 유지한다 (/start/x?a=1 → https://f.nolcool.com/start/x?a=1)
 *   · 301(영구 이동) — 네이버·구글에 "주소가 완전히 바뀌었다"고 알린다.
 *
 * 위치: 이 폴더는 빌드 결과물(out/)이 아니라 **저장소 상위**에 있어야 한다.
 *       Cloudflare Pages 는 프로젝트 루트의 functions/ 를 읽는다.
 */
const NEW_HOST = 'f.nolcool.com';

/* [폐기 404 — 시작] state/indexnow-removed.json 에서 도구가 채움. 손으로 고치지 않음 */
const REMOVED_PATHS = new Set(["/night/suwon-chance-dome-night","/start/suwon-chance-dome"]);
/* [폐기 404 — 끝] */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (REMOVED_PATHS.has(url.pathname.replace(/\/+$/, '') || '/')) { const nf = await context.env.ASSETS.fetch(new URL('/404.html', url.origin)); return new Response(nf.ok ? nf.body : 'Not Found', { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }); } // 폐기 쪽 404(엣지 잔상 차단)

  if (url.hostname.endsWith('.pages.dev')) {
    url.protocol = 'https:';
    url.hostname = NEW_HOST;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }

  // 새 주소로 들어온 요청은 평소대로 파일을 내보낸다.
  return context.next();
}
