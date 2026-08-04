import Link from 'next/link';
import SEO from '@/components/SEO';
import Schema from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Home() {
  return (
    <>
      <SEO
        title="대전원나이트 - 까치가 직접 받는 예약, 38세 이상 입장 안내"
        description="대전원나이트 까치 직통. 38세 이상 입장, 22시 이전 입장 여성 손님 교통비 3만원과 맥주 1병 기본 제공. 평일 새벽 2시반 / 주말 새벽 3시반까지. 예약 010-3918-9414."
        path="/"
        ogImage="/og/home.png"
      />
      <Schema path="/" crumb="홈" pageType="WebPage" includeFaq includeHowTo />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">OFFICIAL</div>
          <h1>
            대전원나이트 <span className="accent">공식 안내</span>
          </h1>
          <p>38세 이상 입장 · 매일 20:00 영업 시작 · 예약은 직통 전화로 안내드립니다.</p>
          <div className="cta-row">
            <a href="tel:01039189414" className="cta-primary">
              까치 직통 010-3918-9414
            </a>
            <Link href="/info" className="cta-secondary">
              입장 안내 보기
            </Link>
          </div>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">QUICK INFO</div>
            <h2 className="section-heading">
              영업 정보 <span className="accent">요약</span>
            </h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>입장 연령</th>
                  <td>만 38세 이상 (신분증 확인 필수)</td>
                </tr>
                <tr>
                  <th>영업 시간</th>
                  <td>평일 20:00 - 02:30 / 주말 20:00 - 03:30</td>
                </tr>
                <tr>
                  <th>위치</th>
                  <td>대전광역시 (정확한 위치는 직통 전화로 안내)</td>
                </tr>
                <tr>
                  <th>예약·문의</th>
                  <td>
                    까치 직통{' '}
                    <a href="tel:01039189414" style={{ color: '#00e5ff', fontWeight: 700 }}>
                      010-3918-9414
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>결제</th>
                  <td>카드 결제 가능</td>
                </tr>
                <tr>
                  <th>드레스코드</th>
                  <td>깔끔한 캐주얼 권장 (슬리퍼·반바지 제한)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section">
            <div className="section-kicker">PAGES</div>
            <h2 className="section-heading">
              안내 <span className="accent">페이지</span>
            </h2>
            <div className="bento">
              <Link href="/info" className="bento-card">
                <div className="bento-kicker">ENTRY</div>
                <h3>입장 안내</h3>
                <p>38세 이상 · 신분증 · 옷차림 · 결제 안내를 한 페이지에 정리했습니다.</p>
              </Link>
              <Link href="/hours" className="bento-card">
                <div className="bento-kicker">HOURS</div>
                <h3>영업 시간</h3>
                <p>평일 20:00 - 02:30 / 주말 20:00 - 03:30. 요일별 안내를 확인하세요.</p>
              </Link>
              <Link href="/ladies" className="bento-card">
                <div className="bento-kicker">LADIES</div>
                <h3>여성 손님 안내</h3>
                <p>22시 이전 입장 여성 손님 교통비 3만원 지원과 맥주 1병 기본 제공.</p>
              </Link>
              <Link href="/faq" className="bento-card">
                <div className="bento-kicker">FAQ</div>
                <h3>자주 묻는 질문</h3>
                <p>예약·위치·결제·드레스코드 등 자주 묻는 13가지 답변.</p>
              </Link>
              <Link href="/contact" className="bento-card">
                <div className="bento-kicker">CONTACT</div>
                <h3>까치 직통 문의</h3>
                <p>까치 010-3918-9414 - 룸·단체 예약 및 일반 안내 한 번에.</p>
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section-kicker">FAQ</div>
            <h2 className="section-heading">
              자주 묻는 <span className="accent">질문</span>
            </h2>
            <div className="faq-list">
              <details className="faq" open>
                <summary>22시 이전 입장 여성 손님 안내는 어떻게 되나요?</summary>
                <p>
                  22시 이전 입장 여성 손님에게는 교통비 3만원 지원과 맥주 1병이 기본으로 제공됩니다.
                  신분증 확인 후 적용되며, 운영 정책에 따라 변경될 수 있습니다.
                </p>
              </details>
              <details className="faq">
                <summary>입장 가능 연령은?</summary>
                <p>만 38세 이상부터 입장 가능합니다. 신분증 확인이 필수입니다.</p>
              </details>
              <details className="faq">
                <summary>영업 시간은?</summary>
                <p>평일 20:00 - 02:30, 주말 20:00 - 03:30 영업합니다.</p>
              </details>
              <details className="faq">
                <summary>예약은 어떻게 하나요?</summary>
                <p>까치 직통 010-3918-9414 전화로 예약을 권장합니다. 까치가 직접 응대합니다.</p>
              </details>
              <details className="faq">
                <summary>위치는 어디인가요?</summary>
                <p>대전광역시 시내에 위치합니다. 정확한 위치는 까치 직통 010-3918-9414로 안내드립니다.</p>
              </details>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
