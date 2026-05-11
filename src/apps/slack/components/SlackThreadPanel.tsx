import { ChatInput } from "@/apps/chats/components/ChatInput";
import { ImageAttachment } from "@/components/shared/ImageAttachment";
import { MessageBubble } from "@/components/shared/MessageBubble";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { X } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SlackChannelContent, SlackMessageItem } from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";

interface SlackThreadPanelProps {
  channel: SlackChannelContent;
  message: SlackMessageItem;
  onClose: () => void;
  onAddReply: (content: string, imageData?: string | null) => boolean;
  onResizeStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onResizeReset?: () => void;
}

export function SlackThreadPanel({ channel, message, onClose, onAddReply, onResizeStart, onResizeReset }: SlackThreadPanelProps) {
  const [replyText, setReplyText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Scroll to bottom when new replies are added.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [message.thread?.replies.length]);

  if (!message.thread) return null;

  const handleSubmit = () => {
    const trimmedReply = replyText.trim();
    if (!trimmedReply && !selectedImage) return;

    if (onAddReply(trimmedReply, selectedImage)) {
      setReplyText("");
      setSelectedImage(null);
    }
  };

  return (
    <aside className="thread-panel" aria-label={`Thread for ${message.user}'s message`}>
      {onResizeStart && (
        <div
          className="thread-panel-resize-handle"
          onPointerDown={onResizeStart}
          onDoubleClick={onResizeReset}
        />
      )}
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
        <div ref={bottomRef} aria-hidden="true" />
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
          onDirectMessageSubmit={(content) => {
            if (onAddReply(content, selectedImage)) {
              setReplyText("");
              setSelectedImage(null);
            }
          }}
          showNudgeButton={false}
          selectedImage={selectedImage}
          onImageChange={setSelectedImage}
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
  message: Pick<
    SlackMessageItem,
    "user" | "time" | "content" | "avatarIndex" | "isSelf" | "hasImage" | "imageSrc" | "imageAlt"
  >;
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
        {message.hasImage && (
          <div className="msg-attachment mt-2 mb-1">
            <ImageAttachment
              src={message.imageSrc ?? ""}
              alt={message.imageAlt ?? "attachment"}
            />
          </div>
        )}
      </div>
    </article>
  );
}
