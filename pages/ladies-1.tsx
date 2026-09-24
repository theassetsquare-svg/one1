import type { GetStaticProps } from 'next';
import NwPage, { type NwModel } from '@/components/nw/NwPage';

/** [전부10 2026-09-25] 이 쪽의 글 · 사실 표 · 직답 · FAQ · 한 줄 정리 · JSON-LD 는 lib/nw/pages.json 의 '/ladies-1/' 모형에서 온다(사실은 data/shops verified 값만). */
export default function Page({ model }: { model: NwModel }) {
  return <NwPage model={model} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const { nwModel } = await import('@/lib/nw/load');
  const model = nwModel('/ladies-1/');
  if (!model) throw new Error('lib/nw/pages.json 에 /ladies-1/ 모형이 없다');
  return { props: { model } };
};
