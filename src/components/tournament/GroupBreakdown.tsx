"use client";

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

export function GroupBreakdown({ golfers, participants }: GroupBreakdownProps) {
  if (!golfers || golfers.length === 0) {
    return (
      <div>
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

  const golferScoreMap = new Map(golfers.map((g) => [g.name, g]));
  const groups: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

  const groupLeaders = groups.map((group) => {
    const groupGolfers = golferData
      .filter((g) => g.group === group)
      .map((g) => ({
        info: g,
        score: golferScoreMap.get(g.name) ?? null,
      }))
      .filter((g) => g.score !== null)
      .sort(
        (a, b) =>
          (a.score!.scoreToPar ?? 99) - (b.score!.scoreToPar ?? 99)
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

  return (
    <div>
      <h2
        className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-4"
        style={{ color: "var(--masters-gold)" }}
      >
        Group Leaders
      </h2>

      {/* Desktop: 4x2, Tablet: 2x4, Mobile: horizontal scroll */}
      <div className="flex md:grid md:grid-cols-4 gap-2 overflow-x-auto pb-2 md:pb-0">
        {groupLeaders.map(({ group, leader, pickedBy }) => (
          <div
            key={group}
            className="rounded-lg p-3 shrink-0 w-36 md:w-auto transition-colors cursor-default"
            style={{
              backgroundColor: "rgba(0, 80, 58, 0.5)",
              border: "1px solid rgba(255,199,44,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(255,199,44,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(255,199,44,0.15)";
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
  );
}
