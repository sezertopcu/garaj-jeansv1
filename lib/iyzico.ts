export const iyzicoConfig = {
  apiKey: process.env.IYZICO_API_KEY || "",
  secretKey: process.env.IYZICO_SECRET_KEY || "",
  baseUrl:
    process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
};

export function isIyzicoConfigured(): boolean {
  return Boolean(iyzicoConfig.apiKey && iyzicoConfig.secretKey);
}