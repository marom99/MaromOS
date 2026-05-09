import { ChatInput } from "@/apps/chats/components/ChatInput";
import { MessageBubble } from "@/components/shared/MessageBubble";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { SlackChannelContent, SlackMessageItem } from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";

interface SlackThreadPanelProps {
  channel: SlackChannelContent;
  message: SlackMessageItem;
  onClose: () => void;
  onAddReply: (content: string) => void;
}

export function SlackThreadPanel({ channel, message, onClose, onAddReply }: SlackThreadPanelProps) {
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [message.thread?.replies.length]);

  if (!message.thread) return null;

  const handleSubmit = () => {
    const trimmedReply = replyText.trim();
    if (!trimmedReply) return;

    onAddReply(trimmedReply);
    setReplyText("");
  };

  return (
    <aside className="thread-panel" aria-label={`Thread for ${message.user}'s message`}>
      <header className="thread-panel-head">
        <div>
          <div className="thread-panel-title">Thread</div>
          <div className="thread-panel-channel"># {channel.name}</div>
        </div>
        <button
          type="button"
          className="thread-close"
          onClick={onClose}
          aria-label="Close thread"
        >
          <X size={14} weight="bold" />
        </button>
      </header>

      <div ref={scrollRef} className="thread-panel-scroll">
        <ThreadMessage message={message} isParent />

        <div className="thread-reply-sep">
          <span>{message.thread.replyCount} replies</span>
        </div>

        {message.thread.replies.map((reply) => (
          <ThreadMessage key={reply.id} message={reply} />
        ))}
      </div>

      <div className="thread-composer" aria-label="Thread reply composer">
        <ChatInput
          input={replyText}
          isLoading={false}
          isForeground
          onInputChange={(event) => setReplyText(event.target.value)}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          onStop={() => {}}
          showNudgeButton={false}
          placeholderOverride="Reply to thread..."
        />
      </div>
    </aside>
  );
}

function ThreadMessage({
  message,
  isParent,
}: {
  message: Pick<SlackMessageItem, "user" | "time" | "content" | "avatarIndex" | "isSelf">;
  isParent?: boolean;
}) {
  const isSelf = message.isSelf || message.user === "You";

  return (
    <article
      className="thread-message"
      data-parent={isParent ? "true" : undefined}
      data-self={isSelf ? "true" : undefined}
    >
      <div className="thread-message-avatar">
        <ProfileAvatar
          picture={SLACK_PROFILE_PICTURES[message.avatarIndex ?? 0]}
          fallback={getSlackInitials(message.user)}
          label={message.user}
          className="w-full h-full"
        />
      </div>
      <div className="thread-message-body">
        <div className="msg-head">
          <div className="msg-name">{message.user}</div>
          <div className="msg-time">{message.time}</div>
        </div>
        <MessageBubble
          colorClass={isSelf ? "bg-blue-100 text-black" : "bg-gray-100 text-black"}
          className="mt-1"
        >
          {message.content}
        </MessageBubble>
      </div>
    </article>
  );
}
