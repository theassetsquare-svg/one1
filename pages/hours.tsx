import SEO from '@/components/SEO';
import Schema from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Hours() {
  return (
    <>
      <SEO
        title="평일 새벽 2시반 / 주말 3시반까지 - 대전원나이트 영업 시간"
        description="대전원나이트 영업 시간 안내. 평일 20:00 - 02:30, 주말 20:00 - 03:30. 22시 이전 입장 여성 손님 혜택 시간대까지 한눈에. 까치 직통 010-3918-9414."
        path="/hours"
        ogImage="/og/hours.png"
      />
      <Schema path="/hours" crumb="영업 시간" pageType="WebPage" />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">HOURS</div>
          <h1>
            영업 <span className="accent">시간</span>
          </h1>
          <p>요일별 영업 시간을 확인하세요.</p>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">WEEKLY</div>
            <h2 className="section-heading">
              요일별 <span className="accent">영업 시간</span>
            </h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <th>월요일</th>
                  <td>20:00 - 02:30</td>
                </tr>
                <tr>
                  <th>화요일</th>
                  <td>20:00 - 02:30</td>
                </tr>
                <tr>
                  <th>수요일</th>
                  <td>20:00 - 02:30</td>
                </tr>
                <tr>
                  <th>목요일</th>
                  <td>20:00 - 02:30</td>
                </tr>
                <tr>
                  <th>금요일</th>
                  <td>20:00 - 02:30</td>
                </tr>
                <tr>
                  <th>토요일</th>
                  <td>20:00 - 03:30</td>
                </tr>
                <tr>
                  <th>일요일</th>
                  <td>20:00 - 03:30</td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: '#7a82a8', fontSize: '0.92rem', marginTop: 24 }}>
              ※ 공휴일·연휴 영업 시간은 변경될 수 있습니다. 방문 전 까치 직통 010-3918-9414로 확인해 주세요.
            </p>
          </section>

          <section className="section">
            <div className="section-kicker">TIME SLOTS</div>
            <h2 className="section-heading">
              시간대 <span className="accent">안내</span>
            </h2>
            <div className="bento">
              <div className="bento-card">
                <div className="bento-kicker">20:00 - 22:00</div>
                <h3>오프닝</h3>
                <p>여성 손님 22시 이전 입장 시 교통비 + 맥주 안내가 적용되는 시간대입니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">22:00 - 00:00</div>
                <h3>피크 전</h3>
                <p>좌석 회전이 시작되는 시간대로 예약을 권장합니다.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">00:00 - 02:30</div>
                <h3>피크 타임</h3>
                <p>가장 붐비는 시간대. 룸·단체는 예약 필수.</p>
              </div>
              <div className="bento-card">
                <div className="bento-kicker">주말 ~ 03:30</div>
                <h3>주말 연장</h3>
                <p>토·일요일은 03:30까지 운영합니다.</p>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
