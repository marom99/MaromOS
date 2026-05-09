import { useState } from "react";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import type { SlackChannelContent, SlackChannelMemberItem } from "../data/channelContent";
import { SLACK_PROFILE_PICTURES, getSlackInitials } from "./slackAvatarUtils";
import { SlackMembersDialog } from "./SlackMembersDialog";

interface SlackChannelHeaderProps {
  channel: SlackChannelContent;
}

function MemberAvatar({
  member,
  className,
}: {
  member: SlackChannelMemberItem;
  className?: string;
}) {
  return (
    <ProfileAvatar
      picture={SLACK_PROFILE_PICTURES[member.avatarIndex ?? 0]}
      fallback={getSlackInitials(member.name)}
      label={member.name}
      className={className}
      fit="cover"
    />
  );
}

export function SlackChannelHeader({ channel }: SlackChannelHeaderProps) {
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const previewMembers = channel.members.slice(0, 3);

  return (
    <>
      <header className="main-head">
        <div>
          <div className="ch-title"># {channel.name}</div>
          <div className="ch-sub">
            <span className="play"></span> {channel.topic}
          </div>
        </div>
        <div className="head-right">
          <div className="head-stat-wrap">
            <button
              type="button"
              className="head-stat"
              onClick={() => setIsMembersOpen(true)}
              aria-label={`View ${channel.memberCount.toLocaleString()} members`}
            >
              <span className="head-avatar-stack" aria-hidden="true">
                {previewMembers.map((member) => (
                  <span className="head-avatar" key={member.id}>
                    <MemberAvatar member={member} className="w-full h-full" />
                  </span>
                ))}
              </span>
              <span className="head-stat-count">{channel.memberCount.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </header>
      <SlackMembersDialog
        channel={channel}
        isOpen={isMembersOpen}
        onOpenChange={setIsMembersOpen}
      />
    </>
  );
}
