import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          setTimeout(() => setLocation("/login"), 3000);
          return;
        }
      }

      setLocation("/dashboard");
    };

    handleCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <p className="text-[14px] text-red-600 mb-2">Something went wrong confirming your account.</p>
          <p className="text-[13px] text-muted-foreground">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-muted-foreground">Confirming your account…</p>
      </div>
    </div>
  );
}
