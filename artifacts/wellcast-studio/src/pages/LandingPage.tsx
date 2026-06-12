import { Link } from "wouter";
import EpisodeInputBar from "@/components/input/EpisodeInputBar";

export default function LandingPage() {
  const PREVIEW_ASSETS = [
    "Show notes", "SEO titles", "Blog skeleton", "Email newsletter", 
    "Instagram captions", "Carousel copy", "Reel hooks", "YouTube description", 
    "Pinterest", "3-tier hashtags", "Guest share kit", "90-day calendar", 
    "Episode score", "Credibility guard", "Listener transformation", "+11 more"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="font-medium text-[17px] text-foreground tracking-tight">
          Wellcast Studio
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="bg-accent text-white rounded-full px-5 py-2 text-[13px] font-medium hover:bg-accent/90 transition-colors shadow-sm">
            Start free — 14 days
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* Hero */}
        <section className="pt-20 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-6">
            Built for health and wellness podcasters
          </span>
          <h1 className="font-serif font-light text-[40px] md:text-[52px] text-foreground leading-[1.1] mb-6 tracking-tight">
            Every asset. One episode. Two minutes.
          </h1>
          <p className="text-[17px] text-muted-foreground max-w-[560px] leading-[1.6]">
            Paste your transcript, enter your episode details, or drop a URL — and walk away with 26 content assets ready to publish, schedule, and share.
          </p>
        </section>

        {/* Input Area */}
        <section className="mt-12 px-6">
          <EpisodeInputBar requireAuth={true} />
        </section>

        {/* Asset Preview Strip */}
        <section className="mt-8 overflow-hidden w-full relative">
          {/* Subtle fade edges for the scrolling strip */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-6 scrollbar-hide no-scrollbar whitespace-nowrap">
            {PREVIEW_ASSETS.map((asset, i) => (
              <div 
                key={i} 
                className="inline-flex items-center justify-center text-[11px] font-medium px-3 py-1 rounded-full bg-card border border-border text-accent whitespace-nowrap shadow-sm"
              >
                {asset}
              </div>
            ))}
          </div>
        </section>

        {/* Stats Row */}
        <section className="mt-12 mb-20 px-6">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="text-[13px] text-muted-foreground uppercase tracking-[0.08em] font-medium px-8 py-2 md:py-0 text-center">
              26 assets generated
            </div>
            <div className="text-[13px] text-muted-foreground uppercase tracking-[0.08em] font-medium px-8 py-2 md:py-0 text-center">
              5–7 hours saved per episode
            </div>
            <div className="text-[13px] text-muted-foreground uppercase tracking-[0.08em] font-medium px-8 py-2 md:py-0 text-center">
              SEO built into every asset
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20 px-6 max-w-[600px] mx-auto">
          <h2 className="text-center text-[15px] font-medium text-foreground mb-10">How it works</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[15px] md:before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-border">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full border-4 border-background bg-accent text-white text-[12px] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-foreground text-[15px] mb-2">Bring your episode</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">Paste your transcript, fill in your details, or drop a URL. Any format works.</p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full border-4 border-background bg-card text-foreground border-[1px] border-border text-[12px] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-foreground text-[15px] mb-2">Hit generate</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">26 assets build in parallel in under 2 minutes. SEO, social, email, strategy — all of it.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full border-4 border-background bg-card text-foreground border-[1px] border-border text-[12px] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] bg-card border border-border p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-foreground text-[15px] mb-2">Publish and grow</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">Copy, deploy, and follow your 90-day repurposing calendar. Your episode works for months, not hours.</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-border px-6 text-center">
        <p className="text-[12px] text-muted font-medium">
          Wellcast Studio · Built by Aligned Marketing Co.
        </p>
      </footer>
    </div>
  );
}