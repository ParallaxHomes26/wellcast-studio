import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin";

const router: IRouter = Router();

router.get("/runs/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    res.status(400).json({ error: "run id is required" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("episode_runs")
    .select("id, user_id, episode_title, health_niche, episode_type, assets, confidence_score, transformation_statement, status, created_at")
    .eq("id", id)
    .single();

  if (error) {
    req.log.warn({ id, error: error.message }, "Failed to fetch episode_run");
    res.status(404).json({ error: "Run not found" });
    return;
  }

  res.json(data);
});

export default router;
