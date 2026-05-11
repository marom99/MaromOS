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
  containerWidth?: number;
}

const COLORS = {
  duoGreen: "#58CC02",
  duoGreenLight: "#78C800",
  duoGreenDark: "#46A302",
  duoGreenActive: "#58A700",
  duoGreenShadow: "#58A700",
  duoGreyBorder: "#E5E5E5",
  duoGreyBg: "#F7F7F7",
  duoTextMain: "#4B4B4B",
  duoTextLight: "#777777",

  level0: "#EBEDF0",
  level1: "#C6E48B",
  level2: "#7BC96F",
  level3: "#239A3B",
  level4: "#196127",
};

const GAP = 6;
const DAY_COL_WIDTH = 30;
const DAY_COL_GAP = 10;
const H_PADDING = 30;

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  calendar,
  currentStreak,
  containerWidth,
}) => {
  const numWeeks = calendar.weeks.length;
  // Calculate cellSize similarly but clamped appropriately
  const available = (containerWidth ?? 900) - H_PADDING * 2 - DAY_COL_WIDTH - DAY_COL_GAP;
  const rawCell = available > 0 ? (available + GAP) / numWeeks - GAP : 16;
  const cellSize = Math.max(10, Math.min(16, Math.floor(rawCell)));
  
  const fontStyle = {
      fontFamily: "'Varela Round', 'Arial Rounded MT Bold', 'Helvetica Rounded', sans-serif"
  };

  return (
    <div
      style={{
        ...fontStyle,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.02)",
        padding: "30px",
        width: "100%",
        maxWidth: "900px",
        position: "relative",
        color: COLORS.duoTextMain,
        margin: "0 auto",
      }}
    >
      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ margin: "0 0 5px 0", fontSize: "28px", fontWeight: 800, color: "#3C3C3C", textWrap: "balance" }}>
                GitHub Streak
            </h1>
            <div style={{ display: "flex", alignItems: "center", fontSize: "16px", color: COLORS.duoTextLight, fontWeight: 600 }}>
                Code every day. Build amazing things.
                <div style={{ display: "flex", alignItems: "center", marginLeft: "10px", paddingLeft: "10px", borderLeft: `2px solid ${COLORS.duoGreyBorder}` }}>
                    <span style={{ color: "#FF9600", fontSize: "20px", marginRight: "5px" }}>🔥</span>
                    <span>Current streak: <span style={{ color: COLORS.duoGreen, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{currentStreak} days</span></span>
                </div>
            </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "25px", width: "100%" }}>
        <div style={{ display: "flex", marginLeft: "45px", marginBottom: "10px", justifyContent: "space-between", paddingRight: "15px", fontWeight: 700, color: COLORS.duoTextLight, fontSize: "14px" }}>
            {calendar.months.map((month, i) => {
              const nextMonth = calendar.months[i + 1];
              const monthStartIdx = calendar.weeks.findIndex((w) => w.firstDay >= month.firstDay);
              const nextMonthStartIdx = nextMonth
                ? calendar.weeks.findIndex((w) => w.firstDay >= nextMonth.firstDay)
                : calendar.weeks.length;

              const actualWeeks = Math.max(
                0,
                (nextMonthStartIdx === -1 ? calendar.weeks.length : nextMonthStartIdx) -
                  (monthStartIdx === -1 ? 0 : monthStartIdx)
              );

              if (actualWeeks === 0 && i > 0) return null;

              return (
                <div
                  key={`${month.name}-${month.year}-${i}`}
                  style={{
                    width: `${actualWeeks * (cellSize + GAP)}px`,
                    minWidth: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {month.name}
                </div>
              );
            })}
        </div>
        
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "10px", color: COLORS.duoTextLight, fontSize: "14px", fontWeight: 700 }}>
                {DAY_LABELS.map((label, i) => (
                    <span key={i} style={{ height: `${cellSize}px`, lineHeight: `${cellSize}px`, color: i % 2 === 0 ? COLORS.duoTextLight : 'transparent' }}>{label}</span>
                ))}
            </div>
            
            <TooltipProvider delayDuration={0}>
              <div style={{ display: "grid", gridAutoFlow: "column", gridTemplateRows: `repeat(7, ${cellSize}px)`, gap: `${GAP}px`, flexGrow: 1 }}>
                {calendar.weeks.map((week) => (
                  <React.Fragment key={week.firstDay}>
                    {/* Re-order days to match Mon-Sun format */}
                    {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                      const day = week.contributionDays.find((d) => d.weekday === dayIdx);
                      if (!day) return <div key={dayIdx} style={{ width: cellSize, height: cellSize }} />;
                      return <DayCell key={day.date} day={day} cellSize={cellSize} />;
                    })}
                  </React.Fragment>
                ))}
              </div>
            </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "30px", fontSize: "14px", fontWeight: 700, color: COLORS.duoTextLight }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: COLORS.level0 }} />
              <span>No contributions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: COLORS.level1, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
              <span>1 contribution</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: COLORS.level2, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
              <span>2-4 contributions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: COLORS.level3, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
              <span>5-9 contributions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: COLORS.level4, boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }} />
              <span>10+ contributions</span>
          </div>
      </div>

      {/* Footer Section */}
      <div style={{ borderRadius: "16px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "45px", height: "45px", backgroundColor: "#CE82FF", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 0 #A559D6", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" style={{ width: "25px", height: "25px", fill: "white" }}>
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"/>
                  </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", color: "#3C3C3C", fontWeight: 800 }}>You're on fire!</h3>
                  <p style={{ margin: 0, fontSize: "15px", color: COLORS.duoTextMain, fontWeight: 600 }}>
                      {currentStreak} day streak! <span style={{ color: "#FF9600" }}>🔥</span> Keep shipping!
                  </p>
              </div>
          </div>
          
          <button 
            onClick={() => window.open("https://github.com", "_blank")}
            style={{ 
                backgroundColor: "white", 
                color: COLORS.duoGreen, 
                border: `2px solid ${COLORS.duoGreyBorder}`, 
                borderBottomWidth: "4px", 
                borderRadius: "16px", 
                padding: "12px 24px", 
                fontSize: "16px", 
                fontWeight: 800, 
                fontFamily: "inherit", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                textTransform: "uppercase", 
                letterSpacing: "0.5px",
                flexShrink: 0,
                outline: "none",
                transitionProperty: "transform, background-color, border-bottom-width",
                transitionDuration: "0.15s",
                transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F7F7F7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.96) translateY(2px)";
              e.currentTarget.style.borderBottomWidth = "2px";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.borderBottomWidth = "4px";
            }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "24px", height: "24px", fill: COLORS.duoGreen }}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              VIEW ON GITHUB <span style={{ color: COLORS.duoGreen, fontWeight: "bold", fontSize: "20px" }}>›</span>
          </button>
      </div>
    </div>
  );
};

const DayCell: React.FC<{ day: ContributionDay; cellSize: number }> = ({ day, cellSize }) => {
  const dateStr = new Date(day.date + "T12:00:00").toLocaleDateString(
    undefined,
    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
  );

  let bgColor = COLORS.level0;
  let hasShadow = false;

  if (day.contributionLevel === "FIRST_QUARTILE") { bgColor = COLORS.level1; hasShadow = true; }
  else if (day.contributionLevel === "SECOND_QUARTILE") { bgColor = COLORS.level2; hasShadow = true; }
  else if (day.contributionLevel === "THIRD_QUARTILE") { bgColor = COLORS.level3; hasShadow = true; }
  else if (day.contributionLevel === "FOURTH_QUARTILE") { bgColor = COLORS.level4; hasShadow = true; }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor: bgColor,
            borderRadius: "4px",
            boxShadow: hasShadow ? "inset 0 -2px 0 rgba(0,0,0,0.15)" : "none",
            cursor: "pointer",
            transitionProperty: "transform, box-shadow",
            transitionDuration: "0.1s",
            transitionTimingFunction: "ease-out",
            position: "relative",
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "scale(1.2)";
            el.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
            el.style.zIndex = "10";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.transform = "scale(1)";
            el.style.boxShadow = hasShadow ? "inset 0 -2px 0 rgba(0,0,0,0.15)" : "none";
            el.style.zIndex = "1";
          }}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="px-3 py-2 border-none shadow-lg"
        style={{
            fontSize: "12px",
            fontFamily: "inherit",
            backgroundColor: "#4B4B4B",
            color: "white",
            borderRadius: "8px",
            fontWeight: 600
        }}
      >
        <strong style={{ color: "#FF9600", fontWeight: 800 }}>{day.contributionCount}</strong> contributions on {dateStr}
      </TooltipContent>
    </Tooltip>
  );
};
