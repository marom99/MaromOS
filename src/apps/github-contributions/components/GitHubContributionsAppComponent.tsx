import React, { useState } from "react";
import { useGitHubContributionsLogic } from "../hooks/useGitHubContributionsLogic";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { GitHubContributionsMenuBar } from "./GitHubContributionsMenuBar";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { AppProps } from "@/apps/base/types";

const SCROLLBAR_COLORS = {
  dark: { thumb: "oklch(0.32 0.05 145)", thumbHover: "oklch(0.42 0.08 145)", bg: "oklch(0.13 0.018 145)" },
  light: { thumb: "oklch(0.78 0.06 145)", thumbHover: "oklch(0.65 0.07 145)", bg: "oklch(0.98 0.008 145)" },
};

export const GitHubContributionsAppComponent: React.FC<AppProps> = ({
  isWindowOpen,
  onClose,
  isForeground,
  instanceId,
  skipInitialSound,
}) => {
  const { calendar, isLoading, error, currentStreak, longestStreak, maxInDay, refetch } =
    useGitHubContributionsLogic();

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("ryos:github-contributions:color-mode") !== "light"
  );

  const toggleMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("ryos:github-contributions:color-mode", next ? "dark" : "light");
      return next;
    });
  };

  if (!isWindowOpen) return null;

  const colors = isDark ? SCROLLBAR_COLORS.dark : SCROLLBAR_COLORS.light;

  return (
    <WindowFrame
      appId="github-contributions"
      instanceId={instanceId}
      title="GitHub"
      isForeground={isForeground}
      onClose={onClose}
      skipInitialSound={skipInitialSound}
      menuBar={
        <GitHubContributionsMenuBar
          onRefresh={refetch}
          onClose={onClose}
          isDark={isDark}
          onToggleMode={toggleMode}
        />
      }
    >
      <>
        <style>{`
          .gh-heatmap-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
          .gh-heatmap-scroll::-webkit-scrollbar-track { background: transparent; }
          .gh-heatmap-scroll::-webkit-scrollbar-thumb { background: ${colors.thumb}; border-radius: 2px; }
          .gh-heatmap-scroll::-webkit-scrollbar-thumb:hover { background: ${colors.thumbHover}; }
        `}</style>
        <div
          className="flex-1 flex flex-col justify-center overflow-auto gh-heatmap-scroll"
          style={{
            backgroundColor: colors.bg,
            padding: "12px 14px 10px",
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.thumb} transparent`,
            transition: "background-color 0.2s ease",
          }}
        >
          {isLoading && !calendar ? (
            <LoadingState isDark={isDark} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} isDark={isDark} />
          ) : calendar ? (
            <ContributionHeatmap
              calendar={calendar}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              maxInDay={maxInDay}
              isDark={isDark}
            />
          ) : null}
        </div>
      </>
    </WindowFrame>
  );
};

const LoadingState: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    className="flex-1 flex items-center justify-center"
    style={{
      fontFamily: "var(--os-font-mono)",
      fontSize: "10px",
      color: isDark ? "oklch(0.55 0.09 145)" : "oklch(0.50 0.07 145)",
      letterSpacing: "0.04em",
      transition: "color 0.2s ease",
    }}
  >
    fetching contributions
    <span className="animate-pulse">_</span>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void; isDark: boolean }> = ({
  message,
  onRetry,
  isDark,
}) => (
  <div
    className="flex-1 flex flex-col items-start justify-center gap-3"
    style={{
      fontFamily: "var(--os-font-mono)",
      fontSize: "10px",
      color: "oklch(0.62 0.16 25)",
      letterSpacing: "0.02em",
    }}
  >
    <span>ERR: {message}</span>
    <button
      onClick={onRetry}
      style={{
        fontFamily: "var(--os-font-mono)",
        fontSize: "10px",
        color: isDark ? "oklch(0.72 0.12 145)" : "oklch(0.35 0.10 145)",
        background: "none",
        border: `1px solid ${isDark ? "oklch(0.35 0.06 145)" : "oklch(0.70 0.06 145)"}`,
        padding: "6px 14px",
        cursor: "pointer",
        letterSpacing: "0.04em",
        minHeight: "32px",
        transition: "color 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor =
          isDark ? "oklch(0.60 0.12 145)" : "oklch(0.45 0.10 145)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor =
          isDark ? "oklch(0.35 0.06 145)" : "oklch(0.70 0.06 145)")
      }
    >
      retry
    </button>
  </div>
);
