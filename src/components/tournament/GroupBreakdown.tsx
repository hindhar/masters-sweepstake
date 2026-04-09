"use client";

import React, { useMemo } from "react";
import { GolferScore, ParticipantEntry, GroupId } from "@/types";
import { golfers as golferData } from "@/data/golfers";
import { ScoreCell } from "@/components/ScoreCell";

interface GroupBreakdownProps {
  golfers: GolferScore[];
  participants: ParticipantEntry[];
}

const GROUP_SHORT: Record<GroupId, string> = {
  G1: "G1",
  G2: "G2",
  G3: "G3",
  G4: "G4",
  G5: "G5",
  G6: "G6",
  G7: "G7",
  G8: "G8",
};

const ALL_GROUPS: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

export const GroupBreakdown = React.memo(function GroupBreakdown({
  golfers,
  participants,
}: GroupBreakdownProps) {
  const groupLeaders = useMemo(() => {
    if (!golfers || golfers.length === 0) return null;

    const golferScoreMap = new Map(golfers.map((g) => [g.name, g]));

    return ALL_GROUPS.map((group) => {
      const groupGolfers = golferData
        .filter((g) => g.group === group)
        .map((g) => ({
          info: g,
          score: golferScoreMap.get(g.name) ?? null,
        }))
        .filter((g) => g.score !== null)
        .sort(
          (a, b) => (a.score!.scoreToPar ?? 99) - (b.score!.scoreToPar ?? 99)
        );

      const leader = groupGolfers[0] ?? null;

      let pickedBy = 0;
      if (leader?.info) {
        for (const p of participants) {
          for (const gs of p.golferScores) {
            if (gs.golferName.toLowerCase() === leader.info.name.toLowerCase()) {
              pickedBy++;
            }
          }
        }
      }

      return { group, leader, pickedBy };
    });
  }, [golfers, participants]);

  if (!groupLeaders) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(180deg, rgba(0,74,52,0.9), rgba(0,61,41,0.95))",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <h2
          className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-4"
          style={{ color: "var(--masters-gold)" }}
        >
          Group Leaders
        </h2>
        <p className="text-sm" style={{ color: "var(--text-on-green-dim)" }}>
          Waiting for data...
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(0,74,52,0.9), rgba(0,61,41,0.95))",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Panel header */}
      <div
        className="px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.10)",
          borderBottom: "1px solid rgba(255,199,44,0.10)",
        }}
      >
        <h2
          className="text-[11px] uppercase tracking-[0.2em] font-semibold"
          style={{ color: "var(--masters-gold)" }}
        >
          Group Leaders
        </h2>
      </div>

      {/* Group cards */}
      <div className="p-3">
        <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto pb-2 md:pb-0">
          {groupLeaders.map(({ group, leader, pickedBy }) => (
            <div
              key={group}
              className="rounded-lg p-3 shrink-0 w-36 md:w-auto cursor-default"
              style={{
                backgroundColor: "rgba(0,61,41,0.6)",
                border: "1px solid rgba(255,199,44,0.10)",
                transition: "border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,199,44,0.3)";
                el.style.boxShadow = "0 0 12px rgba(255,199,44,0.08) inset, 0 4px 12px rgba(0,0,0,0.3)";
                el.style.backgroundColor = "rgba(0,74,52,0.7)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,199,44,0.10)";
                el.style.boxShadow = "none";
                el.style.backgroundColor = "rgba(0,61,41,0.6)";
              }}
            >
              {/* Group label */}
              <div
                className="text-[10px] uppercase tracking-[0.15em] font-semibold font-[family-name:var(--font-mono)] mb-1.5"
                style={{ color: "var(--masters-gold)" }}
              >
                {GROUP_SHORT[group]}
              </div>

              {leader ? (
                <>
                  <div
                    className="text-xs font-medium truncate mb-1"
                    title={leader.info.name}
                  >
                    {leader.info.name}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <ScoreCell score={leader.score!.scoreToPar} size="sm" />
                    <span
                      className="text-[10px] shrink-0"
                      style={{ color: "var(--text-on-green-dim)" }}
                    >
                      {pickedBy} pick{pickedBy !== 1 ? "s" : ""}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  className="text-xs"
                  style={{ color: "var(--text-on-green-dim)" }}
                >
                  No data
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
