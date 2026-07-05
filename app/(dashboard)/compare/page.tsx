import { Suspense } from "react";

import { CompareContent } from "@/components/compare-content";
import { DashboardHeader } from "@/components/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComparePage() {
  return (
    <>
      <DashboardHeader
        title="Compare Tokens"
        description="Side-by-side metrics for up to 3 tokens"
      />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <Suspense
          fallback={
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          }
        >
          <CompareContent />
        </Suspense>
      </main>
    </>
  );
}
