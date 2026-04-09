"use client";

import { motion } from "framer-motion";
import { ParticipantEntry, GroupId } from "@/types";
import { ScoreCell } from "@/components/ScoreCell";

interface ParticipantDetailProps {
  entry: ParticipantEntry;
}

const GROUP_LABELS: Record<GroupId, string> = {
  G1: "G1",
  G2: "G2",
  G3: "G3",
  G4: "G4",
  G5: "G5",
  G6: "G6",
  G7: "G7",
  G8: "G8",
};

export function ParticipantDetail({ entry }: ParticipantDetailProps) {
  const { golferScores, bestGolfer, worstGolfer } = entry;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className="px-3 pb-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {golferScores.map((gs) => {
          const isBest =
            bestGolfer && gs.golferName === bestGolfer.name;
          const isWorst =
            worstGolfer && gs.golferName === worstGolfer.name;
          const isCut = gs.score?.status === "cut";
          const isMissed = gs.score?.status === "cut" || gs.score?.status === "withdrawn";

          return (
            <div
              key={gs.group}
              className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors"
              style={{
                backgroundColor: isBest
                  ? "rgba(0,150,80,0.18)"
                  : isWorst
                  ? "rgba(200,60,60,0.12)"
                  : "rgba(0,80,58,0.4)",
                opacity: isCut ? 0.5 : 1,
              }}
            >
              {/* Group label */}
              <span
                className="text-xs font-[family-name:var(--font-mono)] font-semibold w-6 shrink-0"
                style={{ color: "var(--masters-gold)" }}
              >
                {GROUP_LABELS[gs.group]}
              </span>

              {/* Golfer name */}
              <span
                className="flex-1 text-sm font-medium truncate"
                style={{
                  color: isCut
                    ? "var(--text-on-green-dim)"
                    : "var(--text-on-green)",
                }}
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
                <span
                  className="text-xs"
                  style={{ color: "var(--text-on-green-dim)" }}
                >
                  —
                </span>
              )}

              {/* Best/worst indicators */}
              {isBest && (
                <span className="text-[10px] font-semibold" style={{ color: "var(--move-up)" }}>
                  BEST
                </span>
              )}
              {isWorst && !isBest && (
                <span className="text-[10px] font-semibold" style={{ color: "var(--move-down)" }}>
                  WORST
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
