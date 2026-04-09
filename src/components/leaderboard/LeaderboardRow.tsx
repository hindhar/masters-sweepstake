"use client";

import React, { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ParticipantEntry } from "@/types";
import { ScoreCell } from "@/components/ScoreCell";
import { ParticipantDetail } from "@/components/participant/ParticipantDetail";
import { useMyEntry } from "@/hooks/useMyEntry";

interface LeaderboardRowProps {
  entry: ParticipantEntry;
  isLeader: boolean;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function PositionDisplay({ position }: { position: number }) {
  if (position === 1) {
    return (
      <span className="w-7 h-7 rounded-full bg-[#FFC72C] text-[#003d29] flex items-center justify-center text-xs font-bold">
        1
      </span>
    );
  }
  if (position === 2) {
    return (
      <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">
        2
      </span>
    );
  }
  if (position === 3) {
    return (
      <span className="w-7 h-7 rounded-full bg-amber-700/40 text-amber-200 flex items-center justify-center text-xs font-bold">
        3
      </span>
    );
  }
  return (
    <span
      className="text-sm font-semibold font-[family-name:var(--font-mono)]"
      style={{ color: "var(--text-on-green-dim)" }}
    >
      {position}
    </span>
  );
}

const LeaderboardRow = React.memo(function LeaderboardRow({
  entry,
  isLeader,
  isExpanded,
  onToggle,
}: LeaderboardRowProps) {
  const { participant, positionDisplay, movement, totalScore, bestGolfer, golferScores } = entry;
  const { myId, setMyId } = useMyEntry();
  const isMe = myId === participant.id;
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute counting indicator
  const totalWithScores = golferScores.filter((gs) => gs.score !== null).length;
  const countingCount = golferScores.filter((gs) => gs.counting).length;

  const numericPosition = entry.position;

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setMyId(participant.id);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const leaderGradient = isLeader
    ? "bg-gradient-to-r from-[rgba(255,199,44,0.08)] to-transparent"
    : "";
  const meBackground = isMe ? "bg-[rgba(207,75,122,0.06)]" : "";

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
        onClick={() => onToggle(participant.id)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.99] transition-transform duration-75 ${leaderGradient} ${meBackground}`}
        style={{ minHeight: "56px" }}
        aria-expanded={isExpanded}
      >
        {/* Position */}
        <div className="w-12 shrink-0 flex items-center">
          <PositionDisplay position={numericPosition} />
          {movement !== 0 && (
            <span
              className="ml-1 text-[9px]"
              style={{ color: movement > 0 ? "var(--move-up)" : "var(--move-down)" }}
            >
              {movement > 0 ? `+${movement}` : movement}
            </span>
          )}
        </div>

        {/* Participant name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="block font-[family-name:var(--font-display)] uppercase tracking-[0.1em] text-sm font-semibold truncate"
              style={{ color: isLeader ? "#FFC72C" : "white" }}
            >
              {participant.name}
            </span>
            {isMe && (
              <span className="text-[9px] uppercase bg-[#CF4B7A]/20 text-[#CF4B7A] px-1.5 py-0.5 rounded-full shrink-0 ml-2">
                YOU
              </span>
            )}
          </div>
          {bestGolfer && (
            <span
              className="block text-[11px] truncate mt-0.5"
              style={{ color: "var(--text-on-green-dim)" }}
            >
              Best: {bestGolfer.name}
              {totalWithScores > 0 && (
                <span className="ml-1.5 font-[family-name:var(--font-mono)] text-[10px]">
                  {countingCount}/{totalWithScores}
                </span>
              )}
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
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200"
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
