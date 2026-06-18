import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { API_BASE } from "@/lib/api";

const PRICES = {
  basic: {
    monthly: { amount: "$19", period: "/month", id: "price_1TjSgPF156FzNQDF9bcVsX6f" },
    annual:  { amount: "$157", period: "/year", id: "price_1TjSidF156FzNQDFITPhzSD3", equiv: "$13/mo billed annually", savings: "Save $71" },
  },
  starter: {
    monthly: { amount: "$37", period: "/month", id: "price_1TjSgxF156FzNQDFONqDK2No" },
    annual:  { amount: "$297", period: "/year", id: "price_1TjSj8F156FzNQDFrBPIhfxO", equiv: "$25/mo billed annually", savings: "Save $147" },
  },
  pro: {
    monthly: { amount: "$57", period: "/month", id: "price_1TjShMF156FzNQDFUpE8iDQh" },
    annual:  { amount: "$497", period: "/year", id: "price_1TjSjeF156FzNQDFOq8mvAJS", equiv: "$41/mo billed annually", savings: "Save $187" },
  },
};

function CheckGreen() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
      <path d="M2 7L5.5 10.5L12 4" stroke="#526056" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        alert("Your session has expired. Please sign in again.");
        setLocation("/login");
        return;
      }
      const accessToken = sessionData.session.access_token;

      const res = await fetch(`${API_BASE}/api/stripe/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: user.id, price_id: priceId, is_founding_member: false }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Checkout error", res.status, text);
        alert(`Something went wrong (${res.status}). Please try again.`);
        return;
      }

      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Checkout exception", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F3F2EE", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @media (max-width: 767px) {
          .wc-pricing-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
          .wc-pricing-h1 { font-size: 28px !important; }
          .wc-pricing-header { flex-wrap: wrap; gap: 8px; }
          .wc-pricing-header-nav { display: none !important; }
          .wc-pricing-content { padding: 40px 20px !important; }
        }
      `}</style>

      {/* Header */}
      <header className="wc-pricing-header" style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid #DADCD9" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/wellcast-logo.png" alt="Wellcast" style={{ height: "80px", width: "auto" }} />
        </Link>
        <div className="wc-pricing-header-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {user ? (
            <Link href="/dashboard" style={{ fontSize: "14px", color: "#897866", textDecoration: "none" }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: "14px", color: "#897866", textDecoration: "none" }}>Sign in</Link>
              <Link href="/signup" style={{ fontSize: "14px", background: "#526056", color: "white", padding: "8px 18px", borderRadius: "20px", textDecoration: "none" }}>
                Start free — 7 days
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Page content */}
      <div className="wc-pricing-content" style={{ maxWidth: "960px", margin: "0 auto", padding: "64px 24px" }}>

        {/* Eyebrow */}
        <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#897866", marginBottom: "12px" }}>
          Simple pricing
        </p>

        {/* Headline */}
        <h1 className="wc-pricing-h1" style={{ textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "42px", color: "#363633", lineHeight: 1.2, marginBottom: "12px" }}>
          Get started today for $19/month —{" "}
          <span style={{ whiteSpace: "nowrap" }}>or scale up as you grow.</span>
        </h1>

        {/* Subline */}
        <p style={{ textAlign: "center", fontSize: "15px", color: "#897866", marginBottom: "40px" }}>
          No contracts. Cancel anytime.
        </p>

        {/* Monthly / Annual toggle */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", background: "#ECEAE4", borderRadius: "30px", padding: "4px", border: "0.5px solid #DADCD9" }}>
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              style={{
                padding: "8px 28px", borderRadius: "26px", border: "none", cursor: "pointer",
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
                padding: "8px 28px", borderRadius: "26px", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: billing === "annual" ? 500 : 400,
                background: billing === "annual" ? "white" : "transparent",
                color: billing === "annual" ? "#363633" : "#897866",
                boxShadow: billing === "annual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              Annual
              <span style={{ fontSize: "11px", background: "#526056", color: "white", borderRadius: "10px", padding: "2px 8px" }}>
                Save 30%+
              </span>
            </button>
          </div>
        </div>

        {/* Cards — 3 columns */}
        <div className="wc-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" }}>

          {/* Basic */}
          <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Basic</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{PRICES.basic[billing].amount}</span>
              <span style={{ fontSize: "15px", color: "#897866" }}>{PRICES.basic[billing].period}</span>
            </div>
            {billing === "annual" && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "12px", color: "#897866" }}>{PRICES.basic.annual.equiv}</p>
                <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{PRICES.basic.annual.savings}</span>
              </div>
            )}
            <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
              Perfect for podcasters just getting started
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {["2 episode runs per month", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Email support"].map((f) => (
                <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckGreen /><span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleCheckout(PRICES.basic[billing].id)}
              disabled={loading === PRICES.basic[billing].id}
              style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: loading === PRICES.basic[billing].id ? "not-allowed" : "pointer" }}
            >
              {loading === PRICES.basic[billing].id ? "Loading..." : "Start 7-day free trial"}
            </button>
          </div>

          {/* Starter */}
          <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Starter</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{PRICES.starter[billing].amount}</span>
              <span style={{ fontSize: "15px", color: "#897866" }}>{PRICES.starter[billing].period}</span>
            </div>
            {billing === "annual" && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "12px", color: "#897866" }}>{PRICES.starter.annual.equiv}</p>
                <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{PRICES.starter.annual.savings}</span>
              </div>
            )}
            <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
              For podcasters publishing consistently
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {["4 episode runs per month", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Episode Confidence Score", "Email support"].map((f) => (
                <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckGreen /><span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleCheckout(PRICES.starter[billing].id)}
              disabled={loading === PRICES.starter[billing].id}
              style={{ width: "100%", padding: "12px", border: "1px solid #526056", borderRadius: "8px", background: "transparent", color: "#526056", fontSize: "14px", fontWeight: 500, cursor: loading === PRICES.starter[billing].id ? "not-allowed" : "pointer" }}
            >
              {loading === PRICES.starter[billing].id ? "Loading..." : "Start 7-day free trial"}
            </button>
          </div>

          {/* Pro — white card, matching Basic and Starter */}
          <div style={{ background: "white", border: "0.5px solid #DADCD9", borderRadius: "12px", padding: "32px 28px", position: "relative" }}>
            <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#526056", color: "white", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: "12px", whiteSpace: "nowrap" }}>
              Most popular
            </div>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#897866", marginBottom: "16px" }}>Pro</p>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "42px", fontWeight: 300, color: "#363633" }}>{PRICES.pro[billing].amount}</span>
              <span style={{ fontSize: "15px", color: "#897866" }}>{PRICES.pro[billing].period}</span>
            </div>
            {billing === "annual" && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "12px", color: "#897866" }}>{PRICES.pro.annual.equiv}</p>
                <span style={{ fontSize: "11px", color: "#526056", background: "#EEF1EE", borderRadius: "4px", padding: "2px 8px", display: "inline-block", marginTop: "4px" }}>{PRICES.pro.annual.savings}</span>
              </div>
            )}
            <p style={{ fontSize: "13px", color: "#897866", marginBottom: "24px", marginTop: billing === "monthly" ? "16px" : "0" }}>
              For podcasters serious about growth
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {["Unlimited episode runs", "All 26 assets per run", "SEO optimization", "90-day repurposing calendar", "Episode Confidence Score", "Clinical Credibility Guard", "Listener Transformation Statement", "Guest share package", "Priority support"].map((f) => (
                <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckGreen /><span style={{ fontSize: "13px", color: "#363633" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleCheckout(PRICES.pro[billing].id)}
              disabled={loading === PRICES.pro[billing].id}
              style={{ width: "100%", padding: "12px", border: "none", borderRadius: "8px", background: "#526056", color: "white", fontSize: "14px", fontWeight: 500, cursor: loading === PRICES.pro[billing].id ? "not-allowed" : "pointer" }}
            >
              {loading === PRICES.pro[billing].id ? "Loading..." : "Start 7-day free trial"}
            </button>
          </div>

        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#897866", marginTop: "32px" }}>
          All plans include a 7-day free trial. No credit card required.
        </p>

      </div>
    </div>
  );
}
