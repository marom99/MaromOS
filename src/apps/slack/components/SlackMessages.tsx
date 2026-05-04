import avatarAlex from "../assets/avatar-alex.png";
import avatarJamie from "../assets/avatar-jamie.png";
import avatarRiley from "../assets/avatar-riley.png";
import avatarSamira from "../assets/avatar-samira.png";
import fileIcon from "../assets/file-icon.png";
import { MessageBubble } from "@/components/shared/MessageBubble";
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
          <div className="file">
            <div className="file-ic">
              <img src={fileIcon} alt="File icon" />
            </div>
            <div className="file-meta">
              <div className="file-name">dashboard-v3.png</div>
              <div className="file-size">2.4 MB</div>
            </div>
            <div className="file-btn">
              <svg viewBox="0 0 16 16">
                <path d="M8 3v8M5 8l3 3 3-3M4 13h8" />
              </svg>
            </div>
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
