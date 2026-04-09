import { ParticipantEntry } from "@/types";
import { formatPosition } from "./format";

/**
 * Compare two participants' counting scores for tiebreaker.
 * Compare lowest individual score first, then next, etc.
 * Returns negative if a wins, positive if b wins, 0 if truly tied.
 */
function tiebreaker(a: ParticipantEntry, b: ParticipantEntry): number {
  const aScores = a.countingScores;
  const bScores = b.countingScores;
  const len = Math.min(aScores.length, bScores.length);

  for (let i = 0; i < len; i++) {
    if (aScores[i] !== bScores[i]) return aScores[i] - bScores[i];
  }

  return 0;
}

/**
 * Sort participant entries by total score (ascending - lower is better),
 * with proper tiebreaker rules and eligibility handling.
 */
export function computeRankings(
  entries: ParticipantEntry[],
  previousPositions?: Map<string, number>
): ParticipantEntry[] {
  const sorted = [...entries].sort((a, b) => {
    // Ineligible entries go to the bottom
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;

    // Sort by total score ascending (lower = better in golf)
    if (a.totalScore !== b.totalScore) return a.totalScore - b.totalScore;

    // Tiebreaker: compare lowest individual counting score, then next, etc.
    return tiebreaker(a, b);
  });

  // Assign positions with tie handling
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      sorted[i].position = 1;
    } else if (
      sorted[i].totalScore === sorted[i - 1].totalScore &&
      sorted[i].eligible === sorted[i - 1].eligible &&
      tiebreaker(sorted[i], sorted[i - 1]) === 0
    ) {
      // Truly tied: same total AND same individual counting scores
      sorted[i].position = sorted[i - 1].position;
    } else {
      sorted[i].position = i + 1;
    }

    const isTied =
      (i > 0 &&
        sorted[i].totalScore === sorted[i - 1].totalScore &&
        tiebreaker(sorted[i], sorted[i - 1]) === 0) ||
      (i < sorted.length - 1 &&
        sorted[i].totalScore === sorted[i + 1].totalScore &&
        tiebreaker(sorted[i], sorted[i + 1]) === 0);

    sorted[i].positionDisplay = !sorted[i].eligible
      ? "DQ"
      : formatPosition(sorted[i].position, isTied);

    // Compute movement
    if (previousPositions) {
      const prevPos = previousPositions.get(sorted[i].participant.id);
      if (prevPos !== undefined) {
        sorted[i].previousPosition = prevPos;
        sorted[i].movement = prevPos - sorted[i].position;
      }
    }
  }

  return sorted;
}
