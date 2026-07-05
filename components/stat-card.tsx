import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  change,
  className,
}: {
  title: string;
  value: string;
  change?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change ? (
          <p className="text-xs text-muted-foreground mt-1">{change}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
