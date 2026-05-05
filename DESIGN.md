---
name: ryOS
description: A nostalgic, multi-theme browser-based desktop OS — System 7, macOS Aqua, Windows 98, Windows XP
colors:
  aqua-window-bg: "#ececec"
  aqua-menubar-bg: "#f8f8f8"
  aqua-menubar-text: "#000000"
  aqua-titlebar-active-bg: "#e8e8e8"
  aqua-titlebar-text: "#000000"
  aqua-titlebar-text-inactive: "#7f7f7f"
  aqua-button-face: "#ffffff"
  aqua-button-active-face: "#e0e0e0"
  aqua-selection-bg: "#2765ca"
  aqua-selection-text: "#ffffff"
  aqua-selection-glow: "#3067da"
  aqua-text-primary: "#000000"
  aqua-text-secondary: "#4b4b4b"
  aqua-text-disabled: "#999999"
  aqua-input-bg: "#ffffff"
  aqua-input-border: "rgba(0,0,0,0.2)"
  aqua-input-focus-border: "#346ae3"
  aqua-input-focus-ring: "rgba(52,106,227,0.25)"
  aqua-separator: "rgba(0,0,0,0.2)"
  aqua-panel-bg: "#ececec"
  aqua-switch-track-checked: "#111827"
  aqua-close: "#ff6057"
  aqua-minimize: "#ffbd2e"
  aqua-maximize: "#27c93f"
  win98-window-bg: "#c0c0c0"
  win98-titlebar-active-bg-left: "#000084"
  win98-titlebar-active-bg-right: "#1084d0"
  win98-titlebar-text: "#ffffff"
  win98-button-face: "#c0c0c0"
  win98-button-highlight: "#ffffff"
  win98-button-shadow: "#808080"
  win98-selection-bg: "#000080"
  win98-text-primary: "#000000"
  xp-window-bg: "#ece9d8"
  xp-titlebar-active-bg-top: "#0058e6"
  xp-titlebar-active-bg-bottom: "#1941a5"
  xp-window-border: "#0054e3"
  xp-titlebar-text: "#ffffff"
  xp-button-face: "#ece9d8"
  xp-button-highlight: "#ffffff"
  xp-button-shadow: "#aca899"
  xp-selection-bg: "#316ac5"
  xp-input-border: "#7f9db9"
  system7-window-bg: "#ffffff"
  system7-window-border: "#000000"
  system7-titlebar-text: "#000000"
  system7-button-face: "#ffffff"
  system7-button-shadow: "#808080"
  system7-button-active-face: "#cccccc"
  system7-selection-bg: "#000000"
  system7-text-primary: "#000000"
  system7-text-secondary: "#666666"
  system7-panel-bg: "#e3e3e3"
typography:
  display:
    fontFamily: '"ChicagoKare", "ArkPixel", "SerenityOS-Emoji", system-ui, -apple-system, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: '"Geneva-12", "ArkPixel", "SerenityOS-Emoji", system-ui, -apple-system, sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: '"Monaco", "ArkPixel", "SerenityOS-Emoji", monospace'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  aqua-ui:
    fontFamily: '"LucidaGrande", "Lucida Grande", "AquaKana", "Hiragino Sans", system-ui, sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  win98-ui:
    fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", "ArkPixel", "SerenityOS-Emoji", sans-serif'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
  xp-ui:
    fontFamily: 'Tahoma, "Pixelated MS Sans Serif", "MS Sans Serif", "ArkPixel", "SerenityOS-Emoji", sans-serif'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  square: "0px"
  aqua: "0.45rem"
  xp: "0.5rem"
  aqua-button: "14px"
  card: "0.75rem"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  card-padding: "24px"
components:
  button-retro:
    backgroundColor: "{colors.system7-button-face}"
    textColor: "{colors.system7-text-primary}"
    rounded: "{rounded.square}"
    padding: "8px 16px"
  button-aqua-primary:
    backgroundColor: "linear-gradient(to bottom, #4a90d9, #2565b8)"
    textColor: "#ffffff"
    rounded: "{rounded.aqua-button}"
    padding: "0 16px"
    height: "28px"
  button-aqua-secondary:
    backgroundColor: "linear-gradient(to bottom, #ffffff, #e8e8e8)"
    textColor: "{colors.aqua-text-primary}"
    rounded: "{rounded.aqua-button}"
    padding: "0 16px"
    height: "28px"
  button-win98:
    backgroundColor: "{colors.win98-button-face}"
    textColor: "{colors.win98-text-primary}"
    rounded: "{rounded.square}"
    padding: "4px 12px"
  input-aqua:
    backgroundColor: "{colors.aqua-input-bg}"
    textColor: "{colors.aqua-text-primary}"
    rounded: "6px"
    padding: "8px 12px"
  input-retro:
    backgroundColor: "{colors.system7-window-bg}"
    textColor: "{colors.system7-text-primary}"
    rounded: "{rounded.square}"
    padding: "4px 8px"
---

# Design System: ryOS

## 1. Overview

**Creative North Star: "The Nostalgic Workbench"**

ryOS is a browser-based desktop operating system that spans four eras of personal computing: System 7, macOS X Aqua, Windows 98, and Windows XP. Each theme is a self-contained visual language — the design system does not unify them, it faithfully reproduces them. The coherence across themes is in behavior and spatial organization, not in look. Every pixel, bevel, gradient, and bitmap font is chosen because the source OS chose it first. Polish means getting the details right, not making them consistent.

The system is **playful, crafted, and nostalgic**. It treats UI chrome as material: buttons depress, titlebars shade, surfaces cast shadows or don't — depending on which computer you sat down at. This is a workbench, not a museum. Every component is interactive and functional.

**Key characteristics:**
- Four period-accurate visual languages, no forced cross-theme unification
- Materially honest components: buttons feel like real objects (glass, beveled plastic, 3D edges)
- Bitmap pixel fonts with no antialiasing in retro themes; smooth anti-aliased text in Aqua
- Monochrome body with OS-specific chromatic accents (Aqua blue selection glow, XP Luna blue chrome, Win98 navy titlebars)
- Accessibility: WCAG AA target, reduced-motion support, keyboard navigation, never color-alone

This system explicitly rejects:
- Generic SaaS flatness or "modern minimalism" applied to retro chrome
- Forced brand color unification across themes
- Glassmorphism / blurs used decoratively
- Gradient text, side-stripe borders, modals as the first answer

## 2. Colors

Color in ryOS is **theme-scoped**, not global. There is no single "brand color." Each OS theme carries its own full palette, faithfully reproduced from the original. The body is monochrome (white, grays, black); chroma lives in specific OS affordances — selection highlights, titlebar gradients, focus rings, traffic lights.

### The macOS X Aqua Palette (primary showcase)

Aqua is the default and most polished theme. Its palette is cool grays with deliberate blue accents.

- **Aqua Window Background** (`#ececec`): The default surface for all content windows. A warm-neutral gray that reads as "computer plastic" under ambient light.
- **Aqua Selection Blue** (`#2765ca`): Used for text selection, list item highlights, and active-state indicators. Matches macOS 10.4 Tiger-era selection color.
- **Aqua Focus Ring Blue** (`#346ae3`): Input focus borders and glow. Brighter and more saturated than selection blue to signal active input.
- **Aqua Traffic Lights**: Close (`#ff6057`), Minimize (`#ffbd2e`), Maximize (`#27c93f`). Only these three fixed chroma values appear in Aqua chrome; everything else is grayscale.
- **Aqua Separator** (`rgba(0,0,0,0.2)`): Thin translucent dividers between sections. Never solid black.
- **Aqua Text**: Primary is pure black (`#000000`), secondary is warm gray (`#4b4b4b`), disabled is light gray (`#999999`).

### The System 7 Palette (Classic Mac)

High-contrast black-and-white with a single gray mid-tone for button shadows and disabled text.

- **System 7 Window Background** (`#ffffff`): Pure white. No gradients, no textures.
- **System 7 Button Shadow** (`#808080`): The only gray in the palette. Used for button bevels, separators, and disabled text.
- **System 7 Selection** (`#000000`): Solid black with white text. Inactive window selection is light gray (`#cfcfcf`).

### The Windows 98 Palette

The classic teal-era desktop. Silver chrome, navy titlebars.

- **Win98 Window Background** (`#c0c0c0`): Silver-gray, the iconic Windows 95/98 desktop chrome color.
- **Win98 Titlebar Gradient**: Navy blue gradient (`#000084` → `#1084d0`). The only saturated color in the Win98 theme.
- **Win98 Selection** (`#000080`): Navy blue, darker than the XP selection.
- **Win98 Button**: 3D beveled with white highlight (`#ffffff`) top/left and dark shadow (`#808080`) bottom/right.

### The Windows XP Palette

Luna-era warmth. Cream background, royal blue chrome.

- **XP Window Background** (`#ece9d8`): Warm cream, the Luna desktop hue. Warmer and more saturated than Aqua's cool gray.
- **XP Titlebar Blue** (`#0058e6` → `#1941a5`): Royal blue gradient, more saturated than Win98 navy.
- **XP Selection** (`#316ac5`): Medium blue, lighter and brighter than Win98 selection.
- **XP Window Border** (`#0054e3`): Royal blue, rendered as a thick 3px stroke on active windows.

### The "No Global Color" Rule

Never apply one theme's color to another. Aqua selection blue must not appear in System 7 chrome. Win98 navy must not bleed into XP. Each theme is self-contained. The `--os-color-*` CSS custom properties enforce this by being redefined per theme at `:root` level.

## 3. Typography

ryOS uses **theme-specific bitmap fonts** for retro themes and **system sans-serif** for Aqua. Each theme's font stack is a direct match for the original OS.

**Character:** These are the fonts of computing history — pixel-grid-aligned bitmaps for System 7 and Windows, warm Lucida Grande for Aqua. Font smoothing is disabled in retro themes (`-webkit-font-smoothing: none`) and enabled in Aqua. This is not a bug.

### System 7 (Classic Mac)
- **UI Font:** ChicagoKare → ArkPixel → SerenityOS-Emoji → system-ui
- **Mono Font:** Monaco → ArkPixel → SerenityOS-Emoji → monospace
- **Size:** 12px base. Bitmap fonts are pixel-snapped; never antialiased.

### macOS X Aqua
- **UI Font:** LucidaGrande / Lucida Grande → AquaKana → Hiragino Sans → system-ui
- **Mono Font:** Monaco → Menlo → monospace
- **Size:** 13px base. Antialiased with subpixel rendering hinting.
- **Weight contrast:** Bold (`font-weight: 700`) for headers, regular (`400`) for body. Lucida Grande has a warm, humanist character at 13px.

### Windows 98
- **UI Font:** Pixelated MS Sans Serif → MS Sans Serif → ArkPixel → sans-serif
- **Mono Font:** Monaco → Consolas → Courier New → monospace
- **Size:** 11px base. Bitmap MS Sans Serif at its native pixel grid.

### Windows XP
- **UI Font:** Tahoma → Pixelated MS Sans Serif → MS Sans Serif → sans-serif
- **Mono Font:** Consolas → Courier New → monospace
- **Size:** 11px base. Tahoma is slightly wider and more open than MS Sans Serif.

### Hierarchy (Aqua, as primary showcase)
- **Title:** Lucida Grande, 14px, bold (`700`), line-height 1.3. Window titlebars only.
- **Body:** Lucida Grande, 13px, regular (`400`), line-height 1.4, max 75ch.
- **Label:** Lucida Grande, 11px, regular, letter-spacing 0. Used for secondary metadata, captions, file sizes.
- **Mono:** Monaco, 12px. Terminal output, code blocks, file paths.

### The "Respect the Bitmap Grid" Rule

Retro theme fonts (ChicagoKare, Pixelated MS Sans Serif) must render at their native pixel sizes. Never scale them by non-integer factors. Never apply `letter-spacing`, `transform`, or subpixel positioning. If you need larger text, use a different font.

## 4. Elevation

Elevation in ryOS is **theme-faithful**. Each OS theme defines its own depth model. There is no attempt to unify shadow vocabulary across themes. Consistency lives in the z-index scale, which is shared.

### Z-Index Scale (shared across all themes)

```
base: 1          sticky: 100       dialog: 200
screensaver: 500  fullscreen: 600   expose-backdrop: 700
expose: 701       menubar: 800      menubar-expose: 750
dropdown: 900     submenu: 901      spotlight-backdrop: 950
spotlight: 951
```

This scale is the only cross-theme depth constant. Components at `z-200` (dialogs) always layer above `z-100` (sticky elements) regardless of theme.

### Theme Depth Models

- **System 7:** Flat. No shadows. Depth is conveyed through border thickness (`2px solid black` window borders) and the titlebar zebra stripes (`linear-gradient(#000 50%, transparent 0)` at 2px repeat). The only shadow is `2px 2px 0px 0px rgba(0,0,0,0.5)` on window drop shadow — a hard, sharp offset with no blur.
- **macOS X Aqua:** Layered with soft shadows. Windows cast `0 3px 10px rgba(0,0,0,0.3)`. Input fields have inset bevels. Titlebar has a pinstripe pattern (`repeating-linear-gradient` at 1.5px intervals) that creates texture without shadow. Focus rings glow (`rgba(52,106,227,0.25)`).
- **Windows 98:** 3D beveled. No drop shadows on windows (`--os-window-shadow: none`). Depth is entirely conveyed through 3D borders: buttons have white top/left edges and dark bottom/right edges. Raised, sunken, and flat states are distinguished by border-color direction.
- **Windows XP:** Subtle drop shadows (`0 4px 8px rgba(0,0,0,0.25)`) plus rounded corners (`0.5rem`). The 3D bevel convention from Win98 is softened into color gradients (Luna blue titlebar, cream window chrome). Inputs and buttons use `border-color` shifts rather than bevel nesting.

### The "Source OS First" Rule

When choosing how a component conveys depth, look up what the source OS did. If System 7 had no shadows, the System 7 theme must not have them. If Aqua used a pinstripe texture behind lists, the Aqua theme should too. Never invent depth conventions that the source OS didn't have.

## 5. Components

Components are **materially honest**. Buttons feel like real objects — they depress, glow, or bevel depending on the active OS theme. Every component knows which theme is active and renders accordingly.

### Buttons

Buttons are the most theme-varied component. Five distinct visual models:

- **System 7 (Retro):** Square (`0px` radius), 3D beveled with `2px black border`. Background is white (`#ffffff`), highlight edge is `#ffffff`, shadow edge is `#808080`. Pressed state inverts: background becomes `#cccccc`. Uses a 9-slice `border-image` SVG for the classic Mac bezel.

- **macOS X Aqua (Primary):** Capsule pill (`14px` radius, `28px` height). Blue gradient background (`#4a90d9` → `#2565b8`) with a glass-like `::before` pseudo-element (white shine at top) and `::after` inner glow. Pulses with `aqua-pulse` animation (1.5s infinite, subtle opacity shift). White text. Pressed state darkens the gradient and shifts inner shadows.

- **macOS X Aqua (Secondary):** Same capsule shape. Subtle gray/white gradient with thin `0.5px rgba(0,0,0,0.2)` border. No pulse.

- **Windows 98:** Square. 3D raised bevel: face `#c0c0c0`, highlight `#ffffff` top/left, shadow `#808080` bottom/right, dark outline `#0a0a0a` outermost. Pressed inverts the bevel (sunken). Sharp, hard edges.

- **Windows XP:** Rounded (`0.5rem` radius). Flat gradient face (`#ece9d8` → `#d8d5c8`) with `1px solid` border that shifts on focus. Subtle transition on hover. No 3D bevel.

### Inputs / Fields

- **System 7:** Square (`0px`), `2px solid black` border, white (`#ffffff`) background. Focus outline is black (`2px`). Monospaced font in file path fields.
- **macOS X Aqua:** Rounded (`6px`), `1px solid rgba(0,0,0,0.2)` border, white background. Focus ring is a blue glow (`rgba(52,106,227,0.25)` spread) with border shift to `#346ae3`. Inset shadow for depth.
- **Windows 98:** Square, `1px solid #808080` border, white background. Focus shifts border to darker gray.
- **Windows XP:** Slightly rounded corners, `1px solid #7f9db9` border. Focus shifts to royal blue (`#316ac5`).

### Dialogs / Windows

- **System 7:** Square window with `2px solid black` border, zebra-striped titlebar (2px black/white pattern), centered title text in ChicagoKare, square close box.
- **macOS X Aqua:** Soft-rounded window with `0.5px rgba(0,0,0,0.4)` border, pinstripe background, gradient titlebar with traffic light buttons (red/yellow/green), centered Lucida Grande title with `text-shadow`.
- **Windows 98:** Square window with `2px` dark border, navy gradient titlebar with white text, right-aligned minimize/maximize/close.
- **Windows XP:** Rounded (`0.5rem` radius) window with `3px solid #0054e3` border in active state, Luna blue gradient titlebar, right-aligned control buttons.

### Switches / Toggles

- **Non-macOS themes:** Simple track/thumb toggle. Track color from `--os-color-switch-track` / `--os-color-switch-track-checked`. Thumb is white circle (`14px`).
- **macOS Aqua:** CSS-driven `.os-switch` with 16×28px track, rounded pill shape, inset bevel depth effect. Smooth transition on thumb position.

### Navigation (Menubar / Taskbar)

- **macOS / System 7:** Top menubar with OS-specific height (`25px` Aqua, `30px` System 7), background color, and text style. Aqua menubar has a gradient + pinstripe overlay.
- **Windows 98 / XP:** Bottom taskbar (`30px` height). Win98 is flat silver; XP is Luna blue gradient with Start button.

## 6. Do's and Don'ts

### Do:

- **Do** use `--os-color-*` and `--os-font-ui` tokens. Never hardcode a color or font that should be theme-aware.
- **Do** design macOS Aqua first, then validate across System 7, XP, and Win98. Aqua is the primary showcase theme.
- **Do** respect bitmap font pixel grids. ChicagoKare, Pixelated MS Sans Serif, and Monaco must render at native sizes with `-webkit-font-smoothing: none`.
- **Do** use the shared z-index scale (`--z-dialog: 200`, `--z-menubar: 800`, etc.) for layering across themes.
- **Do** make components materially honest. If a button depresses in the source OS, it should depress here too.
- **Do** target WCAG AA. Ensure 4.5:1 contrast ratios on text, support reduced motion, and provide keyboard access.
- **Do** vary spacing for rhythm within each theme. Don't force uniform padding across System 7 and Aqua.

### Don't:

- **Don't** mix theme colors. Aqua selection blue must never appear in System 7 chrome. Win98 navy must never bleed into XP.
- **Don't** apply antialiasing to retro theme fonts. `-webkit-font-smoothing: none` and `font-smooth: never` are requirements, not options.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any component.
- **Don't** use `background-clip: text` with gradient backgrounds. Text is solid color only.
- **Don't** use glassmorphism, blur effects, or decorative transparency. If the source OS didn't have it, ryOS doesn't either.
- **Don't** default to modals. Use inline editing, panels, and progressive disclosure first. Modals are the last resort.
- **Don't** add shadows to System 7 or Windows 98 chrome. These themes are flat/beveled, not shadowed.
- **Don't** invent new visual conventions. Every design decision should trace back to a source OS behavior.
- **Don't** scale bitmap fonts by non-integer factors. If you need larger text in a retro theme, switch to a non-bitmap font.
