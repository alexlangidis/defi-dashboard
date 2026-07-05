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
        positive
          ? "border-emerald-500/30 text-emerald-500"
          : "border-red-500/30 text-red-500",
        className,
      )}
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </Badge>
  );
}
