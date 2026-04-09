"use client";

import React, { useMemo } from "react";
import { ParticipantEntry, GolferScore } from "@/types";
import { formatScoreToPar } from "@/lib/format";

interface DeadWeightProps {
  leaderboard: ParticipantEntry[] | null;
  golfers: GolferScore[];
}

interface DeadWeightRow {
  name: string;
  score: number;
  pickCount: number;
  damage: number;
}

export const DeadWeight = React.memo(function DeadWeight({
  leaderboard,
  golfers,
}: DeadWeightProps) {
  const deadWeightRows = useMemo<DeadWeightRow[]>(() => {
    if (!leaderboard || leaderboard.length === 0 || golfers.length === 0) return [];

    const golferPickCount = new Map<string, number>();
    for (const entry of leaderboard) {
      for (const gs of entry.golferScores) {
        golferPickCount.set(
          gs.golferName,
          (golferPickCount.get(gs.golferName) ?? 0) + 1
        );
      }
    }

    const rows: DeadWeightRow[] = [];
    const seen = new Set<string>();

    for (const g of golfers) {
      if (seen.has(g.name)) continue;
      seen.add(g.name);

      const pickCount = golferPickCount.get(g.name) ?? 0;
      if (pickCount < 10) continue;
      if (g.scoreToPar <= 0) continue;

      rows.push({
        name: g.name,
        score: g.scoreToPar,
        pickCount,
        damage: pickCount * g.scoreToPar,
      });
    }

    rows.sort((a, b) => b.damage - a.damage);
    return rows.slice(0, 5);
  }, [leaderboard, golfers]);

  if (deadWeightRows.length === 0) {
    return (
      <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        No over-par popular picks yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {deadWeightRows.map((row, i) => (
        <div
          key={row.name}
          className="flex items-center gap-3 rounded-lg px-3 py-2"
          style={{ backgroundColor: "rgba(255,45,85,0.08)", borderLeft: "2px solid rgba(255,45,85,0.35)" }}
        >
          <div
            className="text-[11px] font-[family-name:var(--font-mono)] w-4 text-center"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{row.name}</div>
            <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              picked by {row.pickCount} teams
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="text-sm font-[family-name:var(--font-mono)] font-semibold"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {formatScoreToPar(row.score)}
            </div>
            <div
              className="text-[11px] font-[family-name:var(--font-mono)] rounded px-1.5 py-0.5"
              style={{ backgroundColor: "rgba(255,45,85,0.15)", color: "#FF2D55" }}
            >
              +{row.damage} collective
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
