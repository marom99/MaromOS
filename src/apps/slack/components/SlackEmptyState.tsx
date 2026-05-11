import { At, Bookmark, NotePencil, DotsThree } from "@phosphor-icons/react";

interface SlackEmptyStateProps {
  type: "mentions" | "bookmarks" | "drafts" | "more";
}

export function SlackEmptyState({ type }: SlackEmptyStateProps) {
  const config = {
    mentions: {
      icon: <At size={32} weight="light" />,
      title: "No mentions yet",
      label: "Mentions & Reactions",
      description: "When someone mentions you with @Marom, it'll appear here.",
    },
    bookmarks: {
      icon: <Bookmark size={32} weight="light" />,
      title: "No bookmarks yet",
      label: "Bookmarks",
      description: "Save messages and files you want to get back to later. They'll appear here for you and only you.",
    },
    drafts: {
      icon: <NotePencil size={32} weight="light" />,
      title: "No drafts yet",
      label: "Drafts",
      description: "Your unsent messages will appear here so you can finish them later.",
    },
    more: {
      icon: <DotsThree size={32} weight="light" />,
      title: "More options",
      label: "More",
      description: "Additional workspace features will appear here.",
    },
  }[type];

  return (
    <main className="main">
      <header className="main-head">
        <div className="main-head-title">
          <div className="ch-title">{config.label}</div>
        </div>
      </header>
      <div className="threads-empty">
        {config.icon}
        <p>{config.title}</p>
        <p className="threads-empty-sub">{config.description}</p>
      </div>
    </main>
  );
}
