---
module: apps/slack
type: feat
created: 2026-05-17
status: active
---

# feat: Rename Slack App to "Workspace"

## Summary

Change the user-facing display name of the Slack app from "Slack" to "Workspace" across all surfaces (window titles, menu bar, help dialogs, translations, aria labels, dock labels). Keep the internal app ID `"slack"` and all technical identifiers unchanged so routing, stores, imports, and file paths continue to work.

## Problem Frame

The app currently displays as "Slack" everywhere, which is confusing since it is a case-study workspace, not the Slack product. Renaming it to "Workspace" better communicates its purpose to users.

## Scope Boundaries

**In scope:**
- User-visible display names in the app registry, metadata, menu bar, window titles, aria labels
- Translation strings (`name`, `title`, `description` in `translation.json`)
- Help item descriptions that mention "Slack"
- Plan/documentation references that describe user-facing behavior

**Out of scope:**
- Renaming the `src/apps/slack/` directory (stays as-is for technical stability)
- Renaming component files, types, CSS classes, or internal identifiers (store keys, import paths, data types)
- Renaming icon asset files (`slack.png`, `slack.svg`)
- Changing the app ID `"slack"` in routing, stores, app registry keys

### Deferred to Follow-Up Work
- Rename `src/apps/slack/` directory to `src/apps/workspace/` and update all imports (large refactor, separate PR)

## Key Technical Decisions

- **K1. Keep internal ID `"slack"`.** The app ID is used in routing (`appRegistry.tsx`), stores (`useSlackStore`), dock pinning (`useDockStore`), Spotlight search, i18n type unions, and help item key namespaces. Changing it would require updating dozens of non-user-facing references with no user benefit.
- **K2. Keep directory `src/apps/slack/`.** Matches the internal ID; changing the directory requires updating all imports and breaks git history continuity.
- **K3. Change only display names.** Window titles (`"Slack — #channel"` → `"Workspace — #channel"`), menu bar, help dialogs, aria labels, dock label, and translation strings.

## Implementation Units

### U1. Update Core Display Name and Metadata

**Goal:** Change the primary display name from "Slack" to "Workspace" in the app registry, metadata, and translation files.

**Requirements:** R-1 (display name is "Workspace" on all user-facing surfaces)

**Dependencies:** None

**Files:**
- `src/config/appRegistry.tsx` (name, description)
- `src/config/appRegistryData.ts` (appNames map value)
- `src/apps/slack/metadata.ts` (name)
- `src/apps/slack/index.tsx` (name in BaseApp export)
- `src/lib/locales/en/translation.json` (name, title, description)

**Approach:** Replace display string `"Slack"` → `"Workspace"` in each file. Keep `"Case study workspace"` description as-is (already says "workspace"). Verify the app ID keys and technical identifiers are untouched.

**Test scenarios:**
- App appears as "Workspace" in Finder grid
- App appears as "Workspace" in Dock label
- App appears as "Workspace" in Spotlight search results
- App appears as "Workspace" in the About dialog title

**Verification:** Run `bun run build` — the app still loads, no import errors. The app name in the launch interface shows "Workspace".

### U2. Update Window Titles, Menu Bar, and ARIA Labels

**Goal:** Change window title prefix, menu bar items, and ARIA labels from "Slack" to "Workspace".

**Requirements:** R-1 (display name is "Workspace" on all user-facing surfaces)

**Dependencies:** U1

**Files:**
- `src/apps/slack/components/SlackAppComponent.tsx` (window title prefix)
- `src/apps/slack/components/SlackMenuBar.tsx` (menu items: "Slack Help" → "Workspace Help", "About Slack" → "About Workspace")
- `src/apps/slack/components/SlackSidebar.tsx` (aria-label: "Slack workspace navigation" → "Workspace navigation")

**Approach:** String replacements in each file. No structural changes.

**Test scenarios:**
- Window title bar shows "Workspace — #welcome" instead of "Slack — #welcome"
- Menu bar shows "Workspace Help" and "About Workspace"
- Sidebar aria-label reads "Workspace navigation" (collapsed variant: "Workspace navigation, collapsed")

**Verification:** Visual inspection of window title and menu bar. Screen reader verification of ARIA labels.

### U3. Update Help Item Descriptions

**Goal:** Update help item descriptions that mention "Slack" to reference the workspace context.

**Requirements:** R-1 (display name is "Workspace" on all user-facing surfaces)

**Dependencies:** U1

**Files:**
- `src/lib/locales/en/translation.json` (help item descriptions)

**Approach:** Update help text in `translation.json` under `slack.help.*`. Review each description and replace any mention of "Slack" or "case study" language that is confusing. Current descriptions already use "case study" terminology, which may be fine. Focus on any that say "Slack" specifically.

**Test scenarios:**
- Help dialog items show appropriate workspace-context descriptions
- No user-facing text contains the word "Slack"

**Verification:** Visual inspection of Help dialog content.

### U4. Update Documentation and Plan References

**Goal:** Update documentation, plans, and the mobile snapshot to reflect the new display name where user-facing.

**Requirements:** None (documentation hygiene)

**Dependencies:** U1

**Files:**
- `mobile-snapshot.md` (user-facing button/menuitem labels)
- `docs/plans/2026-05-17-001-feat-mobile-first-boot-slack-only-plan.md` (references to user-facing "Slack" labels)
- `docs/brainstorms/slack-pixel-perfect-redesign-requirements.md` (user-facing references)
- `docs/brainstorms/slack-pixel-perfect-plan.md` (user-facing references)

**Approach:** Update only user-facing display name references in docs. Leave technical references to the `"slack"` ID, directory paths, and component/file names intact.

**Test scenarios:**
- Test expectation: none — documentation-only changes, verified by reading updated files

**Verification:** Grep for remaining user-facing "Slack" references in docs; ensure only technical identifiers remain.

## Risks

- **None.** This is a pure string replacement with no behavioral changes. The app ID and all technical identifiers remain unchanged.

## Test Summary

| Unit | Test File | Scenarios |
|------|-----------|-----------|
| U1 | N/A (config/i18n, verified by build) | Finder grid, Dock, Spotlight, About dialog display |
| U2 | N/A (verified by visual inspection) | Window title, menu bar, ARIA labels |
| U3 | N/A (verified by visual inspection) | Help dialog content |
| U4 | N/A (documentation) | Grep verification |
