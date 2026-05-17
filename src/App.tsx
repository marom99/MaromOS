import { AppManager } from "./apps/base/AppManager";
import { appRegistry } from "./config/appRegistry";
import { useEffect, useState, useMemo } from "react";
import { applyDisplayMode } from "./utils/displayMode";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useAppStoreShallow, useDisplaySettingsStoreShallow } from "@/stores/helpers";
import { BootScreen } from "./components/dialogs/BootScreen";
import { getNextBootMessage, clearNextBootMessage, isBootDebugMode } from "./utils/bootMessage";
import { AnyApp } from "./apps/base/types";
import { useThemeStore } from "./stores/useThemeStore";
import { useDockStore } from "./stores/useDockStore";
import { getThemeMetadata } from "./themes";
import { useIsMobile } from "./hooks/useIsMobile";
import { useOffline } from "./hooks/useOffline";
import { useTranslation } from "react-i18next";
import { checkDesktopUpdate, onDesktopUpdate, DesktopUpdateResult } from "./utils/prefetch";
import { DownloadSimple } from "@phosphor-icons/react";
import { ScreenSaverOverlay } from "./components/screensavers/ScreenSaverOverlay";
import { useBackgroundChatNotifications } from "./hooks/useBackgroundChatNotifications";
import { DesktopErrorBoundary } from "@/components/errors/ErrorBoundaries";
import { useAutoCloudSync } from "@/hooks/useAutoCloudSync";
import { useFilesStore } from "@/stores/useFilesStore";
import { ReactScanDebug } from "@/components/ReactScanDebug";
import { Agentation } from "agentation";
import { useAppStore } from "@/stores/useAppStore";

// Convert registry to array
const apps: AnyApp[] = Object.values(appRegistry);

export function App() {
  const { t } = useTranslation();
  const { isFirstBoot, setHasBooted, setLastSeenDesktopVersion } = useAppStoreShallow(
    (state) => ({
      isFirstBoot: state.isFirstBoot,
      setHasBooted: state.setHasBooted,
      setLastSeenDesktopVersion: state.setLastSeenDesktopVersion,
    })
  );
  const displayMode = useDisplaySettingsStoreShallow((state) => state.displayMode);
  const currentTheme = useThemeStore((state) => state.current);
  const isMobile = useIsMobile();
  // Initialize offline detection
  useOffline();
  useBackgroundChatNotifications();
  useAutoCloudSync();

  // Determine toast position and offset based on theme and device
  const toastConfig = useMemo(() => {
    const isWindowsTheme = currentTheme === "xp" || currentTheme === "win98";
    const dockHeight = currentTheme === "macosx" ? 56 : 0;
    const taskbarHeight = isWindowsTheme ? 30 : 0;
    
    // Mobile: always show at bottom-center with dock/taskbar and safe area clearance
    if (isMobile) {
      const bottomOffset = dockHeight + taskbarHeight + 16;
      return {
        position: "bottom-center" as const,
        offset: `calc(env(safe-area-inset-bottom, 0px) + ${bottomOffset}px)`,
      };
    }

    if (isWindowsTheme) {
      // Windows themes: bottom-right with taskbar clearance (30px + padding)
      return {
        position: "bottom-right" as const,
        offset: `calc(env(safe-area-inset-bottom, 0px) + 42px)`,
      };
    } else {
      // macOS themes: top-right with menubar clearance
      const menuBarHeight = currentTheme === "system7" ? 30 : 25;
      return {
        position: "top-right" as const,
        offset: `${menuBarHeight + 12}px`,
      };
    }
  }, [currentTheme, isMobile]);

  const [bootScreenMessage, setBootScreenMessage] = useState<string | null>(
    null
  );
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [bootDebugMode, setBootDebugMode] = useState(false);

  useEffect(() => {
    applyDisplayMode(displayMode);
  }, [displayMode]);

  useEffect(() => {
    Promise.resolve(
      useFilesStore.getState().syncRootDirectoriesFromDefaults()
    ).catch((err) => {
      console.error("Root directory sync failed on app mount", err);
    });
  }, []);

  useEffect(() => {
    console.log("[App] Main useEffect running, isFirstBoot =", isFirstBoot);
    // Only show boot screen for system operations (reset/restore/format/debug)
    const persistedMessage = getNextBootMessage();
    if (persistedMessage) {
      setBootScreenMessage(persistedMessage);
      setBootDebugMode(isBootDebugMode());
      setShowBootScreen(true);
    }

    // Set first boot flag without showing boot screen
    if (isFirstBoot) {
      console.log("[App] isFirstBoot is true, launching default apps...");
      setHasBooted();
      
      const appStore = useAppStore.getState();
      const isMobileDevice = window.innerWidth < 768;
      
      if (isMobileDevice) {
        const slackId = appStore.launchApp("slack");
        console.log(`[App] Launched app: slack=${slackId}`);
        
        setTimeout(() => {
          if (slackId) {
            console.log("[App] Positioning Slack for mobile...");
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const currentTheme = useThemeStore.getState().current;
            const themeMetadata = getThemeMetadata(currentTheme);
            const dockState = useDockStore.getState();
            
            const safeAreaBottom = (() => {
              const val = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue("--sat-safe-area-bottom")
              );
              return !isNaN(val) ? val : 20;
            })();
            
            const dockHeight = (themeMetadata.hasDock && !dockState.hiding)
              ? Math.round(themeMetadata.baseDockHeight * dockState.scale)
              : 0;
            
            const topInset = themeMetadata.menuBarHeight;
            const bottomInset = themeMetadata.taskbarHeight + dockHeight + safeAreaBottom;
            
            const slackHeight = viewportHeight - topInset - bottomInset;
            
            appStore.updateInstanceWindowState(
              slackId,
              { x: 0, y: topInset },
              { width: viewportWidth, height: slackHeight }
            );
            
            appStore.bringInstanceToForeground(slackId);
            console.log("[App] Positioned Slack for mobile.");
          }
        }, 0);
      } else {
        const slackId = appStore.launchApp("slack");
        const aboutMeId = appStore.launchApp("about-me");
        console.log(`[App] Launched apps: slack=${slackId}, about-me=${aboutMeId}`);
        
        setTimeout(() => {
          if (slackId && aboutMeId) {
            console.log("[App] Updating instance window states...");
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Get current instance configs, or fallback to defaults
            const currentAboutMe = useAppStore.getState().instances[aboutMeId];
            const aboutMeConfig = currentAboutMe?.size || { width: 280, height: 389 };
            
            const gap = 16;
            const topMargin = 40;
            const sideMargin = 16;
            
            // Position About Me on the left
            appStore.updateInstanceWindowState(
              aboutMeId,
              { x: sideMargin, y: topMargin },
              aboutMeConfig
            );
            
            // Position Slack on the right
            const slackX = sideMargin + aboutMeConfig.width + gap;
            const slackWidth = viewportWidth - slackX - sideMargin;
            const slackHeight = Math.max(520, viewportHeight - topMargin - 60);
            
            appStore.updateInstanceWindowState(
              slackId,
              { x: slackX, y: topMargin },
              { width: slackWidth, height: slackHeight }
            );
            
            appStore.bringInstanceToForeground(slackId);
            console.log("[App] Positioned windows and brought slack to front.");
          }
      }, 0);
      }
    }
  }, [isFirstBoot, setHasBooted]);

  // Show download toast for macOS users when new desktop version is available
  // For web: show on first visit and updates
  // For Tauri: only show on updates (not first time)
  useEffect(() => {
    const isMacOS = navigator.platform.toLowerCase().includes("mac");

    if (!isMacOS) {
      return;
    }

    // Handler for showing the desktop update toast
    const showDesktopUpdateToast = (result: DesktopUpdateResult) => {
      if (result.type === 'update' && result.version) {
        // Mark as seen immediately so dismissing the toast won't show it again
        setLastSeenDesktopVersion(result.version);
        // New version available - show update toast (both web and Tauri)
        toast(`MaromOS ${result.version} for Mac is available`, {
          id: 'desktop-update',
          icon: <DownloadSimple className="h-4 w-4" weight="bold" />,
          duration: Infinity,
          action: {
            label: "Download",
            onClick: () => {
              window.open(
                `https://github.com/ryokun6/ryos/releases/download/v${result.version}/ryOS_${result.version}_aarch64.dmg`,
                "_blank"
              );
            },
          },
        });
      } else if (result.type === 'first-time' && result.version) {
        // Mark as seen immediately so dismissing the toast won't show it again
        setLastSeenDesktopVersion(result.version);
      }
    };

    // Register callback for periodic/manual update checks
    onDesktopUpdate(showDesktopUpdateToast);

    // Initial check on load (delayed to let app render first)
    const timer = setTimeout(async () => {
      const result = await checkDesktopUpdate();
      showDesktopUpdateToast(result);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLastSeenDesktopVersion]);

  if (showBootScreen) {
    return (
      <BootScreen
        isOpen={true}
        onOpenChange={() => {}}
        title={bootScreenMessage || t("common.system.systemRestoring")}
        debugMode={bootDebugMode}
        onBootComplete={() => {
          clearNextBootMessage();
          setShowBootScreen(false);
        }}
      />
    );
  }

  return (
    <>
      <ReactScanDebug />
      <DesktopErrorBoundary>
        <AppManager apps={apps} />
      </DesktopErrorBoundary>
      <Toaster position={toastConfig.position} offset={toastConfig.offset} />
      <ScreenSaverOverlay />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
