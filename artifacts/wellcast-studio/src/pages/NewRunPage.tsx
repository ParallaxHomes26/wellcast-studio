import DashboardLayout from "@/components/layout/DashboardLayout";
import EpisodeInputBar from "@/components/input/EpisodeInputBar";

export default function NewRunPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-foreground mb-2">New Episode Run</h1>
        <p className="text-[15px] text-muted-foreground">
          Provide your episode content and we'll generate 26 tailored assets.
        </p>
      </div>

      <div className="max-w-[720px]">
        <EpisodeInputBar requireAuth={false} />
      </div>
    </DashboardLayout>
  );
}