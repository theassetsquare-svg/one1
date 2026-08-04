const SITE = 'https://one1-3md.pages.dev';

type Props = {
  path: string;
  crumb: string;
  pageType?: string;
  includeFaq?: boolean;
  includeHowTo?: boolean;
};

const FAQ_ITEMS = [
  { q: '입장 가능 연령은?', a: '38세 이상부터 입장 가능합니다. 신분증 확인이 필수입니다.' },
  {
    q: '22시 이전 입장 여성 손님 안내는?',
    a: '22시 이전 입장 여성 손님에게는 교통비 3만원 지원과 맥주 1병이 기본으로 제공됩니다. 신분증 확인 후 적용되며 운영 정책에 따라 변경될 수 있습니다.',
  },
  { q: '영업 시간은?', a: '평일 20:00 ~ 02:30 / 주말 20:00 ~ 03:30 영업합니다.' },
  { q: '예약은 어떻게 하나요?', a: '까치 직통 010-3918-9414 전화로 예약을 권장합니다. 까치가 직접 응대합니다.' },
  { q: '위치는 어디인가요?', a: '대전광역시 시내에 위치합니다. 정확한 위치는 까치 직통 010-3918-9414로 안내드립니다.' },
  { q: '드레스코드가 있나요?', a: '깔끔한 캐주얼 복장을 권장합니다. 슬리퍼, 반바지는 제한될 수 있습니다.' },
  { q: '주차는 가능한가요?', a: '주변 공영주차장 이용을 권장합니다.' },
  { q: '카드 결제가 되나요?', a: '네, 카드 결제 가능합니다.' },
  { q: '룸 예약이 가능한가요?', a: '예약 가능합니다. 직통 전화로 문의해 주세요.' },
  { q: '단체 모임도 받나요?', a: '5인 이상 단체는 예약을 권장합니다.' },
  { q: '청주에서 가는 방법은?', a: '자차로 약 30분 거리입니다.' },
  { q: '신분증은 꼭 필요한가요?', a: '네, 입장 연령 확인을 위해 신분증이 필수입니다.' },
  { q: '문의 채널은?', a: '까치 직통 010-3918-9414 전화로 까치가 직접 안내드립니다.' },
];

export default function Schema({ path, crumb, pageType = 'WebPage', includeFaq, includeHowTo }: Props) {
  const main = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: '대전원나이트',
        url: `${SITE}/`,
        inLanguage: 'ko-KR',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'NightClub',
        '@id': `${SITE}/#nightclub`,
        name: '대전원나이트',
        url: `${SITE}/`,
        telephone: '+82-10-3918-9414',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '대전광역시',
          addressRegion: '대전',
          addressCountry: 'KR',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 36.3504, longitude: 127.3845 },
        hasMap: 'https://map.naver.com/v5/search/대전원나이트',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '20:00',
            closes: '02:30',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday'],
            opens: '20:00',
            closes: '03:30',
          },
        ],
        acceptsReservations: true,
        image: `${SITE}/og/og-thumb.png`,
        description: '38세 이상 입장. 22시 이전 입장 여성 손님에게 교통비 3만원과 맥주 1병이 제공됩니다.',
        areaServed: ['대전', '충남', '청주', '세종'],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE}/#business`,
        name: '대전원나이트',
        telephone: '+82-10-3918-9414',
        url: `${SITE}/`,
        priceRange: '₩₩',
        image: `${SITE}/og/og-thumb.png`,
      },
      {
        '@type': pageType,
        name: crumb,
        url: `${SITE}${path}`,
        isPartOf: { '@id': `${SITE}/#website` },
        inLanguage: 'ko-KR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` },
          ...(path !== '/'
            ? [{ '@type': 'ListItem', position: 2, name: crumb, item: `${SITE}${path}` }]
            : []),
        ],
      },
    ],
  };

  const faq = includeFaq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((i) => ({
          '@type': 'Question',
          name: i.q,
          acceptedAnswer: { '@type': 'Answer', text: i.a },
        })),
      }
    : null;

  const howto = includeHowTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: '대전원나이트 첫 방문 안내',
        step: [
          { '@type': 'HowToStep', text: '38세 이상 신분증 준비' },
          { '@type': 'HowToStep', text: '여성 손님은 22시 이전 입장 (교통비 + 맥주 제공)' },
          { '@type': 'HowToStep', text: '깔끔한 캐주얼 복장 착용' },
          { '@type': 'HowToStep', text: '직통 010-3918-9414 전화 예약' },
          { '@type': 'HowToStep', text: '주변 공영주차장 이용' },
        ],
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(main) }} />
      {faq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      )}
      {howto && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }}
        />
      )}
    </>
  );
}

export { FAQ_ITEMS };
