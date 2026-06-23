import SEO from '@/components/SEO';
import Schema from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Contact() {
  return (
    <>
      <SEO
        title="까치 직통 010-3918-9414 - 대전원나이트 예약·문의"
        description="대전원나이트 예약·룸·단체·VIP·일반 안내 모두 까치 직통 010-3918-9414. 영업 시간 내 까치가 직접 응대합니다. 한 번에 안내해 드립니다."
        path="/contact"
        ogImage="/og/contact.png"
      />
      <Schema path="/contact" crumb="예약·문의" pageType="ContactPage" />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">CONTACT</div>
          <h1>
            예약 · <span className="accent">문의</span>
          </h1>
          <p>예약 및 일반 문의는 직통 전화로 안내드립니다.</p>
          <div className="cta-row">
            <a href="tel:01039189414" className="cta-primary">
              지금 까치에게 전화 010-3918-9414
            </a>
          </div>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">CHANNELS</div>
            <h2 className="section-heading">
              문의 <span className="accent">채널</span>
            </h2>
            <div className="bento">
              <div className="bento-card">
                <div className="bento-kicker">PHONE</div>
                <h3>까치 직통 전화</h3>
                <p>
                  <a href="tel:01039189414" style={{ color: '#00e5ff', fontWeight: 700 }}>
                    010-3918-9414
                  </a>
                  <br />
                  예약·룸 안내·단체 모임 등 모든 문의는 까치가 직접 응대합니다.
                </p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">HOURS</div>
                <h3>응대 시간</h3>
                <p>영업 시간 내 응대 가능합니다.<br />평일 20:00 - 02:30 / 주말 20:00 - 03:30</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">RESERVATION</div>
                <h3>예약 안내</h3>
                <p>5인 이상 단체, 룸·VIP 좌석은 사전 예약을 권장합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">LOCATION</div>
                <h3>위치 안내</h3>
                <p>대전광역시 시내에 위치합니다. 정확한 위치는 예약 시 직통 전화로 안내드립니다.</p>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
