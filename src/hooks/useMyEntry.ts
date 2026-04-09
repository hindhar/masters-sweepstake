"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "masters-my-participant";

export function useMyEntry() {
  const [myId, setMyIdState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMyIdState(stored);
    }
  }, []);

  const setMyId = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setMyIdState(id);
  };

  const clearMyId = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMyIdState(null);
  };

  return { myId, setMyId, clearMyId };
}
