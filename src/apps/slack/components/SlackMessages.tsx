import { MessageBubble } from "@/components/shared/MessageBubble";
import { ImageAttachment } from "@/components/shared/ImageAttachment";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { CaretDown, Plus } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SlackChannelContent, SlackMessageItem } from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🙏", "👀"];

interface SlackMessagesProps {
  channel: SlackChannelContent;
  selectedThreadMessageId?: string | null;
  onOpenThread: (messageId: string) => void;
  onMessagesChange: (
    updater: (messages: SlackMessageItem[]) => SlackMessageItem[]
  ) => void;
}

export function SlackMessages({
  channel,
  selectedThreadMessageId,
  onOpenThread,
  onMessagesChange,
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

  const toggleReaction = (messageId: string, emoji: string) => {
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
  };

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
        <div key={msg.id} className="msg group" data-self={msg.isSelf ? "true" : undefined}>
          <div className="avatar">
            <ProfileAvatar
              picture={SLACK_PROFILE_PICTURES[msg.avatarIndex ?? 0]}
              fallback={getSlackInitials(msg.user)}
              label={msg.user}
              className="w-full h-full"
            />
          </div>
          <div className="msg-body">
            <div className="msg-head">
              <div className="msg-name">{msg.user}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
            <MessageBubble
              colorClass={msg.isSelf ? "bg-blue-100 text-black" : "bg-gray-100 text-black"}
              className="mt-1"
            >
              {msg.content}
            </MessageBubble>
            {msg.hasImage && (
              <div className="msg-attachment mt-2 mb-1">
                <ImageAttachment
                  src={msg.imageSrc ?? ""}
                  alt={msg.imageAlt ?? "attachment"}
                />
              </div>
            )}
            <div
              className="reactions"
              data-empty={msg.reactions.length === 0 ? "true" : undefined}
            >
              {msg.reactions.map((r) => (
                <button
                  type="button"
                  key={r.emoji}
                  onClick={() => toggleReaction(msg.id, r.emoji)}
                  aria-label={`${r.hasReacted ? "Remove" : "Add"} ${r.emoji} reaction, ${r.count} ${r.count === 1 ? "person" : "people"}`}
                  className={cn(
                    "react transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]",
                    r.hasReacted
                      ? "react-active"
                      : "react-idle"
                  )}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              ))}

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Add reaction to ${msg.user}'s message`}
                    className="react add transition-[transform,opacity,border-color] duration-150 ease-out hover:scale-[1.05] active:scale-[0.97]"
                  >
                    <Plus size={12} weight="bold" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-1.5 bg-[#f8f8f8] shadow-[0_3px_12px_rgba(0,0,0,0.3)] border-[0.5px] border-black/20 rounded-[8px] overflow-hidden duration-200 data-[state=open]:ease-[cubic-bezier(0.23,1,0.32,1)]"
                  sideOffset={6}
                >
                  {/* Aqua pinstripe texture background effect */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_1.5px,black_1.5px,black_2px)]" />
                  
                  <div className="flex gap-1 relative z-10">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => toggleReaction(msg.id, emoji)}
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
            {msg.thread && (
              <button
                type="button"
                className="thread-summary"
                data-active={selectedThreadMessageId === msg.id ? "true" : undefined}
                onClick={() => onOpenThread(msg.id)}
                aria-label={`Open thread for ${msg.user}'s message, ${msg.thread.replyCount} replies`}
              >
                <span className="thread-avatars" aria-hidden="true">
                  {msg.thread.participantAvatarIndexes.slice(0, 4).map((avatarIndex, index) => (
                    <span className="thread-avatar" key={`${msg.id}-${avatarIndex}-${index}`}>
                      <ProfileAvatar
                        picture={SLACK_PROFILE_PICTURES[avatarIndex]}
                        fallback=""
                        label=""
                        className="w-full h-full"
                      />
                    </span>
                  ))}
                </span>
                <span className="thread-count">{msg.thread.replyCount} replies</span>
                <span className="thread-last">{msg.thread.lastReplyLabel}</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
