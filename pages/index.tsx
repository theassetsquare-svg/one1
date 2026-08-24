import Head from 'next/head';
import SEO from '@/components/SEO';

const SITE = 'https://f.nolcool.com';

const TITLE = '다시 시작하는 데 필요한 건 자신감이 아니었다';
const DESC =
  '서른아홉에 통장 잔액 11,200원을 보고 주저앉았던 사람이 1,146일 만에 빚을 다 갚기까지. 바닥에서 다시 일어선 과정을 숫자와 장면 그대로 옮긴 긴 글입니다.';

const RULES: [string, string][] = [
  [
    '바닥은 사건이 아니라 계산이다',
    '무너진 날의 감정은 아무리 들여다봐도 답이 없습니다. 답은 숫자에 있습니다. 얼마를, 언제까지, 하루 얼마씩. 이 세 칸을 채우는 순간 바닥은 사고가 아니라 일정표가 됩니다.',
  ],
  [
    '의욕은 매일 오지 않지만 시간표는 매일 온다',
    '하고 싶은 날에만 하면 한 달에 아홉 번 합니다. 정해 둔 시간에 하면 서른 번 합니다. 이 차이가 1년이면 252번입니다. 재능이 아니라 이 숫자가 사람을 갈라놓습니다.',
  ],
  [
    '하루 90분은 1년에 547시간이다',
    '547시간이면 자격증 두 개를 따고도 남습니다. 없는 건 시간이 아니라 잘라 놓은 시간입니다. 남는 시간에 하겠다는 말은, 하지 않겠다는 말의 정중한 표현입니다.',
  ],
  [
    '비교하는 시간은 이자로 나간다',
    '남의 결과와 내 과정을 나란히 놓으면 반드시 집니다. 상대는 3년을 압축해 보여 주고, 나는 오늘 하루를 통째로 보고 있기 때문입니다. 볼 것은 어제의 나 하나면 충분합니다.',
  ],
  [
    '도와줄 사람에게 먼저 말해야 한다',
    '사람들은 생각보다 잘 돕습니다. 다만 모르면 못 돕습니다. 자존심 때문에 삼킨 한마디가 반년을 늦춥니다. 말을 꺼내는 데 드는 비용은 3초, 삼키는 데 드는 비용은 6개월입니다.',
  ],
  [
    '포기는 결심이 아니라 습관으로 온다',
    '누구도 "오늘부로 포기한다"고 선언하지 않습니다. 하루를 건너뛰고, 그다음 날을 또 건너뛰고, 그러다 그만둔 줄도 모르게 그만둡니다. 그래서 무너진 다음 날 다시 앉는 사람이 이깁니다.',
  ],
];

export default function Home() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: '다시 시작하는 이야기',
        url: `${SITE}/`,
        inLanguage: 'ko-KR',
        description: DESC,
      },
      {
        '@type': 'Article',
        '@id': `${SITE}/#article`,
        headline: TITLE,
        description: DESC,
        inLanguage: 'ko-KR',
        articleSection: '성공 이야기',
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntityOfPage: `${SITE}/`,
        datePublished: '2026-08-19',
        dateModified: '2026-08-19',
        author: { '@type': 'Organization', name: '다시 시작하는 이야기' },
        publisher: { '@type': 'Organization', name: '다시 시작하는 이야기' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: `${SITE}/` }],
      },
    ],
  };

  return (
    <>
      <SEO
        title={TITLE}
        description={DESC}
        path="/"
        ogImage="/og/home.png"
        geoRegion="KR"
        geoPlacename="대한민국"
        siteName="다시 시작하는 이야기"
        ogAlt="다시 시작하는 이야기 성공스토리 안내"
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>

      <main id="main" className="story">
        <p className="st-kicker">읽는 데 8분 · 끝까지 읽을 각오가 된 사람만</p>
        <h1>
          다시 시작하는 데 필요한 건
          <br />
          <em>자신감이 아니었다</em>
        </h1>
        <p className="st-lead">
          이 글에는 대단한 사람이 나오지 않습니다. 서른아홉에 통장 잔액 11,200원을 확인하고, 편의점 앞
          플라스틱 의자에 앉아 두 시간 동안 일어나지 못했던 사람의 이야기입니다. 이 사람을 여기서는 K라고
          부르겠습니다.
        </p>
        <hr className="st-rule" />

        <section className="st-sec">
          <p className="st-num">01</p>
          <h2>새벽 4시 20분, 냉장고가 꺼지는 소리</h2>
          <p className="st-first">
            K가 기억하는 바닥은 장면이 아니라 소리로 남아 있습니다. 새벽 4시 20분, 반지하 방에서 냉장고
            돌아가는 소리가 뚝 끊기던 소리. 전기가 끊긴 게 아니라 마음이 먼저 끊겼다고 K는 말합니다.
          </p>
          <p>
            5년을 붙잡고 있던 가게는 그 두 달 전에 문을 닫았습니다. 권리금은 한 푼도 돌려받지 못했고, 마지막
            달 매출은 임대료의 절반이었습니다. 정리하고 남은 것은 계약 해지 서류 한 장과 4,200만 원의 빚,
            그리고 장마철에 곰팡이 냄새가 올라오는 보증금 300만 원짜리 방이었습니다.
          </p>
          <p>
            그 시기에 K가 가장 많이 한 말은 &ldquo;괜찮다&rdquo;였습니다. 전화를 받을 때마다, 안부를 물어올
            때마다 괜찮다고 했습니다. 괜찮지 않다는 걸 아는 사람은 K뿐이었고, 그래서 더 외로웠습니다.
          </p>
          <blockquote>
            바닥에 떨어진 사람에게 가장 무서운 건 빚이 아니라, 오늘 뭘 해야 할지 모르겠다는 감각입니다.
          </blockquote>
        </section>

        <section className="st-sec">
          <p className="st-num">02</p>
          <h2>400원짜리 노트에 적은 첫 문장</h2>
          <p className="st-first">
            그날 밤 K가 한 일은 딱 하나였습니다. 문구점에서 400원짜리 노트를 사서, 갚아야 할 돈을 전부
            적었습니다. 카드 1,880만 원, 지인에게 빌린 돈 1,200만 원, 마이너스 통장 820만 원, 남은 세금과
            공과금 300만 원. 다 적는 데 12분이 걸렸습니다.
          </p>
          <p>
            숫자를 다 적고 나서 K는 이상한 경험을 합니다. 두 달 동안 자신을 짓누르던 공포가, 종이 위에 올라온
            순간 조금 작아졌다는 겁니다. 4,200만 원은 무섭습니다. 그런데 그 아래에 이렇게 적었습니다.
            <b> 36개월로 나누면 한 달 117만 원, 하루 3만 8천 원.</b>
          </p>
          <p>
            하루 3만 8천 원은 무섭지 않았습니다. 무섭지 않은 크기가 되자, 그제야 손이 움직였습니다.
          </p>
          <blockquote>
            공포는 크기를 모를 때 가장 큽니다. 정확히 재는 순간, 공포는 계획으로 바뀝니다.
          </blockquote>
        </section>

        <section className="st-sec">
          <p className="st-num">03</p>
          <h2>하루를 90분 단위로 자른 사람</h2>
          <p className="st-first">
            다음 날부터 K의 하루는 이렇게 굳어집니다. 새벽 5시 40분 기상, 6시 30분 물류센터 상하차, 오후
            2시에 나와 라면 하나, 4시부터 10시까지 배달. 그리고 밤 10시부터 11시 30분까지 90분.
          </p>
          <p>
            이 90분이 전부였습니다. 몸이 부서질 것 같은 날에도 이 90분만은 지켰습니다. 대신 규칙을 하나
            뒀습니다. <b>기분이 어떻든 책상 앞에 앉기만 하면 그날은 성공으로 친다.</b> 아무것도 못 하고 30분을
            멍하게 앉아 있어도 달력에 동그라미를 쳤습니다.
          </p>
          <p>
            그 90분에 처음 3개월 동안 한 일은 초라합니다. 동네 가게 열두 곳의 메뉴판과 가격을 손으로 옮겨
            적고, 배달을 다니며 본 것들을 기록하고, 사장님들에게 &ldquo;요즘 뭐가 제일 힘드세요&rdquo;라고
            물었습니다. 대단한 사업 계획도, 인맥도 없었습니다. 그냥 매일 90분씩 세상을 관찰했습니다.
          </p>
          <p>
            여섯 달째, 노트는 세 권이 됐습니다. 그 안에는 K만 알고 있는 것이 쌓여 있었습니다. 어느 골목이
            비 오는 날 주문이 몰리는지, 어떤 가게가 왜 망하는지, 손님이 어떤 말에 지갑을 여는지.
          </p>
        </section>

        <section className="st-sec">
          <p className="st-num">04</p>
          <h2>아무도 박수 치지 않는 210일</h2>
          <p className="st-first">
            여기서부터가 이 글에서 가장 하고 싶은 이야기입니다. 7개월째, K에게는 여전히 아무 일도 일어나지
            않았습니다. 통장은 그대로였고, 빚은 예상보다 천천히 줄었고, 주변에서는 아무도 알아채지
            못했습니다.
          </p>
          <p>
            남들의 성공담은 보통 이 구간을 한 문장으로 처리합니다. <b>&ldquo;그렇게 준비를 이어 간 끝에.&rdquo;</b>{' '}
            그런데 실제로 그 한 문장은 210일입니다. 210번의 아침에 일어나야 하고, 210번의 밤에 아무 성과 없이
            책상 앞에 앉아야 합니다. 대부분은 여기서 그만둡니다. 실패해서 그만두는 게 아니라, 아무 일도
            일어나지 않아서 그만둡니다.
          </p>
          <blockquote>
            사람을 무너뜨리는 건 실패가 아니라, 아무도 결과를 확인해 주지 않는 시간의 길이입니다.
          </blockquote>
          <p>
            K는 이 구간을 이렇게 버텼습니다. 결과를 세지 않고 횟수를 셌습니다. 달력의 동그라미가 100개가 되던
            날, 스스로에게 5천 원짜리 커피를 사 줬다고 합니다. 그 커피 이야기를 할 때 K의 목소리가 잠깐
            흔들렸습니다.
          </p>
        </section>

        <section className="st-sec">
          <p className="st-num">05</p>
          <h2>혼자 일어선 사람은 없다</h2>
          <p className="st-first">
            K가 지금도 이름을 기억하는 사람이 셋 있습니다.
          </p>
          <p>
            물류센터 반장님은 새벽에 K의 손이 떨리는 걸 보고 말없이 컵라면 하나를 놓고 갔습니다. 사정을 묻지
            않았고, 위로도 하지 않았습니다. 그냥 매주 두 번씩 그렇게 했습니다.
          </p>
          <p>
            방 주인 아주머니는 월세가 두 달 밀렸을 때 &ldquo;나중에 여유 생기면 줘요&rdquo; 한마디로 넘어가
            줬습니다. K는 그 두 달을 갚은 뒤에도 명절마다 과일을 들고 갑니다.
          </p>
          <p>
            세 번째는 이름을 모르는 사람입니다. 나중에 K가 작게 시작한 일에 남겨진 리뷰 한 줄.
            &ldquo;사장님이 제 얘기를 끝까지 들어 주셨어요.&rdquo; K는 그 문장을 캡처해서 지금도 지갑에 넣고
            다닙니다.
          </p>
          <blockquote>
            혼자 일어선 사람은 없습니다. 다만 넘어져 있는 동안에도 사람에게 예의를 지킨 사람이 일어설 때 잡을
            손을 갖습니다.
          </blockquote>
        </section>

        <section className="st-sec">
          <p className="st-num">06</p>
          <h2>1,146일 뒤, 울지 않았던 이유</h2>
          <p className="st-first">
            빚을 전부 갚은 날은 시작한 지 1,146일째였습니다. 3년 하고 51일. K는 그날 울지 않았습니다. 마지막
            상환 버튼을 누르고 화면에 뜬 잔액은 2,140,000원. 앞에 마이너스가 붙지 않은 숫자를 3년 만에
            봤습니다.
          </p>
          <p>
            K가 지금 하는 일은 대단하지 않습니다. 직원 넷인 작은 가게 하나, 남들이 들으면 &ldquo;그
            정도야&rdquo; 할 규모입니다. 그런데 K는 이렇게 말합니다.
          </p>
          <blockquote>
            내가 되찾은 건 돈이 아니라, 내일을 계획해도 된다는 자격이었습니다.
          </blockquote>
          <p>
            그리고 한마디를 덧붙였습니다. &ldquo;다시 시작하는 데 필요한 건 자신감이 아니었어요. 자신감은 결과
            뒤에 오더라고요. 필요한 건 오늘 밤 90분과, 그걸 내일도 하는 것뿐이었습니다.&rdquo;
          </p>
        </section>

        <section className="st-sec">
          <p className="st-num">07</p>
          <h2>K가 노트 마지막 장에 적어 둔 여섯 줄</h2>
          <ol className="st-rules">
            {RULES.map(([t, d]) => (
              <li key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="st-sec st-end">
          <p className="st-num">08</p>
          <h2>그리고 지금 이 글을 읽고 있는 당신에게</h2>
          <p className="st-first">
            여기까지 읽었다면, 당신은 오늘 이미 남들이 하지 않는 일을 하나 했습니다. 끝까지 읽는 일. 사람들은
            3초 만에 넘기고, 5분을 못 견디고, 결국 아무것도 바꾸지 않습니다. 당신은 8분을 썼습니다.
          </p>
          <p>
            당신의 상황은 K와 다를 겁니다. 액수도 다르고, 나이도 다르고, 사정은 훨씬 복잡할 겁니다. 그래도
            구조는 같습니다. 무서운 건 언제나 크기를 모르는 것이고, 바꾸는 건 언제나 오늘 잘라 낸 시간이며,
            버티는 힘은 결과가 아니라 횟수에서 나옵니다.
          </p>
          <p>
            그러니 대단한 결심은 하지 않아도 됩니다. 오늘 밤, 종이 한 장을 펴고 숫자를 정확히 적으세요. 그리고
            내일 같은 시간에 90분만 다시 앉으세요. 그 두 가지를 210일 하면, 당신도 아무에게도 말하지 않은
            노트 세 권을 갖게 됩니다.
          </p>
          <p className="st-final">
            바닥은 끝이 아닙니다. 바닥은, 처음으로 발이 닿는 곳입니다.
          </p>
        </section>
      </main>

      <style jsx global>{`
        body {
          background: #f6f2ea;
          color: #221f1b;
          padding-bottom: 0;
        }
        .story {
          max-width: 700px;
          margin: 0 auto;
          padding: 46px 22px 90px;
          font-size: 18px;
          line-height: 1.95;
          letter-spacing: -0.25px;
          word-break: keep-all;
        }
        .st-kicker {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #a1795a;
          margin: 0 0 16px;
        }
        .story h1 {
          font-size: 42px;
          line-height: 1.3;
          font-weight: 900;
          letter-spacing: -1.6px;
          margin: 0 0 22px;
          color: #17150f;
        }
        .story h1 em {
          font-style: normal;
          color: #8a5a2b;
          box-shadow: inset 0 -14px 0 #f0e0c4;
        }
        .st-lead {
          font-size: 19px;
          color: #4b443a;
          margin: 0 0 28px;
        }
        .st-rule {
          border: 0;
          border-top: 2px solid #ddd0b8;
          margin: 0 0 8px;
        }
        .st-sec {
          margin: 52px 0 0;
        }
        .st-num {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #b99a72;
          margin: 0 0 6px;
        }
        .story h2 {
          font-size: 26px;
          line-height: 1.4;
          font-weight: 900;
          letter-spacing: -1px;
          margin: 0 0 18px;
          color: #17150f;
        }
        .story p {
          margin: 0 0 18px;
        }
        .story p b {
          font-weight: 800;
          color: #17150f;
        }
        .st-first::first-letter {
          font-size: 46px;
          font-weight: 900;
          float: left;
          line-height: 1;
          padding: 6px 10px 0 0;
          color: #8a5a2b;
        }
        .story blockquote {
          margin: 26px 0;
          padding: 18px 20px;
          background: #fffdf7;
          border-left: 5px solid #b9813c;
          border-radius: 0 6px 6px 0;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.8;
          color: #3a2c21;
          box-shadow: 2px 2px 0 #e6d9c1;
        }
        .st-rules {
          list-style: none;
          margin: 0;
          padding: 0;
          counter-reset: r;
        }
        .st-rules li {
          counter-increment: r;
          position: relative;
          padding: 18px 0 18px 46px;
          border-bottom: 1px solid #e2d7c3;
        }
        .st-rules li::before {
          content: counter(r);
          position: absolute;
          left: 0;
          top: 18px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
          background: #8a5a2b;
          color: #fff8ec;
          font-weight: 900;
          font-size: 14px;
        }
        .st-rules b {
          display: block;
          font-size: 19px;
          font-weight: 900;
          color: #17150f;
          margin: 0 0 6px;
          letter-spacing: -0.6px;
        }
        .st-rules span {
          color: #4b443a;
        }
        .st-final {
          margin: 30px 0 0;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.7;
          letter-spacing: -1px;
          color: #8a5a2b;
          text-align: center;
          padding: 26px 10px;
          border-top: 2px solid #ddd0b8;
          border-bottom: 2px solid #ddd0b8;
        }
        @media (max-width: 480px) {
          .story {
            font-size: 17px;
            padding: 34px 18px 70px;
          }
          .story h1 {
            font-size: 31px;
          }
          .story h2 {
            font-size: 22px;
          }
          .story blockquote {
            font-size: 17.5px;
          }
        }
      `}</style>
    </>
  );
}
