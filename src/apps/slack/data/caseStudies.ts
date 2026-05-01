import type { SlackChannel, SlackMember } from "../types";
import { slackGifs } from "./gifs";

const auroraMembers: SlackMember[] = [
  {
    id: "marom",
    name: "Marom",
    role: "designer",
    title: "Design lead",
    initials: "M",
    color: "#3a6fe0",
    presence: "active",
    statusEmoji: "🎨",
    statusText: "In Figma",
  },
  {
    id: "priya",
    name: "Priya",
    role: "pm",
    title: "Product manager",
    initials: "P",
    color: "#c2406b",
    presence: "active",
    statusEmoji: "📊",
    statusText: "Roadmap day",
  },
  {
    id: "theo",
    name: "Theo",
    role: "eng",
    title: "Senior engineer",
    initials: "T",
    color: "#1f8b54",
    presence: "active",
    statusEmoji: "🛠️",
    statusText: "Refactoring tokens",
  },
  {
    id: "lin",
    name: "Lin",
    role: "research",
    title: "User research",
    initials: "L",
    color: "#a8651b",
    presence: "away",
    statusEmoji: "🧠",
    statusText: "Synthesizing",
  },
  {
    id: "you",
    name: "You",
    role: "designer",
    title: "Reader",
    initials: "Y",
    color: "#5d3aa0",
    presence: "active",
  },
];

export const caseStudies: SlackChannel[] = [
  {
    id: "project-aurora",
    name: "project-aurora",
    emoji: "✨",
    topic: "Replatforming the Aurora design system from prototype to product surface",
    description:
      "We inherited a hand-rolled component library that drifted across three product teams. Aurora is the rebuild — one set of tokens, one accessibility bar, one shipped reality.",
    members: auroraMembers,
    status: "live",
    defaultUnread: 3,
    pinnedSummary: {
      title: "Project Aurora — case summary",
      tldr: "Six weeks. Three squads on one design system. Time-to-first-paint dropped 38%, component reuse jumped from 31% to 62%, and we retired four of the six bespoke component libraries we found in the audit.",
      metrics: [
        { label: "TTFP", value: "−38%" },
        { label: "Reuse", value: "62%" },
        { label: "Libs retired", value: "4 / 6" },
        { label: "WCAG AA", value: "Pass" },
      ],
    },
    messages: [
      {
        id: "m1",
        authorId: "priya",
        ts: "Mon · 9:02 AM",
        body: "Kicking off Project Aurora. Goal: one design system, three squads, no more bespoke buttons. If you have strong opinions, channel them here, not in DMs. 🙏",
      },
      {
        id: "m2",
        authorId: "marom",
        ts: "Mon · 9:08 AM",
        body: "I did the component audit over the weekend. Counted 14 button variants across the three apps. Honestly impressed by our collective creativity.",
        reactions: [
          { emoji: "😂", count: 4, reactedBy: ["priya", "theo", "lin", "you"] },
          { emoji: "🫠", count: 2, reactedBy: ["theo", "lin"] },
        ],
      },
      {
        id: "m3",
        authorId: "marom",
        ts: "Mon · 9:11 AM",
        body: "Audit deck attached. Fair warning: the slide where I overlay all 14 buttons looks like a ransom note.",
        attachments: [
          {
            id: "a1",
            kind: "figma",
            url: "https://www.figma.com/file/aurora-audit",
            caption: "Aurora component audit · Figma",
            fileName: "aurora-audit.fig",
            fileMeta: "Figma · 24 frames · last edited 3 min ago",
            width: 480,
            height: 280,
          },
        ],
        pinned: true,
      },
      {
        id: "m4",
        authorId: "theo",
        ts: "Mon · 9:24 AM",
        body: "Read it twice. Two things stand out: the apps don't share a token layer, and primitives are forked at the component level instead of the style level. That's where the variants come from.",
      },
      {
        id: "m5",
        authorId: "lin",
        ts: "Mon · 9:31 AM",
        body: "Backed up by interviews. Five of seven engineers said they fork because hunting down the canonical version is slower than rebuilding. Worth treating findability as a system requirement, not a docs problem.",
        reactions: [
          { emoji: "💯", count: 3, reactedBy: ["marom", "priya", "theo"] },
        ],
      },
      {
        id: "m6",
        authorId: "priya",
        ts: "Mon · 9:40 AM",
        body: "Decision point: do we build forward (new tokens, migrate apps in) or refactor in place (pull existing variants into a shared layer)?",
        poll: {
          question: "Aurora foundation strategy?",
          options: [
            {
              id: "forward",
              label: "Build forward — new token layer, migrate apps in",
              voters: ["priya", "marom", "theo"],
            },
            {
              id: "refactor",
              label: "Refactor in place — extract from existing variants",
              voters: ["lin"],
            },
            {
              id: "both",
              label: "Hybrid — new tokens, migrate one app first as proof",
              voters: [],
            },
          ],
        },
      },
      {
        id: "m7",
        authorId: "theo",
        ts: "Mon · 9:46 AM",
        body: "Voting forward. We've tried in-place twice. Each time the migration debt outlived the people who started it.",
      },
      {
        id: "m8",
        authorId: "marom",
        ts: "Mon · 9:51 AM",
        body: "Same. Forward also gives us a clean accessibility bar to enforce — we can't retrofit AA contrast onto fourteen buttons without somebody crying.",
        thread: [
          {
            id: "m8-r1",
            authorId: "lin",
            ts: "Mon · 9:55 AM",
            body: "Fair. I'll concede if we commit to migration deadlines per app. In-place loses momentum because nothing forces the cutover.",
          },
          {
            id: "m8-r2",
            authorId: "priya",
            ts: "Mon · 9:58 AM",
            body: "Deal. I'll bake migration milestones into the roadmap and we treat them as ship-blockers.",
          },
          {
            id: "m8-r3",
            authorId: "marom",
            ts: "Mon · 10:00 AM",
            body: "Updating the proposal now — forward strategy with three migration milestones, one per squad, gated on Aurora token parity.",
          },
          {
            id: "m8-r4",
            authorId: "theo",
            ts: "Mon · 10:02 AM",
            body: "Done. Tests pass. Vibes immaculate.",
            reactions: [
              { emoji: "🎉", count: 3, reactedBy: ["marom", "priya", "lin"] },
            ],
          },
        ],
      },
      {
        id: "m9",
        authorId: "priya",
        ts: "Tue · 10:14 AM",
        body: "Day 2. Aurora foundation merged. Marom is on the first migration (Pulse app). Asking everyone to pause new work in shared/* until Friday so we can land the token swap cleanly.",
        reactions: [
          { emoji: "🫡", count: 4, reactedBy: ["marom", "theo", "lin", "you"] },
        ],
      },
      {
        id: "m10",
        authorId: "marom",
        ts: "Tue · 2:38 PM",
        body: "First Pulse screen on Aurora. Buttons, inputs, dialogs swapped. Spacing finally consistent. The before/after is unreasonably satisfying.",
        attachments: [
          {
            id: "a2",
            kind: "image",
            url: "/icons/default/slack.svg",
            caption: "Pulse — before / after on Aurora primitives",
            width: 480,
            height: 270,
          },
        ],
      },
      {
        id: "m11",
        authorId: "theo",
        ts: "Tue · 2:41 PM",
        body: "Bundle size went down 11kb. No new dependencies. I'm into it.",
      },
      {
        id: "m12",
        authorId: "lin",
        ts: "Wed · 11:02 AM",
        body: "Heuristic walkthrough on Pulse with Aurora applied. Two findings: keyboard focus on the new dialogs is correct but visually subtle, and the dropdown active state reads as disabled to two of four testers.",
      },
      {
        id: "m13",
        authorId: "marom",
        ts: "Wed · 11:14 AM",
        body: "Both fair. Bumping focus glow up one step in the token spec, and inverting the dropdown active style. Will land in token v0.4.",
        thread: [
          {
            id: "m13-r1",
            authorId: "lin",
            ts: "Wed · 11:20 AM",
            body: "Will retest tomorrow with the same group. If contrast resolves I'll mark the AA blocker green.",
          },
          {
            id: "m13-r2",
            authorId: "marom",
            ts: "Wed · 11:22 AM",
            body: "Token v0.4 published. Run the same five tasks and I'll buy the team coffee if we hit AA on every component.",
          },
        ],
      },
      {
        id: "m14",
        authorId: "priya",
        ts: "Thu · 4:51 PM",
        body: "Stakeholder demo done. They asked, in this order: when does Atlas get migrated, when does the Mobile app get migrated, and can we please retire the old library. So… well received.",
        gif: slackGifs.celebrate,
        reactions: [
          { emoji: "🎉", count: 5, reactedBy: ["marom", "theo", "lin", "you", "priya"] },
          { emoji: "🥲", count: 2, reactedBy: ["marom", "theo"] },
        ],
      },
      {
        id: "m15",
        authorId: "theo",
        ts: "Fri · 9:18 AM",
        body: "Atlas migration started. I expect this one to be louder — Atlas has the most custom variants. Don't be alarmed if it goes quiet for a day, that means I'm in the deletion phase.",
      },
      {
        id: "m16",
        authorId: "marom",
        ts: "Fri · 9:24 AM",
        body: "Pinning Aurora token reference for the whole crew. If you're touching Atlas this week, this is your map.",
        attachments: [
          {
            id: "a3",
            kind: "file",
            url: "https://aurora.example/tokens",
            caption: "aurora-tokens-v0.4.md",
            fileName: "aurora-tokens-v0.4.md",
            fileMeta: "Markdown · 41 KB · 8 minute read",
          },
        ],
        pinned: true,
      },
      {
        id: "m17",
        authorId: "priya",
        ts: "Fri · 6:02 PM",
        body: "Wrap on week 1: Pulse migrated, Atlas underway, AA bar holding. If we ship this Friday I'll buy donuts. If we ship it Tuesday I'll buy two.",
        reactions: [
          { emoji: "🍩", count: 5, reactedBy: ["marom", "theo", "lin", "you", "priya"] },
        ],
      },
      {
        id: "m18",
        authorId: "theo",
        ts: "Mon · 8:11 AM",
        body: "Atlas migration landed over the weekend. Bundle: −22kb. Lint clean. Two tests flaky for unrelated reasons; opened tickets.",
        gif: slackGifs.shipIt,
      },
      {
        id: "m19",
        authorId: "lin",
        ts: "Mon · 9:30 AM",
        body: "Re-ran the AA audit on Atlas. Pass on every primitive. Dropdown active state now reads as active to all six testers. We can mark the blocker green.",
        reactions: [
          { emoji: "✅", count: 4, reactedBy: ["marom", "priya", "theo", "you"] },
        ],
      },
      {
        id: "m20",
        authorId: "marom",
        ts: "Tue · 11:48 AM",
        body: "Mobile migration is the cleanest of the three because we built Aurora with mobile primitives baked in. Theo, want me to drive this one so you can rest your wrists?",
      },
      {
        id: "m21",
        authorId: "theo",
        ts: "Tue · 11:51 AM",
        body: "Yes please. I will supervise from the hammock channel.",
        reactions: [
          { emoji: "🛋️", count: 3, reactedBy: ["marom", "priya", "lin"] },
        ],
      },
      {
        id: "m22",
        authorId: "priya",
        ts: "Wed · 5:14 PM",
        body: "Mobile shipped. All three squads on Aurora. Old library marked deprecated, scheduled for removal in two sprints. Numbers below — these are the ones I'll bring to the leadership review.",
        attachments: [
          {
            id: "a4",
            kind: "image",
            url: "/icons/default/slack.svg",
            caption: "Aurora — outcome metrics dashboard",
            width: 480,
            height: 270,
          },
        ],
      },
      {
        id: "m23",
        authorId: "marom",
        ts: "Wed · 5:18 PM",
        body: "Pinning the case summary. Six weeks ago there were 14 buttons. Today there is one button, four sizes, four states, and an accessibility bar that holds across three apps and two platforms.",
        pinned: true,
      },
      {
        id: "m24",
        authorId: "lin",
        ts: "Wed · 5:23 PM",
        body: "Marking the research thread closed. The findability problem fixed itself once the token layer existed — engineers stopped forking because the canonical version finally felt findable. Worth writing up for the next system.",
      },
      {
        id: "m25",
        authorId: "you",
        ts: "Now",
        body: "(reader checkpoint — drop a note below if you'd like to leave one)",
      },
    ],
  },
  {
    id: "client-pulse",
    name: "client-pulse",
    emoji: "📈",
    topic: "Pulse — onboarding redesign for a fintech client (case study coming soon)",
    description:
      "A fictional client engagement: rebuilding the new-user activation flow for a B2B fintech dashboard. Channel is locked while we polish the writeup.",
    members: [auroraMembers[0], auroraMembers[4]],
    status: "locked",
    pinnedSummary: {
      title: "Pulse onboarding — coming soon",
      tldr: "We're staging the writeup. Expected: activation lift, drop-off analysis, and a real conversation between design, PM, and the client lead about what to remove.",
      metrics: [
        { label: "Status", value: "Drafting" },
        { label: "Eta", value: "Soon" },
      ],
    },
    messages: [],
  },
  {
    id: "side-quest-keymap",
    name: "side-quest-keymap",
    emoji: "🎹",
    topic: "Keymap — a personal tool for remapping shortcuts (case study coming soon)",
    description:
      "A solo side project: a tiny menubar app that learns your shortcut patterns and proposes saner defaults. Channel is locked while the case study is being written.",
    members: [auroraMembers[0]],
    status: "locked",
    pinnedSummary: {
      title: "Keymap — coming soon",
      tldr: "Solo case study about scope discipline, dogfooding, and how I almost shipped a feature that would have made the app worse.",
      metrics: [
        { label: "Status", value: "Drafting" },
        { label: "Eta", value: "Soon" },
      ],
    },
    messages: [],
  },
];

export function getChannelById(id: string): SlackChannel | undefined {
  return caseStudies.find((c) => c.id === id);
}

export function getMemberById(
  channel: SlackChannel,
  authorId: string
): SlackMember | undefined {
  return channel.members.find((m) => m.id === authorId);
}
