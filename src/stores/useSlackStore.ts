import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { caseStudies } from "@/apps/slack/data/caseStudies";

interface SlackStoreState {
  activeChannelId: string;
  showDetailsPanel: boolean;
  showSidebar: boolean;
  activeThreadMessageId: string | null;
  fontSize: number;
  unreadCounts: Record<string, number>;
  reactedMessages: Record<string, string[]>;
  pollVotes: Record<string, string | null>;
  readerNotes: Record<string, ReaderNote[]>;
  setActiveChannel: (id: string) => void;
  toggleDetails: () => void;
  setShowDetails: (visible: boolean) => void;
  toggleSidebar: () => void;
  setShowSidebar: (visible: boolean) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  setPollVote: (messageId: string, optionId: string | null) => void;
  addReaderNote: (channelId: string, body: string) => void;
  markChannelRead: (channelId: string) => void;
  setFontSize: (size: number | ((prev: number) => number)) => void;
}

export interface ReaderNote {
  id: string;
  ts: string;
  body: string;
}

const initialUnread: Record<string, number> = caseStudies.reduce(
  (acc, channel) => {
    if (channel.defaultUnread && channel.defaultUnread > 0) {
      acc[channel.id] = channel.defaultUnread;
    }
    return acc;
  },
  {} as Record<string, number>
);

const firstLiveChannel =
  caseStudies.find((c) => c.status === "live")?.id ?? caseStudies[0]?.id ?? "";

export const useSlackStore = create<SlackStoreState>()(
  persist(
    (set) => ({
      activeChannelId: firstLiveChannel,
      showDetailsPanel: true,
      showSidebar: true,
      activeThreadMessageId: null,
      fontSize: 13,
      unreadCounts: initialUnread,
      reactedMessages: {},
      pollVotes: {},
      readerNotes: {},
      setActiveChannel: (id) =>
        set((state) => ({
          activeChannelId: id,
          activeThreadMessageId: null,
          unreadCounts: { ...state.unreadCounts, [id]: 0 },
        })),
      toggleDetails: () =>
        set((state) => ({ showDetailsPanel: !state.showDetailsPanel })),
      setShowDetails: (visible) => set({ showDetailsPanel: visible }),
      toggleSidebar: () =>
        set((state) => ({ showSidebar: !state.showSidebar })),
      setShowSidebar: (visible) => set({ showSidebar: visible }),
      openThread: (messageId) => set({ activeThreadMessageId: messageId }),
      closeThread: () => set({ activeThreadMessageId: null }),
      toggleReaction: (messageId, emoji) =>
        set((state) => {
          const current = state.reactedMessages[messageId] ?? [];
          const has = current.includes(emoji);
          const next = has
            ? current.filter((e) => e !== emoji)
            : [...current, emoji];
          return {
            reactedMessages: { ...state.reactedMessages, [messageId]: next },
          };
        }),
      setPollVote: (messageId, optionId) =>
        set((state) => ({
          pollVotes: { ...state.pollVotes, [messageId]: optionId },
        })),
      addReaderNote: (channelId, body) =>
        set((state) => {
          const trimmed = body.trim();
          if (!trimmed) return state;
          const note: ReaderNote = {
            id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            ts: new Date().toISOString(),
            body: trimmed,
          };
          const existing = state.readerNotes[channelId] ?? [];
          return {
            readerNotes: {
              ...state.readerNotes,
              [channelId]: [...existing, note],
            },
          };
        }),
      markChannelRead: (channelId) =>
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [channelId]: 0 },
        })),
      setFontSize: (size) =>
        set((state) => ({
          fontSize:
            typeof size === "function"
              ? Math.min(24, Math.max(10, size(state.fontSize)))
              : Math.min(24, Math.max(10, size)),
        })),
    }),
    {
      name: "slack-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        activeChannelId: state.activeChannelId,
        showDetailsPanel: state.showDetailsPanel,
        showSidebar: state.showSidebar,
        fontSize: state.fontSize,
        unreadCounts: state.unreadCounts,
        reactedMessages: state.reactedMessages,
        pollVotes: state.pollVotes,
        readerNotes: state.readerNotes,
      }),
    }
  )
);
