import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { SLACK_PROFILE_PICTURES } from "./slackAvatarUtils";

interface SlackDMHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function SlackDMHeader({ onToggleSidebar, isSidebarOpen }: SlackDMHeaderProps) {
  return (
    <header className="main-head">
      {onToggleSidebar && (
        <button
          type="button"
          className="main-head-menu"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close channel list" : "Open channel list"}
          aria-expanded={!!isSidebarOpen}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isSidebarOpen ? "close" : "open"}
              className="main-head-menu-icon"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {isSidebarOpen ? (
                <X size={20} weight="bold" />
              ) : (
                <List size={20} weight="bold" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
      <div className="main-head-title dm-head-title">
        <ProfileAvatar
          picture={SLACK_PROFILE_PICTURES[3]}
          fallback="M"
          label="Marom"
          className="dm-head-avatar"
          fit="cover"
        />
        <div className="dm-head-info">
          <div className="ch-title">Marom</div>
          <div className="ch-sub">
            <span className="play"></span> Design engineer · Active
          </div>
        </div>
      </div>
    </header>
  );
}
