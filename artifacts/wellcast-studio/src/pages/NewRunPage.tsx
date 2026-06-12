import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EpisodeInputBar from "@/components/input/EpisodeInputBar";
import GeneratingScreen from "@/components/ui/GeneratingScreen";
import { useAuth } from "@/context/AuthContext";

export default function NewRunPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

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

      // Bridge assets to the run page via sessionStorage (no Supabase round-trip needed)
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

  if (generating) {
    return <GeneratingScreen />;
  }

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
            Choose how to bring your episode in
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
      </div>
    </DashboardLayout>
  );
}
