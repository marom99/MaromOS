# Slack App Paper Implementation Plan

## Objective
Recreate the `SlackAppComponent` and its nested components in the currently open Paper file inside a new artboard/frame exactly as they appear in the source code.

## Key Files & Context
- `src/apps/slack/components/SlackAppComponent.tsx`
- `src/apps/slack/components/SlackSidebar.tsx`
- `src/apps/slack/components/SlackChannelHeader.tsx`
- `src/apps/slack/components/SlackMessages.tsx`
- `src/apps/slack/components/SlackComposer.tsx`
- `src/apps/slack/components/slack-aqua.css` (Contains all the visual styles, colors, and layout rules)

## Implementation Steps (Post-Plan Approval)
1.  **Extract the DOM Structure:** 
    - Parse the JSX code for `SlackSidebar`, `SlackChannelHeader`, `SlackMessages`, and `SlackComposer`.
    - Map the CSS classes from `slack-aqua.css` to inline styles for Paper.
2.  **Create Artboard in Paper:**
    - Use `mcp_paper_create_artboard` to create a new frame "Slack App Prototype" (1024x768px).
3.  **Construct and Write HTML:**
    - Build the `WindowFrame` container.
    - Implement the `.sidebar` with the workspace header, navigation items, channels list, and DM list.
    - Implement the `.main` content area with the channel header (`#design-lab`), messages area (with avatars and file attachments), and the message composer.
    - Apply all gradients, borders, and shadows from the CSS using inline `style` attributes.
4.  **Verification:**
    - Use `mcp_paper_get_screenshot` to verify the design matches the original 100%.

## Verification & Testing
- Compare the Paper screenshot with the live app's visual state.
- Ensure all icons and spacing are consistent with the `slack-aqua.css` definitions.