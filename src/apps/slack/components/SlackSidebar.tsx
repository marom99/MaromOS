import {
  ChatCircleDots,
  Bookmark,
} from "@phosphor-icons/react";
import dmAvatar from "../assets/dm-avatar.png";
import { slackChannels, type SlackChannelId } from "../data/channelContent";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export type SlackNavItem = "threads" | "bookmarks";

interface SlackSidebarProps {
  activeChannelId: SlackChannelId;
  onSelectChannel: (channelId: SlackChannelId) => void;
  isCollapsed: boolean;
  activeNavItem: SlackNavItem | null;
  onSelectNav: (item: SlackNavItem) => void;
  activeDMId: string | null;
  onSelectDM: (id: string) => void;
}

const directMessages = [
  "Marom",
];

const NAV_ITEMS: { id: SlackNavItem; icon: React.ReactNode; label: string }[] = [
  { id: "threads", icon: <ChatCircleDots size={16} weight="regular" />, label: "Threads" },
  { id: "bookmarks", icon: <Bookmark size={16} weight="regular" />, label: "Bookmarks" },
];

export function SlackSidebar({
  activeChannelId,
  onSelectChannel,
  isCollapsed,
  activeNavItem,
  onSelectNav,
  activeDMId,
  onSelectDM,
}: SlackSidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className="sidebar"
        aria-label={isCollapsed ? "Slack workspace navigation, collapsed" : "Slack workspace navigation"}
      >
        <div className="ws-head">
          <div className="ws-logo">
            <img src="/icons/default/slack.png" alt="Workspace" />
          </div>
          <div className="ws-meta">
            <div className="ws-name">
              Marom's Workspace
            </div>
            <div className="ws-status">
              <span className="ws-dot"></span> Active
            </div>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map(({ id, icon, label }) => (
            <Tooltip key={id} open={isCollapsed ? undefined : false}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`nav-item${activeNavItem === id ? " active" : ""}`}
                  onClick={() => onSelectNav(id)}
                  aria-pressed={activeNavItem === id}
                  aria-label={label}
                >
                  {icon}
                  <span>{label}</span>
                </button>
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
                    className={`channel${channel.id === activeChannelId && !activeNavItem && !activeDMId ? " active" : ""}`}
                    onClick={() => onSelectChannel(channel.id)}
                    aria-pressed={channel.id === activeChannelId && !activeNavItem && !activeDMId}
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
                  <button
                    type="button"
                    className={`dm${activeDMId === name.toLowerCase() ? " active" : ""}`}
                    onClick={() => onSelectDM(name.toLowerCase())}
                    aria-pressed={activeDMId === name.toLowerCase()}
                    aria-label={`Open direct message with ${name}`}
                  >
                    <div className="dm-avatar">
                      <img src={dmAvatar} alt={name} />
                      <div className="presence"></div>
                    </div>
                    <div className="dm-name">{name}</div>
                  </button>
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
