import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { SlackSidebar, type SlackNavItem } from "./SlackSidebar";
import { SidebarCollapseIcon, SidebarExpandIcon } from "./SlackIcons";
import { SlackChannelHeader } from "./SlackChannelHeader";
import { SlackMessages } from "./SlackMessages";
import { SlackComposer } from "./SlackComposer";
import { SlackThreadPanel } from "./SlackThreadPanel";
import { SlackThreadsView, type ThreadEntry } from "./SlackThreadsView";
import { SlackEmptyState } from "./SlackEmptyState";
import {
  getSlackChannel,
  slackChannels,
  type SlackChannelId,
  type SlackMessageItem,
  type SlackThreadReplyItem,
} from "../data/channelContent";
import { MAROM_DM_ID, maromDMMessages } from "../data/dmContent";
import { SlackDMHeader } from "./SlackDMHeader";
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
  const [selectedThreadChannelId, setSelectedThreadChannelId] = useState<SlackChannelId | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<SlackNavItem | null>(null);
  const [activeDMId, setActiveDMId] = useState<string | null>(null);
  const [dmMessages, setDmMessages] = useState<SlackMessageItem[]>(maromDMMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  const [panelWidthPx, setPanelWidthPx] = useState<number | null>(null);
  const [defaultWidthPx, setDefaultWidthPx] = useState(400);
  const appRef = useRef<HTMLDivElement>(null);
  const panelStageRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const isResizingRef = useRef(false);

  useLayoutEffect(() => {
    isResizingRef.current = false;
  });

  useEffect(() => {
    if (appRef.current) {
      setDefaultWidthPx(Math.max(280, Math.min(appRef.current.clientWidth * 0.35, 420)));
    }
  }, [isWindowOpen]);

  useEffect(() => {
    if (!selectedThreadMessageId) setPanelWidthPx(null);
  }, [selectedThreadMessageId]);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!panelStageRef.current || !appRef.current || isMobile) return;
      dragStateRef.current = {
        startX: e.clientX,
        startWidth: panelStageRef.current.offsetWidth,
      };
      const handleMove = (moveEvent: PointerEvent) => {
        if (!dragStateRef.current || !panelStageRef.current || !appRef.current) return;
        const dx = moveEvent.clientX - dragStateRef.current.startX;
        const appWidth = appRef.current.clientWidth;
        const newWidth = Math.max(
          240,
          Math.min(appWidth * 0.65, dragStateRef.current.startWidth - dx)
        );
        panelStageRef.current.style.flexBasis = `${newWidth}px`;
      };
      const handleUp = () => {
        if (panelStageRef.current) {
          const finalWidth = panelStageRef.current.offsetWidth;
          dragStateRef.current = null;
          isResizingRef.current = true;
          setPanelWidthPx(finalWidth);
        } else {
          dragStateRef.current = null;
        }
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [isMobile]
  );

  if (!isWindowOpen) return null;

  const baseActiveChannel = getSlackChannel(activeChannelId);
  const activeChannel = {
    ...baseActiveChannel,
    messages: channelMessages[activeChannelId] ?? baseActiveChannel.messages,
  };

  const threadsForMarom = useMemo<ThreadEntry[]>(() => {
    const entries: ThreadEntry[] = [];

    for (const channel of slackChannels) {
      const messages = channelMessages[channel.id] ?? channel.messages;
      const channelName = channel.name;

      for (const message of messages) {
        if (!message.thread) continue;

        const involvesMarom =
          message.user === "Marom" ||
          message.thread.replies.some(
            (reply) => reply.user === "Marom"
          );

        if (involvesMarom) {
          entries.push({
            channelId: channel.id,
            channelName,
            message,
          });
        }
      }
    }

    return entries;
  }, [channelMessages]);

  const selectedThreadMessage = (() => {
    if (!selectedThreadMessageId) return null;

    if (selectedThreadChannelId) {
      const channel = getSlackChannel(selectedThreadChannelId);
      const messages = channelMessages[selectedThreadChannelId] ?? channel.messages;
      return messages.find(
        (message) => message.id === selectedThreadMessageId && message.thread
      ) ?? null;
    }

    return activeChannel.messages.find(
      (message) => message.id === selectedThreadMessageId && message.thread
    ) ?? null;
  })();

  const selectedThreadChannel = selectedThreadChannelId
    ? getSlackChannel(selectedThreadChannelId)
    : activeChannel;

  const handleSelectChannel = (channelId: SlackChannelId) => {
    setActiveChannelId(channelId);
    setActiveNavItem(null);
    setActiveDMId(null);
    setSelectedThreadMessageId(null);
    setSelectedThreadChannelId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSelectDM = (id: string) => {
    setActiveDMId(id);
    setActiveNavItem(null);
    setSelectedThreadMessageId(null);
    setSelectedThreadChannelId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSendDMMessage = (content: string, imageData?: string | null) => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !imageData) return false;

    setDmMessages((prev) => [
      ...prev,
      {
        id: `dm-visitor-${Date.now()}-${prev.length}`,
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

  const handleSelectNav = (item: SlackNavItem) => {
    setActiveNavItem((prev) => (prev === item ? null : item));
    setSelectedThreadMessageId(null);
    setSelectedThreadChannelId(null);
  };

  const handleOpenThreadMessage = (channelId: SlackChannelId, messageId: string) => {
    setSelectedThreadChannelId(channelId);
    setSelectedThreadMessageId(messageId);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((open) => {
      const next = !open;
      if (next) {
        setSelectedThreadMessageId(null);
        setSelectedThreadChannelId(null);
      }
      return next;
    });
  };

  const handleOpenThread = (messageId: string | null) => {
    setSelectedThreadMessageId(messageId);
    setSelectedThreadChannelId(null);
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

  const handleAddThreadReply = (channelId: SlackChannelId, messageId: string, content: string, imageData?: string | null) => {
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

    setChannelMessages((prev) => {
      const channelData = getSlackChannel(channelId);
      const currentMessages = prev[channelId] ?? channelData.messages;

      return {
        ...prev,
        [channelId]: currentMessages.map((message) => {
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
        }),
      };
    });

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

  const getWindowTitle = () => {
    if (activeDMId === MAROM_DM_ID) return "Slack — Marom";
    if (activeNavItem === "threads") return "Slack — Threads";
    if (activeNavItem === "mentions") return "Slack — Mentions & Reactions";
    if (activeNavItem === "bookmarks") return "Slack — Bookmarks";
    if (activeNavItem === "drafts") return "Slack — Drafts";
    return `Slack — #${activeChannel.name}`;
  };

  return (
    <>
      {!isXpTheme && isForeground && menuBar}
      <WindowFrame
        title={getWindowTitle()}
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
          ref={appRef}
          className={`app${isMobile ? " app--mobile" : ""}${
            isMobile && isSidebarOpen ? " app--sidebar-open" : ""
          }${!isMobile && isSidebarCollapsed ? " app--sidebar-collapsed" : ""
          }${selectedThreadMessage ? " app--thread-open" : ""}`}
        >
          <SlackSidebar
            activeChannelId={activeChannelId}
            onSelectChannel={handleSelectChannel}
            isCollapsed={!isMobile && isSidebarCollapsed}
            activeNavItem={activeNavItem}
            onSelectNav={handleSelectNav}
            activeDMId={activeDMId}
            onSelectDM={handleSelectDM}
          />
          {activeDMId === MAROM_DM_ID ? (
            <main className="main">
              <SlackDMHeader
                onToggleSidebar={isMobile ? handleToggleSidebar : undefined}
                isSidebarOpen={isSidebarOpen}
              />
              <SlackMessages
                channel={{
                  id: "marom" as SlackChannelId,
                  name: "Marom",
                  topic: "",
                  memberCount: 0,
                  members: [],
                  composerPlaceholder: "Message Marom",
                  messages: dmMessages,
                }}
                selectedThreadMessageId={null}
                onOpenThread={() => {}}
                onMessagesChange={() => {}}
              />
              <SlackComposer
                isForeground={!!isForeground}
                onSendMessage={handleSendDMMessage}
              />
            </main>
          ) : activeNavItem === "threads" ? (
            <SlackThreadsView
              threads={threadsForMarom}
              onOpenThreadMessage={handleOpenThreadMessage}
            />
          ) : activeNavItem === "mentions" ||
            activeNavItem === "bookmarks" ||
            activeNavItem === "drafts" ||
            activeNavItem === "more" ? (
            <SlackEmptyState type={activeNavItem} />
          ) : (
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
          )}
          <AnimatePresence initial={false}>
            {selectedThreadMessage && (
              <motion.div
                ref={panelStageRef}
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
                  flexBasis: `${panelWidthPx ?? defaultWidthPx}px`,
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
                  shouldReduceMotion || isResizingRef.current
                    ? { duration: 0 }
                    : {
                        flexBasis: { duration: 0.24, ease: [0.32, 0.72, 0, 1] },
                        transform: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
                      }
                }
              >
              <SlackThreadPanel
                channel={selectedThreadChannel}
                message={selectedThreadMessage}
                onClose={() => {
                  setSelectedThreadMessageId(null);
                  setSelectedThreadChannelId(null);
                }}
                onAddReply={(content, imageData) =>
                  handleAddThreadReply(selectedThreadChannelId ?? activeChannelId, selectedThreadMessage.id, content, imageData)
                }
                onResizeStart={isMobile ? undefined : handleResizeStart}
                onResizeReset={isMobile ? undefined : () => setPanelWidthPx(null)}
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
