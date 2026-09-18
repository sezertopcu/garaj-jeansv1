import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ["iyzipay"],

  outputFileTracingIncludes: {
    "/api/iyzico/initialize": [
      "./node_modules/iyzipay/lib/**/*",
    ],
    "/api/iyzico/callback": [
      "./node_modules/iyzipay/lib/**/*",
    ],
  },
};

export default nextConfig;