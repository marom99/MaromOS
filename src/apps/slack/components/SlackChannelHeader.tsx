import {
  CaretDown,
  Hash,
  Headphones,
  LockSimple,
  PushPin,
  SidebarSimple,
  UsersThree,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SlackChannel } from "../types";

interface SlackChannelHeaderProps {
  channel: SlackChannel;
  isDetailsOpen: boolean;
  onToggleDetails: () => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export function SlackChannelHeader({
  channel,
  isDetailsOpen,
  onToggleDetails,
  onToggleSidebar,
  showSidebarToggle,
}: SlackChannelHeaderProps) {
  const memberCount = channel.members.length;
  const isLocked = channel.status === "locked";

  return (
    <header className="slack-channel-header">
      <div className="slack-channel-header-left">
        {showSidebarToggle && onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="slack-icon-button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <SidebarSimple size={14} weight="bold" />
          </Button>
        )}
        <div className="slack-channel-heading">
          <span className="slack-channel-icon" aria-hidden="true">
            {isLocked ? <LockSimple size={14} weight="bold" /> : <Hash size={14} weight="bold" />}
          </span>
          <span className="slack-channel-title">{channel.name}</span>
          <CaretDown size={11} weight="bold" className="slack-channel-caret" />
        </div>
        <div className="slack-channel-topic">
          <span className="slack-channel-topic-text">{channel.topic}</span>
        </div>
      </div>

      <div className="slack-channel-header-right">
        <div className="slack-member-pills" aria-label={`${memberCount} members`}>
          <UsersThree size={13} weight="bold" />
          <span>{memberCount}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="slack-icon-button"
          aria-label="Pinned items"
        >
          <PushPin size={14} weight="bold" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="slack-icon-button"
          aria-label="Channel call"
          disabled
        >
          <Headphones size={14} weight="bold" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("slack-icon-button", isDetailsOpen && "is-active")}
          onClick={onToggleDetails}
          aria-label={isDetailsOpen ? "Hide details" : "Show details"}
          aria-pressed={isDetailsOpen}
        >
          <SidebarSimple size={14} weight="bold" />
        </Button>
      </div>
    </header>
  );
}
