/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 開発・本番共に推奨
  swcMinify: true,       // SWCによるビルド高速化
  images: {
    domains: ['your-image-domain.com'], // 外部画像のURLドメインを追加
  },
  experimental: {
    turbo: false, // Turbopack を明示的に無効化（安定性重視）
    serverActions: true, // 使用している場合に有効化
  },
};

module.exports = nextConfig;
