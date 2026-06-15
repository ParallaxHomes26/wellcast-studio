import { PRICE_IDS } from "./stripeClient";

export type SubscriptionTier =
  | "trialing"
  | "basic"
  | "starter"
  | "pro"
  | "founding_member"
  | "expired"
  | "canceled";

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
}

export function getSubscriptionTier(profile: Profile | null): SubscriptionTier {
  if (!profile) return "expired";

  if (profile.subscription_status === "trialing") {
    if (!profile.trial_ends_at) return "trialing";
    const trialEnd = new Date(profile.trial_ends_at);
    return trialEnd > new Date() ? "trialing" : "expired";
  }

  if (profile.founding_member && profile.subscription_status === "active") {
    return "founding_member";
  }

  if (profile.subscription_status === "active") {
    const priceId = profile.subscription_price_id ?? "";
    if ([PRICE_IDS.BASIC_MONTHLY, PRICE_IDS.BASIC_ANNUAL].includes(priceId as never)) return "basic";
    if ([PRICE_IDS.STARTER_MONTHLY, PRICE_IDS.STARTER_ANNUAL].includes(priceId as never)) return "starter";
    if ([PRICE_IDS.PRO_MONTHLY, PRICE_IDS.PRO_ANNUAL].includes(priceId as never)) return "pro";
    if (priceId === PRICE_IDS.FOUNDING_MEMBER) return "founding_member";
  }

  if (profile.subscription_status === "canceled") return "canceled";

  return "expired";
}

export function getRunLimit(tier: SubscriptionTier): number | "unlimited" {
  switch (tier) {
    case "trialing":       return 3;
    case "basic":          return 2;
    case "starter":        return 4;
    case "pro":            return "unlimited";
    case "founding_member": return "unlimited";
    default:               return 0;
  }
}

export function canRunGeneration(profile: Profile | null): { allowed: boolean; reason?: string } {
  const tier = getSubscriptionTier(profile);
  const limit = getRunLimit(tier);

  if (tier === "expired") {
    return { allowed: false, reason: "Your trial has ended. Please subscribe to continue." };
  }
  if (tier === "canceled") {
    return { allowed: false, reason: "Your subscription has been canceled. Please resubscribe to continue." };
  }

  if (limit === "unlimited") return { allowed: true };

  const used = profile?.run_count_this_month ?? 0;
  if (used >= limit) {
    return {
      allowed: false,
      reason: `You've used all ${limit} runs this month. Upgrade to get more.`,
    };
  }

  return { allowed: true };
}

export function trialDaysRemaining(profile: Profile | null): number {
  if (!profile?.trial_ends_at) return 0;
  const diff = new Date(profile.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
