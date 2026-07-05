import { create } from "zustand";
import { persist } from "zustand/middleware";

function cacheKey(network: string, address: string) {
  return `${network}:${address.toLowerCase()}`;
}

type PoolIconCacheState = {
  icons: Record<string, string>;
  setIcon: (network: string, address: string, imageUrl: string) => void;
  getIcon: (network: string, address: string) => string | undefined;
};

export const usePoolIconCacheStore = create<PoolIconCacheState>()(
  persist(
    (set, get) => ({
      icons: {},
      setIcon: (network, address, imageUrl) => {
        if (!network || !address || !imageUrl) return;
        const key = cacheKey(network, address);
        if (get().icons[key] === imageUrl) return;
        set({ icons: { ...get().icons, [key]: imageUrl } });
      },
      getIcon: (network, address) => {
        if (!network || !address) return undefined;
        return get().icons[cacheKey(network, address)];
      },
    }),
    { name: "defi-pool-icons" },
  ),
);
