/**
 * Format a numeric score relative to par for display.
 * -3 -> "-3", 0 -> "E", +5 -> "+5"
 */
export function formatScoreToPar(score: number): string {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
}

/**
 * Format a position with ties.
 * If multiple entries share the same position, prefix with "T".
 */
export function formatPosition(
  position: number,
  isTied: boolean
): string {
  if (isTied) return `T${position}`;
  return `${position}`;
}

/**
 * Create a display-friendly surname for the scoreboard.
 * "Rob Hindhaugh" -> "HINDHAUGH"
 * "Adam Fowler-Watt" -> "FOWLER-WATT"
 */
export function scoreboardName(fullName: string): string {
  const parts = fullName.split(" ");
  if (parts.length === 1) return fullName.toUpperCase();
  return parts.slice(1).join(" ").toUpperCase();
}

/**
 * Create a short display name.
 * "Rob Hindhaugh" -> "R. Hindhaugh"
 */
export function shortName(fullName: string): string {
  const parts = fullName.split(" ");
  if (parts.length === 1) return fullName;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}
