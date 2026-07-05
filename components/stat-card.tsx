import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  change,
  className,
  accent,
}: {
  title: string;
  value: string;
  change?: React.ReactNode;
  className?: string;
  accent?: "primary" | "emerald" | "violet";
}) {
  const accentClass =
    accent === "primary"
      ? "before:from-primary/20"
      : accent === "emerald"
        ? "before:from-emerald-500/20"
        : accent === "violet"
          ? "before:from-violet-500/20"
          : "before:from-primary/10";

  return (
    <Card
      className={cn(
        "relative overflow-hidden before:absolute before:-right-8 before:-top-8 before:size-24 before:rounded-full before:bg-gradient-to-br before:to-transparent before:blur-2xl before:opacity-60",
        accentClass,
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>
        {change ? (
          <div className="mt-1.5 text-xs">{change}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
