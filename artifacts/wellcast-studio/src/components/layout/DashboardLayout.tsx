import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plus, BookOpen, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  const displayName =
    user?.user_metadata?.first_name ?? user?.email ?? "";

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Plus, label: "New Run", href: "/new-run" },
    { icon: BookOpen, label: "Episode History", href: "/dashboard#history" },
    { icon: User, label: "Account", href: "/account" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-[220px] bg-sidebar border-r border-sidebar-border hidden md:flex flex-col shrink-0">
        <div className="h-[60px] flex items-center px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center">
            <img
              src="/api/storage/public-objects/wellcast-logo.png"
              alt="Wellcast Studio"
              className="h-7 w-auto"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = "none";
                const span = document.createElement("span");
                span.className = "font-medium text-[16px] text-sidebar-foreground tracking-tight";
                span.textContent = "Wellcast Studio";
                img.parentNode?.appendChild(span);
              }}
            />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location === item.href ||
              (location.startsWith("/run/") && item.label === "Episode History");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors
                  ${isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/5"}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[60px] bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden">
            <img
              src="/api/storage/public-objects/wellcast-logo.png"
              alt="Wellcast Studio"
              className="h-6 w-auto"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = "none";
                const span = document.createElement("span");
                span.className = "font-medium text-[16px] text-foreground tracking-tight";
                span.textContent = "Wellcast Studio";
                img.parentNode?.appendChild(span);
              }}
            />
          </div>
          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            {displayName && (
              <span className="text-[13px] text-muted-foreground font-medium hidden sm:inline-block" data-testid="text-user-display">
                {displayName}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground h-8 text-[13px]"
              data-testid="button-signout"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
