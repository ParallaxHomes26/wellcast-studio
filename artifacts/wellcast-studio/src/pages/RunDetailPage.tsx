import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ClipboardList,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Assets = Record<string, unknown>;

interface RunData {
  run_id: string;
  episode_title: string;
  assets: Assets;
}

type TabId =
  | "publishing"
  | "email"
  | "social"
  | "trailers"
  | "amplification"
  | "strategy"
  | "intelligence";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asR = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};

function bullets(items: unknown[]): string {
  return items.map((i) => `• ${str(i)}`).join("\n");
}

// ─── Signal pill ──────────────────────────────────────────────────────────────

function SignalPill({ signal }: { signal: string }) {
  const s = signal.toUpperCase();
  let cls = "bg-green-100 text-green-700";
  if (s.includes("CAUTION") || s.includes("AMBER") || s.includes("AVERAGE"))
    cls = "bg-amber-100 text-amber-700";
  if (s.includes("RISK") || s.includes("LOW") || s.includes("POOR"))
    cls = "bg-red-100 text-red-700";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {signal}
    </span>
  );
}

// ─── Asset section ────────────────────────────────────────────────────────────

function AssetSection({
  label,
  copyText,
  children,
}: {
  label: string;
  copyText: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText.trim()) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="py-5 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.1em]"
          style={{ color: "#897866" }}
        >
          {label}
        </span>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="print:hidden flex items-center gap-[5px] text-[11px] transition-all"
          style={{
            padding: "4px 10px",
            border: "0.5px solid #DADCD9",
            borderRadius: "6px",
            background: copied ? "#526056" : "white",
            color: copied ? "white" : "#897866",
            cursor: "pointer",
          }}
        >
          {copied ? (
            <><Check className="h-3 w-3" /> Copied</>
          ) : (
            <><Copy className="h-3 w-3" /> Copy</>
          )}
        </button>
      </div>
      <div className="text-[13px] text-foreground leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Tab: Publishing & SEO ────────────────────────────────────────────────────

function PublishingTab({ assets }: { assets: Assets }) {
  const seo = asR(assets.seo_titles);
  const sn = asR(assets.show_notes);
  const blog = asR(assets.blog_skeleton);
  const yt = asR(asR(assets.platforms).youtube);
  const pin = asR(asR(assets.platforms).pinterest);

  // SEO
  const seoCopy = [
    seo.recommended_title ? `⭐ Recommended: ${str(seo.recommended_title)}` : "",
    seo.recommended_reason ? str(seo.recommended_reason) : "",
    arr(seo.title_variations).length
      ? "\nAll Variations:\n" +
        arr(seo.title_variations)
          .map((v, i) => {
            const vr = asR(v);
            return `${i + 1}. [${str(vr.formula)}] ${str(vr.title)}\n   ${str(vr.why)}`;
          })
          .join("\n")
      : "",
    arr(seo.apple_keywords).length
      ? `\nApple Podcasts: ${arr(seo.apple_keywords).map(str).join(", ")}`
      : "",
    arr(seo.spotify_keywords).length
      ? `Spotify: ${arr(seo.spotify_keywords).map(str).join(", ")}`
      : "",
    seo.short_description ? `\nShort Description: ${str(seo.short_description)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Show Notes
  const snParts = [
    sn.hook_sentence ? str(sn.hook_sentence) : "",
    sn.full_summary ? "\n" + str(sn.full_summary) : "",
    arr(sn.what_youll_learn).length
      ? "\nWhat You'll Learn:\n" + bullets(arr(sn.what_youll_learn))
      : "",
    sn.pull_quote ? `\n💬 "${str(sn.pull_quote)}"` : "",
    sn.cta_block ? "\n" + str(sn.cta_block) : "",
  ].filter(Boolean);
  const snCopy = snParts.join("\n").trim();

  // Blog
  const blogSections = arr(blog.sections)
    .map((s) => {
      const sr = asR(s);
      const h3s = arr(sr.h3_subsections)
        .map((h) => `    ### ${str(asR(h).h3)}`)
        .join("\n");
      return `## ${str(sr.h2)}\n${str(sr.writing_direction) ? "   " + str(sr.writing_direction) : ""}${h3s ? "\n" + h3s : ""}`;
    })
    .join("\n\n");
  const faqs = arr(blog.faq)
    .map((f) => {
      const fr = asR(f);
      return `Q: ${str(fr.question)}\nA: ${str(fr.answer)}`;
    })
    .join("\n\n");
  const blogCopy = [
    blog.h1 ? `H1: ${str(blog.h1)}` : "",
    blog.meta_description ? `Meta: ${str(blog.meta_description)}` : "",
    blog.target_keyword ? `Target Keyword: ${str(blog.target_keyword)}` : "",
    blog.word_count_target ? `Word Count Target: ${str(blog.word_count_target)}` : "",
    blogSections ? "\n" + blogSections : "",
    faqs ? "\nFAQ:\n" + faqs : "",
  ]
    .filter(Boolean)
    .join("\n");

  // YouTube
  const ytCopy = [
    yt.above_fold ? `Above Fold:\n${str(yt.above_fold)}` : "",
    yt.full_description ? `\nFull Description:\n${str(yt.full_description)}` : "",
    arr(yt.keywords).length ? `\nKeywords: ${arr(yt.keywords).map(str).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Pinterest
  const pinCopy = [
    pin.pin_title ? `Title: ${str(pin.pin_title)}` : "",
    pin.pin_description ? "\n" + str(pin.pin_description) : "",
    arr(pin.keywords).length ? `\nKeywords: ${arr(pin.keywords).map(str).join(", ")}` : "",
    arr(pin.board_suggestions).length
      ? `\nBoards:\n${bullets(arr(pin.board_suggestions))}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Platform keywords
  const keywordsCopy = [
    arr(seo.apple_keywords).length
      ? `Apple Podcasts:\n${arr(seo.apple_keywords).map(str).join(", ")}`
      : "",
    arr(seo.spotify_keywords).length
      ? `\nSpotify:\n${arr(seo.spotify_keywords).map(str).join(", ")}`
      : "",
    arr(yt.keywords).length
      ? `\nYouTube:\n${arr(yt.keywords).map(str).join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      {/* SEO Title */}
      <AssetSection label="SEO Title Pack" copyText={seoCopy}>
        {!!seo.recommended_title && (
          <div className="mb-3 p-3 bg-[#F0EFE9] rounded-lg border border-[#526056]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526056] mr-2">
              Recommended
            </span>
            <span className="font-semibold text-[#363633]">{str(seo.recommended_title)}</span>
            {!!seo.recommended_reason && (
              <p className="mt-1 text-[12px] text-muted-foreground">{str(seo.recommended_reason)}</p>
            )}
          </div>
        )}
        {arr(seo.title_variations).map((v, i) => {
          const vr = asR(v);
          return (
            <div key={i} className="mb-2">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-[#897866] mr-2 bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                {str(vr.formula)}
              </span>
              <span className="text-[13px]">{str(vr.title)}</span>
              {!!vr.why && <p className="text-[12px] text-[#526056] ml-0 mt-0.5">{str(vr.why)}</p>}
            </div>
          );
        })}
        {!!seo.short_description && (
          <p className="mt-3 text-[12px] text-muted-foreground border-t border-border pt-3">
            <strong>Short description:</strong> {str(seo.short_description)}
          </p>
        )}
      </AssetSection>

      {/* Show Notes */}
      <AssetSection label="Show Notes" copyText={snCopy}>
        {!!sn.hook_sentence && <p className="font-medium mb-3">{str(sn.hook_sentence)}</p>}
        {!!sn.full_summary && <p className="text-[#363633] mb-3">{str(sn.full_summary)}</p>}
        {arr(sn.what_youll_learn).length > 0 && (
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              What You'll Learn
            </p>
            <ul className="space-y-1">
              {arr(sn.what_youll_learn).map((item, i) => (
                <li key={i} className="flex gap-2 text-[13px]">
                  <span className="text-[#526056] font-bold shrink-0">•</span>
                  <span className="text-[#363633]">{str(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!sn.pull_quote && (
          <blockquote className="border-l-2 border-[#526056] pl-3 italic text-muted-foreground my-3">
            "{str(sn.pull_quote)}"
          </blockquote>
        )}
        {!!sn.cta_block && <p className="text-[13px] text-[#363633]">{str(sn.cta_block)}</p>}
      </AssetSection>

      {/* Blog Skeleton */}
      <AssetSection label="Blog Skeleton" copyText={blogCopy}>
        {!!blog.h1 && <p className="font-semibold text-[15px] mb-1">{str(blog.h1)}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#363633] mb-3">
          {!!blog.meta_description && <span><strong>Meta:</strong> {str(blog.meta_description)}</span>}
          {!!blog.target_keyword && <span><strong>Keyword:</strong> {str(blog.target_keyword)}</span>}
          {!!blog.word_count_target && <span><strong>Target:</strong> {str(blog.word_count_target)} words</span>}
        </div>
        {arr(blog.sections).map((s, i) => {
          const sr = asR(s);
          return (
            <div key={i} className="mb-3">
              <p className="font-medium text-[13px]">H2: {str(sr.h2)}</p>
              {!!sr.writing_direction && (
                <p className="text-[12px] text-muted-foreground ml-3">{str(sr.writing_direction)}</p>
              )}
              {arr(sr.h3_subsections).map((h, j) => (
                <p key={j} className="text-[12px] text-muted-foreground ml-6">↳ {str(asR(h).h3)}</p>
              ))}
            </div>
          );
        })}
        {arr(blog.faq).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#363633] mb-2">FAQ</p>
            {arr(blog.faq).map((f, i) => {
              const fr = asR(f);
              return (
                <div key={i} className="mb-2">
                  <p className="font-medium text-[12px]">Q: {str(fr.question)}</p>
                  <p className="text-[12px] text-muted-foreground">A: {str(fr.answer)}</p>
                </div>
              );
            })}
          </div>
        )}
      </AssetSection>

      {/* YouTube */}
      <AssetSection label="YouTube Description" copyText={ytCopy}>
        {!!yt.above_fold && (
          <div className="mb-3 p-3 bg-[#F0EFE9] rounded border border-[#526056]/20">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#526056] mb-1">Above Fold</p>
            <pre className="whitespace-pre-wrap font-sans text-[13px]">{str(yt.above_fold)}</pre>
          </div>
        )}
        {!!yt.full_description && (
          <pre className="whitespace-pre-wrap font-sans text-[13px] text-[#363633]">
            {str(yt.full_description)}
          </pre>
        )}
        {arr(yt.keywords).length > 0 && (
          <p className="mt-2 text-[12px] text-muted-foreground border-t border-border pt-2">
            <strong>Keywords:</strong> {arr(yt.keywords).map(str).join(", ")}
          </p>
        )}
      </AssetSection>

      {/* Pinterest */}
      <AssetSection label="Pinterest" copyText={pinCopy}>
        {!!pin.pin_title && <p className="font-semibold mb-2">{str(pin.pin_title)}</p>}
        {!!pin.pin_description && <p className="text-[#363633] mb-2">{str(pin.pin_description)}</p>}
        {arr(pin.keywords).length > 0 && (
          <p className="text-[12px] text-muted-foreground">
            <strong>Keywords:</strong> {arr(pin.keywords).map(str).join(", ")}
          </p>
        )}
        {arr(pin.board_suggestions).length > 0 && (
          <div className="mt-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Boards</p>
            <ul className="space-y-0.5">
              {arr(pin.board_suggestions).map((b, i) => (
                <li key={i} className="text-[12px] text-muted-foreground">• {str(b)}</li>
              ))}
            </ul>
          </div>
        )}
      </AssetSection>

      {/* Platform Keywords */}
      <AssetSection label="Platform Keywords" copyText={keywordsCopy}>
        {[
          { label: "Apple Podcasts", items: arr(seo.apple_keywords) },
          { label: "Spotify", items: arr(seo.spotify_keywords) },
          { label: "YouTube", items: arr(yt.keywords) },
        ].map(({ label, items }) =>
          items.length ? (
            <div key={label} className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map(str).map((kw, i) => (
                  <span key={i} className="text-[12px] bg-[#F0EFE9] text-[#526056] px-2 py-0.5 rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        )}
      </AssetSection>
    </>
  );
}

// ─── Tab: Email ───────────────────────────────────────────────────────────────

function EmailTab({ assets }: { assets: Assets }) {
  const em = asR(assets.email);
  const sl = asR(em.subject_lines);
  const recommended = str(sl.recommended);

  const subjectOptions = [
    { key: "direct", label: "Direct" },
    { key: "curiosity", label: "Curiosity" },
    { key: "story", label: "Story" },
  ];

  const subjectCopy = subjectOptions
    .filter(({ key }) => sl[key])
    .map(({ key, label }) => `${label}${key === recommended ? " ⭐" : ""}: ${str(sl[key])}`)
    .join("\n");

  const guestEmail = str(em.guest_email);
  const isGuest = guestEmail.length > 10;

  return (
    <>
      <AssetSection label="Subject Lines" copyText={subjectCopy}>
        {subjectOptions.map(({ key, label }) =>
          sl[key] ? (
            <div key={key} className="mb-2 flex items-start gap-2">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded mt-0.5">
                {label}
              </span>
              <span className="text-[13px]">
                {str(sl[key])}
                {key === recommended && (
                  <span className="ml-2 text-[10px] font-bold text-[#526056]">⭐ Recommended</span>
                )}
              </span>
            </div>
          ) : null
        )}
      </AssetSection>

      {!!em.preview_text && (
        <AssetSection label="Preview Text" copyText={str(em.preview_text)}>
          <p className="text-[13px]">{str(em.preview_text)}</p>
        </AssetSection>
      )}

      {!!em.full_email && (
        <AssetSection label="Full Email Newsletter" copyText={str(em.full_email)}>
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
            {str(em.full_email)}
          </pre>
        </AssetSection>
      )}

      <AssetSection
        label="Guest Thank-You Email"
        copyText={isGuest ? guestEmail : "Not applicable for solo episodes."}
      >
        {isGuest ? (
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
            {guestEmail}
          </pre>
        ) : (
          <p className="text-[13px] text-muted-foreground italic">
            Not applicable — solo episode.
          </p>
        )}
      </AssetSection>
    </>
  );
}

// ─── Tab: Social Media ────────────────────────────────────────────────────────

function SocialTab({ assets }: { assets: Assets }) {
  const social = asR(assets.social);
  const captions = asR(social.captions);
  const hashtags = asR(social.hashtags);
  const car = asR(assets.carousel);
  const hooks = asR(assets.hooks);
  const amp = asR(assets.amplification);

  const captionOptions = [
    { key: "story_open", label: "Launch Day" },
    { key: "insight_hook", label: "Mid-Week Educational" },
    { key: "direct_address", label: "Stories & Reels" },
  ];
  const captionCopy = captionOptions
    .filter(({ key }) => captions[key])
    .map(({ key, label }) => `${label}:\n${str(captions[key])}`)
    .join("\n\n");

  const hashtagCopy = [
    hashtags.recommended_stack ? `Copy-Paste Stack:\n${str(hashtags.recommended_stack)}` : "",
    arr(hashtags.tier_1_broad).length
      ? `\nTier 1 — Broad:\n${arr(hashtags.tier_1_broad).map(str).join("  ")}`
      : "",
    arr(hashtags.tier_2_niche).length
      ? `\nTier 2 — Niche:\n${arr(hashtags.tier_2_niche).map(str).join("  ")}`
      : "",
    arr(hashtags.tier_3_micro).length
      ? `\nTier 3 — Micro:\n${arr(hashtags.tier_3_micro).map(str).join("  ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const carouselCopy = arr(car.slides)
    .map((s) => {
      const sr = asR(s);
      return `Slide ${str(sr.slide_number)} [${str(sr.type)}]\n${str(sr.headline)}\n${str(sr.body)}`;
    })
    .join("\n\n");

  const hooksCopy = arr(hooks.reel_hooks)
    .map((h, i) => {
      const hr = asR(h);
      return `${i + 1}. [${str(hr.formula)}]\n${str(hr.hook)}\nUse for: ${str(hr.use_for)}`;
    })
    .join("\n\n");

  const engagementPrompts = arr(asR(amp.audience_engagement_prompts ?? {}).prompts ?? amp.audience_engagement_prompts);

  return (
    <>
      <AssetSection label="Instagram Captions" copyText={captionCopy}>
        {captionOptions.map(({ key, label }) =>
          captions[key] ? (
            <div key={key} className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#897866] mb-1">
                {label}
              </p>
              <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                {str(captions[key])}
              </pre>
            </div>
          ) : null
        )}
        {!!social.instagram_seo_note && (
          <p className="text-[12px] text-muted-foreground border-t border-border pt-2 mt-2 italic">
            {str(social.instagram_seo_note)}
          </p>
        )}
      </AssetSection>

      <AssetSection label="Hashtag Strategy" copyText={hashtagCopy}>
        {!!hashtags.recommended_stack && (
          <div className="mb-4 p-3 bg-[#F0EFE9] rounded border border-[#526056]/20 font-mono text-[12px] leading-relaxed">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#526056] mb-1 font-sans">
              📋 Copy-Paste Stack
            </p>
            {str(hashtags.recommended_stack)}
          </div>
        )}
        {[
          { key: "tier_1_broad", label: "Tier 1 — Broad (100k–2M)" },
          { key: "tier_2_niche", label: "Tier 2 — Niche (10k–100k)" },
          { key: "tier_3_micro", label: "Tier 3 — Micro (1k–10k)" },
        ].map(({ key, label }) =>
          arr(hashtags[key]).length ? (
            <div key={key} className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {arr(hashtags[key]).map(str).map((tag, i) => (
                  <span key={i} className="text-[12px] text-muted-foreground bg-background border border-border px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        )}
      </AssetSection>

      <AssetSection label="Carousel Copy" copyText={carouselCopy}>
        {!!car.carousel_title && (
          <p className="font-medium mb-3">{str(car.carousel_title)}</p>
        )}
        {arr(car.slides).map((s) => {
          const sr = asR(s);
          return (
            <div key={str(sr.slide_number)} className="mb-4 pl-3 border-l-2 border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#526056]">
                  Slide {str(sr.slide_number)}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                  {str(sr.type)}
                </span>
              </div>
              <p className="font-medium text-[13px]">{str(sr.headline)}</p>
              <p className="text-[13px] text-[#363633] mt-0.5">{str(sr.body)}</p>
              {!!sr.design_note && (
                <p className="text-[11px] italic text-muted-foreground/70 mt-1">
                  Design: {str(sr.design_note)}
                </p>
              )}
            </div>
          );
        })}
        {!!car.short_caption && (
          <p className="text-[12px] text-muted-foreground border-t border-border pt-2">
            <strong>Caption:</strong> {str(car.short_caption)}
          </p>
        )}
      </AssetSection>

      <AssetSection label="Reel Hooks" copyText={hooksCopy}>
        {arr(hooks.reel_hooks).map((h, i) => {
          const hr = asR(h);
          return (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[13px] text-[#526056]">{i + 1}.</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                  {str(hr.formula)}
                </span>
              </div>
              <p className="text-[13px] font-medium mb-0.5">{str(hr.hook)}</p>
              <p className="text-[12px] text-muted-foreground">Use for: {str(hr.use_for)}</p>
              {!!hr.scroll_stop_mechanism && (
                <p className="text-[11px] italic text-muted-foreground/70 mt-0.5">
                  {str(hr.scroll_stop_mechanism)}
                </p>
              )}
            </div>
          );
        })}
      </AssetSection>

      {engagementPrompts.length > 0 && (
        <AssetSection
          label="Audience Engagement Prompts"
          copyText={engagementPrompts
            .map((p) => {
              const pr = asR(p);
              return `[${str(pr.type)}] ${str(pr.prompt)}`;
            })
            .join("\n\n")}
        >
          {engagementPrompts.map((p, i) => {
            const pr = asR(p);
            return (
              <div key={i} className="mb-3">
                {!!pr.type && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                    {str(pr.type)}
                  </span>
                )}
                <p className="text-[13px] mt-1">{str(pr.prompt ?? p)}</p>
              </div>
            );
          })}
        </AssetSection>
      )}
    </>
  );
}

// ─── Tab: Amplification ───────────────────────────────────────────────────────

function AmplificationTab({ assets }: { assets: Assets }) {
  const amp = asR(assets.amplification);
  const gsp = asR(amp.guest_share_package);
  const isGuest = str(gsp.cover_note).length > 10;
  const cpp = asR(amp.cross_promo_pitch);
  const hooks = asR(assets.hooks);

  const gspCopy = isGuest
    ? [
        gsp.cover_note ? `Cover Note:\n${str(gsp.cover_note)}` : "",
        gsp.feed_caption ? `\nFeed Caption:\n${str(gsp.feed_caption)}` : "",
        gsp.stories_caption ? `\nStories Caption:\n${str(gsp.stories_caption)}` : "",
        gsp.dm_message ? `\nDM Message:\n${str(gsp.dm_message)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "Not applicable — solo episode.";

  const sponsorSuggestions = arr(amp.sponsor_suggestions);
  const sponsorCopy = sponsorSuggestions
    .map((s) => {
      const sr = asR(s);
      return `${str(sr.tier)} — ${str(sr.category)}\nWhy it fits: ${str(sr.why_it_fits)}\nAngle: ${str(sr.integration_angle)}`;
    })
    .join("\n\n");

  const episodeHooks = arr(hooks.episode_hooks);

  return (
    <>
      <AssetSection label="Guest Share Package" copyText={gspCopy}>
        {isGuest ? (
          [
            { key: "cover_note", label: "Cover Note" },
            { key: "feed_caption", label: "Feed Caption" },
            { key: "stories_caption", label: "Stories Caption" },
            { key: "dm_message", label: "DM Message" },
          ].map(({ key, label }) =>
            gsp[key] ? (
              <div key={key} className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#897866] mb-1">
                  {label}
                </p>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">
                  {str(gsp[key])}
                </pre>
              </div>
            ) : null
          )
        ) : (
          <p className="text-[13px] text-muted-foreground italic">Not applicable — solo episode.</p>
        )}
      </AssetSection>

      {(!!cpp.primary || !!cpp.short_version) && (
        <AssetSection
          label="Cross-Promo Pitch Hook"
          copyText={[
            cpp.primary ? `Primary:\n${str(cpp.primary)}` : "",
            cpp.short_version ? `\nShort Version:\n${str(cpp.short_version)}` : "",
          ]
            .filter(Boolean)
            .join("\n")}
        >
          {!!cpp.primary && (
            <div className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Primary</p>
              <p className="text-[13px]">{str(cpp.primary)}</p>
            </div>
          )}
          {!!cpp.short_version && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Short Version</p>
              <p className="text-[13px]">{str(cpp.short_version)}</p>
            </div>
          )}
        </AssetSection>
      )}

      {sponsorSuggestions.length > 0 && (
        <AssetSection label="Sponsor Suggestions" copyText={sponsorCopy}>
          {sponsorSuggestions.map((s, i) => {
            const sr = asR(s);
            return (
              <div key={i} className="mb-4 p-3 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {!!sr.tier && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#526056] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                      {str(sr.tier)}
                    </span>
                  )}
                  <span className="font-medium text-[13px]">{str(sr.category)}</span>
                </div>
                {!!sr.why_it_fits && <p className="text-[12px] text-muted-foreground mb-1"><strong>Why it fits:</strong> {str(sr.why_it_fits)}</p>}
                {!!sr.integration_angle && <p className="text-[12px] text-muted-foreground"><strong>Angle:</strong> {str(sr.integration_angle)}</p>}
              </div>
            );
          })}
        </AssetSection>
      )}

      {episodeHooks.length > 0 && (
        <AssetSection
          label="Episode Hook Variations"
          copyText={episodeHooks
            .map((h, i) => {
              const hr = asR(h);
              return `${i + 1}. [${str(hr.type)}]\n${str(hr.hook)}`;
            })
            .join("\n\n")}
        >
          {episodeHooks.map((h, i) => {
            const hr = asR(h);
            return (
              <div key={i} className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[13px] text-[#526056]">{i + 1}.</span>
                  {!!hr.type && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                      {str(hr.type)}
                    </span>
                  )}
                </div>
                <p className="text-[13px]">{str(hr.hook)}</p>
              </div>
            );
          })}
        </AssetSection>
      )}
    </>
  );
}

// ─── Tab: Strategy ────────────────────────────────────────────────────────────

function StrategyTab({ assets }: { assets: Assets }) {
  const strat = asR(assets.strategy);
  const w1 = asR(strat.week_1_schedule);
  const cal = asR(strat.ninety_day_calendar);
  const ef = asR(strat.evergreen_flag);

  const dayKeys = ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"];
  const w1Copy = dayKeys
    .filter((d) => arr(w1[d]).length)
    .map((d) => `${d.replace("_", " ").toUpperCase()}:\n${arr(w1[d]).map((a) => `  • ${str(a)}`).join("\n")}`)
    .join("\n\n");

  const calWindows = [
    { key: "weeks_2_4", label: "Weeks 2–4" },
    { key: "month_2", label: "Month 2" },
    { key: "month_3", label: "Month 3" },
  ];
  const calCopy = calWindows
    .filter(({ key }) => arr(cal[key]).length)
    .map(({ key, label }) => `${label}:\n${bullets(arr(cal[key]))}`)
    .join("\n\n");

  const isEvergreen = str(ef.status).toLowerCase().includes("evergreen");

  return (
    <>
      <AssetSection label="Week 1 Deployment Schedule" copyText={w1Copy}>
        {dayKeys.map((day) =>
          arr(w1[day]).length ? (
            <div key={day} className="mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#897866] mb-1">
                {day.replace("_", " ")}
              </p>
              <ul className="space-y-1">
                {arr(w1[day]).map((a, i) => (
                  <li key={i} className="flex gap-2 text-[13px]">
                    <span className="text-[#526056] font-bold shrink-0">•</span>
                    <span className="text-[#363633]">{str(a)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </AssetSection>

      <AssetSection label="90-Day Repurposing Calendar" copyText={calCopy}>
        {calWindows.map(({ key, label }) =>
          arr(cal[key]).length ? (
            <div key={key} className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#897866] mb-1">
                {label}
              </p>
              <ul className="space-y-1">
                {arr(cal[key]).map((a, i) => (
                  <li key={i} className="flex gap-2 text-[13px]">
                    <span className="text-[#526056] font-bold shrink-0">•</span>
                    <span className="text-[#363633]">{str(a)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </AssetSection>

      <AssetSection
        label="Evergreen Flag"
        copyText={[
          ef.status ? `Status: ${str(ef.status)}` : "",
          ef.rationale ? str(ef.rationale) : "",
          ef.reshare_recommendation ? `\nReshare: ${str(ef.reshare_recommendation)}` : "",
        ]
          .filter(Boolean)
          .join("\n")}
      >
        {!!ef.status && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-[12px] font-semibold mb-3 ${
              isEvergreen
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {str(ef.status)}
          </span>
        )}
        {!!ef.rationale && <p className="text-[13px] mb-2">{str(ef.rationale)}</p>}
        {!!ef.reshare_recommendation && (
          <p className="text-[12px] text-muted-foreground">{str(ef.reshare_recommendation)}</p>
        )}
      </AssetSection>
    </>
  );
}

// ─── Tab: Intelligence ────────────────────────────────────────────────────────

function IntelligenceTab({ assets }: { assets: Assets }) {
  const intel = asR(assets.intelligence);
  const ts = asR(intel.transformation_statement);
  const cs = asR(intel.confidence_score);
  const cg = asR(intel.credibility_guard);
  const dims = asR(cs.dimensions);

  const tsCopy = [
    ts.primary ? str(ts.primary) : "",
    ts.alternate_a ? `\nAlternate A: ${str(ts.alternate_a)}` : "",
    ts.alternate_b ? `\nAlternate B: ${str(ts.alternate_b)}` : "",
    arr(ts.deployment_uses).length ? `\nUse for:\n${bullets(arr(ts.deployment_uses))}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const scoreCopy = [
    cs.overall_signal ? `Overall: ${str(cs.overall_signal)}` : "",
    cs.overall_summary ? str(cs.overall_summary) : "",
    ...["clarity", "searchability", "shareability", "cta_strength"].map((d) => {
      const dim = asR(dims[d]);
      return dim.signal
        ? `\n${d}: ${str(dim.signal)}\n  ${str(dim.note)}`
        : "";
    }),
    cs.top_priority ? `\nTop Priority: ${str(cs.top_priority)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const flags = arr(cg.flags);
  const credCopy = [
    cg.overall_rating ? `Rating: ${str(cg.overall_rating)}` : "",
    flags.length
      ? "\nFlags:\n" +
        flags
          .map((f) => {
            const fr = asR(f);
            return `• ${str(fr.flagged_text)}\n  Rewrite: ${str(fr.rewrite)}`;
          })
          .join("\n\n")
      : "\n✅ No flags found.",
    arr(cg.clean_assets).length
      ? `\nClean: ${arr(cg.clean_assets).map(str).join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <AssetSection label="Listener Transformation Statement" copyText={tsCopy}>
        {!!ts.primary && (
          <p
            className="mb-4 leading-snug font-medium"
            style={{ fontFamily: "Georgia, serif", fontSize: "18px" }}
          >
            {str(ts.primary)}
          </p>
        )}
        {(!!ts.alternate_a || !!ts.alternate_b) && (
          <div className="space-y-2 mb-3">
            {!!ts.alternate_a && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Alternate A</p>
                <p className="text-[13px]">{str(ts.alternate_a)}</p>
              </div>
            )}
            {!!ts.alternate_b && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Alternate B</p>
                <p className="text-[13px]">{str(ts.alternate_b)}</p>
              </div>
            )}
          </div>
        )}
        {arr(ts.deployment_uses).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Use for</p>
            <ul className="space-y-0.5">
              {arr(ts.deployment_uses).map((u, i) => (
                <li key={i} className="text-[12px] text-muted-foreground">• {str(u)}</li>
              ))}
            </ul>
          </div>
        )}
      </AssetSection>

      <AssetSection label="Episode Confidence Score" copyText={scoreCopy}>
        {!!cs.overall_signal && (
          <div className="flex items-center gap-3 mb-3">
            <SignalPill signal={str(cs.overall_signal)} />
            {!!cs.overall_summary && (
              <p className="text-[13px] text-[#363633]">{str(cs.overall_summary)}</p>
            )}
          </div>
        )}
        <div className="space-y-2 mb-3">
          {[
            { key: "clarity", label: "Clarity" },
            { key: "searchability", label: "Searchability" },
            { key: "shareability", label: "Shareability" },
            { key: "cta_strength", label: "CTA Strength" },
          ].map(({ key, label }) => {
            const dim = asR(dims[key]);
            if (!dim.signal) return null;
            return (
              <div key={key} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <span className="text-[12px] font-medium w-28 shrink-0">{label}</span>
                <SignalPill signal={str(dim.signal)} />
                <div className="min-w-0">
                  {!!dim.note && <p className="text-[12px] text-muted-foreground">{str(dim.note)}</p>}
                  {!!dim.coaching_tip && str(dim.coaching_tip) !== "null" && (
                    <p className="text-[11px] italic text-muted-foreground/70 mt-0.5">
                      💡 {str(dim.coaching_tip)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!!cs.top_priority && (
          <div className="p-3 bg-[#F0EFE9] rounded border border-[#526056]/20">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#526056] mb-1">🎯 Top Priority</p>
            <p className="text-[12px]">{str(cs.top_priority)}</p>
          </div>
        )}
      </AssetSection>

      <AssetSection label="Credibility Guard" copyText={credCopy}>
        {!!cg.overall_rating && (
          <div className="mb-3">
            <SignalPill signal={str(cg.overall_rating)} />
          </div>
        )}
        {flags.length === 0 ? (
          <p className="text-[13px] text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
            ✅ No credibility flags found
          </p>
        ) : (
          <div className="space-y-4">
            {flags.map((f, i) => {
              const fr = asR(f);
              return (
                <div key={i}>
                  <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-0.5">
                      ⚠️ Flagged — {str(fr.category)}
                    </p>
                    <p className="text-[12px] text-amber-900">"{str(fr.flagged_text)}"</p>
                    {!!fr.risk && <p className="text-[11px] text-amber-700 mt-0.5">Risk: {str(fr.risk)}</p>}
                  </div>
                  {!!fr.rewrite && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-green-700 mb-0.5">
                        ✏️ Suggested Rewrite
                      </p>
                      <p className="text-[12px] text-green-900">{str(fr.rewrite)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {arr(cg.clean_assets).length > 0 && (
          <p className="mt-3 text-[12px] text-muted-foreground">
            <strong>Clean:</strong> {arr(cg.clean_assets).map(str).join(", ")}
          </p>
        )}
        {!!cg.disclaimer && (
          <p className="mt-2 text-[11px] italic text-muted-foreground/60">{str(cg.disclaimer)}</p>
        )}
      </AssetSection>
    </>
  );
}

// ─── Clip copy card (individual copy button per clip) ─────────────────────────

function ClipCopyCard({ copyText, children }: { copyText: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!copyText.trim()) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="relative border border-border rounded-lg p-3 mb-3 bg-background">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 print:hidden flex items-center gap-[5px] text-[11px] transition-all"
        style={{
          padding: "3px 8px",
          border: "0.5px solid #DADCD9",
          borderRadius: "6px",
          background: copied ? "#526056" : "white",
          color: copied ? "white" : "#897866",
          cursor: "pointer",
        }}
      >
        {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
      </button>
      {children}
    </div>
  );
}

// ─── Tab: Trailer & Reels ─────────────────────────────────────────────────────

function TrailerReelsTab({ assets }: { assets: Assets }) {
  const tr = asR(assets.trailer_reels);
  const trailerScripts = arr(tr.trailer_scripts);
  const reelClips = arr(tr.reel_clips);

  const allTrailersCopy = trailerScripts
    .map((t) => {
      const ts = asR(t);
      const clipLines = arr(ts.clips)
        .map((c) => {
          const cr = asR(c);
          return `  Clip ${str(cr.clip_number)} [${str(cr.role)}] ${str(cr.timestamp_start)}–${str(cr.timestamp_end)}\n  ${str(cr.speaker)}: "${str(cr.quote)}"\n  Why: ${str(cr.why)}`;
        })
        .join("\n");
      return [
        `Option ${str(ts.option_number)}: ${str(ts.title)}`,
        ts.angle ? `Angle: ${str(ts.angle)}` : "",
        ts.runtime ? `Runtime: ~${str(ts.runtime)}` : "",
        ts.best_use ? `Best use: ${str(ts.best_use)}` : "",
        clipLines ? `\nClips:\n${clipLines}` : "",
        ts.why_it_works ? `\nWhy it works: ${str(ts.why_it_works)}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");

  const allReelsCopy = reelClips
    .map((rc) => {
      const r = asR(rc);
      return [
        `Clip ${str(r.clip_number)} [${str(r.angle)}]`,
        `${str(r.timestamp_start)}–${str(r.timestamp_end)} · ${str(r.speaker)}`,
        `"${str(r.quote)}"`,
        r.hook_overlay ? `Overlay: ${str(r.hook_overlay)}` : "",
        r.why_it_stops_scroll ? str(r.why_it_stops_scroll) : "",
        r.best_platform ? `Platform: ${str(r.best_platform)}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return (
    <>
      {/* Trailer Scripts */}
      <AssetSection label="Trailer Scripts" copyText={allTrailersCopy}>
        {trailerScripts.length === 0 ? (
          <p className="text-[13px] text-muted-foreground italic">No trailer scripts generated.</p>
        ) : (
          trailerScripts.map((t) => {
            const ts = asR(t);
            const clips = arr(ts.clips);
            const trailerCopy = [
              `Option ${str(ts.option_number)}: ${str(ts.title)}`,
              ts.angle ? `Angle: ${str(ts.angle)}` : "",
              ts.runtime ? `Runtime: ~${str(ts.runtime)}` : "",
              ts.best_use ? `Best use: ${str(ts.best_use)}` : "",
              clips.length
                ? `\nClips:\n${clips
                    .map((c) => {
                      const cr = asR(c);
                      return `  Clip ${str(cr.clip_number)} [${str(cr.role)}] ${str(cr.timestamp_start)}–${str(cr.timestamp_end)}\n  ${str(cr.speaker)}: "${str(cr.quote)}"\n  Why: ${str(cr.why)}`;
                    })
                    .join("\n")}`
                : "",
              ts.why_it_works ? `\nWhy it works: ${str(ts.why_it_works)}` : "",
            ]
              .filter(Boolean)
              .join("\n");

            return (
              <ClipCopyCard key={str(ts.option_number)} copyText={trailerCopy}>
                {/* Option badge + title */}
                <div className="pr-16 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#526056] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                      Option {str(ts.option_number)}
                    </span>
                    {!!ts.angle && (
                      <span className="text-[10px] font-semibold text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                        {str(ts.angle)}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-[14px] text-[#363633]">{str(ts.title)}</p>
                </div>
                {/* Metadata row */}
                {(!!ts.runtime || !!ts.best_use) && (
                  <div className="flex flex-wrap gap-4 text-[12px] text-muted-foreground mb-3">
                    {!!ts.runtime && <span>⏱ ~{str(ts.runtime)}</span>}
                    {!!ts.best_use && <span>📍 {str(ts.best_use)}</span>}
                  </div>
                )}
                {/* Clip sequence */}
                <div className="space-y-0 mb-3">
                  {clips.map((c) => {
                    const cr = asR(c);
                    return (
                      <div
                        key={str(cr.clip_number)}
                        className="flex gap-2.5 items-start py-2.5 border-t border-border/40 first:border-0 first:pt-0"
                      >
                        <div className="shrink-0 text-[10px] font-bold text-[#526056] bg-[#F0EFE9] px-1.5 py-1 rounded text-center min-w-[22px]">
                          {str(cr.clip_number)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-semibold text-[#897866] uppercase tracking-wide">
                              {str(cr.role)}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {str(cr.timestamp_start)}–{str(cr.timestamp_end)}
                            </span>
                            {!!cr.speaker && (
                              <span className="text-[10px] text-muted-foreground">· {str(cr.speaker)}</span>
                            )}
                          </div>
                          <p className="text-[13px] italic text-[#363633]">"{str(cr.quote)}"</p>
                          {!!cr.why && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">{str(cr.why)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Why it works */}
                {!!ts.why_it_works && (
                  <p className="text-[12px] text-[#526056] border-t border-border/40 pt-2 italic">
                    {str(ts.why_it_works)}
                  </p>
                )}
              </ClipCopyCard>
            );
          })
        )}
      </AssetSection>

      {/* Reel Clips */}
      <AssetSection label="Reel Clips" copyText={allReelsCopy}>
        {reelClips.length === 0 ? (
          <p className="text-[13px] text-muted-foreground italic">No reel clips generated.</p>
        ) : (
          reelClips.map((rc) => {
            const r = asR(rc);
            const clipCopy = [
              `[${str(r.angle)}] ${str(r.timestamp_start)}–${str(r.timestamp_end)}`,
              r.speaker ? `${str(r.speaker)}: "${str(r.quote)}"` : `"${str(r.quote)}"`,
              r.hook_overlay ? `Overlay: ${str(r.hook_overlay)}` : "",
              r.why_it_stops_scroll ? str(r.why_it_stops_scroll) : "",
              r.best_platform ? `Platform: ${str(r.best_platform)}` : "",
            ]
              .filter(Boolean)
              .join("\n");

            return (
              <ClipCopyCard key={str(r.clip_number)} copyText={clipCopy}>
                <div className="pr-16">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#526056] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                      Clip {str(r.clip_number)}
                    </span>
                    {!!r.angle && (
                      <span className="text-[10px] font-semibold text-[#897866] bg-[#F0EFE9] px-1.5 py-0.5 rounded">
                        {str(r.angle)}
                      </span>
                    )}
                    {!!r.best_platform && (
                      <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                        {str(r.best_platform)}
                      </span>
                    )}
                  </div>
                  {/* Timestamp + speaker */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                    <span className="font-mono">
                      {str(r.timestamp_start)}–{str(r.timestamp_end)}
                    </span>
                    {!!r.speaker && <span>· {str(r.speaker)}</span>}
                  </div>
                  {/* Quote */}
                  {!!r.quote && (
                    <blockquote className="border-l-2 border-[#526056] pl-3 italic text-[13px] text-[#363633] mb-2">
                      "{str(r.quote)}"
                    </blockquote>
                  )}
                  {/* Hook overlay */}
                  {!!r.hook_overlay && (
                    <div className="bg-[#363633] text-white rounded px-3 py-2 text-[12px] font-medium mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#c9b99a] mr-2">
                        Overlay
                      </span>
                      {str(r.hook_overlay)}
                    </div>
                  )}
                  {/* Why it stops scroll */}
                  {!!r.why_it_stops_scroll && (
                    <p className="text-[11px] text-muted-foreground italic">
                      {str(r.why_it_stops_scroll)}
                    </p>
                  )}
                </div>
              </ClipCopyCard>
            );
          })
        )}
      </AssetSection>
    </>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: "publishing", label: "Publishing & SEO" },
  { id: "email", label: "Email" },
  { id: "social", label: "Social Media" },
  { id: "trailers", label: "Trailer & Reels" },
  { id: "amplification", label: "Amplification" },
  { id: "strategy", label: "Strategy" },
  { id: "intelligence", label: "Intelligence" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = params.id ?? "";
  const [runData, setRunData] = useState<RunData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("publishing");
  const [copyAllDone, setCopyAllDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!runId) { setFetchError("No run ID in URL"); setLoading(false); return; }
    try {
      const cached = sessionStorage.getItem(`wellcast_run_${runId}`);
      if (cached) {
        setRunData(JSON.parse(cached) as RunData);
        setLoading(false);
        return;
      }
    } catch {}
    fetch(`${API_BASE}/api/runs/${runId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Run not found");
        const d = await r.json() as { id: string; episode_title: string; assets: Assets };
        setRunData({ run_id: d.id, episode_title: d.episode_title, assets: d.assets });
      })
      .catch((e: Error) => setFetchError(e.message ?? "Could not load this run"))
      .finally(() => setLoading(false));
  }, [runId]);

  const handlePrint = () => window.print();

  const handleCopyAll = async () => {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopyAllDone(true);
      setTimeout(() => setCopyAllDone(false), 2500);
    } catch {}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-7 h-7 border-[2px] border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError || !runData) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-16 text-center">
          <p className="text-foreground font-medium mb-2">Couldn't load this run</p>
          <p className="text-[13px] text-muted-foreground mb-4">{fetchError}</p>
          <Link href="/new-run" className="text-[13px] text-accent hover:underline">← Start a new run</Link>
        </div>
      </DashboardLayout>
    );
  }

  const isIntelligence = activeTab === "intelligence";

  return (
    <DashboardLayout>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-root, #print-root * { visibility: visible; }
          #print-root { position: absolute; inset: 0; }
          .print-hidden { display: none !important; }
          .tab-content { display: block !important; }
          .print-category-heading {
            font-size: 18px;
            font-weight: 700;
            color: #526056;
            margin: 24px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #ddd;
            page-break-before: auto;
          }
          pre, p { font-size: 11px !important; }
        }
        @media screen {
          .tab-content { display: none; }
          .tab-content.active { display: block; }
        }
      `}</style>

      {/* Full-bleed split layout — break out of DashboardLayout's max-w/padding */}
      <div
        id="print-root"
        className="flex -mx-6 md:-mx-8 -my-6 md:-my-8 min-h-[calc(100vh-60px)]"
      >
        {/* ── Sidebar (desktop only) ── */}
        <aside
          className="hidden md:flex w-[200px] shrink-0 flex-col border-r border-border sticky top-0 h-[calc(100vh-60px)] overflow-y-auto print-hidden"
          style={{ background: "#FAFAF8" }}
        >
          {/* Episode title + status */}
          <div className="px-4 pt-5 pb-4 border-b border-border">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-3 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </Link>
            <p className="text-[13px] font-semibold text-[#363633] leading-snug line-clamp-2 mb-2">
              {runData.episode_title}
            </p>
            <span className="inline-flex items-center text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Complete
            </span>
          </div>

          {/* Tab nav */}
          <nav className="flex-1 px-2 py-3 space-y-0.5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full text-left px-3 py-2 rounded-md text-[13px] font-medium transition-colors"
                  style={{
                    background: isActive ? "#526056" : "transparent",
                    color: isActive ? "#ffffff" : "#897866",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#F0EFE9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="px-3 pb-4 pt-2 border-t border-border space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium border transition-colors"
              style={{ borderColor: "#526056", color: "#526056" }}
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
            <button
              onClick={handleCopyAll}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-colors"
              style={{ background: "#F0EFE9", color: "#526056" }}
            >
              {copyAllDone ? (
                <><Check className="h-3.5 w-3.5" /> Copied!</>
              ) : (
                <><ClipboardList className="h-3.5 w-3.5" /> Copy all assets</>
              )}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main
          className="flex-1 min-w-0 overflow-y-auto"
          style={{ background: isIntelligence ? "#F0EFE9" : undefined }}
        >
          {/* Print header */}
          <div className="hidden print:block px-8 pt-8 pb-4 border-b border-border mb-4">
            <p className="text-[20px] font-bold" style={{ color: "#526056" }}>Wellcast</p>
            <p className="text-[15px] font-medium mt-1">{runData.episode_title}</p>
            <p className="text-[12px] text-muted-foreground">Generated {new Date().toLocaleDateString()}</p>
          </div>

          {/* ── Mobile nav (hidden on md+) ── */}
          <div className="md:hidden print-hidden border-b border-border" style={{ background: "#FAFAF8" }}>
            {/* Episode header */}
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5"
                >
                  <ArrowLeft className="h-3 w-3" /> Dashboard
                </Link>
                <p className="text-[13px] font-semibold text-[#363633] leading-snug line-clamp-2">
                  {runData.episode_title}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center text-[10px] font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200 mt-5">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Complete
              </span>
            </div>
            {/* Scrollable tab pills */}
            <div className="overflow-x-auto flex gap-1.5 px-4 pb-3 scrollbar-none">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap"
                  style={{
                    background: activeTab === tab.id ? "#526056" : "#F0EFE9",
                    color: activeTab === tab.id ? "#ffffff" : "#526056",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Mobile actions */}
            <div className="flex gap-2 px-4 pb-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-medium border transition-colors"
                style={{ borderColor: "#526056", color: "#526056" }}
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
              <button
                onClick={handleCopyAll}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-medium transition-colors"
                style={{ background: "#F0EFE9", color: "#526056" }}
              >
                {copyAllDone ? (
                  <><Check className="h-3.5 w-3.5" /> Copied!</>
                ) : (
                  <><ClipboardList className="h-3.5 w-3.5" /> Copy All</>
                )}
              </button>
            </div>
          </div>

          {/* Tab content sections — all rendered, CSS toggles screen visibility */}
          {TABS.map((tab) => (
            <div
              key={tab.id}
              ref={tab.id === activeTab ? contentRef : undefined}
              className={`tab-content px-6 py-6 md:px-8${activeTab === tab.id ? " active" : ""}`}
            >
              <p className="print-category-heading hidden print:block">{tab.label}</p>

              {tab.id === "publishing" && <PublishingTab assets={runData.assets} />}
              {tab.id === "email" && <EmailTab assets={runData.assets} />}
              {tab.id === "social" && <SocialTab assets={runData.assets} />}
              {tab.id === "trailers" && <TrailerReelsTab assets={runData.assets} />}
              {tab.id === "amplification" && <AmplificationTab assets={runData.assets} />}
              {tab.id === "strategy" && <StrategyTab assets={runData.assets} />}
              {tab.id === "intelligence" && <IntelligenceTab assets={runData.assets} />}
            </div>
          ))}
        </main>
      </div>
    </DashboardLayout>
  );
}
