---
title: Vite dependency scan failure made the dev server feel slow
date: 2026-05-08
category: docs/solutions/build-errors/
module: MaromOS dev server
problem_type: build_error
component: development_workflow
symptoms:
  - "Vite dependency scanner failed with Expected \">\" but found \"<\" in src/apps/admin/components/AdminAppComponent.tsx:383"
  - "http://localhost:5173 was extremely slow to load after bun run dev"
  - "node_modules/.vite was 0B before the fix"
  - "@radix-ui/react-popover was declared in package.json but missing from node_modules"
root_cause: logic_error
resolution_type: code_fix
severity: medium
related_components:
  - tooling
tags:
  - vite
  - bun
  - dev-server
  - dependency-scan
  - jsx
  - node-modules
  - cache
---

# Vite dependency scan failure made the dev server feel slow

## Problem

`bun run dev` started the MaromOS API and Vite server, and the frontend returned HTTP 200, but the browser load at `http://localhost:5173` was extremely slow. The visible slowness was a downstream symptom of Vite failing to complete dependency scanning and local install state drifting out of sync.

## Symptoms

- Vite logged `Expected ">" but found "<"` in `src/apps/admin/components/AdminAppComponent.tsx:383`.
- `node_modules/.vite` was empty, so Vite had no usable optimizer/prebundle cache.
- `@radix-ui/react-popover` was declared in `package.json` and the lockfile but missing from `node_modules`.
- `bun run build` exposed a separate Slack `SearchInput` type mismatch, blocking clean compile verification.
- API checks were fast; `/api/songs` responded in about `1ms`, so the API was not the bottleneck.

## What Didn't Work

- Treating HTTP 200 from the Vite shell as proof that the app was healthy. The shell can serve while dependency scanning is still broken. (session history)
- Looking only at browser slowness before checking the terminal logs. The actionable failure was already in Vite stderr.
- Waiting for Vite to settle while its optimizer was blocked by invalid TSX.
- Assuming dependencies were installed because they were present in `package.json` and the lockfile.
- Treating the first post-fix load as the final performance signal. It was still slow because Vite had to rebuild an empty optimizer cache. (session history)

## Solution

Repair source validity first, then restore install state, then restart Vite so the optimizer can rebuild from a clean graph.

The broken Admin JSX had generated variant markers inserted inside an unfinished `<Input>` element:

```tsx
<Input
  value={songSearch}
  onChange={(e) => setSongSearch(e.target.value)}
  className="pl-7 h-7 text-[12px]"
  // generated wrapper/comment markup interrupted the element here
```

The fix restored the component structure and removed the generated marker wrapper from live JSX:

```tsx
<Input
  placeholder={t("apps.admin.search.songsPlaceholder", "Search songs...")}
  value={songSearch}
  onChange={(e) => setSongSearch(e.target.value)}
  className="pl-7 h-7 text-[12px]"
/>
```

Then run:

```bash
bun install
bun run dev
```

Finally, fix any build-only type errors that prevent `bun run build` from becoming the clean verification signal. In this incident, `SearchInput` already emitted a string and handled its own clear button, so the Slack header changed from event-style handling to:

```tsx
<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="Search"
  className="w-[168px]"
/>
```

## Why This Works

Vite can start a dev server even when dependency scanning fails, but the browser experience degrades because optimization and prebundling cannot complete. Fixing the TSX parse error let Vite analyze the graph again.

Restoring missing declared packages removed install-state uncertainty. Once source parsing and dependency installation were both healthy, Vite populated `node_modules/.vite` and warm browser navigation returned to normal.

## Prevention

- Keep `bun run dev` behind a lightweight readiness check that:
  - warns when the local Bun version differs from `package.json`;
  - auto-runs `bun install` if declared packages are missing from `node_modules`;
  - fails fast if generated variant markers such as `data-impeccable-variants` or `impeccable-variants-*` appear in `src/`.
- When `localhost:5173` feels slow, check in this order:
  - terminal logs for Vite scanner errors;
  - `bun run build`;
  - `bun install`;
  - `du -sh node_modules/.vite`;
  - API timings only after frontend compile health is known.
- Treat the first load after a fixed optimizer failure as a cache rebuild. Use a second warm navigation as the meaningful browser timing. (session history)
- Do not leave generated design or variant markers in source TSX unless a compile/build check has passed afterward.

## Related Issues

- `docs/1.1-architecture.md` covers Bun and Vite development commands but not this optimizer failure mode.
- `docs/2.16-admin.md` identifies `AdminAppComponent.tsx` as the Admin app orchestrator.
- GitHub issue search was unavailable because issues are disabled for `marom99/MaromOS`.
