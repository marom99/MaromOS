/**
 * Lightweight app registry data - only IDs and names
 * This file can be imported without triggering heavy component loads
 * Used by stores that need basic app info during initialization
 */

export const appIds = [
  "finder",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "photo-booth",
  "videos",
  "applet-viewer",
  "control-panels",
  "admin",
  "stickies",
  "dashboard",
  "slack",
  "about-me",
] as const;

export type AppId = (typeof appIds)[number];

/** Minimal app data for stores that don't need full registry */
export interface AppBasicInfo {
  id: AppId;
  name: string;
}

/** App ID to name mapping - matches appRegistry names exactly */
export const appNames: Record<AppId, string> = {
  "finder": "Finder",
  "internet-explorer": "Internet Explorer",
  "chats": "Chats",
  "textedit": "TextEdit",
  "paint": "Paint",
  "photo-booth": "Photo Booth",
  "videos": "Videos",
  "applet-viewer": "Applet Store",
  "control-panels": "Control Panels",
  "admin": "Admin",
  "stickies": "Stickies",
  "dashboard": "Dashboard",
  "slack": "Slack",
  "about-me": "About Me",
};

/**
 * Hidden app IDs - apps that are hidden from the UI but still registered.
 * These apps won't appear in the dock, desktop, or applications menu.
 * They can still be referenced by code and will continue to work.
 */
export const hiddenAppIds = new Set<AppId>(["chats"]);

/** Check if an app is hidden */
export const isAppHidden = (appId: AppId): boolean => {
  return hiddenAppIds.has(appId);
};

/** Get list of apps with basic info for stores */
export function getAppBasicInfoList(): AppBasicInfo[] {
  return appIds.filter(id => !isAppHidden(id)).map(id => ({ id, name: appNames[id] }));
}
