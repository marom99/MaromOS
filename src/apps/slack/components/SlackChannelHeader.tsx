import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        <Badge variant="outline" className="head-stat border-[#bdbfc3] bg-transparent text-[#5a5c5f] font-normal gap-1.5 h-6 px-2">
          <Users size={16} weight="regular" />
          12
        </Badge>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="info-btn h-5 w-5 rounded-full border border-[#c5c7ca] bg-gradient-to-b from-white to-[#f0f1f2] shadow-[inset_0_1px_0_#fff] p-0 flex items-center justify-center"
        >
          <Info size={14} weight="bold" />
        </Button>

        <div className="search-wrap">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search"
            className="w-[176px]"
          />
        </div>
      </div>
    </header>
  );
}
