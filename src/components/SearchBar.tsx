"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex items-center w-full">
      {/* Magnifying glass icon */}
      <svg
        className="absolute left-3 pointer-events-none"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="6.5"
          cy="6.5"
          r="4.5"
          stroke="#FFC72C"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <path
          d="M10.5 10.5L14 14"
          stroke="#FFC72C"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search participants..."
        className="w-full pl-9 pr-8 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-masters-gold/40 transition-shadow"
        style={{
          backgroundColor: "var(--augusta-deep)",
          border: "none",
          color: "white",
        }}
        aria-label="Search participants"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 flex items-center justify-center w-4 h-4 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-on-green-muted)" }}
          aria-label="Clear search"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
