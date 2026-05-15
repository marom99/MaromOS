import { create } from "zustand";

interface SlackStoreState {
  activeChannelId: string;
}

export const useSlackStore = create<SlackStoreState>()(() => ({
  activeChannelId: "welcome",
}));
