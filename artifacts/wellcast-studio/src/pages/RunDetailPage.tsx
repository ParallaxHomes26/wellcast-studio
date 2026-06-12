import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, CheckCircle2, Copy, Check } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Assets = Record<string, unknown>;

interface RunData {
  run_id: string;
  episode_title: string;
  assets: Assets;
}

// ─── Asset content formatters ────────────────────────────────────────────────

type R = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asR = (v: unknown): R => (v && typeof v === "object" && !Array.isArray(v) ? (v as R) : {});

function bulletList(items: unknown[]): string {
  return items.map((i) => `• ${str(i)}`).join("\n");
}

function getContent(key: string, assets: Assets): string {
  switch (key) {
    case "show_notes": {
      const sn = asR(assets.show_notes);
      const parts: string[] = [];
      if (sn.hook_sentence) parts.push(str(sn.hook_sentence));
      if (sn.full_summary) parts.push("\n" + str(sn.full_summary));
      if (arr(sn.what_youll_learn).length) {
        parts.push("\nWhat You'll Learn:\n" + bulletList(arr(sn.what_youll_learn)));
      }
      if (sn.pull_quote) parts.push("\n💬 " + str(sn.pull_quote));
      if (sn.cta_block) parts.push("\n" + str(sn.cta_block));
      return parts.join("\n").trim();
    }

    case "seo_titles": {
      const seo = asR(assets.seo_titles);
      const parts: string[] = [];
      if (seo.recommended_title) parts.push(`⭐ Recommended: ${str(seo.recommended_title)}`);
      if (seo.recommended_reason) parts.push(str(seo.recommended_reason));
      const variations = arr(seo.title_variations);
      if (variations.length) {
        parts.push("\nAll Title Variations:");
        variations.forEach((v, i) => {
          const vr = asR(v);
          parts.push(`${i + 1}. [${str(vr.formula)}] ${str(vr.title)}${vr.search_rating ? ` ★${vr.search_rating}/5` : ""}`);
          if (vr.why) parts.push(`   ${str(vr.why)}`);
        });
      }
      if (arr(seo.apple_keywords).length)
        parts.push(`\nApple Podcasts Keywords:\n${arr(seo.apple_keywords).map(str).join(", ")}`);
      if (arr(seo.spotify_keywords).length)
        parts.push(`\nSpotify Keywords:\n${arr(seo.spotify_keywords).map(str).join(", ")}`);
      if (seo.short_description) parts.push(`\nShort Description: ${str(seo.short_description)}`);
      return parts.join("\n").trim();
    }

    case "blog_skeleton": {
      const blog = asR(assets.blog_skeleton);
      const parts: string[] = [];
      if (blog.h1) parts.push(`H1: ${str(blog.h1)}`);
      if (blog.meta_description) parts.push(`Meta: ${str(blog.meta_description)}`);
      if (blog.target_keyword) parts.push(`Target Keyword: ${str(blog.target_keyword)}`);
      if (blog.word_count_target) parts.push(`Word Count: ${str(blog.word_count_target)}`);
      arr(blog.sections).forEach((s) => {
        const sr = asR(s);
        parts.push(`\n## ${str(sr.h2)}`);
        if (sr.writing_direction) parts.push(`  ${str(sr.writing_direction)}`);
        arr(sr.h3_subsections).forEach((h) => {
          const hr = asR(h);
          parts.push(`  ### ${str(hr.h3)}`);
        });
        if (sr.featured_snippet_opportunity)
          parts.push(`  Featured Snippet: ${str(sr.featured_snippet_opportunity)}`);
      });
      const faqs = arr(blog.faq);
      if (faqs.length) {
        parts.push("\nFAQ:");
        faqs.forEach((f) => {
          const fr = asR(f);
          parts.push(`Q: ${str(fr.question)}\nA: ${str(fr.answer)}`);
        });
      }
      return parts.join("\n").trim();
    }

    case "email": {
      const em = asR(assets.email);
      const parts: string[] = [];
      const sl = asR(em.subject_lines);
      if (sl.recommended)
        parts.push(`⭐ Recommended subject (${str(sl.recommended)}): ${str((sl as R)[str(sl.recommended)] ?? "")}`);
      if (sl.direct) parts.push(`Direct: ${str(sl.direct)}`);
      if (sl.curiosity) parts.push(`Curiosity: ${str(sl.curiosity)}`);
      if (sl.story) parts.push(`Story: ${str(sl.story)}`);
      if (em.preview_text) parts.push(`\nPreview text: ${str(em.preview_text)}`);
      if (em.full_email) parts.push(`\n────────────────────────────────\n${str(em.full_email)}`);
      if (em.guest_email) parts.push(`\n────────── GUEST EMAIL ──────────\n${str(em.guest_email)}`);
      return parts.join("\n").trim();
    }

    case "ig_captions": {
      const social = asR(assets.social);
      const captions = asR(social.captions);
      const parts: string[] = [];
      if (captions.story_open) parts.push(`Option 1 — Launch Day:\n${str(captions.story_open)}`);
      if (captions.insight_hook) parts.push(`\nOption 2 — Mid-Week Educational:\n${str(captions.insight_hook)}`);
      if (captions.direct_address) parts.push(`\nOption 3 — Short (Stories & Reels):\n${str(captions.direct_address)}`);
      if (social.instagram_seo_note) parts.push(`\nInstagram SEO Note:\n${str(social.instagram_seo_note)}`);
      return parts.join("\n").trim();
    }

    case "carousel": {
      const car = asR(assets.carousel);
      const parts: string[] = [];
      if (car.carousel_title) parts.push(`Carousel: ${str(car.carousel_title)}`);
      arr(car.slides).forEach((s) => {
        const sr = asR(s);
        parts.push(`\nSlide ${str(sr.slide_number)} [${str(sr.type).toUpperCase()}]\n${str(sr.headline)}\n${str(sr.body)}`);
        if (sr.design_note) parts.push(`  Design: ${str(sr.design_note)}`);
      });
      if (car.short_caption) parts.push(`\nCaption: ${str(car.short_caption)}`);
      if (car.publish_timing) parts.push(`Post: ${str(car.publish_timing)}`);
      return parts.join("\n").trim();
    }

    case "reel_hooks": {
      const hooks = asR(assets.hooks);
      const parts: string[] = [];
      arr(hooks.reel_hooks).forEach((h, i) => {
        const hr = asR(h);
        parts.push(`${i + 1}. [${str(hr.formula)}]\n${str(hr.hook)}\nUse for: ${str(hr.use_for)}\n${str(hr.scroll_stop_mechanism)}`);
      });
      const ep = arr(hooks.episode_hooks);
      if (ep.length) {
        parts.push("\n── Episode Hooks ──");
        ep.forEach((h, i) => {
          const hr = asR(h);
          parts.push(`${i + 1}. [${str(hr.type)}]\n${str(hr.hook)}`);
        });
      }
      return parts.join("\n\n").trim();
    }

    case "youtube": {
      const yt = asR(asR(assets.platforms).youtube);
      const parts: string[] = [];
      if (yt.above_fold) parts.push(`Above Fold:\n${str(yt.above_fold)}`);
      if (yt.full_description) parts.push(`\n────────────────────────────────\n${str(yt.full_description)}`);
      if (arr(yt.keywords).length) parts.push(`\nKeywords:\n${arr(yt.keywords).map(str).join(", ")}`);
      return parts.join("\n").trim();
    }

    case "pinterest": {
      const pin = asR(asR(assets.platforms).pinterest);
      const parts: string[] = [];
      if (pin.pin_title) parts.push(`Title: ${str(pin.pin_title)}`);
      if (pin.pin_description) parts.push(`\n${str(pin.pin_description)}`);
      if (arr(pin.keywords).length) parts.push(`\nKeywords: ${arr(pin.keywords).map(str).join(", ")}`);
      if (arr(pin.board_suggestions).length) parts.push(`\nBoards:\n${bulletList(arr(pin.board_suggestions))}`);
      return parts.join("\n").trim();
    }

    case "hashtags": {
      const social = asR(assets.social);
      const ht = asR(social.hashtags);
      const parts: string[] = [];
      if (ht.recommended_stack) parts.push(`📋 Copy-Paste Stack:\n${str(ht.recommended_stack)}`);
      if (arr(ht.tier_1_broad).length)
        parts.push(`\nTier 1 — Broad (100k–2M):\n${arr(ht.tier_1_broad).map(str).join("  ")}`);
      if (arr(ht.tier_2_niche).length)
        parts.push(`\nTier 2 — Niche (10k–100k):\n${arr(ht.tier_2_niche).map(str).join("  ")}`);
      if (arr(ht.tier_3_micro).length)
        parts.push(`\nTier 3 — Micro (1k–10k):\n${arr(ht.tier_3_micro).map(str).join("  ")}`);
      return parts.join("\n").trim();
    }

    case "guest_share": {
      const amp = asR(assets.amplification);
      const gsp = asR(amp.guest_share_package);
      if (!gsp || str(gsp.cover_note) === "" && str(gsp.feed_caption) === "") {
        return "No guest share package — this was a solo episode.";
      }
      const parts: string[] = [];
      if (gsp.cover_note) parts.push(`Cover Note:\n${str(gsp.cover_note)}`);
      if (gsp.feed_caption) parts.push(`\nFeed Caption:\n${str(gsp.feed_caption)}`);
      if (gsp.stories_caption) parts.push(`\nStories Caption:\n${str(gsp.stories_caption)}`);
      if (gsp.dm_message) parts.push(`\nDM Message:\n${str(gsp.dm_message)}`);
      const cpp = asR(amp.cross_promo_pitch);
      if (cpp.primary) parts.push(`\nCross-Promo Pitch:\n${str(cpp.primary)}`);
      return parts.join("\n").trim();
    }

    case "calendar": {
      const strat = asR(assets.strategy);
      const parts: string[] = [];
      const ef = asR(strat.evergreen_flag);
      if (ef.status) parts.push(`Evergreen Status: ${str(ef.status).toUpperCase()}\n${str(ef.rationale)}`);
      const w1 = asR(strat.week_1_schedule);
      if (Object.keys(w1).length) {
        parts.push("\n── Week 1 Launch Schedule ──");
        ["day_1", "day_2", "day_3", "day_4", "day_5", "day_6", "day_7"].forEach((day) => {
          if (w1[day]) {
            parts.push(`${day.replace("_", " ").toUpperCase()}:`);
            arr(w1[day]).forEach((a) => parts.push(`  • ${str(a)}`));
          }
        });
      }
      const cal = asR(strat.ninety_day_calendar);
      if (arr(cal.weeks_2_4).length) {
        parts.push("\n── Weeks 2–4 ──");
        arr(cal.weeks_2_4).forEach((a) => parts.push(`• ${str(a)}`));
      }
      if (arr(cal.month_2).length) {
        parts.push("\n── Month 2 ──");
        arr(cal.month_2).forEach((a) => parts.push(`• ${str(a)}`));
      }
      if (arr(cal.month_3).length) {
        parts.push("\n── Month 3 ──");
        arr(cal.month_3).forEach((a) => parts.push(`• ${str(a)}`));
      }
      return parts.join("\n").trim();
    }

    case "ep_score": {
      const intel = asR(assets.intelligence);
      const cs = asR(intel.confidence_score);
      const parts: string[] = [];
      if (cs.overall_signal) parts.push(`Overall: ${str(cs.overall_signal)}`);
      if (cs.overall_summary) parts.push(str(cs.overall_summary));
      const dims = asR(cs.dimensions);
      if (Object.keys(dims).length) {
        parts.push("\nDimension Breakdown:");
        ["clarity", "searchability", "shareability", "cta_strength"].forEach((dim) => {
          const d = asR(dims[dim]);
          if (d.signal) {
            parts.push(`\n${dim.charAt(0).toUpperCase() + dim.slice(1).replace("_", " ")}: ${str(d.signal)}`);
            if (d.note) parts.push(`  ${str(d.note)}`);
            if (d.coaching_tip && str(d.coaching_tip) !== "null")
              parts.push(`  💡 ${str(d.coaching_tip)}`);
          }
        });
      }
      if (cs.top_priority) parts.push(`\n🎯 Top Priority:\n${str(cs.top_priority)}`);
      return parts.join("\n").trim();
    }

    case "credibility": {
      const intel = asR(assets.intelligence);
      const cg = asR(intel.credibility_guard);
      const parts: string[] = [];
      if (cg.overall_rating) parts.push(`Rating: ${str(cg.overall_rating)}`);
      const flags = arr(cg.flags);
      if (flags.length) {
        parts.push("\n⚠️ Flags:");
        flags.forEach((f) => {
          const fr = asR(f);
          parts.push(`\nAsset: ${str(fr.asset)}`);
          parts.push(`Text: "${str(fr.flagged_text)}"`);
          parts.push(`Category: ${str(fr.category)}`);
          parts.push(`Risk: ${str(fr.risk)}`);
          parts.push(`✏️ Rewrite: ${str(fr.rewrite)}`);
        });
      } else {
        parts.push("\n✅ No flags found");
      }
      if (arr(cg.clean_assets).length)
        parts.push(`\nClean assets: ${arr(cg.clean_assets).map(str).join(", ")}`);
      if (cg.disclaimer) parts.push(`\n${str(cg.disclaimer)}`);
      return parts.join("\n").trim();
    }

    case "transformation": {
      const intel = asR(assets.intelligence);
      const ts = asR(intel.transformation_statement);
      const parts: string[] = [];
      if (ts.primary) parts.push(`Primary:\n${str(ts.primary)}`);
      if (ts.alternate_a) parts.push(`\nAlternate A:\n${str(ts.alternate_a)}`);
      if (ts.alternate_b) parts.push(`\nAlternate B:\n${str(ts.alternate_b)}`);
      if (arr(ts.deployment_uses).length)
        parts.push(`\nUse this for:\n${bulletList(arr(ts.deployment_uses))}`);
      return parts.join("\n").trim();
    }

    default:
      return "";
  }
}

// ─── Card config ──────────────────────────────────────────────────────────────

const CARDS = [
  { id: "show_notes",   title: "Show Notes",              desc: "SEO-optimised · Apple & Spotify ready" },
  { id: "seo_titles",   title: "SEO Title Pack",           desc: "6 formulas + platform keywords" },
  { id: "blog_skeleton",title: "Blog Skeleton",            desc: "H1 · H2s · FAQ · Schema markup" },
  { id: "email",        title: "Email Newsletter",         desc: "Subject lines + full broadcast" },
  { id: "ig_captions",  title: "Instagram Captions",       desc: "3 variations for every use case" },
  { id: "carousel",     title: "Carousel Copy",            desc: "8-slide swipe file" },
  { id: "reel_hooks",   title: "Reel Hooks",               desc: "5 reel + 5 episode hooks" },
  { id: "youtube",      title: "YouTube Description",      desc: "Above fold + full description" },
  { id: "pinterest",    title: "Pinterest",                desc: "Title, description & keyword stack" },
  { id: "hashtags",     title: "Hashtag Sets",             desc: "3-tier stack · copy-paste ready" },
  { id: "guest_share",  title: "Guest Share Kit",          desc: "Cover note · captions · DM" },
  { id: "calendar",     title: "90-Day Calendar",          desc: "Week-by-week repurposing plan" },
  { id: "ep_score",     title: "Episode Score",            desc: "4-dimension content analysis" },
  { id: "credibility",  title: "Credibility Guard",        desc: "Liability & claim review" },
  { id: "transformation",title: "Listener Transformation", desc: "Primary + alternate statements" },
] as const;

// ─── Asset card ───────────────────────────────────────────────────────────────

function AssetCard({
  title,
  desc,
  content,
}: {
  title: string;
  desc: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const empty = !content.trim();

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col shadow-sm hover:border-muted-foreground/50 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <button
          onClick={handleCopy}
          disabled={empty}
          title="Copy to clipboard"
          className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all disabled:opacity-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex-1 bg-background rounded-lg border border-border/50 p-3 overflow-y-auto max-h-[220px] min-h-[80px]">
        {empty ? (
          <p className="text-[12px] text-muted-foreground/50 italic">No content available</p>
        ) : (
          <pre className="text-[12px] text-foreground leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </pre>
        )}
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">{desc}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = params.id ?? "";

  const [runData, setRunData] = useState<RunData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!runId) {
      setFetchError("No run ID in URL");
      setLoading(false);
      return;
    }

    // 1. Check sessionStorage first (fastest — populated right after generation)
    try {
      const cached = sessionStorage.getItem(`wellcast_run_${runId}`);
      if (cached) {
        const parsed = JSON.parse(cached) as RunData;
        setRunData(parsed);
        setLoading(false);
        return;
      }
    } catch {
      // ignore parse errors
    }

    // 2. Fall back to API fetch
    fetch(`/api/runs/${runId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Run not found");
        const data = await r.json() as { id: string; episode_title: string; assets: Assets };
        setRunData({ run_id: data.id, episode_title: data.episode_title, assets: data.assets });
      })
      .catch((err: Error) => {
        setFetchError(err.message ?? "Could not load this run");
      })
      .finally(() => setLoading(false));
  }, [runId]);

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
          <Link href="/new-run" className="text-[13px] text-accent hover:underline">
            ← Start a new run
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[20px] font-medium text-foreground leading-tight">
                {runData.episode_title}
              </h1>
              <span className="flex items-center text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 shrink-0">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground">
              {CARDS.length} assets generated · {runId.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>

      {/* Asset grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <AssetCard
            key={card.id}
            title={card.title}
            desc={card.desc}
            content={getContent(card.id, runData.assets)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
