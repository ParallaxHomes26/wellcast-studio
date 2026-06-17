/**
 * Vercel serverless function entry point.
 *
 * Re-exports the Express app so Vercel's Node.js runtime uses it as the
 * request handler for all /api/* routes (see vercel.json rewrites).
 */
export { default } from "../artifacts/api-server/src/app";
