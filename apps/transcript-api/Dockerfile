#
# Build context MUST be the repo root (the monorepo root), because
# transcript-api depends on the workspace packages @workspace/db and
# @workspace/contracts. See docker-compose.yml -> build.context: .
#
FROM node:22-slim AS base

# Prisma 7 with the Neon driver adapter needs OpenSSL available at runtime.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm via corepack, pinned to the version in the root package.json.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# ---- Install dependencies (cached layer) ----
# Copy only the files needed to resolve the dependency graph first so that
# `pnpm install` is only re-run when manifests or the lockfile change.
# A frozen-lockfile install validates against EVERY workspace member, so all
# manifests must be present even though we only run transcript-api.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/transcript-api/package.json apps/transcript-api/
COPY apps/web/package.json apps/web/
COPY apps/extension/package.json apps/extension/
COPY packages/db/package.json packages/db/
COPY packages/contracts/package.json packages/contracts/
COPY packages/ui/package.json packages/ui/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/eslint-config/package.json packages/eslint-config/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Copy source ----
COPY . .

# ---- Generate the Prisma client (gitignored, must be created in-image) ----
RUN pnpm --filter @workspace/db db:generate

ENV NODE_ENV=production
# PORT is read by src/lib/config.ts; default 8080.
ENV PORT=8080
EXPOSE 8080

# The app runs TypeScript directly via tsx (the "start" script).
CMD ["pnpm", "--filter", "transcript-api", "start"]
