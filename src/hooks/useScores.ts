"use client";

import useSWR from "swr";
import { LeaderboardAPIResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useScores() {
  return useSWR<LeaderboardAPIResponse>("/api/scores", fetcher, {
    refreshInterval: 60_000,
    dedupingInterval: 30_000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
}
