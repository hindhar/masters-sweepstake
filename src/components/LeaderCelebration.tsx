"use client";

import { useRef, useEffect } from "react";
import confetti from "canvas-confetti";

interface LeaderCelebrationProps {
  leaderId: string | null;
}

export function LeaderCelebration({ leaderId }: LeaderCelebrationProps) {
  const prevLeaderRef = useRef<string | null>(null);

  useEffect(() => {
    if (!leaderId) return;
    if (prevLeaderRef.current === leaderId) return;

    // Only fire when leader actually changes (not on initial load)
    if (prevLeaderRef.current !== null) {
      const colors = ["#006747", "#FFC72C", "#FFD54F"];

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 },
        colors,
        gravity: 1.2,
        ticks: 150,
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.25 },
          colors,
          gravity: 1.4,
          ticks: 120,
        });
      }, 200);
    }

    prevLeaderRef.current = leaderId;
  }, [leaderId]);

  return null;
}
