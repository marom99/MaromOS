import { useEffect, useRef, useState } from "react";

const NARROW_THRESHOLD = 640;
const COMPACT_THRESHOLD = 920;

interface UseSlackFrameLayoutResult {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  isFrameNarrow: boolean;
  isFrameCompact: boolean;
}

export function useSlackFrameLayout(): UseSlackFrameLayoutResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFrameNarrow, setIsFrameNarrow] = useState(false);
  const [isFrameCompact, setIsFrameCompact] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = (width: number) => {
      setIsFrameNarrow(width < NARROW_THRESHOLD);
      setIsFrameCompact(width < COMPACT_THRESHOLD);
    };

    update(node.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) update(entry.contentRect.width);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { containerRef, isFrameNarrow, isFrameCompact };
}
