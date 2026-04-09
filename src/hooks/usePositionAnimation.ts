"use client";

import { useRef, useState, useEffect } from "react";
import { ParticipantEntry } from "@/types";

export function usePositionAnimation(
  leaderboard: ParticipantEntry[] | null,
  rowHeight: number = 56
): Map<string, number> {
  const prevOrderRef = useRef<string[]>([]);
  const [deltaMap, setDeltaMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!leaderboard) return;

    const currentOrder = leaderboard.map((e) => e.participant.id);
    const prevOrder = prevOrderRef.current;

    if (prevOrder.length === 0) {
      prevOrderRef.current = currentOrder;
      return;
    }

    const deltas = new Map<string, number>();
    currentOrder.forEach((id, newIndex) => {
      const oldIndex = prevOrder.indexOf(id);
      if (oldIndex !== -1 && oldIndex !== newIndex) {
        const delta = (oldIndex - newIndex) * rowHeight;
        deltas.set(id, delta);
      }
    });

    prevOrderRef.current = currentOrder;

    if (deltas.size === 0) return;

    setDeltaMap(deltas);
    // Clear after animation completes (~500ms for spring)
    const timer = setTimeout(() => setDeltaMap(new Map()), 600);
    return () => clearTimeout(timer);
  }, [leaderboard, rowHeight]);

  return deltaMap;
}
