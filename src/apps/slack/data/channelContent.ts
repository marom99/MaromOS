export type SlackChannelId =
  | "welcome"
  | "general"
  | "design-lab"
  | "feedback"
  | "random";

export interface SlackReactionItem {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface SlackMessageItem {
  id: string;
  user: string;
  time: string;
  content: string;
  reactions: SlackReactionItem[];
  avatarIndex?: number;
  hasImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  isSelf?: boolean;
}

export interface SlackChannelContent {
  id: SlackChannelId;
  name: string;
  topic: string;
  memberCount: number;
  composerPlaceholder: string;
  messages: SlackMessageItem[];
}

export const slackChannels: SlackChannelContent[] = [
  {
    id: "welcome",
    name: "welcome",
    topic: "Start here to learn who Marom is and what this workspace is about",
    memberCount: 1,
    composerPlaceholder: "Message #welcome",
    messages: [
      {
        id: "welcome-1",
        user: "Marom",
        time: "9:12 AM",
        content:
          "Hey, I’m Marom. I build interactive product experiences and use MaromOS as a playground for turning interface ideas into something people can actually click through.",
        reactions: [
          { emoji: "👋", count: 4, hasReacted: false },
          { emoji: "✨", count: 2, hasReacted: false },
        ],
        isSelf: true,
        avatarIndex: 3,
      },
      {
        id: "welcome-2",
        user: "Marom",
        time: "9:14 AM",
        content:
          "A lot of my work sits between design and engineering: shaping product direction, refining interaction details, and then building the real interface so the concept survives contact with implementation.",
        reactions: [{ emoji: "🎯", count: 3, hasReacted: false }],
        isSelf: true,
        avatarIndex: 3,
      },
      {
        id: "welcome-3",
        user: "Marom",
        time: "9:18 AM",
        content:
          "This channel is the quickest introduction. The rest of the workspace shows how I think through visual systems, nostalgic computing references, and product storytelling in a way that still feels usable.",
        reactions: [
          { emoji: "💬", count: 2, hasReacted: false },
          { emoji: "🖥️", count: 1, hasReacted: false },
        ],
        isSelf: true,
        avatarIndex: 3,
      },
    ],
  },
  {
    id: "general",
    name: "general",
    topic: "Workspace-wide notes and day-to-day updates",
    memberCount: 8,
    composerPlaceholder: "Message #general",
    messages: [
      {
        id: "general-1",
        user: "Jordan Ellis",
        time: "8:52 AM",
        content:
          "Quick housekeeping note: homepage polish is in progress today, so if anything shifts visually it is likely part of that pass.",
        reactions: [{ emoji: "👍", count: 2, hasReacted: false }],
        avatarIndex: 0,
      },
    ],
  },
  {
    id: "design-lab",
    name: "design-lab",
    topic: "Ideas, UI explorations, and design feedback",
    memberCount: 12,
    composerPlaceholder: "Message #design-lab",
    messages: [
      {
        id: "design-1",
        user: "Alex Turner",
        time: "9:41 AM",
        content: "Morning team! Sharing the latest mockup for the dashboard.",
        hasImage: true,
        imageSrc:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
        imageAlt: "dashboard-v3.png",
        reactions: [
          { emoji: "👍", count: 3, hasReacted: false },
          { emoji: "❤️", count: 2, hasReacted: false },
        ],
        avatarIndex: 0,
      },
      {
        id: "design-2",
        user: "Jamie Lin",
        time: "9:47 AM",
        content:
          "This is looking great! I especially like the new activity timeline.",
        reactions: [],
        avatarIndex: 1,
      },
      {
        id: "design-3",
        user: "Riley Morgan",
        time: "10:02 AM",
        content:
          "Agreed! One thought: should we surface the filter controls more prominently on the first screen?",
        reactions: [],
        avatarIndex: 2,
      },
      {
        id: "design-4",
        user: "You",
        time: "10:15 AM",
        content:
          "I drafted a cleaner variation with the filters pulled higher, the first scan feels faster now.",
        reactions: [],
        isSelf: true,
        avatarIndex: 3,
      },
    ],
  },
  {
    id: "feedback",
    name: "feedback",
    topic: "Notes, critiques, and iteration requests",
    memberCount: 6,
    composerPlaceholder: "Message #feedback",
    messages: [
      {
        id: "feedback-1",
        user: "Casey Park",
        time: "11:06 AM",
        content:
          "Collecting reactions from this week’s review. Biggest theme so far: keep the story clear before adding more visual flourish.",
        reactions: [{ emoji: "📝", count: 2, hasReacted: false }],
        avatarIndex: 1,
      },
    ],
  },
  {
    id: "random",
    name: "random",
    topic: "Loose ideas, references, and side notes",
    memberCount: 5,
    composerPlaceholder: "Message #random",
    messages: [
      {
        id: "random-1",
        user: "Morgan Liu",
        time: "1:24 PM",
        content:
          "Dropping this here because it feels on-brand: old desktop metaphors still make modern product work more memorable when the interaction quality is real.",
        reactions: [{ emoji: "🫡", count: 1, hasReacted: false }],
        avatarIndex: 2,
      },
    ],
  },
];

export function getSlackChannel(channelId: SlackChannelId): SlackChannelContent {
  return slackChannels.find((channel) => channel.id === channelId) ?? slackChannels[0];
}
