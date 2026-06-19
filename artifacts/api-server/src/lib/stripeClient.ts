import Stripe from "stripe";
import { logger } from "./logger";

export const PRICE_IDS = {
  BASIC_MONTHLY:    "price_1TibHO2Zpe8a4y2MgNN4wVrI",
  STARTER_MONTHLY:  "price_1TibHw2Zpe8a4y2MouaBgTQW",
  PRO_MONTHLY:      "price_1TibIO2Zpe8a4y2MW1yIg27S",
  FOUNDING_MEMBER:  "price_1TibKD2Zpe8a4y2MLI3ii0KD",
  BASIC_ANNUAL:     "price_1TibL22Zpe8a4y2MWJx4WYFY",
  STARTER_ANNUAL:   "price_1TibLg2Zpe8a4y2M2MWuaYjV",
  PRO_ANNUAL:       "price_1TibM02Zpe8a4y2MiKl4WaI5",
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
