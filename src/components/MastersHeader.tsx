import { TournamentInfo } from "@/types";
import { TrophyIcon } from "@/components/icons/MastersIcons";

interface MastersHeaderProps {
  tournament: TournamentInfo | null;
  isValidating: boolean;
}

function isLive(tournament: TournamentInfo | null): boolean {
  if (!tournament) return false;
  const state = tournament.tournamentState;
  return state === "r1_live" || state === "r2_live" || state === "r3_live" || state === "r4_live";
}

export function MastersHeader({ tournament, isValidating }: MastersHeaderProps) {
  const lastUpdated = tournament?.lastUpdated
    ? new Date(tournament.lastUpdated).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const live = isLive(tournament);

  return (
    <header
      className="w-full border-b"
      style={{
        background: "linear-gradient(180deg, #002a1c 0%, #003d29 100%)",
        borderColor: "rgba(255, 199, 44, 0.15)",
      }}
    >
      {/* Mobile: two-row layout */}
      <div className="flex flex-col md:hidden">
        {/* Row 1: icon + title */}
        <div
          className="flex items-center justify-between px-4"
          style={{ height: "44px" }}
        >
          <div className="flex items-center gap-2 w-[40px]">
            <TrophyIcon className="text-masters-gold" />
          </div>

          <div className="flex flex-col items-center flex-1">
            <h1
              className="font-[family-name:var(--font-display)] text-masters-gold uppercase tracking-[0.18em] text-sm font-semibold leading-none"
            >
              THE MASTERS 2026
            </h1>
            <span
              className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.3em] uppercase mt-0.5"
              style={{ color: "rgba(255, 199, 44, 0.55)" }}
            >
              SWEEPSTAKE
            </span>
          </div>

          <div className="w-[40px]" />
        </div>

        {/* Row 2: status bar */}
        <div
          className="flex items-center justify-center gap-3 px-4"
          style={{ height: "28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {live && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span
                className="text-[10px] font-semibold tracking-[0.15em] uppercase font-[family-name:var(--font-mono)]"
                style={{ color: "#4ADE80" }}
              >
                LIVE
              </span>
            </div>
          )}
          {tournament && !live && (
            <span
              className="text-[10px] uppercase tracking-wider font-medium"
              style={{ color: "rgba(255, 199, 44, 0.85)" }}
            >
              {tournament.status}
            </span>
          )}
          {lastUpdated && (
            <span
              className="text-[10px] font-[family-name:var(--font-mono)] tabular-nums"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {isValidating ? "Updating…" : `Updated ${lastUpdated}`}
            </span>
          )}
          {!tournament && !isValidating && (
            <span
              className="text-[10px]"
              style={{ color: "rgba(255, 255, 255, 0.4)" }}
            >
              No data
            </span>
          )}
        </div>
      </div>

      {/* Desktop: single row */}
      <div
        className="hidden md:flex items-center justify-between px-8"
        style={{ height: "72px" }}
      >
        {/* Left: Trophy icon */}
        <div className="flex items-center gap-3 w-[160px]">
          <TrophyIcon className="text-masters-gold w-7 h-7" />
          {live && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span
                className="text-[11px] font-semibold tracking-[0.15em] uppercase font-[family-name:var(--font-mono)]"
                style={{ color: "#4ADE80" }}
              >
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Centre: Title */}
        <div className="flex flex-col items-center flex-1">
          <h1
            className="font-[family-name:var(--font-display)] text-masters-gold uppercase tracking-[0.18em] text-xl font-semibold leading-none"
          >
            THE MASTERS 2026
          </h1>
          <span
            className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.3em] uppercase mt-1"
            style={{ color: "rgba(255, 199, 44, 0.55)" }}
          >
            SWEEPSTAKE
          </span>
        </div>

        {/* Right: Status + update time */}
        <div className="flex flex-col items-end gap-0.5 w-[160px]">
          {tournament && !live && (
            <span
              className="text-xs uppercase tracking-wider font-medium"
              style={{ color: "rgba(255, 199, 44, 0.85)" }}
            >
              {tournament.status}
            </span>
          )}
          {lastUpdated && (
            <span
              className="text-xs font-[family-name:var(--font-mono)] tabular-nums"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {isValidating ? "Updating…" : `Updated ${lastUpdated}`}
            </span>
          )}
          {!tournament && !isValidating && (
            <span
              className="text-xs"
              style={{ color: "rgba(255, 255, 255, 0.4)" }}
            >
              No data
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
