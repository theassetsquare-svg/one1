import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* ★ 2026-08-31 — 파비콘 선언이 없어 검색 결과에 아이콘이 안 떴다(체크리스트 #58) */}
        <link rel="shortcut icon" href="https://f.nolcool.com/favicon.ico" />
        {/* ★ 네이버 소유확인 태그는 여기(_document)에 둔다.
            components/SEO.tsx 에 이미 name 이 같은 태그가 있는데,
            next/head 는 같은 name 의 meta 를 하나만 남기므로
            거기에 나란히 넣으면 둘 중 하나가 사라진다.
            _document 의 Head 는 그 정리를 거치지 않아 둘 다 살아남는다. */}
        <meta name="naver-site-verification" content="85c3069070cb7b97ee6cd7bf80178ad131ba1553" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
