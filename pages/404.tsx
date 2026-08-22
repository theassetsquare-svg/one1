import Link from 'next/link';
import SEO from '@/components/SEO';
import Layout from '@/components/Layout';
import Thumb from '@/components/Thumb';

export default function NotFound() {
  return (
    <>
      <SEO
        title="대전원나이트 - 페이지를 찾을 수 없습니다"
        description="요청하신 페이지를 찾을 수 없습니다. 대전원나이트 공식 안내 홈으로 이동해 주세요."
        path="/404"
        ogAlt="대전원나이트 안내 페이지"
      />
      <Layout>
        <div className="hero">
          <div className="hero-kicker">404</div>
          <h1>
            페이지를 <span className="accent">찾을 수 없습니다</span>
          </h1>
          <p>요청하신 주소가 변경되었거나 존재하지 않습니다.</p>
          <Thumb src="/og/og-thumb.png" alt="대전원나이트 안내 페이지" />
          <div className="cta-row">
            <Link href="/" className="cta-primary">
              홈으로 이동
            </Link>
            <Link href="/info-guide" className="cta-secondary">
              입장 안내 보기
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
