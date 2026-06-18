FROM node:24-alpine

# Enable corepack and pin the exact pnpm version used in this repo
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# Copy the entire monorepo — we need workspace root + all lib/* and artifacts/*
# .dockerignore excludes node_modules, dist, and .git to keep the image lean
COPY . .

# Install all workspace dependencies without the frozen-lockfile check.
# Railway's environment may have slightly different pnpm settings which would
# cause ERR_PNPM_LOCKFILE_CONFIG_MISMATCH with --frozen-lockfile.
RUN pnpm install --no-frozen-lockfile

# Build: runs the two-step esbuild (dist/index.mjs for local dev + dist/app.cjs for serverless)
RUN pnpm --filter @workspace/api-server run build

# Railway injects PORT at runtime; the Express app reads process.env.PORT
ENV PORT=8080
EXPOSE 8080

# Production start: runs the pre-built ESM bundle directly (no rebuild on start)
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]
