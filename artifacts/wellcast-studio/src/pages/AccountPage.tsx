import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

export default function AccountPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-foreground mb-2">Account Settings</h1>
        <p className="text-[15px] text-muted-foreground">
          Manage your profile, subscription, and billing preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-[18px] font-medium text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="jane@example.com" disabled />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-medium text-foreground">Subscription</h2>
            <span className="px-3 py-1 bg-accent/10 text-accent text-[12px] font-medium rounded-full border border-accent/20">
              Pro Plan
            </span>
          </div>
          
          <div className="bg-background rounded-lg border border-border p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-[15px]">Wellcast Pro — Monthly</span>
              <span className="font-medium text-[15px]">$49 / mo</span>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Your next billing date is October 14, 2024.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">Manage Billing</Button>
            <Button variant="ghost" className="text-muted-foreground">Cancel Subscription</Button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-destructive/20 rounded-xl p-6 bg-destructive/5">
          <h2 className="text-[18px] font-medium text-destructive mb-2 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" /> Danger Zone
          </h2>
          <p className="text-[14px] text-muted-foreground mb-4">
            Permanently delete your account and all generated episode runs. This action cannot be undone.
          </p>
          <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            Delete Account
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
}