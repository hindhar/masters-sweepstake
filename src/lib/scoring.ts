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

  const totalScore = golferScores.reduce((sum, gs) => {
    return sum + (gs.score?.scoreToPar ?? 0);
  }, 0);

  // Find best and worst picks
  let bestGolfer: { name: string; score: number } | null = null;
  let worstGolfer: { name: string; score: number } | null = null;

  for (const gs of golferScores) {
    if (!gs.score) continue;
    const s = gs.score.scoreToPar;
    if (!bestGolfer || s < bestGolfer.score) {
      bestGolfer = { name: gs.golferName, score: s };
    }
    if (!worstGolfer || s > worstGolfer.score) {
      worstGolfer = { name: gs.golferName, score: s };
    }
  }

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
