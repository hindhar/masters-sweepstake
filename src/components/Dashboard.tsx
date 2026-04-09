"use client";

import { useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { MastersHeader } from "./MastersHeader";
import { HeroLeaderboard } from "./leaderboard/HeroLeaderboard";
import { LiveTicker } from "./tournament/LiveTicker";
import { GroupBreakdown } from "./tournament/GroupBreakdown";
import { FunStatsPanel } from "./stats/FunStatsPanel";

type Tab = "leaderboard" | "tournament" | "groups" | "stats";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("leaderboard");
  const [search, setSearch] = useState("");

  const {
    leaderboard,
    fullLeaderboard,
    tournament,
    golfers,
    funStats,
    isLoading,
    isValidating,
  } = useLeaderboard(search);

  return (
    <div className="min-h-screen bg-augusta flex flex-col">
      {/* Header */}
      <MastersHeader tournament={tournament} isValidating={isValidating} />

      {/* Mobile tab bar */}
      <div className="lg:hidden flex border-b border-white/[0.06]">
        {(
          [
            { key: "leaderboard", label: "Leaderboard" },
            { key: "tournament", label: "Tournament" },
            { key: "groups", label: "Groups" },
            { key: "stats", label: "Stats" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.15em] transition-colors ${
              activeTab === key
                ? "text-masters-gold border-b-2 border-masters-gold"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full">
        {/* Left: Leaderboard */}
        <div
          className={`flex-1 min-w-0 p-4 lg:p-6 ${
            activeTab !== "leaderboard" ? "hidden lg:block" : ""
          }`}
        >
          <HeroLeaderboard
            leaderboard={leaderboard}
            isLoading={isLoading}
            isValidating={isValidating}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Right sidebar (desktop) / tabs (mobile) */}
        <div className="lg:w-[380px] lg:border-l lg:border-white/[0.06] overflow-y-auto">
          {/* Tournament Ticker */}
          <div
            className={`${
              activeTab !== "tournament" ? "hidden lg:block" : ""
            }`}
          >
            <LiveTicker golfers={golfers} />
          </div>

          {/* Group Breakdown */}
          <div
            className={`${
              activeTab !== "groups" ? "hidden lg:block" : ""
            }`}
          >
            <GroupBreakdown
              golfers={golfers}
              participants={fullLeaderboard ?? []}
            />
          </div>

          {/* Fun Stats */}
          <div
            className={`${
              activeTab !== "stats" ? "hidden lg:block" : ""
            }`}
          >
            <FunStatsPanel stats={funStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
