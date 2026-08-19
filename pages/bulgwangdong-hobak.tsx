import Link from 'next/link';
import SEO from '@/components/SEO';
import Layout from '@/components/Layout';

const SITE = 'https://onee-w8t.pages.dev';
const PATH = '/bulgwangdong-hobak';
const NAME = '불광동호박나이트';
const TEL_DISPLAY = '010 2221 1937';
const TEL_HREF = 'tel:+821022211937';
const MANAGER = '손흥민';

const FAQ_ITEMS = [
  {
    q: '불광동호박나이트는 어디에 있나요?',
    a: '서울특별시 은평구 불광동, 지하철 3·6호선 불광역 인근에 있습니다. 상세 위치와 주차 안내는 예약문의 손흥민 010 2221 1937로 문의해 주세요.',
  },
  {
    q: '예약은 어떻게 하나요?',
    a: `전화 예약이 가장 빠릅니다. 예약문의 ${MANAGER} ${TEL_DISPLAY}으로 인원과 방문 시간을 알려주시면 좌석을 배정해 드립니다.`,
  },
  {
    q: '부킹이 되나요?',
    a: '네, 부킹 중심으로 운영되는 나이트클럽입니다. 인원과 방문 시간대에 따라 자리 배정이 달라지므로 사전 예약을 권장합니다.',
  },
  {
    q: '룸이나 단체 예약도 가능한가요?',
    a: '룸·단체 예약 모두 가능합니다. 5인 이상 단체는 좌석 확보를 위해 방문 하루 전 예약을 권장합니다.',
  },
  {
    q: '불광동호박나이트 영업 시간은 어떻게 되나요?',
    a: '저녁부터 새벽까지 운영하며, 요일과 시즌에 따라 영업·마감 시간이 달라질 수 있습니다. 방문 당일 전화로 확인해 주세요.',
  },
  {
    q: '입장 연령과 신분증 확인은요?',
    a: '성인만 입장 가능하며 입장 시 신분증 확인이 진행됩니다. 신분증을 반드시 지참해 주세요.',
  },
  {
    q: '주차는 가능한가요?',
    a: '불광역 주변 공영주차장 및 인근 주차장 이용을 권장합니다. 주차 관련 안내도 예약 시 함께 받으실 수 있습니다.',
  },
  {
    q: '복장 제한이 있나요?',
    a: '깔끔한 캐주얼 복장을 권장합니다. 슬리퍼·운동복·반바지 등은 입장이 제한될 수 있습니다.',
  },
  {
    q: '카드 결제가 되나요?',
    a: '현금과 카드 결제 모두 가능합니다. 자세한 이용 금액은 예약 시 안내해 드립니다.',
  },
  {
    q: '혼자 방문해도 되나요?',
    a: '가능합니다. 다만 자리 배정이 원활하도록 방문 전 전화로 인원을 알려주시는 편이 좋습니다.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE}${PATH}#webpage`,
      name: `${NAME} 예약문의 안내`,
      url: `${SITE}${PATH}`,
      inLanguage: 'ko-KR',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}${PATH}#nightclub` },
      description: `${NAME} 예약·부킹·룸·단체 안내 페이지. 서울 은평구 불광동 불광역 인근. 예약문의 ${MANAGER} ${TEL_DISPLAY}.`,
    },
    {
      '@type': ['NightClub', 'LocalBusiness'],
      '@id': `${SITE}${PATH}#nightclub`,
      name: NAME,
      alternateName: ['불광동 호박나이트', '호박나이트 불광동', '은평구 호박나이트'],
      url: `${SITE}${PATH}`,
      telephone: '+82-10-2221-1937',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '불광동',
        addressLocality: '은평구',
        addressRegion: '서울특별시',
        addressCountry: 'KR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 37.6106, longitude: 126.9296 },
      hasMap: 'https://map.naver.com/v5/search/불광동호박나이트',
      areaServed: ['불광동', '은평구', '서대문구', '마포구', '고양시', '서울'],
      acceptsReservations: true,
      priceRange: '₩₩',
      image: `${SITE}/og/hobak.png`,
      description: `${NAME}는 서울 은평구 불광동 불광역 인근에 위치한 나이트클럽입니다. 부킹·룸·단체 예약을 전화로 접수하며, 예약문의는 ${MANAGER} ${TEL_DISPLAY}입니다.`,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'reservations',
        name: MANAGER,
        telephone: '+82-10-2221-1937',
        availableLanguage: ['ko'],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: NAME, item: `${SITE}${PATH}` },
      ],
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: `${NAME} 예약 방법`,
  description: `${NAME} 좌석·룸·단체 예약을 전화로 진행하는 순서입니다.`,
  step: [
    { '@type': 'HowToStep', text: `예약문의 ${MANAGER} ${TEL_DISPLAY}으로 전화합니다.` },
    { '@type': 'HowToStep', text: '방문 날짜와 시간, 인원 수를 알려줍니다.' },
    { '@type': 'HowToStep', text: '부킹석·룸·단체석 중 원하는 좌석 형태를 선택합니다.' },
    { '@type': 'HowToStep', text: '신분증을 지참하고 예약 시간에 맞춰 방문합니다.' },
    { '@type': 'HowToStep', text: '불광역 인근 주차장 이용 후 입장합니다.' },
  ],
};

export default function BulgwangdongHobak() {
  return (
    <>
      <SEO
        title="불광동호박나이트 예약문의 - 부킹·룸 안내 | 대전원나이트"
        description="불광동호박나이트 예약문의 안내. 서울 은평구 불광동 불광역 인근 나이트클럽 부킹·룸·단체 예약, 입장·복장·주차 정보를 한 페이지에 정리했습니다. 예약문의 손흥민 010 2221 1937."
        path={PATH}
        ogImage="/og/hobak.png"
        geoRegion="KR-11"
        geoPlacename="서울특별시 은평구 불광동"
        icbm="37.6106,126.9296"
        siteName="불광동호박나이트"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Layout callBar="phone">
        <div className="hero">
          <div className="hero-kicker">BULGWANG HOBAK</div>
          <h1>
            불광동호박나이트 <span className="accent">예약문의</span>
          </h1>
          <p>
            서울 은평구 불광동 · 불광역 인근 · 부킹 · 룸 · 단체 예약 문의는 {MANAGER} {TEL_DISPLAY}
          </p>
          <div className="cta-row">
            <a href={TEL_HREF} className="cta-primary">
              전화 예약문의
            </a>
            <Link href="/" className="cta-secondary">
              대전원나이트 안내 보기
            </Link>
          </div>
        </div>
        <div className="container">
          <section className="section">
            <div className="section-kicker">SUMMARY</div>
            <h2 className="section-heading">
              한눈에 <span className="accent">보기</span>
            </h2>
            <p className="lead">
              불광동호박나이트는 서울특별시 은평구 불광동, 지하철 3·6호선 불광역 인근에 위치한
              나이트클럽입니다. 부킹석과 룸, 단체석을 운영하며 예약은 전화로 접수합니다. 예약문의는{' '}
              {MANAGER} {TEL_DISPLAY}이며, 페이지 하단 고정 바를 누르면 바로 연결됩니다.
            </p>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>업소명</th>
                  <td>호박나이트 (불광동)</td>
                </tr>
                <tr>
                  <th>위치</th>
                  <td>서울특별시 은평구 불광동 · 불광역 인근</td>
                </tr>
                <tr>
                  <th>예약문의</th>
                  <td>
                    {MANAGER} <a href={TEL_HREF}>{TEL_DISPLAY}</a>
                  </td>
                </tr>
                <tr>
                  <th>좌석</th>
                  <td>부킹석 · 룸 · 단체석</td>
                </tr>
                <tr>
                  <th>영업 시간</th>
                  <td>저녁 ~ 새벽 (요일·시즌별 변동, 방문 전 전화 확인)</td>
                </tr>
                <tr>
                  <th>입장</th>
                  <td>성인 · 신분증 확인 필수</td>
                </tr>
                <tr>
                  <th>결제</th>
                  <td>현금 / 카드 모두 가능</td>
                </tr>
                <tr>
                  <th>주차</th>
                  <td>불광역 주변 공영·인근 주차장 이용 권장</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section">
            <div className="section-kicker">RESERVATION</div>
            <h2 className="section-heading">
              불광동호박나이트 <span className="accent">예약 안내</span>
            </h2>
            <div className="bento">
              <div className="bento-card">
                <div className="bento-kicker">01</div>
                <h3>전화 예약</h3>
                <p>
                  가장 빠른 방법은 전화입니다. {MANAGER} {TEL_DISPLAY}으로 연락 주시면 좌석을 배정해
                  드립니다.
                </p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">02</div>
                <h3>부킹석</h3>
                <p>부킹 중심으로 운영됩니다. 방문 시간대에 따라 자리 배정이 달라집니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">03</div>
                <h3>룸 · 단체</h3>
                <p>5인 이상 단체와 룸은 좌석 확보를 위해 하루 전 예약을 권장합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">04</div>
                <h3>방문 준비</h3>
                <p>신분증 지참은 필수이며, 깔끔한 캐주얼 복장을 권장합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">05</div>
                <h3>오시는 길</h3>
                <p>지하철 3·6호선 불광역에서 도보 이동 가능한 거리입니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">06</div>
                <h3>주차</h3>
                <p>불광역 인근 공영주차장 이용을 권장합니다. 주차 안내도 예약 시 함께 드립니다.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-kicker">AREA</div>
            <h2 className="section-heading">
              이용 <span className="accent">지역</span>
            </h2>
            <p>
              은평구 불광동·연신내·녹번동을 비롯해 서대문구, 마포구, 고양시 일산·화정에서도 불광역
              접근성이 좋아 방문하기 편합니다. 지역별 오시는 길은 예약 시 함께 안내해 드립니다.
            </p>
            <p>
              불광동호박나이트를 처음 찾는 분이라면 불광역에서 도보로 이동하는 경로가 가장 편하며,
              자차 방문 시에는 인근 주차장을 이용해 주세요.
            </p>
          </section>

          <section className="section">
            <div className="section-kicker">FAQ</div>
            <h2 className="section-heading">
              자주 묻는 <span className="accent">질문</span>
            </h2>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="faq" open={i === 0}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
