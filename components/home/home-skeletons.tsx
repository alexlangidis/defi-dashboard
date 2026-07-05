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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-xl" />
      ))}
    </div>
  );
}

export function SummaryCardSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />;
}

export function TableSectionSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />;
}
