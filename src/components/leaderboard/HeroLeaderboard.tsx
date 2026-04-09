"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ParticipantEntry } from "@/types";
import { SearchBar } from "@/components/SearchBar";
import { LeaderboardRow } from "./LeaderboardRow";
import { useScoreChanges } from "@/hooks/useScoreChanges";
import { usePositionAnimation } from "@/hooks/usePositionAnimation";
import { LeaderCelebration } from "@/components/LeaderCelebration";

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

  const changedIds = useScoreChanges(leaderboard);
  const deltaMap = usePositionAnimation(leaderboard);

  const leaderId =
    leaderboard && leaderboard.length > 0
      ? leaderboard.find((e) => e.position === 1)?.participant.id ?? null
      : null;

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section
      className="w-full rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--augusta-surface)" }}
    >
      <LeaderCelebration leaderId={leaderId} />

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
            {leaderboard.map((entry, i) => {
              const id = entry.participant.id;
              const delta = deltaMap.get(id);
              const hasScoreChange = changedIds.has(id);
              const needsMotion = delta !== undefined || hasScoreChange;

              const row = (
                <div
                  className={
                    hasScoreChange
                      ? "ring-1 ring-[rgba(255,199,44,0.3)] transition-shadow"
                      : undefined
                  }
                >
                  <LeaderboardRow
                    key={id}
                    entry={entry}
                    isLeader={entry.position === 1}
                    isExpanded={expandedId === id}
                    onToggle={handleToggle}
                  />
                </div>
              );

              if (needsMotion) {
                return (
                  <motion.div
                    key={id}
                    initial={{ y: delta ?? 0, opacity: delta !== undefined ? 0.6 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {row}
                  </motion.div>
                );
              }

              // Staggered entrance on first load (leaderboard transitions from null to populated)
              return (
                <motion.div
                  key={id}
                  custom={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.03, 0.6),
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  {row}
                </motion.div>
              );
            })}
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
