import { useState } from "react";
import { ChatInput } from "@/apps/chats/components/ChatInput";

interface SlackComposerProps {
  isForeground: boolean;
  onSendMessage: (message: string, imageData?: string | null) => boolean;
}

export function SlackComposer({
  isForeground,
  onSendMessage,
}: SlackComposerProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sendMessage = (content: string, imageData = selectedImage) => {
    if (onSendMessage(content, imageData)) {
      setMessage("");
      setSelectedImage(null);
    }
  };

  return (
    <div className="composer">
      <ChatInput
        input={message}
        isLoading={false}
        isForeground={isForeground}
        onInputChange={(e) => setMessage(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
        }}
        onStop={() => {}}
        onDirectMessageSubmit={sendMessage}
        showNudgeButton={false}
        isInChatRoom={false}
        needsUsername={false}
        isOffline={false}
        selectedImage={selectedImage}
        onImageChange={setSelectedImage}
      />
    </div>
  );
}
