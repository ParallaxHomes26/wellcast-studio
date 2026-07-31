import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // Whether the recovery session has been established from the link
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    // Supabase sends the reset link with either:
    //   • PKCE flow: ?code=<code>  (exchangeCodeForSession)
    //   • Implicit flow: #access_token=...&type=recovery  (onAuthStateChange fires PASSWORD_RECOVERY)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    let unsubscribe: (() => void) | undefined;

    if (code) {
      // PKCE flow — exchange the one-time code for a recovery session
      supabase.auth.exchangeCodeForSession(code).then(({ error: err }) => {
        if (err) {
          setSessionError("This reset link has expired or is invalid. Please request a new one.");
        } else {
          setSessionReady(true);
        }
      });
    } else {
      // Implicit flow — listen for the recovery event from the hash fragment
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setSessionReady(true);
        }
      });
      unsubscribe = () => subscription.unsubscribe();
      // If the hash is already processed, check for an existing session as a fallback
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setSessionReady(true);
      });
    }

    return () => unsubscribe?.();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setLocation("/dashboard"), 2500);
    }
  };

  // ── Error state ──────────────────────────────────────────────────────────
  if (sessionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <Link href="/" className="font-medium text-[17px] text-foreground tracking-tight inline-block hover:opacity-80 transition-opacity">
              Wellcast Studio
            </Link>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
            <p className="text-[14px] text-red-600 mb-4">{sessionError}</p>
            <Link href="/forgot-password" className="text-[14px] font-medium text-foreground hover:underline">
              Request a new reset link →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading while session is being established ────────────────────────────
  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] text-muted-foreground">Verifying your reset link…</p>
        </div>
      </div>
    );
  }

  // ── Set new password form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="font-medium text-[17px] text-foreground tracking-tight inline-block hover:opacity-80 transition-opacity">
            Wellcast Studio
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-serif font-light text-[28px] text-foreground mb-2">Set a new password</h1>
          <p className="text-[14px] text-muted-foreground mb-6">Choose a new password for your account.</p>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-[14px]">
              Password updated! Redirecting you to your dashboard…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={error ? "border-red-500" : ""}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat your new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={error ? "border-red-500" : ""}
                  required
                />
              </div>

              {error && <p className="text-[12px] text-red-600">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-[10px] text-[14px]"
              >
                {loading ? "Saving…" : "Update password →"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
