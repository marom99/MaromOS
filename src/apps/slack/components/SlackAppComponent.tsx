import { useEffect, useState } from "react";
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

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<SlackChannelId>("design-lab");
  const [channelMessages, setChannelMessages] = useState(createInitialChannelMessages);
  const [selectedThreadMessageId, setSelectedThreadMessageId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          className={`app${isMobile ? " app--mobile" : ""}${
            isMobile && isSidebarOpen ? " app--sidebar-open" : ""
          }${isMobile && selectedThreadMessage ? " app--thread-open" : ""}`}
        >
          <SlackSidebar
            activeChannelId={activeChannelId}
            onSelectChannel={handleSelectChannel}
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
          {selectedThreadMessage && (
            <SlackThreadPanel
              channel={activeChannel}
              message={selectedThreadMessage}
              onClose={() => setSelectedThreadMessageId(null)}
              onAddReply={(content, imageData) =>
                handleAddThreadReply(selectedThreadMessage.id, content, imageData)
              }
            />
          )}
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
