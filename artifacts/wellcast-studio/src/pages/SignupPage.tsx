import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "First name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (authData?.user) {
      const now = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 7);

      await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName || "",
        subscription_status: "trialing",
        subscription_tier: "free_trial",
        trial_starts_at: now.toISOString(),
        trial_ends_at: trialEnd.toISOString(),
        run_count_this_month: 0,
        run_count_reset_at: now.toISOString(),
      }, { onConflict: "id" });

      window.location.href = "/dashboard";
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
          <h1 className="font-serif font-light text-[28px] text-foreground mb-2">Create your account</h1>
          <p className="text-[14px] text-muted-foreground mb-6">7-day free trial. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={fieldErrors.firstName ? "border-red-500" : ""}
                  required
                  data-testid="input-firstname"
                />
                {fieldErrors.firstName && <p className="text-[12px] text-red-600">{fieldErrors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? "border-red-500" : ""}
                  required
                  data-testid="input-email"
                />
                {fieldErrors.email && <p className="text-[12px] text-red-600">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "border-red-500" : ""}
                  required
                  data-testid="input-password"
                />
                {fieldErrors.password && <p className="text-[12px] text-red-600">{fieldErrors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldErrors.confirmPassword ? "border-red-500" : ""}
                  required
                  data-testid="input-confirm-password"
                />
                {fieldErrors.confirmPassword && <p className="text-[12px] text-red-600">{fieldErrors.confirmPassword}</p>}
              </div>

              {error && <p className="text-[12px] text-red-600">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-[10px] text-[14px] mt-2"
                data-testid="button-create-account"
              >
                {loading ? "Creating account…" : "Create my account →"}
              </Button>
            </form>

          <div className="mt-6 text-center text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
