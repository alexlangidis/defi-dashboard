import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PercentBadge({
  value,
  className,
}: {
  value: number | null | undefined;
  className?: string;
}) {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-muted-foreground">—</span>;
  }

  const positive = value >= 0;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium tabular-nums transition-colors",
        positive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-400",
        className,
      )}
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </Badge>
  );
}
