"use client";

import { useMemo, useRef } from "react";
import { useScores } from "./useScores";
import { calculateParticipantScore } from "@/lib/scoring";
import { computeRankings } from "@/lib/rankings";
import { ParticipantEntry, GolferScore, FunStats } from "@/types";
import { participants as _participants } from "@/data/participants";

export function useLeaderboard(searchQuery?: string) {
  const { data, error, isLoading, isValidating } = useScores();
  const previousPositionsRef = useRef<Map<string, number>>(new Map());

  const leaderboard = useMemo(() => {
    if (!data || !data.golfers || data.golfers.length === 0) return null;

    const golferMap = new Map<string, GolferScore>(
      data.golfers.map((g) => [g.name, g])
    );

    const entries = _participants.map((p) =>
      calculateParticipantScore(p, golferMap)
    );

    const ranked = computeRankings(entries, previousPositionsRef.current);

    // Store current positions for next comparison
    const newPositions = new Map<string, number>();
    for (const entry of ranked) {
      newPositions.set(entry.participant.id, entry.position);
    }
    previousPositionsRef.current = newPositions;

    return ranked;
  }, [data]);

  const filtered = useMemo(() => {
    if (!leaderboard) return null;
    if (!searchQuery || searchQuery.trim() === "") return leaderboard;
    const q = searchQuery.toLowerCase().trim();
    return leaderboard.filter((e) =>
      e.participant.name.toLowerCase().includes(q)
    );
  }, [leaderboard, searchQuery]);

  const funStats = useMemo(() => {
    if (!leaderboard || !data?.golfers) return null;
    return computeFunStats(leaderboard, data.golfers);
  }, [leaderboard, data]);

  return {
    leaderboard: filtered,
    fullLeaderboard: leaderboard,
    error,
    isLoading,
    isValidating,
    tournament: data?.tournament ?? null,
    golfers: data?.golfers ?? [],
    funStats,
  };
}

function computeFunStats(
  leaderboard: ParticipantEntry[],
  golfers: GolferScore[]
): FunStats {
  let bestPick: FunStats["bestPick"] = null;
  let worstPick: FunStats["worstPick"] = null;

  for (const entry of leaderboard) {
    for (const gs of entry.golferScores) {
      if (!gs.score) continue;
      const s = gs.score.scoreToPar;
      if (!bestPick || s < bestPick.score) {
        bestPick = {
          participant: entry.participant.name,
          golfer: gs.golferName,
          score: s,
        };
      }
      if (!worstPick || s > worstPick.score) {
        worstPick = {
          participant: entry.participant.name,
          golfer: gs.golferName,
          score: s,
        };
      }
    }
  }

  // Biggest mover
  let biggestMover: FunStats["biggestMover"] = null;
  for (const entry of leaderboard) {
    if (entry.movement > 0) {
      if (!biggestMover || entry.movement > biggestMover.positions) {
        biggestMover = {
          participant: entry.participant.name,
          positions: entry.movement,
        };
      }
    }
  }

  // Tightest race (how many in top 5 and score diff)
  const top5 = leaderboard.slice(0, 5);
  const tightestRace: FunStats["tightestRace"] =
    top5.length >= 2
      ? {
          count: top5.filter((e) => e.position <= 5).length,
          scoreDiff: top5[top5.length - 1].totalScore - top5[0].totalScore,
        }
      : null;

  // Most popular golfer (by how many people picked them)
  const golferPickCount = new Map<string, number>();
  for (const entry of leaderboard) {
    for (const gs of entry.golferScores) {
      golferPickCount.set(
        gs.golferName,
        (golferPickCount.get(gs.golferName) || 0) + 1
      );
    }
  }
  let mostPopularGolfer: FunStats["mostPopularGolfer"] = null;
  for (const [name, count] of golferPickCount) {
    const golferScore = golfers.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    if (golferScore) {
      if (!mostPopularGolfer || count > mostPopularGolfer.pickedBy) {
        mostPopularGolfer = {
          name,
          pickedBy: count,
          score: golferScore.scoreToPar,
        };
      }
    }
  }

  // Contrarian hero: golfer picked by fewest people who has the best score
  let contrarianHero: FunStats["contrarianHero"] = null;
  for (const entry of leaderboard) {
    for (const gs of entry.golferScores) {
      if (!gs.score) continue;
      const pickCount = golferPickCount.get(gs.golferName) || 0;
      if (pickCount <= 5 && gs.score.scoreToPar < 0) {
        if (!contrarianHero || gs.score.scoreToPar < contrarianHero.score) {
          contrarianHero = {
            participant: entry.participant.name,
            golfer: gs.golferName,
            pickedBy: pickCount,
            score: gs.score.scoreToPar,
          };
        }
      }
    }
  }

  return {
    bestPick,
    worstPick,
    biggestMover,
    tightestRace,
    mostPopularGolfer,
    contrarianHero,
  };
}
