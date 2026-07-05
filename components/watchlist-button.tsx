"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/stores/watchlist-store";

type WatchlistButtonProps = {
  coinId: string;
  symbol: string;
  name: string;
  image?: string;
};

export function WatchlistButton({
  coinId,
  symbol,
  name,
  image,
}: WatchlistButtonProps) {
  const { isWatched, toggle } = useWatchlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const watched = mounted ? isWatched(coinId) : false;

  return (
    <Button
      variant={watched ? "default" : "outline"}
      size="icon-sm"
      onClick={() => {
        const added = toggle({ coinId, symbol, name, image });
        toast.success(
          added ? "Added to watchlist" : "Removed from watchlist",
        );
      }}
      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star className={watched ? "fill-current" : undefined} />
    </Button>
  );
}
