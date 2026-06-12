import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileAudio } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-accent/10 text-accent text-[12px] font-medium rounded-full border border-accent/20">
            Pro Plan
          </span>
          <Link href="/new-run">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              New episode run
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <section id="history">
          <h2 className="text-[16px] font-medium text-foreground mb-4">Recent Episodes</h2>
          
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
        </section>
      </div>
    </DashboardLayout>
  );
}