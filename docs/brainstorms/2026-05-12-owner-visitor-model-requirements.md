---
date: 2026-05-12
topic: owner-visitor-model
---

# Owner / Visitor Model

## Problem Frame

ryOS is Marom's personal OS. The current auth model treats every user as a first-class account holder — requiring sign-up or login to use core features (Chats, AirDrop, Cloud Sync). This creates friction for visitors, who can't do anything meaningful without creating an account they don't need.

The desired mental model: this is Marom's computer. Visitors use it freely without any identity ceremony. Marom can log in as himself when he needs owner-only features.

## Requirements

**Visitor ("you") Mode**
- R1. The default unauthenticated state has the username `"you"` — no sign-up or login required.
- R2. All features currently gated behind auth (Chats send, AirDrop, Applet sharing, Karaoke sessions) are available in visitor mode, using `"you"` as the identity.
- R3. When a visitor sends a chat message or shares via AirDrop, the server receives and displays the sender as `"you"`.
- R4. Logging out as the owner returns the OS to visitor (`"you"`) mode — not to a blank/unauthenticated state.

**Owner Login**
- R5. "Log In" remains visible in the Apple Menu and works as today (username + password).
- R6. "Create Account" is removed from the Apple Menu and any other visible UI surface.
- R7. Cloud Sync (backup, restore, force upload/download) and the Admin app remain restricted to the authenticated owner — they are hidden or disabled in visitor mode.
- R8. After a successful login, the OS behaves exactly as today (owner identity, all features, cloud sync active).

**Telegram**
- R9. Telegram link management (create, disconnect) remains owner-only.

## Success Criteria
- A visitor landing on ryOS can open Chats, send a message, and use AirDrop with zero sign-up steps.
- Marom can log in via Apple Menu, access cloud sync and admin, and log out back to visitor mode.
- No "Create Account" prompt appears anywhere in the UI for visitors.

## Scope Boundaries
- Not changing the admin role model (`username === "ryo"`).
- Not adding visitor customization (no "enter your name" flow — the username is always `"you"`).
- Not implementing per-visitor session tracking server-side.
- Calendar cloud sync behavior in visitor mode is out of scope for this change (assumed disabled, same as other cloud-sync features).

## Key Decisions
- **Visitor username is literally `"you"`**: Simple, consistent, no prompt, matches the POV that others are just using Marom's computer.
- **Functional visitor mode, not read-only**: Visitors can send, share, and interact — not just browse.
- **Owner login kept in Apple Menu**: Low friction for Marom; invisible to visitors who don't need it.

## Dependencies / Assumptions
- The server must accept `"you"` as a valid sender for chat and AirDrop. This likely requires either a pre-created guest account named `"you"` on the server, or a server-side adjustment to permit requests from a known guest identity without a full auth token.

## Outstanding Questions

### Resolve Before Planning
- None.

### Deferred to Planning
- [Affects R2, R3][Needs research] Does the server currently reject unauthenticated or `"you"`-username requests for chat and AirDrop? What is the minimal server change needed to make `"you"` work as a sender?
- [Affects R1][Technical] How should `useChatsStore` initialize — should `isAuthenticated` remain `false` in visitor mode and features simply stop checking it, or should visitor mode set `username = "you"` with a special flag?
- [Affects R6][Technical] What is the cleanest way to remove "Create Account" without breaking the `LoginDialog` component that handles both flows?

## Next Steps
→ `/ce:plan` for structured implementation planning
