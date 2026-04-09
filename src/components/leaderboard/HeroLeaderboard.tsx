"use client";

import { useState, useCallback } from "react";
import { ParticipantEntry } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { LeaderboardRow } from "./LeaderboardRow";

interface HeroLeaderboardProps {
  leaderboard: ParticipantEntry[] | null;
  isLoading: boolean;
  isValidating: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

export function HeroLeaderboard({
  leaderboard,
  isLoading,
  isValidating,
  search,
  onSearchChange,
}: HeroLeaderboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section
      className="w-full rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--augusta-surface)" }}
    >
      {/* Search + column headers */}
      <div className="px-4 pt-4 pb-2 space-y-3">
        <SearchBar value={search} onChange={onSearchChange} />

        {/* Column headers */}
        <div
          className="flex items-center gap-3 px-3 text-[10px] uppercase tracking-[0.15em] font-semibold"
          style={{ color: "var(--text-on-green-dim)" }}
        >
          <span className="w-12 shrink-0">POS</span>
          <span className="flex-1">PARTICIPANT</span>
          <span className="shrink-0">TOTAL</span>
          <span className="w-4 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* Leaderboard rows */}
      <div>
        {isLoading && !leaderboard && (
          <div className="flex flex-col gap-2 px-4 py-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded animate-pulse"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              />
            ))}
            <p
              className="text-center text-sm mt-2"
              style={{ color: "var(--text-on-green-dim)" }}
            >
              Loading scores...
            </p>
          </div>
        )}

        {!isLoading && leaderboard && leaderboard.length === 0 && (
          <p
            className="text-center py-10 text-sm"
            style={{ color: "var(--text-on-green-dim)" }}
          >
            No participants found.
          </p>
        )}

        {leaderboard && (
          <div>
            {leaderboard.map((entry) => (
              <LeaderboardRow
                key={entry.participant.id}
                entry={entry}
                isLeader={entry.position === 1}
                isExpanded={expandedId === entry.participant.id}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {isValidating && leaderboard && (
          <div
            className="text-center py-2 text-[11px]"
            style={{ color: "var(--text-on-green-dim)" }}
          >
            Refreshing...
          </div>
        )}
      </div>
    </section>
  );
}
