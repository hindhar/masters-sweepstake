"use client";

import React, { useMemo } from "react";
import { ParticipantEntry, GolferScore } from "@/types";
import { golfers as golferInfoList } from "@/data/golfers";
import { formatScoreToPar } from "@/lib/format";

interface CarryingPicksProps {
  leaderboard: ParticipantEntry[] | null;
  golfers: GolferScore[];
}

interface CarrierRow {
  name: string;
  group: string;
  score: number;
  delta: number;
  pickedBy: number;
}

function scoreColor(score: number): string {
  if (score < 0) return "#FF2D55";
  if (score > 0) return "rgba(255,255,255,0.45)";
  return "rgba(255,255,255,0.7)";
}

export const CarryingPicks = React.memo(function CarryingPicks({
  leaderboard,
  golfers,
}: CarryingPicksProps) {
  const carriers = useMemo<CarrierRow[]>(() => {
    if (!leaderboard || leaderboard.length === 0 || golfers.length === 0) return [];

    // Build pick count and group-level averages
    const groupScores = new Map<string, number[]>();
    const golferPickCount = new Map<string, number>();

    for (const entry of leaderboard) {
      for (const gs of entry.golferScores) {
        if (!gs.score) continue;
        const info = golferInfoList.find(
          (g) => g.name.toLowerCase() === gs.golferName.toLowerCase()
        );
        if (!info) continue;
        const group = info.group;
        if (!groupScores.has(group)) groupScores.set(group, []);
        groupScores.get(group)!.push(gs.score.scoreToPar);
        golferPickCount.set(
          gs.golferName,
          (golferPickCount.get(gs.golferName) ?? 0) + 1
        );
      }
    }

    const groupAverages = new Map<string, number>();
    for (const [group, scores] of groupScores.entries()) {
      if (scores.length > 0) {
        groupAverages.set(group, scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }

    const seen = new Set<string>();
    const rows: CarrierRow[] = [];

    for (const g of golfers) {
      if (seen.has(g.name)) continue;
      seen.add(g.name);
      if (g.status === "cut" || g.status === "withdrawn") continue;

      const info = golferInfoList.find(
        (gi) => gi.name.toLowerCase() === g.name.toLowerCase()
      );
      if (!info) continue;
      const avg = groupAverages.get(info.group);
      if (avg === undefined) continue;
      const delta = avg - g.scoreToPar;
      if (delta <= 0) continue;
      const pickedBy = golferPickCount.get(g.name) ?? 0;
      if (pickedBy === 0) continue;

      rows.push({
        name: g.name,
        group: info.group,
        score: g.scoreToPar,
        delta,
        pickedBy,
      });
    }

    rows.sort((a, b) => b.delta - a.delta);
    return rows.slice(0, 5);
  }, [leaderboard, golfers]);

  if (carriers.length === 0) {
    return (
      <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        No data yet — check back once play starts.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {carriers.map((c, i) => (
        <div
          key={c.name}
          className="flex items-center gap-3 rounded-lg px-3 py-2"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <div
            className="text-[11px] font-[family-name:var(--font-mono)] w-4 text-center"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{c.name}</div>
            <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {c.group} · carrying {c.pickedBy} team{c.pickedBy !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="text-sm font-[family-name:var(--font-mono)] font-semibold"
              style={{ color: scoreColor(c.score) }}
            >
              {formatScoreToPar(c.score)}
            </div>
            <div
              className="text-[11px] font-[family-name:var(--font-mono)] rounded px-1.5 py-0.5"
              style={{ backgroundColor: "rgba(0,255,128,0.15)", color: "#00d46a" }}
            >
              +{c.delta.toFixed(1)} vs grp avg
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
