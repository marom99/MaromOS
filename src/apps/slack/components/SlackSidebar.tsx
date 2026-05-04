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
          <svg viewBox="0 0 16 16">
            <path d="M2 3.5A2.5 2.5 0 0 1 4.5 1h7A2.5 0 0 1 14 3.5v4A2.5 0 0 1 11.5 10H8l-3.5 3v-3H4.5A2.5 0 0 1 2 7.5v-4z" />
          </svg>
          <span>Threads</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="5.5" />
            <text x="4.2" y="11.5" fontSize="9" fontFamily="Arial" fill="none" stroke="currentColor" strokeWidth="1.2">
              @
            </text>
          </svg>
          <span>Mentions</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 16 16">
            <path d="M4 2.5v11l4-2.5 4 2.5v-11z" />
          </svg>
          <span>Bookmarks</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 16 16">
            <rect x="3.5" y="2" width="9" height="12" rx="1" />
            <path d="M6 5h4M6 8h4M6 11h3" />
          </svg>
          <span>Drafts</span>
        </div>
        <div className="nav-item">
          <svg viewBox="0 0 16 16">
            <circle cx="3.5" cy="8" r="1.2" />
            <circle cx="8" cy="8" r="1.2" />
            <circle cx="12.5" cy="8" r="1.2" />
          </svg>
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
        <svg viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span>Invite People</span>
      </div>
    </aside>
  );
}
