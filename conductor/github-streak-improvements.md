# GitHub Contribution Square Improvements

## Objective
Apply UI/UX polish to the `GitHubStreakGrid` component's contribution squares based on established design engineering principles, making the grid feel more tactile and refined.

## Key Files & Context
- `src/apps/about-me/components/AboutMeAppComponent.tsx`

## Implementation Steps

1. **Add Border Radius:**
   - Update `.about-profile__streak-cell` to include `border-radius: 2px;` to match the modern styling of GitHub's own contribution squares.

2. **Refine Hover State:**
   - Update `.about-profile__streak-cell:not(.about-profile__streak-cell--empty):hover` and `:focus-visible`.
   - Remove the harsh solid border `box-shadow: 0 0 0 1px #333333`.
   - Replace it with a soft, layered drop-shadow: `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05), inset 0 0 0 0.5px rgba(0, 0, 0, 0.1);`.
   - Retain the `transform: translateY(-1px);` for the subtle lift effect.

3. **Add Active/Press State:**
   - Add a new rule for `.about-profile__streak-cell:not(.about-profile__streak-cell--empty):active`.
   - Apply `transform: scale(0.96);` to provide subtle tactile feedback when a user clicks on a contribution cell.
   - Set a faster `transition-duration: 40ms;` on the active state so the press feels immediate and responsive.

## Verification & Testing
- Open the "About Me" app in the simulated environment.
- Verify that the contribution squares display with slightly rounded corners.
- Hover over the squares to confirm that the new soft shadow appears smoothly and the cell lifts slightly without looking jarring.
- Click and hold on a cell to ensure the scale-down effect provides the expected "squish" tactile feedback.
