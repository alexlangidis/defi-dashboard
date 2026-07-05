import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SearchHistoryItem = {
  type: "token" | "pool";
  id: string;
  label: string;
  href: string;
  at: number;
};

type SearchHistoryState = {
  items: SearchHistoryItem[];
  add: (item: Omit<SearchHistoryItem, "at">) => void;
  clear: () => void;
};

const MAX_ITEMS = 8;

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const entry: SearchHistoryItem = { ...item, at: Date.now() };
        const filtered = get().items.filter(
          (i) => !(i.type === entry.type && i.id === entry.id),
        );
        set({ items: [entry, ...filtered].slice(0, MAX_ITEMS) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "defi-search-history" },
  ),
);
