## 2025-05-14 - [Layout Thrashing in Marquee Selection]
**Learning:** High-frequency event handlers (like `mousemove` during marquee selection) that call `getBoundingClientRect()` trigger synchronous layout thrashing. This is especially impactful in components like `Desktop` or `FileList` where $N$ items are checked repeatedly.

**Action:** Cache DOM dimensions at the start of the interaction (e.g., in `mousedown`) and store them in a `useRef`. Use these cached values for calculations during the interaction to avoid repeated DOM reads.
