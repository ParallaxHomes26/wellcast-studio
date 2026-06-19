import { useState } from "react";
import { Link } from "wouter";
import { FileText, Mail, Share2, Megaphone, Calendar, Sparkles } from "lucide-react";
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

const LANDING_PRICES = {
  basic: {
    monthly: { amount: "$19", period: "/month" },
    annual:  { amount: "$157", period: "/year", equiv: "$13/mo billed annually", savings: "Save $71" },
  },
  starter: {
    monthly: { amount: "$37", period: "/month" },
    annual:  { amount: "$297", period: "/year", equiv: "$25/mo billed annually", savings: "Save $147" },
  },
  pro: {
    monthly: { amount: "$57", period: "/month" },
    annual:  { amount: "$497", period: "/year", equiv: "$41/mo billed annually", savings: "Save $187" },
  },
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path d="M2 7L5.5 10.5L12 4" stroke="#526056" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <style>{`
        /* ── Mobile overrides ── */
        @media (max-width: 767px) {
          .lp-nav-links   { display: none !important; }
          .lp-hero-h1     { font-size: 30px !important; }
          .lp-hero-sub    { font-size: 15px !important; }
          .lp-hiw-col     { border-right: none !important; border-bottom: 1px solid #DADCD9; padding-bottom: 28px; margin-bottom: 28px; }
          .lp-hiw-col:last-child { border-bottom: none !important; padding-bottom: 0; margin-bottom: 0; }
          .lp-pricing-h2  { font-size: 26px !important; }
          .lp-pricing-grid { grid-template-columns: 1fr !important; }
          .lp-pricing-grid > div { padding: 28px 20px !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-background px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/wellcast-logo.png"
            alt="Wellcast Studio"
            className="h-16 md:h-24 w-auto"
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
        <div className="flex items-center gap-4 md:gap-6">
          <div className="lp-nav-links flex items-center gap-6">
            <a href="#pricing" className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors no-underline">
              Pricing
            </a>
            <Link href="/login" className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors">
              Sign in
            </Link>
          </div>
          <Link
            href="/signup"
            className="whitespace-nowrap bg-accent text-white px-4 md:px-5 py-2 text-[13px] font-medium hover:bg-accent/90 transition-colors shadow-sm"
            style={{ borderRadius: "20px" }}
          >
            Start free — 7 days
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="pt-10 md:pt-20 px-5 md:px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-5 md:mb-6">
            Built for health and wellness podcasters
          </span>
          <h1 className="lp-hero-h1 font-serif font-light md:text-[52px] text-foreground leading-[1.15] mb-5 md:mb-6 tracking-tight" style={{ fontSize: "40px" }}>
            What will you share today?
          </h1>
          <p className="lp-hero-sub max-w-[560px] leading-[1.6]" style={{ fontSize: "17px", color: "#526056" }}>
            AI-powered show notes, social content, email newsletters, SEO, and more — built exclusively for health and wellness podcasters.
          </p>
        </section>

        {/* ── Input Area ── */}
        <section className="mt-10 md:mt-12 px-4 md:px-6">
          <EpisodeInputBar requireAuth={true} />
        </section>

        {/* ── Stats Row ── */}
        <section className="mt-10 md:mt-12 mb-16 md:mb-20 px-4 md:px-6">
          <div
            className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-0 divide-y md:divide-y-0 md:divide-x"
            style={{ borderColor: "#DADCD9" }}
          >
            <div className="w-full md:w-auto px-6 md:px-8 py-3 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              26 assets generated
            </div>
            <div className="w-full md:w-auto px-6 md:px-8 py-3 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              5–7 hours saved per episode
            </div>
            <div className="w-full md:w-auto px-6 md:px-8 py-3 md:py-0 text-center text-[14px] font-medium" style={{ color: "#526056" }}>
              SEO built into every asset
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-16 md:py-20 px-5 md:px-6">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <span className="uppercase tracking-[0.1em] text-[11px] font-semibold text-accent mb-3 block">
                How it works
              </span>
              <h2 className="font-serif font-light text-[24px] md:text-[28px] text-foreground">
                From episode to everywhere — in two minutes.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="lp-hiw-col px-0 md:px-8 md:first:pl-0" style={{ borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>01</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Bring your episode</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">Paste your transcript, fill in your episode details, or drop a URL. Any format works — raw text, timestamps included.</p>
              </div>
              <div className="lp-hiw-col px-0 md:px-8" style={{ borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>02</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Generate in minutes</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">26 assets build in parallel in under two minutes. SEO, social, email, amplification, and your 90-day strategy — all of it, done.</p>
              </div>
              <div className="lp-hiw-col px-0 md:px-8 md:last:pr-0">
                <p className="text-[11px] font-semibold tracking-[0.1em] mb-3" style={{ color: "#526056" }}>03</p>
                <h3 className="text-[16px] mb-2" style={{ color: "#363633", fontWeight: 500 }}>Publish and grow</h3>
                <p className="text-[13px] text-muted-foreground leading-[1.7]">Copy each asset directly, follow your week-by-week deployment schedule, and let your 90-day repurposing calendar keep the episode working long after launch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What gets generated ── */}
        <section className="py-12 md:py-16 px-5 md:px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#897866" }}>
                What gets generated
              </span>
              <h2 className="font-serif font-light text-[24px] md:text-[28px] leading-tight" style={{ color: "#363633" }}>
                26 assets across 6 categories.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* ── Pricing ── */}
        <section id="pricing" className="mt-4 md:mt-8 pb-20 md:pb-24 px-5 md:px-6">
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            {/* Eyebrow */}
            <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#897866", marginBottom: "12px" }}>
              Simple pricing
            </p>

            {/* Headline */}
            <h2 className="lp-pricing-h2" style={{ textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "36px", color: "#363633", lineHeight: 1.2, marginBottom: "12px" }}>
              Get started today for $19/month —{" "}
              or scale up as you grow.
            </h2>

            {/* Subline */}
            <p style={{ textAlign: "center", fontSize: "15px", color: "#897866", marginBottom: "36px" }}>
              No contracts. Cancel anytime.
            </p>

            {/* Monthly / Annual toggle */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "inline-flex", background: "#ECEAE4", borderRadius: "30px", padding: "4px", border: "0.5px solid #DADCD9" }}>
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  style={{
                    padding: "8px 24px", borderRadius: "26px", border: "none", cursor: "pointer",
                    fontSize: "13px", fontWeight: billing === "monthly" ? 500 : 400,
                    background: billing === "monthly" ? "white" : "transparent",
                    color: billing === "monthly" ? "#363633" : "#897866",
                    boxShadow: billing === "monthly" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("annual")}
                  style={{
                    padding: "8px 24px", borderRadius: "26px", border: "none", cursor: "pointer",
                    fontSize: "13px", fontWeight: billing === "annual" ? 500 : 400,
                    background: billing === "annual" ? "white" : "transparent",
                    color: billing === "annual" ? "#363633" : "#897866",
                    boxShadow: billing === "annual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  Annual
                  <span style={{ fontSize: "11px", background: "#526056", color: "white", borderRadius: "10px", padding: "2px 8px", whiteSpace: "nowrap" }}>
                    Save 30%+
                  </span>
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="lp-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" }}>

              {/* Basic */}
              <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Basic</p>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{LANDING_PRICES.basic[billing].amount}</span>
                  <span style={{ fontSize: "15px", color: "#897866" }}>{LANDING_PRICES.basic[billing].period}</span>
                </div>
                {billing === "annual" && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#897866" }}>{LANDING_PRICES.basic.annual.equiv}</p>
                    <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{LANDING_PRICES.basic.annual.savings}</span>
                  </div>
                )}
                <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
                  Perfect for podcasters just getting started
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {["2 episode runs per month", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Email support"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <CheckIcon />
                      <span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/pricing">
                  <button
                    data-testid="button-basic-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start 7-day free trial
                  </button>
                </Link>
              </div>

              {/* Starter */}
              <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Starter</p>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{LANDING_PRICES.starter[billing].amount}</span>
                  <span style={{ fontSize: "15px", color: "#897866" }}>{LANDING_PRICES.starter[billing].period}</span>
                </div>
                {billing === "annual" && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#897866" }}>{LANDING_PRICES.starter.annual.equiv}</p>
                    <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{LANDING_PRICES.starter.annual.savings}</span>
                  </div>
                )}
                <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
                  For podcasters publishing consistently
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {["4 episode runs per month", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Episode Confidence Score", "Email support"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <CheckIcon />
                      <span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/pricing">
                  <button
                    data-testid="button-starter-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start 7-day free trial
                  </button>
                </Link>
              </div>

              {/* Pro */}
              <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px", position: "relative" }}>
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#526056", color: "white", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: "12px", whiteSpace: "nowrap" }}>
                  Most popular
                </div>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Pro</p>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{LANDING_PRICES.pro[billing].amount}</span>
                  <span style={{ fontSize: "15px", color: "#897866" }}>{LANDING_PRICES.pro[billing].period}</span>
                </div>
                {billing === "annual" && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#897866" }}>{LANDING_PRICES.pro.annual.equiv}</p>
                    <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{LANDING_PRICES.pro.annual.savings}</span>
                  </div>
                )}
                <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
                  For podcasters serious about growth
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {["Unlimited episode runs", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Episode Confidence Score", "Clinical Credibility Guard", "Listener Transformation Statement", "Guest share package", "Priority support"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <CheckIcon />
                      <span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/pricing">
                  <button
                    data-testid="button-pro-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", background: "#526056", color: "white", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start 7-day free trial
                  </button>
                </Link>
              </div>

            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#897866", marginTop: "32px" }}>
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 text-center" style={{ borderTop: "0.5px solid #DADCD9", paddingTop: "32px", paddingBottom: "32px" }}>
        <p className="text-[12px]" style={{ color: "#CBD0CA" }}>
          Wellcast Studio · Built by Aligned Marketing Co.
        </p>
      </footer>
    </div>
  );
}
