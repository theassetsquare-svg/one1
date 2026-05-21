import Head from 'next/head';

const SITE = 'https://one1-3md.pages.dev';

type Props = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export default function SEO({ title, description, path, ogImage = '/og/og-thumb.png' }: Props) {
  const url = `${SITE}${path}`;
  const fullOg = `${SITE}${ogImage}`;
  const isThumb = ogImage === '/og/og-thumb.png';
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="naver-site-verification" content="ed4ae3e824d8359765cae162fe59db8d95808956" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
      <meta name="theme-color" content="#0A0E27" />
      <meta name="color-scheme" content="dark" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="KR-30" />
      <meta name="geo.placename" content="대전광역시" />
      <meta name="ICBM" content="36.3504,127.3845" />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko-KR" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <link rel="manifest" href="/site.webmanifest" />
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
      <meta property="og:site_name" content="대전원나이트" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullOg} />
      <meta property="og:image:secure_url" content={fullOg} />
      <meta property="og:image:width" content={isThumb ? '1080' : '1200'} />
      <meta property="og:image:height" content={isThumb ? '1080' : '630'} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOg} />
    </Head>
  );
}
