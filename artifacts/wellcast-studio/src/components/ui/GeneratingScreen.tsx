import { useEffect, useState } from "react";

const MESSAGES = [
  "Extracting your episode brief...",
  "Writing your show notes...",
  "Building your SEO strategy...",
  "Drafting your email newsletter...",
  "Creating your social content...",
  "Building your 90-day calendar...",
  "Running credibility review...",
  "Almost there...",
];

export default function GeneratingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 3;
      });
    }, 1200);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full px-6">
        <div className="font-medium text-[17px] text-foreground tracking-tight">
          Wellcast Studio
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />

          <div className="w-full bg-border rounded-full h-[3px] overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 92)}%` }}
            />
          </div>

          <div className="text-center">
            <p
              key={messageIndex}
              className="text-[15px] text-foreground font-medium animate-in fade-in duration-500"
              data-testid="text-generating-message"
            >
              {MESSAGES[messageIndex]}
            </p>
            <p className="text-[13px] text-muted-foreground mt-2">
              This takes about 60–90 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
