import type { NextConfig } from "next";

// 开发环境下，若处于企业代理（自签名证书链）网络，Node 会拒绝 Notion API 的 TLS 证书。
// 这里仅在开发模式放宽证书校验，避免 "self-signed certificate in certificate chain" 报错。
// 注意：生产环境（NODE_ENV=production）不会执行此逻辑，保证部署安全。
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  images: {
    // 允许加载 Notion 托管的图片域名（封面/正文图片）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.notion.so",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
