import {
  ChatCircleDots,
  At,
  Bookmark,
  NotePencil,
  DotsThree,
  UserCirclePlus,
} from "@phosphor-icons/react";
import wsIcon from "../assets/workspace-icon.png";
import dmAvatar from "../assets/dm-avatar.png";

export function SlackSidebar() {
  return (
    <aside className="sidebar">
      <div className="ws-head">
        <div className="ws-icon">
          <img src={wsIcon} alt="Workspace icon" />
        </div>
        <div className="ws-meta">
          <div className="ws-name">
            Studio Workspace{" "}
            <svg viewBox="0 0 8 5">
              <path d="M0 0l4 5 4-5z" />
            </svg>
          </div>
          <div className="ws-status">
            <span className="ws-dot"></span> Active
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-item">
          <ChatCircleDots size={16} weight="regular" />
          <span>Threads</span>
        </div>
        <div className="nav-item">
          <At size={16} weight="regular" />
          <span>Mentions</span>
        </div>
        <div className="nav-item">
          <Bookmark size={16} weight="regular" />
          <span>Bookmarks</span>
        </div>
        <div className="nav-item">
          <NotePencil size={16} weight="regular" />
          <span>Drafts</span>
        </div>
        <div className="nav-item">
          <DotsThree size={16} weight="bold" />
          <span>More</span>
        </div>
      </nav>

      <div className="section">
        <div className="section-head">
          <div className="section-title">Channels</div>
          <div className="plus">+</div>
        </div>
        <div className="list">
          <div className="channel">
            <span className="hash">#</span> announcements
          </div>
          <div className="channel">
            <span className="hash">#</span> general
          </div>
          <div className="channel active">
            <span className="hash">#</span> design-lab
          </div>
          <div className="channel">
            <span className="hash">#</span> feedback
          </div>
          <div className="channel">
            <span className="hash">#</span> random
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <div className="section-title">Direct Messages</div>
          <div className="plus">+</div>
        </div>
        <div className="dm-list">
          <div className="dm">
            <div className="dm-avatar">
              <img src={dmAvatar} alt="Jordan Ellis" />
              <div className="presence"></div>
            </div>
            <div className="dm-name">Jordan Ellis</div>
          </div>
          <div className="dm">
            <div className="dm-avatar">
              <img src={dmAvatar} alt="Taylor Kim" />
              <div className="presence"></div>
            </div>
            <div className="dm-name">Taylor Kim</div>
          </div>
          <div className="dm">
            <div className="dm-avatar">
              <img src={dmAvatar} alt="Casey Park" />
              <div className="presence"></div>
            </div>
            <div className="dm-name">Casey Park</div>
          </div>
          <div className="dm">
            <div className="dm-avatar">
              <img src={dmAvatar} alt="Morgan Liu" />
              <div className="presence"></div>
            </div>
            <div className="dm-name">Morgan Liu</div>
          </div>
        </div>
      </div>

      <div className="invite">
        <UserCirclePlus size={16} weight="regular" />
        <span>Invite People</span>
      </div>
    </aside>
  );
}
