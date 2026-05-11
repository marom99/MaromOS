import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getApiUrl } from "@/utils/platform";
import { abortableFetch } from "@/utils/abortableFetch";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
  weekday: number;
}

export interface ContributionWeek {
  firstDay: string;
  contributionDays: ContributionDay[];
}

export interface ContributionMonth {
  name: string;
  year: number;
  firstDay: string;
  totalWeeks: number;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
}

export interface GitHubContributionsState {
  calendar: ContributionCalendar | null;
  isLoading: boolean;
  error: string | null;
  currentStreak: number;
  longestStreak: number;
  maxInDay: number;
  refetch: () => Promise<void>;
}

export function useGitHubContributionsLogic(): GitHubContributionsState {
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchContributions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await abortableFetch(getApiUrl("/api/github-contributions"), {
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();
      setCalendar(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Failed to fetch GitHub contributions:", err);
      
      let message = "Failed to fetch GitHub contributions.";
      if (err instanceof Error) {
        if (err.message.includes("503")) {
          message = "GitHub credentials not configured on the server.";
        } else if (err.message.includes("401")) {
          message = "GitHub token is invalid or expired.";
        } else if (err.message.includes("404")) {
          message = "GitHub user not found.";
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchContributions]);

  const streaks = useMemo(() => {
    if (!calendar) return { currentStreak: 0, longestStreak: 0, maxInDay: 0 };

    const days = calendar.weeks
      .flatMap((w) => w.contributionDays)
      .sort((a, b) => a.date.localeCompare(b.date));

    let longest = 0;
    let current = 0;
    let rolling = 0;

    // Current streak (scan backward from today)
    const today = new Date().toISOString().split("T")[0];
    const todayIdx = days.findIndex(d => d.date === today);
    
    if (todayIdx !== -1) {
      // Start from today if it has contributions, or from yesterday
      let startIdx = todayIdx;
      if (days[todayIdx].contributionCount === 0) {
        startIdx = todayIdx - 1;
      }

      for (let i = startIdx; i >= 0; i--) {
        if (days[i].contributionCount > 0) {
          current++;
        } else {
          break;
        }
      }
    }

    // Longest streak (scan forward)
    for (const day of days) {
      if (day.contributionCount > 0) {
        rolling++;
        if (rolling > longest) {
          longest = rolling;
        }
      } else {
        rolling = 0;
      }
    }

    const maxInDay = days.reduce((max, d) => Math.max(max, d.contributionCount), 0);

    return { currentStreak: current, longestStreak: longest, maxInDay };
  }, [calendar]);

  return {
    calendar,
    isLoading,
    error,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
    maxInDay: streaks.maxInDay,
    refetch: fetchContributions,
  };
}
