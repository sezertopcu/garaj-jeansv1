import Iyzipay from "iyzipay";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable tanımlı değil.`);
  }

  return value;
}

export function getIyzico() {
  const apiKey = getRequiredEnv("IYZICO_API_KEY");
  const secretKey = getRequiredEnv("IYZICO_SECRET_KEY");
  const uri =
    process.env.IYZICO_URI?.trim() || "https://api.iyzipay.com";

  return new Iyzipay({
    apiKey,
    secretKey,
    uri,
  });
}

export function isIyzicoConfigured(): boolean {
  return Boolean(
    process.env.IYZICO_API_KEY &&
      process.env.IYZICO_SECRET_KEY &&
      process.env.IYZICO_URI
  );
}

export { Iyzipay };