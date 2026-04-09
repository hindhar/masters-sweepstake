"use client";

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    key: "leaderboard",
    label: "Leaderboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L12.39 7.26L18 8.18L14 12.08L14.95 17.64L10 15.12L5.05 17.64L6 12.08L2 8.18L7.61 7.26L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "tournament",
    label: "Tournament",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3L10 1L14 3V9C14 12.31 12 15.16 10 16C8 15.16 6 12.31 6 9V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 16V19M7 19H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "groups",
    label: "Groups",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    key: "stats",
    label: "Stats",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17V12M7 17V7M11 17V10M15 17V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-sm bg-[#003d29]/95 border-t border-white/[0.08] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {tabs.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className="min-h-[56px] flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors"
              style={{ color: isActive ? "#FFC72C" : "rgba(255,255,255,0.35)" }}
            >
              {/* Active indicator dot */}
              <span
                className="block w-1 h-1 rounded-full mb-0.5 transition-opacity"
                style={{
                  backgroundColor: "#FFC72C",
                  opacity: isActive ? 1 : 0,
                }}
              />
              {icon}
              <span className="text-[10px] uppercase tracking-[0.08em]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
