import Head from 'next/head';

const SITE = 'https://f.nolcool.com';

type Props = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
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
  geoRegion = 'KR-30',
  geoPlacename = '대전광역시',
  icbm = '36.3504,127.3845',
  siteName = '대전원나이트',
  ogAlt,
}: Props) {
  const url = `${SITE}${path}`;
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
      <meta property="og:image" content={fullOg} />
      <meta property="og:image:secure_url" content={fullOg} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={ogAlt ?? title} />
      <meta name="thumbnail" content={fullOg} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOg} />
      <meta name="twitter:image:alt" content={ogAlt ?? title} />
    </Head>
  );
}
