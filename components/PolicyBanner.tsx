export default function PolicyBanner() {
  return (
    <section className="policy">
      <div className="policy-kicker">ENTRY POLICY</div>
      <h2 className="policy-heading">입장 안내</h2>
      <div className="policy-grid">
        <div className="policy-card policy-card-1">
          <div className="policy-num">01</div>
          <div className="policy-label">입장 연령</div>
          <div className="policy-value">38세 이상</div>
          <div className="policy-desc">신분증 확인 필수</div>
        </div>
        <div className="policy-card policy-card-2">
          <div className="policy-num">02</div>
          <div className="policy-label">22시 이전 입장 여성 손님</div>
          <div className="policy-value">교통비 + 맥주 제공</div>
          <div className="policy-rows">
            <div className="policy-row">교통비 3만원 지원</div>
            <div className="policy-row">맥주 1병 기본 제공</div>
          </div>
          <div className="policy-fine">신분증 확인 후 적용 · 운영 정책에 따라 변경될 수 있습니다</div>
        </div>
      </div>
      <a href="https://theassetsquare.com/" className="policy-cta">
        막내 직통 
      </a>
    </section>
  );
}
