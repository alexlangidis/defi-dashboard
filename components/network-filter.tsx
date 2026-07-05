"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { DEX_NETWORKS } from "@/lib/constants/navigation";
import { usePreferencesStore } from "@/stores/preferences-store";
import { cn } from "@/lib/utils";

export function NetworkFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("network") ?? "all";
  const setDexNetwork = usePreferencesStore((s) => s.setDexNetwork);

  useEffect(() => {
    setDexNetwork(active);
  }, [active, setDexNetwork]);

  return (
    <div className="flex flex-wrap gap-2">
      {DEX_NETWORKS.map((network) => {
        const isActive = active === network.id;
        return (
          <button
            key={network.id}
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (network.id === "all") {
                params.delete("network");
              } else {
                params.set("network", network.id);
              }
              setDexNetwork(network.id);
              router.push(`/dex?${params.toString()}`);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
            )}
          >
            {network.label}
          </button>
        );
      })}
    </div>
  );
}
