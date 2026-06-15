export type SubscriptionTier =
  | "trialing"
  | "basic"
  | "starter"
  | "pro"
  | "founding_member"
  | "expired"
  | "canceled";

export const PRICE_IDS = {
  BASIC_MONTHLY:    "price_1Ticc72Zpe8a4y2Maiz2kAz4",
  STARTER_MONTHLY:  "price_1TiccK2Zpe8a4y2MCuAi0rWt",
  PRO_MONTHLY:      "price_1TiccX2Zpe8a4y2MUYJntCer",
  FOUNDING_MEMBER:  "price_1Ticck2Zpe8a4y2MUYLPrHGI",
  BASIC_ANNUAL:     "price_1TicdX2Zpe8a4y2MFC1Eyahf",
  STARTER_ANNUAL:   "price_1Ticdn2Zpe8a4y2Mlymy9XFE",
  PRO_ANNUAL:       "price_1Tice32Zpe8a4y2M6VlwtdKV",
} as const;

export interface Profile {
  id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_price_id?: string | null;
  current_period_end?: string | null;
  founding_member?: boolean | null;
  trial_ends_at?: string | null;
  run_count_this_month?: number | null;
  run_count_reset_at?: string | null;
  email?: string | null;
  full_name?: string | null;
}

export function getSubscriptionTier(profile: Profile | null): SubscriptionTier {
  // If profile is null (e.g. fetch failed due to RLS), fail open as trialing
  if (!profile) return "trialing";

  // Null/missing status → treat as trialing (new accounts before trigger fires)
  if (!profile.subscription_status || profile.subscription_status === "trialing") {
    if (!profile.trial_ends_at) return "trialing"; // no end date = grace period
    return new Date(profile.trial_ends_at) > new Date() ? "trialing" : "expired";
  }

  if (profile.founding_member && profile.subscription_status === "active") return "founding_member";

  if (profile.subscription_status === "active") {
    const p = profile.subscription_price_id ?? "";
    if ([PRICE_IDS.BASIC_MONTHLY, PRICE_IDS.BASIC_ANNUAL].includes(p as never)) return "basic";
    if ([PRICE_IDS.STARTER_MONTHLY, PRICE_IDS.STARTER_ANNUAL].includes(p as never)) return "starter";
    if ([PRICE_IDS.PRO_MONTHLY, PRICE_IDS.PRO_ANNUAL].includes(p as never)) return "pro";
    if (p === PRICE_IDS.FOUNDING_MEMBER) return "founding_member";
  }

  if (profile.subscription_status === "canceled") return "canceled";
  return "expired";
}

export function getRunLimit(tier: SubscriptionTier): number | "unlimited" {
  switch (tier) {
    case "trialing":        return 3;
    case "basic":           return 2;
    case "starter":         return 4;
    case "pro":             return "unlimited";
    case "founding_member": return "unlimited";
    default:                return 0;
  }
}

export function tierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case "trialing":        return "Trial";
    case "basic":           return "Basic";
    case "starter":         return "Starter";
    case "pro":             return "Pro";
    case "founding_member": return "Founding Member";
    case "expired":         return "Expired";
    case "canceled":        return "Canceled";
  }
}

function getTrialDaysRemaining(trialEndsAt: string): number {
  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  const diffMs = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function trialDaysRemaining(profile: Profile | null): number {
  if (!profile?.trial_ends_at) return 0;
  return getTrialDaysRemaining(profile.trial_ends_at);
}

export function canRunGeneration(profile: Profile | null): { allowed: boolean; reason?: string } {
  const tier = getSubscriptionTier(profile);
  const limit = getRunLimit(tier);

  // Explicit trialing check: allow on day 0, block only when strictly past end
  if (profile?.subscription_status === "trialing" || tier === "trialing") {
    if (!profile?.trial_ends_at) return { allowed: true };
    const daysLeft = getTrialDaysRemaining(profile.trial_ends_at);
    if (daysLeft >= 0) return { allowed: true };
    return { allowed: false, reason: "Your trial has ended. Choose a plan to continue." };
  }

  if (tier === "expired") return { allowed: false, reason: "Your trial has ended. Please choose a plan to continue." };
  if (tier === "canceled") return { allowed: false, reason: "Your subscription has been canceled. Please resubscribe." };
  if (limit === "unlimited") return { allowed: true };

  const used = profile?.run_count_this_month ?? 0;
  if (used >= limit) {
    return { allowed: false, reason: `You've used all ${limit} runs this month. Upgrade to get more.` };
  }
  return { allowed: true };
}
