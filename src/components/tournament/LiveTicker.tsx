"use client";

import React, { useMemo } from "react";
import { GolferScore } from "@/types";
import { ScoreCell } from "@/components/ScoreCell";

interface LiveTickerProps {
  golfers: GolferScore[];
}

export const LiveTicker = React.memo(function LiveTicker({ golfers }: LiveTickerProps) {
  if (!golfers || golfers.length === 0) {
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
          Tournament Leaderboard
        </h2>
        <p className="text-sm" style={{ color: "var(--text-on-green-dim)" }}>
          Waiting for tournament data...
        </p>
      </div>
    );
  }

  const activeGolfers = useMemo(
    () =>
      golfers
        .filter((g) => g.status !== "cut" && g.status !== "withdrawn")
        .sort((a, b) => a.position - b.position),
    [golfers]
  );

  const cutGolfers = useMemo(
    () =>
      golfers
        .filter((g) => g.status === "cut" || g.status === "withdrawn")
        .sort((a, b) => a.scoreToPar - b.scoreToPar),
    [golfers]
  );

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
          Tournament Leaderboard
        </h2>
      </div>

      {/* Column headers */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.15em]"
        style={{ color: "var(--text-on-green-dim)" }}
      >
        <span className="w-10 shrink-0">POS</span>
        <span className="flex-1">GOLFER</span>
        <span className="w-14 text-right shrink-0">SCORE</span>
        <span className="w-12 text-right shrink-0">THRU</span>
      </div>

      {/* Active golfers */}
      <div>
        {activeGolfers.map((golfer) => (
          <div
            key={golfer.name}
            className="flex items-center gap-2 px-4 scoreboard-divider"
            style={{ minHeight: "40px" }}
          >
            <span
              className="w-10 shrink-0 text-xs font-[family-name:var(--font-mono)]"
              style={{ color: "var(--text-on-green-muted)" }}
            >
              {golfer.positionDisplay}
            </span>
            <span className="flex-1 text-sm truncate text-white/80">
              {golfer.name}
            </span>
            <div className="w-14 flex justify-end shrink-0">
              <ScoreCell score={golfer.scoreToPar} size="sm" />
            </div>
            <span
              className="w-12 text-right shrink-0 text-xs font-[family-name:var(--font-mono)]"
              style={{ color: "var(--text-on-green-dim)" }}
            >
              {golfer.thru}
            </span>
          </div>
        ))}
      </div>

      {/* Cut golfers */}
      {cutGolfers.length > 0 && (
        <>
          <div
            className="px-4 py-1.5 text-[10px] uppercase tracking-[0.15em]"
            style={{
              color: "var(--text-on-green-dim)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Missed Cut
          </div>
          <div>
            {cutGolfers.map((golfer) => (
              <div
                key={golfer.name}
                className="flex items-center gap-2 px-4 scoreboard-divider"
                style={{ minHeight: "40px", opacity: 0.4 }}
              >
                <span
                  className="w-10 shrink-0 text-[10px] font-[family-name:var(--font-mono)]"
                  style={{ color: "var(--text-on-green-dim)" }}
                >
                  MC
                </span>
                <span
                  className="flex-1 text-xs truncate"
                  style={{ color: "var(--text-on-green-dim)" }}
                >
                  {golfer.name}
                </span>
                <div className="w-14 flex justify-end shrink-0">
                  <ScoreCell score={golfer.scoreToPar} size="sm" />
                </div>
                <span className="w-12 text-right shrink-0 text-xs" style={{ color: "var(--text-on-green-dim)" }}>
                  -
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
