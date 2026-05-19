## 2026-05-19 - Layout Thrashing in Marquee Selection

**Learning:** Calling `getBoundingClientRect()` on every item during a `mousemove` event (like marquee selection) forces the browser to recalculate the layout on every frame. This $O(N)$ operation per frame leads to significant "jank" and dropped frames as the number of items increases.

**Action:** Cache DOM dimensions (using `getBoundingClientRect`) in a `useRef` at the start of the interaction (e.g., on `mousedown`). Pass these cached bounds to the selection logic to perform coordinate comparisons in $O(1)$ per item without triggering layout recalculations. Ensure the cache is cleared on `mouseup` to prevent stale data.
