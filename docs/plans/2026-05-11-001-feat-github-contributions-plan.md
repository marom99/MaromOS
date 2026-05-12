---
title: "feat: Add GitHub Daily Streak app"
type: feat
status: active
date: 2026-05-11
origin: docs/brainstorms/2026-05-11-github-contributions-requirements.md
---

# feat: Add GitHub Daily Streak App

## Overview

Add a new native ryOS app that displays a 52-week GitHub contribution heatmap and three computed stats (total contributions, current streak, longest streak). This is a **public showcase widget** — the site owner's contributions are fetched server-side using Vercel environment variables; visitors see the data but configure nothing. The heatmap uses an Aqua-inspired blue/teal palette.

## Problem Frame

ryOS has no way to surface GitHub activity. This app fills that gap as a public "about me" widget — not a per-user tool — giving any visitor a retro-styled glanceable view of the site owner's contribution history. (see origin: `docs/brainstorms/2026-05-11-github-contributions-requirements.md`)

## Requirements Trace

- R1. 52-week contribution heatmap, one column per week, one cell per day
- R2. Aqua blue/teal palette with 5 intensity levels; not GitHub's green
- R3. Cell hover tooltip: date + contribution count
- R4. Stats bar: total contributions, current streak, longest streak (days)
- R5. Streaks computed client-side from the GraphQL `contributionCalendar` data
- R6. Server-side proxy fetches via `GITHUB_TOKEN` env var; token never reaches the client
- R7. GitHub username from `GITHUB_USERNAME` env var; visitors do not configure this
- R8. No per-visitor setup or auth state — data is always shown
- R9. Data fetched on app open; manual refresh button; no auto-refresh
- R10. Registered as a lazy-loaded native ryOS `BaseApp`
- R11. Window default size ~760×300

## Scope Boundaries

- No OAuth, no client-stored token, no localStorage credential management
- No Control Panels settings UI for this app
- No per-visitor configuration — username and token are server-side constants
- No repo list, PR feed, or any data beyond the contribution calendar
- No real-time or background refresh
- Palette is fixed Aqua blue/teal — not theme-adaptive

## Context & Research

### Relevant Code and Patterns

- **App registration**: `src/config/appRegistryData.ts` — add to `appIds` array and `appNames` record; `AppId` union is derived automatically
- **Lazy loading**: `src/config/appRegistry.tsx` — `createLazyComponent` wrapper from `src/config/lazyAppComponent.tsx`
- **App types**: `src/apps/base/types.ts` — `BaseApp`, `AppProps` interfaces
- **Logic hook pattern**: `src/apps/*/hooks/use*Logic.ts` — all state/fetch logic extracted from components
- **WindowFrame pattern**: every app wraps in `<WindowFrame>` with `if (!isWindowOpen) return null` guard
- **API proxy pattern**: `api/stocks.ts` — `apiHandler` from `api/_utils/api-handler.js`, `runtime = "nodejs"`, `maxDuration = 30`; reads process.env server-side
- **`abortableFetch`** + **`getApiUrl`**: `src/utils/abortableFetch.ts`, `src/utils/platform.ts` — used for client → proxy calls
- **Icons**: `public/icons/default/*.png` — referenced as `"/icons/default/<name>.png"` in registry

### External References

- GitHub GraphQL endpoint: `POST https://api.github.com/graphql` with `Authorization: Bearer <token>`
- Required token scope: `read:user` (classic PAT) — sufficient for contribution calendar including private repos
- Key query: `user(login) > contributionsCollection(from, to) > contributionCalendar > weeks > contributionDays`
- `ContributionCalendarDay` fields: `date` (YYYY-MM-DD), `contributionCount`, `contributionLevel` (enum: `NONE`, `FIRST_QUARTILE`, `SECOND_QUARTILE`, `THIRD_QUARTILE`, `FOURTH_QUARTILE`), `weekday`
- Date range args: `from`/`to` as ISO-8601 UTC `DateTime`; max span is 1 year
- Rate limit: 5,000 points/hour — contribution calendar queries are ~1 point

## Key Technical Decisions

- **Server-side env var (`GITHUB_TOKEN`, `GITHUB_USERNAME`) over client-stored PAT**: This is a public showcase. The token stays on the server; visitors see the data but cannot access the token. This is simpler and more secure than per-user credential management.
- **Server-side proxy route**: GitHub's GraphQL API does not support CORS for browser requests. All requests go through `api/github-contributions.ts`, which reads credentials from `process.env`. The client posts no credentials.
- **`contributionLevel` enum for intensity mapping**: Use the API-provided `contributionLevel` (5 levels) rather than computing intensity from raw counts. Exactly matches what GitHub renders; no per-user normalization needed.
- **Client-side streak computation**: GitHub does not expose streak data via API. Traverse `contributionDays` sorted by date; maintain rolling count, reset on zero-count day.

## Open Questions

### Resolved During Planning

- **CORS?** GitHub GraphQL does not support CORS from browsers; a server-side proxy is required.
- **AppId union type?** Derived from `appIds as const` in `appRegistryData.ts` — no separate types.ts edit needed.
- **Token security?** `process.env.GITHUB_TOKEN` is read server-side only; never serialized to the API response or sent to the client.

### Deferred to Implementation

- **Window default size**: ~760×300 is the target; adjust after implementing the heatmap to ensure content isn't clipped at minimum window size.
- **Icon asset**: A GitHub-themed icon PNG needs to be created/sourced at `public/icons/default/github-contributions.png`.
- **Month label positioning**: Use `ContributionCalendarMonth.firstDay` + `totalWeeks` or derive from `weeks[].firstDay`. Determine during implementation.
- **Tooltip library**: Use existing Radix/shadcn `Tooltip` component.
- **Vercel env var setup**: `GITHUB_TOKEN` and `GITHUB_USERNAME` must be set in the Vercel project before the app returns data. Document in README or help items.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Browser
  └── useGitHubContributionsLogic (hook)
        ├── POST /api/github-contributions   (no credentials in body)
        │     └── api/github-contributions.ts
        │           ├── reads process.env.GITHUB_TOKEN
        │           ├── reads process.env.GITHUB_USERNAME
        │           └── POST api.github.com/graphql  (server-side, CORS-safe)
        │                 query: contributionsCollection(from, to)
        │                   contributionCalendar {
        │                     totalContributions
        │                     weeks { contributionDays { date, contributionCount, contributionLevel, weekday } }
        │                     months { name, firstDay, totalWeeks }
        │                   }
        ├── computes currentStreak, longestStreak from contributionDays
        └── returns { weeks, totalContributions, currentStreak, longestStreak, isLoading, error }

Component tree:
  GitHubContributionsAppComponent
    ├── [loading]  → skeleton / spinner
    ├── [error]    → error message + retry button
    └── [data]     → ContributionHeatmap (grid) + StatsBar

Heatmap layout:
  Month label row (derived from months[] data)
  CSS grid: 53 columns (weeks) × 7 rows (days)
    contributionLevel → Tailwind bg class:
      NONE             → #e8f4f8 (near-white blue)
      FIRST_QUARTILE   → #93c5e8 (light teal)
      SECOND_QUARTILE  → #5ba8d4 (medium blue)
      THIRD_QUARTILE   → #2d84bc (strong blue)
      FOURTH_QUARTILE  → #1a5f8a (deep navy)
  Legend row: Less ░▒▓█ More

Stats bar: Total | Current Streak | Longest Streak
```

## Implementation Units

- [ ] **Unit 1: Server-Side Proxy Route**

**Goal:** Expose `/api/github-contributions` that fetches the owner's GitHub contribution calendar server-side using env vars, bypassing CORS.

**Requirements:** R6, R7, R8

**Dependencies:** None (Vercel env vars must be set in deployment)

**Files:**
- Create: `api/github-contributions.ts`

**Approach:**
- Follow `api/stocks.ts` exactly: `export const runtime = "nodejs"`, `export const maxDuration = 30`, `export default apiHandler({ methods: ["GET"] }, ...)`
- Read `process.env.GITHUB_TOKEN` and `process.env.GITHUB_USERNAME` server-side
- Return 503 with `{ error: "GitHub credentials not configured" }` if either env var is missing
- Build date range: `from` = exactly one year ago at `00:00:00Z`, `to` = today at `23:59:59Z`
- POST to `https://api.github.com/graphql` with `Authorization: Bearer <GITHUB_TOKEN>`
- Query: `contributionsCollection(from, to) { contributionCalendar { totalContributions weeks { firstDay contributionDays { date contributionCount contributionLevel weekday } } months { name year firstDay totalWeeks } } }`
- Handle GitHub 401 → return 401 with clear error; other non-200 → return 502
- Handle `data.user === null` (bad username) → return 404 with "GitHub user not found"
- Set `Cache-Control: public, max-age=300, stale-while-revalidate=3600` on success
- Never echo `GITHUB_TOKEN` value in the response body or error messages

**Patterns to follow:**
- `api/stocks.ts` — `apiHandler` wrapper, error shape, `Cache-Control` header

**Test scenarios:**
- Happy path: Valid env vars set → returns 200 with `{ data: { user: { contributionsCollection: { contributionCalendar: ... } } } }`
- Error path: `GITHUB_TOKEN` not set → returns 503 with config error message
- Error path: `GITHUB_USERNAME` not set → returns 503 with config error message
- Error path: GitHub returns 401 (bad token) → proxy returns 401, token value not leaked in response
- Error path: `data.user === null` (wrong username in env) → returns 404
- Edge case: Response includes `Cache-Control` header with 5-minute max-age

**Verification:**
- `GET /api/github-contributions` with env vars set returns calendar data
- `GET /api/github-contributions` without env vars returns 503 (not 500 crash)
- Token value does not appear anywhere in any response body

---

- [ ] **Unit 2: App Scaffold & Registry Registration**

**Goal:** Create the app's metadata/index files and register it in the global app registry so it appears in the dock and can be opened.

**Requirements:** R10, R11

**Dependencies:** None (parallel with Unit 1)

**Files:**
- Create: `src/apps/github-contributions/metadata.ts`
- Create: `src/apps/github-contributions/index.ts`
- Modify: `src/config/appRegistryData.ts` — add `"github-contributions"` to `appIds` and `appNames`
- Modify: `src/config/appRegistry.tsx` — add lazy component and registry entry
- Add asset: `public/icons/default/github-contributions.png`

**Approach:**
- `metadata.ts`: `appMetadata` with `name: "GitHub"`, `icon: "/icons/default/github-contributions.png"`, standard `creator`/`github` fields; `helpItems` with 2-3 tips (e.g., "Shows the site owner's GitHub contribution history", "Requires GITHUB_TOKEN and GITHUB_USERNAME env vars to be set on the server")
- `index.ts`: single re-export — `export { appMetadata, helpItems } from "./metadata"`
- `appRegistryData.ts`: append `"github-contributions"` to `appIds`; add `"github-contributions": "GitHub"` to `appNames`
- `appRegistry.tsx`: `createLazyComponent` → `GitHubContributionsAppComponent`; `windowConfig: { defaultSize: { width: 760, height: 300 }, minSize: { width: 580, height: 260 } }`
- `metadata.ts` must not import any component module

**Patterns to follow:**
- `src/apps/minesweeper/metadata.ts`, `src/apps/minesweeper/index.ts`
- Existing `createLazyComponent` entries in `appRegistry.tsx`

**Test scenarios:**
- Integration: App appears in the app registry; opening from dock does not throw
- TypeScript: `AppId` includes `"github-contributions"` after adding to `appIds`; `tsc --noEmit` passes
- Dev server: App icon visible in dock

**Verification:**
- Dev server starts without TypeScript errors
- App opens as an empty window (component not yet built is fine at this stage)

---

- [ ] **Unit 3: GitHub Contributions Logic Hook**

**Goal:** Encapsulate all data-fetching, state management, and streak computation; expose a clean interface to the component.

**Requirements:** R4, R5, R8, R9

**Dependencies:** Unit 1 (proxy route), Unit 2 (scaffold exists)

**Files:**
- Create: `src/apps/github-contributions/hooks/useGitHubContributionsLogic.ts`

**Approach:**
- State: `{ weeks, totalContributions, currentStreak, longestStreak, isLoading, error }`
- `fetchContributions()`: GET `/api/github-contributions` via `getApiUrl` + `abortableFetch`; handle 503 ("Server not configured"), 401 ("Token invalid"), 404 ("User not found"), network errors
- Streak computation: flatten all `contributionDays` from `weeks[]`, sort by `date` (ascending)
  - `longestStreak`: scan forward, track max consecutive non-zero days
  - `currentStreak`: scan backward from today, stop at first zero-count day or date gap
- `useEffect` on mount: call `fetchContributions()`
- Expose `refetch` function for the manual refresh button
- Abort in-flight request on unmount (use `AbortController` via `abortableFetch`)

**Technical design:**
```
// Streak algorithm (directional):
// 1. Flatten weeks[].contributionDays, sort by date ascending
// 2. longestStreak: scan forward, track max consecutive count > 0
// 3. currentStreak: from today backward, count consecutive days with count > 0
//    - stop at first day with count === 0 OR date is not yesterday relative to previous
```

**Patterns to follow:**
- Logic hook pattern from any existing app with external data fetch (e.g., dashboard)
- `src/utils/abortableFetch.ts`, `src/utils/platform.ts` `getApiUrl`

**Test scenarios:**
- Happy path: Successful fetch → `weeks` populated, `isLoading` false, `error` null
- Happy path: 5 consecutive days with contributions → `currentStreak === 5`
- Edge case: All days in the year are zero → `currentStreak === 0`, `longestStreak === 0`
- Edge case: Today has zero contributions, yesterday has 3 → `currentStreak === 0`
- Edge case: Streak spans across week boundaries in the `weeks[]` array
- Error path: 503 from proxy → `error` set with "Server not configured" message, `isLoading` false
- Error path: Network failure → `error` set with fallback message
- Integration: `refetch()` clears error, sets `isLoading` true, then resolves

**Verification:**
- Hook exports `{ weeks, totalContributions, currentStreak, longestStreak, isLoading, error, refetch }`
- TypeScript compiles without errors
- Unmounting the component while fetching does not trigger a state update warning

---

- [ ] **Unit 4: Heatmap Component + Main App Component**

**Goal:** Render the contribution heatmap grid with tooltips, the stats bar, and loading/error states; assemble into the WindowFrame-wrapped app component.

**Requirements:** R1, R2, R3, R4, R9, R11

**Dependencies:** Unit 2 (scaffold), Unit 3 (logic hook)

**Files:**
- Create: `src/apps/github-contributions/components/GitHubContributionsAppComponent.tsx`
- Create: `src/apps/github-contributions/components/ContributionHeatmap.tsx`
- Create: `src/apps/github-contributions/components/GitHubContributionsMenuBar.tsx`

**Approach:**
- `GitHubContributionsAppComponent.tsx`: standard guard (`if (!isWindowOpen) return null`), `WindowFrame`, call `useGitHubContributionsLogic`, branch on `isLoading` / `error` / data
- `ContributionHeatmap.tsx`:
  - Month label row above the grid using `months[]` data + `firstDay`/`totalWeeks` for column offset positioning
  - Day-of-week labels on the left: Mon, Wed, Fri (rows 1, 3, 5 of 0–6 grid)
  - CSS grid: 53 columns × 7 rows; each cell is a small square (10–12px) with 2px gap
  - Cells from `weeks[].contributionDays`; use `weekday` field (0=Sun…6=Sat) to place in correct grid row
  - Partial first/last weeks: cells for missing days render as transparent (not NONE-colored)
  - Each cell: Radix/shadcn `<Tooltip>` showing `"N contributions on Mon, May 5"`
  - Legend row below grid: "Less ░▒▓█ More" using the 5 Aqua colors
  - Aqua palette classes (inline or CSS custom properties):
    - `NONE` → `#e8f4f8`
    - `FIRST_QUARTILE` → `#93c5e8`
    - `SECOND_QUARTILE` → `#5ba8d4`
    - `THIRD_QUARTILE` → `#2d84bc`
    - `FOURTH_QUARTILE` → `#1a5f8a`
- Stats bar: three labeled blocks (Total / Current Streak / Longest Streak) below the heatmap
- Loading state: skeleton grid matching the heatmap shape (same dimensions, greyed cells)
- Error state: centered message + "Retry" button wired to `refetch`
- `GitHubContributionsMenuBar.tsx`: "File" menu with "Refresh" item + separator; wires to `refetch`

**Patterns to follow:**
- `src/apps/minesweeper/components/MinesweeperAppComponent.tsx` — simple app component pattern
- `src/apps/control-panels/components/ControlPanelsMenuBar.tsx` — menu bar shape
- Existing Radix `Tooltip` usage in the codebase for hover tooltips

**Test scenarios:**
- Happy path: Data loaded → 53 columns render, cells colored by `contributionLevel`
- Happy path: Stats bar shows correct numeric values (total, streaks)
- Edge case: Partial first week (year starts mid-week) → column has fewer than 7 cells, no crash, empty slots transparent
- Edge case: All `contributionCount === 0` → all cells render NONE color, streaks show 0
- State: Loading → skeleton visible, no heatmap grid shown
- State: Error → error message visible, Retry button works
- Integration: Refresh in menu bar calls `refetch()` and briefly shows loading state
- Visual: Month labels align with correct columns; legend row shows all 5 color levels

**Verification:**
- App opens, fetches data, and renders heatmap without console errors
- Hovering a non-zero cell shows correct tooltip text
- Stats reflect hook values
- Window at minimum size (580×260) does not clip the heatmap critically

---

## System-Wide Impact

- **Interaction graph:** Only the new app and the new API route are added. No existing stores, components, or routes are modified except the registry files (additive only).
- **Error propagation:** Network errors from the proxy stay within the GitHub Daily Streak app's error state; they do not bubble to the window manager or global app state.
- **State lifecycle risks:** No persistent state. All fetched data is in-memory (hook state); cleared when the app window closes.
- **API surface parity:** `api/github-contributions.ts` is a new, app-specific route. No other ryOS app consumes it.
- **Integration coverage:** The fetch → render flow requires the proxy route and component to work together. Manual end-to-end test (open app, see heatmap) is the primary integration check.
- **Unchanged invariants:** `BaseApp`/`AppProps` interfaces unchanged. Control Panels, existing stores, and existing registry entries are unchanged.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `GITHUB_TOKEN` or `GITHUB_USERNAME` env vars not set in Vercel | Route returns 503 with config error message; component shows clear error state |
| GitHub returns `null` for `user` field (bad username in env) | Check `data.user === null` in proxy, return 404, show error in component |
| `GITHUB_TOKEN` leaked in error response | Never echo env var value; only use it in `Authorization` header |
| First/last week partial cells cause grid layout issues | Use `weekday` field to position cells; render missing days as transparent |
| Icon asset not yet created | Placeholder PNG unblocks development; final asset needed before ship |
| GitHub GraphQL rate limits | 5,000 points/hour; 1 point per query; `Cache-Control: 300s` reduces repeat hits |

## Documentation / Operational Notes

- Set `GITHUB_TOKEN` (classic PAT with `read:user` scope) and `GITHUB_USERNAME` in Vercel project environment variables before deploying.
- Local development: add both vars to `.env.local`.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-11-github-contributions-requirements.md](docs/brainstorms/2026-05-11-github-contributions-requirements.md)
- Proxy pattern: `api/stocks.ts`
- App scaffold: `src/apps/minesweeper/`
- App registry: `src/config/appRegistry.tsx`, `src/config/appRegistryData.ts`
- GitHub GraphQL schema: `ContributionsCollection`, `ContributionCalendar`, `ContributionCalendarDay` — [docs.github.com/en/graphql/reference/objects](https://docs.github.com/en/graphql/reference/objects)
- Rate limits: [docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-ai)
