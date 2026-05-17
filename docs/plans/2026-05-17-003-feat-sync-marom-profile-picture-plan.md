---
id: 2026-05-17-003
type: feat
title: "feat: Synchronize Marom profile picture across Workspace and About Me apps"
status: active
created: 2026-05-17
origin: PRSNL-162
target_branch: main
---

## Summary

Fix the inconsistent Marom profile picture in the Workspace (Slack) app and establish cross-app synchronization so that changing the picture in the About Me app automatically updates it everywhere.

Currently, the DM sidebar in the Workspace app shows a different avatar for Marom (eagle) than every other surface (lotus/Football). This is caused by a single hardcoded wrong index. Additionally, About Me and Workspace each independently hardcode Marom's picture reference, preventing cross-app synchronization.

## Problem Frame

**Actor:** Marom (the single user/owner)

**Current behavior:**
- Workspace DM sidebar → eagle (`SLACK_PROFILE_PICTURES[0]`) — **wrong**
- Workspace DM header, channel messages, thread panel, members list, channel header → lotus/Football (`SLACK_PROFILE_PICTURES[3]`) — correct
- About Me app → lotus/Football (`ALL_USER_PICTURES[37]`) — correct

**Desired behavior:**
- Marom's profile picture is consistent everywhere
- Changing the picture in About Me propagates to Workspace automatically

**Non-goals:**
- General multi-user profile picture system (only Marom is the single user)
- Cloud-synced profile pictures (local state is sufficient)
- Changing any non-Marom avatars

---

## Key Technical Decisions

1. **Shared constant over store** — A shared exported constant for Marom's picture provides cross-app synchronization without the overhead of a Zustand store. Both apps import from the same source. This satisfies the requirement: when About Me changes the picture, all consumers pick it up (they already re-render on state changes).

2. **Direct `ALL_USER_PICTURES` index in avatar utility** — Use a named export (`MAROM_PICTURE_INDEX`) in `slackAvatarUtils.ts` that both apps import, rather than scattering magic indices. The About Me app already references `ALL_USER_PICTURES` directly; the Slack app references through the `SLACK_PROFILE_PICTURES` indirection. Introducing a shared constant bridges them.

3. **Slack mapping update** — When `MAROM_PICTURE_INDEX` changes, the `SLACK_PROFILE_PICTURES` array at index 3 must reflect it. This coupling is acceptable for a single-user system.

---

## Implementation Units

### U1. Fix DM sidebar hardcoded avatar index

**Goal:** Make the DM sidebar show the same Marom avatar as everywhere else in the Workspace app.

**Requirements:** Marom's profile picture is consistent across all Workspace surfaces.

**Dependencies:** None.

**Files:**
- `src/apps/slack/components/SlackSidebar.tsx`

**Approach:**
Change line 127 from `SLACK_PROFILE_PICTURES[0]` (eagle) to `SLACK_PROFILE_PICTURES[3]` (Marom's correct picture — lotus/Football). The DM list currently only contains Marom, so a single fixed index is correct for now. If the DM list gains more contacts in the future, each contact should carry an `avatarIndex` property.

**Patterns to follow:** All other Slack components use `SLACK_PROFILE_PICTURES[3]` or `SLACK_PROFILE_PICTURES[member.avatarIndex]` where `avatarIndex` is 3 for Marom.

**Test scenarios:**
- Marom's avatar in the DM sidebar matches the avatar in the DM header
- Marom's avatar in the DM sidebar matches the avatar in channel messages

**Verification:** Open the Workspace app — the DM sidebar avatar and DM header avatar are identical. Channel messages for Marom also match.

---

### U2. Introduce shared Marom profile picture reference

**Goal:** Both About Me and Workspace apps read Marom's picture from a single shared reference, enabling cross-app synchronization.

**Requirements:** Changing Marom's picture in About Me auto-updates the Workspace app.

**Dependencies:** U1 (builds on the fixed sidebar).

**Files:**
- `src/apps/slack/components/slackAvatarUtils.ts` (add `MAROM_PICTURE_INDEX` export)
- `src/apps/slack/components/SlackSidebar.tsx` (use new constant)
- `src/apps/slack/components/SlackDMHeader.tsx` (use new constant)
- `src/apps/about-me/components/AboutMeAppComponent.tsx` (import and use shared constant)
- `tests/test-profile-avatar-consistency.test.ts` (new test file)

**Approach:**
1. Export `MAROM_PICTURE_INDEX = 37` from `slackAvatarUtils.ts` — this is the index into `ALL_USER_PICTURES`.
2. Rebuild `SLACK_PROFILE_PICTURES[3]` to reference `ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path` instead of `ALL_USER_PICTURES[37]?.path`.
3. Update `SlackSidebar.tsx` to use the named constant or `SLACK_PROFILE_PICTURES[3]`.
4. In `AboutMeAppComponent.tsx`, import `MAROM_PICTURE_INDEX` from the avatar utils and replace the hardcoded `37` with `MAROM_PICTURE_INDEX`.
5. The `SLACK_PROFILE_PICTURES` array stays at 4 entries; the 3rd index is now derived from `MAROM_PICTURE_INDEX`.

**Patterns to follow:** Named constant export pattern (`export const X = ...`) is already used in `slackAvatarUtils.ts`. Cross-import between About Me and Slack is acceptable — the shared constant lives in the Slack utils for discoverability, and About Me imports it.

**Test scenarios:**
- Both About Me and Workspace render the same picture path for Marom
- Changing `MAROM_PICTURE_INDEX` to a different valid index (e.g., 5) causes both apps to show the new picture
- `MAROM_PICTURE_INDEX` is within valid bounds (0–42)
- `SLACK_PROFILE_PICTURES[3]` equals `ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path`

**Verification:** Open both About Me and Workspace apps — Marom's avatar is identical in all locations.

---

### U3. Fix out-of-bounds avatarIndex values in channel content

**Goal:** Ensure all `avatarIndex` values in channel message data point to valid indices in `SLACK_PROFILE_PICTURES`.

**Requirements:** No message renders a broken/fallback avatar due to out-of-bounds index.

**Dependencies:** None (independent cleanup).

**Files:**
- `src/apps/slack/data/channelContent.ts`

**Approach:**
Two testimonial messages reference non-existent indices:
- Casey Park (line ~445): `avatarIndex: 4` → should be `3` (Marom/Football) or `0` (if revisiting channel ownership)
- Morgan Liu (line ~457): `avatarIndex: 5` → should be one of {0, 1, 2, 3}

The correct fix depends on who "wrote" those testimonials. By default, assign both to `avatarIndex: 0` (the first member/eagle) since they are not in the member list and 0 is the safest fallback.

**Patterns to follow:** All other messages in `channelContent.ts` use `avatarIndex` values within 0–3.

**Test scenarios:**
- All `avatarIndex` values in `channelContent.ts` are between 0 and `SLACK_PROFILE_PICTURES.length - 1`
- Casey Park's testimonial renders a valid avatar (not initials fallback)
- Morgan Liu's testimonial renders a valid avatar (not initials fallback)

**Verification:** Open the general channel in Workspace, scroll to Casey Park and Morgan Liu testimonials — both show actual pictures, not initials.

---

### U4. Write profile avatar consistency tests

**Goal:** Prevent avatar index regressions across app surfaces.

**Requirements:** Tests validate that Marom's avatar is consistent everywhere and that `avatarIndex` values are within bounds.

**Dependencies:** U1, U2, U3.

**Files:**
- `tests/test-profile-avatar-consistency.test.ts`

**Approach:**
A unit test file using `bun:test` that validates:
- `SLACK_PROFILE_PICTURES` array integrity (correct length, mapping to valid `ALL_USER_PICTURES` entries)
- `MAROM_PICTURE_INDEX` is within valid bounds
- `SLACK_PROFILE_PICTURES[3]` equals `ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path`
- All `avatarIndex` values in `channelContent.ts` and `dmContent.ts` are within `SLACK_PROFILE_PICTURES` bounds
- `AboutMeAppComponent` references `MAROM_PICTURE_INDEX` (structural check)

**Patterns to follow:** Existing test files in `tests/` use `describe`/`test`/`expect` from `bun:test`. Pure unit tests — no React rendering or browser required.

**Test scenarios (unit/wiring):**
- `SLACK_PROFILE_PICTURES` has 4 entries
- Every entry in `SLACK_PROFILE_PICTURES` is a non-null string (a valid path)
- `MAROM_PICTURE_INDEX` is between 0 and `ALL_USER_PICTURES.length - 1`
- `SLACK_PROFILE_PICTURES[3]` === `ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path`
- All `avatarIndex` values in `channelContent.messages` are >= 0 and < `SLACK_PROFILE_PICTURES.length`
- All `avatarIndex` values in `dmContent.messages` are >= 0 and < `SLACK_PROFILE_PICTURES.length`

**Test files to create:** `tests/test-profile-avatar-consistency.test.ts`

**Verification:** `bun test tests/test-profile-avatar-consistency.test.ts` passes all assertions.

---

## Scope Boundaries

### In scope
- Fix DM sidebar avatar for Marom
- Shared constant for Marom's picture across About Me and Workspace
- Fix out-of-bounds `avatarIndex` values in channel data
- Avatar index validation tests

### Deferred to Follow-Up Work
- Generalize the shared avatar system for all users (currently single-user)
- DM sidebar contact list with dynamic `avatarIndex` per contact
- Cloud-sync for profile pictures via `useCloudSyncStore` or `useContactsStore`

### Outside scope
- Changing any non-Marom avatar
- Profile picture upload/replacement mechanism
- Tauri-native avatar handling

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `MAROM_PICTURE_INDEX` constant drift (About Me changes it, Workspace doesn't pick it up) | Low | Medium | Both apps import the same constant — a single source of truth prevents drift. Test validates mapping integrity. |
| DM sidebar gains multiple contacts, hardcoded index becomes wrong | Medium | Low | Deferred to follow-up: add `avatarIndex` per DM contact. Current scope only has one DM contact (Marom). |
| Out-of-bounds fix changes testimonial author attribution | Low | Low | Testimonials use `avatarIndex: 0` as safe default. Not visible to end users as intentional attribution. |
