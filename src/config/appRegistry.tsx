import { type AppId, isAppHidden as _isAppHidden } from "./appRegistryData";
import type {
  BaseApp,
  ChatsInitialData,
  ControlPanelsInitialData,
  InternetExplorerInitialData,
  PaintInitialData,
  VideosInitialData,
} from "@/apps/base/types";
import type { AppletViewerInitialData } from "@/apps/applet-viewer";
import { createLazyComponent } from "./lazyAppComponent";

export type { AppId };
export const isAppHidden = _isAppHidden;

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowConstraints {
  minSize?: WindowSize;
  maxSize?: WindowSize;
  defaultSize: WindowSize;
  mobileDefaultSize?: WindowSize;
  /** If true, mobile height will be set to window.innerWidth (square) */
  mobileSquare?: boolean;
}

// Default window constraints for any app not specified
const defaultWindowConstraints: WindowConstraints = {
  defaultSize: { width: 730, height: 475 },
  minSize: { width: 300, height: 200 },
};

// ============================================================================
// LAZY-LOADED APP COMPONENTS
// ============================================================================

// Critical apps (load immediately for perceived performance)
// Finder is critical - users see it on desktop
import { FinderAppComponent } from "@/apps/finder/components/FinderAppComponent";

// Lazy-loaded apps (loaded on-demand when opened)
// Each uses a cache key to maintain stable references across HMR
const LazyTextEditApp = createLazyComponent<unknown>(
  () => import("@/apps/textedit/components/TextEditAppComponent").then(m => ({ default: m.TextEditAppComponent })),
  "textedit"
);

const LazyInternetExplorerApp = createLazyComponent<InternetExplorerInitialData>(
  () => import("@/apps/internet-explorer/components/InternetExplorerAppComponent").then(m => ({ default: m.InternetExplorerAppComponent })),
  "internet-explorer"
);

const LazyChatsApp = createLazyComponent<ChatsInitialData>(
  () => import("@/apps/chats/components/ChatsAppComponent").then(m => ({ default: m.ChatsAppComponent })),
  "chats"
);

const LazyControlPanelsApp = createLazyComponent<ControlPanelsInitialData>(
  () => import("@/apps/control-panels/components/ControlPanelsAppComponent").then(m => ({ default: m.ControlPanelsAppComponent })),
  "control-panels"
);

const LazyPaintApp = createLazyComponent<PaintInitialData>(
  () => import("@/apps/paint/components/PaintAppComponent").then(m => ({ default: m.PaintAppComponent })),
  "paint"
);

const LazyVideosApp = createLazyComponent<VideosInitialData>(
  () => import("@/apps/videos/components/VideosAppComponent").then(m => ({ default: m.VideosAppComponent })),
  "videos"
);

const LazyPhotoBoothApp = createLazyComponent<unknown>(
  () => import("@/apps/photo-booth/components/PhotoBoothComponent").then(m => ({ default: m.PhotoBoothComponent })),
  "photo-booth"
);

const LazyAppletViewerApp = createLazyComponent<AppletViewerInitialData>(
  () => import("@/apps/applet-viewer/components/AppletViewerAppComponent").then(m => ({ default: m.AppletViewerAppComponent })),
  "applet-viewer"
);

const LazyAdminApp = createLazyComponent<unknown>(
  () => import("@/apps/admin/components/AdminAppComponent").then(m => ({ default: m.AdminAppComponent })),
  "admin"
);

const LazyStickiesApp = createLazyComponent<unknown>(
  () => import("@/apps/stickies/components/StickiesAppComponent").then(m => ({ default: m.StickiesAppComponent })),
  "stickies"
);

const LazyDashboardApp = createLazyComponent<unknown>(
  () => import("@/apps/dashboard/components/DashboardAppComponent").then(m => ({ default: m.DashboardAppComponent })),
  "dashboard"
);

const LazySlackApp = createLazyComponent<unknown>(
  () => import("@/apps/slack/components/SlackAppComponent").then(m => ({ default: m.SlackAppComponent })),
  "slack"
);

const LazyAboutMeApp = createLazyComponent<unknown>(
  () => import("@/apps/about-me/components/AboutMeAppComponent").then(m => ({ default: m.AboutMeAppComponent })),
  "about-me"
);

// ============================================================================
// APP METADATA (loaded eagerly - small, isolated from components)
// Import from metadata.ts files to avoid eager loading of components
// ============================================================================

import { appMetadata as finderMetadata, helpItems as finderHelpItems } from "@/apps/finder/metadata";
import { appMetadata as internetExplorerMetadata, helpItems as internetExplorerHelpItems } from "@/apps/internet-explorer/metadata";
import { appMetadata as chatsMetadata, helpItems as chatsHelpItems } from "@/apps/chats/metadata";
import { appMetadata as texteditMetadata, helpItems as texteditHelpItems } from "@/apps/textedit/metadata";
import { appMetadata as paintMetadata, helpItems as paintHelpItems } from "@/apps/paint";
import { appMetadata as photoboothMetadata, helpItems as photoboothHelpItems } from "@/apps/photo-booth/metadata";
import { appMetadata as videosMetadata, helpItems as videosHelpItems } from "@/apps/videos/metadata";
import { appMetadata as appletViewerMetadata, helpItems as appletViewerHelpItems } from "@/apps/applet-viewer";
import { appMetadata as controlPanelsMetadata, helpItems as controlPanelsHelpItems } from "@/apps/control-panels";
import { appMetadata as adminMetadata, helpItems as adminHelpItems } from "@/apps/admin/metadata";
import { appMetadata as stickiesMetadata, helpItems as stickiesHelpItems } from "@/apps/stickies";
import { appMetadata as dashboardMetadata, helpItems as dashboardHelpItems } from "@/apps/dashboard/metadata";
import { appMetadata as slackMetadata, helpItems as slackHelpItems } from "@/apps/slack/metadata";
import { appMetadata as aboutMeMetadata, helpItems as aboutMeHelpItems } from "@/apps/about-me/metadata";

// ============================================================================
// APP REGISTRY
// ============================================================================

// Registry of all available apps with their window configurations
export const appRegistry = {
  ["finder"]: {
    id: "finder",
    name: "Finder",
    icon: { type: "image", src: "/icons/mac.png" },
    description: "Browse and manage files",
    component: FinderAppComponent, // Critical - loaded eagerly
    helpItems: finderHelpItems,
    metadata: finderMetadata,
    windowConfig: {
      defaultSize: { width: 680, height: 400 },
      minSize: { width: 300, height: 200 },
    } as WindowConstraints,
  },
  ["internet-explorer"]: {
    id: "internet-explorer",
    name: "Internet Explorer",
    icon: { type: "image", src: internetExplorerMetadata.icon },
    description: "Browse the web",
    component: LazyInternetExplorerApp,
    helpItems: internetExplorerHelpItems,
    metadata: internetExplorerMetadata,
    windowConfig: {
      defaultSize: { width: 730, height: 600 },
      minSize: { width: 400, height: 300 },
    } as WindowConstraints,
  } as BaseApp<InternetExplorerInitialData> & { windowConfig: WindowConstraints },
  ["chats"]: {
    id: "chats",
    name: "Chats",
    icon: { type: "image", src: chatsMetadata.icon },
    description: "Chat with Ryo, your personal AI assistant",
    component: LazyChatsApp,
    helpItems: chatsHelpItems,
    metadata: chatsMetadata,
    hidden: true, // Hidden from UI (dock, desktop, applications menu)
    windowConfig: {
      defaultSize: { width: 390, height: 520 },
      minSize: { width: 300, height: 400 },
    } as WindowConstraints,
  } as BaseApp<ChatsInitialData> & { windowConfig: WindowConstraints },
  ["textedit"]: {
    id: "textedit",
    name: "TextEdit",
    icon: { type: "image", src: texteditMetadata.icon },
    description: "A simple rich text editor",
    component: LazyTextEditApp,
    helpItems: texteditHelpItems,
    metadata: texteditMetadata,
    windowConfig: {
      defaultSize: { width: 430, height: 475 },
      minSize: { width: 430, height: 200 },
    } as WindowConstraints,
  },
  ["paint"]: {
    id: "paint",
    name: "Paint",
    icon: { type: "image", src: paintMetadata.icon },
    description: "Draw and edit images",
    component: LazyPaintApp,
    helpItems: paintHelpItems,
    metadata: paintMetadata,
    windowConfig: {
      defaultSize: { width: 713, height: 480 },
      minSize: { width: 400, height: 400 },
      maxSize: { width: 713, height: 535 },
    } as WindowConstraints,
  } as BaseApp<PaintInitialData> & { windowConfig: WindowConstraints },
  ["photo-booth"]: {
    id: "photo-booth",
    name: "Photo Booth",
    icon: { type: "image", src: photoboothMetadata.icon },
    description: "Take photos with effects",
    component: LazyPhotoBoothApp,
    helpItems: photoboothHelpItems,
    metadata: photoboothMetadata,
    windowConfig: {
      defaultSize: { width: 644, height: 510 },
      minSize: { width: 644, height: 510 },
      maxSize: { width: 644, height: 510 },
    } as WindowConstraints,
  },
  ["videos"]: {
    id: "videos",
    name: "Videos",
    icon: { type: "image", src: videosMetadata.icon },
    description: "Watch videos",
    component: LazyVideosApp,
    helpItems: videosHelpItems,
    metadata: videosMetadata,
    windowConfig: {
      defaultSize: { width: 400, height: 420 },
      minSize: { width: 400, height: 340 },
    } as WindowConstraints,
  } as BaseApp<VideosInitialData> & { windowConfig: WindowConstraints },
  ["applet-viewer"]: {
    id: "applet-viewer",
    name: "Applet Store",
    icon: { type: "image", src: appletViewerMetadata.icon },
    description: "View and run applets",
    component: LazyAppletViewerApp,
    helpItems: appletViewerHelpItems,
    metadata: appletViewerMetadata,
    windowConfig: {
      defaultSize: { width: 320, height: 450 },
      minSize: { width: 300, height: 200 },
    } as WindowConstraints,
  } as BaseApp<AppletViewerInitialData> & { windowConfig: WindowConstraints },
  ["control-panels"]: {
    id: "control-panels",
    name: "Control Panels",
    icon: { type: "image", src: controlPanelsMetadata.icon },
    description: "System settings",
    component: LazyControlPanelsApp,
    helpItems: controlPanelsHelpItems,
    metadata: controlPanelsMetadata,
    windowConfig: {
      defaultSize: { width: 400, height: 415 },
      minSize: { width: 400, height: 415 },
      maxSize: { width: 560, height: 600 },
    } as WindowConstraints,
  } as BaseApp<ControlPanelsInitialData> & { windowConfig: WindowConstraints },
  ["admin"]: {
    id: "admin",
    name: "Admin",
    icon: { type: "image", src: adminMetadata.icon },
    description: "System administration panel",
    component: LazyAdminApp,
    helpItems: adminHelpItems,
    metadata: adminMetadata,
    adminOnly: true, // Only visible to admin user (ryo)
    windowConfig: {
      defaultSize: { width: 800, height: 500 },
      minSize: { width: 600, height: 400 },
    } as WindowConstraints,
  },
  ["stickies"]: {
    id: "stickies",
    name: "Stickies",
    icon: { type: "image", src: stickiesMetadata.icon },
    description: "Sticky notes for quick reminders",
    component: LazyStickiesApp,
    helpItems: stickiesHelpItems,
    metadata: stickiesMetadata,
    windowConfig: {
      defaultSize: { width: 500, height: 400 },
      minSize: { width: 300, height: 250 },
    } as WindowConstraints,
  },
  ["dashboard"]: {
    id: "dashboard",
    name: "Dashboard",
    icon: { type: "image", src: dashboardMetadata.icon },
    description: "Widget dashboard overlay",
    component: LazyDashboardApp,
    helpItems: dashboardHelpItems,
    metadata: dashboardMetadata,
    windowConfig: {
      defaultSize: { width: 500, height: 400 },
      minSize: { width: 300, height: 250 },
    } as WindowConstraints,
  },
  ["slack"]: {
    id: "slack",
    name: "Slack",
    icon: { type: "image", src: slackMetadata.icon },
    description: "Case study workspace",
    component: LazySlackApp,
    helpItems: slackHelpItems,
    metadata: slackMetadata,
    windowConfig: {
      defaultSize: { width: 1100, height: 720 },
      minSize: { width: 720, height: 520 },
    } as WindowConstraints,
  },
  ["about-me"]: {
    id: "about-me",
    name: "About Me",
    icon: { type: "image", src: aboutMeMetadata.icon },
    description: "Personal information and contact details",
    component: LazyAboutMeApp,
    helpItems: aboutMeHelpItems,
    metadata: aboutMeMetadata,
    windowConfig: {
      defaultSize: { width: 280, height: 389 },
      minSize: { width: 280, height: 420 },
      maxSize: { width: 420, height: 560 },
    } as WindowConstraints,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper function to get app icon path
export const getAppIconPath = (appId: AppId): string => {
  const app = appRegistry[appId];
  if (!app) {
    return "/icons/default/application.png";
  }
  if (typeof app.icon === "string") {
    return app.icon;
  }
  return app.icon.src;
};

// Helper function to get all apps except Finder
// Pass isAdmin=true to include admin-only apps
export const getNonFinderApps = (isAdmin: boolean = false): Array<{
  name: string;
  icon: string;
  id: AppId;
}> => {
  return Object.entries(appRegistry)
    .filter(([id, app]) => {
      if (id === "finder") return false;
      // Filter out hidden apps
      if ((app as { hidden?: boolean }).hidden) return false;
      // Filter out admin-only apps for non-admin users
      if ((app as { adminOnly?: boolean }).adminOnly && !isAdmin) return false;
      return true;
    })
    .map(([id, app]) => ({
      name: app.name,
      icon: getAppIconPath(id as AppId),
      id: id as AppId,
    }));
};

// Helper function to get app metadata
export const getAppMetadata = (appId: AppId) => {
  return appRegistry[appId]?.metadata;
};

// Helper function to get app component
export const getAppComponent = (appId: AppId) => {
  return appRegistry[appId]?.component;
};

// Helper function to get window configuration
export const getWindowConfig = (appId: AppId): WindowConstraints => {
  return appRegistry[appId]?.windowConfig || defaultWindowConstraints;
};

// Helper function to get mobile window size
export const getMobileWindowSize = (appId: AppId): WindowSize => {
  const config = getWindowConfig(appId);
  if (config.mobileDefaultSize) {
    return config.mobileDefaultSize;
  }
  // Square aspect ratio: height = width
  if (config.mobileSquare) {
    return {
      width: window.innerWidth,
      height: window.innerWidth,
    };
  }
  return {
    width: window.innerWidth,
    height: config.defaultSize.height,
  };
};
