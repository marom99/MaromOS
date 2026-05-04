# Slack Pixel-Perfect Redesign Requirements

Date: 2026-05-04

## Summary

Replace the Slack app's internal visual design with a pixel-perfect recreation based on `Recreating-your-messaging-app.html` — an Aqua-themed Slack workspace with detailed gradients, shadows, textures, and exact hex colors. RyOS `WindowFrame` continues to provide window chrome. The redesign is delivered as a static view first; interactive features (reactions, thread panel, polls, etc.) are re-added in subsequent iterations.

## Intended Experience

- Visually identical to the HTML file inside ryOS's `WindowFrame`
- Hardcoded exact colors/gradients/shadows — no `--os-*` theme variable mapping
- A single channel view (#design-lab) with the exact messages, avatars, file attachment, reactions, threaded reply bubble, and composer shown in the HTML
- Workspace sidebar with the HTML's exact channels and DM list

## Scope

**This iteration (v1):**

- **Rewrite `slack-aqua.css`** — port the HTML's CSS into the existing stylesheet. Omit body-level styles (desktop background) and `.titlebar`/traffic light styles (handled by WindowFrame)
- **Simplify React components** to match the HTML's DOM structure and class names: `SlackSidebar`, `SlackChannelHeader`, `SlackMessages`, `SlackMessage`, `SlackComposer`
- **Hardcode HTML data** — replace `caseStudies.ts` content with the HTML's exact workspace name, channels, members, and messages
- **Extract images** — export base64 PNG data URIs to local `.png` files in `src/apps/slack/assets/`
- **Keep** — `WindowFrame` integration, `SlackMenuBar`, `SlackDialogs` (Help/About), app registry wiring, Zustand store (simplified for static state)

**Future iterations:**

- Re-add channel switching (enable sidebar clicks to switch channels)
- Re-add reaction toggling
- Re-add thread panel
- Re-add details panel
- Re-add reader notes
- Re-add font size controls
- Re-add responsive breakpoints

## Non-Goals

- Do not map visual styles to `--os-*` CSS theme variables
- Do not preserve polls, GIFs, or interactive features in v1
- Do not change `WindowFrame` chrome (titlebar, traffic lights, resize handles)
- Do not add new dependencies

## Success Criteria

- Slack app launches and displays the pixel-perfect Aqua workspace inside ryOS's window
- Sidebar shows workspace header, nav items, channels, DMs, and invite matching the HTML
- Main area shows channel header, date separator, 4 messages with avatars, file attachment, reactions, threaded reply bubble, and composer matching the HTML
- Menu bar and Help/About dialogs still work
- Build passes (`bun run build`)
