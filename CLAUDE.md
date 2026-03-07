# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at http://localhost:3000
pnpm build        # Production build
pnpm start        # Start production server
pnpm analyze      # Bundle analysis (uses next experimental-analyze, Turbopack-compatible)
pnpm type-check   # TypeScript validation
pnpm lint         # Run ESLint on src/
pnpm lint:fix     # Run ESLint with auto-fix
pnpm format       # Run Prettier (write)
pnpm format:check # Check Prettier formatting
```

Env validation can be skipped with `SKIP_ENV_VALIDATION=1 pnpm build`.

## Architecture

**Next.js 15 App Router** with TypeScript strict mode. Package manager is **pnpm**.

```
src/
  app/
    layout.tsx      # Root layout (Inter font, global metadata)
    page.tsx        # Home page
    icon.tsx        # Favicon generated via ImageResponse (32x32 PNG)
    sitemap.ts      # /sitemap.xml — add routes here as the app grows
    robots.ts       # /robots.txt — points to sitemap
  lib/
    env/
      client.ts     # T3 Env schema for NEXT_PUBLIC_* vars (NEXT_PUBLIC_BASE_URL defined here)
      server.ts     # T3 Env schema for server-only vars (NODE_ENV pre-defined)
redirects.ts        # Typed redirect definitions, imported by next.config.ts
next.config.ts      # Imports env files at build time, sets security headers + CSP
```

### Environment Variables

Use T3 Env — never access `process.env` directly. ESLint enforces this via `n/no-process-env` (only `SKIP_ENV_VALIDATION` is exempt). Add new variables to:

- `src/lib/env/client.ts` — for `NEXT_PUBLIC_*` vars (also add to `runtimeEnv`)
- `src/lib/env/server.ts` — for server-only vars (`experimental__runtimeEnv: process.env` covers all)

Required variable: `NEXT_PUBLIC_BASE_URL` (used by `sitemap.ts` and `robots.ts`). Set to `http://localhost:3000` locally.

### Path Alias

`@/*` maps to `src/*`. Always use this for imports within `src/`.

### Naming Conventions

ESLint enforces **kebab-case** for all file and folder names in `src/`. JSX props must be sorted: shorthand first, callbacks last, reserved first.

### Commit Messages

Follows Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) — enforced by commitlint on the `commit-msg` hook.

### CSP & Security Headers

Security headers are set in `next.config.ts`. The CSP is intentionally minimal (`object-src`, `base-uri`, `frame-ancestors`, `manifest-src` only). Extend per project needs — do not add `script-src`, `style-src`, etc. without consideration.

### Redirects

Add entries to the `redirects` array in `redirects.ts` (fully typed via `next/dist/lib/load-custom-routes`). The array is consumed by `next.config.ts`.

### Sitemap

Add new routes to the array returned by `src/app/sitemap.ts`. Each entry takes `url`, `lastModified`, `changeFrequency`, and `priority`. The base URL is read from `env.NEXT_PUBLIC_BASE_URL`.

### Husky Pre-commit

The `pre-commit` hook (lint-staged) is **disabled by default**. Enable with:

```bash
echo 'HUSKY_ENABLED=true' > .husky/_/pre-commit.options
```

Active hooks: `commit-msg` (commitlint) and `post-merge` (auto `pnpm install` on lockfile changes).
