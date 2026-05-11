import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AppProps } from "@/apps/base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { useTranslatedHelpItems } from "@/hooks/useTranslatedHelpItems";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useThemeStore } from "@/stores/useThemeStore";
import { isWindowsTheme } from "@/themes";
import { appMetadata, helpItems } from "../metadata";
import { SlackMenuBar } from "./SlackMenuBar";
import { SlackDialogs } from "./SlackDialogs";
import { SlackSidebar } from "./SlackSidebar";
import { SidebarCollapseIcon, SidebarExpandIcon } from "./SlackIcons";
import { SlackChannelHeader } from "./SlackChannelHeader";
import { SlackMessages } from "./SlackMessages";
import { SlackComposer } from "./SlackComposer";
import { SlackThreadPanel } from "./SlackThreadPanel";
import {
  getSlackChannel,
  slackChannels,
  type SlackChannelId,
  type SlackMessageItem,
  type SlackThreadReplyItem,
} from "../data/channelContent";
import "./slack-aqua.css";

function createInitialChannelMessages() {
  return Object.fromEntries(
    slackChannels.map((channel) => [channel.id, channel.messages])
  ) as Record<SlackChannelId, SlackMessageItem[]>;
}

function formatSlackTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

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

  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = isWindowsTheme(currentTheme);
  const isMacTheme = currentTheme === "macosx";
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<SlackChannelId>("design-lab");
  const [channelMessages, setChannelMessages] = useState(createInitialChannelMessages);
  const [selectedThreadMessageId, setSelectedThreadMessageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  if (!isWindowOpen) return null;

  const baseActiveChannel = getSlackChannel(activeChannelId);
  const activeChannel = {
    ...baseActiveChannel,
    messages: channelMessages[activeChannelId] ?? baseActiveChannel.messages,
  };

  const selectedThreadMessage =
    activeChannel.messages.find((message) => message.id === selectedThreadMessageId && message.thread) ??
    null;

  const handleSelectChannel = (channelId: SlackChannelId) => {
    setActiveChannelId(channelId);
    setSelectedThreadMessageId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((open) => {
      const next = !open;
      if (next) setSelectedThreadMessageId(null);
      return next;
    });
  };

  const handleOpenThread = (messageId: string | null) => {
    setSelectedThreadMessageId(messageId);
    if (messageId && isMobile) setIsSidebarOpen(false);
  };

  const updateChannelMessages = (
    updater: (messages: SlackMessageItem[]) => SlackMessageItem[]
  ) => {
    setChannelMessages((prev) => ({
      ...prev,
      [activeChannelId]: updater(prev[activeChannelId] ?? baseActiveChannel.messages),
    }));
  };

  const handleSendMessage = (content: string, imageData?: string | null) => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !imageData) return false;

    updateChannelMessages((messages) => [
      ...messages,
      {
        id: `${activeChannelId}-visitor-${Date.now()}-${messages.length}`,
        user: "You",
        time: formatSlackTime(new Date()),
        content: trimmedContent || "Shared an image.",
        reactions: [],
        isSelf: true,
        avatarIndex: 3,
        hasImage: Boolean(imageData),
        imageSrc: imageData ?? undefined,
        imageAlt: "Shared image",
      },
    ]);

    return true;
  };

  const handleAddThreadReply = (messageId: string, content: string, imageData?: string | null) => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !imageData) return false;

    const newReply: SlackThreadReplyItem = {
      id: `${messageId}-visitor-${Date.now()}`,
      user: "You",
      time: formatSlackTime(new Date()),
      content: trimmedContent || "Shared an image.",
      avatarIndex: 3,
      isSelf: true,
      hasImage: Boolean(imageData),
      imageSrc: imageData ?? undefined,
      imageAlt: "Shared image",
    };

    updateChannelMessages((messages) =>
      messages.map((message) => {
        if (message.id !== messageId || !message.thread) return message;

        return {
          ...message,
          thread: {
            ...message.thread,
            replyCount: message.thread.replyCount + 1,
            lastReplyLabel: "Last reply just now",
            participantAvatarIndexes: [3, ...message.thread.participantAvatarIndexes]
              .filter((avatarIndex, index, avatarIndexes) => avatarIndexes.indexOf(avatarIndex) === index)
              .slice(0, 4),
            replies: [...message.thread.replies, newReply],
          },
        };
      })
    );

    return true;
  };

  const menuBar = (
    <SlackMenuBar
      onClose={onClose}
      onShowHelp={() => setIsHelpOpen(true)}
      onShowAbout={() => setIsAboutOpen(true)}
    />
  );

  const sidebarToggleButton = !isMobile && (
    <button
      type="button"
      className="titlebar-sidebar-collapse"
      onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
      aria-label={isSidebarCollapsed ? "Show full sidebar" : "Show icon-only sidebar"}
      title={isSidebarCollapsed ? "Show full sidebar" : "Show icon-only sidebar"}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isSidebarCollapsed ? "expand" : "collapse"}
          className="sidebar-collapse-icon"
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          {isSidebarCollapsed ? (
            <SidebarExpandIcon />
          ) : (
            <SidebarCollapseIcon />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );

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
        titleBarLeftContent={sidebarToggleButton}
      >
        <div
          className={`app${isMobile ? " app--mobile" : ""}${
            isMobile && isSidebarOpen ? " app--sidebar-open" : ""
          }${!isMobile && isSidebarCollapsed ? " app--sidebar-collapsed" : ""
          }${selectedThreadMessage ? " app--thread-open" : ""}`}
        >
          <SlackSidebar
            activeChannelId={activeChannelId}
            onSelectChannel={handleSelectChannel}
            isCollapsed={!isMobile && isSidebarCollapsed}
          />
          <main className="main">
            <SlackChannelHeader
              channel={activeChannel}
              onToggleSidebar={isMobile ? handleToggleSidebar : undefined}
              isSidebarOpen={isSidebarOpen}
            />
            <SlackMessages
              channel={activeChannel}
              selectedThreadMessageId={selectedThreadMessageId}
              onOpenThread={handleOpenThread}
              onMessagesChange={updateChannelMessages}
            />
            <SlackComposer
              isForeground={!!isForeground}
              onSendMessage={handleSendMessage}
            />
          </main>
          <AnimatePresence initial={false}>
            {selectedThreadMessage && (
              <motion.div
                key={selectedThreadMessage.id}
                className="thread-panel-stage"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        flexBasis: "0px",
                        transform: "translate3d(18px, 0, 0)",
                      }
                }
                animate={{
                  flexBasis: "min(360px, 42vw)",
                  transform: "translate3d(0, 0, 0)",
                }}
                exit={
                  shouldReduceMotion
                    ? {}
                    : {
                        flexBasis: "0px",
                        transform: "translate3d(12px, 0, 0)",
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        flexBasis: { duration: 0.24, ease: [0.32, 0.72, 0, 1] },
                        transform: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
                      }
                }
              >
                <SlackThreadPanel
                  channel={activeChannel}
                  message={selectedThreadMessage}
                  onClose={() => setSelectedThreadMessageId(null)}
                  onAddReply={(content, imageData) =>
                    handleAddThreadReply(selectedThreadMessage.id, content, imageData)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
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
