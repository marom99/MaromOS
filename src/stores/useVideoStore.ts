import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Video {
  id: string;
  url: string;
  title: string;
  artist?: string;
}

export const DEFAULT_VIDEOS: Video[] = [];

interface VideoStoreState {
  videos: Video[];
  currentVideoId: string | null;
  loopAll: boolean;
  loopCurrent: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  // actions
  setVideos: (videos: Video[] | ((prev: Video[]) => Video[])) => void;
  setCurrentVideoId: (videoId: string | null) => void;
  setLoopAll: (val: boolean) => void;
  setLoopCurrent: (val: boolean) => void;
  setIsShuffled: (val: boolean) => void;
  togglePlay: () => void;
  setIsPlaying: (val: boolean) => void;
  // derived state helpers
  getCurrentIndex: () => number;
  getCurrentVideo: () => Video | null;
}

const CURRENT_VIDEO_STORE_VERSION = 9; // Reset: emptied default videos

const getInitialState = () => ({
  videos: DEFAULT_VIDEOS,
  currentVideoId: DEFAULT_VIDEOS.length > 0 ? DEFAULT_VIDEOS[0].id : null,
  loopAll: true,
  loopCurrent: false,
  isShuffled: false,
  isPlaying: false,
});

export const useVideoStore = create<VideoStoreState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setVideos: (videosOrUpdater) => {
        set((state) => {
          const newVideos =
            typeof videosOrUpdater === "function"
              ? (videosOrUpdater as (prev: Video[]) => Video[])(state.videos)
              : videosOrUpdater;

          // Validate currentVideoId when videos change
          let currentVideoId = state.currentVideoId;
          if (
            currentVideoId &&
            !newVideos.find((v) => v.id === currentVideoId)
          ) {
            currentVideoId = newVideos.length > 0 ? newVideos[0].id : null;
          }

          return {
            videos: newVideos,
            currentVideoId,
          };
        });
      },
      setCurrentVideoId: (videoId) =>
        set((state) => {
          // Ensure videoId exists in videos array
          const validVideoId =
            videoId && state.videos.find((v) => v.id === videoId)
              ? videoId
              : null;
          return { currentVideoId: validVideoId };
        }),
      setLoopAll: (val) => set({ loopAll: val }),
      setLoopCurrent: (val) => set({ loopCurrent: val }),
      setIsShuffled: (val) => set({ isShuffled: val }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (val) => set({ isPlaying: val }),

      // Derived state helpers
      getCurrentIndex: () => {
        const state = get();
        return state.currentVideoId
          ? state.videos.findIndex((v) => v.id === state.currentVideoId)
          : -1;
      },
      getCurrentVideo: () => {
        const state = get();
        return state.currentVideoId
          ? state.videos.find((v) => v.id === state.currentVideoId) || null
          : null;
      },
    }),
    {
      name: "ryos:videos",
      version: CURRENT_VIDEO_STORE_VERSION,
      migrate: () => {
        console.log(
          `Migrating video store to clean ID-based version ${CURRENT_VIDEO_STORE_VERSION}`
        );
        // Always reset to defaults for clean start
        return getInitialState();
      },
      // Persist videos array to prevent ID-based errors
      partialize: (state) => ({
        videos: state.videos,
        currentVideoId: state.currentVideoId,
        loopAll: state.loopAll,
        loopCurrent: state.loopCurrent,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
