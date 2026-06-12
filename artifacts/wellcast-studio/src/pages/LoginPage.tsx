import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="font-medium text-[20px] text-foreground tracking-tight inline-block hover:opacity-80 transition-opacity">
            Wellcast Studio
          </Link>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-[20px] font-semibold text-foreground mb-6">Welcome back</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">Forgot password?</a>
              </div>
              <Input id="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
              Sign in
            </Button>
          </form>
          
          <div className="mt-6 text-center text-[13px] text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:underline">
              Start your free trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}