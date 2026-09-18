import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ["iyzipay", "postman-request"],

  outputFileTracingIncludes: {
    "/api/iyzico/initialize": [
      "./node_modules/iyzipay/**/*",
      "./node_modules/postman-request/**/*",
    ],
    "/api/iyzico/callback": [
      "./node_modules/iyzipay/**/*",
      "./node_modules/postman-request/**/*",
    ],
  },
};

export default nextConfig;