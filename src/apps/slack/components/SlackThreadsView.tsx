import { useRef } from "react";
import { ChatCircleDots } from "@phosphor-icons/react";
import type { SlackChannelId, SlackMessageItem } from "../data/channelContent";
import { getSlackChannel } from "../data/channelContent";

export interface ThreadEntry {
  channelId: SlackChannelId;
  channelName: string;
  message: SlackMessageItem;
}

interface SlackThreadsViewProps {
  threads: ThreadEntry[];
  onOpenThreadMessage: (channelId: SlackChannelId, messageId: string) => void;
}

function threadReplyCount(message: SlackMessageItem): number {
  return message.thread?.replyCount ?? 0;
}

function threadLastReplyLabel(message: SlackMessageItem): string {
  return message.thread?.lastReplyLabel ?? "";
}

export function SlackThreadsView({ threads, onOpenThreadMessage }: SlackThreadsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (threads.length === 0) {
    return (
      <main className="main">
        <header className="main-head">
          <div className="main-head-title">
            <div className="ch-title">Threads</div>
          </div>
        </header>
        <div className="threads-empty">
          <ChatCircleDots size={32} weight="light" />
          <p>No threads involving you yet</p>
          <p className="threads-empty-sub">
            When someone starts or replies to a thread you're part of, it'll appear here.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <header className="main-head">
        <div className="main-head-title">
          <div className="ch-title">Threads</div>
        </div>
      </header>
      <div ref={scrollRef} className="messages">
        <div className="threads-list">
          {threads.map((entry) => {
            const channel = getSlackChannel(entry.channelId);
            const replyCount = threadReplyCount(entry.message);
            const lastReply = threadLastReplyLabel(entry.message);

            return (
              <button
                key={`${entry.channelId}-${entry.message.id}`}
                type="button"
                className="thread-row"
                onClick={() => onOpenThreadMessage(entry.channelId, entry.message.id)}
              >
                <div className="thread-row-channel"># {channel?.name ?? entry.channelId}</div>
                <div className="thread-row-preview">
                  <span className="thread-row-user">{entry.message.user}</span>
                  <span className="thread-row-content">{entry.message.content}</span>
                </div>
                <div className="thread-row-meta">
                  {replyCount > 0 && (
                    <span className="thread-row-replies">
                      {replyCount} {replyCount === 1 ? "reply" : "replies"}
                    </span>
                  )}
                  {lastReply && <span className="thread-row-last">{lastReply}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
