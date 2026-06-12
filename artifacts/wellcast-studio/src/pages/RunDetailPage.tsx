import { useParams, Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, CheckCircle2, Download, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ASSET_CATEGORIES = [
  { id: "shownotes", title: "Show Notes", desc: "Formatted for Apple & Spotify" },
  { id: "seo", title: "SEO Title Pack", desc: "5 optimized options" },
  { id: "blog", title: "Blog Skeleton", desc: "H2s and bullet points" },
  { id: "email", title: "Email Newsletter", desc: "Subscriber broadcast" },
  { id: "ig_captions", title: "Instagram Captions", desc: "3 distinct options" },
  { id: "carousel", title: "Carousel Copy", desc: "6-slide swipe file" },
  { id: "reels", title: "Reel Hooks", desc: "Short-form video scripts" },
  { id: "youtube", title: "YouTube Description", desc: "With timestamps & links" },
  { id: "pinterest", title: "Pinterest Captions", desc: "Keyword-rich pins" },
  { id: "hashtags", title: "Hashtag Sets", desc: "3-tier grouping" },
  { id: "guest", title: "Guest Share Kit", desc: "Swipe copy for guests" },
  { id: "calendar", title: "90-Day Calendar", desc: "Repurposing schedule" },
  { id: "score", title: "Episode Score", desc: "Content density rating" },
  { id: "credibility", title: "Credibility Guard", desc: "Fact-check highlights" },
  { id: "transformation", title: "Listener Transformation", desc: "Before/after state" },
];

export default function RunDetailPage() {
  const params = useParams();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[24px] font-semibold text-foreground leading-tight">
                Episode 142: Understanding Cortisol
              </h1>
              <span className="flex items-center text-[12px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
              </span>
            </div>
            <p className="text-[14px] text-muted-foreground">Generated today at 10:42 AM</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card">
              <Download className="mr-2 h-4 w-4" /> Export All
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Share2 className="mr-2 h-4 w-4" /> Share Hub
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ASSET_CATEGORIES.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-xl p-5 hover:border-muted-foreground transition-colors group flex flex-col h-full shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </span>
              <button className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-opacity" title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 bg-background rounded-lg border border-border/50 p-4 text-[13px] text-muted-foreground leading-relaxed overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none" />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
            
            <div className="mt-3 text-[12px] text-muted-foreground font-medium">
              {category.desc}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}