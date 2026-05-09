import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { useThemeStore } from "@/stores/useThemeStore";
import { isWindowsTheme } from "@/themes";
import { cn } from "@/lib/utils";
import type {
  SlackChannelContent,
  SlackChannelMemberItem,
} from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";

interface SlackMembersDialogProps {
  channel: SlackChannelContent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type DialogTab = "members" | "about";

export function SlackMembersDialog({
  channel,
  isOpen,
  onOpenChange,
}: SlackMembersDialogProps) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = isWindowsTheme(currentTheme);
  const isMacTheme = currentTheme === "macosx";

  const [activeTab, setActiveTab] = useState<DialogTab>("members");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveTab("members");
    }
  }, [isOpen]);

  const filteredMembers = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return channel.members;
    return channel.members.filter(
      (member) =>
        member.name.toLowerCase().includes(trimmed) ||
        member.handle.toLowerCase().includes(trimmed)
    );
  }, [channel.members, query]);

  const title = `# ${channel.name}`;

  const body = (
    <DialogBody
      channel={channel}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      query={query}
      onQueryChange={setQuery}
      filteredMembers={filteredMembers}
      isXpTheme={isXpTheme}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-[420px]", isXpTheme && "p-0 overflow-hidden")}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {isXpTheme ? (
          <>
            <DialogHeader>{title}</DialogHeader>
            <div className="window-body">{body}</div>
          </>
        ) : isMacTheme ? (
          <>
            <DialogHeader>{title}</DialogHeader>
            {body}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal text-[16px]">{title}</DialogTitle>
              <DialogDescription className="sr-only">
                Members and details for #{channel.name}.
              </DialogDescription>
            </DialogHeader>
            {body}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DialogBodyProps {
  channel: SlackChannelContent;
  activeTab: DialogTab;
  onTabChange: (tab: DialogTab) => void;
  query: string;
  onQueryChange: (value: string) => void;
  filteredMembers: SlackChannelMemberItem[];
  isXpTheme: boolean;
}

function DialogBody({
  channel,
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  filteredMembers,
  isXpTheme,
}: DialogBodyProps) {
  return (
    <div className={cn("slack-members-dialog", isXpTheme ? "p-2 px-4" : "p-4 px-6")}>
      <div className="slack-members-tabs" role="tablist" aria-label="Channel details">
        <TabButton
          isActive={activeTab === "members"}
          onClick={() => onTabChange("members")}
          controls="slack-members-panel"
          id="slack-members-tab"
        >
          Members
          <span className="slack-members-tab-count">
            {channel.memberCount.toLocaleString()}
          </span>
        </TabButton>
        <TabButton
          isActive={activeTab === "about"}
          onClick={() => onTabChange("about")}
          controls="slack-about-panel"
          id="slack-about-tab"
        >
          About
        </TabButton>
      </div>

      {activeTab === "members" ? (
        <div
          id="slack-members-panel"
          role="tabpanel"
          aria-labelledby="slack-members-tab"
          className="slack-members-tabpanel"
        >
          <Input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="Search members…"
            className={cn(
              "shadow-none slack-members-search",
              isXpTheme
                ? "font-['Pixelated_MS_Sans_Serif',Arial] text-[11px]"
                : "font-geneva-12 text-[12px]"
            )}
            style={{
              fontFamily: isXpTheme
                ? '"Pixelated MS Sans Serif", "ArkPixel", Arial'
                : undefined,
              fontSize: isXpTheme ? "11px" : undefined,
            }}
            aria-label="Search members"
          />

          <div className="slack-members-list mt-3">
            {filteredMembers.length === 0 ? (
              <div className="slack-members-empty">
                No members match “{query}”.
              </div>
            ) : (
              <ul className="slack-members-rows">
                {filteredMembers.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div
          id="slack-about-panel"
          role="tabpanel"
          aria-labelledby="slack-about-tab"
          className="slack-members-tabpanel slack-about"
        >
          <div className="slack-about-section">
            <div className="slack-about-label">Channel name</div>
            <div className="slack-about-value">#{channel.name}</div>
          </div>
          <div className="slack-about-section">
            <div className="slack-about-label">Description</div>
            <div className="slack-about-value slack-about-description">
              {channel.topic}
            </div>
          </div>
          <div className="slack-about-section">
            <div className="slack-about-label">Members</div>
            <div className="slack-about-value">
              <span className="slack-about-count">
                {channel.memberCount.toLocaleString()}
              </span>{" "}
              {channel.memberCount === 1 ? "person" : "people"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
  id,
  controls,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  id: string;
  controls: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={controls}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className="slack-members-tab"
      data-active={isActive ? "true" : undefined}
    >
      {children}
    </button>
  );
}

function MemberRow({ member }: { member: SlackChannelMemberItem }) {
  return (
    <li className="slack-members-row">
      <span className="slack-members-avatar">
        <ProfileAvatar
          picture={SLACK_PROFILE_PICTURES[member.avatarIndex ?? 0]}
          fallback={getSlackInitials(member.name)}
          label={member.name}
          className="w-full h-full"
          fit="cover"
        />
      </span>
      <span className="slack-members-text">
        <span className="slack-members-name">{member.name}</span>
        {member.title && (
          <span className="slack-members-title">{member.title}</span>
        )}
      </span>
    </li>
  );
}
