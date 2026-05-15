import React, { useState } from "react";
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
    <div className="flex items-baseline gap-2">
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
            gap: calc(var(--profile-density) * 15px);
            padding: calc(var(--profile-density) * 18px) calc(var(--profile-density) * 22px) calc(var(--profile-density) * 16px);
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
            font-size: calc(var(--profile-density) * 25px);
            line-height: 1.05;
          }

          .about-profile__location {
            margin-top: 2px;
            font-size: 12px;
            color: var(--os-color-text-secondary);
          }

          .about-profile__facts {
            display: flex;
            flex-direction: column;
            gap: calc(var(--profile-density) * 6px);
            width: 100%;
            margin: 0;
            font-size: 12px;
            color: #333333;
          }

          .about-profile__facts > div {
            display: grid;
            grid-template-columns: calc(var(--profile-density) * 70px) 1fr;
            gap: calc(var(--profile-density) * 10px);
            align-items: baseline;
          }

          .about-profile__facts span:first-child {
            min-width: 0 !important;
            text-align: left;
          }

          .about-profile__footer {
            width: 100%;
            margin-top: calc(var(--profile-density) * 2px);
            text-align: left;
            font-family: var(--font-geneva-12);
            font-size: 11px;
            color: #888888;
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
          </div>

          <div className="about-profile__footer">
            <p>&copy; Marom 1999-2026</p>
            <a href="mailto:hi@marom.id">hi@marom.id</a>
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
