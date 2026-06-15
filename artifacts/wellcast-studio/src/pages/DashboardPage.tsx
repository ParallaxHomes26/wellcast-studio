import { useEffect, useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileAudio, AlertTriangle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import {
  getSubscriptionTier,
  tierLabel,
  getRunLimit,
} from "@/lib/subscription";
import { supabase } from "@/lib/supabase";

interface EpisodeRun {
  id: string;
  episode_title: string;
  health_niche: string;
  created_at: string;
  status: string;
}

function PlanPill({ tier, daysLeft }: { tier: string; daysLeft: number }) {
  if (tier === "trialing") {
    return (
      <span className="px-3 py-1 text-[12px] font-medium rounded-full border" style={{ background: "#FEF3C7", color: "#92400E", borderColor: "#FDE68A" }}>
        Trial — {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
      </span>
    );
  }
  if (tier === "expired" || tier === "canceled") {
    return (
      <span className="px-3 py-1 text-[12px] font-medium rounded-full border" style={{ background: "#FEE2E2", color: "#991B1B", borderColor: "#FECACA" }}>
        {tier === "expired" ? "Trial Ended" : "Canceled"}
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-accent/10 text-accent text-[12px] font-medium rounded-full border border-accent/20">
      {tierLabel(tier as Parameters<typeof tierLabel>[0])}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [runs, setRuns] = useState<EpisodeRun[]>([]);
  const [runsLoading, setRunsLoading] = useState(true);

  const tier = getSubscriptionTier(profile);
  const daysLeft = (() => {
    if (!profile?.trial_ends_at) return 0;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    const msLeft = trialEnd.getTime() - now.getTime();
    const days = Math.ceil(msLeft / 86400000);
    return days < 0 ? 0 : days;
  })();
  const runLimit = getRunLimit(tier);
  const runsUsed = profile?.run_count_this_month ?? 0;
  const limitReached = runLimit !== "unlimited" && runsUsed >= (runLimit as number);

  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1, 1);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("episode_runs")
      .select("id, episode_title, health_niche, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRuns((data as EpisodeRun[]) ?? []);
        setRunsLoading(false);
      });
  }, [user]);

  return (
    <DashboardLayout>
      {/* Trial expiry warning (≤2 days) */}
      {tier === "trialing" && daysLeft <= 2 && (
        <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-[14px] text-amber-800">
            Your free trial ends in <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}</strong>. Choose a plan to keep access to your episode runs.{" "}
            <Link href="/pricing">
              <span className="font-medium underline cursor-pointer">View plans →</span>
            </Link>
          </div>
        </div>
      )}

      {/* Expired banner */}
      {(tier === "expired" || tier === "canceled") && (
        <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-[14px] text-red-800">
            {tier === "expired"
              ? "Your trial has ended — choose a plan to continue."
              : "Your subscription has been canceled."}{" "}
            <Link href="/pricing">
              <span className="font-medium underline cursor-pointer">View plans →</span>
            </Link>
          </div>
        </div>
      )}

      {/* Run limit reached banner */}
      {limitReached && tier !== "expired" && tier !== "canceled" && (
        <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[14px] text-amber-800">
            You've used all {runLimit} runs this month. Resets {resetDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}.{" "}
            <Link href="/pricing">
              <span className="font-medium underline cursor-pointer">Upgrade for more →</span>
            </Link>
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-3">
          <PlanPill tier={tier} daysLeft={daysLeft} />
          {tier === "trialing" && (
            <Link href="/pricing">
              <Button variant="outline" className="text-[13px] border-border">Upgrade</Button>
            </Link>
          )}
          <Link href="/new-run">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              disabled={tier === "expired" || tier === "canceled" || limitReached}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New episode run
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <section id="history">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-medium text-foreground">Recent Episodes</h2>
            {runLimit !== "unlimited" && (
              <span className="text-[13px] text-muted-foreground">
                {runsUsed} of {runLimit} runs used this month
              </span>
            )}
          </div>

          {runsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : runs.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                <FileAudio className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-[16px] font-medium text-foreground mb-2">No runs yet</h3>
              <p className="text-[14px] text-muted-foreground max-w-sm mb-6">
                Start your first episode run to generate 26 content assets automatically from your transcript or URL.
              </p>
              <Link href="/new-run">
                <Button variant="outline" className="border-border hover:bg-secondary/50">
                  Start your first run
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <Link key={run.id} href={`/run/${run.id}`}>
                  <div className="bg-card border border-border rounded-xl px-5 py-4 hover:border-accent/40 transition-colors cursor-pointer flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-medium text-foreground">{run.episode_title}</p>
                      <p className="text-[13px] text-muted-foreground mt-0.5">{run.health_niche}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-[12px] text-muted-foreground">
                        {new Date(run.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
