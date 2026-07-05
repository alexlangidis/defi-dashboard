import { Suspense } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardDexSection } from "@/components/home/dashboard-dex-section";
import { DashboardHeroSection } from "@/components/home/dashboard-hero-section";
import { DashboardMarketsSection } from "@/components/home/dashboard-markets-section";
import { DashboardMoversSection } from "@/components/home/dashboard-movers-section";
import { DashboardSummarySection } from "@/components/home/dashboard-summary-section";
import { DashboardTrendingSection } from "@/components/home/dashboard-trending-section";
import {
  DexSectionSkeleton,
  HeroSectionSkeleton,
  MoversSectionSkeleton,
  SummaryCardSkeleton,
  TableSectionSkeleton,
} from "@/components/home/home-skeletons";

export const revalidate = 120;

export default function HomePage() {
  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Live crypto & on-chain markets"
      />
      <main className="flex-1 space-y-10 p-4 md:p-8">
        <Suspense fallback={<HeroSectionSkeleton />}>
          <DashboardHeroSection />
        </Suspense>

        <Suspense fallback={<MoversSectionSkeleton />}>
          <DashboardMoversSection />
        </Suspense>

        <div className="grid gap-6 2xl:grid-cols-3 2xl:items-stretch">
          <Suspense fallback={<DexSectionSkeleton />}>
            <DashboardDexSection />
          </Suspense>
          <Suspense
            fallback={
              <div className="2xl:h-full">
                <SummaryCardSkeleton />
              </div>
            }
          >
            <DashboardSummarySection />
          </Suspense>
        </div>

        <Suspense fallback={<TableSectionSkeleton />}>
          <DashboardMarketsSection />
        </Suspense>

        <Suspense fallback={<TableSectionSkeleton />}>
          <DashboardTrendingSection />
        </Suspense>
      </main>
    </>
  );
}
