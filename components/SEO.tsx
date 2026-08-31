import Head from 'next/head';

const SITE = 'https://f.nolcool.com';

type Props = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  /** ★ 홈 순수성(2026-08-31): true 면 og:image 계열을 아예 넣지 않는다 */
  noImage?: boolean;
  /** 지역 페이지가 다른 행정구역을 다룰 때만 지정 (기본값은 대전) */
  geoRegion?: string;
  geoPlacename?: string;
  icbm?: string;
  siteName?: string;
  /** 썸네일 대체 텍스트 — 가게이름 + 페이지 주제 (미지정 시 title) */
  ogAlt?: string;
};

export default function SEO({
  title,
  description,
  path,
  ogImage = '/og/og-thumb.png',
  noImage = false,
  geoRegion = 'KR-30',
  geoPlacename = '대전광역시',
  icbm = '36.3504,127.3845',
  siteName = '대전원나이트',
  ogAlt,
}: Props) {
  /* ★ 2026-08-31 — 이 사이트를 슬래시 정본으로 바꿨다(next.config.ts trailingSlash: true).
     네이버가 색인한 주소가 /faq-1/ /bulgwangdong-hobak/ 처럼 슬래시형인데
     canonical 이 슬래시 없는 쪽을 가리키면 네이버가 색인한 주소를 스스로 부정하는 꼴이 된다.
     정규식은 쓰지 않는다 — 점 이스케이프에서 사고가 났었다. */
  const 슬래시붙이기 = (p2: string) => {
    if (!p2 || p2 === "/") return "/";
    if (p2.endsWith("/")) return p2;
    const [경로, 뒤] = [p2.split("#")[0].split("?")[0], p2.slice(p2.split("#")[0].split("?")[0].length)];
    const 끝조각 = 경로.split("/").pop() || "";
    if (끝조각.includes(".")) return p2;
    return 경로 + "/" + 뒤;
  };
  const url = `${SITE}${슬래시붙이기(path)}`;
  const fullOg = `${SITE}${ogImage}`;
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="google-site-verification" content="HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88" />
      <meta name="naver-site-verification" content="de7f572176f78093fb88bfb999b59fe0d65c37cb" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
      <meta name="theme-color" content="#0A0E27" />
      <meta name="color-scheme" content="dark" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="ICBM" content={icbm} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko-KR" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" type="application/rss+xml" title={siteName} href={`${SITE}/rss.xml`} />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      <link
        rel="preload"
        as="style"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {!noImage && (
      <meta property="og:image" content={fullOg} />
      )}
      {!noImage && (
      <meta property="og:image:secure_url" content={fullOg} />
      )}
      {!noImage && (
      <meta property="og:image:width" content="1200" />
      )}
      {!noImage && (
      <meta property="og:image:height" content="1200" />
      )}
      {!noImage && (
      <meta property="og:image:type" content="image/png" />
      )}
      {!noImage && (
      <meta property="og:image:alt" content={ogAlt ?? title} />
      )}
      {!noImage && (
      <meta name="thumbnail" content={fullOg} />
      )}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {!noImage && (
      <meta name="twitter:image" content={fullOg} />
      )}
      {!noImage && (
      <meta name="twitter:image:alt" content={ogAlt ?? title} />
      )}
    </Head>
  );
}
