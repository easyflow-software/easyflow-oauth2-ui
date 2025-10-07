import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.BASE_URL ?? ""],
    },
  },
};

export default nextConfig;
