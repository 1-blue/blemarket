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
};

module.exports = nextConfig;
