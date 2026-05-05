import avatarAlex from "../assets/avatar-alex.png";
import avatarJamie from "../assets/avatar-jamie.png";
import avatarRiley from "../assets/avatar-riley.png";
import avatarSamira from "../assets/avatar-samira.png";
import { MessageBubble } from "@/components/shared/MessageBubble";
import { ImageAttachment } from "@/components/shared/ImageAttachment";
import { Badge } from "@/components/ui/badge";
import { CaretDown, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  time: string;
  content: string;
  hasImage?: boolean;
  reactions: Reaction[];
}

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🙏", "👀"];

export function SlackMessages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Alex Turner",
      avatar: avatarAlex,
      time: "9:41 AM",
      content: "Morning team! Sharing the latest mockup for the dashboard.",
      hasImage: true,
      reactions: [
        { emoji: "👍", count: 3, hasReacted: false },
        { emoji: "❤️", count: 2, hasReacted: false },
      ],
    },
    {
      id: "2",
      user: "Jamie Lin",
      avatar: avatarJamie,
      time: "9:47 AM",
      content: "This is looking great! I especially like the new activity timeline.",
      reactions: [],
    },
    {
      id: "3",
      user: "Riley Morgan",
      avatar: avatarRiley,
      time: "10:02 AM",
      content: "Agreed! One thought: should we surface the filter controls more prominently on the first screen?",
      reactions: [],
    },
    {
      id: "4",
      user: "Samira Patel",
      avatar: avatarSamira,
      time: "10:15 AM",
      content: "Good call. I'll draft a variation and share it here shortly.",
      reactions: [],
    },
  ]);

  const toggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingIdx = msg.reactions.findIndex((r) => r.emoji === emoji);
        let newReactions = [...msg.reactions];

        if (existingIdx > -1) {
          const reaction = newReactions[existingIdx];
          if (reaction.hasReacted) {
            if (reaction.count === 1) {
              newReactions.splice(existingIdx, 1);
            } else {
              newReactions[existingIdx] = {
                ...reaction,
                count: reaction.count - 1,
                hasReacted: false,
              };
            }
          } else {
            newReactions[existingIdx] = {
              ...reaction,
              count: reaction.count + 1,
              hasReacted: true,
            };
          }
        } else {
          newReactions.push({ emoji, count: 1, hasReacted: true });
        }

        return { ...msg, reactions: newReactions };
      })
    );
  };

  return (
    <div className="messages">
      <div className="date-sep">
        <Badge
          variant="outline"
          className="date-pill bg-gradient-to-b from-[#fdfdfd] to-[#eeeeee] border-[#bdbfc3] text-[#555] font-normal h-6 px-3 rounded-full shadow-[0_1px_0_rgba(0,0,0,0.04),inset_0_1px_0_#fff] gap-1.5"
        >
          Today, May 18
          <CaretDown size={10} weight="fill" className="text-[#666]" />
        </Badge>
      </div>

      {messages.map((msg) => (
        <div key={msg.id} className="msg group">
          <div className="avatar">
            <img src={msg.avatar} alt={msg.user} />
          </div>
          <div className="msg-body">
            <div className="msg-head">
              <div className="msg-name">{msg.user}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
            <MessageBubble className="mt-1">{msg.content}</MessageBubble>
            {msg.hasImage && (
              <div className="mt-2 mb-1">
                <ImageAttachment
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
                  alt="dashboard-v3.png"
                />
              </div>
            )}
            <div className="reactions flex flex-wrap gap-1 mt-1">
              {msg.reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => toggleReaction(msg.id, r.emoji)}
                  className={cn(
                    "react flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[11px] font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97]",
                    r.hasReacted
                      ? "bg-[#2765ca] border-[#2765ca] text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                      : "bg-[#f8f8f8] border-black/10 hover:border-black/20 text-[#4b4b4b] shadow-[0_1px_0_rgba(255,255,255,1)]"
                  )}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              ))}

              <Popover>
                <PopoverTrigger asChild>
                  <button className="react add opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-b from-white to-[#e8e8e8] border border-black/10 hover:border-black/20 text-[#4b4b4b] shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-[transform,opacity,border-color] duration-150 ease-out hover:scale-[1.05] active:scale-[0.97]">
                    <Plus size={12} weight="bold" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-1.5 bg-[#f8f8f8] shadow-[0_3px_12px_rgba(0,0,0,0.3)] border-[0.5px] border-black/20 rounded-[8px] overflow-hidden duration-200 data-[state=open]:ease-[cubic-bezier(0.23,1,0.32,1)]"
                  sideOffset={6}
                >
                  {/* Aqua pinstripe texture background effect */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_1.5px,black_1.5px,black_2px)]" />
                  
                  <div className="flex gap-1 relative z-10">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(msg.id, emoji)}
                        className="p-1.5 hover:bg-[#2765ca] hover:text-white rounded-[4px] text-lg transition-[transform,background-color,color] duration-150 ease-out hover:scale-[1.15] active:scale-[0.97] active:bg-[#1a4b9c]"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

