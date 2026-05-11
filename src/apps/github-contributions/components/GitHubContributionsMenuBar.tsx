import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "@phosphor-icons/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";

interface GitHubContributionsMenuBarProps {
  onRefresh: () => void;
  onClose: () => void;
  isDark: boolean;
  onToggleMode: () => void;
}

export const GitHubContributionsMenuBar: React.FC<GitHubContributionsMenuBarProps> = ({
  onRefresh,
  onClose,
  isDark,
  onToggleMode,
}) => {
  return (
    <div className="flex items-center">
      <Menubar className="border-b-0 border-x-0 border-t-0 rounded-none h-7 px-2 select-none flex-1">
        <MenubarMenu>
          <MenubarTrigger className="h-6 text-[12px] font-geneva-12">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              className="text-[12px] font-geneva-12"
              onClick={onRefresh}
            >
              Refresh
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              className="text-[12px] font-geneva-12"
              onClick={onClose}
            >
              Close
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <button
        onClick={onToggleMode}
        className="relative h-6 w-6 mr-2 flex items-center justify-center rounded opacity-50 hover:opacity-100 transition-opacity duration-150"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Sun size={13} weight="bold" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Moon size={13} weight="bold" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
