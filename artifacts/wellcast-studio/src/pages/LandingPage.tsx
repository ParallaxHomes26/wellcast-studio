import { Link } from "wouter";
import { FileText, Mail, Share2, Megaphone, Calendar, Sparkles, Check } from "lucide-react";
import EpisodeInputBar from "@/components/input/EpisodeInputBar";

const WHAT_GETS_GENERATED = [
  {
    icon: FileText,
    name: "Publishing & SEO",
    assets: ["Show notes", "SEO titles", "Blog skeleton", "YouTube description", "Pinterest", "Platform keywords"],
  },
  {
    icon: Mail,
    name: "Email",
    assets: ["Newsletter draft", "Subject lines", "Guest thank-you email"],
  },
  {
    icon: Share2,
    name: "Social Media",
    assets: ["Instagram captions", "Hashtag strategy", "Reel hooks", "Carousel copy", "Engagement prompts"],
  },
  {
    icon: Megaphone,
    name: "Amplification",
    assets: ["Guest share package", "Cross-promo pitch", "Sponsor suggestions", "Episode hooks"],
  },
  {
    icon: Calendar,
    name: "Strategy",
    assets: ["90-day calendar", "Week 1 schedule", "Evergreen flag"],
  },
  {
    icon: Sparkles,
    name: "Episode Intelligence",
    assets: ["Confidence score", "Credibility guard", "Transformation statement"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background px-6 py-4 flex items-center justify-between" style={{ borderBottom: "none", boxShadow: "none", border: "none" }}>
        <div className="flex items-center">
          <img
            src="/wellcast-logo.png"
            alt="Wellcast Studio"
            style={{ height: "100px", width: "auto" }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              const span = document.createElement("span");
              span.className = "font-medium text-[17px] text-foreground tracking-tight";
              span.textContent = "Wellcast Studio";
              img.parentNode?.appendChild(span);
            }}
          />
        </div>
        <div className="flex items-center gap-6">
          <a href="#pricing" className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors no-underline">
            Pricing
          </a>
          <Link href="/login" className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="bg-accent text-white rounded-full px-5 py-2 text-[13px] font-medium hover:bg-accent/90 transition-colors shadow-sm">
            Start free — 7 days
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-6">
            Built for health and wellness podcasters
          </span>
          <h1 className="font-serif font-light text-[40px] md:text-[52px] text-foreground leading-[1.1] mb-6 tracking-tight">
            What will you share today?
          </h1>
          <p className="text-[17px] max-w-[560px] leading-[1.6]" style={{ color: "#526056" }}>
            AI-powered show notes, social content, email newsletters, SEO, and more — built exclusively for health and wellness podcasters.
          </p>
        </section>

        {/* Input Area */}
        <section className="mt-12 px-6">
          <EpisodeInputBar requireAuth={true} />
        </section>

        {/* Stats Row */}
        <section className="mt-12 mb-20 px-6">
          <div
            className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x"
            style={{ borderColor: "#DADCD9" }}
          >
            <div className="px-8 py-2 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              26 assets generated
            </div>
            <div className="px-8 py-2 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              5–7 hours saved per episode
            </div>
            <div className="px-8 py-2 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              SEO built into every asset
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-3 block">
                How it works
              </span>
              <h2 className="font-serif font-light text-[28px] text-foreground">
                From episode to everywhere — in two minutes.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="px-8 first:pl-0 pb-10 md:pb-0" style={{ borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>01</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Bring your episode</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">Paste your transcript, fill in your episode details, or drop a URL. Any format works — raw text, timestamps included.</p>
              </div>
              <div className="px-8 pb-10 md:pb-0" style={{ borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>02</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Generate in minutes</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">26 assets build in parallel in under two minutes. SEO, social, email, amplification, and your 90-day strategy — all of it, done.</p>
              </div>
              <div className="px-8 last:pr-0 pb-10 md:pb-0">
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>03</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Publish and grow</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">Copy each asset directly, follow your week-by-week deployment schedule, and let your 90-day repurposing calendar keep the episode working long after launch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What gets generated */}
        <section className="py-16 px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-10">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#897866" }}>
                What gets generated
              </span>
              <h2 className="font-serif font-light text-[28px] leading-tight" style={{ color: "#363633" }}>
                26 assets across 6 categories.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WHAT_GETS_GENERATED.map(({ icon: Icon, name, assets }) => (
                <div
                  key={name}
                  className="flex flex-col p-5 rounded-[10px] bg-white"
                  style={{ border: "1px solid #DADCD9" }}
                >
                  <Icon size={16} className="mb-3" style={{ color: "#526056" }} />
                  <p className="text-[14px] font-medium mb-2" style={{ color: "#363633" }}>{name}</p>
                  <ul style={{ color: "#897866", fontSize: "12px", lineHeight: "1.9" }}>
                    {assets.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-8 pb-24 px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <span
                className="uppercase tracking-[0.1em] text-[11px] font-semibold mb-4 block"
                style={{ color: "#526056" }}
              >
                Simple pricing
              </span>
              <h2 className="font-serif font-light text-[36px] text-foreground mb-3">
                Start free. Scale as you grow.
              </h2>
              <p className="text-[15px]" style={{ color: "#526056" }}>No contracts. Cancel anytime.</p>
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
                      <Check size={14} className="shrink-0 mt-0.5" style={{ color: "#526056" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  data-testid="button-starter-trial"
                  className="w-full py-3 rounded-lg border text-[14px] font-medium transition-colors"
                  style={{ borderColor: "#526056", color: "#526056" }}
                >
                  Start 7-day free trial
                </button>
              </div>

              {/* Pro — featured */}
              <div className="relative flex flex-col">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span
                    className="text-white text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
                    style={{ background: "#526056" }}
                  >
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
                    {[
                      "Unlimited episode runs",
                      "All 26 assets per run",
                      "SEO optimization",
                      "90-day repurposing calendar",
                      "Episode Confidence Score",
                      "Clinical Credibility Guard",
                      "Listener Transformation Statement",
                      "Guest share package",
                      "Priority support",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[14px] text-white/90">
                        <Check size={14} className="shrink-0 mt-0.5 text-white" />
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
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white px-2 py-0.5 rounded"
                    style={{ background: "#526056" }}
                  >
                    50 spots only
                  </span>
                </div>
                <div className="mb-6 mt-3">
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
                      <Check size={14} className="shrink-0 mt-0.5" style={{ color: "#526056" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <button
                    data-testid="button-founding-waitlist"
                    className="w-full py-3 rounded-lg text-white text-[14px] font-medium transition-colors"
                    style={{ background: "#526056" }}
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
      <footer
        className="px-6 text-center"
        style={{
          borderTop: "0.5px solid #DADCD9",
          paddingTop: "32px",
          paddingBottom: "32px",
        }}
      >
        <p className="text-[12px]" style={{ color: "#CBD0CA" }}>
          Wellcast Studio · Built by Aligned Marketing Co.
        </p>
      </footer>
    </div>
  );
}
