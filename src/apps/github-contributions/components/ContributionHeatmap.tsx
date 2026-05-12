import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ContributionCalendar,
} from "../hooks/useGitHubContributionsLogic";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface ContributionHeatmapProps {
  calendar: ContributionCalendar;
  currentStreak: number;
  longestStreak: number;
  maxInDay: number;
  isDark: boolean;
}

const DUO_GREEN = "#58CC02";

const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  calendar,
  currentStreak,
  isDark,
}) => {
  const chartData = useMemo(() => {
    if (!calendar) return [];
    return calendar.weeks
      .flatMap((w) => w.contributionDays)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-3)
      .map((d) => ({
        day: DAY_ABBR[new Date(d.date + "T12:00:00").getDay()],
        contributions: d.contributionCount,
      }));
  }, [calendar]);

  const hasContributions = chartData.length > 0 && chartData.some((d) => d.contributions > 0);

  const chartConfig = {
    contributions: {
      label: "Contributions",
      color: DUO_GREEN,
    },
  } satisfies ChartConfig;

  const dividerColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const titleColor = isDark ? "#e0e0e0" : "#3C3C3C";
  const textDim = isDark ? "oklch(0.55 0.04 145)" : "oklch(0.55 0.04 145)";
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "oklch(0.55 0.04 145)" : "oklch(0.50 0.04 145)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        width: "100%",
        maxWidth: "460px",
        height: "130px",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
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
        {/* background flame icon */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-58%)",
            opacity: 0.18,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="64"
            height="64"
            fill={DUO_GREEN}
            style={{ filter: "drop-shadow(0 2px 8px oklch(0.65 0.22 130))" }}
          >
            <path d="M12 2C12 2 8 6 8 10C8 13.3 10 15 10 15C9.5 13 10.5 11.5 12 11C12 14 10 16 10 18C10 20.2 11 21.5 12 22C13 21.5 14 20.2 14 18C14 16 12 14 12 11C13.5 11.5 14.5 13 14 15C14 15 16 13.3 16 10C16 6 12 2 12 2Z" />
          </svg>
        </div>
        {/* foreground flame icon */}
        <div
          style={{
            position: "relative",
            zIndex: 0,
            marginBottom: 2,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill={DUO_GREEN}
            style={{ filter: "drop-shadow(0 2px 6px oklch(0.65 0.22 130))", display: "block" }}
          >
            <path d="M12 2C12 2 8 6 8 10C8 13.3 10 15 10 15C9.5 13 10.5 11.5 12 11C12 14 10 16 10 18C10 20.2 11 21.5 12 22C13 21.5 14 20.2 14 18C14 16 12 14 12 11C13.5 11.5 14.5 13 14 15C14 15 16 13.3 16 10C16 6 12 2 12 2Z" />
          </svg>
        </div>
        {/* streak number */}
        <span
          style={{
            fontFamily: "'Nunito', var(--os-font-ui), sans-serif",
            fontSize: 52,
            fontWeight: 900,
            color: DUO_GREEN,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            position: "relative",
            zIndex: 1,
          }}
        >
          {currentStreak}
        </span>
        {/* Day streak label */}
        <span
          style={{
            fontFamily: "var(--os-font-ui)",
            fontSize: 10,
            fontWeight: 600,
            color: textDim,
            letterSpacing: "0.04em",
            marginTop: 2,
          }}
        >
          Day streak
        </span>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          height: "70%",
          alignSelf: "center",
          backgroundColor: dividerColor,
          flexShrink: 0,
        }}
      />

      {/* Right panel — line chart */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 18px",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "'Nunito', var(--os-font-ui), sans-serif",
            fontSize: 13,
            fontWeight: 800,
            color: titleColor,
            letterSpacing: "0.01em",
          }}
        >
          Contributions
        </span>
        {hasContributions ? (
          <ChartContainer config={chartConfig} className="h-[70px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 15, left: 15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={gridStroke}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  interval={0}
                  tick={{
                    fontSize: 10,
                    fontFamily: "var(--os-font-ui)",
                    fill: tickColor,
                  }}
                />
                <YAxis hide domain={[0, "auto"]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  type="linear"
                  dataKey="contributions"
                  stroke={DUO_GREEN}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: DUO_GREEN,
                    strokeWidth: 0,
                  }}
                  activeDot={{ r: 5, fill: DUO_GREEN, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--os-font-ui)",
                fontSize: 10,
                fontWeight: 600,
                color: textDim,
                letterSpacing: "0.04em",
              }}
            >
              No contribution in the last 3 days.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
