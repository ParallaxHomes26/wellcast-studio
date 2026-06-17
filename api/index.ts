// @ts-nocheck
/**
 * Vercel serverless function entry point.
 *
 * Imports the pre-built Express app bundle produced by the api-server esbuild
 * script. Using the compiled JS output avoids Vercel's @vercel/node builder
 * forcing node16/nodenext module resolution onto our TypeScript source files,
 * which would require explicit .js extensions on every relative import.
 *
 * The bundle is produced by `pnpm --filter @workspace/api-server run build`
 * which runs before this function is deployed (see vercel.json buildCommand).
 */
export { default } from "../artifacts/api-server/dist/app.mjs";
