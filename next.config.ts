import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ["iyzipay"],
};

export default nextConfig;