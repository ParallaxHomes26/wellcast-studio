import { createClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const supabaseUrl = process.env["VITE_SUPABASE_URL"] ?? "";
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";

if (!supabaseUrl) logger.warn("VITE_SUPABASE_URL is not set");
if (!serviceRoleKey) logger.warn("SUPABASE_SERVICE_ROLE_KEY is not set");

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);
