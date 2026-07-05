import { CoinImage } from "@/components/coin-image";
import { cn } from "@/lib/utils";

type NetworkIconProps = {
  networkId: string;
  name?: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
};

export function NetworkIcon({
  networkId,
  name,
  imageUrl,
  size = 16,
  className,
}: NetworkIconProps) {
  const label = name ?? networkId;

  if (imageUrl) {
    return (
      <CoinImage
        src={imageUrl}
        alt={label}
        size={size}
        className={cn("rounded-full", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-[0.55rem] font-semibold uppercase leading-none text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {label.slice(0, 2)}
    </span>
  );
}
