"use client";

import React, { useMemo } from "react";
import { ParticipantEntry } from "@/types";
import { formatScoreToPar } from "@/lib/format";

interface ScoreDistributionProps {
  leaderboard: ParticipantEntry[] | null;
}

interface Bucket {
  label: string;
  min: number;
  max: number;
  count: number;
  isUnderPar: boolean;
}

const BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "-20 to -16", min: -99, max: -16 },
  { label: "-15 to -11", min: -15, max: -11 },
  { label: "-10 to -8", min: -10, max: -8 },
  { label: "-7 to -5", min: -7, max: -5 },
  { label: "-4 to -2", min: -4, max: -2 },
  { label: "-1 to E", min: -1, max: 0 },
  { label: "+1 to +3", min: 1, max: 3 },
  { label: "+4 to +6", min: 4, max: 6 },
  { label: "+7 to +10", min: 7, max: 10 },
  { label: "+11 or more", min: 11, max: 99 },
];

export const ScoreDistribution = React.memo(function ScoreDistribution({
  leaderboard,
}: ScoreDistributionProps) {
  const { buckets, average, median, maxCount } = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) {
      return { buckets: [], average: null, median: null, maxCount: 1 };
    }

    const scores = leaderboard.map((e) => e.totalScore).sort((a, b) => a - b);

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const mid = Math.floor(scores.length / 2);
    const med =
      scores.length % 2 === 0
        ? (scores[mid - 1] + scores[mid]) / 2
        : scores[mid];

    const filled: Bucket[] = BUCKETS.map((b) => ({
      ...b,
      count: scores.filter((s) => s >= b.min && s <= b.max).length,
      isUnderPar: b.max <= 0,
    }));

    // Trim leading/trailing empty buckets
    let start = 0;
    let end = filled.length - 1;
    while (start < end && filled[start].count === 0) start++;
    while (end > start && filled[end].count === 0) end--;
    const trimmed = filled.slice(start, end + 1);

    const max = Math.max(...trimmed.map((b) => b.count), 1);

    return { buckets: trimmed, average: avg, median: med, maxCount: max };
  }, [leaderboard]);

  if (buckets.length === 0) {
    return (
      <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        No scores yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {buckets.map((bucket) => (
          <div key={bucket.label} className="flex items-center gap-2">
            <div
              className="text-[11px] font-[family-name:var(--font-mono)] text-right shrink-0"
              style={{ width: "80px", color: "rgba(255,255,255,0.45)" }}
            >
              {bucket.label}
            </div>
            <div className="flex-1 relative h-5 flex items-center">
              <div
                className="h-3.5 rounded-sm transition-all duration-500"
                style={{
                  width: bucket.count === 0 ? "2px" : `${(bucket.count / maxCount) * 100}%`,
                  backgroundColor: bucket.isUnderPar
                    ? "#FF2D55"
                    : "rgba(255,255,255,0.2)",
                  minWidth: bucket.count > 0 ? "4px" : "2px",
                  opacity: bucket.count === 0 ? 0.2 : 1,
                }}
              />
            </div>
            <div
              className="text-[11px] font-[family-name:var(--font-mono)] shrink-0 w-6 text-right"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {bucket.count}
            </div>
          </div>
        ))}
      </div>

      {(average !== null || median !== null) && (
        <div className="flex gap-4 pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {average !== null && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Avg{" "}
              </span>
              <span
                className="text-[12px] font-[family-name:var(--font-mono)] font-semibold"
                style={{ color: average <= 0 ? "#FF2D55" : "rgba(255,255,255,0.7)" }}
              >
                {formatScoreToPar(Math.round(average))}
              </span>
            </div>
          )}
          {median !== null && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Median{" "}
              </span>
              <span
                className="text-[12px] font-[family-name:var(--font-mono)] font-semibold"
                style={{ color: median <= 0 ? "#FF2D55" : "rgba(255,255,255,0.7)" }}
              >
                {formatScoreToPar(Math.round(median))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
