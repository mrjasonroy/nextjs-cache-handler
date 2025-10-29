import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheHandler: require.resolve("./cache-handler.mjs"),
  cacheMaxMemorySize: 0, // disable default in-memory caching
  cacheComponents: true, // Enable Cache Components for Next.js 16
  experimental: {
    //ppr: "incremental",
  },
};

export default nextConfig;
