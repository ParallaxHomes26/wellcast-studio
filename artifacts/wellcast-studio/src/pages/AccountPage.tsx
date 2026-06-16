import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/lib/subscription";

// Mirror of the backend PRICE_IDS — kept in sync manually
const PLAN_NAMES: Record<string, string> = {
  price_1Ticc72Zpe8a4y2Maiz2kAz4: "Basic (Monthly)",
  price_1TicdX2Zpe8a4y2MFC1Eyahf: "Basic (Annual)",
  price_1TiccK2Zpe8a4y2MCuAi0rWt: "Starter (Monthly)",
  price_1Ticdn2Zpe8a4y2Mlymy9XFE: "Starter (Annual)",
  price_1TiccX2Zpe8a4y2MUYJntCer: "Pro (Monthly)",
  price_1Tice32Zpe8a4y2M6VlwtdKV: "Pro (Annual)",
  price_1Ticck2Zpe8a4y2MUYLPrHGI: "Founding Member",
};

function getPlanName(profile: Profile | null): string {
  if (!profile) return "—";
  if (profile.founding_member) return "Founding Member";
  if (profile.subscription_price_id && PLAN_NAMES[profile.subscription_price_id]) {
    return PLAN_NAMES[profile.subscription_price_id];
  }
  return "Free Trial";
}

function getPlanStatusLabel(profile: Profile | null): { label: string; icon: React.ReactElement; color: string } {
  if (!profile) return { label: "Unknown", icon: <Clock className="h-3.5 w-3.5" />, color: "text-muted-foreground" };

  const status = profile.subscription_status;
  const hasPaidSub = !!(profile.stripe_subscription_id && profile.subscription_price_id);

  if (hasPaidSub && (status === "active")) {
    return { label: "Active", icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-green-600" };
  }
  if (hasPaidSub && status === "trialing") {
    return { label: "In Trial", icon: <Clock className="h-3.5 w-3.5" />, color: "text-blue-600" };
  }
  if (hasPaidSub && status === "past_due") {
    return { label: "Past Due", icon: <AlertCircle className="h-3.5 w-3.5" />, color: "text-amber-600" };
  }
  if (status === "canceled") {
    return { label: "Canceled", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-destructive" };
  }
  if (!status || status === "trialing") {
    if (profile.trial_ends_at && new Date(profile.trial_ends_at) > new Date()) {
      const days = Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return { label: `${days}d remaining`, icon: <Clock className="h-3.5 w-3.5" />, color: "text-muted-foreground" };
    }
    return { label: "Trial ended", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-destructive" };
  }
  return { label: "Inactive", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-muted-foreground" };
}

export default function AccountPage() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [portalLoading, setPortalLoading] = useState(false);

  const openBillingPortal = async () => {
    if (!user) return;
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Billing portal error:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  const planName = getPlanName(profile);
  const planStatus = getPlanStatusLabel(profile);
  const hasPaidSub = !!(profile?.stripe_subscription_id && profile?.subscription_price_id);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-foreground mb-2">Account Settings</h1>
        <p className="text-[15px] text-muted-foreground">
          Manage your profile, subscription, and billing preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-[18px] font-medium text-foreground mb-4">Profile</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[12px] text-muted-foreground mb-1 uppercase tracking-wide">Email</p>
              <p className="text-[15px] text-foreground">{user?.email ?? "—"}</p>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[18px] font-medium text-foreground">Subscription</h2>
          </div>

          {loading ? (
            <div className="h-16 bg-background rounded-lg animate-pulse" />
          ) : (
            <div className="space-y-5">
              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[16px] text-foreground">{planName}</p>
                    {profile?.current_period_end && hasPaidSub && (
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Renews {new Date(profile.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                    {!hasPaidSub && profile?.trial_ends_at && (
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Trial ends {new Date(profile.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1 text-[12px] font-medium ${planStatus.color}`}>
                    {planStatus.icon}
                    {planStatus.label}
                  </span>
                </div>
              </div>

              {!hasPaidSub && (
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-[14px] font-medium text-foreground mb-1">Upgrade your plan</p>
                  <p className="text-[13px] text-muted-foreground mb-3">
                    Get more runs and unlock premium features.
                  </p>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-border text-[13px]">
                      View plans →
                    </Button>
                  </Link>
                </div>
              )}

              {hasPaidSub && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={openBillingPortal}
                    disabled={portalLoading || !profile?.stripe_customer_id}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {portalLoading ? "Loading…" : "Manage Billing"}
                  </Button>
                  <Link href="/pricing">
                    <Button variant="ghost" className="text-[13px] text-muted-foreground">
                      Change plan
                    </Button>
                  </Link>
                </div>
              )}

              {!hasPaidSub && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={openBillingPortal}
                    disabled={portalLoading || !profile?.stripe_customer_id}
                    className="text-muted-foreground"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {portalLoading ? "Loading…" : "Manage Billing"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="border border-destructive/20 rounded-xl p-6 bg-destructive/5">
          <h2 className="text-[18px] font-medium text-destructive mb-2 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" /> Danger Zone
          </h2>
          <p className="text-[14px] text-muted-foreground mb-4">
            Permanently delete your account and all generated episode runs. This action cannot be undone.
          </p>
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            Delete Account
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
}
