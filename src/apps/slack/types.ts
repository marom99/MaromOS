export type SlackMemberRole = "designer" | "pm" | "eng" | "client" | "research";

export type SlackPresence = "active" | "away";

export type SlackChannelStatus = "live" | "locked";

export interface SlackMember {
  id: string;
  name: string;
  role: SlackMemberRole;
  title: string;
  initials: string;
  color: string;
  presence: SlackPresence;
  statusEmoji?: string;
  statusText?: string;
}

export interface SlackReaction {
  emoji: string;
  count: number;
  reactedBy: string[];
}

export type SlackAttachmentKind = "image" | "figma" | "file";

export interface SlackAttachment {
  id: string;
  kind: SlackAttachmentKind;
  url: string;
  caption?: string;
  width?: number;
  height?: number;
  fileName?: string;
  fileMeta?: string;
}

export interface SlackPollOption {
  id: string;
  label: string;
  voters: string[];
}

export interface SlackPoll {
  question: string;
  options: SlackPollOption[];
  closed?: boolean;
}

export interface SlackGif {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SlackThreadReply {
  id: string;
  authorId: string;
  ts: string;
  body: string;
  reactions?: SlackReaction[];
  gif?: SlackGif;
}

export interface SlackMessage {
  id: string;
  authorId: string;
  ts: string;
  body: string;
  reactions?: SlackReaction[];
  attachments?: SlackAttachment[];
  gif?: SlackGif;
  poll?: SlackPoll;
  thread?: SlackThreadReply[];
  pinned?: boolean;
  isDayBreak?: boolean;
  dayLabel?: string;
}

export interface SlackPinnedSummary {
  title: string;
  tldr: string;
  metrics: Array<{ label: string; value: string }>;
}

export interface SlackChannel {
  id: string;
  name: string;
  topic: string;
  description: string;
  members: SlackMember[];
  pinnedSummary: SlackPinnedSummary;
  messages: SlackMessage[];
  status: SlackChannelStatus;
  emoji?: string;
  defaultUnread?: number;
}
