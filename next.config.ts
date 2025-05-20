import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_URL_USERS) {
      throw new Error("API_URL environment variable is not defined");
    }
    return [
      {
        source: "/proxy/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL_USERS}/v1/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
