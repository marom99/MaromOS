---
title: "feat: Owner / Visitor Auth Model"
type: feat
status: active
date: 2026-05-12
origin: docs/brainstorms/2026-05-12-owner-visitor-model-requirements.md
---

# feat: Owner / Visitor Auth Model

## Overview

Replace ryOS's multi-account auth model with an owner/visitor model. Visitors land in a fully functional default state as `"you"` — no sign-up, no login required. Marom can log in via Apple Menu to access owner-only features (Cloud Sync, Admin, Telegram). Logging out as owner returns the OS to visitor mode.

## Problem Frame

The current system gates core features (Chats send, AirDrop, Applet sharing, Karaoke sessions) behind an account login. Visitors who aren't Marom have to create accounts they don't need to do anything. The desired mental model: this is Marom's computer; everyone else is just a visitor. (see origin: docs/brainstorms/2026-05-12-owner-visitor-model-requirements.md)

## Requirements Trace

- R1. Default unauthenticated state has `username = "you"`, no sign-up required
- R2. All gated features work in visitor mode using `"you"` as identity
- R3. Server receives and displays sender as `"you"` for chat/AirDrop
- R4. Logging out as owner returns OS to visitor `"you"` mode, not blank state
- R5. "Log In" stays in Apple Menu for owner access
- R6. "Create Account" is removed from all UI surfaces
- R7. Cloud Sync, Admin, Telegram remain owner-only (hidden/disabled in visitor mode)
- R8. After login, OS behaves exactly as today (full owner identity)
- R9. Telegram link management remains owner-only

## Scope Boundaries

- Admin role model (`username === "ryo"`) is unchanged
- No "enter your name" visitor customization — always `"you"`
- No per-visitor server-side session tracking
- Calendar cloud sync disabled in visitor mode (same as other cloud features)
- `createUser` (account registration) server endpoint is left intact — no UI entry point after this change, but not deleted

## Context & Research

### Relevant Code and Patterns

- **`src/stores/useChatsStore.ts`** — all auth state lives here (`username`, `isAuthenticated`, `hasPassword`). `isAuthenticated` is NOT persisted; it is re-derived from `restoreSessionFromCookie()` on every page load. `username` is persisted under `_usr_recovery_key_` in localStorage as a plain-text fallback
- **`src/hooks/useAuth.ts`** — thin React bridge to `useChatsStore`. Manages dialog open/close and form field state locally. Two paths: `promptSetUsername` (register) and `promptVerifyToken` (login). No auth state of its own
- **`src/components/layout/AppleMenu.tsx`** — `const isLoggedIn = !!(username && isAuthenticated)`. When `false`: shows "Create Account" + "Log In". When `true`: shows "Log Out {username}"
- **`src/components/dialogs/LoginDialog.tsx`** — single component with two tabs (`"signup"` / `"login"`), driven by `initialTab` prop. Auto-closes on success via `useEffect`
- **`src/api/rooms.ts`** — `sendRoomMessage` posts to `/api/rooms/{id}/messages` with `credentials: "include"` (httpOnly cookie auth). No explicit auth headers added at the client layer
- **`src/stores/useAirDropStore.ts`** — uses `makeApiRequest(getApiUrl(...))` with `credentials: "include"`. Endpoints: heartbeat, discover, send, respond
- **`src/apps/chats/hooks/useChatRoom.ts`** — `sendRoomMessage` calls server and inspects error strings for auth keywords to show login toast. Typing guard: `if (!username || !isAuthenticated || !roomId) return`
- **`src/apps/finder/hooks/useFinderLogic.ts`** — `canShareViaAirDrop`: `if (!isAuthenticated || !chatUsername) return false`
- **`src/apps/control-panels/hooks/useControlPanelsLogic.ts`** — cloud sync and logout-all-devices check `if (!username || !isAuthenticated)`
- **`src/hooks/useTelegramLink.ts`** — Telegram link functions check auth
- **`src/apps/calendar/components/CalendarAppComponent.tsx`** — sync enabled when `username && isAuthenticated && calendarSyncReady`
- **`docs/8.4-auth-api.md`** — server auth requires both `Authorization: Bearer {token}` + `X-Username: {username}` headers for protected endpoints. Tokens stored in Redis with 90-day TTL

### Institutional Learnings

- Do NOT write `"you"` to `_usr_recovery_key_`. The recovery key is for real owner usernames; writing the guest identity there causes stale state on reload
- `useChatsStore.getState()` is accessed cross-store from at least `useIpodStore`, `useKaraokeStore`, and `useCloudSyncStore`. Changes to store fields cascade to those consumers
- Cookie-based auth (`credentials: "include"`) is the actual mechanism at runtime; the `Authorization + X-Username` headers described in the server docs appear to be an older pattern. Visitor mode needs a server cookie for "you" or the server must allow cookieless requests for visitor routes

## Key Technical Decisions

- **`isOwner: boolean` as the discriminator, not `isAuthenticated`**: `isAuthenticated` retains its semantic meaning ("has a real server session with a cookie"). A new `isOwner` flag (`true` only when logged in as real owner) gates owner-only features. Feature guards for visitor-accessible things drop the `isAuthenticated` check entirely — they only require `username !== null`. This avoids overloading `isAuthenticated` with visitor semantics and keeps the meaning clean
- **Visitor cold-start state**: `{ username: "you", isAuthenticated: false, isOwner: false }`. `isAuthenticated` remains `false` for visitors. `isOwner: false` gates all owner-only UI. Visitor features check `if (!username)` only
- **Server guest session via `/api/auth/guest` endpoint**: The server creates or reuses a pre-seeded `"you"` account and returns an httpOnly session cookie. The client calls this on startup when no owner session is found. This keeps all existing request infrastructure (`credentials: "include"`) working without client-side token management. See Unit 6
- **`_usr_recovery_key_` not set for visitors**: On logout (owner → visitor), clear the key. On startup in visitor mode, do not write `"you"` to it. This prevents the recovery mechanism from treating visitors as having a persisted identity
- **Remove Create Account entirely**: `LoginDialog` becomes owner-login-only. The signup tab and all `promptSetUsername` / `createUser` paths in `useAuth` are deleted. The server `POST /api/auth/register` endpoint is untouched (no client UI entry point, but still exists)

## Open Questions

### Resolved During Planning

- **Should `isAuthenticated` be `true` for visitors?** No — keep `isAuthenticated` as "has a real server session." Add `isOwner` as the new discriminator. This preserves semantic clarity and avoids changing every existing `isAuthenticated` reference; instead, targeted references are updated to `isOwner`
- **Server location**: The API server is separate from this repo. Server changes (Unit 6) must be coordinated and deployed before AirDrop and Chat send work end-to-end
- **Visitor AirDrop heartbeat**: The heartbeat call (`POST /api/airdrop/heartbeat`) announces presence. In visitor mode, the guest session cookie enables this call to work for `"you"` once Unit 6 is live. No client-side changes needed beyond enabling the call path

### Deferred to Implementation

- **Exact store action names for `isOwner`**: Whether to add a `setIsOwner(v: boolean)` action or derive it inline
- **Karaoke + iPod lyric-offset saving** (`useIpodStore`, `useListenSessionStore`): Both gate lyric-offset persistence behind `isAuthenticated`. Under the new model these should check `isOwner` so visitors don't save server-side state. Confirm exact guard locations during implementation
- **`makeApiRequest` vs `apiRequest`**: AirDrop store uses `makeApiRequest(getApiUrl(...))` — confirm this wrapper also sends `credentials: "include"` and that the guest cookie flows correctly

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Page load
  ↓
useChatsStore initializes:
  username = recoveredUsername ?? null
  isAuthenticated = false
  isOwner = false
  ↓
onRehydrateStorage fires:
  if (recoveredUsername) → restoreSessionFromCookie(recoveredUsername)
    → 200: username = data.username, isAuthenticated = true, isOwner = true
    → 401: forceLogout → username = null, isAuthenticated = false, isOwner = false
             then → fetchGuestSession() → sets "you" cookie
             → username = "you", isAuthenticated = false, isOwner = false
  if (!recoveredUsername) → fetchGuestSession()
    → username = "you", isAuthenticated = false, isOwner = false

Owner logs in (Apple Menu → Log In):
  loginWithPassword → 200 → username = "ryo", isAuthenticated = true, isOwner = true
  clear _usr_recovery_key_, write owner username to it

Owner logs out:
  logout() → clear session cookie
  clear _usr_recovery_key_
  fetchGuestSession() → restore "you" state
  username = "you", isAuthenticated = false, isOwner = false

Feature guard matrix:
  Visitor-accessible (Chats send, AirDrop, Karaoke, Applet share):
    Before: if (!username || !isAuthenticated) → block
    After:  if (!username) → block  (visitors have "you", always passes)

  Owner-only (Cloud Sync, Telegram, Admin, Calendar sync):
    Before: if (!username || !isAuthenticated) → block
    After:  if (!isOwner) → block
```

## Implementation Units

- [ ] **Unit 1: Add `isOwner` flag and visitor defaults to `useChatsStore`**

**Goal:** Introduce the `isOwner` discriminator and make the store initialize to visitor state, restoring visitor state on logout and on session failure.

**Requirements:** R1, R4, R8

**Dependencies:** None

**Files:**
- Modify: `src/stores/useChatsStore.ts`

**Approach:**
- Add `isOwner: boolean` to state interface and initial state (`false`)
- Do NOT persist `isOwner` (same rationale as `isAuthenticated`)
- `restoreSessionFromCookie`: on 200, also set `isOwner = true`; on 401/403, after clearing auth state, call `fetchGuestSession()` to set the "you" guest cookie (new internal action, see Unit 6 dependency note)
- `logout` action: after clearing auth, call `fetchGuestSession()` instead of leaving state null. Set `username = "you"`, `isOwner = false`, `isAuthenticated = false`, do NOT write `"you"` to `_usr_recovery_key_`
- `loginWithPassword` and `verifyAuthToken` success paths: set `isOwner = true`
- `getInitialState`: `username = null` still (guest fetch happens async in rehydration), `isOwner = false`

**Patterns to follow:**
- Existing `isAuthenticated` handling pattern in `useChatsStore` — mirror exactly for `isOwner`
- `forceLogoutOnUnauthorized` as the model for the reset-to-visitor transition

**Test scenarios:**
- Happy path: page loads with no recovery key → store initializes as visitor (`username = "you"`, `isOwner = false`) after guest fetch
- Happy path: page loads with valid recovery key and cookie → `restoreSessionFromCookie` succeeds → `isOwner = true`
- Edge case: session restore returns 401 → resets to visitor state, `isOwner = false`, `username = "you"`
- Happy path: owner logs in → `isOwner = true`, `isAuthenticated = true`
- Happy path: owner logs out → returns to visitor state (`username = "you"`, `isOwner = false`), `_usr_recovery_key_` cleared
- Edge case: `"you"` is never written to `_usr_recovery_key_`

**Verification:**
- On a fresh browser (no cookies, no localStorage), store state is `{ username: "you", isOwner: false }` after load
- Logging in as owner produces `isOwner = true`
- Logging out as owner produces `username = "you"`, `isOwner = false`

---

- [ ] **Unit 2: Apple Menu — remove Create Account, update auth menu items**

**Goal:** Visitors see only "Log In". Owner sees only "Log Out [username]". No "Create Account" anywhere.

**Requirements:** R5, R6

**Dependencies:** Unit 1 (`isOwner` flag available in store)

**Files:**
- Modify: `src/components/layout/AppleMenu.tsx`

**Approach:**
- Replace `const isLoggedIn = !!(username && isAuthenticated)` with `const isOwner = useChatsStoreShallow(s => s.isOwner)`
- Remove the "Create Account" `MenuItem` entirely (and the second `LoginDialog` instance wired to `initialTab="signup"`)
- When `!isOwner`: render one "Log In" item → `promptVerifyToken()`
- When `isOwner`: render "Log Out [username]" item → `promptLogout()`
- Remove any `LoginDialog` instance that was dedicated to the signup flow

**Patterns to follow:**
- Existing `isLoggedIn` conditional pattern in `AppleMenu.tsx`

**Test scenarios:**
- Happy path: unauthenticated/visitor state — only "Log In" appears in Apple Menu; "Create Account" is absent
- Happy path: owner logged in — "Log Out [username]" appears; "Log In" and "Create Account" absent
- Edge case: no username and no owner state (brief startup moment) — "Log In" shown (not "Create Account")

**Verification:**
- No "Create Account" text visible in the Apple Menu under any auth state
- "Log In" visible when `isOwner = false`
- "Log Out [username]" visible when `isOwner = true`

---

- [ ] **Unit 3: LoginDialog and useAuth — owner-login only**

**Goal:** Remove the signup tab from `LoginDialog` and strip Create Account logic from `useAuth`. The dialog becomes a pure owner-login flow.

**Requirements:** R6, R8

**Dependencies:** Unit 1 (login success sets `isOwner = true` in store)

**Files:**
- Modify: `src/components/dialogs/LoginDialog.tsx`
- Modify: `src/hooks/useAuth.ts`

**Approach:**

*`LoginDialog.tsx`:*
- Remove the `"signup"` tab entirely — the tab bar, tab content, and any conditional rendering for register mode
- If `initialTab` prop is still accepted, keep it accepting only `"login"` (or remove the prop)
- Dialog now renders only the login form fields

*`useAuth.ts`:*
- Delete `promptSetUsername`, `submitUsernameDialog`, and `isSettingUsername` / `setUsernameError` / `usernameInput` local state
- Delete `createUser` usage (the store action remains but has no UI entry point)
- After successful `handleVerifyTokenSubmit` login, confirm `isOwner = true` is set via the store action (should be handled in Unit 1's `loginWithPassword`/`verifyAuthToken` success path)
- Keep: `promptVerifyToken`, `handleVerifyTokenSubmit`, `promptLogout`, `confirmLogout`, `isLoggingIn`, `loginError`, `tokenInput`, `tokenUsername`, `passwordMode`

**Patterns to follow:**
- Existing `LoginDialog` tab pattern — simply remove the signup tab; do not restructure the component further

**Test scenarios:**
- Happy path: "Log In" clicked → dialog opens showing only login form (no signup tab)
- Happy path: valid owner credentials entered → login succeeds, `isOwner = true`, dialog closes
- Error path: invalid credentials → error shown, `isOwner` stays false
- Edge case: `initialTab="signup"` (if still in code somewhere) gracefully falls back to login tab

**Verification:**
- Opening the login dialog shows no signup/register tab or form fields
- Successful login results in `isOwner = true` in store
- No `createUser` calls fire from the UI

---

- [ ] **Unit 4: Owner-only feature guards — switch to `isOwner`**

**Goal:** Cloud Sync, Telegram, Calendar sync, and Admin remain owner-only by switching their guards from `isAuthenticated` to `isOwner`.

**Requirements:** R7, R9

**Dependencies:** Unit 1

**Files:**
- Modify: `src/apps/control-panels/hooks/useControlPanelsLogic.ts`
- Modify: `src/hooks/useTelegramLink.ts`
- Modify: `src/apps/calendar/components/CalendarAppComponent.tsx`
- Modify: `src/apps/admin/components/DashboardPanel.tsx`
- Modify: `src/apps/admin/components/SongDetailPanel.tsx`
- Modify: `src/apps/admin/components/UserProfilePanel.tsx`
- Modify: `src/apps/admin/components/ServerPanel.tsx`

**Approach:**
- In each file: replace `if (!username || !isAuthenticated)` and `username && isAuthenticated` owner checks with `if (!isOwner)` and `isOwner`
- `useControlPanelsLogic.ts`: `handleCloudBackup`, `handleCloudForceUpload`, `handleCloudForceDownload`, `handleCloudRestore`, `handleLogoutAllDevices` — all check `isOwner`
- `useTelegramLink.ts`: `handleCreateTelegramLink`, `handleDisconnectTelegramLink`, `refreshTelegramLinkStatus` — check `isOwner`
- Calendar `calendarSyncReady` condition: `isOwner && calendarSyncReady`
- Admin components: already gated by `username === "ryo"` which stays intact; additionally replace any explicit `isAuthenticated` check with `isOwner` for clarity

**Patterns to follow:**
- Existing guard pattern in `useControlPanelsLogic.ts` — mechanical swap

**Test scenarios:**
- Happy path: owner logs in → cloud sync, Telegram, admin controls all active
- Edge case: visitor (`isOwner = false`) — cloud sync UI disabled/hidden, Telegram options absent
- Edge case: owner logs out → immediately returns to visitor state, cloud sync becomes unavailable

**Verification:**
- Cloud Sync panel buttons are disabled/hidden in visitor mode
- Telegram link controls absent in visitor mode
- Admin app inaccessible to visitor (existing `username === "ryo"` check still holds)

---

- [ ] **Unit 5: Remove auth gates from visitor-accessible features**

**Goal:** AirDrop, Chat send, Karaoke session start, and Applet sharing work for visitors. Remove the `isAuthenticated` checks from their feature guards.

**Requirements:** R2

**Dependencies:** Unit 1

**Files:**
- Modify: `src/apps/finder/hooks/useFinderLogic.ts`
- Modify: `src/apps/chats/hooks/useChatRoom.ts`
- Modify: `src/apps/karaoke/hooks/useKaraokeLogic.ts`
- Modify: `src/apps/applet-viewer/hooks/useAppletViewerLogic.ts`
- Modify: `src/apps/internet-explorer/hooks/useInternetExplorerLogic.ts` (review)
- Modify: `src/apps/ipod/hooks/useIpodLogic.ts` (review)

**Approach:**

*`useFinderLogic.ts`:*
- `canShareViaAirDrop`: change `if (!isAuthenticated || !chatUsername)` to `if (!chatUsername)`. Visitors always have `"you"` so AirDrop is available.

*`useChatRoom.ts`:*
- Typing indicator guard: change `if (!username || !isAuthenticated || !roomId) return` to `if (!username || !roomId) return`
- `sendRoomMessage` error handling: remove the "Login Required" toast path for auth errors — with the guest session (Unit 6), `"you"` can send messages. If server rejects, show a generic error instead of a login CTA
- `handleAddRoom` already checks only `if (!username) return` — no change needed

*`useKaraokeLogic.ts`:*
- `handleStartListenSession` guard: remove `isAuthenticated` requirement, keep `username` check (visitors have `"you"`)

*`useAppletViewerLogic.ts`:*
- `handleShareApplet`: change guard from requiring `isAuthenticated` to just requiring `username`

*`useInternetExplorerLogic.ts` and `useIpodLogic.ts`:*
- Review and remove any `isAuthenticated` guard that is not protecting server-write state (lyric offset saving etc. — see deferred note in Open Questions)

**Patterns to follow:**
- Existing guard pattern in each file — minimal targeted change, remove only `isAuthenticated` from guards that should be visitor-accessible

**Test scenarios:**
- Happy path: visitor (`username = "you"`) opens Finder → AirDrop view shows and is interactive (not blocked)
- Happy path: visitor opens Chats → message input is enabled and send can be attempted (Unit 6 required for server success)
- Happy path: visitor opens Karaoke → "Start Listen Session" button is active, not blocked by login gate
- Happy path: visitor opens Applet Viewer → "Share" button is active for `"you"`
- Edge case: visitor typing indicator in Chats fires correctly with `username = "you"`
- Error path: Unit 6 not yet deployed — chat send returns server error; verify error is displayed generically (not as "Login Required" login CTA). No crash, no redirect
- Error path: AirDrop send returns server error before Unit 6 — verify graceful error message, AirDrop view stays open

**Verification:**
- No "Login Required" gate appears when visitor tries to send chat, use AirDrop, start Karaoke session, or share an applet
- Features render and allow interaction; actual server success depends on Unit 6 deployment
- Server errors in visitor mode show generic error feedback, not login prompts

---

- [ ] **Unit 6: Server — guest session endpoint for "you"**

**Goal:** The server exposes a `GET /api/auth/guest` endpoint that sets an httpOnly session cookie for the pre-seeded `"you"` account. This allows the frontend's `credentials: "include"` request pattern to work for visitors without any client-side token management.

**Requirements:** R2, R3

**Dependencies:** Deployed after Units 1–5 (frontend can land without it; visitor server actions will return auth errors until this is live)

**Files:** *(Server repo — not in this codebase)*
- Create or modify: `api/auth/guest.ts` (or equivalent route handler)
- Seed: ensure a `"you"` user account exists in the user store / Redis with a stable session
- Modify: `api/_utils/request-auth.ts` — ensure the guest cookie is validated correctly for all protected routes

**Approach:**
- Pre-seed a `"you"` user account with a long-lived token (or generate on first `GET /api/auth/guest` call and cache in Redis)
- `GET /api/auth/guest`: no input required, sets `ryos_auth` httpOnly cookie scoped to the `"you"` session; returns `{ username: "you" }`
- Protected routes (chat send, AirDrop) validate the `"you"` session cookie like any other session

**Client-side call site** (in this repo, `useChatsStore.ts`):
- `fetchGuestSession()` internal action: `GET /api/auth/guest` → on 200, do NOT set `isAuthenticated = true` (preserve semantics) — the cookie is set server-side transparently. `username` is already `"you"` in store state

**Test scenarios:**
- Happy path: fresh browser → `GET /api/auth/guest` → cookie set → chat message send succeeds as `"you"` → other users see sender `"you"`
- Happy path: AirDrop heartbeat sent as `"you"` → visible to other clients in discover list
- Error path: guest endpoint unavailable → store handles gracefully, visitor UX degrades to read-only (no crash)
- Integration: owner logs in over a guest session → old `"you"` cookie replaced by owner cookie

**Verification:**
- `POST /api/rooms/{id}/messages` from a fresh browser succeeds and message appears in chat as sender `"you"`
- AirDrop heartbeat accepted, `"you"` appears in discover results

## System-Wide Impact

- **Interaction graph:** All `useChatsStore.getState()` cross-store callers (`useIpodStore`, `useKaraokeStore`, `useCloudSyncStore`) must be checked — they access `username` and possibly `isAuthenticated`. Adding `isOwner` is additive and safe; callers reading `username` will get `"you"` in visitor mode (currently they get `null`)
- **State lifecycle risks:** `username` is no longer nullable for most of the runtime (always `"you"` or an owner username). Any null-guard on `username` that was acting as an auth gate becomes always-true for visitors — audit these
- **API surface parity:** The `"you"` cookie must be treated identically to a real user session by all protected server routes (chat, AirDrop, etc.). Admin endpoints (`/api/admin`) must explicitly reject the `"you"` session
- **Unchanged invariants:** `username === "ryo"` admin check is unchanged. `isAuthenticated` meaning ("has a real server session") is unchanged. `_usr_recovery_key_` write policy unchanged (only real owner usernames)
- **Integration coverage:** End-to-end chat send and AirDrop will only prove out after Unit 6 is deployed server-side. Frontend units 1–5 can be verified independently via UI inspection and store state

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Server not yet updated — chat send and AirDrop fail for visitors | Units 1–5 land first; Unit 6 is the server dependency. Feature falls back gracefully (server error, not crash) |
| `_usr_recovery_key_` accidentally set to `"you"` on logout | Explicit rule: `logout` action must NOT write `"you"` to the recovery key. Covered in Unit 1 test scenarios |
| Cross-store callers (`useIpodStore`, etc.) receive `username = "you"` unexpectedly | Audit all `useChatsStore.getState().username` call sites during Unit 1 implementation; nullish guards become always-truthy, verify behavior |
| Admin routes accepting `"you"` guest cookie | Server must explicitly reject the `"you"` session on `/api/admin/*` routes. Flagged in Unit 6 approach |
| `makeApiRequest` (AirDrop) vs `apiRequest` (Chat) sending cookies differently | Confirm both wrappers use `credentials: "include"` before Unit 6 deployment |

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-12-owner-visitor-model-requirements.md](docs/brainstorms/2026-05-12-owner-visitor-model-requirements.md)
- Auth state architecture: `docs/3.2-state-management.md`
- Server auth protocol: `docs/8.4-auth-api.md`, `docs/8.6-messages-api.md`
- Related code: `src/stores/useChatsStore.ts`, `src/hooks/useAuth.ts`, `src/components/layout/AppleMenu.tsx`, `src/components/dialogs/LoginDialog.tsx`
