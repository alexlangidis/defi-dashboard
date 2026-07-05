import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "icons.llamao.fi",
      },
      {
        protocol: "https",
        hostname: "assets.geckoterminal.com",
      },
    ],
  },
};

export default nextConfig;
