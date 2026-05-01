import { cn } from "@/lib/utils";
import type { SlackReaction } from "../types";
import { useSlackStore } from "@/stores/useSlackStore";

const EMPTY_REACTIONS: string[] = [];

interface SlackReactionRowProps {
  messageId: string;
  reactions: SlackReaction[];
}

export function SlackReactionRow({ messageId, reactions }: SlackReactionRowProps) {
  const userReacted = useSlackStore(
    (state) => state.reactedMessages[messageId] ?? EMPTY_REACTIONS
  );
  const toggleReaction = useSlackStore((state) => state.toggleReaction);

  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="slack-reactions" aria-label="Message reactions">
      {reactions.map((reaction) => {
        const reacted = userReacted.includes(reaction.emoji);
        const count = reaction.count + (reacted ? 1 : 0);
        return (
          <button
            type="button"
            key={`${messageId}-${reaction.emoji}`}
            className={cn("slack-reaction", reacted && "is-reacted")}
            onClick={() => toggleReaction(messageId, reaction.emoji)}
            aria-pressed={reacted}
          >
            <span className="slack-reaction-emoji">{reaction.emoji}</span>
            <span className="slack-reaction-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
