import React from "react";
import {
  ContributionCalendar,
  ContributionDay,
} from "../hooks/useGitHubContributionsLogic";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContributionHeatmapProps {
  calendar: ContributionCalendar;
  currentStreak: number;
  longestStreak: number;
  maxInDay: number;
  isDark: boolean;
}

const DARK = {
  text: "oklch(0.72 0.12 145)",
  labelMonth: "oklch(0.60 0.10 145)",
  labelDay: "oklch(0.55 0.09 145)",
  divider: "oklch(0.32 0.05 145)",
  statsLabel: "oklch(0.58 0.09 145)",
  statsValue: "oklch(0.78 0.18 145)",
  cells: {
    NONE: "oklch(0.24 0.028 145)",
    FIRST_QUARTILE: "oklch(0.40 0.105 145)",
    SECOND_QUARTILE: "oklch(0.54 0.158 145)",
    THIRD_QUARTILE: "oklch(0.66 0.185 145)",
    FOURTH_QUARTILE: "oklch(0.80 0.195 145)",
  },
} as const;

const LIGHT = {
  text: "oklch(0.25 0.04 145)",
  labelMonth: "oklch(0.50 0.06 145)",
  labelDay: "oklch(0.55 0.06 145)",
  divider: "oklch(0.85 0.03 145)",
  statsLabel: "oklch(0.50 0.06 145)",
  statsValue: "oklch(0.25 0.08 145)",
  cells: {
    NONE: "oklch(0.91 0.03 145)",
    FIRST_QUARTILE: "oklch(0.75 0.10 145)",
    SECOND_QUARTILE: "oklch(0.60 0.14 145)",
    THIRD_QUARTILE: "oklch(0.47 0.15 145)",
    FOURTH_QUARTILE: "oklch(0.33 0.14 145)",
  },
} as const;

const CELL = 11;
const GAP = 2;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  calendar,
  currentStreak,
  longestStreak,
  maxInDay,
  isDark,
}) => {
  const p = isDark ? DARK : LIGHT;

  return (
    <div
      className="flex flex-col select-none antialiased"
      style={{
        fontFamily: "var(--os-font-mono)",
        fontSize: "10px",
        color: p.text,
        lineHeight: 1.4,
        transition: "color 0.2s ease",
      }}
    >
      {/* Month labels */}
      <div
        className="flex"
        style={{ paddingLeft: `${CELL + GAP + 32}px`, marginBottom: "4px" }}
      >
        {calendar.months.map((month, i) => (
          <div
            key={`${month.name}-${month.year}-${i}`}
            style={{
              width: `${month.totalWeeks * (CELL + GAP)}px`,
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
              color: p.labelMonth,
              fontSize: "9px",
              letterSpacing: "0.02em",
              transition: "color 0.2s ease",
            }}
          >
            {month.name}
          </div>
        ))}
      </div>

      {/* Grid + day labels */}
      <div className="flex" style={{ gap: `${GAP}px` }}>
        {/* Day labels column */}
        <div
          className="flex flex-col"
          style={{
            gap: `${GAP}px`,
            paddingTop: "1px",
            width: "30px",
            flexShrink: 0,
          }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: `${CELL}px`,
                lineHeight: `${CELL}px`,
                fontSize: "9px",
                color: i % 2 === 0 ? p.labelDay : "transparent",
                textAlign: "right",
                paddingRight: "4px",
                letterSpacing: "0.01em",
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: `repeat(7, ${CELL}px)`,
              gap: `${GAP}px`,
            }}
          >
            {calendar.weeks.map((week) => (
              <React.Fragment key={week.firstDay}>
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const day = week.contributionDays.find(
                    (d) => d.weekday === dayIdx
                  );
                  if (!day)
                    return (
                      <div
                        key={dayIdx}
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  return <DayCell key={day.date} day={day} cellColors={p.cells} />;
                })}
              </React.Fragment>
            ))}
          </div>
        </TooltipProvider>
      </div>

      {/* Stats footer */}
      <div
        style={{
          marginTop: "10px",
          borderTop: `1px solid ${p.divider}`,
          paddingTop: "6px",
          display: "flex",
          flexWrap: "wrap",
          gap: "3px 20px",
          fontSize: "9px",
          letterSpacing: "0.02em",
          transition: "border-color 0.2s ease",
        }}
      >
        {[
          { label: "Contributions", value: calendar.totalContributions.toLocaleString() },
          { label: "Longest streak", value: `${longestStreak}d` },
          { label: "Current streak", value: `${currentStreak}d` },
          { label: "Peak / day", value: String(maxInDay) },
        ].map(({ label, value }) => (
          <span key={label} style={{ color: p.statsLabel, transition: "color 0.2s ease" }}>
            {label}:{" "}
            <span style={{ color: p.statsValue, fontVariantNumeric: "tabular-nums", transition: "color 0.2s ease" }}>
              {value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

type CellColors = typeof DARK.cells;

const DayCell: React.FC<{ day: ContributionDay; cellColors: CellColors }> = ({ day, cellColors }) => {
  const dateStr = new Date(day.date + "T12:00:00").toLocaleDateString(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{
            width: CELL,
            height: CELL,
            backgroundColor: cellColors[day.contributionLevel],
            borderRadius: "2px",
            cursor: "default",
            transition: "filter 0.1s ease-out, background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)";
          }}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="px-2 py-1"
        style={{ fontSize: "10px", fontFamily: "var(--os-font-mono)" }}
      >
        <strong>{day.contributionCount}</strong> contributions · {dateStr}
      </TooltipContent>
    </Tooltip>
  );
};
