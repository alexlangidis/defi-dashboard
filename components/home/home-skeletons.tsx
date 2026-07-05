import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
  return <Skeleton className="h-48 w-full rounded-2xl" />;
}

export function MoversSectionSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function DexSectionSkeleton() {
  return (
    <div className="min-w-0 space-y-4 2xl:col-span-2">
      <Skeleton className="h-5 w-40" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SummaryCardSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl 2xl:h-full 2xl:min-h-64" />;
}

export function TableSectionSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />;
}
