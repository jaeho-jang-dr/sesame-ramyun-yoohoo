import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Pin the workspace root to this project to silence the multiple-lockfile warning
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
