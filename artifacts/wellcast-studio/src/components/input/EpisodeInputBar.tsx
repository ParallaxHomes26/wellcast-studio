import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EpisodeInputBarProps {
  requireAuth?: boolean;
}

const HEALTH_NICHES = [
  "Women's health",
  "Hormones",
  "Fertility",
  "Pregnancy",
  "Birth",
  "Motherhood",
  "Mental health",
  "Fitness",
  "Nutrition",
  "Integrative wellness"
];

export default function EpisodeInputBar({ requireAuth = false }: EpisodeInputBarProps) {
  const [activeTab, setActiveTab] = useState<"transcript" | "details" | "url">("transcript");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGenerate = () => {
    if (requireAuth) {
      setShowAuthModal(true);
    } else {
      // In a real app, this would submit the form and redirect
      console.log("Generating assets...");
    }
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  return (
    <>
      <div className="w-full max-w-[720px] mx-auto bg-card rounded-2xl border border-border shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["transcript", "details", "url"] as const).map((tab) => (
            <button
              key={tab}
              data-testid={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-[13px] font-medium py-[14px] px-5 transition-colors relative
                ${activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "transcript" && "Paste transcript"}
              {tab === "details" && "Enter details"}
              {tab === "url" && "Episode URL"}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === "transcript" && (
            <Textarea
              data-testid="input-transcript"
              className="min-h-[180px] border-0 p-0 text-[14px] leading-[1.7] focus-visible:ring-0 resize-y shadow-none bg-transparent"
              placeholder="Paste your full episode transcript here — raw text, timestamps and speaker labels included. We handle the rest."
            />
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="topic">Episode topic</Label>
                  <Input id="topic" data-testid="input-topic" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quote">Memorable quote</Label>
                  <Input id="quote" data-testid="input-quote" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guest-name">Guest name (optional)</Label>
                  <Input id="guest-name" data-testid="input-guest-name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guest-credentials">Guest credentials (optional)</Label>
                  <Input id="guest-credentials" data-testid="input-guest-credentials" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="key-points">Key points</Label>
                <Textarea id="key-points" data-testid="input-key-points" rows={3} />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="ideal-listener">Ideal listener</Label>
                <Input id="ideal-listener" data-testid="input-ideal-listener" />
              </div>

              <div className="space-y-2">
                <Label>Health niche</Label>
                <div className="flex flex-wrap gap-2">
                  {HEALTH_NICHES.map(niche => (
                    <button
                      key={niche}
                      data-testid={`niche-${niche.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => toggleNiche(niche)}
                      className={`text-[12px] rounded-full px-[14px] py-1 border transition-colors
                        ${selectedNiches.includes(niche) 
                          ? "bg-accent text-white border-accent" 
                          : "border-border text-foreground hover:border-muted-foreground"}`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "url" && (
            <div className="flex gap-2 min-h-[180px] items-start pt-4">
              <Input 
                data-testid="input-url"
                placeholder="https://" 
                className="flex-1"
              />
              <Button data-testid="button-fetch-url" variant="default" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                Fetch episode →
              </Button>
            </div>
          )}
        </div>

        {/* Footer (Shared) */}
        <div className="p-5 border-t border-border/50 bg-background/50">
          <div className="space-y-1.5 mb-3">
            <Label htmlFor="cta" className="text-muted-foreground text-xs">Your CTA for this episode (optional)</Label>
            <Input 
              id="cta"
              data-testid="input-cta"
              placeholder="e.g. Book a discovery call at yoursite.com — woven into every asset automatically" 
              className="bg-card"
            />
          </div>
          
          <Button 
            data-testid="button-generate"
            onClick={handleGenerate}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-[10px] text-[15px] font-medium"
          >
            Generate 26 assets →
          </Button>
        </div>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">See your results — start free</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              14 days free, no credit card required
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="modal-email">Email address</Label>
              <Input id="modal-email" type="email" placeholder="you@example.com" />
            </div>
            <Button className="w-full bg-accent text-white hover:bg-accent/90">
              Create my account →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}