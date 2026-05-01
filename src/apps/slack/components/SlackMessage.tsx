import { ChatCircle, PushPinSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { SlackChannel, SlackMessage } from "../types";
import { getMemberById } from "../data/caseStudies";
import { SlackReactionRow } from "./SlackReactionRow";
import { SlackAttachmentCard } from "./SlackAttachment";
import { SlackGifMessage } from "./SlackGifMessage";
import { SlackPollCard } from "./SlackPoll";

interface SlackMessageProps {
  channel: SlackChannel;
  message: SlackMessage;
  onOpenThread?: (messageId: string) => void;
  isReader?: boolean;
}

export function SlackMessageRow({
  channel,
  message,
  onOpenThread,
  isReader,
}: SlackMessageProps) {
  const author = getMemberById(channel, message.authorId);
  const initials = author?.initials ?? message.authorId.slice(0, 1).toUpperCase();
  const color = author?.color ?? "#666";
  const displayName = author?.name ?? message.authorId;
  const role = author?.title ?? "";
  const replyCount = message.thread?.length ?? 0;

  return (
    <article
      className={cn(
        "slack-message",
        message.pinned && "is-pinned",
        isReader && "is-reader"
      )}
      data-message-id={message.id}
    >
      <div
        className="slack-avatar"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="slack-message-body">
        <header className="slack-message-header">
          <span className="slack-author">{displayName}</span>
          {role && <span className="slack-role">{role}</span>}
          <time className="slack-time">{message.ts}</time>
          {message.pinned && (
            <span className="slack-pinned-flag" title="Pinned to channel">
              <PushPinSimple size={11} weight="fill" /> Pinned
            </span>
          )}
          {isReader && <span className="slack-reader-flag">Note</span>}
        </header>

        {message.body && <p className="slack-message-text">{message.body}</p>}

        {message.attachments?.map((attachment) => (
          <SlackAttachmentCard key={attachment.id} attachment={attachment} />
        ))}

        {message.gif && <SlackGifMessage gif={message.gif} />}

        {message.poll && <SlackPollCard messageId={message.id} poll={message.poll} />}

        {message.reactions && (
          <SlackReactionRow messageId={message.id} reactions={message.reactions} />
        )}

        {replyCount > 0 && onOpenThread && (
          <button
            type="button"
            className="slack-thread-anchor"
            onClick={() => onOpenThread(message.id)}
          >
            <ChatCircle size={13} weight="bold" />
            <span>
              {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </span>
            <span className="slack-thread-anchor-cta">View thread</span>
          </button>
        )}
      </div>
    </article>
  );
}
