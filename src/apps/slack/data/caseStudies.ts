import type { SlackChannel, SlackMember } from "../types";

const designLabMembers: SlackMember[] = [
  {
    id: "alex",
    name: "Alex Turner",
    role: "designer",
    title: "Design lead",
    initials: "AT",
    color: "#3a6fe0",
    presence: "active",
  },
  {
    id: "jamie",
    name: "Jamie Lin",
    role: "pm",
    title: "Product manager",
    initials: "JL",
    color: "#c2406b",
    presence: "active",
  },
  {
    id: "riley",
    name: "Riley Morgan",
    role: "eng",
    title: "Senior engineer",
    initials: "RM",
    color: "#1f8b54",
    presence: "active",
  },
  {
    id: "samira",
    name: "Samira Patel",
    role: "research",
    title: "User researcher",
    initials: "SP",
    color: "#a8651b",
    presence: "active",
  },
  {
    id: "jordan",
    name: "Jordan Ellis",
    role: "designer",
    title: "Product designer",
    initials: "JE",
    color: "#7a5dd0",
    presence: "active",
  },
  {
    id: "taylor",
    name: "Taylor Kim",
    role: "eng",
    title: "Frontend engineer",
    initials: "TK",
    color: "#2e8bc0",
    presence: "active",
  },
  {
    id: "casey",
    name: "Casey Park",
    role: "pm",
    title: "Product manager",
    initials: "CP",
    color: "#b49c2e",
    presence: "active",
  },
  {
    id: "morgan",
    name: "Morgan Liu",
    role: "designer",
    title: "UX designer",
    initials: "ML",
    color: "#5d3aa0",
    presence: "active",
  },
];

export const caseStudies: SlackChannel[] = [
  {
    id: "prototype-playground",
    name: "prototype-playground",
    topic: "Ideas, UI explorations, and design feedback",
    description: "Ideas, UI explorations, and design feedback",
    members: designLabMembers,
    status: "live",
    pinnedSummary: { title: "", tldr: "", metrics: [] },
    messages: [],
  },
];

export function getChannelById(id: string): SlackChannel | undefined {
  return caseStudies.find((c) => c.id === id);
}

export function getMemberById(channel: SlackChannel, memberId: string): SlackMember | undefined {
  return channel.members.find((m) => m.id === memberId);
}
