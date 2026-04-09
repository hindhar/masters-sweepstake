"use client";

import React from "react";
import { FunStats, ParticipantEntry } from "@/types";
import { formatScoreToPar } from "@/lib/format";

interface AwardCardProps {
  emoji: string;
  title: string;
  winner: string;
  description: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const AwardCard = React.memo(function AwardCard({
  emoji,
  title,
  winner,
  description,
  bgColor,
  borderColor,
  textColor,
}: AwardCardProps) {
  return (
    <div
      className="min-w-[148px] shrink-0 rounded-lg p-3 border"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div
        className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1"
        style={{ color: textColor }}
      >
        {title}
      </div>
      <div className="text-sm font-bold text-white leading-tight truncate" title={winner}>
        {winner}
      </div>
      <div
        className="text-[11px] leading-snug mt-0.5"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {description}
      </div>
    </div>
  );
});

interface AwardsPanelProps {
  stats: FunStats | null;
  leaderboard: ParticipantEntry[] | null;
}

export const AwardsPanel = React.memo(function AwardsPanel({
  stats,
  leaderboard,
}: AwardsPanelProps) {
  const leader = leaderboard?.[0];
  const last = leaderboard?.[leaderboard.length - 1];

  const awards: AwardCardProps[] = [
    {
      emoji: "🏆",
      title: "Green Jacket",
      winner: leader?.participant.name ?? "—",
      description: leader
        ? `${leader.positionDisplay} at ${leader.totalScoreDisplay}`
        : "Tournament not started",
      bgColor: "rgba(212,175,55,0.15)",
      borderColor: "rgba(212,175,55,0.4)",
      textColor: "#d4af37",
    },
    {
      emoji: "🦅",
      title: "Golden Eagle",
      winner: stats?.bestPick?.golfer ?? "—",
      description: stats?.bestPick
        ? `${stats.bestPick.participant}'s pick at ${formatScoreToPar(stats.bestPick.score)}`
        : "No data yet",
      bgColor: "rgba(255,45,85,0.12)",
      borderColor: "rgba(255,45,85,0.35)",
      textColor: "#ff6b8a",
    },
    {
      emoji: "🥄",
      title: "Wooden Spoon",
      winner: last?.participant.name ?? "—",
      description: last
        ? `${last.positionDisplay} at ${last.totalScoreDisplay}`
        : "No data yet",
      bgColor: "rgba(120,120,120,0.12)",
      borderColor: "rgba(120,120,120,0.3)",
      textColor: "#aaa",
    },
    {
      emoji: "🎖",
      title: "Contrarian Medal",
      winner: stats?.contrarianHero?.golfer ?? "—",
      description: stats?.contrarianHero
        ? `${stats.contrarianHero.participant} — only ${stats.contrarianHero.pickedBy} picked them (${formatScoreToPar(stats.contrarianHero.score)})`
        : "No dark horses yet",
      bgColor: "rgba(147,51,234,0.12)",
      borderColor: "rgba(147,51,234,0.35)",
      textColor: "#c084fc",
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
      {awards.map((award) => (
        <AwardCard key={award.title} {...award} />
      ))}
    </div>
  );
});
