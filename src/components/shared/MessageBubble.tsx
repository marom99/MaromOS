import { forwardRef } from "react";

interface MessageBubbleProps {
  colorClass?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    { colorClass = "bg-blue-100 text-black", className = "", style, children },
    ref
  ) => (
    <div
      ref={ref}
      className={`p-1.5 px-2 chat-bubble ${colorClass} w-fit max-w-[90%] min-h-[12px] rounded leading-snug font-geneva-12 break-words select-text ${className}`}
      style={style}
    >
      {children}
    </div>
  )
);

MessageBubble.displayName = "MessageBubble";
