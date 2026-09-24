import { useThumb } from '@/lib/thumb';
/** 본문 썸네일 — og:image와 반드시 같은 파일을 실제 이미지로 노출한다.
 *  네이버가 본문 이미지를 대표 썸네일 후보로 삼기 때문에 직답 박스(h1) 바로 아래에 둔다. */
type Props = {
  /** /og/*.png 결코 경로 (og:image와 동일 파일) */
  src: string;
  /** 가게이름 + 페이지 주제 */
  alt: string;
};

export default function Thumb({ src: src0, alt: alt0 }: Props) {
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 — og 와 같은 파일 */
  if (표 && 표.ogOnly) return null;
  const src = 표 ? 표.file : src0; const alt = 표 ? 표.alt : alt0;
  return (
    <div className="thumb-wrap">
      <img
        src={src}
        alt={alt}
        width={1200}
        height={1200}
        style={{ maxWidth: '100%', height: 'auto' }}
        loading="eager"
      />
    </div>
  );
}
