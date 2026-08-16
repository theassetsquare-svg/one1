import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/SEO';
import Layout from '@/components/Layout';

const SITE = 'https://oneb-7z7.pages.dev';

const TERMS: [string, string][] = [
  ['부킹', '웨이터가 다른 테이블 손님과 자리를 이어 주는 문화입니다. 손님끼리 직접 하는 일이 아니라 직원이 사이에 섭니다.'],
  ['기본', '테이블에 앉을 때 최소로 주문하는 술과 안주 묶음입니다. 자리 종류와 인원에 따라 구성이 달라집니다.'],
  ['웨이터', '홀에서 좌석 배정과 자리 연결을 맡는 직원입니다. 요청은 이 사람에게 하면 됩니다.'],
  ['부스', '칸막이로 반쯤 가려진 좌석입니다. 일행끼리 이야기하기 좋습니다.'],
  ['합석', '다른 테이블 손님과 한 자리에 함께 앉는 것입니다. 언제든 사양할 수 있습니다.'],
  ['스탠딩', '무대 앞에 서서 음악을 즐기는 구역입니다. 앉은 자리가 답답할 때 나가 볼 수 있습니다.'],
];

const PICKS: [string, string, string][] = [
  ['/start/sillim-grandprix/', '신림그랑프리나이트', '서울 관악구 신림동'],
  ['/start/gangseo-hobak/', '강서호박나이트', '서울 강서구 화곡동'],
  ['/start/sangbong-hangukgwan/', '상봉동한국관나이트', '서울 중랑구 상봉동'],
  ['/start/suwon-chance-dome/', '수원찬스돔나이트', '경기 수원시 권선구'],
  ['/start/incheon-arabian/', '인천아라비안나이트', '인천 계양구'],
  ['/start/cheonan-korea/', '천안코리아나이트', '충남 천안시 서북구'],
  ['/start/daegu-hobak/', '대구호박나이트', '대구 북구'],
  ['/start/gwangju-sangmu/', '광주상무나이트', '광주 서구 치평동'],
  ['/start/busan-asiad/', '부산아시아드나이트', '부산 동래구 온천동'],
];

const FAQ: [string, string][] = [
  ['나이트클럽이 처음인데 뭐부터 봐야 하나요?', '가려는 지역의 입문 노트를 열고 사실 표부터 확인하세요. 주소와 가까운 역, 층을 알면 절반은 끝납니다.'],
  ['혼자 가도 되나요?', '가능하지만 첫 방문이라면 둘 이상을 권합니다. 자리 배정과 대화, 어색한 순간을 넘기는 일이 모두 쉬워집니다.'],
  ['이 사이트는 예약을 받나요?', '예약을 받지 않습니다. 공개 자료를 정리한 안내 페이지이며, 광고 입점 문의만 카카오톡으로 받습니다.'],
];

export default function Home() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: '생애 첫 나이트, 입문 노트',
        url: `${SITE}/`,
        inLanguage: 'ko-KR',
        description: '나이트클럽에 처음 가는 사람을 위한 입문 노트. 전국 40곳의 위치와 첫 방문 순서를 초보 눈높이로 정리합니다.',
      },
      {
        '@type': 'DefinedTermSet',
        '@id': `${SITE}/#glossary`,
        name: '나이트클럽 입문 용어',
        hasDefinedTerm: TERMS.map(([t, d]) => ({ '@type': 'DefinedTerm', name: t, description: d })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE}/#faq`,
        mainEntity: FAQ.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` }],
      },
    ],
  };

  return (
    <>
      <SEO
        title="생애 첫 나이트, 입문 노트 — 처음 가는 사람을 위한 안내"
        description="나이트클럽에 처음 가는 사람을 위한 입문 노트입니다. 부킹·기본 같은 용어부터 가기 전 준비, 입장, 처음 30분, 어색할 때 대처까지 전국 40곳 기준으로 정리했습니다."
        path="/"
        ogImage="/og/home.png"
        geoRegion="KR"
        geoPlacename="대한민국"
        siteName="생애 첫 나이트, 입문 노트"
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>
      <Layout callBar="kakaoFull" brand="note">
        <div className="note-home">
          <header className="nh-hero">
            <p className="nh-tag hand">처음 가는 사람 입문 노트</p>
            <h1>
              생애 첫 나이트,
              <br />
              <span className="nh-accent">입문 노트</span>
            </h1>
            <p className="nh-sub">
              용어부터 막히고, 문 앞에서 한 번 더 멈칫합니다. 그 두 지점을 없애려고 만든 노트입니다.
              전국 40곳을 초보 눈높이로 정리했습니다.
            </p>
            <div className="nh-cta">
              <Link href="/start/" className="nh-btn">
                전국 입문 노트 40 보기
              </Link>
            </div>
          </header>

          <section className="nh-sec">
            <h2>이 노트를 쓰는 법</h2>
            <ol className="nh-steps">
              <li>
                <b>지역을 고릅니다.</b> 목록은 시·도별로 묶여 있습니다.
              </li>
              <li>
                <b>사실 표를 봅니다.</b> 주소, 가까운 역, 입장 연령, 층. 확인되지 않은 항목은 &quot;확인 불가&quot;로
                그대로 적었습니다.
              </li>
              <li>
                <b>순서를 읽습니다.</b> 가기 전 → 입장 → 처음 30분 → 어색할 때. 이 네 구간이면 첫 방문은 끝납니다.
              </li>
            </ol>
          </section>

          <section className="nh-sec">
            <h2>먼저 알아 두면 편한 말</h2>
            <p className="nh-note">
              처음 가는 사람이 당황하는 건 가격이 아니라 단어입니다. 여섯 개만 알아도 대화가 수월해집니다.
            </p>
            <dl className="nh-terms">
              {TERMS.map(([t, d]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="nh-sec">
            <h2>지역별로 하나씩 골라 봤습니다</h2>
            <ul className="nh-picks">
              {PICKS.map(([href, name, area]) => (
                <li key={href}>
                  <Link href={href}>{name}</Link>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
            <p className="nh-more">
              <Link href="/start/">40곳 전체 목록 보기 →</Link>
            </p>
          </section>

          <section className="nh-sec">
            <h2>자주 묻는 질문</h2>
            <dl className="nh-faq">
              {FAQ.map(([q, a]) => (
                <div key={q}>
                  <dt>{q}</dt>
                  <dd>{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="nh-sec nh-ad">
            <h2>광고 입점 문의</h2>
            <p>
              업소 사장님 대상 채널입니다. 입점을 원하시면 카카오톡으로 연락 주세요.
            </p>
            <p className="nh-adline">💬 광고문의 카카오톡 besta12</p>
          </section>
        </div>
      </Layout>

      <style jsx global>{`
        body {
          background: #f7efe1;
          color: #3a2c21;
        }
        .nav {
          background: #fffcf5 !important;
          border-bottom: 2px solid #d0bc98 !important;
        }
        .nav .logo-k,
        .nav .logo-s {
          color: #8a5a2b !important;
        }
        .nav .nav-link {
          color: #6e5b49 !important;
        }
        .nav .nav-link.active {
          color: #8a5a2b !important;
        }
        .footer {
          background: #fffcf5 !important;
          border-top: 2px solid #d0bc98 !important;
          color: #6e5b49 !important;
        }
        .footer a {
          color: #8a5a2b !important;
        }
        .call-bar {
          background: #3a2c21 !important;
        }
        .note-home {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px 40px;
          font-size: 17px;
          line-height: 1.8;
          letter-spacing: -0.2px;
        }
        .hand {
          font-family: 'Nanum Pen Script', 'Gaegu', 'Segoe Print', 'Bradley Hand', cursive;
          letter-spacing: 0;
        }
        .nh-hero {
          padding: 34px 0 8px;
        }
        .nh-tag {
          display: inline-block;
          font-size: 17px;
          color: #8a5a2b;
          border-bottom: 2px dashed #d0bc98;
          padding: 0 2px 2px;
          margin: 0 0 14px;
        }
        .nh-hero h1 {
          font-size: 40px;
          line-height: 1.25;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 14px;
          color: #3a2c21;
        }
        .nh-accent {
          color: #8a5a2b;
        }
        .nh-sub {
          font-size: 18px;
          color: #6e5b49;
          margin: 0 0 22px;
        }
        .nh-btn {
          display: inline-block;
          background: #8a5a2b;
          color: #fffcf5;
          text-decoration: none;
          font-weight: 800;
          padding: 14px 22px;
          border-radius: 4px;
          box-shadow: 3px 3px 0 #d0bc98;
        }
        .nh-sec {
          margin: 38px 0 0;
        }
        .nh-sec h2 {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.6px;
          margin: 0 0 14px;
          padding-left: 14px;
          border-left: 5px solid #b9813c;
          color: #3a2c21;
        }
        .nh-note {
          color: #6e5b49;
          margin: 0 0 14px;
        }
        .nh-steps {
          margin: 0;
          padding-left: 22px;
          background: #fffcf5;
          border: 2px solid #d0bc98;
          border-radius: 4px;
          padding: 16px 18px 16px 38px;
          box-shadow: 3px 3px 0 #e2d3b8;
        }
        .nh-steps li {
          margin: 0 0 10px;
        }
        .nh-steps li:last-child {
          margin-bottom: 0;
        }
        .nh-terms div,
        .nh-faq div {
          border-bottom: 1px solid #e2d3b8;
          padding: 12px 0;
        }
        .nh-terms dt,
        .nh-faq dt {
          font-weight: 800;
          color: #8a5a2b;
          margin: 0 0 4px;
        }
        .nh-terms dd,
        .nh-faq dd {
          margin: 0;
          color: #6e5b49;
        }
        .nh-picks {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nh-picks li {
          border-bottom: 1px solid #e2d3b8;
          padding: 12px 0;
        }
        .nh-picks a {
          font-weight: 800;
          text-decoration: none;
          color: #8a5a2b;
          font-size: 17px;
        }
        .nh-picks span {
          display: block;
          color: #8c7862;
          font-size: 14px;
        }
        .nh-more {
          margin: 16px 0 0;
        }
        .nh-more a {
          color: #8a5a2b;
          font-weight: 700;
        }
        .nh-ad p {
          margin: 0 0 10px;
          color: #6e5b49;
        }
        .nh-adline {
          background: #000;
          color: #fff !important;
          font-weight: 800;
          padding: 12px 14px;
          border-radius: 4px;
        }
        @media (max-width: 480px) {
          .nh-hero h1 {
            font-size: 31px;
          }
        }
      `}</style>
    </>
  );
}
