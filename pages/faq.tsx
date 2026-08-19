import SEO from '@/components/SEO';
import Schema, { FAQ_ITEMS } from '@/components/Schema';
import Layout from '@/components/Layout';
import Thumb from '@/components/Thumb';
import PolicyBanner from '@/components/PolicyBanner';

export default function Faq() {
  return (
    <>
      <SEO
        title="대전원나이트 FAQ - 자주 묻는 13가지"
        description="대전원나이트 자주 묻는 질문 13가지. 입장 연령, 22시 전 여성 손님 안내, 영업 시간, 위치, 결제, 드레스코드까지 한 페이지에. 문의는 페이지 하단 광고문의 카톡 besta12로 안내드립니다."
        path="/faq"
        ogImage="/og/faq.png"
        ogAlt="대전원나이트 자주 묻는 질문"
      />
      <Schema path="/faq" crumb="FAQ" pageType="FAQPage" includeFaq />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">FAQ</div>
          <h1>
            자주 묻는 <span className="accent">질문</span>
          </h1>
          <p>방문 전 자주 묻는 질문들을 정리했습니다.</p>
          <Thumb src="/og/faq.png" alt="대전원나이트 자주 묻는 질문" />
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
