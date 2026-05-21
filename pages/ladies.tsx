import SEO from '@/components/SEO';
import Schema from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Ladies() {
  return (
    <>
      <SEO
        title="여성 손님 안내 - 대전원나이트 (22시 이전 입장 · 교통비 + 맥주)"
        description="대전원나이트 여성 손님 안내. 22시 이전 입장 시 교통비 3만원 지원과 맥주 1병 제공. 38세 이상 입장. 신분증 확인 후 적용됩니다."
        path="/ladies"
        ogImage="/og/ladies.png"
      />
      <Schema path="/ladies" crumb="여성 손님 안내" pageType="WebPage" />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">LADIES</div>
          <h1>
            여성 손님 <span className="accent">안내</span>
          </h1>
          <p>22시 이전 입장 여성 손님에게 적용되는 안내입니다.</p>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">BENEFITS</div>
            <h2 className="section-heading">
              제공 <span className="accent">내역</span>
            </h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>교통비 지원</th>
                  <td>3만원 (현금 지원)</td>
                </tr>
                <tr>
                  <th>맥주</th>
                  <td>1병 기본 제공</td>
                </tr>
                <tr>
                  <th>적용 시간</th>
                  <td>22:00 이전 입장 시</td>
                </tr>
                <tr>
                  <th>적용 조건</th>
                  <td>신분증 확인 (만 38세 이상)</td>
                </tr>
                <tr>
                  <th>변경 가능성</th>
                  <td>운영 정책에 따라 변경될 수 있습니다</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section">
            <div className="section-kicker">NOTICE</div>
            <h2 className="section-heading">
              유의 <span className="accent">사항</span>
            </h2>
            <div className="bento">
              <div className="bento-card">
                <div className="bento-kicker">01</div>
                <h3>신분증 필수</h3>
                <p>만 38세 이상 확인을 위해 신분증 지참은 필수입니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">02</div>
                <h3>22시 마감</h3>
                <p>22:00 이후 입장 시에는 안내가 적용되지 않을 수 있습니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">03</div>
                <h3>현장 확인</h3>
                <p>입장 시 직원의 안내에 따라 신분증 확인이 진행됩니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">04</div>
                <h3>정책 변경</h3>
                <p>운영 정책상 안내 내용은 사전 고지 없이 변경될 수 있습니다.</p>
              </div>
            </div>
            <p style={{ marginTop: 24 }}>
              자세한 안내는 직통 <a href="tel:01086771258" style={{ color: '#00e5ff', fontWeight: 700 }}>010-8677-1258</a>로 문의해 주세요.
            </p>
          </section>
        </div>
      </Layout>
    </>
  );
}
