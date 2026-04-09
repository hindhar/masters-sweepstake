import { ParticipantEntry } from "@/types";
import { formatPosition } from "./format";

/**
 * Sort participant entries by total score (ascending - lower is better),
 * assign positions with tie handling, and compute movement.
 */
export function computeRankings(
  entries: ParticipantEntry[],
  previousPositions?: Map<string, number>
): ParticipantEntry[] {
  // Sort by total score ascending (lower = better in golf)
  const sorted = [...entries].sort((a, b) => {
    if (a.totalScore !== b.totalScore) return a.totalScore - b.totalScore;
    // Tiebreaker: alphabetical by name
    return a.participant.name.localeCompare(b.participant.name);
  });

  // Assign positions with tie handling
  for (let i = 0; i < sorted.length; i++) {
    // Position is always based on how many people are ahead of you
    if (i === 0) {
      sorted[i].position = 1;
    } else if (sorted[i].totalScore === sorted[i - 1].totalScore) {
      sorted[i].position = sorted[i - 1].position;
    } else {
      sorted[i].position = i + 1;
    }

    // Check if this position is tied
    const isTied =
      (i > 0 && sorted[i].totalScore === sorted[i - 1].totalScore) ||
      (i < sorted.length - 1 &&
        sorted[i].totalScore === sorted[i + 1].totalScore);

    sorted[i].positionDisplay = formatPosition(sorted[i].position, isTied);

    // Compute movement
    if (previousPositions) {
      const prevPos = previousPositions.get(sorted[i].participant.id);
      if (prevPos !== undefined) {
        sorted[i].previousPosition = prevPos;
        sorted[i].movement = prevPos - sorted[i].position; // positive = moved up
      }
    }
  }

  return sorted;
}
