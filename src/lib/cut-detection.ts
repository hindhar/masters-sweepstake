import { GolferScore, StoredSnapshot, ManualOverride } from "@/types";

/**
 * Detect golfers that were in a previous snapshot but are missing from the
 * current live feed (i.e., ESPN has removed them after the cut).
 * Returns the missing golfers with status "cut" and their frozen scores.
 */
export function detectMissingGolfers(
  currentGolfers: GolferScore[],
  snapshot: StoredSnapshot
): GolferScore[] {
  const currentNames = new Set(currentGolfers.map((g) => g.name.toLowerCase()));

  return snapshot.golfers
    .filter((g) => !currentNames.has(g.name.toLowerCase()))
    .map((g) => ({
      ...g,
      status: "cut" as const,
      today: "-",
      thru: "-",
    }));
}

/**
 * Merge live golfers with missing (cut) golfers and apply manual overrides.
 * Overrides take precedence over both live and missing data.
 */
export function mergeGolfers(
  liveGolfers: GolferScore[],
  missingGolfers: GolferScore[],
  overrides: ManualOverride[]
): GolferScore[] {
  const merged = [...liveGolfers, ...missingGolfers];

  if (!overrides.length) return merged;

  const overrideMap = new Map(
    overrides.map((o) => [o.name.toLowerCase(), o])
  );

  return merged.map((g) => {
    const override = overrideMap.get(g.name.toLowerCase());
    if (!override) return g;
    return {
      ...g,
      scoreToPar: override.scoreToPar,
      scoreToParDisplay:
        override.scoreToPar === 0
          ? "E"
          : override.scoreToPar > 0
          ? `+${override.scoreToPar}`
          : `${override.scoreToPar}`,
      status: override.status,
    };
  });
}

/**
 * Detect from a status description string what round is current and whether
 * that round is complete.
 */
export function detectRoundCompletion(statusDescription: string): {
  round: number;
  isComplete: boolean;
} {
  const roundMatch = statusDescription.match(/Round (\d)/i);
  const round = roundMatch ? parseInt(roundMatch[1], 10) : 1;

  const isComplete =
    /end of round/i.test(statusDescription) ||
    /final/i.test(statusDescription) ||
    /complete/i.test(statusDescription) ||
    /official/i.test(statusDescription);

  return { round, isComplete };
}
