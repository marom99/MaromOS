## 2025-05-15 - Layout Thrashing in Marquee Selection
**Learning:** Repetitive calls to `getBoundingClientRect()` and `querySelectorAll()` inside high-frequency events like `mousemove` cause layout thrashing and significant UI jank. Caching DOM dimensions at the start of an interaction (e.g., `mousedown`) and reusing them during the interaction improves performance from O(N) layout triggers per move to O(1).
**Action:** Always cache DOM measurements in a `useRef` before starting high-frequency interactions like dragging, resizing, or marquee selection.
