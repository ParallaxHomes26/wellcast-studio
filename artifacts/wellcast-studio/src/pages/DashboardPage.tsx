import { useEffect, useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileAudio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";

interface EpisodeRun {
  id: string;
  episode_title: string;
  health_niche: string;
  created_at: string;
  status: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [runs, setRuns] = useState<EpisodeRun[]>([]);
  const [runsLoading, setRunsLoading] = useState(true);

  // Suppress unused warning — profile kept for future subscription gating
  void profile;

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-foreground">Dashboard</h1>
        <Link href="/new-run">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            New episode run
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <section id="history">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-medium text-foreground">Recent Episodes</h2>
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
