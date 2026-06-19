import { useState } from "react";
import { Link } from "wouter";

/* ── Asset groups for Section 3 ── */
const ASSET_GROUPS = [
  {
    label: "Show & SEO",
    items: [
      "SEO-optimized show notes",
      "6 title variations with recommended winner",
      "Apple, Spotify + YouTube keyword sets",
      "Blog post skeleton with FAQ schema",
    ],
  },
  {
    label: "Email & Social",
    items: [
      "Full email newsletter draft",
      "3 Instagram caption variations",
      "Hashtag strategy (broad, niche + micro)",
      "8-slide carousel outline with copy",
    ],
  },
  {
    label: "Video & Audio",
    items: [
      "3 trailer scripts with timestamp clip selections",
      "5 reel clip picks with hook overlays",
    ],
  },
  {
    label: "Strategy & Intelligence",
    items: [
      "7-day launch calendar",
      "90-day repurposing roadmap",
      "Episode Confidence Score",
      "Clinical Credibility Guard",
      "Listener Transformation Statement",
    ],
  },
];

/* ── Pricing data ── */
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
        @media (max-width: 767px) {
          .lp-nav-links      { display: none !important; }
          .lp-hero-h1        { font-size: 28px !important; line-height: 1.2 !important; }
          .lp-section-h2     { font-size: 26px !important; }
          .lp-asset-grid     { grid-template-columns: 1fr !important; }
          .lp-hiw-grid       { grid-template-columns: 1fr !important; }
          .lp-hiw-col        { border-right: none !important; border-bottom: 1px solid #DADCD9 !important;
                               padding-bottom: 28px !important; margin-bottom: 28px !important; padding-left: 0 !important; padding-right: 0 !important; }
          .lp-hiw-col:last-child { border-bottom: none !important; padding-bottom: 0 !important; margin-bottom: 0 !important; }
          .lp-pricing-grid   { grid-template-columns: 1fr !important; }
          .lp-pricing-grid > div { padding: 28px 20px !important; }
          .lp-pricing-h2     { font-size: 26px !important; }
          .lp-cta-h2         { font-size: 26px !important; }
          .lp-cta-btn        { width: 100% !important; text-align: center; }
        }
      `}</style>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-background px-4 md:px-8 py-3 flex items-center justify-between">
        <Link href="/">
          <img
            src="/wellcast-logo.png"
            alt="Wellcast Studio"
            className="h-16 md:h-24 w-auto cursor-pointer"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              const span = document.createElement("span");
              span.className = "font-medium text-[17px] text-foreground tracking-tight";
              span.textContent = "Wellcast Studio";
              img.parentNode?.appendChild(span);
            }}
          />
        </Link>
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

        {/* ── 1. HERO ── */}
        <section className="pt-16 md:pt-28 pb-16 md:pb-24 px-5 md:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
          <span
            className="uppercase tracking-[0.12em] text-[11px] font-semibold mb-6 block"
            style={{ color: "#526056" }}
          >
            Built for health and wellness podcasters
          </span>

          <h1
            className="lp-hero-h1 font-serif font-light text-foreground tracking-tight mb-6"
            style={{ fontSize: "44px", lineHeight: 1.15 }}
          >
            Your episode is recorded.<br />
            <span style={{ color: "#897866" }}>Now comes the part that<br />takes the rest of your week.</span>
          </h1>

          <p className="text-[17px] md:text-[19px] leading-relaxed mb-10 max-w-[580px]" style={{ color: "#526056" }}>
            Wellcast Studio turns one transcript into 26 ready-to-use content assets — in minutes.
          </p>

          <Link
            href="/signup"
            className="lp-cta-btn inline-flex items-center gap-2 text-white text-[15px] font-medium px-8 py-4 transition-colors hover:opacity-90"
            style={{ background: "#526056", borderRadius: "12px" }}
          >
            Start your free 7-day trial →
          </Link>

          <p className="text-[13px] mt-4" style={{ color: "#897866" }}>
            No credit card required. Cancel anytime.
          </p>
        </section>

        {/* ── 2. THE PROBLEM ── */}
        <section className="py-16 md:py-20 px-5 md:px-8" style={{ borderTop: "0.5px solid #DADCD9", borderBottom: "0.5px solid #DADCD9", background: "#FAFAF8" }}>
          <div className="max-w-[680px] mx-auto text-center">
            <p className="text-[17px] md:text-[19px] leading-[1.75]" style={{ color: "#363633" }}>
              You didn't start a podcast to spend your week writing show notes, captions, newsletters, and SEO titles from scratch. But that's what consistent publishing actually requires — and most of it falls on you.
            </p>
            <p className="text-[17px] md:text-[19px] font-medium mt-6" style={{ color: "#526056" }}>
              Wellcast changes that.
            </p>
          </div>
        </section>

        {/* ── 3. THE SOLUTION ── */}
        <section className="py-20 md:py-28 px-5 md:px-8">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-14 md:mb-16">
              <span className="uppercase tracking-[0.12em] text-[11px] font-semibold mb-4 block" style={{ color: "#897866" }}>
                What you get
              </span>
              <h2 className="lp-section-h2 font-serif font-light text-foreground" style={{ fontSize: "36px" }}>
                One transcript in. Twenty-six assets out.
              </h2>
            </div>

            <div className="lp-asset-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              {ASSET_GROUPS.map(({ label, items }) => (
                <div
                  key={label}
                  className="p-7 rounded-xl"
                  style={{ background: "white", border: "0.5px solid #DADCD9" }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-4"
                    style={{ color: "#526056" }}
                  >
                    {label}
                  </p>
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-[14px] leading-snug" style={{ color: "#363633" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <section className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid #DADCD9", background: "#FAFAF8" }}>
          <div className="max-w-[860px] mx-auto">
            <div className="text-center mb-14">
              <span className="uppercase tracking-[0.12em] text-[11px] font-semibold mb-4 block" style={{ color: "#897866" }}>
                Three steps
              </span>
              <h2 className="lp-section-h2 font-serif font-light text-foreground" style={{ fontSize: "36px" }}>
                From episode to everywhere — in two minutes.
              </h2>
            </div>

            <div className="lp-hiw-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="lp-hiw-col" style={{ paddingRight: "36px", borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.12em] mb-4" style={{ color: "#526056" }}>01</p>
                <h3 className="text-[17px] font-medium mb-3" style={{ color: "#363633" }}>Bring your episode</h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: "#897866" }}>
                  Paste your transcript. Raw text, timestamps included — any format works.
                </p>
              </div>
              <div className="lp-hiw-col" style={{ padding: "0 36px", borderRight: "1px solid #DADCD9" }}>
                <p className="text-[11px] font-semibold tracking-[0.12em] mb-4" style={{ color: "#526056" }}>02</p>
                <h3 className="text-[17px] font-medium mb-3" style={{ color: "#363633" }}>Generate in minutes</h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: "#897866" }}>
                  All 26 assets build in parallel in under two minutes.
                </p>
              </div>
              <div className="lp-hiw-col" style={{ paddingLeft: "36px" }}>
                <p className="text-[11px] font-semibold tracking-[0.12em] mb-4" style={{ color: "#526056" }}>03</p>
                <h3 className="text-[17px] font-medium mb-3" style={{ color: "#363633" }}>Copy, paste, publish</h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: "#897866" }}>
                  Every asset is ready to use. Your 90-day repurposing calendar keeps the episode working long after launch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. PRICING ── */}
        <section id="pricing" className="py-20 md:py-28 px-5 md:px-8">
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            {/* Eyebrow */}
            <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#897866", marginBottom: "12px" }}>
              Simple pricing
            </p>

            {/* Headline */}
            <h2 className="lp-pricing-h2" style={{ textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "36px", color: "#363633", lineHeight: 1.2, marginBottom: "12px" }}>
              Start free. Scale when you're ready.
            </h2>

            {/* Subline */}
            <p style={{ textAlign: "center", fontSize: "15px", color: "#897866", marginBottom: "40px" }}>
              Every plan includes a 7-day free trial. No credit card required.
            </p>

            {/* Toggle */}
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
                <Link href="/signup">
                  <button
                    data-testid="button-basic-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start free trial →
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
                <Link href="/signup">
                  <button
                    data-testid="button-starter-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start free trial →
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
                <Link href="/signup">
                  <button
                    data-testid="button-pro-trial"
                    type="button"
                    style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", background: "#526056", color: "white", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
                  >
                    Start free trial →
                  </button>
                </Link>
              </div>

            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#897866", marginTop: "32px" }}>
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </section>

        {/* ── 6. CLOSING CTA ── */}
        <section className="py-20 md:py-28 px-5 md:px-8 text-center" style={{ borderTop: "0.5px solid #DADCD9", background: "#FAFAF8" }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="lp-cta-h2 font-serif font-light text-foreground mb-5" style={{ fontSize: "36px", lineHeight: 1.2 }}>
              Your next episode deserves to be heard.
            </h2>
            <p className="text-[17px] mb-10" style={{ color: "#897866" }}>
              Start your free 7-day trial today — no credit card required.
            </p>
            <Link
              href="/signup"
              className="lp-cta-btn inline-flex items-center justify-center gap-2 text-white text-[15px] font-medium px-10 py-4 transition-colors hover:opacity-90"
              style={{ background: "#526056", borderRadius: "12px" }}
            >
              Start your free 7-day trial →
            </Link>
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
