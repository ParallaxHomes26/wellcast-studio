import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PRICE_IDS } from "@/lib/subscription";

interface PlanConfig {
  label: string;
  monthlyPrice: string;
  annualPrice: string;
  monthlyPriceId: string;
  annualPriceId: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
  badgeNote?: string;
  isWaitlist?: boolean;
  isFoundingMember?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    label: "Basic",
    monthlyPrice: "$19",
    annualPrice: "$157",
    monthlyPriceId: PRICE_IDS.BASIC_MONTHLY,
    annualPriceId: PRICE_IDS.BASIC_ANNUAL,
    description: "Perfect for podcasters just getting started",
    features: [
      "2 episode runs per month",
      "All 26 assets per run",
      "SEO optimization",
      "90-day repurposing calendar",
      "Email support",
    ],
    cta: "Start 7-day free trial",
  },
  {
    label: "Starter",
    monthlyPrice: "$37",
    annualPrice: "$297",
    monthlyPriceId: PRICE_IDS.STARTER_MONTHLY,
    annualPriceId: PRICE_IDS.STARTER_ANNUAL,
    description: "For podcasters publishing consistently",
    features: [
      "4 episode runs per month",
      "All 26 assets per run",
      "SEO optimization",
      "90-day repurposing calendar",
      "Episode Confidence Score",
      "Email support",
    ],
    cta: "Start 7-day free trial",
  },
  {
    label: "Pro",
    monthlyPrice: "$57",
    annualPrice: "$497",
    monthlyPriceId: PRICE_IDS.PRO_MONTHLY,
    annualPriceId: PRICE_IDS.PRO_ANNUAL,
    description: "For podcasters serious about growth",
    features: [
      "Unlimited episode runs",
      "All 26 assets per run",
      "SEO optimization",
      "90-day repurposing calendar",
      "Episode Confidence Score",
      "Clinical Credibility Guard",
      "Listener Transformation Statement",
      "Guest share package",
      "Priority support",
    ],
    cta: "Start 7-day free trial",
    featured: true,
    badge: "Most popular",
  },
  {
    label: "Founding Member",
    monthlyPrice: "$37",
    annualPrice: "$37",
    monthlyPriceId: PRICE_IDS.FOUNDING_MEMBER,
    annualPriceId: PRICE_IDS.FOUNDING_MEMBER,
    description: "Pro features at Starter pricing — for founding members only",
    features: [
      "Everything in Pro",
      "Price locked for life",
      "Founding member badge",
      "Early access to all new features",
    ],
    cta: "Join the waitlist →",
    badge: "50 spots only",
    badgeNote: "Available to waitlist members before public launch",
    isWaitlist: true,
    isFoundingMember: true,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleCta = async (plan: PlanConfig) => {
    if (plan.isWaitlist) {
      window.open("https://getwellcast.com/waitlist", "_blank");
      return;
    }
    if (!user) {
      setLocation("/signup");
      return;
    }
    const priceId = annual ? plan.annualPriceId : plan.monthlyPriceId;
    setLoading(plan.label);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          price_id: priceId,
          is_founding_member: plan.isFoundingMember ?? false,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background px-6 py-4 flex items-center justify-between" style={{ borderBottom: "none", boxShadow: "none", border: "none" }}>
        <Link href="/">
          <img src="/wellcast-logo.png" alt="Wellcast Studio" style={{ height: "80px", width: "auto" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <span className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <span className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">Sign in</span>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 rounded-full text-white text-[14px] font-medium" style={{ background: "#526056" }}>
                  Start free — 7 days
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.1em] text-[11px] font-semibold mb-4 block" style={{ color: "#526056" }}>
            Simple pricing
          </span>
          <h1 className="font-serif font-light text-[42px] text-foreground mb-4">
            Simple pricing for serious podcasters
          </h1>
          <p className="text-[16px] text-muted-foreground mb-8">
            Start free for 7 days. No credit card required.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-2 py-1.5">
            <button
              onClick={() => setAnnual(false)}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors"
              style={!annual ? { background: "#526056", color: "#fff" } : { color: "#526056" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors flex items-center gap-2"
              style={annual ? { background: "#526056", color: "#fff" } : { color: "#526056" }}
            >
              Annual
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: annual ? "rgba(255,255,255,0.2)" : "#526056", color: "#fff" }}>
                Save 20%+
              </span>
            </button>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map((plan) => {
            const isFeatured = plan.featured;
            const price = annual && !plan.isFoundingMember ? plan.annualPrice : plan.monthlyPrice;
            const period = plan.isFoundingMember ? "/month locked forever" : annual ? "/year" : "/month";

            return (
              <div key={plan.label} className="relative flex flex-col">
                {/* Badge pill above card */}
                {plan.badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span
                      className="text-white text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1 rounded-full"
                      style={{ background: "#526056" }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div
                  className={`flex flex-col flex-1 rounded-xl p-8 border ${isFeatured ? "bg-[#363633] border-[#363633]" : "bg-card border-border"}`}
                >
                  <div className="mb-6">
                    <p className={`text-[13px] font-medium uppercase tracking-[0.08em] mb-4 ${isFeatured ? "text-white/60" : "text-muted-foreground"}`}>
                      {plan.label}
                    </p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className={`font-serif font-light text-[44px] leading-none ${isFeatured ? "text-white" : "text-foreground"}`}>
                        {price}
                      </span>
                      <span className={`text-[14px] ${isFeatured ? "text-white/60" : "text-muted-foreground"}`}>
                        {period}
                      </span>
                    </div>
                    <p className={`text-[14px] leading-relaxed ${isFeatured ? "text-white/70" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-[14px] ${isFeatured ? "text-white/90" : "text-foreground"}`}>
                        <Check size={14} className={`shrink-0 mt-0.5 ${isFeatured ? "text-white" : ""}`} style={!isFeatured ? { color: "#526056" } : {}} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <button
                      onClick={() => handleCta(plan)}
                      disabled={loading === plan.label}
                      className="w-full py-3 rounded-lg text-[14px] font-medium transition-colors disabled:opacity-60"
                      style={
                        isFeatured
                          ? { background: "#526056", color: "#fff" }
                          : plan.isWaitlist
                          ? { background: "#526056", color: "#fff" }
                          : { border: "1px solid #526056", color: "#526056" }
                      }
                    >
                      {loading === plan.label ? "Loading…" : plan.cta}
                    </button>
                    {plan.badgeNote && (
                      <p className="text-[12px] text-muted-foreground text-center mt-2">{plan.badgeNote}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-[13px]" style={{ color: "#897866" }}>
          All plans include a 7-day free trial. No credit card required.
        </p>
      </main>

      <footer className="px-6 text-center" style={{ borderTop: "0.5px solid #DADCD9", paddingTop: "32px", paddingBottom: "32px" }}>
        <p className="text-[12px]" style={{ color: "#CBD0CA" }}>
          Wellcast Studio · Built by Aligned Marketing Co.
        </p>
      </footer>
    </div>
  );
}
