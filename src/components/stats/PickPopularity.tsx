"use client";

import React, { useMemo } from "react";
import { ParticipantEntry, GolferScore, GroupId } from "@/types";
import { participants } from "@/data/participants";
import { golfers as golferData } from "@/data/golfers";
import { formatScoreToPar } from "@/lib/format";

interface PickPopularityProps {
  leaderboard: ParticipantEntry[] | null;
  golfers: GolferScore[];
}

interface PopularPick {
  name: string;
  group: GroupId;
  pickCount: number;
  pickPct: number;
  scoreToPar: number | null;
  position: string | null;
}

const GROUP_LABELS: Record<GroupId, string> = {
  G1: "G1", G2: "G2", G3: "G3", G4: "G4",
  G5: "G5", G6: "G6", G7: "G7", G8: "G8",
};

export const PickPopularity = React.memo(function PickPopularity({
  leaderboard,
  golfers,
}: PickPopularityProps) {
  const data = useMemo(() => {
    if (!golfers || golfers.length === 0) return null;

    const total = participants.length;
    const golferScoreMap = new Map(golfers.map((g) => [g.name, g]));
    const groups: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

    // Count picks per golfer per group
    const pickCounts = new Map<string, { count: number; group: GroupId }>();
    for (const p of participants) {
      for (const g of groups) {
        const golfer = p.picks[g];
        const key = `${golfer}::${g}`;
        const existing = pickCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          pickCounts.set(key, { count: 1, group: g });
        }
      }
    }

    // Build popularity list per group
    const groupPopularity: Record<GroupId, PopularPick[]> = {} as Record<GroupId, PopularPick[]>;
    for (const g of groups) {
      const groupGolfers = golferData.filter((gd) => gd.group === g);
      const picks: PopularPick[] = groupGolfers.map((gd) => {
        const key = `${gd.name}::${g}`;
        const pc = pickCounts.get(key);
        const score = golferScoreMap.get(gd.name);
        // Also check name mapping
        let resolvedScore = score;
        if (!resolvedScore) {
          // Try case-insensitive
          for (const [k, v] of golferScoreMap) {
            if (k.toLowerCase() === gd.name.toLowerCase()) {
              resolvedScore = v;
              break;
            }
          }
        }
        return {
          name: gd.name,
          group: g,
          pickCount: pc?.count ?? 0,
          pickPct: Math.round(((pc?.count ?? 0) / total) * 100),
          scoreToPar: resolvedScore?.scoreToPar ?? null,
          position: resolvedScore?.positionDisplay ?? null,
        };
      }).sort((a, b) => b.pickCount - a.pickCount);

      groupPopularity[g] = picks;
    }

    // Overall most/least popular
    const allPicks: PopularPick[] = [];
    for (const g of groups) {
      allPicks.push(...groupPopularity[g]);
    }
    const mostPopular = [...allPicks].filter(p => p.pickCount > 0).sort((a, b) => b.pickCount - a.pickCount).slice(0, 10);
    const leastPopular = [...allPicks].filter(p => p.pickCount > 0 && p.pickCount <= 3).sort((a, b) => a.pickCount - b.pickCount).slice(0, 5);
    const unpicked = allPicks.filter(p => p.pickCount === 0);

    return { groupPopularity, mostPopular, leastPopular, unpicked, total };
  }, [golfers]);

  if (!data) {
    return <p className="text-sm" style={{ color: "var(--text-on-green-dim)" }}>Waiting for data...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Most popular overall */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: "var(--text-on-green-muted)" }}>
          Most Popular Picks
        </div>
        <div className="space-y-1">
          {data.mostPopular.map((p) => (
            <div key={`${p.name}-${p.group}`} className="flex items-center gap-2 py-1.5 px-2 rounded" style={{ backgroundColor: "rgba(0,80,58,0.4)" }}>
              <span className="text-[10px] font-[family-name:var(--font-mono)] font-semibold w-6 shrink-0" style={{ color: "var(--masters-gold)" }}>
                {GROUP_LABELS[p.group]}
              </span>
              <span className="flex-1 text-sm text-white/90 truncate">{p.name}</span>
              {/* Bar */}
              <div className="w-20 h-2 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.pickPct}%`,
                    backgroundColor: "var(--masters-gold)",
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="text-[11px] font-[family-name:var(--font-mono)] w-10 text-right shrink-0" style={{ color: "var(--text-on-green-muted)" }}>
                {p.pickPct}%
              </span>
              {p.scoreToPar !== null && (
                <span className={`text-xs font-[family-name:var(--font-mono)] font-semibold w-8 text-right shrink-0 ${
                  p.scoreToPar < 0 ? "text-[#FF2D55]" : p.scoreToPar > 0 ? "text-white/40" : "text-white/60"
                }`}>
                  {formatScoreToPar(p.scoreToPar)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hipster picks (least popular) */}
      {data.leastPopular.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: "var(--text-on-green-muted)" }}>
            Hipster Picks (1-3 selectors)
          </div>
          <div className="space-y-1">
            {data.leastPopular.map((p) => (
              <div key={`${p.name}-${p.group}`} className="flex items-center gap-2 py-1.5 px-2 rounded" style={{ backgroundColor: "rgba(0,80,58,0.3)" }}>
                <span className="text-[10px] font-[family-name:var(--font-mono)] font-semibold w-6 shrink-0" style={{ color: "var(--masters-gold)" }}>
                  {GROUP_LABELS[p.group]}
                </span>
                <span className="flex-1 text-sm text-white/70 truncate">{p.name}</span>
                <span className="text-[11px] shrink-0" style={{ color: "var(--text-on-green-dim)" }}>
                  {p.pickCount} pick{p.pickCount !== 1 ? "s" : ""}
                </span>
                {p.scoreToPar !== null && (
                  <span className={`text-xs font-[family-name:var(--font-mono)] font-semibold w-8 text-right shrink-0 ${
                    p.scoreToPar < 0 ? "text-[#FF2D55]" : p.scoreToPar > 0 ? "text-white/40" : "text-white/60"
                  }`}>
                    {formatScoreToPar(p.scoreToPar)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unpicked golfers */}
      {data.unpicked.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: "var(--text-on-green-dim)" }}>
            Unpicked ({data.unpicked.length} golfers nobody wanted)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.unpicked.map((p) => (
              <span
                key={`${p.name}-${p.group}`}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "var(--text-on-green-dim)" }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
