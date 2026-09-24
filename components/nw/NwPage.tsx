import Head from 'next/head';
import { createElement, Fragment, type ReactNode } from 'react';

/**
 * [전부10 2026-09-25] 쪽 하나 = 모형(model) 하나.
 *  모형은 lib/nw/pages.json 에 경로별로 있고(getStaticProps 가 읽는다), 정적 쪽(public/…/index.html)과 같은 모양을 낸다.
 *  - head: 제목 · 설명 · canonical · og · JSON-LD(사실은 data/shops verified 값만) · 쪽 전용 CSS
 *  - tree: [태그, 속성, 자식[]] — 클래스 이름은 쪽마다 따로 만든 값이라 쪽끼리 틀이 겹치지 않는다
 *  사실 표 · 직답 · 한 줄 정리 · FAQ · 고지 · 광고주 전화바는 모형에 들어 있다. 외부 링크 0(놀쿨 카페 1개만).
 */
export type NwNode = [string, Record<string, string>, (NwNode | string)[]];
export type NwModel = {
  head: {
    title: string; desc: string; canonical: string; url: string; siteName: string;
    og: { image: string; w: number; h: number; alt: string } | null;
    ld: Record<string, unknown>[]; css: string;
  };
  tree: NwNode[];
};

const 속성이름: Record<string, string> = { class: 'className', fetchpriority: 'fetchPriority' };

function 그리기(n: NwNode | string, i: number): ReactNode {
  if (typeof n === 'string') return n;
  const [tag, attrs, kids] = n;
  const p: Record<string, unknown> = { key: i };
  for (const [k, v] of Object.entries(attrs)) p[속성이름[k] || k] = v;
  if (tag === 'img') return createElement(tag, p);
  return createElement(tag, p, ...kids.map((c, j) => 그리기(c, j)));
}

export default function NwPage({ model }: { model: NwModel }) {
  const h = model.head;
  return (
    <>
      <Head>
        <title>{h.title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
        <meta name="description" content={h.desc} key="description" />
        <meta name="robots" content="index,follow,max-image-preview:large" key="robots" />
        <link rel="canonical" href={h.canonical} key="canonical" />
        <meta property="og:type" content="article" key="og:type" />
        <meta property="og:locale" content="ko_KR" key="og:locale" />
        <meta property="og:site_name" content={h.siteName} key="og:site_name" />
        <meta property="og:title" content={h.title} key="og:title" />
        <meta property="og:description" content={h.desc} key="og:description" />
        <meta property="og:url" content={h.url} key="og:url" />
        {h.og ? <meta property="og:image" content={h.og.image} key="og:image" /> : null}
        {h.og ? <meta property="og:image:width" content={String(h.og.w)} key="og:image:width" /> : null}
        {h.og ? <meta property="og:image:height" content={String(h.og.h)} key="og:image:height" /> : null}
        {h.og ? <meta property="og:image:alt" content={h.og.alt} key="og:image:alt" /> : null}
        {h.og ? <meta name="twitter:card" content="summary_large_image" key="twitter:card" /> : null}
        {h.ld.map((x, i) => (
          <script key={'ld' + i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(x).replace(/</g, '\\u003c') }} />
        ))}
        <style key="nw-css" dangerouslySetInnerHTML={{ __html: h.css }} />
      </Head>
      <Fragment>{model.tree.map((n, i) => 그리기(n, i))}</Fragment>
    </>
  );
}
