"use client";

import { cn } from "@/lib/utils";

type PeriodOption = {
  id: string;
  label: string;
};

export function ChartPeriodSelector({
  periods,
  value,
  onChange,
  className,
}: {
  periods: PeriodOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {periods.map((period) => {
        const active = value === period.id;
        return (
          <button
            key={period.id}
            type="button"
            onClick={() => onChange(period.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}
