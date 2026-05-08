import { SearchInput } from "@/components/ui/search-input";
import { Users, Info } from "@phosphor-icons/react";
import { useState } from "react";

export function SlackChannelHeader() {
  const [search, setSearch] = useState("");

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
          <Users size={12} weight="regular" />
          12
        </div>
        <button className="info-btn" title="Channel info">
          <Info size={10} weight="bold" />
        </button>
        <div className="search-wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
            className="w-[168px]"
          />
        </div>
      </div>
    </header>
  );
}
