import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  dexNetwork: string;
  setDexNetwork: (network: string) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      dexNetwork: "all",
      setDexNetwork: (network) => set({ dexNetwork: network }),
    }),
    { name: "defi-preferences" },
  ),
);
