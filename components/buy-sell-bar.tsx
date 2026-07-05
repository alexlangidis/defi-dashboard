import { cn } from "@/lib/utils";

export function BuySellBar({
  buys,
  sells,
  className,
}: {
  buys: number;
  sells: number;
  className?: string;
}) {
  const total = buys + sells || 1;
  const buyPct = (buys / total) * 100;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-muted/60">
        <div
          className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${buyPct}%` }}
        />
        <div
          className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
          style={{ width: `${100 - buyPct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] tabular-nums">
        <span className="text-emerald-400">{buys} buys</span>
        <span className="text-red-400">{sells} sells</span>
      </div>
    </div>
  );
}
