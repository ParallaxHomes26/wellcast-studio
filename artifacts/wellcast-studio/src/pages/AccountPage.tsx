import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { getSubscriptionTier, tierLabel, trialDaysRemaining, getRunLimit } from "@/lib/subscription";

function StatusBadge({ status }: { status: string | null | undefined }) {
  const s = status ?? "unknown";
  const map: Record<string, { label: string; bg: string; color: string }> = {
    active:   { label: "Active",    bg: "#526056/10", color: "#526056" },
    trialing: { label: "Trialing",  bg: "#897866/10", color: "#897866" },
    past_due: { label: "Past Due",  bg: "#dc2626/10", color: "#dc2626" },
    canceled: { label: "Canceled",  bg: "#6b7280/10", color: "#6b7280" },
    unknown:  { label: "No Plan",   bg: "#6b7280/10", color: "#6b7280" },
  };
  const cfg = map[s] ?? map.unknown;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[12px] font-medium"
      style={{ background: `hsl(from ${cfg.color} h s l / 0.12)`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export default function AccountPage() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [portalLoading, setPortalLoading] = useState(false);

  const tier = getSubscriptionTier(profile);
  const daysLeft = trialDaysRemaining(profile);
  const runLimit = getRunLimit(tier);
  const runsUsed = profile?.run_count_this_month ?? 0;

  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1, 1);

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
            <StatusBadge status={profile?.subscription_status} />
          </div>

          {loading ? (
            <div className="h-16 bg-background rounded-lg animate-pulse" />
          ) : (
            <div className="space-y-5">
              <div className="bg-background rounded-lg border border-border p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-[15px] text-foreground">
                      Wellcast {tierLabel(tier)}
                    </p>
                    {tier === "trialing" && (
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </p>
                    )}
                    {profile?.current_period_end && tier !== "trialing" && (
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Current period ends {new Date(profile.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="text-[13px] text-muted-foreground">
                    {runLimit === "unlimited" ? "Unlimited runs" : `${runsUsed} / ${runLimit} runs`}
                  </span>
                </div>

                {/* Run usage bar */}
                {runLimit !== "unlimited" && (
                  <div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (runsUsed / (runLimit as number)) * 100)}%`,
                          background: runsUsed >= (runLimit as number) ? "#dc2626" : "#526056",
                        }}
                      />
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-1">
                      Resets on {resetDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </p>
                  </div>
                )}
              </div>

              {/* Upgrade nudge */}
              {(tier === "trialing" || tier === "basic" || tier === "starter") && (
                <div className="bg-background border border-border rounded-lg p-4">
                  <p className="text-[14px] font-medium text-foreground mb-1">Upgrade your plan</p>
                  <p className="text-[13px] text-muted-foreground mb-3">
                    Get more runs and unlock premium features.
                  </p>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-border text-[13px]">
                      View plans
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={openBillingPortal}
                  disabled={portalLoading || !profile?.stripe_customer_id}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {portalLoading ? "Loading…" : "Manage Billing"}
                </Button>
              </div>
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
