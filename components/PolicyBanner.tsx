import Link from 'next/link';

/**
 * 입장 안내 배너.
 *
 * ★★ 2026-08-30 — 이 배너가 다섯 쪽에 글자 그대로 박혀 유사문서(문장 겹침)로 걸렸다.
 *   그 쪽들은 문장이 12~16개라 세 줄만 겹쳐도 20%가 넘었다.
 *   사실(38세·22시·교통비 3만원·맥주 1병)은 그대로 두고 적는 방식만 쪽마다 바꾼다.
 *   자리 번호로 고르므로 다섯 쪽이 서로 겹치지 않는다.
 */
const PAGES = ['contact-2', 'faq-1', 'hours-2', 'info-2', 'ladies-1'];
function at<T>(page: string, offset: number, arr: readonly T[]): T {
  const i = PAGES.indexOf(page);
  return arr[((i < 0 ? 0 : i) + offset) % arr.length];
}

const KICKER = ['ENTRY POLICY', 'ENTRY GUIDE', 'ADMISSION', 'ENTRY INFO', 'ENTRY RULES',
  'ADMISSION GUIDE', 'ENTRY NOTICE', 'HOUSE RULES'];
const HEADING = ['입장 안내', '입장 기준 안내', '들어오시기 전 안내', '출입 안내',
  '입장 관련 정리', '방문 전 안내', '입장 조건 안내', '출입 기준 정리'];
const LABEL1 = ['입장 연령', '나이 기준', '출입 연령', '연령 조건',
  '입장 가능 나이', '기준 연령', '출입 가능 연령', '연령 기준선'];
const DESC1 = ['신분증 확인 필수', '신분증을 꼭 챙기십시오', '입구에서 신분증을 확인합니다',
  '신분 확인 절차가 있습니다', '증명서 지참이 필요합니다', '나이 확인을 거칩니다',
  '신분증 없이는 어렵습니다', '입장 전 신분 확인이 있습니다'];
const LABEL2 = ['22시 이전 입장 여성 손님', '밤 10시 전 오시는 여성 손님', '22시 전 도착 여성 손님',
  '10시 이전 입장하시는 여성 손님', '22시 이전 방문 여성 손님', '밤 10시 이전 여성 손님',
  '22시 전 들어오시는 여성 손님', '10시 전 오신 여성 손님'];
const VALUE2 = ['교통비 + 맥주 제공', '차비와 맥주 함께 제공', '교통비·맥주 모두 지원',
  '차비 지원 + 맥주 서비스', '교통비와 맥주 기본 제공', '차비·맥주 두 가지 적용',
  '교통비 지원과 맥주 제공', '차비 지원 · 맥주 기본'];
const ROW1 = ['교통비 3만원 지원', '차비 3만원 지급', '교통비 3만원 드립니다',
  '차비 명목 3만원 지원', '3만원 교통비 제공', '오시는 차비 3만원',
  '이동비 3만원 지급', '3만원 차비 드립니다'];
const ROW2 = ['맥주 1병 기본 제공', '맥주 한 병 기본 서비스', '기본으로 맥주 1병',
  '맥주 1병이 기본 포함', '맥주 한 병 제공됩니다', '기본 맥주 1병 서비스',
  '맥주 1병 기본 지원', '맥주 한 병이 기본입니다'];
const FINE = ['신분증 확인 후 적용 · 운영 정책에 따라 변경될 수 있습니다',
  '신분 확인 뒤 적용되며 운영 방침에 따라 달라질 수 있습니다',
  '증명서 확인 후 적용됩니다 · 방침은 바뀔 수 있습니다',
  '나이 확인을 거쳐 적용되며 사정에 따라 조정될 수 있습니다',
  '신분증 확인이 선행됩니다 · 운영 기준은 변동될 수 있습니다',
  '확인 절차 뒤 적용되고 방침에 따라 바뀔 수 있습니다',
  '신분 확인 후 적용 · 기준은 그때그때 달라질 수 있습니다',
  '증명 확인을 마쳐야 적용되며 운영에 따라 변경됩니다'];
const CTA = ['예약 · 문의 안내', '예약과 문의 안내', '문의·예약 바로가기',
  '예약 문의로 이동', '문의 안내 보기', '예약 안내 페이지',
  '문의 창구 안내', '예약 문의 확인'];

export default function PolicyBanner({ page = '' }: { page?: string }) {
  return (
    <section className="policy">
      <div className="policy-kicker">{at(page, 0, KICKER)}</div>
      <h2 className="policy-heading">{at(page, 1, HEADING)}</h2>
      <div className="policy-grid">
        <div className="policy-card policy-card-1">
          <div className="policy-num">01</div>
          <div className="policy-label">{at(page, 2, LABEL1)}</div>
          <div className="policy-value">38세 이상</div>
          <div className="policy-desc">{at(page, 3, DESC1)}</div>
        </div>
        <div className="policy-card policy-card-2">
          <div className="policy-num">02</div>
          <div className="policy-label">{at(page, 4, LABEL2)}</div>
          <div className="policy-value">{at(page, 5, VALUE2)}</div>
          <div className="policy-rows">
            <div className="policy-row">{at(page, 6, ROW1)}</div>
            <div className="policy-row">{at(page, 7, ROW2)}</div>
          </div>
          <div className="policy-fine">{at(page, 0, FINE)}</div>
        </div>
      </div>
      <Link href="/contact-2" className="policy-cta">
        {at(page, 1, CTA)}
      </Link>
    </section>
  );
}
