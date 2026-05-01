import {
  AlignLeft,
  Bell,
  CaretDown,
  ChatCircle,
  Hash,
  House,
  LockSimple,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { SlackChannel } from "../types";
import { useSlackStore } from "@/stores/useSlackStore";

interface SlackSidebarProps {
  channels: SlackChannel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

export function SlackSidebar({
  channels,
  activeChannelId,
  onSelectChannel,
}: SlackSidebarProps) {
  const unreadCounts = useSlackStore((state) => state.unreadCounts);
  const liveChannels = channels.filter((c) => c.status === "live");
  const lockedChannels = channels.filter((c) => c.status === "locked");

  return (
    <aside className="slack-sidebar" aria-label="Slack channels">
      <div className="slack-workspace-header">
        <div className="slack-workspace-row">
          <button type="button" className="slack-workspace-button">
            <span className="slack-workspace-name">Marom Studio</span>
            <CaretDown size={11} weight="bold" />
          </button>
          <button type="button" className="slack-workspace-action" aria-label="New message">
            <Plus size={12} weight="bold" />
          </button>
        </div>
        <div className="slack-workspace-presence">
          <span className="slack-presence-dot" aria-hidden="true" /> active
        </div>
      </div>

      <nav className="slack-sidebar-nav" aria-label="Workspace shortcuts">
        <button type="button" className="slack-sidebar-nav-item">
          <House size={13} weight="bold" />
          <span>Home</span>
        </button>
        <button type="button" className="slack-sidebar-nav-item">
          <ChatCircle size={13} weight="bold" />
          <span>Threads</span>
        </button>
        <button type="button" className="slack-sidebar-nav-item">
          <AlignLeft size={13} weight="bold" />
          <span>All DMs</span>
        </button>
        <button type="button" className="slack-sidebar-nav-item">
          <Bell size={13} weight="bold" />
          <span>Activity</span>
        </button>
        <button type="button" className="slack-sidebar-nav-item">
          <MagnifyingGlass size={13} weight="bold" />
          <span>Search</span>
        </button>
      </nav>

      <div className="slack-sidebar-section">
        <div className="slack-sidebar-section-head">
          <CaretDown size={11} weight="bold" />
          <span>Channels</span>
        </div>
        <ul className="slack-channel-list">
          {liveChannels.map((channel) => {
            const unread = unreadCounts[channel.id] ?? 0;
            const active = channel.id === activeChannelId;
            return (
              <li key={channel.id}>
                <button
                  type="button"
                  className={cn(
                    "slack-channel-row",
                    active && "is-active",
                    unread > 0 && !active && "has-unread"
                  )}
                  onClick={() => onSelectChannel(channel.id)}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="slack-channel-row-icon" aria-hidden="true">
                    <Hash size={12} weight="bold" />
                  </span>
                  <span className="slack-channel-row-name">{channel.name}</span>
                  {unread > 0 && (
                    <span className="slack-channel-row-badge">{unread}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {lockedChannels.length > 0 && (
        <div className="slack-sidebar-section">
          <div className="slack-sidebar-section-head">
            <CaretDown size={11} weight="bold" />
            <span>Coming soon</span>
          </div>
          <ul className="slack-channel-list">
            {lockedChannels.map((channel) => {
              const active = channel.id === activeChannelId;
              return (
                <li key={channel.id}>
                  <button
                    type="button"
                    className={cn(
                      "slack-channel-row",
                      "is-locked",
                      active && "is-active"
                    )}
                    onClick={() => onSelectChannel(channel.id)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="slack-channel-row-icon" aria-hidden="true">
                      <LockSimple size={11} weight="bold" />
                    </span>
                    <span className="slack-channel-row-name">{channel.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="slack-sidebar-footer">
        <button type="button" className="slack-sidebar-footer-btn">
          <Plus size={12} weight="bold" />
          <span>Add channel</span>
        </button>
      </div>
    </aside>
  );
}
