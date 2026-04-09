interface ScoreCellProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-[13px] px-2 py-0.5",
  md: "text-[16px] px-2.5 py-0.5",
  lg: "text-[28px] px-4 py-1",
};

export function ScoreCell({ score, size = "md" }: ScoreCellProps) {
  let pillClasses: string;
  let display: string;

  if (score < 0) {
    pillClasses =
      "bg-[rgba(255,45,85,0.12)] text-[#FF2D55] border border-[rgba(255,45,85,0.20)] rounded-md font-semibold";
    display = `${score}`;
  } else if (score > 0) {
    pillClasses =
      "bg-white/5 text-white/45 border border-white/[0.06] rounded-md";
    display = `+${score}`;
  } else {
    pillClasses =
      "bg-white/[0.04] text-white/70 border border-white/[0.06] rounded-md";
    display = "E";
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-[family-name:var(--font-mono)] tabular-nums font-medium ${sizeClasses[size]} ${pillClasses}`}
    >
      {display}
    </span>
  );
}
