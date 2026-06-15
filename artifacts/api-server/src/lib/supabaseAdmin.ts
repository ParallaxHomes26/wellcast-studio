import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const supabaseUrl =
  process.env["SUPABASE_URL"] ??
  process.env["VITE_SUPABASE_URL"] ??
  "";

const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

if (!supabaseUrl) logger.error("Neither SUPABASE_URL nor VITE_SUPABASE_URL is set — Supabase Admin will not work");
if (!serviceRoleKey) logger.error("SUPABASE_SERVICE_ROLE_KEY is not set — Supabase Admin will not work");

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);
