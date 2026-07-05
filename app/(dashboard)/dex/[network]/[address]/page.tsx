import { DashboardHeader } from "@/components/dashboard-header";
import { PoolDetailView } from "@/components/pool-detail-view";
import { PoolUnavailable } from "@/components/pool-unavailable";
import { getPoolByAddress, getPoolOhlcv } from "@/lib/api/geckoterminal";
import { parseNetworkId, parsePoolAddress } from "@/lib/api/params";
import { DEFAULT_POOL_CHART_PERIOD } from "@/lib/chart-periods";
import { enrichDexPool, getNetworkIconLookup } from "@/lib/network-icons";

export const revalidate = 300;

export default async function DexPoolDetailPage({
  params,
}: {
  params: Promise<{ network: string; address: string }>;
}) {
  const { network: rawNetwork, address: rawAddress } = await params;
  const network = parseNetworkId(rawNetwork);
  const address = parsePoolAddress(rawAddress);

  if (!network || !address) {
    return <PoolUnavailable network={rawNetwork} address={rawAddress} />;
  }

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
