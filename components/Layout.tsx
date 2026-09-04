import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ReactNode } from 'react';

/* ★ 2026-08-31 — 연령·관계 고지가 없어 신고에 취약했다(설계도 4장).
   이 레이아웃이 감싸는 쪽에는 담당자 광고가 실리지 않는다(고정 연락바 없음).
   그래서 '업소와 관계 없음' 쪽 문구만 쓴다. */
const 광고고지 = [
  "이 페이지에는 해당 업소 담당자의 광고가 실려 있습니다. 만 19세 이상 성인 대상입니다.",
  "아래 담당자 연락처는 광고로 실린 것입니다. 만 19세 이상만 이용할 수 있습니다.",
  "담당자 연락처 안내는 광고입니다. 만 19세 이상 성인 업소를 다룹니다.",
  "업소 담당자의 요청으로 광고를 싣고 있습니다. 성인(만 19세 이상) 대상입니다.",
];
const 안내고지 = [
  "만 19세 이상 이용 가능한 성인 업소 안내입니다. 업소와 제휴 관계가 없는 정보 페이지입니다.",
  "성인(만 19세 이상)만 이용할 수 있는 곳을 다룹니다. 업소와 광고·제휴 관계가 없습니다.",
  "이 글은 만 19세 이상 성인 대상 업소 안내이며, 업소와 아무런 관계가 없습니다.",
  "만 19세 미만은 출입할 수 없습니다. 공개 자료만 정리한 제3자 안내 페이지입니다.",
  "성인 전용 업소를 다루는 안내입니다. 업소로부터 대가를 받지 않았습니다.",
  "만 19세 이상만 들어갈 수 있는 곳입니다. 업소와 제휴하지 않은 정보 페이지입니다.",
  "성인 대상 업소 안내이며 청소년 출입·고용은 금지입니다. 공개 자료 기준입니다.",
  "만 19세 이상 성인만 이용하는 업소를 안내합니다. 업소의 공식 채널이 아닙니다.",
];
function 안내고지고르기(씨: unknown, 광고쪽?: boolean) {
  /* ★ 고정바에 담당자 전화가 나가는 쪽(callBar='phone')은 광고를 싣는 것이다 */
  const 곳간 = 광고쪽 ? 광고고지 : 안내고지;
  const s = String(씨 ?? "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 곳간[n % 곳간.length];
}


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
              <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#9aa0a6" }}>{안내고지고르기(router.asPath, callBar === 'phone')}</p>
        {router.pathname !== '/' ? (
          <p className="cafe-link" style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.7 }}><a href="https://nolcool.com/cafe/?utm_source=f&utm_medium=site_link&utm_campaign=cafe" rel="noopener">놀쿨 카페 안내 →</a></p>
        ) : null}
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
