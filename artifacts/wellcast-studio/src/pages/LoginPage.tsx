import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password. Please try again.");
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <a href="/">
            <img src="/wellcast-logo.png" alt="Wellcast" style={{ height: "48px", width: "auto", display: "inline-block" }} />
          </a>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="font-serif font-light text-[28px] text-foreground mb-2">Welcome back</h1>
          <p className="text-[14px] text-muted-foreground mb-6">Sign in to your Wellcast Studio account</p>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-red-500" : ""}
                required
                data-testid="input-password"
              />
            </div>

            {error && <p className="text-[12px] text-red-600">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-[10px] text-[14px] mt-2"
              data-testid="button-signin"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </Button>
          </form>

          <div className="mt-6 text-center text-[13px] text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:underline">
              Start free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
