---
created: 2026-05-17
status: active
type: feat
---

# Plan: Mobile First Boot — Slack Only, Window Fits Screen

## Summary

When MaromOS is opened on a mobile device for the first time, it currently launches both the Slack app and the "About Me" app. The desired behavior is to only display Slack on mobile, with the window sized to fit the screen perfectly and positioned above the dock.

This is a focused change touching the first-boot launch sequence in `src/App.tsx` and the mobile window sizing logic in `src/config/appRegistry.tsx`.

## Problem Frame

**Current behavior** (mobile first boot):
1. `launchApp("slack")` — creates a full-width Slack window at y=28, height=720
2. `launchApp("about-me")` — creates an About Me window (hidden behind Slack)
3. `bringInstanceToForeground(slackId)` — foregrounds Slack but About Me still exists as an open instance

**Problems**:
- About Me is unnecessarily launched on mobile, wasting memory and creating an unwanted open window
- Slack's default height (720px) is derived from `config.defaultSize.height`, which is designed for desktop. On mobile viewports (~740px on many phones), the window overflows past the dock/safe area

**Desired behavior** (mobile first boot):
1. Only `launchApp("slack")` — no About Me launch
2. Slack window fills the screen from menu bar to above the dock: `height = viewportHeight - topInset - bottomInset`, `y = topInset`, `width = viewportWidth`, `x = 0`
3. Slack is foregrounded

## Scope Boundaries

**In scope**:
- Change `src/App.tsx` first-boot logic to skip About Me launch on mobile
- Ensure Slack window fits the screen on mobile (height respects dock + safe area)
- Update e2e test to cover mobile default-app behavior

**Non-goals**:
- Changing mobile behavior for any other app
- Modifying the dock, menu bar, or resizing logic beyond first-boot placement
- Adding responsive breakpoints — use existing `window.innerWidth < 768` pattern

**Deferred to Follow-Up Work**:
- Configuring `mobileDefaultSize` per-app for other apps that might benefit from viewport-aware sizing (currently only used on first boot for Slack)

## Key Technical Decisions

1. **Skip About Me launch, don't hide it**: The simplest and cleanest fix is to not call `launchApp("about-me")` on mobile at all, rather than launching and immediately closing/minimizing it. This avoids the About Me component ever mounting, saving memory and initialization time.

2. **Use existing insets system for sizing**: The `useWindowInsets` hook already computes `topInset` (menu bar height) and `bottomInset` (dock + taskbar + safe area). For the initial mobile Slack window, compute height as `viewportHeight - topInset - bottomInset` and position at `y = topInset`.

3. **No changes to `getMobileWindowSize`**: The `getMobileWindowSize` function in `appRegistry.tsx` is used by all apps for default mobile sizing. Changing it globally would affect other apps. Instead, handle the first-boot sizing directly in `src/App.tsx` where the first-boot layout logic already lives, computing insets inline mirroring the desktop branch's approach.

## Implementation Units

### U1. Skip About Me Launch on Mobile First Boot

**Goal**: Prevent About Me from being launched on mobile first boot.

**Requirements**: Primary requirement — mobile devices should only see Slack on first open.

**Dependencies**: None.

**Files**:
- `src/App.tsx` (modify ~line 115)

**Approach**: Wrap the `launchApp("about-me")` call in a mobile check. On mobile, only launch Slack. The existing `isMobileDevice` check (line 111: `window.innerWidth < 768`) is already computed — reuse it.

**Patterns to follow**: The existing `isMobileDevice` conditional at line 123 (`if (isMobileDevice) { appStore.bringInstanceToForeground(slackId); }`) already branches behavior. Extend this branching to the launch calls as well.

**Test scenarios**:
- **Happy path**: On a viewport < 768px, first boot launches only Slack, not About Me
- **Happy path**: On a viewport >= 768px, first boot launches both Slack and About Me (desktop behavior unchanged)
- **Gap check**: After first boot on mobile, `useAppStore.getState().instances` contains only 1 instance (Slack), not 2
- **Integration**: Reload on mobile after first boot should not re-launch apps (existing guard: `setHasBooted()` prevents re-entry)

**Verification**:
- `bun test` passes
- Manual: Open on mobile viewport → only Slack appears
- Manual: Open on desktop viewport → both Slack and About Me appear side-by-side (regression check)

---

### U2. Size Slack Window to Fit Screen on Mobile First Boot

**Goal**: On mobile first boot, the Slack window fills the available screen space between the menu bar and above the dock, without overflowing past the safe area.

**Requirements**: Window must fit the screen perfectly and remain positioned above the dock.

**Dependencies**: U1 (modifies same code block).

**Files**:
- `src/App.tsx` (modify ~lines 106-160, the first-boot `useEffect`)
- `src/hooks/useWindowInsets.ts` (import, or compute insets inline)

**Approach**: In the mobile branch of the first-boot `setTimeout`, compute the available height and position the Slack window accordingly:
1. Compute `topInset` (menu bar height) and `bottomInset` (dock + taskbar + safe area) using the same theme-aware logic from `useWindowInsets.computeInsets()`
2. Set Slack window size: `{ width: viewportWidth, height: viewportHeight - topInset - bottomInset }`
3. Set Slack window position: `{ x: 0, y: topInset }`

The insets computation mirrors what already exists in `useWindowInsets.ts` (lines 45-64). Since `App.tsx` is a component, we can either:
- **Option A**: Import `useWindowInsets` and compute insets inline
- **Option B**: Read static theme config directly (simpler, avoids hook dependency complications in this effect)

**Option B is preferred** — compute insets directly from theme store state and dock store state, mirroring the same logic without the hook call pattern that `useWindowInsets` uses. This is already how the effect reads app store state (`useAppStore.getState()`), keeping the pattern consistent.

**Patterns to follow**:
- The desktop branch (lines 125-157) already uses `updateInstanceWindowState` to set explicit position and size — the mobile branch should do the same
- Inset computation pattern from `useWindowInsets.ts` lines 45-64
- `useAppStore.getState()` access pattern (used on line 110, 130)

**Test scenarios**:
- **Happy path**: On mobile (viewport 375x740), Slack window height = 740 - topInset - bottomInset (e.g., 740 - 28 - 60 = 652), positioned at y = topInset
- **Edge case**: On mobile with dock hidden (auto-hide), bottomInset should account for this (dock store `hiding` flag)
- **Edge case**: On tablet (768px < width < 1024px), desktop behavior applies (U1 ensures only desktop launches both apps)
- **Regression**: Desktop first boot still uses the side-by-side layout with explicit positioning (unchanged)

**Verification**:
- `bun test` passes
- Manual: Open on mobile viewport (DevTools device emulation) → Slack fills screen, no overflow past dock, no gap at bottom
- Manual: Dock auto-hide → Slack fills full height (accounts for no dock)

---

### U3. Update E2E Test for Mobile Default App Behavior

**Goal**: Ensure the Playwright e2e test verifies correct mobile behavior.

**Requirements**: Test coverage for the new mobile-first-boot behavior.

**Dependencies**: U1, U2.

**Files**:
- `e2e/default-apps.spec.ts` (modify)

**Approach**: Extend the existing test to cover both mobile and desktop viewports:
1. Add a mobile viewport test that opens at 375x740, waits for boot, and verifies only Slack is open (1 window instance)
2. Keep the existing desktop test (or refine it to verify both apps open)
3. Use Playwright's viewport configuration and `page.evaluate` to check `useAppStore.getState().instances`

**Patterns to follow**: Existing Playwright test structure in `e2e/default-apps.spec.ts`.

**Test scenarios**:
- **Mobile viewport (375x740)**: After boot, only 1 app instance exists and it's Slack
- **Desktop viewport (1280x800)**: After boot, 2 app instances exist (Slack + About Me) — regression check

**Verification**:
- `bun run build` compiles successfully
- Playwright e2e test passes: `npx playwright test e2e/default-apps.spec.ts`
