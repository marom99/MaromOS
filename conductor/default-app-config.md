# Implementation Plan: Default App Configuration

## Objective
Set the initial desktop state for first-time visitors in Marom OS to open the "Slack" and "About Me" applications automatically. The windows should be positioned such that "About Me" is on the left (hugging its content size) and "Slack" is on the right (occupying 70% of the screen width). On smaller screens, they will overlap with Slack brought to the front. They should be standard OS windows.

## Key Files & Context
- The window manager / desktop initialization logic (likely in a `Desktop` or `WindowManager` component, e.g. `src/components/Desktop.tsx` or a related context/store).
- App definitions or configuration files that define default window sizes and positions.

## Implementation Steps
1. **Locate Initialization Logic:** Find where the default windows are defined or launched on the first visit.
2. **Update Default Windows:** 
   - Add the "About Me" app to open by default if it isn't already. Configure its starting position to the left side and its width/height to auto-fit or hug its content.
   - Add the "Slack" app to open by default. Configure its starting position to be on the right side and its width to be `70%` of the viewport width.
3. **Handle Overlap / Mobile:**
   - Ensure the initialization order or z-index explicitly focuses "Slack" so it appears in front if the screen is narrow enough to cause overlap.
4. **Persistence Check:**
   - Verify that the mechanism to ensure this only happens on the first visit is intact (likely relying on the existing localStorage or indexedDB window state persistence).

## Verification & Testing
1. Clear local storage/state to simulate a first-time visitor.
2. Load the OS and verify "About Me" and "Slack" open.
3. Check the layout on a desktop viewport: "About Me" left (hugging content), "Slack" right (70% width).
4. Check the layout on a mobile viewport: Verify "Slack" overlaps "About Me" and is brought to the front.
5. Reload the page (without clearing state) and ensure the apps remain where the user left them (or stay open/closed as per standard behavior), confirming the default spawn only happens once.
