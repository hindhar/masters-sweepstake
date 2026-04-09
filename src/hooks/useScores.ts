"use client";

import useSWR from "swr";
import { LeaderboardAPIResponse } from "@/types";

async function fetchFromProxy(): Promise<LeaderboardAPIResponse> {
  const res = await fetch("/api/scores");
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export function useScores() {
  return useSWR<LeaderboardAPIResponse>("espn-scores", fetchFromProxy, {
    refreshInterval: 60_000,
    dedupingInterval: 30_000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
}
