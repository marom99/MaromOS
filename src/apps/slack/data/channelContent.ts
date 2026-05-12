export type SlackChannelId =
  | "welcome"
  | "prototype-playground"
  | "transporter-app"
  | "driver-app"
  | "testimonial";

export interface SlackReactionItem {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface SlackThreadReplyItem {
  id: string;
  user: string;
  time: string;
  content: string;
  avatarIndex?: number;
  isSelf?: boolean;
  hasImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}

export interface SlackThreadItem {
  replyCount: number;
  lastReplyLabel: string;
  participantAvatarIndexes: number[];
  replies: SlackThreadReplyItem[];
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
  thread?: SlackThreadItem;
}

export interface SlackChannelMemberItem {
  id: string;
  name: string;
  handle: string;
  title: string;
  avatarIndex?: number;
  status?: "active" | "away";
}

export interface SlackChannelContent {
  id: SlackChannelId;
  name: string;
  topic: string;
  memberCount: number;
  members: SlackChannelMemberItem[];
  composerPlaceholder: string;
  messages: SlackMessageItem[];
}

const sharedMembers: SlackChannelMemberItem[] = [
  {
    id: "jordan",
    name: "Jordan Ellis",
    handle: "jordan",
    title: "Product designer",
    avatarIndex: 0,
    status: "active",
  },
  {
    id: "jamie",
    name: "Jamie Lin",
    handle: "jamie",
    title: "Product manager",
    avatarIndex: 1,
    status: "active",
  },
  {
    id: "riley",
    name: "Riley Morgan",
    handle: "riley",
    title: "Frontend engineer",
    avatarIndex: 2,
    status: "active",
  },
  {
    id: "marom",
    name: "Marom",
    handle: "marom",
    title: "Design engineer",
    avatarIndex: 3,
    status: "active",
  },
  {
    id: "casey",
    name: "Casey Park",
    handle: "casey",
    title: "Research partner",
    avatarIndex: 1,
    status: "away",
  },
  {
    id: "morgan",
    name: "Morgan Liu",
    handle: "morgan",
    title: "UX designer",
    avatarIndex: 2,
    status: "active",
  },
  {
    id: "alex",
    name: "Alex Turner",
    handle: "alex",
    title: "Design lead",
    avatarIndex: 0,
    status: "active",
  },
  {
    id: "taylor",
    name: "Taylor Kim",
    handle: "taylor",
    title: "Interaction engineer",
    avatarIndex: 3,
    status: "away",
  },
  {
    id: "dev",
    name: "Devon Price",
    handle: "devon",
    title: "Prototype engineer",
    avatarIndex: 0,
    status: "active",
  },
  {
    id: "nina",
    name: "Nina Santos",
    handle: "nina",
    title: "Visual designer",
    avatarIndex: 1,
    status: "away",
  },
  {
    id: "omar",
    name: "Omar Reed",
    handle: "omar",
    title: "Design systems",
    avatarIndex: 2,
    status: "active",
  },
  {
    id: "priya",
    name: "Priya Nair",
    handle: "priya",
    title: "Product strategist",
    avatarIndex: 3,
    status: "active",
  },
];

export const slackChannels: SlackChannelContent[] = [
  {
    id: "welcome",
    name: "welcome",
    topic: "Start here to learn who Marom is and what this workspace is about",
    memberCount: 1,
    members: [sharedMembers[3]],
    composerPlaceholder: "Message #welcome",
    messages: [
      {
        id: "welcome-1",
        user: "Marom",
        time: "9:12 AM",
        content:
          "Welcome to ryOS. I’m Marom, and this workspace is set up so you can explore the projects from inside the OS instead of reading a flat portfolio page.",
        reactions: [
          { emoji: "👋", count: 4, hasReacted: false },
          { emoji: "✨", count: 2, hasReacted: false },
        ],
        avatarIndex: 3,
      },
      {
        id: "welcome-2",
        user: "Marom",
        time: "9:14 AM",
        content:
          "You’re the visitor here. The channels work like a guided studio tour: product notes, design thinking, interaction details, and the implementation choices behind the interface.",
        reactions: [{ emoji: "🎯", count: 3, hasReacted: false }],
        avatarIndex: 3,
      },
      {
        id: "welcome-3",
        user: "Marom",
        time: "9:18 AM",
        content:
          "Try sending a note from the composer below. Your messages show up as You, so the Slack app feels like you are inside the workspace, not impersonating me.",
        reactions: [
          { emoji: "💬", count: 2, hasReacted: false },
          { emoji: "🖥️", count: 1, hasReacted: false },
        ],
        avatarIndex: 3,
      },
    ],
  },
  {
    id: "prototype-playground",
    name: "prototype-playground",
    topic: "Ideas, UI explorations, and design feedback",
    memberCount: 12,
    members: [
      sharedMembers[6],
      sharedMembers[1],
      sharedMembers[2],
      sharedMembers[3],
      sharedMembers[0],
      sharedMembers[7],
      sharedMembers[4],
      sharedMembers[5],
      sharedMembers[8],
      sharedMembers[9],
      sharedMembers[10],
      sharedMembers[11],
    ],
    composerPlaceholder: "Message #prototype-playground",
    messages: [
      {
        id: "design-1",
        user: "Alex Turner",
        time: "9:41 AM",
        content: "Any opinions on Claude Design?",
        reactions: [
          { emoji: "👍", count: 3, hasReacted: false },
          { emoji: "❤️", count: 2, hasReacted: false },
        ],
        avatarIndex: 0,
        thread: {
          replyCount: 7,
          lastReplyLabel: "Last reply 8 days ago",
          participantAvatarIndexes: [1, 2, 3, 0],
          replies: [
            {
              id: "design-1-thread-1",
              user: "Jamie Lin",
              time: "9:44 AM",
              content:
                "Promising for quick visual exploration. I still want the final interaction model shaped by the product story, not by whatever the mock happened to generate.",
              avatarIndex: 1,
            },
            {
              id: "design-1-thread-2",
              user: "Riley Morgan",
              time: "9:48 AM",
              content:
                "Useful as a sketch partner. The risk is mistaking a polished surface for a solved interface. We should keep the critique loop strict.",
              avatarIndex: 2,
            },
            {
              id: "design-1-thread-3",
              user: "Marom",
              time: "10:04 AM",
              content:
                "I would use it for direction probes, then rebuild the real UI in ryOS components so the behavior, accessibility, and theme fidelity survive.",
              avatarIndex: 3,
            },
            {
              id: "design-1-thread-4",
              user: "Alex Turner",
              time: "10:07 AM",
              content:
                "That distinction helps. Treat the image as a conversation starter, not the shipped source of truth.",
              avatarIndex: 0,
            },
            {
              id: "design-1-thread-5",
              user: "Jamie Lin",
              time: "10:11 AM",
              content:
                "Exactly. The useful part is comparing directions quickly, then deciding what should actually exist in the product.",
              avatarIndex: 1,
            },
            {
              id: "design-1-thread-6",
              user: "Riley Morgan",
              time: "10:18 AM",
              content:
                "I would also keep the thread attached to the decision so future readers can see why the final UI changed from the first visual probe.",
              avatarIndex: 2,
            },
            {
              id: "design-1-thread-7",
              user: "Marom",
              time: "10:22 AM",
              content:
                "Then the rule is simple: fast visual exploration, slow product judgment, real implementation after the judgment is clear.",
              avatarIndex: 3,
            },
          ],
        },
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
        user: "Marom",
        time: "10:15 AM",
        content:
          "I drafted a cleaner variation with the filters pulled higher, the first scan feels faster now.",
        reactions: [],
        avatarIndex: 3,
      },
    ],
  },
  {
    id: "transporter-app",
    name: "transporter-app",
    topic: "Notes, critiques, and iteration requests",
    memberCount: 6,
    members: [
      sharedMembers[4],
      sharedMembers[1],
      sharedMembers[3],
      sharedMembers[0],
      sharedMembers[5],
      sharedMembers[2],
    ],
    composerPlaceholder: "Message #transporter-app",
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
    id: "driver-app",
    name: "driver-app",
    topic: "Loose ideas, references, and side notes",
    memberCount: 5,
    members: [
      sharedMembers[5],
      sharedMembers[2],
      sharedMembers[3],
      sharedMembers[1],
      sharedMembers[0],
    ],
    composerPlaceholder: "Message #driver-app",
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
  {
    id: "testimonial",
    name: "testimonial",
    topic: "What collaborators say about working with Marom",
    memberCount: 8,
    members: [
      sharedMembers[0],
      sharedMembers[1],
      sharedMembers[2],
      sharedMembers[4],
      sharedMembers[5],
      sharedMembers[6],
      sharedMembers[7],
      sharedMembers[3],
    ],
    composerPlaceholder: "Message #testimonial",
    messages: [
      {
        id: "testimonial-1",
        user: "Jordan Ellis",
        time: "10:02 AM",
        content:
          "Working with Marom meant every design decision had a reason behind it. He'd push back on anything that didn't serve the user, but constructively — always with an alternative ready.",
        reactions: [
          { emoji: "💯", count: 5, hasReacted: false },
          { emoji: "❤️", count: 3, hasReacted: false },
        ],
        avatarIndex: 0,
      },
      {
        id: "testimonial-2",
        user: "Jamie Lin",
        time: "10:09 AM",
        content:
          "He's one of the rare designers who can go deep into a technical constraint and come back with a solution that actually looks better for it. Engineering and design both trusted him.",
        reactions: [
          { emoji: "👏", count: 4, hasReacted: false },
        ],
        avatarIndex: 1,
      },
      {
        id: "testimonial-3",
        user: "Riley Morgan",
        time: "10:17 AM",
        content:
          "The thing that stood out most: Marom never shipped ambiguity. If a spec was unclear, he'd resolve it before it became a bug.",
        reactions: [
          { emoji: "🎯", count: 6, hasReacted: false },
          { emoji: "💬", count: 2, hasReacted: false },
        ],
        avatarIndex: 2,
      },
      {
        id: "testimonial-4",
        user: "Casey Park",
        time: "10:31 AM",
        content:
          "He made the handoff feel like a collaboration, not a handoff. By the time I got the spec, I already understood the thinking behind every choice.",
        reactions: [
          { emoji: "🙌", count: 3, hasReacted: false },
        ],
        avatarIndex: 4,
      },
      {
        id: "testimonial-5",
        user: "Morgan Liu",
        time: "10:44 AM",
        content:
          "Product timelines being what they are, there were weeks where we needed someone who could hold quality and pace at the same time. Marom was always that person.",
        reactions: [
          { emoji: "⚡", count: 4, hasReacted: false },
          { emoji: "💪", count: 2, hasReacted: false },
        ],
        avatarIndex: 5,
      },
    ],
  },
];

export function getSlackChannel(channelId: SlackChannelId): SlackChannelContent {
  return slackChannels.find((channel) => channel.id === channelId) ?? slackChannels[0];
}
