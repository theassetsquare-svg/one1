import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactNode } from 'react';

const KAKAO_ID = 'besta12';
const HOBAK_TEL = '010 2221 1937';
const HOBAK_TEL_HREF = 'tel:+821022211937';
const HOBAK_MANAGER = '손흥민';

/* 상단 로고 — 페이지 주체 가게이름 1개만 노출한다 */
const LOGO = {
  daejeon: { aria: '홈으로 이동', k: 'DAEJEON', s: '대전원나이트 공식 안내' },
  note: { aria: '입문 노트 홈으로 이동', k: 'FIRST NIGHT', s: '생애 첫 나이트, 입문 노트' },
  hobak: { aria: '홈으로 이동', k: 'BULGWANG HOBAK', s: '불광동호박나이트 예약문의 안내' },
} as const;

const NAV = [
  { href: '/', label: '홈' },
  { href: '/info-2', label: '입장 안내' },
  { href: '/hours-2', label: '영업 시간' },
  { href: '/ladies-1', label: '여성 손님' },
  { href: '/faq-1', label: 'FAQ' },
  { href: '/contact-2', label: '문의' },
];

type LayoutProps = {
  children: ReactNode;
  /** 하단 고정 바 종류. 기본은 대전원나이트 광고문의 카톡, 'phone'은 불광동호박나이트 예약문의 전화,
   *  'kakaoFull'은 입문 노트 홈의 '광고문의 카카오톡' 표기 */
  callBar?: 'kakao' | 'phone' | 'kakaoFull';
  /** 상단 로고·푸터 문구. 기본은 대전원나이트, 'note'는 입문 노트 홈 전용,
   *  'hobak'은 불광동호박나이트 단독 페이지 전용(1페이지=1가게이름 규칙) */
  brand?: 'daejeon' | 'note' | 'hobak';
};

export default function Layout({ children, callBar = 'kakao', brand = 'daejeon' }: LayoutProps) {
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
          <Link
            href="/"
            className="logo"
            aria-label={LOGO[brand].aria}
          >
            <span className="logo-k">{LOGO[brand].k}</span>
            <span className="logo-s">{LOGO[brand].s}</span>
          </Link>
          <div className="nav-links">
            {brand === 'note' && (
              <Link href="/start/" className="nav-link">
                입문 노트 40
              </Link>
            )}
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
        {brand === 'note' ? (
          <div className="footer-inner">
            <p className="footer-k">FIRST NIGHT NOTE</p>
            <p>생애 첫 나이트, 입문 노트</p>
            <p>
              <Link href="/start/">전국 나이트 입문 노트 40</Link>
            </p>
            <p className="footer-copy">
              © 2026 · 공개 자료를 정리한 안내 페이지이며, 확인되지 않은 항목은 &quot;확인 불가&quot;로 표기했습니다.
            </p>
          </div>
        ) : brand === 'hobak' ? (
          <div className="footer-inner">
            <p className="footer-k">BULGWANG HOBAK NIGHT</p>
            <p>불광동호박나이트 안내 페이지 · 서울 은평구 불광동</p>
            <p>불광역 인근 · 부킹 · 룸 · 단체 · 신분증 확인</p>
            <p className="footer-copy">© 2026 불광동호박나이트 · 본 페이지는 업소의 안내 페이지입니다</p>
          </div>
        ) : (
          <div className="footer-inner">
            <p className="footer-k">DAEJEON ONE NIGHT</p>
            <p>대전원나이트 공식 안내 사이트</p>
            <p>평일 20:00 - 02:30 / 주말 20:00 - 03:30 · 38세 이상 입장</p>
            <p>
              <Link href="/bulgwangdong-hobak">불광동호박나이트 안내</Link>
            </p>
            <p className="footer-copy">© 2026 대전원나이트 · 본 사이트는 업소의 공식 안내 페이지입니다</p>
          </div>
        )}
      </footer>
      {callBar === 'phone' ? (
        <a
          className="call-bar call-bar-phone"
          href={HOBAK_TEL_HREF}
          aria-label={`불광동호박나이트 예약문의 ${HOBAK_MANAGER} ${HOBAK_TEL} 전화 걸기`}
        >
          <span className="call-bar-icon" aria-hidden="true">
            📞
          </span>
          <span className="call-bar-text">
            예약문의 {HOBAK_MANAGER} {HOBAK_TEL}
          </span>
        </a>
      ) : (
        <button
          type="button"
          className="call-bar"
          onClick={copyKakaoId}
          aria-label={`광고문의 ${callBar === 'kakaoFull' ? '카카오톡' : '카톡'} ${KAKAO_ID} 아이디 복사`}
        >
          <span className="call-bar-icon" aria-hidden="true">
            💬
          </span>
          <span className="call-bar-text">
            {copied
              ? `카톡 아이디 ${KAKAO_ID} 복사됨`
              : `광고문의 ${callBar === 'kakaoFull' ? '카카오톡' : '카톡'} ${KAKAO_ID}`}
          </span>
        </button>
      )}
    </>
  );
}
