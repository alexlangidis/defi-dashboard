import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";

export function PoolUnavailable({
  network,
  address,
}: {
  network: string;
  address: string;
}) {
  const geckoUrl = `https://www.geckoterminal.com/${network}/pools/${address}`;

  return (
    <>
      <DashboardHeader
        title="Pool unavailable"
        description="We could not load this pool right now"
      />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          GeckoTerminal may be rate-limiting requests, or this pool is no longer
          listed. Try again in a moment or open it on GeckoTerminal directly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild variant="default">
            <Link href="/dex">Back to DEX pools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={geckoUrl} target="_blank" rel="noopener noreferrer">
              Open on GeckoTerminal
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
