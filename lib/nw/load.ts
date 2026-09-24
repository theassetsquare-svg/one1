import fs from 'fs';
import path from 'path';
import type { NwModel } from '@/components/nw/NwPage';

/** [전부10 2026-09-25] 빌드 때만 읽는다(getStaticProps 안에서만 부른다) — 경로('/info/x/') → 모형 · 없으면 null */
let 모형들: Record<string, NwModel> | null = null;
export function nwModel(경로: string): NwModel | null {
  if (!모형들) 모형들 = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib', 'nw', 'pages.json'), 'utf8')) as Record<string, NwModel>;
  const k = 경로.endsWith('/') ? 경로 : 경로 + '/';
  return 모형들[k] || null;
}
