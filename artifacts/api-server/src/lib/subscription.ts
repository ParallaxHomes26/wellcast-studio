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

function tierFromPriceId(priceId: string | null | undefined, foundingMember: boolean | null | undefined): SubscriptionTier {
  if (foundingMember) return "founding_member";
  if (!priceId) return "expired";
  if (priceId === PRICE_IDS.FOUNDING_MEMBER) return "founding_member";
  if ([PRICE_IDS.BASIC_MONTHLY, PRICE_IDS.BASIC_ANNUAL].includes(priceId as never)) return "basic";
  if ([PRICE_IDS.STARTER_MONTHLY, PRICE_IDS.STARTER_ANNUAL].includes(priceId as never)) return "starter";
  if ([PRICE_IDS.PRO_MONTHLY, PRICE_IDS.PRO_ANNUAL].includes(priceId as never)) return "pro";
  return "expired";
}

export function getSubscriptionTier(profile: Profile | null): SubscriptionTier {
  if (!profile) return "expired";

  const status = profile.subscription_status;

  // User has gone through Stripe checkout (has a subscription ID + price ID).
  // During a paid trial Stripe sets status = "trialing" — we still resolve
  // the tier from their price so they get full access.
  if (profile.stripe_subscription_id && profile.subscription_price_id) {
    if (status === "canceled") return "canceled";
    if (status === "active" || status === "trialing") {
      return tierFromPriceId(profile.subscription_price_id, profile.founding_member);
    }
    // past_due, unpaid, etc. — still return the tier so they can see the UI
    if (status === "past_due" || status === "unpaid") {
      return tierFromPriceId(profile.subscription_price_id, profile.founding_member);
    }
    return "expired";
  }

  // Free trial — no Stripe subscription yet
  if (!status || status === "trialing") {
    if (!profile.trial_ends_at) return "trialing";
    const trialEnd = new Date(profile.trial_ends_at);
    return trialEnd > new Date() ? "trialing" : "expired";
  }

  // Legacy / direct "active" without subscription_id recorded
  if (status === "active") {
    return tierFromPriceId(profile.subscription_price_id, profile.founding_member);
  }

  if (status === "canceled") return "canceled";
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

export function canRunGeneration(profile: any): { allowed: boolean; reason?: string } {
  if (!profile) return { allowed: false, reason: "Please sign in." };

  const tier = getSubscriptionTier(profile);
  const limit = getRunLimit(tier);

  if (limit === 0) {
    return {
      allowed: false,
      reason: "Your trial has ended. Please subscribe to continue generating content.",
    };
  }

  if (limit === "unlimited") {
    return { allowed: true };
  }

  const used = profile.run_count_this_month ?? 0;
  if (used >= limit) {
    return {
      allowed: false,
      reason: "You have used all generations for this month. Upgrade your plan to generate more.",
    };
  }

  return { allowed: true };
}

export function trialDaysRemaining(profile: Profile | null): number {
  if (!profile?.trial_ends_at) return 0;
  const diff = new Date(profile.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
