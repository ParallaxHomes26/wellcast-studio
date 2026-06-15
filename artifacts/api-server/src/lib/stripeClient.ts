import Stripe from "stripe";
import { logger } from "./logger";

export const PRICE_IDS = {
  BASIC_MONTHLY:    "price_1Ticc72Zpe8a4y2Maiz2kAz4",
  STARTER_MONTHLY:  "price_1TiccK2Zpe8a4y2MCuAi0rWt",
  PRO_MONTHLY:      "price_1TiccX2Zpe8a4y2MUYJntCer",
  FOUNDING_MEMBER:  "price_1Ticck2Zpe8a4y2MUYLPrHGI",
  BASIC_ANNUAL:     "price_1TicdX2Zpe8a4y2MFC1Eyahf",
  STARTER_ANNUAL:   "price_1Ticdn2Zpe8a4y2Mlymy9XFE",
  PRO_ANNUAL:       "price_1Tice32Zpe8a4y2M6VlwtdKV",
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

// Log warning at startup without crashing
if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn("STRIPE_SECRET_KEY is not set — Stripe routes will fail at call time");
}
