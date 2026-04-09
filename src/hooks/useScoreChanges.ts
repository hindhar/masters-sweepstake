"use client";

import { useRef, useEffect, useState } from "react";
import { ParticipantEntry } from "@/types";

export function useScoreChanges(
  leaderboard: ParticipantEntry[] | null
): Set<string> {
  const prevScoresRef = useRef<Map<string, number>>(new Map());
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!leaderboard) return;

    const changed = new Set<string>();
    for (const entry of leaderboard) {
      const id = entry.participant.id;
      const prev = prevScoresRef.current.get(id);
      if (prev !== undefined && prev !== entry.totalScore) {
        changed.add(id);
      }
    }

    // Update stored scores for next comparison
    const next = new Map<string, number>();
    for (const entry of leaderboard) {
      next.set(entry.participant.id, entry.totalScore);
    }
    prevScoresRef.current = next;

    if (changed.size === 0) return;

    setChangedIds(changed);
    const timer = setTimeout(() => setChangedIds(new Set()), 1500);
    return () => clearTimeout(timer);
  }, [leaderboard]);

  return changedIds;
}
