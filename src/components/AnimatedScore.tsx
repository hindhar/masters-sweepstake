"use client";

import { AnimatePresence, motion } from "framer-motion";

interface AnimatedScoreProps {
  value: string;
  className?: string;
}

export function AnimatedScore({ value, className }: AnimatedScoreProps) {
  const chars = value.split("");

  return (
    <span className={`overflow-hidden inline-flex ${className ?? ""}`}>
      <AnimatePresence mode="popLayout">
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
