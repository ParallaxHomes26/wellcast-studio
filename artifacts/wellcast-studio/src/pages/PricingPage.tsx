import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type BillingPeriod = "monthly" | "annual";

interface PricingTier {
  price: string;
  period: string;
  priceId: string;
  equivalent?: string;
  savings?: string;
}

interface PlanPricing {
  monthly: PricingTier;
  annual: PricingTier;
}

const pricing: Record<string, PlanPricing> = {
  basic: {
    monthly: { price: "$19", period: "/month", priceId: "price_1Ticc72Zpe8a4y2Maiz2kAz4" },
    annual:  { price: "$157", period: "/year", priceId: "price_1TicdX2Zpe8a4y2MFC1Eyahf", equivalent: "$13/mo", savings: "Save $71 vs monthly" },
  },
  starter: {
    monthly: { price: "$37", period: "/month", priceId: "price_1TiccK2Zpe8a4y2MCuAi0rWt" },
    annual:  { price: "$297", period: "/year", priceId: "price_1Ticdn2Zpe8a4y2Mlymy9XFE", equivalent: "$25/mo", savings: "Save $147 vs monthly" },
  },
  pro: {
    monthly: { price: "$57", period: "/month", priceId: "price_1TiccX2Zpe8a4y2MUYJntCer" },
    annual:  { price: "$497", period: "/year", priceId: "price_1Tice32Zpe8a4y2M6VlwtdKV", equivalent: "$41/mo", savings: "Save $187 vs monthly" },
  },
};

interface PlanConfig {
  key: string;
  label: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

const PLANS: PlanConfig[] = [
  {
    key: "basic",
    label: "Basic",
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
    key: "starter",
    label: "Starter",
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
    key: "pro",
    label: "Pro",
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
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      setLocation("/signup");
      return;
    }
    setLoading(priceId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, price_id: priceId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-background px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "none", boxShadow: "none", border: "none" }}
      >
        <Link href="/">
          <img
            src="/wellcast-logo.png"
            alt="Wellcast Studio"
            style={{ height: "80px", width: "auto" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <span className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                Dashboard
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <span className="text-[14px] text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                  Sign in
                </span>
              </Link>
              <Link href="/signup">
                <button
                  className="px-4 py-2 rounded-full text-white text-[14px] font-medium"
                  style={{ background: "#526056" }}
                >
                  Start free — 7 days
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="px-6 py-16">
        {/* Title */}
        <div className="text-center mb-4">
          <span
            className="uppercase tracking-[0.1em] text-[11px] font-semibold mb-4 block"
            style={{ color: "#526056" }}
          >
            Simple pricing
          </span>
          <h1 className="font-serif font-light text-[42px] text-foreground mb-4">
            Simple pricing for serious podcasters
          </h1>
          <p className="text-[16px] text-muted-foreground mb-8">
            Start free for 7 days. No credit card required.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              background: "#F0EFE9",
              borderRadius: "30px",
              padding: "4px",
              border: "0.5px solid #DADCD9",
            }}
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              style={{
                padding: "8px 24px",
                borderRadius: "26px",
                border: "none",
                fontSize: "13px",
                fontWeight: billingPeriod === "monthly" ? 500 : 400,
                background: billingPeriod === "monthly" ? "white" : "transparent",
                color: billingPeriod === "monthly" ? "#363633" : "#897866",
                cursor: "pointer",
                boxShadow: billingPeriod === "monthly" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              style={{
                padding: "8px 24px",
                borderRadius: "26px",
                border: "none",
                fontSize: "13px",
                fontWeight: billingPeriod === "annual" ? 500 : 400,
                background: billingPeriod === "annual" ? "white" : "transparent",
                color: billingPeriod === "annual" ? "#363633" : "#897866",
                cursor: "pointer",
                boxShadow: billingPeriod === "annual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Annual
              <span
                style={{
                  fontSize: "11px",
                  background: "#526056",
                  color: "white",
                  borderRadius: "10px",
                  padding: "2px 8px",
                }}
              >
                Save 30%+
              </span>
            </button>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isFeatured = !!plan.featured;

            // Resolve current pricing tier
            const tierData = pricing[plan.key];
            const currentPricing = tierData ? tierData[billingPeriod] : null;
            const priceId = currentPricing?.priceId ?? "";

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
                  className={`flex flex-col flex-1 rounded-xl p-8 border ${
                    isFeatured ? "bg-[#363633] border-[#363633]" : "bg-card border-border"
                  }`}
                >
                  <div className="mb-6">
                    <p
                      className={`text-[13px] font-medium uppercase tracking-[0.08em] mb-4 ${
                        isFeatured ? "text-white/60" : "text-muted-foreground"
                      }`}
                    >
                      {plan.label}
                    </p>

                    {/* Price display */}
                    {currentPricing ? (
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                          <span
                            style={{
                              fontSize: "42px",
                              fontFamily: "Georgia, serif",
                              fontWeight: 300,
                              color: isFeatured ? "white" : "#363633",
                              lineHeight: 1,
                            }}
                          >
                            {currentPricing.price}
                          </span>
                          <span style={{ fontSize: "16px", color: isFeatured ? "rgba(255,255,255,0.6)" : "#897866" }}>
                            {currentPricing.period}
                          </span>
                        </div>

                        {/* Annual savings info */}
                        {billingPeriod === "annual" && currentPricing.equivalent && (
                          <div style={{ marginTop: "6px" }}>
                            <div style={{ fontSize: "13px", color: isFeatured ? "rgba(255,255,255,0.5)" : "#897866" }}>
                              {currentPricing.equivalent} billed annually
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#526056",
                                background: isFeatured ? "rgba(255,255,255,0.1)" : "#EEF1EE",
                                borderRadius: "4px",
                                padding: "2px 8px",
                                display: "inline-block",
                                marginTop: "4px",
                              }}
                            >
                              {currentPricing.savings}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}

                    <p
                      className={`text-[14px] leading-relaxed mt-2 ${
                        isFeatured ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-[14px] ${
                          isFeatured ? "text-white/90" : "text-foreground"
                        }`}
                      >
                        <Check
                          size={14}
                          className="shrink-0 mt-0.5"
                          style={{ color: isFeatured ? "white" : "#526056" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <button
                      onClick={() => handleCheckout(priceId)}
                      disabled={loading === priceId}
                      className="w-full py-3 rounded-lg text-[14px] font-medium transition-colors disabled:opacity-60"
                      style={
                        isFeatured
                          ? { background: "#526056", color: "#fff", border: "none" }
                          : { border: "1px solid #526056", color: "#526056", background: "transparent" }
                      }
                    >
                      {loading === priceId ? "Loading…" : plan.cta}
                    </button>
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

      <footer
        className="px-6 text-center"
        style={{ borderTop: "0.5px solid #DADCD9", paddingTop: "32px", paddingBottom: "32px" }}
      >
        <p className="text-[12px]" style={{ color: "#CBD0CA" }}>
          Wellcast Studio · Built by Aligned Marketing Co.
        </p>
      </footer>
    </div>
  );
}
