// @ts-nocheck
/* eslint-disable */
/**
 * Vercel serverless function entry point.
 *
 * Vercel's @vercel/node runtime loads function files with require(), which
 * cannot load ES modules. This file therefore uses CommonJS module.exports
 * so the runtime can load it, and requires the pre-built CJS bundle of the
 * Express app produced by `pnpm --filter @workspace/api-server run build`.
 *
 * The bundle is produced in vercel.json's buildCommand before deployment.
 */
const appModule = require("../artifacts/api-server/dist/app.cjs");
module.exports = appModule.default ?? appModule;
