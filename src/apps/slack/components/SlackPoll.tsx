import { CheckCircle, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { SlackPoll } from "../types";
import { useSlackStore } from "@/stores/useSlackStore";

interface SlackPollProps {
  messageId: string;
  poll: SlackPoll;
}

export function SlackPollCard({ messageId, poll }: SlackPollProps) {
  const userVote = useSlackStore((state) => state.pollVotes[messageId] ?? null);
  const setPollVote = useSlackStore((state) => state.setPollVote);

  const totalVotes = poll.options.reduce((sum, option) => {
    const baseline = option.voters.length;
    const userBonus = userVote === option.id ? 1 : 0;
    return sum + baseline + userBonus;
  }, 0);

  return (
    <div className="slack-poll" role="group" aria-label={poll.question}>
      <div className="slack-poll-question">{poll.question}</div>
      <ul className="slack-poll-options">
        {poll.options.map((option) => {
          const baseline = option.voters.length;
          const isUserChoice = userVote === option.id;
          const count = baseline + (isUserChoice ? 1 : 0);
          const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
          return (
            <li key={option.id}>
              <button
                type="button"
                className={cn("slack-poll-option", isUserChoice && "is-voted")}
                onClick={() => setPollVote(messageId, isUserChoice ? null : option.id)}
                aria-pressed={isUserChoice}
              >
                <span className="slack-poll-bar" style={{ width: `${percent}%` }} aria-hidden="true" />
                <span className="slack-poll-tick">
                  {isUserChoice ? (
                    <CheckCircle size={16} weight="fill" />
                  ) : (
                    <Circle size={16} weight="regular" />
                  )}
                </span>
                <span className="slack-poll-label">{option.label}</span>
                <span className="slack-poll-count">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="slack-poll-footer">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        {poll.closed ? " · closed" : ""}
      </div>
    </div>
  );
}
