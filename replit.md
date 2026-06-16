# Wellcast Studio

SaaS tool for health/wellness podcasters that generates 26 content assets from a single episode transcript.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from `$PORT`)
- `pnpm --filter @workspace/wellcast-studio run dev` — run the frontend dev server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build + typecheck lib packages only (`tsc --build`)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- API: Express 5 (port `$PORT`, all routes under `/api/`)
- Auth + DB: Supabase (profiles table, Row Level Security)
- Payments: Stripe (subscriptions, webhooks)
- AI: Anthropic Claude (`claude-sonnet-4-5`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → `@workspace/api-client-react`)
- Build: esbuild (ESM bundle)

## Where things live

- `artifacts/wellcast-studio/` — React Vite frontend
- `artifacts/api-server/` — Express 5 API server
- `artifacts/api-server/src/app.ts` — Express app (routes, middleware, CORS)
- `artifacts/api-server/src/routes/` — all route handlers
- `artifacts/api-server/src/lib/supabaseAdmin.ts` — Supabase admin client
- `artifacts/api-server/src/lib/stripeClient.ts` — Stripe client + price IDs
- `artifacts/api-server/src/lib/subscription.ts` — tier logic, gating helpers
- `lib/db/src/schema/` — Drizzle DB schema (source of truth)
- `lib/api-zod/src/` — generated Zod schemas (from OpenAPI)
- `lib/api-client-react/src/` — generated React Query hooks (from OpenAPI)
- `api/index.ts` — Vercel serverless function entry point (re-exports Express app)

## Architecture decisions

- Express app is in `app.ts` (exported); `index.ts` only calls `app.listen()`. This lets `api/index.ts` re-export the app for Vercel serverless without calling `listen()`.
- All Express routes are under `/api/` prefix — the shared proxy routes `/api/*` to the API service without rewriting the path.
- Stripe webhook uses `express.raw()` before `express.json()` — order matters in `app.ts`.
- Supabase Auth is the identity layer; profiles are stored in a `profiles` table with subscription metadata. The frontend creates/upserts the profile row immediately after `signUp()`.
- Pino logger: in production (`NODE_ENV=production`) outputs plain JSON to stdout; in dev uses pino-pretty. No worker threads in production — safe for Vercel serverless.
- CORS allowed origins are built from `APP_URL` + `REPLIT_DEV_URL` env vars so production domains don't need to be hardcoded.

## Vercel Deployment

See `.env.example` for all required environment variables.

**Steps:**
1. Push to GitHub
2. Import the repo in Vercel
3. Set **Root Directory** to `.` (monorepo root — `vercel.json` controls the build)
4. Add all env vars from `.env.example` in Vercel → Settings → Environment Variables
5. Configure a Stripe webhook pointing to `https://your-domain.com/api/stripe/webhook`

**How it works:**
- `vercel.json` runs `pnpm run typecheck:libs && pnpm --filter @workspace/wellcast-studio run build`
- Static frontend is served from `artifacts/wellcast-studio/dist/public`
- All `/api/*` requests are routed to `api/index.ts` (serverless, 60s timeout)
- SPA fallback: all other paths serve `index.html`


## Product

- **New Run**: upload a transcript → Claude generates 26 content assets across 6 categories
- **Dashboard**: episode history, subscription status, usage tracking
- **Subscription tiers**: Basic ($19/mo), Starter ($39/mo), Pro ($79/mo) + Founding Member pricing
- **7-day free trial** on signup (no credit card required)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Supabase email domain validation is enabled — automated tests with `@example.com` or `.test` TLDs will be rejected. Use real email addresses for manual testing.
- Rate limiter has `validate: { ip: false, xForwardedForHeader: false }` — required because Replit proxy doesn't set a real IP on the request.
- `vite.config.ts` defaults `PORT` to 5173 and `BASE_PATH` to `/` when the env vars are absent (so `vite build` works on Vercel without setting those vars).
- `pnpm run typecheck:libs` must run before leaf package typechecks if lib source changed — `tsc --build` is incremental so repeat runs are fast.
- Stripe webhook endpoint must be re-registered in the Stripe Dashboard whenever the production domain changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
