import { useState } from "react";
import { Link, useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EpisodeInputBar from "@/components/input/EpisodeInputBar";
import GeneratingScreen from "@/components/ui/GeneratingScreen";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { getSubscriptionTier, getRunLimit, trialDaysRemaining, canRunGeneration } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function NewRunPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [, setLocation] = useLocation();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const tier = getSubscriptionTier(profile);
  const runLimit = getRunLimit(tier);
  const runsUsed = profile?.run_count_this_month ?? 0;
  const daysLeft = trialDaysRemaining(profile);
  const { allowed, reason } = canRunGeneration(profile);

  const handleGenerate = async (
    inputMethod: "transcript" | "details" | "url",
    inputData: Record<string, unknown>,
    cta: string
  ) => {
    if (!user) return;
    setError("");
    setGenerating(true);

    try {
      // Step 1 — extract brief
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_method: inputMethod === "details" ? "manual" : inputMethod,
          ...(inputMethod === "transcript" && { transcript: inputData.transcript as string }),
          ...(inputMethod === "details" && { manual_brief: inputData }),
          ...(inputMethod === "url" && { url: inputData.url as string }),
          cta,
        }),
      });

      if (!extractRes.ok) {
        const body = await extractRes.json().catch(() => ({ error: "Extraction failed" })) as { error?: string };
        throw new Error(body.error ?? "Extraction failed");
      }

      const brief = await extractRes.json();

      // Step 2 — generate all assets
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episode_brief: brief,
          cta,
          user_id: user.id,
          input_method: inputMethod === "details" ? "manual" : inputMethod,
        }),
      });

      if (!generateRes.ok) {
        const body = await generateRes.json().catch(() => ({ error: "Generation failed" })) as { error?: string };
        throw new Error(body.error ?? "Generation failed");
      }

      const result = await generateRes.json() as { run_id: string; assets: unknown };

      const episodeTitle =
        (brief as Record<string, unknown>)["core_topic"] as string
        ?? (brief as Record<string, unknown>)["show_name"] as string
        ?? "Untitled Episode";

      try {
        sessionStorage.setItem(
          `wellcast_run_${result.run_id}`,
          JSON.stringify({ run_id: result.run_id, episode_title: episodeTitle, assets: result.assets })
        );
      } catch {
        // sessionStorage unavailable — RunDetailPage will fall back to API
      }

      setLocation(`/run/${result.run_id}`);
    } catch (err) {
      setGenerating(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (generating) return <GeneratingScreen />;

  // Profile still loading — show skeleton
  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-[720px] mx-auto">
          <div className="h-8 w-48 bg-card rounded animate-pulse mb-4" />
          <div className="h-64 bg-card rounded-xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  // Expired / canceled — upgrade prompt
  if (!allowed && (tier === "expired" || tier === "canceled")) {
    return (
      <DashboardLayout>
        <div className="max-w-[600px] mx-auto text-center py-16">
          <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#526056/10", backgroundColor: "rgba(82,96,86,0.08)" }}>
            <Lock className="h-6 w-6" style={{ color: "#526056" }} />
          </div>
          <h2 className="text-[22px] font-medium text-foreground mb-3">
            {tier === "expired" ? "Your trial has ended" : "Your subscription has been canceled"}
          </h2>
          <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
            {reason}
          </p>
          <Link href="/pricing">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8">
              View plans
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Run limit reached
  if (!allowed) {
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1, 1);
    return (
      <DashboardLayout>
        <div className="max-w-[600px] mx-auto text-center py-16">
          <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(82,96,86,0.08)" }}>
            <Lock className="h-6 w-6" style={{ color: "#526056" }} />
          </div>
          <h2 className="text-[22px] font-medium text-foreground mb-3">Monthly limit reached</h2>
          <p className="text-[15px] text-muted-foreground mb-2">{reason}</p>
          <p className="text-[14px] text-muted-foreground mb-8">
            Resets on {resetDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}.
          </p>
          <Link href="/pricing">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8">
              Upgrade plan
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const showRunsRemaining = runLimit !== "unlimited";

  return (
    <DashboardLayout>
      <div className="max-w-[720px] mx-auto">
        <div className="mb-8">
          <h1
            className="text-[22px] font-medium text-foreground mb-1"
            data-testid="text-page-title"
          >
            New episode run
          </h1>
          <p className="text-[14px] text-muted-foreground">
            {tier === "trialing"
              ? `Trial — ${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
              : "Choose how to bring your episode in"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-[14px] flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800 font-medium shrink-0 text-[13px]"
              data-testid="button-try-again"
            >
              Dismiss
            </button>
          </div>
        )}

        <EpisodeInputBar requireAuth={false} onGenerate={handleGenerate} />

        {showRunsRemaining && (
          <p className="text-center text-[13px] text-muted-foreground mt-4">
            {runsUsed} of {runLimit} runs used this month ·{" "}
            <Link href="/pricing">
              <span className="underline cursor-pointer hover:text-foreground transition-colors">Upgrade for more</span>
            </Link>
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
