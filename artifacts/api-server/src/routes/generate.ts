import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { v4 as uuidv4 } from "uuid";
import { callClaude } from "../lib/anthropicClient";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { canRunGeneration, type Profile } from "../lib/subscription";

const router: IRouter = Router();

const GenerateBody = z.object({
  episode_brief: z.record(z.string(), z.unknown()),
  cta: z.string().optional().default(""),
  user_id: z.string(),
  run_id: z.string().optional(),
  input_method: z.string().optional().default("transcript"),
});

const briefStr = (brief: Record<string, unknown>) =>
  JSON.stringify(brief, null, 2);

const PROMPTS = {
  show_notes: (brief: Record<string, unknown>, cta: string) =>
    `You are the show notes engine for Wellcast Studio — built exclusively for health and wellness podcasters. Using the episode brief below, generate SEO-optimized show notes. Return ONLY valid JSON:
{
  "primary_keyword": "best keyword phrase in patient search language",
  "secondary_keywords": ["2-3 related search phrases"],
  "search_intent": "what is this listener trying to find",
  "hook_sentence": "opening sentence starting with listener situation — never starts with In this episode",
  "full_summary": "complete 150-200 word summary — flows naturally, optimized for primary keyword",
  "what_youll_learn": ["6 outcome-focused bullets — never topic labels"],
  "pull_quote": "most clinically credible shareable quote from episode",
  "cta_block": "3-sentence CTA block using: ${cta || "[add your CTA here]"}",
  "internal_linking_suggestions": [{"suggested_topic": "related episode topic", "anchor_text": "exact link text"}]
}
EPISODE BRIEF: ${briefStr(brief)}
CTA: ${cta}`,

  seo_titles: (brief: Record<string, unknown>) =>
    `You are the SEO titles engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "title_variations": [
    {"formula": "Patient Question", "title": "...", "search_rating": 1, "why": "..."},
    {"formula": "Myth-Busting", "title": "...", "search_rating": 1, "why": "..."},
    {"formula": "The Number", "title": "...", "search_rating": 1, "why": "..."},
    {"formula": "Problem/Solution", "title": "...", "search_rating": 1, "why": "..."},
    {"formula": "Clinical Insight", "title": "...", "search_rating": 1, "why": "..."},
    {"formula": "Patient Situation", "title": "...", "search_rating": 1, "why": "..."}
  ],
  "recommended_title": "the single best title",
  "recommended_reason": "why this one wins",
  "apple_keywords": ["8 keywords for Apple Podcasts"],
  "spotify_keywords": ["7 conversational keywords for Spotify"],
  "youtube_keywords": ["7 question-based long-tail keywords for YouTube"],
  "short_description": "under 100 characters — standalone hook"
}
EPISODE BRIEF: ${briefStr(brief)}`,

  blog_skeleton: (brief: Record<string, unknown>) =>
    `You are the SEO blog engine for Wellcast Studio — built exclusively for health and wellness podcasters. Generate a full SEO blog skeleton. Return ONLY valid JSON:
{
  "target_keyword": "primary keyword",
  "meta_description": "under 155 characters",
  "h1": "primary title",
  "sections": [
    {
      "h2": "section heading",
      "writing_direction": "what to cover and how",
      "semantic_keywords": ["keywords to weave in"],
      "h3_subsections": [{"h3": "subheading", "writing_direction": "..."}],
      "featured_snippet_opportunity": "yes or no and why"
    }
  ],
  "faq": [
    {"question": "exact question as searched", "answer": "40-60 word answer optimized for featured snippet"}
  ],
  "schema_markup": "complete JSON-LD FAQ schema as a string",
  "word_count_target": "1400-1600 words",
  "internal_links": [{"placement": "where in article", "anchor_text": "exact text", "topic": "related episode topic"}]
}
EPISODE BRIEF: ${briefStr(brief)}`,

  email: (brief: Record<string, unknown>, cta: string) =>
    `You are the email engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "subject_lines": {
    "direct": "direct subject line",
    "curiosity": "curiosity subject line",
    "story": "story-based subject line",
    "recommended": "direct | curiosity | story",
    "recommended_reason": "why"
  },
  "preview_text": "email preview text under 100 characters",
  "full_email": "complete email newsletter draft — opens in listener world, creates a gap, sells the listen not the summary, includes PS line",
  "guest_email": "personalized guest thank-you email with share copy — null if episode_type is not guest_interview"
}
EPISODE BRIEF: ${briefStr(brief)}
CTA: ${cta}`,

  social: (brief: Record<string, unknown>) =>
    `You are the social media engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "captions": {
    "story_open": "caption variation 1 — story opening, launch day",
    "insight_hook": "caption variation 2 — educational, mid-week",
    "direct_address": "caption variation 3 — short, for stories and reels"
  },
  "hashtags": {
    "tier_1_broad": ["7 broad wellness hashtags 100k-2M posts"],
    "tier_2_niche": ["8 niche-specific hashtags 10k-100k posts"],
    "tier_3_micro": ["7 micro-targeted hashtags 1k-10k posts"],
    "recommended_stack": "complete copy-paste hashtag string of 20-22 tags"
  },
  "instagram_seo_note": "which keywords appear in captions for Instagram search indexing"
}
EPISODE BRIEF: ${briefStr(brief)}`,

  carousel: (brief: Record<string, unknown>) =>
    `You are the carousel copy engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "carousel_title": "title for the carousel series",
  "slides": [
    {
      "slide_number": 1,
      "type": "hook | teaching | reframe | cta",
      "headline": "slide headline",
      "body": "1-2 supporting lines maximum",
      "design_note": "brief visual direction"
    }
  ],
  "short_caption": "short caption for the carousel post — carousel does the teaching",
  "publish_timing": "best day and time to post"
}
Always generate exactly 8 slides. Slide 7 must always be the pull quote screenshot slide.
EPISODE BRIEF: ${briefStr(brief)}`,

  hooks: (brief: Record<string, unknown>) =>
    `You are the hooks engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "reel_hooks": [
    {"formula": "Counterintuitive | Specific Number | Direct Address | Unfinished Thought | Bold Claim", "hook": "hook text", "use_for": "where to use this", "scroll_stop_mechanism": "why it stops the scroll"}
  ],
  "episode_hooks": [
    {"type": "Story | Diagnosis | Reframe | Credential | Question", "hook": "longer hook for audiograms and pitches"}
  ]
}
Generate 5 reel hooks and 5 episode hooks.
EPISODE BRIEF: ${briefStr(brief)}`,

  platforms: (brief: Record<string, unknown>) =>
    `You are the platform distribution engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "youtube": {
    "above_fold": "first 150 characters — appears in search results, complete thought",
    "full_description": "complete YouTube description with intro, bullet points of what is covered, timestamps placeholder, guest links placeholder, host links placeholder, subscribe CTA, keyword list at bottom",
    "keywords": ["10 YouTube search keywords"]
  },
  "pinterest": {
    "pin_title": "under 100 characters, keyword leads",
    "pin_description": "under 500 characters, written for search",
    "keywords": ["10 Pinterest wellness search keywords"],
    "board_suggestions": ["2-3 board placement suggestions"]
  }
}
EPISODE BRIEF: ${briefStr(brief)}`,

  amplification: (brief: Record<string, unknown>, cta: string) =>
    `You are the amplification engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "guest_share_package": {
    "cover_note": "brief note to send guest with the package",
    "feed_caption": "caption written in guest voice",
    "stories_caption": "short stories caption",
    "dm_message": "personal DM for guest to send close network"
  },
  "cross_promo_pitch": {
    "primary": "full one-sentence pitch hook for podcast guest outreach",
    "short": "one-line version for quick outreach"
  },
  "sponsor_suggestions": {
    "tier_1": [{"category": "...", "why_it_fits": "...", "integration_angle": "...", "example_brands": "..."}],
    "tier_2": [{"category": "...", "why_it_fits": "...", "integration_angle": "..."}],
    "tier_3": [{"category": "...", "why_it_fits": "..."}],
    "avoid": ["categories to avoid and why"]
  },
  "audience_engagement_prompts": [
    {"type": "Personal Experience | Revelation | Action", "question": "...", "why_it_works": "...", "deploy": "where to use this"}
  ]
}
Return guest_share_package as null if episode_type is not guest_interview.
EPISODE BRIEF: ${briefStr(brief)}
CTA: ${cta}`,

  strategy: (brief: Record<string, unknown>) =>
    `You are the content strategy engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "evergreen_flag": {
    "status": "evergreen | time_sensitive",
    "rationale": "why",
    "reshare_recommendation": "full re-promotion | archive | update before resharing",
    "content_review_recommended": "timeframe"
  },
  "week_1_schedule": {
    "day_1": ["list of specific actions with platform and asset"],
    "day_2": ["..."],
    "day_3": ["..."],
    "day_4": ["..."],
    "day_5": ["..."],
    "day_6": ["..."],
    "day_7": ["..."]
  },
  "ninety_day_calendar": {
    "weeks_2_4": ["active promotion actions"],
    "month_2": ["momentum window actions"],
    "month_3": ["evergreen window actions — conditioned on evergreen flag"]
  }
}
EPISODE BRIEF: ${briefStr(brief)}`,

  intelligence: (brief: Record<string, unknown>, cta: string) =>
    `You are the episode intelligence engine for Wellcast Studio — built exclusively for health and wellness podcasters. Return ONLY valid JSON:
{
  "transformation_statement": {
    "primary": "one sentence capturing the shift this episode creates — never uses: understand, learn, discover, explore, dive into, journey, empower, holistic, optimize, wellness journey, transform your health, game changer, deep dive",
    "alternate_a": "emotionally direct alternate",
    "alternate_b": "action-oriented alternate",
    "deployment_uses": ["list of where to use this statement"]
  },
  "confidence_score": {
    "overall_signal": "STRONG EPISODE | GOOD EPISODE | NEEDS ATTENTION",
    "overall_summary": "one sentence opening with what is working — never opens with what is missing",
    "dimensions": {
      "clarity": {"signal": "Strong | Needs Attention | Missing", "note": "specific observation", "coaching_tip": "single highest-leverage improvement or null if strong"},
      "searchability": {"signal": "Strong | Needs Attention | Missing", "note": "specific observation", "coaching_tip": "..."},
      "shareability": {"signal": "Strong | Needs Attention | Missing", "note": "specific observation", "coaching_tip": "..."},
      "cta_strength": {"signal": "Strong | Needs Attention | Missing", "note": "specific observation", "coaching_tip": "..."}
    },
    "top_priority": "the single change that would move the needle most"
  },
  "credibility_guard": {
    "overall_rating": "CLEAN | CLEAN WITH REFINEMENTS | NEEDS REVIEW",
    "flags": [
      {
        "asset": "which asset this appears in",
        "flagged_text": "exact text flagged",
        "category": "Absolute claim | Unsubstantiated cause-and-effect | Diagnostic language | FTC violation",
        "risk": "why this is a risk",
        "rewrite": "safer equally compelling alternative"
      }
    ],
    "clean_assets": ["list of assets that passed with no flags"],
    "disclaimer": "Wellcast Studio credibility review identifies common liability patterns. It is not a substitute for legal advice."
  }
}
EPISODE BRIEF: ${briefStr(brief)}
CTA: ${cta}`,

  trailer_reels: (brief: Record<string, unknown>) =>
    `You are the trailer and reels engine for Wellcast Studio — built exclusively for health and wellness podcasters. Using the episode transcript and brief, identify the most emotionally resonant, curiosity-driving, and scroll-stopping moments. Return ONLY valid JSON:
{
  "trailer_scripts": [
    {
      "option_number": 1,
      "title": "trailer title — the angle or theme",
      "angle": "Emotional Hook | Controversial | Punchy/Viral",
      "runtime": "approximate runtime in seconds",
      "best_use": "where to use this trailer — YouTube intro, podcast app preview, Instagram Stories",
      "clips": [
        {
          "clip_number": 1,
          "role": "Hook | Body | Cliffhanger Ending",
          "timestamp_start": "MM:SS",
          "timestamp_end": "MM:SS",
          "speaker": "speaker name or Host if unknown",
          "quote": "exact quote from transcript",
          "why": "why this clip works in this position"
        }
      ],
      "why_it_works": "2-3 sentence explanation of the emotional and conversion logic behind this trailer sequence"
    }
  ],
  "reel_clips": [
    {
      "clip_number": 1,
      "timestamp_start": "MM:SS",
      "timestamp_end": "MM:SS",
      "speaker": "speaker name or Host if unknown",
      "quote": "exact quote from transcript",
      "hook_overlay": "text overlay to open the reel — one punchy line that stops the scroll",
      "angle": "Counterintuitive | Surprising Stat | Myth Bust | Emotional Moment | Clinical Insight",
      "why_it_stops_scroll": "one sentence on the psychological trigger",
      "best_platform": "Instagram Reels | YouTube Shorts | TikTok | All"
    }
  ]
}
Always generate exactly 3 trailer options with 4-5 clips each. Always generate exactly 5 reel clips. Order reel clips from highest to lowest viral potential. If the episode type is solo (no guest), set speaker to Host for all clips.
EPISODE BRIEF: ${briefStr(brief)}`,
};

router.post("/generate", async (req, res): Promise<void> => {
  const parsed = GenerateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { episode_brief, cta, user_id, run_id: incomingRunId, input_method } = parsed.data;
  const runId = incomingRunId ?? uuidv4();

  req.log.info({ user_id, run_id: runId }, "Starting asset generation");

  // Subscription check — fetch profile, create one on the fly if missing
  const { data: fetchedProfile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  req.log.info(
    { user_id, profile_found: !!fetchedProfile, profile_error: profileError?.message ?? null },
    "Profile lookup"
  );

  let profile: Profile | null = fetchedProfile as Profile | null;

  if (!profile) {
    req.log.warn({ user_id }, "No profile found — upserting a trial profile");
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const { data: newProfile, error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user_id,
          subscription_status: "trialing",
          subscription_tier: "free_trial",
          trial_starts_at: now.toISOString(),
          trial_ends_at: trialEnd.toISOString(),
          run_count_this_month: 0,
          run_count_reset_at: now.toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (upsertError) {
      req.log.error({ user_id, error: upsertError.message }, "Profile upsert failed");
    }

    profile = (newProfile as Profile | null) ?? ({ id: user_id, subscription_status: "trialing" } as unknown as Profile);
  }

  const { allowed, reason } = canRunGeneration(profile);
  if (!allowed) {
    res.status(403).json({ error: reason ?? "Subscription required" });
    return;
  }

  const brief = episode_brief as Record<string, unknown>;

  const [
    show_notes,
    seo_titles,
    blog_skeleton,
    email,
    social,
    carousel,
    hooks,
    platforms,
    amplification,
    strategy,
    intelligence,
    trailer_reels,
  ] = await Promise.all([
    callClaude(PROMPTS.show_notes(brief, cta),    3000),
    callClaude(PROMPTS.seo_titles(brief),          3000),
    callClaude(PROMPTS.blog_skeleton(brief),        6000),
    callClaude(PROMPTS.email(brief, cta),           5000),
    callClaude(PROMPTS.social(brief),               2500),
    callClaude(PROMPTS.carousel(brief),             3000),
    callClaude(PROMPTS.hooks(brief),                2500),
    callClaude(PROMPTS.platforms(brief),            3000),
    callClaude(PROMPTS.amplification(brief, cta),   4000),
    callClaude(PROMPTS.strategy(brief),             5000),
    callClaude(PROMPTS.intelligence(brief, cta),    6000),
    callClaude(PROMPTS.trailer_reels(brief),        6000),
  ]);

  const assets = {
    show_notes,
    seo_titles,
    blog_skeleton,
    email,
    social,
    carousel,
    hooks,
    platforms,
    amplification,
    strategy,
    intelligence,
    trailer_reels,
  };

  const episodeTitle =
    (brief["core_topic"] as string | undefined) ??
    (brief["show_name"] as string | undefined) ??
    "Untitled Episode";

  const confidenceScore =
    (intelligence as Record<string, unknown> | null)?.confidence_score;
  const scoreValue =
    typeof confidenceScore === "object" && confidenceScore !== null
      ? ((confidenceScore as Record<string, unknown>).overall_signal as string)
      : "GOOD EPISODE";

  // Persist to Supabase (best-effort — don't fail the request if DB is unavailable)
  try {
    const { error: insertError } = await supabaseAdmin
      .from("episode_runs")
      .insert({
        id: runId,
        user_id,
        episode_title: episodeTitle,
        health_niche: (brief["health_niche"] as string) ?? "",
        episode_type: (brief["episode_type"] as string) ?? "solo",
        input_method,
        episode_brief: brief,
        assets,
        confidence_score: scoreValue,
        credibility_flags: [],
        transformation_statement:
          ((intelligence as Record<string, unknown> | null)
            ?.transformation_statement as Record<string, unknown> | undefined)
            ?.primary ?? "",
        status: "complete",
      });

    if (insertError) {
      req.log.warn({ error: insertError.message }, "Failed to insert episode_run");
    } else {
      // Reset or increment monthly run count
      const p = profile as Profile | null;
      const resetDate = p?.run_count_reset_at ? new Date(p.run_count_reset_at) : null;
      const now = new Date();
      const needsReset =
        !resetDate ||
        resetDate.getMonth() !== now.getMonth() ||
        resetDate.getFullYear() !== now.getFullYear();

      if (needsReset) {
        await supabaseAdmin
          .from("profiles")
          .update({ run_count_this_month: 1, run_count_reset_at: now.toISOString() })
          .eq("id", user_id);
      } else {
        await supabaseAdmin
          .from("profiles")
          .update({ run_count_this_month: (p?.run_count_this_month ?? 0) + 1 })
          .eq("id", user_id);
      }
    }
  } catch (dbErr) {
    req.log.warn({ err: dbErr }, "Supabase persistence skipped");
  }

  req.log.info({ run_id: runId }, "Asset generation complete");
  res.json({ run_id: runId, assets });
});

export default router;
