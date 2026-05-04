export function SlackChannelHeader() {
  return (
    <header className="main-head">
      <div>
        <div className="ch-title"># design-lab</div>
        <div className="ch-sub">
          <span className="play"></span> Ideas, UI explorations, and design feedback
        </div>
      </div>
      <div className="head-right">
        <div className="head-stat">
          <svg viewBox="0 0 16 16">
            <circle cx="5.5" cy="6" r="2.3" />
            <circle cx="10.5" cy="6" r="2.3" />
            <path d="M2 13c0-2.2 1.8-3.5 3.5-3.5h1c1.7 0 3.5 1.3 3.5 3.5M8 13c0-2.2 1.8-3.5 3.5-3.5h1c1.2 0 2.5.7 3 2" />
          </svg>
          12
        </div>
        <div className="info-btn">i</div>
        <div className="search-wrap">
          <input type="text" placeholder="Search" />
          <svg viewBox="0 0 16 16">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <path d="M10 10l3.5 3.5" />
          </svg>
        </div>
      </div>
    </header>
  );
}
