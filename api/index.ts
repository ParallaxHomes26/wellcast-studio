/**
 * Vercel serverless function entry point.
 *
 * Re-exports the Express app so Vercel's Node.js runtime uses it as the
 * request handler for all /api/* routes (see vercel.json rewrites).
 *
 * Object-storage routes (/api/storage/*) require Replit-specific env vars
 * (DEFAULT_OBJECT_STORAGE_BUCKET_ID, PRIVATE_OBJECT_DIR,
 * PUBLIC_OBJECT_SEARCH_PATHS) and will return errors when those are absent —
 * all other routes work normally.
 */
export { default } from "../artifacts/api-server/src/app";
