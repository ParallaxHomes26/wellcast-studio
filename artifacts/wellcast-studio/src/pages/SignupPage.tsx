import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [, setLocation] = useLocation();

  const handleSignup = (e: React.FormEvent) => {
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
          <h1 className="text-[20px] font-semibold text-foreground mb-2">Start your 14-day free trial</h1>
          <p className="text-[14px] text-muted-foreground mb-6">No credit card required.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Jane Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90 mt-2">
              Create account →
            </Button>
          </form>
          
          <div className="mt-6 text-center text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}