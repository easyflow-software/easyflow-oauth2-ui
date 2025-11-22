import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      allowedOrigins: [process.env.BASE_URL ?? ""],
    },
  },
};

export default nextConfig;
