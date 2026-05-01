import { useState, type FormEvent } from "react";
import { PaperPlaneTilt, Smiley, Paperclip, At } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface SlackComposerProps {
  channelName: string;
  disabled?: boolean;
  onSubmit: (body: string) => void;
}

export function SlackComposer({
  channelName,
  disabled,
  onSubmit,
}: SlackComposerProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim() || disabled) return;
    onSubmit(draft);
    setDraft("");
  };

  return (
    <form className="slack-composer" onSubmit={handleSubmit}>
      <div className="slack-composer-toolbar">
        <button type="button" className="slack-composer-tool" aria-label="Add emoji">
          <Smiley size={14} weight="regular" />
        </button>
        <button type="button" className="slack-composer-tool" aria-label="Attach file">
          <Paperclip size={14} weight="regular" />
        </button>
        <button type="button" className="slack-composer-tool" aria-label="Mention someone">
          <At size={14} weight="regular" />
        </button>
      </div>
      <textarea
        className="slack-composer-input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={
          disabled
            ? "Read-only — channel is pending"
            : `Message #${channelName} — drop a reader note`
        }
        rows={2}
        disabled={disabled}
        aria-label={`Message ${channelName}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            if (draft.trim()) {
              onSubmit(draft);
              setDraft("");
            }
          }
        }}
      />
      <div className="slack-composer-footer">
        <span className="slack-composer-hint">Reader notes stay on your machine.</span>
        <Button
          type="submit"
          variant="default"
          className="slack-composer-send"
          disabled={!draft.trim() || disabled}
        >
          <PaperPlaneTilt size={14} weight="bold" />
          <span>Send</span>
        </Button>
      </div>
    </form>
  );
}
