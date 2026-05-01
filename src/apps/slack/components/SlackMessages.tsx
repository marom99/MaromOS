import { useEffect, useRef } from "react";
import type { SlackChannel } from "../types";
import { SlackMessageRow } from "./SlackMessage";
import { useSlackStore, type ReaderNote } from "@/stores/useSlackStore";

const EMPTY_READER_NOTES: ReaderNote[] = [];

interface SlackMessagesProps {
  channel: SlackChannel;
  onOpenThread: (messageId: string) => void;
  fontSize: number;
}

function formatNoteTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "just now";
  }
}

export function SlackMessages({
  channel,
  onOpenThread,
  fontSize,
}: SlackMessagesProps) {
  const readerNotes: ReaderNote[] = useSlackStore(
    (state) => state.readerNotes[channel.id] ?? EMPTY_READER_NOTES
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const previousChannelIdRef = useRef(channel.id);
  const previousNoteCountRef = useRef(readerNotes.length);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    if (previousChannelIdRef.current !== channel.id) {
      node.scrollTop = 0;
      previousChannelIdRef.current = channel.id;
      previousNoteCountRef.current = readerNotes.length;
      return;
    }
  }, [channel.id, readerNotes.length]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    if (readerNotes.length > previousNoteCountRef.current) {
      node.scrollTop = node.scrollHeight;
    }
    previousNoteCountRef.current = readerNotes.length;
  }, [readerNotes.length]);

  if (channel.status === "locked") {
    return (
      <div className="slack-messages slack-messages--empty">
        <div className="slack-empty-card" role="status">
          <div className="slack-empty-emoji" aria-hidden="true">
            🔒
          </div>
          <h3>{channel.pinnedSummary.title}</h3>
          <p>{channel.pinnedSummary.tldr}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="slack-messages"
      style={{ fontSize: `${fontSize}px` }}
      aria-label={`Messages in #${channel.name}`}
    >
      <div className="slack-messages-intro">
        <div className="slack-channel-marker">
          <span className="slack-channel-marker-emoji">{channel.emoji ?? "👋"}</span>
          <h2>#{channel.name}</h2>
          <p>{channel.description}</p>
        </div>
      </div>

      <section className="slack-case-summary" aria-label="Case summary">
        <div className="slack-case-summary-head">
          <span className="slack-case-summary-kicker">Case summary</span>
          <h3>{channel.pinnedSummary.title}</h3>
        </div>
        <p className="slack-case-summary-tldr">{channel.pinnedSummary.tldr}</p>
        <div className="slack-case-summary-metrics">
          {channel.pinnedSummary.metrics.map((metric) => (
            <div className="slack-case-summary-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      {channel.messages.map((message) => (
        <SlackMessageRow
          key={message.id}
          channel={channel}
          message={message}
          onOpenThread={onOpenThread}
        />
      ))}

      {readerNotes.length > 0 && (
        <>
          <div className="slack-day-divider">
            <span>Your notes</span>
          </div>
          {readerNotes.map((note) => (
            <SlackMessageRow
              key={note.id}
              channel={channel}
              message={{
                id: note.id,
                authorId: "you",
                ts: formatNoteTime(note.ts),
                body: note.body,
              }}
              isReader
            />
          ))}
        </>
      )}
    </div>
  );
}
