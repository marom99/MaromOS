import { MessageBubble } from "@/components/shared/MessageBubble";
import { ImageAttachment } from "@/components/shared/ImageAttachment";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { CaretDown, Plus } from "@phosphor-icons/react";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  SlackChannelContent,
  SlackChannelId,
  SlackChannelPreviewItem,
  SlackMessageItem,
} from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🙏", "👀"];

interface SlackMessagesProps {
  channel: SlackChannelContent;
  selectedThreadMessageId?: string | null;
  onOpenThread: (messageId: string | null) => void;
  onMessagesChange: (
    updater: (messages: SlackMessageItem[]) => SlackMessageItem[]
  ) => void;
  onSelectChannel?: (channelId: SlackChannelId) => void;
}

interface SlackMessageRowProps {
  message: SlackMessageItem;
  isThreadSelected: boolean;
  onOpenThread: (messageId: string | null) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onSelectChannel?: (channelId: SlackChannelId) => void;
}

function ChannelPreviewCard({
  preview,
  onSelectChannel,
}: {
  preview: SlackChannelPreviewItem;
  onSelectChannel?: (channelId: SlackChannelId) => void;
}) {
  const content = (
    <>
      <span className="channel-preview-image-wrap">
        <img
          src={preview.imageSrc}
          alt={preview.imageAlt}
          className="channel-preview-image"
        />
      </span>
      <span className="channel-preview-meta">
        <span className="channel-preview-name">#{preview.name}</span>
        <span className="channel-preview-description">{preview.description}</span>
      </span>
    </>
  );

  if (!onSelectChannel) {
    return (
      <div className="channel-preview-card" aria-label={`#${preview.name}`}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="channel-preview-card"
      onClick={() => onSelectChannel(preview.channelId)}
      aria-label={`Open #${preview.name}`}
    >
      {content}
    </button>
  );
}

const SlackMessageRow = memo(function SlackMessageRow({
  message,
  isThreadSelected,
  onOpenThread,
  onToggleReaction,
  onSelectChannel,
}: SlackMessageRowProps) {
  const channelPreview = message.channelPreview;

  return (
    <div className="msg group" data-self={message.isSelf ? "true" : undefined}>
      <div className="avatar">
        <ProfileAvatar
          picture={SLACK_PROFILE_PICTURES[message.avatarIndex ?? 0]}
          fallback={getSlackInitials(message.user)}
          label={message.user}
          className="w-full h-full"
        />
      </div>
      <div className="msg-body">
        <div className="msg-head">
          <div className="msg-name">{message.user}</div>
          <div className="msg-time">{message.time}</div>
        </div>
        <MessageBubble
          colorClass={message.isSelf ? "bg-blue-100 text-black" : "bg-gray-100 text-black"}
          className="mt-1"
        >
          {message.content}
        </MessageBubble>
        {message.hasImage && (
          <div className="msg-attachment mt-2 mb-1">
            <ImageAttachment
              src={message.imageSrc ?? ""}
              alt={message.imageAlt ?? "attachment"}
              enablePreview
              previewTitle={message.imageAlt ?? "Image preview"}
            />
          </div>
        )}
        {channelPreview && (
          <ChannelPreviewCard
            preview={channelPreview}
            onSelectChannel={onSelectChannel}
          />
        )}
        <div
          className="reactions"
          data-empty={message.reactions.length === 0 ? "true" : undefined}
        >
          {message.reactions.map((reaction) => (
            <button
              type="button"
              key={reaction.emoji}
              onClick={() => onToggleReaction(message.id, reaction.emoji)}
              aria-label={`${reaction.hasReacted ? "Remove" : "Add"} ${reaction.emoji} reaction, ${reaction.count} ${reaction.count === 1 ? "person" : "people"}`}
              className={cn(
                "react transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]",
                reaction.hasReacted ? "react-active" : "react-idle"
              )}
            >
              <span>{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`Add reaction to ${message.user}'s message`}
                className="react add transition-[transform,opacity,border-color] duration-150 ease-out hover:scale-[1.05] active:scale-[0.97]"
              >
                <Plus size={12} weight="bold" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-1.5 bg-[#f8f8f8] shadow-[0_3px_12px_rgba(0,0,0,0.3)] border-[0.5px] border-black/20 rounded-[8px] overflow-hidden duration-200 data-[state=open]:ease-[cubic-bezier(0.23,1,0.32,1)]"
              sideOffset={6}
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_1.5px,black_1.5px,black_2px)]" />

              <div className="flex gap-1 relative z-10">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => onToggleReaction(message.id, emoji)}
                    aria-label={`React with ${emoji}`}
                    className="p-1.5 hover:bg-[#2765ca] hover:text-white rounded-[4px] text-lg transition-[transform,background-color,color] duration-150 ease-out hover:scale-[1.15] active:scale-[0.97] active:bg-[#1a4b9c]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {message.thread && (
          <button
            type="button"
            className="thread-summary"
            data-active={isThreadSelected ? "true" : undefined}
            onClick={() => onOpenThread(isThreadSelected ? null : message.id)}
            aria-label={`Open thread for ${message.user}'s message, ${message.thread.replyCount} replies`}
          >
            <span className="thread-avatars" aria-hidden="true">
              {message.thread.participantAvatarIndexes.slice(0, 4).map((avatarIndex, index) => (
                <span className="thread-avatar" key={`${message.id}-${avatarIndex}-${index}`}>
                  <ProfileAvatar
                    picture={SLACK_PROFILE_PICTURES[avatarIndex]}
                    fallback=""
                    label=""
                    className="w-full h-full"
                  />
                </span>
              ))}
            </span>
            <span className="thread-count">{message.thread.replyCount} replies</span>
            <span className="thread-last">{message.thread.lastReplyLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
});

export function SlackMessages({
  channel,
  selectedThreadMessageId,
  onOpenThread,
  onMessagesChange,
  onSelectChannel,
}: SlackMessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const previousChannelIdRef = useRef(channel.id);
  const previousMessageCountRef = useRef(channel.messages.length);
  const messages = channel.messages;

  useEffect(() => {
    const channelChanged = previousChannelIdRef.current !== channel.id;
    const messageWasAdded = messages.length > previousMessageCountRef.current;

    if (channelChanged) {
      messagesRef.current?.scrollTo({ top: 0 });
    } else if (messageWasAdded) {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
    }

    previousChannelIdRef.current = channel.id;
    previousMessageCountRef.current = messages.length;
  }, [channel.id, messages.length]);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    onMessagesChange((current) =>
      current.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingIdx = msg.reactions.findIndex((r) => r.emoji === emoji);
        const newReactions = [...msg.reactions];

        if (existingIdx > -1) {
          const reaction = newReactions[existingIdx];
          if (reaction.hasReacted) {
            if (reaction.count === 1) {
              newReactions.splice(existingIdx, 1);
            } else {
              newReactions[existingIdx] = {
                ...reaction,
                count: reaction.count - 1,
                hasReacted: false,
              };
            }
          } else {
            newReactions[existingIdx] = {
              ...reaction,
              count: reaction.count + 1,
              hasReacted: true,
            };
          }
        } else {
          newReactions.push({ emoji, count: 1, hasReacted: true });
        }

        return { ...msg, reactions: newReactions };
      })
    );
  }, [onMessagesChange]);

  return (
    <div ref={messagesRef} className="messages">
      <div className="date-sep">
        <Badge
          variant="outline"
          className="date-pill bg-gradient-to-b from-[#fdfdfd] to-[#eeeeee] border-[#bdbfc3] text-[#555] font-normal h-6 px-3 rounded-full shadow-[0_1px_0_rgba(0,0,0,0.04),inset_0_1px_0_#fff] gap-1.5"
        >
          Today, May 18
          <CaretDown size={10} weight="fill" className="text-[#666]" />
        </Badge>
      </div>

      {messages.map((msg) => (
        <SlackMessageRow
          key={msg.id}
          message={msg}
          isThreadSelected={selectedThreadMessageId === msg.id}
          onOpenThread={onOpenThread}
          onToggleReaction={toggleReaction}
          onSelectChannel={onSelectChannel}
        />
      ))}
    </div>
  );
}
