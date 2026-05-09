import { useState } from "react";
import { AppProps } from "@/apps/base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { useTranslatedHelpItems } from "@/hooks/useTranslatedHelpItems";
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
  type SlackChannelContent,
  type SlackChannelId,
  type SlackThreadReplyItem,
} from "../data/channelContent";
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

  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = isWindowsTheme(currentTheme);
  const isMacTheme = currentTheme === "macosx";

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<SlackChannelId>("design-lab");
  const [selectedThreadMessageId, setSelectedThreadMessageId] = useState<string | null>(null);
  const [channelOverrides, setChannelOverrides] = useState<Partial<Record<SlackChannelId, SlackChannelContent>>>({});

  if (!isWindowOpen) return null;

  const activeChannel = channelOverrides[activeChannelId] ?? getSlackChannel(activeChannelId);
  const selectedThreadMessage =
    activeChannel.messages.find((message) => message.id === selectedThreadMessageId && message.thread) ??
    null;

  const handleSelectChannel = (channelId: SlackChannelId) => {
    setActiveChannelId(channelId);
    setSelectedThreadMessageId(null);
  };

  const handleAddThreadReply = (messageId: string, content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const newReply: SlackThreadReplyItem = {
      id: `${messageId}-visitor-${Date.now()}`,
      user: "You",
      time: "Just now",
      content: trimmedContent,
      avatarIndex: 3,
      isSelf: true,
    };

    setChannelOverrides((currentOverrides) => {
      const currentChannel = currentOverrides[activeChannelId] ?? getSlackChannel(activeChannelId);

      return {
        ...currentOverrides,
        [activeChannelId]: {
          ...currentChannel,
          messages: currentChannel.messages.map((message) => {
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
        },
      };
    });
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
        <div className="app">
          <SlackSidebar
            activeChannelId={activeChannelId}
            onSelectChannel={handleSelectChannel}
          />
          <main className="main">
            <SlackChannelHeader channel={activeChannel} />
            <SlackMessages
              channel={activeChannel}
              selectedThreadMessageId={selectedThreadMessageId}
              onOpenThread={setSelectedThreadMessageId}
            />
            <SlackComposer channel={activeChannel} />
          </main>
          {selectedThreadMessage && (
            <SlackThreadPanel
              channel={activeChannel}
              message={selectedThreadMessage}
              onClose={() => setSelectedThreadMessageId(null)}
              onAddReply={(content) => handleAddThreadReply(selectedThreadMessage.id, content)}
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
