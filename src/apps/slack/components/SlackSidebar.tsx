import {
  ChatCircleDots,
  At,
  Bookmark,
} from "@phosphor-icons/react";
import wsIcon from "../assets/workspace-icon.png";
import dmAvatar from "../assets/dm-avatar.png";
import { slackChannels, type SlackChannelId } from "../data/channelContent";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SlackSidebarProps {
  activeChannelId: SlackChannelId;
  onSelectChannel: (channelId: SlackChannelId) => void;
  isCollapsed: boolean;
}

const directMessages = [
  "Marom",
];

const NAV_ITEMS = [
  { icon: <ChatCircleDots size={16} weight="regular" />, label: "Threads" },
  { icon: <At size={16} weight="regular" />, label: "Mentions" },
  { icon: <Bookmark size={16} weight="regular" />, label: "Bookmarks" },
];

export function SlackSidebar({
  activeChannelId,
  onSelectChannel,
  isCollapsed,
}: SlackSidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className="sidebar"
        aria-label={isCollapsed ? "Slack workspace navigation, collapsed" : "Slack workspace navigation"}
      >
        <div className="ws-head">
          <Tooltip open={isCollapsed ? undefined : false}>
            <TooltipTrigger asChild>
              <div className="ws-icon" aria-label="Studio Workspace">
                <img src={wsIcon} alt="Workspace icon" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Studio Workspace</TooltipContent>
          </Tooltip>
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
        </div>

        <nav className="nav">
          {NAV_ITEMS.map(({ icon, label }) => (
            <Tooltip key={label} open={isCollapsed ? undefined : false}>
              <TooltipTrigger asChild>
                <div className="nav-item" aria-label={label}>
                  {icon}
                  <span>{label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="section">
          <div className="section-head">
            <div className="section-title">Channels</div>
          </div>
          <div className="list">
            {slackChannels.map((channel) => (
              <Tooltip key={channel.id} open={isCollapsed ? undefined : false}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`channel${channel.id === activeChannelId ? " active" : ""}`}
                    onClick={() => onSelectChannel(channel.id)}
                    aria-pressed={channel.id === activeChannelId}
                    aria-label={`Open #${channel.name}`}
                  >
                    <span className="hash" aria-hidden="true">#</span>
                    <span className="channel-name">{channel.name}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right"># {channel.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <div className="section-title">Direct Messages</div>
          </div>
          <div className="dm-list">
            {directMessages.map((name) => (
              <Tooltip key={name} open={isCollapsed ? undefined : false}>
                <TooltipTrigger asChild>
                  <div className="dm" aria-label={name}>
                    <div className="dm-avatar">
                      <img src={dmAvatar} alt={name} />
                      <div className="presence"></div>
                    </div>
                    <div className="dm-name">{name}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

      </aside>
    </TooltipProvider>
  );
}
