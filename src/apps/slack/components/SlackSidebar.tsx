import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ChatCircleDots,
  At,
  Bookmark,
  NotePencil,
  DotsThree,
  UserCirclePlus,
} from "@phosphor-icons/react";
import wsIcon from "../assets/workspace-icon.png";
import dmAvatar from "../assets/dm-avatar.png";
import { slackChannels, type SlackChannelId } from "../data/channelContent";

interface SlackSidebarProps {
  activeChannelId: SlackChannelId;
  onSelectChannel: (channelId: SlackChannelId) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

const directMessages = [
  "Jordan Ellis",
  "Taylor Kim",
  "Casey Park",
  "Morgan Liu",
];

function SidebarCollapseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18m7-6-3-3 3-3" />
    </svg>
  );
}

function SidebarExpandIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18m5-12 3 3-3 3" />
    </svg>
  );
}

export function SlackSidebar({
  activeChannelId,
  onSelectChannel,
  isCollapsed,
  onToggleCollapsed,
}: SlackSidebarProps) {
  return (
    <aside
      className="sidebar"
      aria-label={isCollapsed ? "Slack workspace navigation, collapsed" : "Slack workspace navigation"}
    >
      <div className="ws-head">
        <div className="ws-icon" title="Studio Workspace">
          <img src={wsIcon} alt="Workspace icon" />
        </div>
        <div className="ws-meta">
          <div className="ws-name">
            Studio Workspace{" "}
            <svg viewBox="0 0 8 5">
              <path d="M0 0l4 5 4-5z" />
            </svg>
          </div>
          <div className="ws-status">
            <span className="ws-dot"></span> Active
          </div>
        </div>
        <button
          type="button"
          className="sidebar-collapse"
          onClick={onToggleCollapsed}
          aria-label={isCollapsed ? "Show full sidebar" : "Show icon-only sidebar"}
          aria-pressed={isCollapsed}
          title={isCollapsed ? "Show full sidebar" : "Show icon-only sidebar"}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isCollapsed ? "expand" : "collapse"}
              className="sidebar-collapse-icon"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {isCollapsed ? (
                <SidebarExpandIcon />
              ) : (
                <SidebarCollapseIcon />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <nav className="nav">
        <div className="nav-item" title="Threads">
          <ChatCircleDots size={16} weight="regular" />
          <span>Threads</span>
        </div>
        <div className="nav-item" title="Mentions">
          <At size={16} weight="regular" />
          <span>Mentions</span>
        </div>
        <div className="nav-item" title="Bookmarks">
          <Bookmark size={16} weight="regular" />
          <span>Bookmarks</span>
        </div>
        <div className="nav-item" title="Drafts">
          <NotePencil size={16} weight="regular" />
          <span>Drafts</span>
        </div>
        <div className="nav-item" title="More">
          <DotsThree size={16} weight="bold" />
          <span>More</span>
        </div>
      </nav>

      <div className="section">
        <div className="section-head">
          <div className="section-title">Channels</div>
        </div>
        <div className="list">
          {slackChannels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className={`channel${channel.id === activeChannelId ? " active" : ""}`}
              onClick={() => onSelectChannel(channel.id)}
              aria-pressed={channel.id === activeChannelId}
              aria-label={`Open #${channel.name}`}
              title={`# ${channel.name}`}
            >
              <span className="hash" aria-hidden="true">#</span>
              <span className="channel-name">{channel.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <div className="section-title">Direct Messages</div>
        </div>
        <div className="dm-list">
          {directMessages.map((name) => (
            <div className="dm" key={name} title={name} aria-label={name}>
              <div className="dm-avatar">
                <img src={dmAvatar} alt={name} />
                <div className="presence"></div>
              </div>
              <div className="dm-name">{name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="invite" title="Invite People">
        <UserCirclePlus size={16} weight="regular" />
        <span>Invite People</span>
      </div>
    </aside>
  );
}
