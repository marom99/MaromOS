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
import {
  getSlackChannel,
  slackChannels,
  type SlackChannelId,
  type SlackMessageItem,
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

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<SlackChannelId>("design-lab");
  const [channelMessages, setChannelMessages] = useState(createInitialChannelMessages);

  if (!isWindowOpen) return null;

  const baseActiveChannel = getSlackChannel(activeChannelId);
  const activeChannel = {
    ...baseActiveChannel,
    messages: channelMessages[activeChannelId] ?? baseActiveChannel.messages,
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
            onSelectChannel={setActiveChannelId}
          />
          <main className="main">
            <SlackChannelHeader channel={activeChannel} />
            <SlackMessages
              channel={activeChannel}
              onMessagesChange={updateChannelMessages}
            />
            <SlackComposer
              isForeground={!!isForeground}
              onSendMessage={handleSendMessage}
            />
          </main>
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
