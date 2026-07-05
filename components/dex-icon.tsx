"use client";

import { useState } from "react";

import { CoinImage } from "@/components/coin-image";
import { getDexImageUrl } from "@/lib/dex-icons";
import { cn } from "@/lib/utils";

type DexIconProps = {
  dexId: string;
  name?: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export function DexIcon({
  dexId,
  name,
  imageUrl,
  size = 14,
  className,
}: DexIconProps) {
  const [failed, setFailed] = useState(false);
  const label = name ?? dexId;
  const src = imageUrl ?? getDexImageUrl(dexId);

  if (!failed && dexId !== "unknown") {
    return (
      <CoinImage
        src={src}
        alt={label}
        size={size}
        className={cn("rounded-md object-contain", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-muted text-[0.55rem] font-semibold uppercase leading-none text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {label.slice(0, 2)}
    </span>
  );
}
