import { appIds, appNames, isAppHidden, type AppId } from "@/config/appRegistryData";
import type { AppLaunchRequest } from "@/utils/appEventBus";

export interface RouteToastDescriptor {
  type: "translation" | "text";
  message: string;
}

type UrlCleanupTiming = "immediate" | "after-dispatch" | "never";

export type RouteAction =
  | {
      kind: "launch";
      request: AppLaunchRequest;
      delayMs: number;
      toast?: RouteToastDescriptor;
      urlCleanupTiming: UrlCleanupTiming;
    }
  | {
      kind: "cleanup";
      urlCleanupTiming: Exclude<UrlCleanupTiming, "never">;
    };

const KNOWN_APP_IDS = new Set<string>(appIds);

/** Strip trailing slash; keep leading slash for matching */
function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function createLaunchAction(
  request: AppLaunchRequest,
  options: {
    delayMs: number;
    toast?: RouteToastDescriptor;
    urlCleanupTiming: UrlCleanupTiming;
  },
): RouteAction {
  return {
    kind: "launch",
    request,
    delayMs: options.delayMs,
    toast: options.toast,
    urlCleanupTiming: options.urlCleanupTiming,
  };
}

export function resolveInitialRoute(
  pathname: string,
  _search?: string
): RouteAction | null {
  pathname = normalizePathname(pathname);
  if (!pathname || pathname === "/") {
    return null;
  }

  if (pathname === "/applet-viewer") {
    return createLaunchAction(
      { appId: "applet-viewer" },
      {
        delayMs: 100,
        toast: {
          type: "translation",
          message: "common.loading.openingAppletStore",
        },
        urlCleanupTiming: "after-dispatch",
      },
    );
  }

  const internetExplorerMatch = pathname.match(/^\/internet-explorer\/([^/]+)$/);
  if (internetExplorerMatch) {
    return createLaunchAction(
      {
        appId: "internet-explorer",
        initialData: {
          shareCode: internetExplorerMatch[1],
        },
      },
      {
        delayMs: 0,
        toast: {
          type: "translation",
          message: "common.loading.openingSharedIELink",
        },
        urlCleanupTiming: "immediate",
      },
    );
  }

  const appletViewerShareMatch = pathname.match(/^\/applet-viewer\/([^/]+)$/);
  if (appletViewerShareMatch) {
    return createLaunchAction(
      {
        appId: "applet-viewer",
        initialData: {
          shareCode: appletViewerShareMatch[1],
          path: "",
          content: "",
          icon: undefined,
          name: undefined,
        },
      },
      {
        delayMs: 0,
        toast: {
          type: "translation",
          message: "common.loading.openingSharedApplet",
        },
        urlCleanupTiming: "immediate",
      },
    );
  }

  const videosMatch = pathname.match(/^\/videos\/(.+)$/);
  if (videosMatch) {
    return createLaunchAction(
      {
        appId: "videos",
        initialData: {
          videoId: videosMatch[1],
        },
      },
      {
        delayMs: 0,
        toast: {
          type: "translation",
          message: "common.loading.openingSharedVideo",
        },
        urlCleanupTiming: "immediate",
      },
    );
  }

  if (
    pathname.startsWith("/internet-explorer/") ||
    pathname.startsWith("/applet-viewer/") ||
    pathname.startsWith("/videos/")
  ) {
    return null;
  }

  const directAppPathMatch = pathname.match(/^\/([^/]+)$/);
  if (directAppPathMatch) {
    const potentialAppId = directAppPathMatch[1];
    if (KNOWN_APP_IDS.has(potentialAppId) && !isAppHidden(potentialAppId as AppId)) {
      const appId = potentialAppId as AppId;
      const appName = appNames[appId] || appId;

      return createLaunchAction(
        { appId },
        {
          delayMs: 100,
          toast: {
            type: "text",
            message: `Launching ${appName}...`,
          },
          urlCleanupTiming: "after-dispatch",
        },
      );
    }
  }

  return {
    kind: "cleanup",
    urlCleanupTiming: "immediate",
  };
}
