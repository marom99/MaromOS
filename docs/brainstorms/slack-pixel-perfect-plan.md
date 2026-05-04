# Slack Pixel-Perfect Redesign — Implementation Plan

Date: 2026-05-04

## Overview

Replace the Slack app's internal UI with pixel-perfect rendering from `Recreating-your-messaging-app.html`. The HTML design is a single static view of a Slack workspace (#design-lab channel) with detailed Aqua-themed gradients, shadows, textures, and exact hex colors. This v1 delivers the static view only; interactive features return in later iterations.

## File Change Summary

| Action | File | Description |
|--------|------|-------------|
| **REWRITE** | `src/apps/slack/components/slack-aqua.css` | Full CSS replacement with HTML styles |
| **REWRITE** | `src/apps/slack/components/SlackAppComponent.tsx` | Simplify to static two-pane layout |
| **REWRITE** | `src/apps/slack/components/SlackSidebar.tsx` | Match HTML's sidebar DOM exactly |
| **REWRITE** | `src/apps/slack/components/SlackChannelHeader.tsx` | Match HTML's header DOM exactly |
| **REWRITE** | `src/apps/slack/components/SlackMessages.tsx` | Match HTML's message list DOM exactly |
| **REWRITE** | `src/apps/slack/components/SlackMessage.tsx` | Match HTML's single message DOM exactly |
| **REWRITE** | `src/apps/slack/components/SlackComposer.tsx` | Match HTML's composer DOM (static) |
| **REWRITE** | `src/apps/slack/data/caseStudies.ts` | Single channel with HTML's data |
| **REWRITE** | `src/stores/useSlackStore.ts` | Minimal store (activeChannelId only) |
| **REWRITE** | `src/apps/slack/components/SlackMenuBar.tsx` | Simplified menu (no thread/details/font toggles) |
| **UPDATE** | `src/apps/slack/metadata.ts` | Updated help items |
| **CREATE** | `src/apps/slack/assets/` | Extract 7 PNG files from base64 |
| **DELETE** | `src/apps/slack/components/SlackThreadPanel.tsx` | Not in HTML |
| **DELETE** | `src/apps/slack/components/SlackDetailsPanel.tsx` | Not in HTML |
| **DELETE** | `src/apps/slack/components/SlackPoll.tsx` | Not in HTML |
| **DELETE** | `src/apps/slack/components/SlackGifMessage.tsx` | Not in HTML |
| **DELETE** | `src/apps/slack/components/SlackReactionRow.tsx` | Static reactions only |
| **DELETE** | `src/apps/slack/components/SlackAttachment.tsx` | Merged into SlackMessage |
| **DELETE** | `src/apps/slack/data/gifs.ts` | Not needed |
| **DELETE** | `src/apps/slack/hooks/useSlackFrameLayout.ts` | No responsive layout in v1 |
| **KEEP** | `src/apps/slack/index.tsx` | Unchanged (exports BaseApp) |
| **KEEP** | `src/apps/slack/types.ts` | Keep for future use (mostly unused in v1) |
| **KEEP** | `src/apps/slack/components/SlackDialogs.tsx` | Unchanged (Help/About) |

## Per-File Implementation Details

### 1. `src/apps/slack/components/slack-aqua.css` — FULL REWRITE

Extract all CSS from the HTML `<style>` block, with these modifications:

- **REMOVE**: `* { margin:0; padding:0; box-sizing:border-box; }` and `html, body` styles (handled by ryOS global styles)
- **REMOVE**: `body` styles (background, flex centering, padding) — WindowFrame handles viewport
- **REMOVE**: `.window` styles (outer container with border-radius, box-shadow) — WindowFrame provides window chrome
- **REMOVE**: `.titlebar`, `.traffic`, `.dot`, `.red`, `.yellow`, `.green` styles — WindowFrame provides traffic lights
- **REMOVE**: `@media` query block with `.window` transform/scale rules
- **KEEP**: All `.app`, `.sidebar`, `.main`, `.main-head`, `.messages`, `.msg`, `.composer` styles and sub-classes
- **KEEP**: All inline SVG-based icons (threads, mentions, bookmarks, etc.) — convert to reusable `.svg-icon` classes
- **KEEP**: All base64 backgrounds (fractal noise textures) on `.sidebar::before`

**CSS class name mapping**: Keep HTML's original class names (`.sidebar`, `.main`, `.messages`, etc.) since they're already scoped well. No need for `slack-` prefix since this app owns these styles.

### 2. `src/apps/slack/components/SlackAppComponent.tsx` — REWRITE

Strip to minimal layout:
```
+------------------------+
|  SlackMenuBar          |
+------------------------+
| WindowFrame wrapper    |
|  .app                  |
|  +----------+--------+ |
|  | Sidebar  |  Main   | |
|  |  (280px) | (flex:1)| |
|  +----------+--------+ |
|                        |
| SlackDialogs           |
+------------------------+
```

**Changes:**
- Remove all Framer Motion imports and `<AnimatePresence>` blocks (no animated overlays)
- Remove thread panel, details panel imports and rendering
- Remove responsive layout hook (`useSlackFrameLayout`)
- Remove font size state and controls
- Remove `cn()` usage (all layouts are static)
- Remove `data-os-theme` attribute and theme class names
- Remove `showDetails`, `showSidebar`, thread, font logic
- Remove reader notes logic
- Layout: just `menuBar` + `WindowFrame` containing `.app > Sidebar + Main`
- Pass `material="brushedmetal"` to WindowFrame when `isMacTheme` (preserve existing)
- Keep: SlackMenuBar, SlackDialogs, onClose, isForeground, skipInitialSound

### 3. `src/apps/slack/components/SlackSidebar.tsx` — REWRITE

Match the HTML's sidebar DOM exactly. The HTML structure:

```
aside.sidebar
  div.ws-head                          ← workspace header
    div.ws-icon > img                  ← workspace icon (32×32, border-radius:6px)
    div.ws-meta
      div.ws-name > text + SVG caret   ← "Studio Workspace ▼"
      div.ws-status > span.ws-dot + "Active"
  nav.nav                              ← navigation items
    div.nav-item > SVG + span          ← "Threads"
    div.nav-item > SVG + span          ← "Mentions"
    div.nav-item > SVG + span          ← "Bookmarks"
    div.nav-item > SVG + span          ← "Drafts"
    div.nav-item > SVG + span          ← "More"
  div.section                          ← Channels section
    div.section-head
      div.section-title                ← "Channels"
      div.plus                         ← "+"
    div.list
      div.channel > span.hash + text   ← "# announcements"
      div.channel > span.hash + text   ← "# general"
      div.channel.active > ...         ← "# design-lab" (active)
      div.channel > span.hash + text   ← "# feedback"
      div.channel > span.hash + text   ← "# random"
  div.section                          ← Direct Messages section
    div.section-head
      div.section-title                ← "Direct Messages"
      div.plus                         ← "+"
    div.dm-list
      div.dm
        div.dm-avatar > img + div.presence
        div.dm-name                    ← "Jordan Ellis"
      ... (3 more DMs)
  div.invite > SVG + span              ← "Invite People"
```

**Implementation:**
- No Phosphor Icons — use the HTML's inline SVG markup directly in JSX
- Workspace icon: render `<img>` with imported PNG from assets
- DM avatars: render `<img>` with imported PNGs, use `div.presence` for presence dots
- All nav items and channels are static (no `onClick` handlers in v1)
- Active channel (`#design-lab`) uses class `active`

### 4. `src/apps/slack/components/SlackChannelHeader.tsx` — REWRITE

Match HTML's header DOM:

```
header.main-head
  div
    div.ch-title                         ← "# design-lab"
    div.ch-sub > span.play + text        ← "Ideas, UI explorations..."
  div.head-right
    div.head-stat > SVG + "12"           ← member count pill
    div.info-btn                         ← "i" button
    div.search-wrap                      ← search box
      input[placeholder="Search"]
      SVG search icon
```

**Implementation:**
- Static: no `onToggleDetails`, `onToggleSidebar`, no props needed for v1
- Use HTML's inline SVG markup for the member icon
- Search input is static placeholder (no functionality)

### 5. `src/apps/slack/components/SlackMessages.tsx` — REWRITE

Match HTML's messages container:

```
div.messages
  div.date-sep
    div.date-pill > text + SVG caret     ← "Today, May 18 ▼"
  div.msg                                ← Alex's message
    div.avatar > img
    div.msg-body
      div.msg-head > div.msg-name + div.msg-time
      div.msg-text
      div.file                           ← file attachment card
        div.file-ic > img
        div.file-meta > div.file-name + div.file-size
        div.file-btn > SVG download icon
      div.reactions
        div.react                        ← "👍 3"
        div.react                        ← "❤️ 2"
        div.react.add                    ← "☺"
  div.msg                                ← Jamie's message (simple text)
    ...
  div.msg                                ← Riley's message (avatar only, no text)
    ...
  div.bubble-wrap                        ← threaded reply to Riley
    div.bubble                           ← "Agreed! One thought..."
  div.msg                                ← Samira's message
    ...
```

**Implementation:**
- Hardcode all messages from the HTML directly in JSX (no data mapping)
- Each message is a static JSX block (no `map()` over data)
- Avatars: use imported PNG images
- File attachment: embed the file card HTML directly
- Reactions: static spans (no click handlers)
- Thread bubble: render the bubble-wrap/bubble HTML directly
- Skip the channel intro section (not in HTML)

### 6. `src/apps/slack/components/SlackMessage.tsx` — SIMPLIFY

Since v1 hardcodes all messages in `SlackMessages.tsx`, this component can either:
- Be removed entirely (if messages are all inline in SlackMessages)
- Or kept as a minimal wrapper that renders `children` with the `.msg` class

**Decision**: Remove this component entirely; render message markup directly in `SlackMessages.tsx` for maximum fidelity to HTML structure.

### 7. `src/apps/slack/components/SlackComposer.tsx` — REWRITE

Match HTML's composer:

```
div.composer
  div.input
    div.input-field                           ← "Message #design-lab" (placeholder text)
    div.input-bar
      div.tool-group                          ← formatting buttons
        button > b                            ← B (bold)
        button > i                            ← I (italic)
        button > u                            ← U (underline)
        button > s                            ← S (strikethrough)
      div.tool-ic > SVG                       ← link icon
      div.tool-ic > SVG                       ← list icon
      div.tool-ic > SVG                       ← chart icon
      div.tool-ic > SVG                       ← text format icon
      div.tool-ic > SVG                       ← @ mention icon
      div.tool-ic > SVG                       ← emoji icon
      div.tool-ic > SVG                       ← action icon
      div.spacer
      div.send                                ← Send button
        div.send-main                         ← "Send"
        div.send-drop > SVG caret
```

**Implementation:**
- Fully static — no form submit, no textarea, no state
- `.input-field` is a read-only static text div
- All toolbar buttons are presentational (no click handlers)
- Send button is presentational
- Use HTML's inline SVG markup for toolbar icons

### 8. `src/apps/slack/data/caseStudies.ts` — REWRITE

Replace with single-channel data matching the HTML:

```ts
import type { SlackChannel, SlackMember } from "../types";

const designLabMembers: SlackMember[] = [
  // Define members matching the HTML: Alex Turner, Jamie Lin, Riley Morgan, Samira Patel
  // Plus DMs: Jordan Ellis, Taylor Kim, Casey Park, Morgan Liu
];

export const caseStudies: SlackChannel[] = [
  {
    id: "design-lab",
    name: "design-lab",
    topic: "Ideas, UI explorations, and design feedback",
    description: "Ideas, UI explorations, and design feedback",
    members: designLabMembers,
    status: "live",
    pinnedSummary: { title: "", tldr: "", metrics: [] },
    messages: [],  // Messages are hardcoded in component JSX, not data-driven
  },
];
```

Messages are hardcoded in JSX (not stored here) since v1 is a single static view.

### 9. `src/stores/useSlackStore.ts` — SIMPLIFY

Strip to minimal:

```ts
import { create } from "zustand";

interface SlackStoreState {
  activeChannelId: string;
}

export const useSlackStore = create<SlackStoreState>()(() => ({
  activeChannelId: "design-lab",
}));
```

Remove: `persist` middleware, all actions, all reaction/poll/note/thread state.

### 10. `src/apps/slack/components/SlackMenuBar.tsx` — SIMPLIFY

Remove menu items that no longer apply:
- Remove: "Toggle Sidebar", "Toggle Details", "Close Thread" (no sidebar toggle, details, or thread in v1)
- Remove: Font size submenu (no font controls in v1)
- Remove: Channel switcher (single channel in v1)
- Keep: File menu (Close), Edit menu (basic), Help menu

### 11. `src/apps/slack/metadata.ts` — UPDATE

Update help items to reflect static v1:
```ts
export const helpItems = [
  {
    icon: "#",
    title: "Browse the Workspace",
    description: "Explore the design-lab channel to see the case study discussion.",
  },
  {
    icon: "💬",
    title: "Read Messages",
    description: "Follow the product and design discussion with file attachments and reactions.",
  },
];
```

### 12. `src/apps/slack/assets/` — CREATE IMAGES

Extract the 7 base64 PNG data URIs from the HTML file into `.png` files:

| Filename | Source | Usage |
|----------|--------|-------|
| `workspace-icon.png` | `.ws-icon img` src | Sidebar workspace icon |
| `avatar-alex.png` | First `.msg .avatar img` src | Alex Turner's avatar |
| `avatar-jamie.png` | Second `.msg .avatar img` src | Jamie Lin's avatar |
| `avatar-riley.png` | Third `.msg .avatar img` src | Riley Morgan's avatar |
| `avatar-samira.png` | Fourth `.msg .avatar img` src | Samira Patel's avatar |
| `dm-avatar-1.png` through `dm-avatar-4.png` | `.dm-avatar img` src | DM user avatars |
| `file-icon.png` | `.file-ic img` src | File attachment icon |

**Note**: All DM-user HT avatar images appear identical in the HTML (same base64 data). Extract once and reuse.

## Import Changes in SlackAppComponent.tsx

```diff
- import { SlackThreadPanel } from "./SlackThreadPanel";
- import { SlackDetailsPanel } from "./SlackDetailsPanel";
- import { useSlackFrameLayout } from "../hooks/useSlackFrameLayout";
- import { AnimatePresence, motion } from "framer-motion";
```

## Verification Steps

1. `bun run build` — must pass without errors
2. Launch the app — sidebar renders with workspace header, nav, channels, DMs
3. Main area shows channel header with search box
4. Messages render with avatars, file card, reactions, thread bubble
5. Composer renders with formatting toolbar and Send button
6. Menu bar and Help/About dialogs still work
7. WindowFrame chrome (titlebar, traffic lights, resize) unchanged
