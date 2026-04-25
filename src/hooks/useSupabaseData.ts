"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook that fetches data from Supabase with JSON fallback.
 * - Starts with fallbackData (from JSON import) as initial state
 * - Fetches from Supabase via useEffect
 * - If Supabase succeeds, replaces state with fresh data
 * - If Supabase fails (e.g. auto-paused), keeps using fallback
 *
 * This ensures the website NEVER shows empty content.
 */
export function useSupabaseData<T>(
  fetchFn: () => Promise<T | null>,
  fallbackData: T
): T {
  const [data, setData] = useState<T>(fallbackData);

  // Memoize fetchFn reference to avoid re-running effect
  const stableFetch = useCallback(fetchFn, []);

  useEffect(() => {
    let cancelled = false;
    stableFetch().then((result) => {
      if (!cancelled && result !== null) {
        setData(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [stableFetch]);

  return data;
}
