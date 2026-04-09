interface ScoreCellProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function ScoreCell({ score, size = "md" }: ScoreCellProps) {
  let colorStyle: string;
  let display: string;

  if (score < 0) {
    colorStyle = "text-score-under";
    display = `${score}`;
  } else if (score > 0) {
    colorStyle = "text-white/50";
    display = `+${score}`;
  } else {
    colorStyle = "text-white/80";
    display = "E";
  }

  return (
    <span
      className={`font-[family-name:var(--font-mono)] tabular-nums font-medium ${sizeClasses[size]} ${colorStyle}`}
    >
      {display}
    </span>
  );
}
