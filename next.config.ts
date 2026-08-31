import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,   /* 네이버 색인 주소가 슬래시형 — 정본을 슬래시로 */
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
