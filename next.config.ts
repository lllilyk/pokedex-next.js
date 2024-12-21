import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ['raw.githubusercontent.com'], // Pokemon API 이미지 도메인
  },
}
export default nextConfig;
