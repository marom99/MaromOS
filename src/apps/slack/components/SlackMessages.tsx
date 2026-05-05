import avatarAlex from "../assets/avatar-alex.png";
import avatarJamie from "../assets/avatar-jamie.png";
import avatarRiley from "../assets/avatar-riley.png";
import avatarSamira from "../assets/avatar-samira.png";
import { MessageBubble } from "@/components/shared/MessageBubble";
import { ImageAttachment } from "@/components/shared/ImageAttachment";
import { Badge } from "@/components/ui/badge";
import { CaretDown } from "@phosphor-icons/react";

export function SlackMessages() {
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

      <div className="msg">
        <div className="avatar">
          <img src={avatarAlex} alt="Alex Turner" />
        </div>
        <div className="msg-body">
          <div className="msg-head">
            <div className="msg-name">Alex Turner</div>
            <div className="msg-time">9:41 AM</div>
          </div>
          <MessageBubble className="mt-1">
            Morning team! Sharing the latest mockup for the dashboard.
          </MessageBubble>
          <div className="mt-2 mb-1">
            <ImageAttachment 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" 
              alt="dashboard-v3.png"
            />
          </div>
          <div className="reactions">
            <div className="react">👍 3</div>
            <div className="react">❤️ 2</div>
            <div className="react add">☺</div>
          </div>
        </div>
      </div>

      <div className="msg">
        <div className="avatar">
          <img src={avatarJamie} alt="Jamie Lin" />
        </div>
        <div className="msg-body">
          <div className="msg-head">
            <div className="msg-name">Jamie Lin</div>
            <div className="msg-time">9:47 AM</div>
          </div>
          <MessageBubble className="mt-1">
            This is looking great! I especially like the new activity timeline.
          </MessageBubble>
        </div>
      </div>

      <div className="msg">
        <div className="avatar">
          <img src={avatarRiley} alt="Riley Morgan" />
        </div>
        <div className="msg-body">
          <div className="msg-head">
            <div className="msg-name">Riley Morgan</div>
            <div className="msg-time">10:02 AM</div>
          </div>
          <MessageBubble className="mt-1">
            Agreed! One thought: should we surface the filter controls more prominently on the first screen?
          </MessageBubble>
        </div>
      </div>

      <div className="msg">
        <div className="avatar">
          <img src={avatarSamira} alt="Samira Patel" />
        </div>
        <div className="msg-body">
          <div className="msg-head">
            <div className="msg-name">Samira Patel</div>
            <div className="msg-time">10:15 AM</div>
          </div>
          <MessageBubble className="mt-1">
            Good call. I&apos;ll draft a variation and share it here shortly.
          </MessageBubble>
        </div>
      </div>
    </div>
  );
}
