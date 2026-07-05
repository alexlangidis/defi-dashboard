"use client";

import { useCallback, useEffect, useState } from "react";

export type WatchlistItem = {
  coinId: string;
  symbol: string;
  name: string;
  image?: string;
};

const STORAGE_KEY = "defi-watchlist";

function readWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

function writeWatchlist(items: WatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("watchlist-updated"));
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const sync = useCallback(() => {
    setItems(readWatchlist());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("watchlist-updated", sync);
    return () => window.removeEventListener("watchlist-updated", sync);
  }, [sync]);

  const isWatched = useCallback(
    (coinId: string) => items.some((item) => item.coinId === coinId),
    [items],
  );

  const toggle = useCallback(
    (item: WatchlistItem) => {
      const current = readWatchlist();
      const exists = current.some((entry) => entry.coinId === item.coinId);
      const next = exists
        ? current.filter((entry) => entry.coinId !== item.coinId)
        : [...current, item];
      writeWatchlist(next);
      setItems(next);
      return !exists;
    },
    [],
  );

  return { items, isWatched, toggle };
}
