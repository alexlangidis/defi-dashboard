"use client";

import { useEffect, useState } from "react";

import { CoinImage } from "@/components/coin-image";
import type { PoolToken } from "@/lib/api/geckoterminal";
import { usePoolIconCacheStore } from "@/stores/pool-icon-cache-store";
import { cn } from "@/lib/utils";

function TokenIcon({
  token,
  network,
  size,
  className,
}: {
  token: PoolToken;
  network: string;
  size: number;
  className?: string;
}) {
  const setIcon = usePoolIconCacheStore((s) => s.setIcon);
  const getIcon = usePoolIconCacheStore((s) => s.getIcon);
  const [failed, setFailed] = useState<string | null>(null);

  const cachedUrl =
    token.address && network ? getIcon(network, token.address) : undefined;
  const imageUrl = token.imageUrl ?? cachedUrl;
  const src = imageUrl !== failed ? imageUrl : undefined;

  useEffect(() => {
    if (token.imageUrl && token.address && network) {
      setIcon(network, token.address, token.imageUrl);
    }
  }, [network, token.address, token.imageUrl, setIcon]);

  if (src) {
    return (
      <CoinImage
        src={src}
        alt={token.symbol}
        size={size}
        className={cn("ring-2 ring-background", className)}
        onError={() => setFailed(src)}
      />
    );
  }

  const initial = token.symbol.slice(0, 2).toUpperCase() || "?";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-medium uppercase text-muted-foreground ring-2 ring-background",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function PoolTokenIcons({
  baseToken,
  quoteToken,
  network,
  size = 28,
  className,
}: {
  baseToken: PoolToken;
  quoteToken: PoolToken;
  network: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center", className)}>
      <TokenIcon token={baseToken} network={network} size={size} />
      <TokenIcon
        token={quoteToken}
        network={network}
        size={size}
        className="-ml-2"
      />
    </div>
  );
}
