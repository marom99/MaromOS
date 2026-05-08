import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolbarButtonGroup, ToolbarButton } from "@/components/ui/toolbar-button";
import type { SlackChannelContent } from "../data/channelContent";

interface SlackComposerProps {
  channel: SlackChannelContent;
}

export function SlackComposer({ channel }: SlackComposerProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="composer">
      <div className="input">
        <Textarea
          className="input-field w-full outline-none resize-none bg-transparent placeholder:text-[#9b9ea2] text-[#222] border-none focus-visible:ring-0 min-h-[42px]"
          placeholder={channel.composerPlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
        />
        <div className="input-bar">
          <ToolbarButtonGroup>
            <ToolbarButton type="button">
              <b>B</b>
            </ToolbarButton>
            <ToolbarButton type="button">
              <i>I</i>
            </ToolbarButton>
            <ToolbarButton type="button">
              <u>U</u>
            </ToolbarButton>
            <ToolbarButton type="button">
              <s>S</s>
            </ToolbarButton>
          </ToolbarButtonGroup>
          <div className="spacer"></div>
          <div className="send">
            <Button
              variant="default"
              size="sm"
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
