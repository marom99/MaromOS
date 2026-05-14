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

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-bold text-right shrink-0" style={{ minWidth: 80 }}>
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

function BeveledButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";

  const className = cn(
    "px-4 py-1 rounded text-[11px] cursor-pointer transition-colors",
    isXpTheme
      ? "border border-[#ACA899] bg-[#ECE9D8] hover:bg-[#F5F3EC] active:bg-[#D9D6C9]"
      : "border border-[#B4B4B4] bg-[#F0F0F0] hover:bg-[#F7F7F7] active:bg-[#E0E0E0] shadow-sm"
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
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
          minWidth: 320,
          minHeight: 420,
          maxWidth: 420,
          maxHeight: 560,
        }}
      >
        <div data-impeccable-variants="b26ab670" data-impeccable-variant-count="3" style={{ display: "contents" }}>
          {/* impeccable-variants-start b26ab670 */}
          {/* Original */}
          <div data-impeccable-variant="original">
            <div
              className={cn(
                "flex-1 flex flex-col items-center overflow-auto select-none",
                isXpTheme ? "bg-[#ECE9D8]" : "bg-[#E8E8E8]"
              )}
              style={{
                padding: "24px 20px 16px",
              }}
            >
              {/* Avatar */}
              <ProfileAvatar
                picture={ALL_USER_PICTURES[37]?.path}
                fallback="M"
                label="Marom"
                className="w-[54px] h-[54px] mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              />

              {/* Name */}
              <h1
                className={cn(
                  "text-center font-medium",
                  isXpTheme ? "text-[17px] font-['Trebuchet_MS']" : "text-2xl"
                )}
                style={isXpTheme ? undefined : { fontFamily: "var(--font-apple-garamond)" }}
              >
                Marom
              </h1>

              {/* Location */}
              <p
                className="text-center mt-0.5 mb-3"
                style={{
                  fontSize: isXpTheme ? "11px" : "12px",
                  color: "#666",
                }}
              >
                Jakarta, ID
              </p>

              {/* Info rows */}
              <div
                className="flex flex-col gap-1.5 w-full"
                style={{
                  fontSize: isXpTheme ? "11px" : "12px",
                  color: "#333",
                  fontFamily: isXpTheme ? '"Pixelated MS Sans Serif", Arial' : "var(--font-geneva-12)",
                  maxWidth: 280,
                }}
              >
                <InfoRow label="Process" value="Software Engineer" />
                <InfoRow label="Version" value="2026" />
              </div>

              {/* Footer */}
              <div
                className="text-center mt-4"
                style={{
                  fontSize: isXpTheme ? "10px" : "11px",
                  color: "#888",
                  fontFamily: isXpTheme ? '"Pixelated MS Sans Serif", Arial' : "var(--font-geneva-12)",
                }}
              >
                <p>&copy; Marom 1999-2026</p>
                <a
                  href="mailto:hi@marom.id"
                  className="text-blue-600 hover:underline"
                >
                  hi@marom.id
                </a>
              </div>
            </div>
          </div>
          {/* Variants: insert below this line */}
          {/* impeccable-variants-end b26ab670 */}
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
