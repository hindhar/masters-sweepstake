import { FunStats } from "@/types";
import { formatScoreToPar } from "@/lib/format";

interface FunStatsPanelProps {
  stats: FunStats | null;
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
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
}

export function FunStatsPanel({ stats }: FunStatsPanelProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 animate-pulse"
            style={{
              backgroundColor: "var(--augusta-surface)",
              height: "90px",
            }}
          />
        ))}
      </div>
    );
  }

  const cards: StatCardProps[] = [
    {
      title: "Golden Jacket Leader",
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
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
