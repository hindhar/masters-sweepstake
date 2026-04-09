"use client";

import { createContext, useContext, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface MotionPrefsContextValue {
  prefersReducedMotion: boolean;
}

const MotionPrefsContext = createContext<MotionPrefsContextValue>({
  prefersReducedMotion: false,
});

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <MotionPrefsContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </MotionPrefsContext.Provider>
  );
}

export function useMotionPrefs(): MotionPrefsContextValue {
  return useContext(MotionPrefsContext);
}
