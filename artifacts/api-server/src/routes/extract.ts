import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { callClaude } from "../lib/anthropicClient";

const router: IRouter = Router();

const ExtractBody = z.object({
  input_method: z.enum(["transcript", "manual", "url"]),
  transcript: z.string().optional(),
  manual_brief: z.record(z.string(), z.unknown()).optional(),
  url: z.string().optional(),
  cta: z.string().optional().default(""),
});

const EXTRACTION_PROMPT = (content: string) => `You are the content intelligence engine for Wellcast Studio — a tool built exclusively for health and wellness podcasters.

Your job is to read a raw podcast transcript or episode brief and extract a clean, structured episode brief. This brief will be used as the foundation for generating all episode content assets.

Return ONLY a valid JSON object with this exact structure — no preamble, no markdown, just valid JSON:

{
  "show_name": "podcast name or null",
  "episode_type": "solo | guest_interview | co_hosted | panel",
  "host_name": "host name or null",
  "guest_name": "guest full name or null",
  "guest_credentials": "guest title and expertise in 1 sentence or null",
  "health_niche": "primary niche",
  "secondary_niches": ["array of additional niches"],
  "core_topic": "single clearest 1-sentence description of episode",
  "key_points": ["5-6 specific key points"],
  "target_listener": "1 sentence describing exactly who this episode is for",
  "tone": "clinical_and_educational | warm_and_conversational | story_driven | practical_and_tactical | mix",
  "quotable_moments": ["3 most shareable quotes or paraphrases"],
  "actionable_takeaways": ["3 specific things listener can do after this episode"],
  "sensitive_topics": ["any medically sensitive topics needing careful handling"],
  "trust_signals": ["credentials, experience, or evidence mentioned"],
  "episode_length_signal": "short (under 20 min) | medium (20-40 min) | long (40+ min)"
}

EPISODE INPUT:
${content}`;

router.post("/extract", async (req, res): Promise<void> => {
  const parsed = ExtractBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { input_method, transcript, manual_brief, url } = parsed.data;

  let content = "";

  if (input_method === "transcript") {
    if (!transcript?.trim()) {
      res.status(400).json({ error: "transcript is required for input_method=transcript" });
      return;
    }
    content = transcript;
  } else if (input_method === "manual") {
    if (!manual_brief) {
      res.status(400).json({ error: "manual_brief is required for input_method=manual" });
      return;
    }
    content = Object.entries(manual_brief)
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as unknown[]).join(", ") : v}`)
      .join("\n");
  } else if (input_method === "url") {
    if (!url?.trim()) {
      res.status(400).json({ error: "url is required for input_method=url" });
      return;
    }
    content = `Episode URL: ${url}\n(Extract what you can from the URL itself and generate a reasonable brief for a health/wellness podcast episode on this topic.)`;
  }

  req.log.info({ input_method }, "Running extraction");

  const brief = await callClaude(EXTRACTION_PROMPT(content), 2000);
  res.json(brief);
});

export default router;
