"use client";

import { useQuery } from "@tanstack/react-query";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DexPoolCard } from "@/components/dex-pool-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DexPool } from "@/lib/api/geckoterminal";

export function DexNewPoolsTab() {
  const { data: newPools = [], isLoading, isError } = useQuery<DexPool[]>({
    queryKey: ["dex-new-pools"],
    queryFn: async () => {
      const res = await fetch("/api/dex/new-pools");
      if (!res.ok) throw new Error("Failed to load new pools");
      return res.json();
    },
    staleTime: 300_000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || newPools.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        {isError
          ? "Failed to load new pools. Try again later."
          : "New pool data is temporarily unavailable. Try again in a few minutes."}
      </p>
    );
  }

  return (
    <FadeIn>
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {newPools.slice(0, 12).map((pool, i) => (
          <StaggerItem key={pool.id}>
            <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </FadeIn>
  );
}
