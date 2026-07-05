"use client";

import { useEffect } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <DashboardHeader title="Something went wrong" />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          Market data could not be loaded. This is often temporary — API rate
          limits or network issues.
        </p>
        <Button onClick={reset}>Try again</Button>
      </main>
    </>
  );
}
