const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true,
  },
  webpack(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@src": path.resolve(__dirname, "src"),
        },
      },
    };
  },
  images: {
    domains: ["blemarket.s3.ap-northeast-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
