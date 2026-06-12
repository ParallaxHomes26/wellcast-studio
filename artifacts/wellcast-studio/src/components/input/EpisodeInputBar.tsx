import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type InputMethod = "transcript" | "details" | "url";

interface EpisodeInputBarProps {
  requireAuth?: boolean;
  onGenerate?: (
    inputMethod: InputMethod,
    inputData: Record<string, unknown>,
    cta: string
  ) => void;
}

const HEALTH_NICHES = [
  "Women's Health", "Hormones", "Fertility", "Pregnancy", "Birth", "Postpartum",
  "Motherhood", "Pediatric Health", "Men's Health", "Mental Health", "Anxiety & Stress",
  "Trauma & Healing", "Relationships", "Eating & Body Image", "Sleep", "Fatigue & Energy",
  "Thyroid", "Adrenal Health", "Blood Sugar & Metabolic", "Gut Health & Digestion",
  "Nutrition", "Anti-Inflammatory", "Autoimmune", "Chronic Illness", "Chronic Pain",
  "Nervous System", "Functional Medicine", "Integrative Wellness", "Naturopathic",
  "Herbal Medicine", "Detox & Cleansing", "Fitness & Movement", "Yoga & Mindfulness",
  "Longevity & Aging", "Skin Health", "Cycle Syncing", "Perimenopause", "Menopause",
  "Endometriosis", "PCOS", "Infertility", "Miscarriage & Loss", "Breastfeeding",
  "Child Development", "Neurodivergence", "Addiction & Recovery", "Grief & Loss",
  "Spiritual Wellness", "General Wellness",
];

export default function EpisodeInputBar({ requireAuth = false, onGenerate }: EpisodeInputBarProps) {
  const [activeTab, setActiveTab] = useState<InputMethod>("transcript");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Transcript tab
  const [transcript, setTranscript] = useState("");

  // Details tab
  const [topic, setTopic] = useState("");
  const [quote, setQuote] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestCredentials, setGuestCredentials] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [idealListener, setIdealListener] = useState("");

  // URL tab
  const [url, setUrl] = useState("");

  // Shared
  const [cta, setCta] = useState("");

  const ctaRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    setValidationError("");

    if (requireAuth) {
      setShowAuthModal(true);
      return;
    }

    if (!onGenerate) return;

    // Input validation
    if (activeTab === "transcript" && !transcript.trim()) {
      setValidationError("Please paste your episode transcript before generating.");
      return;
    }
    if (activeTab === "details" && !topic.trim()) {
      setValidationError("Please enter an episode topic before generating.");
      return;
    }
    if (activeTab === "url" && !url.trim()) {
      setValidationError("Please enter an episode URL before generating.");
      return;
    }

    const ctaValue = ctaRef.current?.value ?? cta;

    if (activeTab === "transcript") {
      onGenerate("transcript", { transcript }, ctaValue);
    } else if (activeTab === "details") {
      onGenerate("details", {
        topic,
        quote,
        guest_name: guestName,
        guest_credentials: guestCredentials,
        key_points: keyPoints,
        ideal_listener: idealListener,
        health_niches: selectedNiches,
      }, ctaValue);
    } else if (activeTab === "url") {
      onGenerate("url", { url }, ctaValue);
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
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-[180px] border-0 p-0 text-[14px] leading-[1.7] focus-visible:ring-0 resize-y shadow-none bg-transparent"
              placeholder="Paste your full episode transcript here — raw text, timestamps and speaker labels included. We handle the rest."
            />
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="topic">Episode topic</Label>
                  <Input
                    id="topic"
                    data-testid="input-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quote">Memorable quote</Label>
                  <Input
                    id="quote"
                    data-testid="input-quote"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guest-name">Guest name (optional)</Label>
                  <Input
                    id="guest-name"
                    data-testid="input-guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guest-credentials">Guest credentials (optional)</Label>
                  <Input
                    id="guest-credentials"
                    data-testid="input-guest-credentials"
                    value={guestCredentials}
                    onChange={(e) => setGuestCredentials(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="key-points">Key points</Label>
                <Textarea
                  id="key-points"
                  data-testid="input-key-points"
                  rows={3}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ideal-listener">Ideal listener</Label>
                <Input
                  id="ideal-listener"
                  data-testid="input-ideal-listener"
                  value={idealListener}
                  onChange={(e) => setIdealListener(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Health niche</Label>
                <div className="relative">
                  <div
                    className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 pb-6"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#DADCD9 transparent" }}
                  >
                    {HEALTH_NICHES.map(niche => (
                      <button
                        key={niche}
                        data-testid={`niche-${niche.replace(/[\s&]+/g, '-').toLowerCase()}`}
                        onClick={() => toggleNiche(niche)}
                        className={`text-[12px] rounded-full px-[14px] py-1 border transition-colors shrink-0
                          ${selectedNiches.includes(niche)
                            ? "bg-accent text-white border-accent"
                            : "bg-card border-border text-[#897866] hover:border-muted-foreground"}`}
                      >
                        {niche}
                      </button>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none rounded-b" />
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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer (Shared) */}
        <div className="p-5 border-t border-border/50 bg-background/50">
          <div className="space-y-1.5 mb-3">
            <Label htmlFor="cta" className="text-muted-foreground text-xs">
              Your CTA for this episode (optional)
            </Label>
            <Input
              id="cta"
              ref={ctaRef}
              data-testid="input-cta"
              placeholder="e.g. Book a discovery call at yoursite.com — woven into every asset automatically"
              className="bg-card"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
            />
          </div>

          {validationError && (
            <p className="text-[13px] text-red-600 mb-2" data-testid="text-validation-error">
              {validationError}
            </p>
          )}

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
            <DialogTitle className="text-xl font-semibold text-center">
              See your results — start free
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              7 days free, no credit card required
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <a
              href="/signup"
              className="block w-full py-3 px-4 bg-accent text-white text-center text-[14px] font-medium rounded-lg hover:bg-accent/90 transition-colors"
              data-testid="link-modal-signup"
            >
              Create my account →
            </a>
            <a
              href="/login"
              className="block text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-modal-signin"
            >
              Already have an account? Sign in →
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
