import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="font-medium text-[17px] text-foreground tracking-tight inline-block hover:opacity-80 transition-opacity">
            Wellcast Studio
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-serif font-light text-[28px] text-foreground mb-2">Reset your password</h1>
          <p className="text-[14px] text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-[14px]">
              Check your email for a reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-red-500" : ""}
                  required
                  data-testid="input-email"
                />
              </div>

              {error && <p className="text-[12px] text-red-600">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-[10px] text-[14px]"
                data-testid="button-send-reset"
              >
                {loading ? "Sending…" : "Send reset link →"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-[13px] text-muted-foreground">
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
