import { ParticipantPicks, ParticipantEntry, ParticipantGolferScore, GolferScore, GroupId } from "@/types";
import { formatScoreToPar } from "./format";
import { NAME_OVERRIDES } from "@/data/name-mapping";

/**
 * Resolve a golfer name from our picks data to the ESPN canonical name.
 */
function resolveGolferName(pickName: string): string {
  return NAME_OVERRIDES[pickName] ?? pickName;
}

/**
 * Find a golfer score by name, trying exact match first then fuzzy.
 */
function findGolferScore(
  golferName: string,
  golferMap: Map<string, GolferScore>
): GolferScore | null {
  const resolved = resolveGolferName(golferName);

  // Exact match
  if (golferMap.has(resolved)) return golferMap.get(resolved)!;

  // Case-insensitive match
  const lower = resolved.toLowerCase();
  for (const [key, value] of golferMap) {
    if (key.toLowerCase() === lower) return value;
  }

  // Partial match (last name)
  const parts = resolved.split(" ");
  const lastName = parts[parts.length - 1].toLowerCase();
  for (const [key, value] of golferMap) {
    if (key.toLowerCase().endsWith(lastName)) return value;
  }

  return null;
}

/**
 * Calculate a participant's sweepstake score from their picks and live golfer scores.
 */
export function calculateParticipantScore(
  participant: ParticipantPicks,
  golferMap: Map<string, GolferScore>
): ParticipantEntry {
  const groups: GroupId[] = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"];

  const golferScores: ParticipantGolferScore[] = groups.map((group) => {
    const golferName = participant.picks[group];
    const score = findGolferScore(golferName, golferMap);
    return { group, golferName, score };
  });

  // Best 4 of 8 scoring: only the 4 lowest (best) scores count
  const scoredPicks = golferScores
    .filter((gs) => gs.score !== null)
    .sort((a, b) => (a.score!.scoreToPar) - (b.score!.scoreToPar));

  const countingPicks = scoredPicks.slice(0, 4);
  const droppedPicks = scoredPicks.slice(4);

  const totalScore = countingPicks.reduce((sum, gs) => {
    return sum + gs.score!.scoreToPar;
  }, 0);

  // Mark which golfers are counting vs dropped
  const countingNames = new Set(countingPicks.map((gs) => gs.golferName));
  for (const gs of golferScores) {
    (gs as ParticipantGolferScore & { counting?: boolean }).counting =
      countingNames.has(gs.golferName);
  }

  // Best = lowest scoring counting pick, Worst = highest scoring counting pick
  const bestGolfer = countingPicks.length > 0
    ? { name: countingPicks[0].golferName, score: countingPicks[0].score!.scoreToPar }
    : null;
  const worstGolfer = countingPicks.length > 0
    ? { name: countingPicks[countingPicks.length - 1].golferName, score: countingPicks[countingPicks.length - 1].score!.scoreToPar }
    : null;

  // Count how many golfers have started (thru > 0 holes)
  const thruCount = golferScores.filter(
    (gs) => gs.score && gs.score.thru !== "-" && gs.score.thru !== "0"
  ).length;

  void droppedPicks; // used for clarity, not needed in output
  void thruCount;

  return {
    participant,
    totalScore,
    totalScoreDisplay: formatScoreToPar(totalScore),
    position: 0,
    positionDisplay: "",
    movement: 0,
    golferScores,
    bestGolfer,
    worstGolfer,
  };
}
