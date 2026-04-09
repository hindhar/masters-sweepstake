"use client";

import { motion } from "framer-motion";
import { ParticipantEntry, ParticipantGolferScore } from "@/types";
import { ScoreCell } from "@/components/ScoreCell";

interface ParticipantDetailProps {
  entry: ParticipantEntry;
}

function GolferRow({
  gs,
  isCounting,
}: {
  gs: ParticipantGolferScore;
  isCounting: boolean;
}) {
  const isMissed = gs.score?.status === "cut" || gs.score?.status === "withdrawn";

  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors"
      style={{
        backgroundColor: "rgba(0,80,58,0.4)",
        opacity: isCounting ? 1 : 0.4,
      }}
    >
      {/* Counting check or drop indicator */}
      <span className="shrink-0 w-4 flex items-center justify-center">
        {isCounting ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6L5 9L10 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
      </span>

      {/* Group label */}
      <span
        className="text-xs font-[family-name:var(--font-mono)] font-semibold w-6 shrink-0"
        style={{ color: "var(--masters-gold)" }}
      >
        {gs.group}
      </span>

      {/* Golfer name */}
      <span
        className="flex-1 text-sm font-medium truncate"
        style={{ color: isMissed ? "var(--text-on-green-dim)" : "var(--text-on-green)" }}
      >
        {gs.golferName}
      </span>

      {/* Position */}
      {gs.score && !isMissed && (
        <span
          className="text-xs font-[family-name:var(--font-mono)] shrink-0"
          style={{ color: "var(--text-on-green-muted)" }}
        >
          {gs.score.positionDisplay}
        </span>
      )}

      {/* MC badge or score */}
      {isMissed ? (
        <span
          className="text-xs font-[family-name:var(--font-mono)] font-semibold px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "rgba(200,60,60,0.25)",
            color: "var(--move-down)",
          }}
        >
          MC
        </span>
      ) : gs.score ? (
        <ScoreCell score={gs.score.scoreToPar} size="sm" />
      ) : (
        <span className="text-xs" style={{ color: "var(--text-on-green-dim)" }}>
          —
        </span>
      )}
    </div>
  );
}

export function ParticipantDetail({ entry }: ParticipantDetailProps) {
  const { golferScores, totalScore } = entry;

  const countingGolfers = golferScores
    .filter((gs) => gs.counting)
    .sort((a, b) => {
      const aScore = a.score?.scoreToPar ?? 999;
      const bScore = b.score?.scoreToPar ?? 999;
      return aScore - bScore;
    });

  const droppedGolfers = golferScores.filter((gs) => gs.score && !gs.counting);
  const noScoreGolfers = golferScores.filter((gs) => !gs.score && !gs.counting);

  const allDropped = [...droppedGolfers, ...noScoreGolfers];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className="px-3 pb-4 pt-2 space-y-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Counting section */}
        {countingGolfers.length > 0 && (
          <>
            <p
              className="text-[10px] uppercase tracking-[0.12em] font-semibold px-1 pt-1 pb-0.5"
              style={{ color: "#FFC72C" }}
            >
              Counting (Best 4)
            </p>
            {countingGolfers.map((gs) => (
              <GolferRow key={gs.group} gs={gs} isCounting={true} />
            ))}
          </>
        )}

        {/* Dropped section */}
        {allDropped.length > 0 && (
          <>
            <div className="border-t border-white/[0.06] my-2" />
            <p
              className="text-[10px] uppercase tracking-[0.12em] font-semibold px-1 pb-0.5"
              style={{ color: "var(--text-on-green-dim)" }}
            >
              Dropped ({allDropped.length})
            </p>
            {allDropped.map((gs) => (
              <GolferRow key={gs.group} gs={gs} isCounting={false} />
            ))}
          </>
        )}

        {/* Running total bar */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-md mt-2"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.12em] font-semibold"
            style={{ color: "var(--text-on-green-dim)" }}
          >
            Total (Best 4)
          </span>
          <ScoreCell score={totalScore} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}
