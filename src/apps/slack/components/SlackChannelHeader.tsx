import { SearchInput } from "@/components/ui/search-input";
import { Users, Info } from "@phosphor-icons/react";
import { useState } from "react";
import type { SlackChannelContent } from "../data/channelContent";

interface SlackChannelHeaderProps {
  channel: SlackChannelContent;
}

export function SlackChannelHeader({ channel }: SlackChannelHeaderProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="main-head">
      <div>
        <div className="ch-title"># {channel.name}</div>
        <div className="ch-sub">
          <span className="play"></span> {channel.topic}
        </div>
      </div>
      <div className="head-right">
        <div className="head-stat">
          <Users size={12} weight="regular" />
          {channel.memberCount}
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
