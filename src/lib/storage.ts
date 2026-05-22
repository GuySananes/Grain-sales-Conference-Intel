"use client";

import { useEffect, useState } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setIsLoaded(true);
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isLoaded, key, value]);

  return [value, setValue, isLoaded] as const;
}
