import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WatchlistItem } from "@/lib/types/watchlist";

type WatchlistState = {
  items: WatchlistItem[];
  toggle: (item: WatchlistItem) => boolean;
  remove: (coinId: string) => void;
  isWatched: (coinId: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((entry) => entry.coinId === item.coinId);
        set({
          items: exists
            ? get().items.filter((entry) => entry.coinId !== item.coinId)
            : [...get().items, item],
        });
        return !exists;
      },
      remove: (coinId) =>
        set({ items: get().items.filter((item) => item.coinId !== coinId) }),
      isWatched: (coinId) =>
        get().items.some((item) => item.coinId === coinId),
    }),
    { name: "defi-watchlist" },
  ),
);

export function useWatchlist() {
  const items = useWatchlistStore((s) => s.items);
  const toggle = useWatchlistStore((s) => s.toggle);
  const isWatched = useWatchlistStore((s) => s.isWatched);
  return { items, toggle, isWatched };
}
