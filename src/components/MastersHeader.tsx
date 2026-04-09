import { TournamentInfo } from "@/types";

interface MastersHeaderProps {
  tournament: TournamentInfo | null;
  isValidating: boolean;
}

export function MastersHeader({ tournament, isValidating }: MastersHeaderProps) {
  const lastUpdated = tournament?.lastUpdated
    ? new Date(tournament.lastUpdated).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <header
      className="w-full flex items-center justify-between px-4 md:px-8"
      style={{
        backgroundColor: "var(--augusta-deep)",
        height: "64px",
      }}
    >
      {/* Left: Trophy icon */}
      <div className="flex items-center gap-2 w-[80px] md:w-[140px]">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Trophy cup */}
          <path
            d="M9 3h10v9a5 5 0 0 1-10 0V3Z"
            stroke="#FFC72C"
            strokeWidth="1.5"
            fill="rgba(255,199,44,0.12)"
          />
          {/* Trophy handles */}
          <path
            d="M9 6H6a3 3 0 0 0 3 5M19 6h3a3 3 0 0 1-3 5"
            stroke="#FFC72C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Stem */}
          <path
            d="M14 17v4"
            stroke="#FFC72C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Base */}
          <path
            d="M10 21h8"
            stroke="#FFC72C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Star accent */}
          <circle cx="14" cy="8" r="1.5" fill="#FFC72C" opacity="0.6" />
        </svg>
      </div>

      {/* Centre: Title */}
      <h1
        className="font-[family-name:var(--font-display)] text-masters-gold uppercase tracking-[0.15em] text-sm md:text-xl font-semibold text-center flex-1"
      >
        The Masters 2026
      </h1>

      {/* Right: Status + update time */}
      <div className="flex flex-col items-end gap-0.5 w-[80px] md:w-[140px]">
        {tournament && (
          <span
            className="text-xs uppercase tracking-wider font-medium"
            style={{ color: "var(--masters-gold)", opacity: 0.85 }}
          >
            {tournament.status}
          </span>
        )}
        {lastUpdated && (
          <span
            className="text-[10px] md:text-xs"
            style={{ color: "var(--text-on-green-muted)" }}
          >
            {isValidating ? "Updating…" : `Updated ${lastUpdated}`}
          </span>
        )}
        {!tournament && !isValidating && (
          <span
            className="text-xs"
            style={{ color: "var(--text-on-green-dim)" }}
          >
            No data
          </span>
        )}
      </div>
    </header>
  );
}
