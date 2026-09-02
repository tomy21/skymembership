import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["apimembershipservice.skyparking.online"],
  },

  turbopack: {
    // Biarkan kosong untuk menggunakan default atau migrasi perlahan
  },

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
};

export default nextConfig;
