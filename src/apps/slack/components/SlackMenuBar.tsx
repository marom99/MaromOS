import { MenuBar } from "@/components/layout/MenuBar";
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
} from "@/components/ui/menubar";
import { useThemeStore } from "@/stores/useThemeStore";
import { isWindowsTheme } from "@/themes";
import type { SlackChannel } from "../types";

interface SlackMenuBarProps {
  onClose: () => void;
  onShowHelp: () => void;
  onShowAbout: () => void;
  channels: SlackChannel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  showDetails: boolean;
  onToggleDetails: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
  hasActiveThread: boolean;
  onCloseThread: () => void;
}

export function SlackMenuBar({
  onClose,
  onShowHelp,
  onShowAbout,
  channels,
  activeChannelId,
  onSelectChannel,
  showSidebar,
  onToggleSidebar,
  showDetails,
  onToggleDetails,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
  hasActiveThread,
  onCloseThread,
}: SlackMenuBarProps) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = isWindowsTheme(currentTheme);
  const isMacOsxTheme = currentTheme === "macosx";

  return (
    <MenuBar inWindowFrame={isXpTheme}>
      <MenubarMenu>
        <MenubarTrigger className="text-md px-2 py-1 border-none focus-visible:ring-0">
          File
        </MenubarTrigger>
        <MenubarContent align="start" sideOffset={1} className="px-0">
          <MenubarItem onClick={onClose} className="text-md h-6 px-3">
            Close
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-md px-2 py-1 border-none focus-visible:ring-0">
          Edit
        </MenubarTrigger>
        <MenubarContent align="start" sideOffset={1} className="px-0">
          <MenubarItem onClick={onIncreaseFontSize} className="text-md h-6 px-3">
            Increase Font Size
          </MenubarItem>
          <MenubarItem onClick={onDecreaseFontSize} className="text-md h-6 px-3">
            Decrease Font Size
          </MenubarItem>
          <MenubarSeparator className="h-[2px] bg-black my-1" />
          <MenubarItem onClick={onResetFontSize} className="text-md h-6 px-3">
            Reset Font Size
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-md px-2 py-1 border-none focus-visible:ring-0">
          View
        </MenubarTrigger>
        <MenubarContent align="start" sideOffset={1} className="px-0">
          <MenubarCheckboxItem
            checked={showSidebar}
            onCheckedChange={(checked) => {
              if (checked !== showSidebar) onToggleSidebar();
            }}
            className="text-md h-6 px-3"
          >
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={showDetails}
            onCheckedChange={(checked) => {
              if (checked !== showDetails) onToggleDetails();
            }}
            className="text-md h-6 px-3"
          >
            Show Details Panel
          </MenubarCheckboxItem>
          {hasActiveThread && (
            <>
              <MenubarSeparator className="h-[2px] bg-black my-1" />
              <MenubarItem onClick={onCloseThread} className="text-md h-6 px-3">
                Close Thread
              </MenubarItem>
            </>
          )}
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="text-md px-2 py-1 border-none focus-visible:ring-0">
          Channels
        </MenubarTrigger>
        <MenubarContent
          align="start"
          sideOffset={1}
          className="px-0 max-h-[300px] overflow-y-auto"
        >
          {channels.map((channel) => (
            <MenubarCheckboxItem
              key={channel.id}
              checked={channel.id === activeChannelId}
              onCheckedChange={(checked) => {
                if (checked) onSelectChannel(channel.id);
              }}
              className="text-md h-6 px-3"
            >
              {channel.status === "locked" ? "🔒 " : "#"}{channel.name}
            </MenubarCheckboxItem>
          ))}
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="px-2 py-1 text-md focus-visible:ring-0">
          Help
        </MenubarTrigger>
        <MenubarContent align="start" sideOffset={1} className="px-0">
          <MenubarItem onClick={onShowHelp} className="text-md h-6 px-3">
            Slack Help
          </MenubarItem>
          {!isMacOsxTheme && (
            <>
              <MenubarSeparator className="h-[2px] bg-black my-1" />
              <MenubarItem onClick={onShowAbout} className="text-md h-6 px-3">
                About Slack
              </MenubarItem>
            </>
          )}
        </MenubarContent>
      </MenubarMenu>
    </MenuBar>
  );
}
