import { useState } from "react";
import {
  FileText,
  FigmaLogo,
  Image as ImageIcon,
  Info,
  Paperclip,
  PushPin,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SlackAttachment,
  SlackChannel,
  SlackMember,
  SlackMessage,
} from "../types";
import { getMemberById } from "../data/caseStudies";

interface SlackDetailsPanelProps {
  channel: SlackChannel;
  onClose?: () => void;
  variant: "panel" | "overlay";
}

type DetailsTab = "about" | "members" | "files";

export function SlackDetailsPanel({
  channel,
  onClose,
  variant,
}: SlackDetailsPanelProps) {
  const [tab, setTab] = useState<DetailsTab>("about");
  const pinnedMessages = channel.messages.filter((m) => m.pinned);
  const attachments = collectAttachments(channel.messages);

  return (
    <aside
      className={cn(
        "slack-details",
        variant === "overlay" && "slack-details--overlay"
      )}
      aria-label="Channel details"
    >
      <header className="slack-details-head">
        <div className="slack-details-titlebar">
          <strong>Details</strong>
          <span className="slack-details-channel">#{channel.name}</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="slack-icon-button"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={14} weight="bold" />
          </Button>
        )}
      </header>

      <nav className="slack-details-tabs" role="tablist">
        <DetailsTabButton
          active={tab === "about"}
          onClick={() => setTab("about")}
          icon={<Info size={12} weight="bold" />}
          label="About"
        />
        <DetailsTabButton
          active={tab === "members"}
          onClick={() => setTab("members")}
          icon={<UsersThree size={12} weight="bold" />}
          label={`Members (${channel.members.length})`}
        />
        <DetailsTabButton
          active={tab === "files"}
          onClick={() => setTab("files")}
          icon={<Paperclip size={12} weight="bold" />}
          label={`Files (${attachments.length})`}
        />
      </nav>

      <div className="slack-details-body">
        {tab === "about" && (
          <AboutTab channel={channel} pinnedCount={pinnedMessages.length} />
        )}
        {tab === "members" && <MembersTab members={channel.members} />}
        {tab === "files" && (
          <FilesTab attachments={attachments} channel={channel} />
        )}
      </div>
    </aside>
  );
}

function DetailsTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn("slack-details-tab", active && "is-active")}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function AboutTab({
  channel,
  pinnedCount,
}: {
  channel: SlackChannel;
  pinnedCount: number;
}) {
  return (
    <div className="slack-details-section-stack">
      <section className="slack-details-card">
        <h3>{channel.pinnedSummary.title}</h3>
        <p className="slack-details-tldr">{channel.pinnedSummary.tldr}</p>
        <div className="slack-metrics-grid">
          {channel.pinnedSummary.metrics.map((metric) => (
            <div className="slack-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="slack-details-card">
        <h3 className="slack-details-card-head">
          <PushPin size={13} weight="bold" />
          Pinned
          <span className="slack-details-pill">{pinnedCount}</span>
        </h3>
        {pinnedCount === 0 ? (
          <p className="slack-details-muted">
            No pinned messages yet — pinned summaries land here as the case
            study fills in.
          </p>
        ) : (
          <ul className="slack-details-pinned-list">
            {channel.messages
              .filter((m) => m.pinned)
              .map((message) => {
                const author = getMemberById(channel, message.authorId);
                return (
                  <li key={message.id}>
                    <strong>{author?.name ?? message.authorId}</strong>
                    <p>{message.body}</p>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      <section className="slack-details-card">
        <h3 className="slack-details-card-head">
          <Info size={13} weight="bold" />
          Description
        </h3>
        <p className="slack-details-muted">{channel.description}</p>
      </section>
    </div>
  );
}

function MembersTab({ members }: { members: SlackMember[] }) {
  return (
    <ul className="slack-members-list">
      {members.map((member) => (
        <li key={member.id} className="slack-member-row">
          <span
            className="slack-avatar slack-avatar--small"
            style={{ backgroundColor: member.color }}
            aria-hidden="true"
          >
            {member.initials}
            <span
              className={cn(
                "slack-presence-indicator",
                member.presence === "active" && "is-active"
              )}
              aria-hidden="true"
            />
          </span>
          <div className="slack-member-meta">
            <strong>
              {member.name}
              {member.statusEmoji && (
                <span className="slack-status-emoji" aria-hidden="true">
                  {member.statusEmoji}
                </span>
              )}
            </strong>
            <span>{member.title}</span>
            {member.statusText && (
              <span className="slack-member-status">{member.statusText}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

interface FileEntry {
  attachment: SlackAttachment;
  authorId: string;
  ts: string;
}

function collectAttachments(messages: SlackMessage[]): FileEntry[] {
  const entries: FileEntry[] = [];
  for (const message of messages) {
    if (!message.attachments) continue;
    for (const attachment of message.attachments) {
      entries.push({
        attachment,
        authorId: message.authorId,
        ts: message.ts,
      });
    }
  }
  return entries;
}

function FilesTab({
  attachments,
  channel,
}: {
  attachments: FileEntry[];
  channel: SlackChannel;
}) {
  if (attachments.length === 0) {
    return (
      <p className="slack-details-muted">
        Files shared in this channel will show here.
      </p>
    );
  }

  return (
    <ul className="slack-files-list">
      {attachments.map((entry) => {
        const author = getMemberById(channel, entry.authorId);
        return (
          <li key={entry.attachment.id} className="slack-file-row">
            <span className="slack-file-icon" aria-hidden="true">
              {entry.attachment.kind === "image" ? (
                <ImageIcon size={16} weight="bold" />
              ) : entry.attachment.kind === "figma" ? (
                <FigmaLogo size={16} weight="fill" />
              ) : (
                <FileText size={16} weight="bold" />
              )}
            </span>
            <div className="slack-file-meta">
              <strong>
                {entry.attachment.fileName ??
                  entry.attachment.caption ??
                  "Attachment"}
              </strong>
              <span>
                {author?.name ?? entry.authorId} · {entry.ts}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
