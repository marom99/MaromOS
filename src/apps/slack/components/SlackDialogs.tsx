import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";

interface SlackDialogsProps {
  helpItems: Array<{ icon: string; title: string; description: string }>;
  appMetadata: {
    name: string;
    version: string;
    creator: { name: string; url: string };
    github: string;
    icon: string;
  };
  isHelpOpen: boolean;
  onHelpOpenChange: (open: boolean) => void;
  isAboutOpen: boolean;
  onAboutOpenChange: (open: boolean) => void;
}

export function SlackDialogs({
  helpItems,
  appMetadata,
  isHelpOpen,
  onHelpOpenChange,
  isAboutOpen,
  onAboutOpenChange,
}: SlackDialogsProps) {
  return (
    <>
      <HelpDialog
        isOpen={isHelpOpen}
        onOpenChange={onHelpOpenChange}
        helpItems={helpItems}
        appId="slack"
      />
      <AboutDialog
        isOpen={isAboutOpen}
        onOpenChange={onAboutOpenChange}
        metadata={appMetadata}
        appId="slack"
      />
    </>
  );
}
