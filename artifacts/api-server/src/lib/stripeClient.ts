import Stripe from "stripe";
import { logger } from "./logger";

export const PRICE_IDS = {
  BASIC_MONTHLY:    "price_1TjSgPF156FzNQDF9bcVsX6f",
  STARTER_MONTHLY:  "price_1TjSgxF156FzNQDFONqDK2No",
  PRO_MONTHLY:      "price_1TjShMF156FzNQDFUpE8iDQh",
  FOUNDING_MEMBER:  "price_1TjShoF156FzNQDFUTwKcY07",
  BASIC_ANNUAL:     "price_1TjSidF156FzNQDFITPhzSD3",
  STARTER_ANNUAL:   "price_1TjSj8F156FzNQDFrBPIhfxO",
  PRO_ANNUAL:       "price_1TjSjeF156FzNQDFOq8mvAJS",
} as const;

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(key);
  return _stripe;
}

export function getAppUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) return `https://${domains.split(",")[0]}`;
  return "http://localhost:5173";
}

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn("STRIPE_SECRET_KEY is not set — Stripe routes will fail at call time");
}
