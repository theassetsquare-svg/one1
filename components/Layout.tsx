import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

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
  const isActive = (p: string) =>
    p === '/' ? router.pathname === '/' : router.pathname.startsWith(p);
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-k">DAEJEON</span>
            <span className="logo-s">대전원나이트 공식 안내</span>
          </Link>
          <div className="nav-links">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`nav-link ${isActive(n.href) ? 'active' : ''}`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-k">DAEJEON ONE NIGHT</p>
          <p>대전원나이트 공식 안내 사이트</p>
          <p>평일 20:00 - 02:30 / 주말 20:00 - 03:30 · 38세 이상 입장</p>
          <p>
            예약 · 문의 <a href="tel:01086771258">010-8677-1258</a>
          </p>
          <p className="footer-copy">© 2026 대전원나이트 · 본 사이트는 업소의 공식 안내 페이지입니다</p>
        </div>
      </footer>
      <a href="tel:01086771258" className="float-call" aria-label="예약 및 문의 전화">
        <span className="float-call-icon" aria-hidden="true">
          📞
        </span>
        <span className="float-call-text">예약·문의 010-8677-1258</span>
      </a>
    </>
  );
}
