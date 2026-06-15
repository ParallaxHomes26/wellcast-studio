import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

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
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-[15px] text-foreground">
                      {profile?.subscription_status === "active" ? "Active plan" : "Free trial"}
                    </p>
                    {profile?.current_period_end && (
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Current period ends {new Date(profile.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

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
