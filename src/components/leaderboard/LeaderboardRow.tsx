"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ParticipantEntry } from "@/types";
import { PositionBadge } from "@/components/PositionBadge";
import { ScoreCell } from "@/components/ScoreCell";
import { ParticipantDetail } from "@/components/participant/ParticipantDetail";

interface LeaderboardRowProps {
  entry: ParticipantEntry;
  isLeader: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const LeaderboardRow = React.memo(function LeaderboardRow({
  entry,
  isLeader,
  isExpanded,
  onToggle,
}: LeaderboardRowProps) {
  const { participant, positionDisplay, movement, totalScore, bestGolfer } = entry;

  return (
    <div
      className="scoreboard-divider"
      style={
        isLeader
          ? {
              borderLeft: "3px solid var(--masters-gold)",
              boxShadow: "0 0 20px rgba(255, 199, 44, 0.15)",
            }
          : { borderLeft: "3px solid transparent" }
      }
    >
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-3 md:py-0 text-left hover:bg-white/5 transition-colors cursor-pointer"
        style={{ minHeight: "48px" }}
        aria-expanded={isExpanded}
      >
        {/* Position */}
        <div className="w-12 shrink-0">
          <PositionBadge position={positionDisplay} movement={movement} />
        </div>

        {/* Participant name */}
        <div className="flex-1 min-w-0">
          <span
            className="block font-[family-name:var(--font-display)] uppercase tracking-[0.1em] text-sm font-semibold truncate text-white"
          >
            {participant.name}
          </span>
          {bestGolfer && (
            <span
              className="block text-[11px] truncate mt-0.5"
              style={{ color: "var(--text-on-green-dim)" }}
            >
              Best: {bestGolfer.name}
            </span>
          )}
        </div>

        {/* Total score */}
        <div className="shrink-0">
          <ScoreCell
            score={totalScore}
            size={isLeader ? "lg" : "md"}
          />
        </div>

        {/* Expand chevron */}
        <div
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--text-on-green-dim)",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && <ParticipantDetail entry={entry} />}
      </AnimatePresence>
    </div>
  );
});

export { LeaderboardRow };
