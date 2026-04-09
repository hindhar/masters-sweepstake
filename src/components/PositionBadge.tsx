"use client";

import { AnimatePresence, motion } from "framer-motion";

interface PositionBadgeProps {
  position: string;
  movement: number;
}

export function PositionBadge({ position, movement }: PositionBadgeProps) {
  return (
    <div className="flex items-center gap-1 min-w-[40px]">
      <span
        className="font-[family-name:var(--font-mono)] text-sm font-medium tabular-nums"
        style={{ color: "var(--text-on-green-muted)" }}
      >
        {position}
      </span>

      <AnimatePresence mode="wait">
        {movement > 0 && (
          <motion.span
            key="up"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-0.5 text-[10px] font-medium"
            style={{ color: "var(--move-up)" }}
          >
            <span>▲</span>
            <span>{movement}</span>
          </motion.span>
        )}
        {movement < 0 && (
          <motion.span
            key="down"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-0.5 text-[10px] font-medium"
            style={{ color: "var(--move-down)" }}
          >
            <span>▼</span>
            <span>{Math.abs(movement)}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
