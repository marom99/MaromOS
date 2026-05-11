import { useMemo } from "react";
import { useGitHubContributionsLogic } from "@/apps/github-contributions/hooks/useGitHubContributionsLogic";

const BG = "oklch(0.16 0.05 145)";
const DIVIDER = "oklch(0.28 0.05 145)";
const TEXT_DIM = "rgba(255,255,255,0.45)";
const TEXT_BRIGHT = "rgba(255,255,255,0.95)";
const SPARK_STROKE = "oklch(0.75 0.24 145)";
const SPARK_FILL_TOP = "oklch(0.55 0.18 145 / 0.35)";
const SPARK_FILL_BTM = "oklch(0.55 0.18 145 / 0)";

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SMOOTH: React.CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

function Sparkline({ points }: { points: { count: number; label: string }[] }) {
  const W = 148;
  const H = 40;
  const PAD_X = 4;
  const PAD_Y = 5;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const maxVal = Math.max(1, ...points.map((p) => p.count));
  const gradId = "sg";

  const coords = points.map((p, i) => {
    const x = PAD_X + (i / (points.length - 1)) * innerW;
    const y = PAD_Y + innerH - (p.count / maxVal) * innerH;
    return { x, y, label: p.label };
  });

  const baseline = PAD_Y + innerH;
  const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPath = [
    `M ${coords[0].x},${baseline}`,
    ...coords.map((c) => `L ${c.x},${c.y}`),
    `L ${coords[coords.length - 1].x},${baseline}`,
    "Z",
  ].join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SPARK_FILL_TOP} />
            <stop offset="100%" stopColor={SPARK_FILL_BTM} />
          </linearGradient>
        </defs>
        {/* gradient fill under curve */}
        <path d={areaPath} fill={`url(#${gradId})`} />
        {/* baseline */}
        <line
          x1={PAD_X}
          y1={baseline}
          x2={PAD_X + innerW}
          y2={baseline}
          stroke={DIVIDER}
          strokeWidth={0.75}
        />
        {/* sparkline */}
        <polyline
          points={polyline}
          fill="none"
          stroke={SPARK_STROKE}
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* endpoint dots */}
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={2.5}
            fill={SPARK_STROKE}
            style={{ filter: "drop-shadow(0 0 3px oklch(0.75 0.28 145))" }}
          />
        ))}
      </svg>
      {/* day labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {coords.map((c, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--os-font-ui)",
              fontSize: 9,
              color: TEXT_DIM,
              letterSpacing: "0.03em",
              ...SMOOTH,
            }}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GitStreakWidget() {
  const { calendar, isLoading, currentStreak } = useGitHubContributionsLogic();

  const last3 = useMemo(() => {
    if (!calendar) return null;
    const days = calendar.weeks
      .flatMap((w) => w.contributionDays)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-3);
    return days.map((d) => ({
      count: d.contributionCount,
      label: DAY_ABBR[new Date(d.date + "T12:00:00").getDay()],
    }));
  }, [calendar]);

  const sparkPoints = last3 ?? [
    { count: 0, label: "" },
    { count: 0, label: "" },
    { count: 0, label: "" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        borderRadius: "var(--os-metrics-radius, 0.5rem)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left panel — streak */}
      <div
        style={{
          width: "42%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingBottom: 2,
        }}
      >
        {/* flame — large, bottom-anchored, partially behind number */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-58%)",
            fontSize: 58,
            opacity: 0.6,
            lineHeight: 1,
            pointerEvents: "none",
            filter:
              "drop-shadow(0 2px 10px oklch(0.65 0.30 70)) drop-shadow(0 0 20px oklch(0.55 0.25 80))",
          }}
        >
          🔥
        </div>
        {/* streak number */}
        <span
          style={{
            fontFamily: "var(--os-font-ui)",
            fontSize: 54,
            fontWeight: 700,
            color: TEXT_BRIGHT,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            position: "relative",
            zIndex: 1,
            ...SMOOTH,
          }}
        >
          {isLoading ? "—" : currentStreak}
        </span>
        {/* DAYS label */}
        <span
          style={{
            fontFamily: "var(--os-font-ui)",
            fontSize: 9,
            fontWeight: 700,
            color: TEXT_DIM,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 3,
            position: "relative",
            zIndex: 1,
            ...SMOOTH,
          }}
        >
          days
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          background: `linear-gradient(to bottom, transparent, ${DIVIDER} 20%, ${DIVIDER} 80%, transparent)`,
          margin: "0 1px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />

      {/* Right panel — sparkline */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 12,
          paddingRight: 12,
          gap: 5,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--os-font-ui)",
            fontSize: 11,
            fontWeight: 600,
            color: TEXT_BRIGHT,
            letterSpacing: "0.01em",
            textWrap: "balance",
            ...SMOOTH,
          }}
        >
          Contributions
        </span>
        <Sparkline points={sparkPoints} />
      </div>
    </div>
  );
}
