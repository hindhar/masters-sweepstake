"use client";

import React from "react";
import { FunStats, ParticipantEntry, GolferScore } from "@/types";
import { formatScoreToPar } from "@/lib/format";
import { AwardsPanel } from "./AwardsPanel";
import { CarryingPicks } from "./CarryingPicks";
import { DeadWeight } from "./DeadWeight";
import { ScoreDistribution } from "./ScoreDistribution";

interface FunStatsPanelProps {
  stats: FunStats | null;
  leaderboard: ParticipantEntry[] | null;
  golfers: GolferScore[];
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3"
    style={{ color: "var(--masters-gold)" }}
  >
    {children}
  </div>
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="rounded-lg p-4"
    style={{ backgroundColor: "var(--surface-1, #004a34)" }}
  >
    {children}
  </div>
);

const StatCard = React.memo(function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--augusta-surface)" }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2"
        style={{ color: "var(--masters-gold)" }}
      >
        {title}
      </div>
      <div
        className="text-base font-semibold text-white mb-1 truncate"
        title={value}
      >
        {value}
      </div>
      <div
        className="text-xs leading-snug"
        style={{ color: "var(--text-on-green-muted)" }}
      >
        {description}
      </div>
    </div>
  );
});

export const FunStatsPanel = React.memo(function FunStatsPanel({
  stats,
  leaderboard,
  golfers,
}: FunStatsPanelProps) {
  if (!stats && !leaderboard) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg animate-pulse"
            style={{
              backgroundColor: "var(--surface-1, #004a34)",
              height: "100px",
            }}
          />
        ))}
      </div>
    );
  }

  const statCards: StatCardProps[] = stats
    ? [
        {
          title: "Most Popular Pick",
          value: stats.mostPopularGolfer ? stats.mostPopularGolfer.name : "—",
          description: stats.mostPopularGolfer
            ? `Picked by ${stats.mostPopularGolfer.pickedBy} participants — currently ${formatScoreToPar(stats.mostPopularGolfer.score)}`
            : "No data yet",
        },
        {
          title: "Best Pick",
          value: stats.bestPick ? stats.bestPick.golfer : "—",
          description: stats.bestPick
            ? `${stats.bestPick.participant}'s golden goose at ${formatScoreToPar(stats.bestPick.score)}`
            : "No data yet",
        },
        {
          title: "Worst Pick",
          value: stats.worstPick ? stats.worstPick.golfer : "—",
          description: stats.worstPick
            ? `${stats.worstPick.participant} is regretting this one (${formatScoreToPar(stats.worstPick.score)})`
            : "No data yet",
        },
        {
          title: "Biggest Mover",
          value: stats.biggestMover ? stats.biggestMover.participant : "—",
          description: stats.biggestMover
            ? `Up ${stats.biggestMover.positions} place${stats.biggestMover.positions !== 1 ? "s" : ""} since last update`
            : "No movement yet",
        },
        {
          title: "Tightest Race",
          value: stats.tightestRace
            ? `${stats.tightestRace.count} within ${stats.tightestRace.scoreDiff} shot${stats.tightestRace.scoreDiff !== 1 ? "s" : ""}`
            : "—",
          description: stats.tightestRace
            ? "It's nail-biting at the top"
            : "No data yet",
        },
        {
          title: "Contrarian Hero",
          value: stats.contrarianHero ? stats.contrarianHero.golfer : "—",
          description: stats.contrarianHero
            ? `Only ${stats.contrarianHero.pickedBy} picked them — ${stats.contrarianHero.participant} is laughing at ${formatScoreToPar(stats.contrarianHero.score)}`
            : "No dark horses yet",
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      {/* Awards ribbon */}
      <SectionCard>
        <SectionLabel>Awards</SectionLabel>
        <AwardsPanel stats={stats} leaderboard={leaderboard} />
      </SectionCard>

      {/* Carrying picks */}
      <SectionCard>
        <SectionLabel>Carrying Picks</SectionLabel>
        <CarryingPicks leaderboard={leaderboard} golfers={golfers} />
      </SectionCard>

      {/* Dead weight */}
      <SectionCard>
        <SectionLabel>Dead Weight</SectionLabel>
        <DeadWeight leaderboard={leaderboard} golfers={golfers} />
      </SectionCard>

      {/* Score distribution */}
      <SectionCard>
        <SectionLabel>Score Distribution</SectionLabel>
        <ScoreDistribution leaderboard={leaderboard} />
      </SectionCard>

      {/* Existing stat cards */}
      {statCards.length > 0 && (
        <div>
          <div
            className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3"
            style={{ color: "var(--masters-gold)" }}
          >
            Tournament Stats
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
