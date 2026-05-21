import SEO from '@/components/SEO';
import Schema, { FAQ_ITEMS } from '@/components/Schema';
import Layout from '@/components/Layout';
import PolicyBanner from '@/components/PolicyBanner';

export default function Faq() {
  return (
    <>
      <SEO
        title="자주 묻는 질문 - 대전원나이트 (입장 · 예약 · 결제 · 위치)"
        description="대전원나이트 FAQ. 입장 연령, 여성 손님 안내, 영업 시간, 예약, 위치, 드레스코드, 결제 등 13가지 답변."
        path="/faq"
        ogImage="/og/faq.png"
      />
      <Schema path="/faq" crumb="FAQ" pageType="FAQPage" includeFaq />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">FAQ</div>
          <h1>
            자주 묻는 <span className="accent">질문</span>
          </h1>
          <p>방문 전 자주 묻는 질문들을 정리했습니다.</p>
        </div>
        <div className="container">
          <PolicyBanner />

          <section className="section">
            <div className="section-kicker">QUESTIONS</div>
            <h2 className="section-heading">
              13가지 <span className="accent">답변</span>
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
