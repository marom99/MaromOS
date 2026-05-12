---
date: 2026-05-11
topic: github-contributions
---

# GitHub Daily Streak App

## Problem Frame

ryOS has no way to display GitHub activity. A dedicated GitHub Daily Streak app shows the site owner's contribution history — a public showcase widget, not a per-user configurable tool. Visitors see the owner's contribution heatmap and stats; they configure nothing. Data is fetched server-side using a Vercel environment variable for the token.

## Requirements

**Contribution Heatmap**
- R1. Display a 52-week contribution heatmap (past year), one column per week, one cell per day, matching the layout on GitHub profile pages.
- R2. Cells use 5 intensity levels (none, low, medium, high, very-high) rendered in an Aqua-inspired blue/teal palette — a deliberate ryOS-first aesthetic choice, not GitHub's green.
- R3. Hovering a cell shows a tooltip: date + contribution count for that day.

**Stats Bar**
- R4. Display three stats below the heatmap: total contributions in the past year, current streak (days), and longest streak (days).
- R5. Streaks are computed client-side from the GraphQL contribution calendar data (GitHub does not expose them via API directly).

**Data & Auth**
- R6. Data is fetched by a server-side proxy route using `GITHUB_TOKEN` (Vercel env var). The token is never sent to or stored on the client.
- R7. The GitHub username to display is set via `GITHUB_USERNAME` (Vercel env var). Visitors do not configure this.
- R8. The app always shows the owner's contributions; there is no per-visitor setup or authentication state.
- R9. Data is fetched on app open. A manual refresh button is provided; there is no auto-refresh interval.

**App Integration**
- R10. The app is registered as a native ryOS app following the existing `BaseApp` / `appRegistry.tsx` pattern with a lazy-loaded component.
- R11. Window default size is appropriate for the heatmap + stats layout (roughly 760×300).

## Success Criteria

- Any visitor who opens the app sees the owner's contribution heatmap and three stats with no setup required.
- The Aqua blue/teal palette feels intentional and fits within the ryOS visual system.
- The token is never exposed to the browser or localStorage.

## Scope Boundaries

- No OAuth flow — server-side PAT only, stored as env var.
- No per-visitor configuration — username and token are server-side constants.
- No repo list, PR feed, issue tracker, or any other GitHub data beyond the contribution calendar.
- No real-time or background refresh — on-demand only.
- No theme-switching colors — palette is fixed to Aqua blue/teal regardless of active ryOS theme.
- No Control Panels settings UI for this app.

## Key Decisions

- **Server-side env var over client-stored PAT**: This is a public showcase, not a personal tool. The token stays on the server; visitors see the data but cannot access the token.
- **`GITHUB_USERNAME` env var**: Flexible without requiring code changes to switch profiles.
- **Aqua palette**: Deliberate aesthetic choice that makes the app distinctly ryOS-flavored rather than a pale copy of GitHub's UI.
- **Client-side streak computation**: GitHub GraphQL exposes daily counts; streaks are derived — straightforward to compute from the calendar array.

## Outstanding Questions

### Deferred to Planning

- [Affects R10][Technical] Confirm the icon asset to use for the GitHub Daily Streak app in the dock/registry.
- [Affects R11][Technical] Finalize window min/default size after implementing the heatmap layout.

## Next Steps

→ `/ce:plan` for structured implementation planning
