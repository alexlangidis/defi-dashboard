import { DashboardHeader } from "@/components/dashboard-header";
import { PoolDetailView } from "@/components/pool-detail-view";
import { PoolUnavailable } from "@/components/pool-unavailable";
import { getPoolByAddress, getPoolOhlcv } from "@/lib/api/geckoterminal";
import { DEFAULT_POOL_CHART_PERIOD } from "@/lib/chart-periods";
import { enrichDexPool, getNetworkIconLookup } from "@/lib/network-icons";
import { normalizePoolAddress } from "@/lib/pool-path";

export const revalidate = 300;

export default async function DexPoolDetailPage({
  params,
}: {
  params: Promise<{ network: string; address: string }>;
}) {
  const { network, address: rawAddress } = await params;
  const address = normalizePoolAddress(rawAddress);

  const poolRaw = await getPoolByAddress(network, address);
  if (!poolRaw) {
    return <PoolUnavailable network={network} address={address} />;
  }

  const [ohlcv, networkIcons] = await Promise.all([
    getPoolOhlcv(
      network,
      address,
      DEFAULT_POOL_CHART_PERIOD.timeframe,
      DEFAULT_POOL_CHART_PERIOD.limit,
    ),
    getNetworkIconLookup(),
  ]);

  const pool = enrichDexPool(poolRaw, networkIcons);
  const chart = ohlcv.map((c) => ({ x: c.time * 1000, y: c.close }));

  return (
    <>
      <DashboardHeader title="Pool" description={pool.name} />
      <PoolDetailView
        pool={pool}
        network={network}
        address={address}
        chart={chart}
      />
    </>
  );
}
