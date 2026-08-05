import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactNode } from 'react';

const KAKAO_ID = 'besta12';

const NAV = [
  { href: '/', label: '홈' },
  { href: '/info', label: '입장 안내' },
  { href: '/hours', label: '영업 시간' },
  { href: '/ladies', label: '여성 손님' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: '문의' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const isActive = (p: string) =>
    p === '/' ? router.pathname === '/' : router.pathname.startsWith(p);
  const copyKakaoId = async () => {
    try {
      await navigator.clipboard.writeText(KAKAO_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없으면 아이디는 화면에 그대로 노출되므로 별도 처리 없음
    }
  };
  return (
    <>
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <nav className="nav" aria-label="주요 메뉴">
        <div className="nav-inner">
          <Link href="/" className="logo" aria-label="대전원나이트 홈으로 이동">
            <span className="logo-k">DAEJEON</span>
            <span className="logo-s">대전원나이트 공식 안내</span>
          </Link>
          <div className="nav-links">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`nav-link ${isActive(n.href) ? 'active' : ''}`}
                aria-current={isActive(n.href) ? 'page' : undefined}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main id="main">{children}</main>
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <p className="footer-k">DAEJEON ONE NIGHT</p>
          <p>대전원나이트 공식 안내 사이트</p>
          <p>평일 20:00 - 02:30 / 주말 20:00 - 03:30 · 38세 이상 입장</p>
          <p className="footer-copy">© 2026 대전원나이트 · 본 사이트는 업소의 공식 안내 페이지입니다</p>
        </div>
      </footer>
      <button
        type="button"
        className="call-bar"
        onClick={copyKakaoId}
        aria-label={`광고문의 카톡 ${KAKAO_ID} 아이디 복사`}
      >
        <span className="call-bar-icon" aria-hidden="true">
          💬
        </span>
        <span className="call-bar-text">
          {copied ? `카톡 아이디 ${KAKAO_ID} 복사됨` : `광고문의 카톡 ${KAKAO_ID}`}
        </span>
      </button>
    </>
  );
}
