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
  const [activeTab, setActiveTab] = useState("Show Notes");

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
        <section className="relative overflow-hidden">
          {/* Decorative background arcs — oversized, very faint echo of the logo wave shape */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              right: "-60px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "640px",
              height: "640px",
              opacity: 0.065,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {/* Arc 1 — innermost */}
            <path
              d="M 175 500 A 75 75 0 0 1 325 500"
              stroke="#526056" strokeWidth="14" strokeLinecap="round"
            />
            {/* Arc 2 */}
            <path
              d="M 130 500 A 120 120 0 0 1 370 500"
              stroke="#526056" strokeWidth="12" strokeLinecap="round"
            />
            {/* Arc 3 */}
            <path
              d="M 85 500 A 165 165 0 0 1 415 500"
              stroke="#526056" strokeWidth="10" strokeLinecap="round"
            />
            {/* Arc 4 — outermost */}
            <path
              d="M 40 500 A 210 210 0 0 1 460 500"
              stroke="#526056" strokeWidth="8" strokeLinecap="round"
            />
          </svg>

        <div className="relative z-10 pt-16 md:pt-28 pb-16 md:pb-24 px-5 md:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
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
        </div>
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

        {/* ── 3b. PRODUCT MOCKUP ── */}
        <section className="py-20 md:py-28 px-5 md:px-8" style={{ borderTop: "0.5px solid #DADCD9", background: "#F3F2EE" }}>
          <div className="max-w-[860px] mx-auto">

            {/* Eyebrow + caption */}
            <div className="text-center mb-10">
              <span className="uppercase tracking-[0.14em] text-[11px] font-semibold mb-3 block" style={{ color: "#526056" }}>
                Your output
              </span>
              <h2 className="lp-section-h2 font-serif font-light text-foreground mb-3" style={{ fontSize: "36px" }}>
                Your episode. Ready to market.
              </h2>
              <p className="text-[15px]" style={{ color: "#897866" }}>
                Every asset ready to copy and use — no editing required.
              </p>
            </div>

            {/* App window frame */}
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(54,54,51,0.13), 0 4px 16px rgba(54,54,51,0.07)",
              border: "0.5px solid #DADCD9",
              background: "white",
            }}>

              {/* Browser chrome bar */}
              <div style={{
                background: "#ECEAE4",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderBottom: "0.5px solid #DADCD9",
              }}>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FF5F57" }} />
                  <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#FFBD2E" }} />
                  <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#27C840" }} />
                </div>
                <div style={{
                  flex: 1, background: "white", borderRadius: "6px", padding: "5px 12px",
                  fontSize: "12px", color: "#897866", border: "0.5px solid #DADCD9", textAlign: "center",
                }}>
                  app.getwellcast.com/run/gut-health-episode
                </div>
              </div>

              {/* Tab bar — interactive */}
              <div style={{
                background: "#FAFAF8",
                borderBottom: "0.5px solid #DADCD9",
                display: "flex",
                overflowX: "auto",
                padding: "0 20px",
              }}>
                {["Show Notes", "SEO Titles", "Social", "Email", "Carousel", "Hooks", "Strategy"].map((tab) => {
                  const active = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "11px 16px",
                        fontSize: "13px",
                        fontWeight: active ? 500 : 400,
                        color: active ? "#526056" : "#B0ADA6",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        borderBottom: active ? "2px solid #526056" : "2px solid transparent",
                        transition: "color 0.15s",
                        marginBottom: "-0.5px",
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Content area — switches by tab */}
              <div style={{ padding: "32px 36px", background: "white", minHeight: "340px" }}>

                {/* ── SHOW NOTES ── */}
                {activeTab === "Show Notes" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "3px 10px", display: "inline-block" }}>
                        Primary keyword: gut health for beginners
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 400, color: "#363633", marginBottom: "12px", lineHeight: 1.3 }}>
                      The Gut-Brain Connection: Why Your Microbiome Shapes Everything
                    </h3>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#526056", marginBottom: "16px", lineHeight: 1.6, borderLeft: "3px solid #526056", paddingLeft: "14px", fontStyle: "italic" }}>
                      Most people treat their gut like a digestive organ. The latest research shows it's actually running your mood, your immune system, and your ability to focus — and most of us have spent years unknowingly damaging it.
                    </p>
                    <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.8, marginBottom: "16px" }}>
                      In this episode, functional nutritionist Dr. Mara Chen breaks down the science of the gut microbiome in plain language — no jargon, no overwhelm. She explains how the trillions of bacteria living in your digestive system communicate directly with your brain through the vagus nerve, and why this "second brain" may be more influential than anyone previously understood.
                    </p>
                    <div style={{ background: "#FAFAF8", borderRadius: "8px", padding: "20px 24px", border: "0.5px solid #ECEAE4" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#897866", marginBottom: "14px" }}>
                        What you'll learn
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {[
                          "How the vagus nerve connects your gut and brain — and what disrupts that signal",
                          "The 3 dietary shifts Dr. Chen prescribes before any supplement protocol",
                          "Why diversity (not just quantity) of gut bacteria is the real marker of health",
                          "A simple 5-day reset to begin rebuilding your microbiome this week",
                        ].map((point) => (
                          <div key={point} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <CheckIcon />
                            <span style={{ fontSize: "13px", color: "#363633", lineHeight: 1.6 }}>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── SEO TITLES ── */}
                {activeTab === "SEO Titles" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "3px 10px", display: "inline-block" }}>
                        6 title variations generated
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        { title: "The Gut-Brain Connection: How Your Microbiome Controls Your Mood, Energy, and Focus", recommended: true },
                        { title: "Gut Health for Beginners: What Dr. Mara Chen Wants Every Patient to Know First", recommended: false },
                        { title: "Why Your Microbiome Is Your Second Brain (And How to Start Healing It This Week)", recommended: false },
                        { title: "Fix Your Gut, Fix Your Brain: The Science of the Microbiome with Dr. Mara Chen", recommended: false },
                      ].map(({ title, recommended }) => (
                        <div
                          key={title}
                          style={{
                            padding: "14px 18px",
                            borderRadius: "8px",
                            border: recommended ? "1.5px solid #526056" : "0.5px solid #ECEAE4",
                            background: recommended ? "#F5F7F5" : "#FAFAF8",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "16px",
                          }}
                        >
                          <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.6, margin: 0 }}>{title}</p>
                          {recommended && (
                            <span style={{
                              flexShrink: 0,
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "white",
                              background: "#526056",
                              borderRadius: "4px",
                              padding: "3px 9px",
                              marginTop: "2px",
                            }}>
                              Recommended
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "#B0ADA6", marginTop: "16px" }}>
                      Optimised for Apple Podcasts, Spotify, and YouTube search. Character counts within platform limits.
                    </p>
                  </>
                )}

                {/* ── SOCIAL ── */}
                {activeTab === "Social" && (
                  <>
                    <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "3px 10px", display: "inline-block" }}>
                        Instagram caption — variation 1 of 3
                      </span>
                    </div>
                    <div style={{ background: "#FAFAF8", borderRadius: "8px", padding: "20px 24px", border: "0.5px solid #ECEAE4", marginBottom: "20px" }}>
                      <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.85, margin: 0 }}>
                        Your gut is running a parallel operation to your brain — and most of us have no idea. 🧠{"\n\n"}
                        In this week's episode, Dr. Mara Chen breaks down exactly how your microbiome shapes your mood, your immune system, and even your ability to focus. The vagus nerve connection is wild, and the simple shifts she recommends are things you can start today.{"\n\n"}
                        New episode is live — link in bio. 🎙️
                      </p>
                    </div>
                    <div style={{ background: "#FAFAF8", borderRadius: "8px", padding: "16px 20px", border: "0.5px solid #ECEAE4" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#897866", marginBottom: "10px" }}>
                        Hashtag strategy
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {["#guthealth", "#microbiome", "#gutbrainconnection", "#functionalmedicine", "#healthpodcast", "#wellnesspodcast", "#guthealing", "#holistichealth", "#podcastersofinstagram", "#healthandwellness"].map((tag) => (
                          <span key={tag} style={{ fontSize: "12px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "3px 8px" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── EMAIL ── */}
                {activeTab === "Email" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "3px 10px", display: "inline-block" }}>
                        Newsletter draft
                      </span>
                    </div>
                    <div style={{ marginBottom: "20px", padding: "14px 18px", borderRadius: "8px", background: "#FAFAF8", border: "0.5px solid #ECEAE4" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#897866", marginBottom: "6px" }}>Subject line</p>
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#363633", margin: 0 }}>
                        Your gut is running your brain (and here's the research to prove it)
                      </p>
                    </div>
                    <div style={{ marginBottom: "16px", padding: "14px 18px", borderRadius: "8px", background: "#FAFAF8", border: "0.5px solid #ECEAE4" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#897866", marginBottom: "8px" }}>Preview text</p>
                      <p style={{ fontSize: "13px", color: "#897866", margin: 0, fontStyle: "italic" }}>
                        Plus: the 3 dietary shifts Dr. Mara Chen recommends before any supplement.
                      </p>
                    </div>
                    <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.9, marginBottom: "16px" }}>
                      Hi [First Name],
                    </p>
                    <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.9, marginBottom: "16px" }}>
                      Most of my listeners come to this podcast because something isn't working — their energy, their digestion, their mood — and they can't quite figure out why. If that sounds familiar, this week's episode might be the missing piece.
                    </p>
                    <p style={{ fontSize: "14px", color: "#363633", lineHeight: 1.9, marginBottom: "0" }}>
                      I sat down with functional nutritionist Dr. Mara Chen to talk about the gut-brain axis — the direct communication highway between your digestive system and your mind. What she shared about the vagus nerve, and how quickly the microbiome can shift with the right inputs, genuinely surprised me. We also got into the three dietary changes she starts with every single client, and why reaching for a probiotic supplement first is usually the wrong move.
                    </p>
                  </>
                )}

                {/* ── PLACEHOLDER for other tabs ── */}
                {!["Show Notes", "SEO Titles", "Social", "Email"].includes(activeTab) && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", flexDirection: "column", gap: "10px" }}>
                    <p style={{ fontSize: "14px", color: "#B0ADA6" }}>
                      <span style={{ color: "#526056", fontWeight: 500 }}>{activeTab}</span> output would appear here.
                    </p>
                    <p style={{ fontSize: "13px", color: "#C8C5BE" }}>All 26 assets generate in the same view.</p>
                  </div>
                )}

                {/* Copy button row */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#B0ADA6", padding: "7px 14px", border: "0.5px solid #DADCD9", borderRadius: "6px", cursor: "default" }}>
                    Regenerate
                  </div>
                  <div style={{ fontSize: "12px", color: "white", background: "#526056", padding: "7px 16px", borderRadius: "6px", cursor: "default", fontWeight: 500 }}>
                    Copy to clipboard
                  </div>
                </div>

              </div>
            </div>
            {/* End app window */}

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
