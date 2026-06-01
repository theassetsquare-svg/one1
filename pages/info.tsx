import SEO from '@/components/SEO';
import Schema from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Info() {
  return (
    <>
      <SEO
        title="38세부터 들어가는 법 - 대전원나이트 입장 가이드"
        description="대전원나이트 첫 방문이 처음이라면. 신분증·드레스코드·시간대·결제·주차까지 막내가 직접 알려주는 입장 가이드. 직통 로 한 번에 확인하세요."
        path="/info"
        ogImage="/og/info.png"
      />
      <Schema path="/info" crumb="입장 안내" pageType="WebPage" includeHowTo />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">ENTRY</div>
          <h1>
            입장 <span className="accent">안내</span>
          </h1>
          <p>처음 방문하시는 분을 위한 입장 안내입니다.</p>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">STEP BY STEP</div>
            <h2 className="section-heading">
              방문 <span className="accent">절차</span>
            </h2>
            <div className="bento">
              <div className="bento-card">
                <div className="bento-kicker">01</div>
                <h3>연령 확인 준비</h3>
                <p>만 38세 이상부터 입장 가능합니다. 신분증을 미리 준비해 주세요.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">02</div>
                <h3>방문 시간 선택</h3>
                <p>여성 손님은 22시 이전 입장 시 교통비 + 맥주 안내가 적용됩니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">03</div>
                <h3>드레스코드</h3>
                <p>깔끔한 캐주얼 복장을 권장합니다. 슬리퍼·반바지는 제한될 수 있습니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">04</div>
                <h3>막내에게 예약 전화</h3>
                <p>좌석·룸 예약은 막내 직통 로 진행합니다. 막내가 직접 응대합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">05</div>
                <h3>주차 안내</h3>
                <p>전용 주차장이 없습니다. 주변 공영주차장 이용을 권장합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">06</div>
                <h3>결제 방법</h3>
                <p>현금 및 카드 결제가 모두 가능합니다.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-kicker">DETAILS</div>
            <h2 className="section-heading">
              입장 <span className="accent">세부 안내</span>
            </h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>입장 연령</th>
                  <td>만 38세 이상 · 신분증 확인 필수</td>
                </tr>
                <tr>
                  <th>여성 손님 안내</th>
                  <td>22시 이전 입장 시 교통비 3만원 지원 + 맥주 1병 제공</td>
                </tr>
                <tr>
                  <th>드레스코드</th>
                  <td>깔끔한 캐주얼 (슬리퍼·반바지·운동복 제한)</td>
                </tr>
                <tr>
                  <th>예약</th>
                  <td>막내 직통 </td>
                </tr>
                <tr>
                  <th>결제</th>
                  <td>현금 / 카드 모두 가능</td>
                </tr>
                <tr>
                  <th>주차</th>
                  <td>주변 공영주차장 이용 권장</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </Layout>
    </>
  );
}
