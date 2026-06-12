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
            Start free — 7 days
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
        <section className="mt-8 px-6">
          <div className="max-w-[720px] mx-auto flex flex-wrap gap-2 pb-2">
            {PREVIEW_ASSETS.map((asset, i) => (
              <div
                key={i}
                className="inline-flex items-center justify-center text-[11px] font-medium px-3 py-1 rounded-full bg-card border border-border text-accent shadow-sm"
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
        {/* Pricing */}
        <section className="mt-24 px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-4 block">
                Simple pricing
              </span>
              <h2 className="font-serif font-light text-[36px] text-foreground mb-3">
                Start free. Scale as you grow.
              </h2>
              <p className="text-[15px] text-muted-foreground">No contracts. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Starter */}
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col">
                <div className="mb-6">
                  <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-[0.08em] mb-4">Starter</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-serif font-light text-[44px] text-foreground leading-none">$37</span>
                    <span className="text-[14px] text-muted-foreground">/month</span>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">Perfect for podcasters publishing consistently</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["4 episode runs per month", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Email support"].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-foreground">
                      <span className="text-accent mt-0.5 shrink-0">·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  data-testid="button-starter-trial"
                  className="w-full py-3 rounded-lg border border-accent text-accent text-[14px] font-medium hover:bg-accent/5 transition-colors"
                >
                  Start 7-day free trial
                </button>
              </div>

              {/* Pro — featured */}
              <div className="relative flex flex-col">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-accent text-white text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
                <div className="bg-[#363633] border border-[#363633] rounded-xl p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <p className="text-[13px] font-medium text-white/60 uppercase tracking-[0.08em] mb-4">Pro</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="font-serif font-light text-[44px] text-white leading-none">$57</span>
                      <span className="text-[14px] text-white/60">/month</span>
                    </div>
                    <p className="text-[14px] text-white/70 leading-relaxed">For podcasters serious about growth</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {["Unlimited episode runs", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Episode Confidence Score", "Clinical Credibility Guard", "Priority support"].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[14px] text-white/90">
                        <span className="text-accent mt-0.5 shrink-0" style={{ color: "#8aab8e" }}>·</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    data-testid="button-pro-trial"
                    className="w-full py-3 rounded-lg bg-accent text-white text-[14px] font-medium hover:bg-accent/90 transition-colors"
                  >
                    Start 7-day free trial
                  </button>
                </div>
              </div>

              {/* Founding Member */}
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col">
                <div className="mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#897866]">50 spots only</span>
                </div>
                <div className="mb-6 mt-2">
                  <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-[0.08em] mb-4">Founding Member</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-serif font-light text-[44px] text-foreground leading-none">$37</span>
                    <span className="text-[14px] text-muted-foreground">/month</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mb-3">locked forever</p>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">Pro features at Starter pricing — for founding members only</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Everything in Pro", "Price locked for life", "Founding member badge", "Early access to all new features"].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[14px] text-foreground">
                      <span className="text-accent mt-0.5 shrink-0">·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <button
                    data-testid="button-founding-waitlist"
                    className="w-full py-3 rounded-lg border border-foreground text-foreground text-[14px] font-medium hover:bg-foreground/5 transition-colors"
                  >
                    Join the waitlist
                  </button>
                  <p className="text-[12px] text-muted-foreground text-center">
                    Available to waitlist members before public launch
                  </p>
                </div>
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