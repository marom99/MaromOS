# Implementation Plan: Duolingo-style GitHub Contributions

## Objective
Update the GitHub Contributions app UI to match the provided Duolingo style reference, incorporating a multi-color scale, rounded cells, and styled statistics with icons.

## Key Files & Context
- `src/apps/github-contributions/components/ContributionHeatmap.tsx`: Main file to update the heatmap colors, cell styling, and stats footer.
- `src/apps/github-contributions/components/GitHubContributionsAppComponent.tsx`: Minor adjustments if needed for container padding/background.

## Implementation Steps

### 1. Update Color Palette
Modify the `DARK` and `LIGHT` color scales in `ContributionHeatmap.tsx` to use the Duolingo multi-color scale (yellow -> orange -> red -> dark red).
- **Light Mode Cells**:
  - `NONE`: `#EBEDF0`
  - `FIRST_QUARTILE`: `#FFD900` (Yellow)
  - `SECOND_QUARTILE`: `#FF9600` (Orange)
  - `THIRD_QUARTILE`: `#FF4B4B` (Red)
  - `FOURTH_QUARTILE`: `#D31515` (Dark Red)
- **Dark Mode Cells**: Adjust the above colors slightly for dark mode contrast, keeping the same hue progression.

### 2. Cell Styling
- Increase the `borderRadius` of the `DayCell` to `3px` or `4px` (depending on `cellSize`) to match the rounded look in the reference.
- Maintain the hover brightness effect.

### 3. Redesign Statistics Footer
- **Icons**: Add a "Fire" icon (SVG) next to the "Current streak" and "Longest streak" values to mimic Duolingo's streak UI.
- **Typography**: Make the statistical values larger and bolder, contrasting with smaller, lighter labels.
- **Layout**: Rearrange the stats into a more prominent display, possibly adjusting the flex layout to give them more breathing room, matching the visual hierarchy of the reference.

### 4. Tooltip Refinement
- Update the `TooltipContent` to have rounded corners and bold text for the contribution count, matching the playful aesthetic of Duolingo.

## Verification & Testing
- Open the GitHub app in both Light and Dark modes.
- Verify the cell colors match the new multi-color scale.
- Check that the streak statistics display the fire icon correctly.
- Ensure responsive layout behaves correctly when the window is resized.