import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { AppProps } from "@/apps/base/types";
import { useThemeStore } from "@/stores/useThemeStore";
import { AboutMeMenuBar } from "./AboutMeMenuBar";
import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";
import { appMetadata, helpItems } from "../metadata";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { ALL_USER_PICTURES } from "@/utils/userPictures";
import { cn } from "@/lib/utils";
import {
  ContributionDay,
  ContributionWeek,
  useGitHubContributionsLogic,
} from "@/apps/github-contributions/hooks/useGitHubContributionsLogic";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CONTRIBUTION_COLORS = {
  none: "#FFFFFF",
  one: "#DEF9AA",
  few: "#BBED63",
  many: "#83CE16",
  heavy: "#4FA905",
} as const;

const CONTRIBUTION_CELL_SIZE = 14;
const CONTRIBUTION_CELL_GAP = 4;
const DEFAULT_VISIBLE_WEEKS = 13;

function getContributionColor(count: number) {
  if (count === 0) return CONTRIBUTION_COLORS.none;
  if (count === 1) return CONTRIBUTION_COLORS.one;
  if (count <= 4) return CONTRIBUTION_COLORS.few;
  if (count <= 9) return CONTRIBUTION_COLORS.many;
  return CONTRIBUTION_COLORS.heavy;
}

function formatContributionDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatContributionCount(count: number) {
  return `${count} ${count === 1 ? "contribution" : "contributions"}`;
}

function useFittedWeekCount<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [weekCount, setWeekCount] = useState(DEFAULT_VISIBLE_WEEKS);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const updateWeekCount = () => {
      const nextCount = Math.max(
        1,
        Math.floor(
          (node.clientWidth + CONTRIBUTION_CELL_GAP) /
            (CONTRIBUTION_CELL_SIZE + CONTRIBUTION_CELL_GAP),
        ),
      );
      setWeekCount(nextCount);
    };

    updateWeekCount();
    const resizeObserver = new ResizeObserver(updateWeekCount);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, weekCount };
}

function getWeekDays(week: ContributionWeek) {
  const days = Array<ContributionDay | null>(7).fill(null);
  week.contributionDays.forEach((day) => {
    days[day.weekday] = day;
  });
  return days;
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-baseline">
      <span className="font-bold text-left shrink-0" style={{ minWidth: 80 }}>
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

function GitHubStreakGrid() {
  const { calendar, isLoading, error } = useGitHubContributionsLogic();
  const { ref, weekCount } = useFittedWeekCount<HTMLDivElement>();

  const visibleWeeks = useMemo(
    () => calendar?.weeks.slice(-weekCount) ?? [],
    [calendar, weekCount],
  );

  const contributionTotal = calendar?.totalContributions ?? 0;
  const totalLabel = isLoading
    ? "Fetching..."
    : error
      ? "Unavailable"
      : `${contributionTotal.toLocaleString()} Contributions`;

  return (
    <div className="about-profile__github">
      <InfoRow label="Github" value={totalLabel} />
      <TooltipProvider delayDuration={120}>
        <div
          ref={ref}
          className="about-profile__streak-grid"
          aria-label="GitHub contribution streak"
        >
          {visibleWeeks.length > 0 ? (
            visibleWeeks.map((week) => (
              <div className="about-profile__streak-week" key={week.firstDay}>
                {getWeekDays(week).map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <span
                        aria-hidden="true"
                        className="about-profile__streak-cell about-profile__streak-cell--empty"
                        key={`${week.firstDay}-${dayIndex}`}
                      />
                    );
                  }

                  return (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="about-profile__streak-cell"
                          style={{
                            backgroundColor: getContributionColor(
                              day.contributionCount,
                            ),
                          }}
                          aria-label={`${formatContributionDate(day.date)}: ${formatContributionCount(day.contributionCount)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="about-profile__streak-tooltip"
                      >
                        {formatContributionDate(day.date)} · {formatContributionCount(day.contributionCount)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))
          ) : (
            <span className="about-profile__streak-status">
              {isLoading ? "Fetching GitHub streak..." : error}
            </span>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}

export const AboutMeAppComponent: React.FC<AppProps> = ({
  isWindowOpen,
  onClose,
  isForeground,
  instanceId,
  skipInitialSound,
}) => {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";

  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  const menuBarEl = (
    <AboutMeMenuBar
      onClose={onClose}
      onShowHelp={() => setIsHelpDialogOpen(true)}
      onShowAbout={() => setIsAboutDialogOpen(true)}
    />
  );

  if (!isWindowOpen) return null;

  return (
    <>
      {!isXpTheme && isForeground && menuBarEl}
      <WindowFrame
        appId="about-me"
        instanceId={instanceId}
        title="About Me"
        isForeground={isForeground}
        onClose={onClose}
        skipInitialSound={skipInitialSound}
        menuBar={isXpTheme ? menuBarEl : undefined}
        windowConstraints={{
          minWidth: 280,
          minHeight: 280,
          maxWidth: 420,
          maxHeight: 560,
        }}
      >
        <style>{`
          .about-profile {
            --profile-density: 1;
            --profile-gap: calc(var(--profile-density) * 12px);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: calc(var(--profile-density) * 16px);
            padding: calc(var(--profile-density) * 16px) calc(var(--profile-density) * 22px);
            color: var(--os-color-text-primary);
            font-family: var(--font-geneva-12);
          }

          .about-profile__hero {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            gap: calc(var(--profile-density) * 13px);
            padding-bottom: calc(var(--profile-density) * 12px);
            border-bottom: 0.5px solid var(--os-color-separator);
          }

          .about-profile__avatar {
            width: calc(var(--profile-density) * 48px);
            height: calc(var(--profile-density) * 48px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }

          .about-profile__identity {
            min-width: 0;
            text-align: left;
          }

          .about-profile__name {
            font-size: calc(var(--profile-density) * 20px);
            line-height: calc(var(--profile-density) * 23px);
          }

          .about-profile__location {
            margin-top: 2px;
            font-size: 12px;
            color: var(--os-color-text-secondary);
          }

          .about-profile__facts {
            display: flex;
            flex-direction: column;
            gap: calc(var(--profile-density) * 8px);
            width: 100%;
            margin: 0;
            font-size: 12px;
            color: #333333;
          }

          .about-profile__facts > div {
            display: grid;
            grid-template-columns: calc(var(--profile-density) * 80px) 1fr;
            gap: 0;
            align-items: baseline;
          }

          .about-profile__facts span:first-child {
            min-width: 0 !important;
            text-align: left;
          }

          .about-profile__github {
            display: flex !important;
            flex-direction: column;
            gap: calc(var(--profile-density) * 12px) !important;
            width: 100%;
          }

          .about-profile__github > div:first-child {
            display: grid;
            grid-template-columns: calc(var(--profile-density) * 80px) 1fr;
            gap: 0;
            align-items: baseline;
          }

          .about-profile__streak-grid {
            display: flex;
            align-items: flex-start;
            gap: ${CONTRIBUTION_CELL_GAP}px;
            width: 100%;
            max-width: 230px;
            overflow: hidden;
          }

          .about-profile__streak-week {
            display: flex;
            flex-direction: column;
            gap: ${CONTRIBUTION_CELL_GAP}px;
            flex: 0 0 ${CONTRIBUTION_CELL_SIZE}px;
          }

          .about-profile__streak-cell {
            display: block;
            width: ${CONTRIBUTION_CELL_SIZE}px;
            height: ${CONTRIBUTION_CELL_SIZE}px;
            border: 0;
            border-radius: 0;
            padding: 0;
            appearance: none;
            flex-shrink: 0;
            box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.03);
            transition: transform 120ms ease, box-shadow 120ms ease;
          }

          .about-profile__streak-cell:not(.about-profile__streak-cell--empty) {
            cursor: default;
          }

          .about-profile__streak-cell:not(.about-profile__streak-cell--empty):hover,
          .about-profile__streak-cell:not(.about-profile__streak-cell--empty):focus-visible {
            transform: translateY(-1px);
            box-shadow: 0 0 0 1px #333333, 0 1px 2px rgba(0, 0, 0, 0.2);
            outline: none;
            position: relative;
            z-index: 1;
          }

          .about-profile__streak-cell--empty {
            background: transparent;
            box-shadow: none;
          }

          .about-profile__streak-status {
            display: flex;
            min-height: 122px;
            align-items: center;
            color: #777777;
            font-size: 11px;
            line-height: 15px;
          }

          .about-profile__streak-tooltip {
            border-radius: 4px;
            background: rgba(27, 27, 27, 0.96);
            color: #ffffff;
            font-family: var(--font-geneva-12);
            font-size: 11px;
            line-height: 14px;
            padding: 5px 7px;
          }

          .about-profile__footer {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 2px;
            width: 100%;
            margin-top: calc(var(--profile-density) * 2px);
            text-align: left;
            font-family: var(--font-geneva-12);
            font-size: 11px;
            color: #888888;
          }

          .about-profile__footer-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .about-profile__footer-icon {
            width: 34px;
            height: 34px;
            flex-shrink: 0;
          }

          .about-profile a {
            color: rgb(37, 99, 235);
            text-decoration: none;
          }

          .about-profile a:hover {
            text-decoration: underline;
          }
        `}</style>
        <div
          className={cn(
            "about-profile about-profile--left-ledger flex-1 overflow-auto select-none",
            isXpTheme ? "bg-[#ECE9D8]" : "bg-[#E8E8E8]",
          )}
        >
          <div className="about-profile__hero">
            <ProfileAvatar
              picture={ALL_USER_PICTURES[37]?.path}
              fallback="M"
              label="Marom"
              className="about-profile__avatar"
            />
            <div className="about-profile__identity">
              <h1
                className={cn(
                  "about-profile__name font-medium",
                  isXpTheme ? "font-['Trebuchet_MS']" : "",
                )}
                style={
                  isXpTheme
                    ? undefined
                    : { fontFamily: "var(--font-apple-garamond)" }
                }
              >
                Marom
              </h1>
              <p className="about-profile__location">Jakarta, ID 🇮🇩</p>
            </div>
          </div>

          <div className="about-profile__facts">
            <InfoRow label="Process" value="Software Designer" />
            <InfoRow label="Version" value="2026" />
            <GitHubStreakGrid />
          </div>

          <div className="about-profile__footer">
            <div className="about-profile__footer-text">
              <p>&copy; Marom 1999-2026</p>
              <a href="mailto:hi@marom.id">hi@marom.id</a>
            </div>
            <img
              src="/icons/macosx/file-text.png"
              alt=""
              aria-hidden="true"
              className="about-profile__footer-icon"
            />
          </div>
        </div>
      </WindowFrame>

      <HelpDialog
        isOpen={isHelpDialogOpen}
        onOpenChange={setIsHelpDialogOpen}
        appId="about-me"
        helpItems={helpItems}
      />
      <AboutDialog
        isOpen={isAboutDialogOpen}
        onOpenChange={setIsAboutDialogOpen}
        metadata={appMetadata}
        appId="about-me"
      />
    </>
  );
};
