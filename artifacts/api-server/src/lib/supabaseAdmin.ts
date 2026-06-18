import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
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
  {
    auth: { autoRefreshToken: false, persistSession: false },
    // Provide the ws package as the WebSocket transport.
    // Node.js < 20 lacks native WebSocket; even on 20+ this explicit transport
    // silences the Supabase "Node.js 18 detected" startup warning.
    // The cast is needed because @types/ws allows `null` as address but
    // Supabase's WebSocketLikeConstructor narrows it to `string | URL` only.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    realtime: { transport: WebSocket as any },
  }
);
