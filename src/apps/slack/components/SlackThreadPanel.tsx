import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SlackChannel, SlackThreadReply } from "../types";
import { getMemberById } from "../data/caseStudies";
import { SlackReactionRow } from "./SlackReactionRow";
import { SlackGifMessage } from "./SlackGifMessage";
import { SlackMessageRow } from "./SlackMessage";

interface SlackThreadPanelProps {
  channel: SlackChannel;
  messageId: string;
  onClose: () => void;
  variant: "overlay" | "takeover";
}

export function SlackThreadPanel({
  channel,
  messageId,
  onClose,
  variant,
}: SlackThreadPanelProps) {
  const parent = channel.messages.find((m) => m.id === messageId);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!parent) return null;

  return (
    <aside
      className={cn(
        "slack-thread-panel",
        variant === "overlay" ? "slack-thread-panel--overlay" : "slack-thread-panel--takeover"
      )}
      aria-label="Thread"
    >
      <header className="slack-thread-panel-head">
        <div className="slack-thread-panel-title">
          <strong>Thread</strong>
          <span>#{channel.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="slack-thread-close"
          onClick={onClose}
          aria-label="Close thread"
        >
          <X size={14} weight="bold" />
        </Button>
      </header>

      <div className="slack-thread-panel-body">
        <SlackMessageRow channel={channel} message={parent} />

        <div className="slack-thread-divider">
          <span>
            {parent.thread?.length ?? 0}{" "}
            {(parent.thread?.length ?? 0) === 1 ? "reply" : "replies"}
          </span>
        </div>

        <div className="slack-thread-replies">
          {parent.thread?.map((reply) => (
            <ThreadReplyRow key={reply.id} reply={reply} channel={channel} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function ThreadReplyRow({
  reply,
  channel,
}: {
  reply: SlackThreadReply;
  channel: SlackChannel;
}) {
  const author = getMemberById(channel, reply.authorId);
  return (
    <article className="slack-message slack-message--reply">
      <div
        className="slack-avatar"
        style={{ backgroundColor: author?.color ?? "#666" }}
        aria-hidden="true"
      >
        {author?.initials ?? reply.authorId.slice(0, 1).toUpperCase()}
      </div>
      <div className="slack-message-body">
        <header className="slack-message-header">
          <span className="slack-author">{author?.name ?? reply.authorId}</span>
          {author?.title && <span className="slack-role">{author.title}</span>}
          <time className="slack-time">{reply.ts}</time>
        </header>
        <p className="slack-message-text">{reply.body}</p>
        {reply.gif && <SlackGifMessage gif={reply.gif} />}
        {reply.reactions && (
          <SlackReactionRow messageId={reply.id} reactions={reply.reactions} />
        )}
      </div>
    </article>
  );
}
