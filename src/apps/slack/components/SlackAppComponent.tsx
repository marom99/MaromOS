import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProps } from "@/apps/base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { useTranslatedHelpItems } from "@/hooks/useTranslatedHelpItems";
import { useThemeStore } from "@/stores/useThemeStore";
import { isWindowsTheme } from "@/themes";
import { cn } from "@/lib/utils";
import { appMetadata, helpItems } from "../metadata";
import { caseStudies, getChannelById } from "../data/caseStudies";
import { useSlackStore } from "@/stores/useSlackStore";
import { useSlackFrameLayout } from "../hooks/useSlackFrameLayout";
import { SlackMenuBar } from "./SlackMenuBar";
import { SlackDialogs } from "./SlackDialogs";
import { SlackSidebar } from "./SlackSidebar";
import { SlackChannelHeader } from "./SlackChannelHeader";
import { SlackMessages } from "./SlackMessages";
import { SlackComposer } from "./SlackComposer";
import { SlackDetailsPanel } from "./SlackDetailsPanel";
import { SlackThreadPanel } from "./SlackThreadPanel";
import "./slack-aqua.css";

export function SlackAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
  skipInitialSound,
  instanceId,
  onNavigateNext,
  onNavigatePrevious,
}: AppProps) {
  const translatedHelpItems = useTranslatedHelpItems("slack", helpItems);

  const activeChannelId = useSlackStore((state) => state.activeChannelId);
  const showDetails = useSlackStore((state) => state.showDetailsPanel);
  const showSidebar = useSlackStore((state) => state.showSidebar);
  const activeThreadMessageId = useSlackStore(
    (state) => state.activeThreadMessageId
  );
  const fontSize = useSlackStore((state) => state.fontSize);
  const setActiveChannel = useSlackStore((state) => state.setActiveChannel);
  const toggleDetails = useSlackStore((state) => state.toggleDetails);
  const setShowDetails = useSlackStore((state) => state.setShowDetails);
  const toggleSidebar = useSlackStore((state) => state.toggleSidebar);
  const setShowSidebar = useSlackStore((state) => state.setShowSidebar);
  const openThread = useSlackStore((state) => state.openThread);
  const closeThread = useSlackStore((state) => state.closeThread);
  const addReaderNote = useSlackStore((state) => state.addReaderNote);
  const setFontSize = useSlackStore((state) => state.setFontSize);

  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = isWindowsTheme(currentTheme);
  const isMacTheme = currentTheme === "macosx";

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const activeChannel = useMemo(
    () => getChannelById(activeChannelId) ?? caseStudies[0],
    [activeChannelId]
  );

  const { containerRef, isFrameNarrow, isFrameCompact } = useSlackFrameLayout();

  // Auto-collapse details when frame becomes compact; re-open when wide again
  useEffect(() => {
    if (isFrameCompact && showDetails && !isFrameNarrow) {
      // Compact: keep details rendered as overlay-friendly width via CSS, no force-close
      return;
    }
  }, [isFrameCompact, isFrameNarrow, showDetails]);

  // Auto-show sidebar when widening past narrow threshold
  useEffect(() => {
    if (!isFrameNarrow && !showSidebar) {
      setShowSidebar(true);
    }
  }, [isFrameNarrow, showSidebar, setShowSidebar]);

  const handleSelectChannel = useCallback(
    (id: string) => {
      setActiveChannel(id);
      if (isFrameNarrow) setShowSidebar(false);
    },
    [setActiveChannel, isFrameNarrow, setShowSidebar]
  );

  const handleAddReaderNote = useCallback(
    (body: string) => {
      addReaderNote(activeChannel.id, body);
    },
    [addReaderNote, activeChannel.id]
  );

  const handleIncreaseFontSize = useCallback(() => {
    setFontSize((prev) => prev + 1);
  }, [setFontSize]);

  const handleDecreaseFontSize = useCallback(() => {
    setFontSize((prev) => prev - 1);
  }, [setFontSize]);

  const handleResetFontSize = useCallback(() => {
    setFontSize(13);
  }, [setFontSize]);

  if (!isWindowOpen) return null;

  const menuBar = (
    <SlackMenuBar
      onClose={onClose}
      onShowHelp={() => setIsHelpOpen(true)}
      onShowAbout={() => setIsAboutOpen(true)}
      channels={caseStudies}
      activeChannelId={activeChannel.id}
      onSelectChannel={handleSelectChannel}
      showSidebar={showSidebar}
      onToggleSidebar={toggleSidebar}
      showDetails={showDetails}
      onToggleDetails={toggleDetails}
      onIncreaseFontSize={handleIncreaseFontSize}
      onDecreaseFontSize={handleDecreaseFontSize}
      onResetFontSize={handleResetFontSize}
      hasActiveThread={!!activeThreadMessageId}
      onCloseThread={closeThread}
    />
  );

  const sidebarMounted = showSidebar || !isFrameNarrow;
  const detailsAsOverlay = isFrameCompact && !isFrameNarrow;
  const threadVariant = isFrameNarrow ? "takeover" : "overlay";

  return (
    <>
      {!isXpTheme && isForeground && menuBar}
      <WindowFrame
        title={`Slack — #${activeChannel.name}`}
        onClose={onClose}
        isForeground={isForeground}
        appId="slack"
        material={isMacTheme ? "brushedmetal" : "default"}
        skipInitialSound={skipInitialSound}
        instanceId={instanceId}
        onNavigateNext={onNavigateNext}
        onNavigatePrevious={onNavigatePrevious}
        menuBar={isXpTheme ? menuBar : undefined}
      >
        <div
          ref={containerRef}
          className={cn(
            "slack-app",
            isMacTheme && "slack-app--mac",
            isXpTheme && "slack-app--legacy",
            isFrameNarrow && "slack-app--narrow",
            isFrameCompact && "slack-app--compact"
          )}
          data-os-theme={currentTheme}
        >
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {showSidebar && isFrameNarrow && (
              <motion.div
                className="slack-sidebar-overlay"
                style={{ perspective: "2000px" }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="slack-sidebar-overlay-scrim"
                  onClick={toggleSidebar}
                />
                <motion.div
                  initial={{ x: "-100%", opacity: 0.6 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 32, stiffness: 320 }}
                  className="slack-sidebar-overlay-panel"
                >
                  <SlackSidebar
                    channels={caseStudies}
                    activeChannelId={activeChannel.id}
                    onSelectChannel={handleSelectChannel}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "slack-app-grid",
              showDetails && !detailsAsOverlay && "has-details",
              !showSidebar || isFrameNarrow ? "no-sidebar" : "has-sidebar"
            )}
          >
            {sidebarMounted && !isFrameNarrow && (
              <div className="slack-app-grid-cell slack-app-grid-cell--sidebar">
                <SlackSidebar
                  channels={caseStudies}
                  activeChannelId={activeChannel.id}
                  onSelectChannel={handleSelectChannel}
                />
              </div>
            )}

            <div className="slack-app-grid-cell slack-app-grid-cell--main">
              <SlackChannelHeader
                channel={activeChannel}
                isDetailsOpen={showDetails}
                onToggleDetails={toggleDetails}
                showSidebarToggle={isFrameNarrow}
                onToggleSidebar={toggleSidebar}
              />

              <div className="slack-main-body">
                <SlackMessages
                  channel={activeChannel}
                  onOpenThread={openThread}
                  fontSize={fontSize}
                />
                <SlackComposer
                  channelName={activeChannel.name}
                  disabled={activeChannel.status === "locked"}
                  onSubmit={handleAddReaderNote}
                />
              </div>
            </div>

            {showDetails && !detailsAsOverlay && !isFrameNarrow && (
              <div className="slack-app-grid-cell slack-app-grid-cell--details">
                <SlackDetailsPanel
                  channel={activeChannel}
                  onClose={() => setShowDetails(false)}
                  variant="panel"
                />
              </div>
            )}

            {/* Details overlay for compact frames */}
            <AnimatePresence>
              {showDetails && (detailsAsOverlay || isFrameNarrow) && (
                <motion.div
                  className="slack-details-overlay"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.18 }}
                >
                  <SlackDetailsPanel
                    channel={activeChannel}
                    onClose={() => setShowDetails(false)}
                    variant="overlay"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thread overlay */}
            <AnimatePresence>
              {activeThreadMessageId && (
                <motion.div
                  className={cn(
                    "slack-thread-shell",
                    `slack-thread-shell--${threadVariant}`
                  )}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.2 }}
                >
                  <SlackThreadPanel
                    channel={activeChannel}
                    messageId={activeThreadMessageId}
                    onClose={closeThread}
                    variant={threadVariant}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <SlackDialogs
          helpItems={translatedHelpItems}
          appMetadata={appMetadata}
          isHelpOpen={isHelpOpen}
          onHelpOpenChange={setIsHelpOpen}
          isAboutOpen={isAboutOpen}
          onAboutOpenChange={setIsAboutOpen}
        />
      </WindowFrame>
    </>
  );
}
