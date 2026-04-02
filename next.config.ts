import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/test',
        destination: '/',
        permanent: false,
      },
      {
        source: '/gratis',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
