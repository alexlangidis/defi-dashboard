import { cache } from "react";

import { getAssetPlatforms } from "@/lib/api/coingecko";
import { type DexPool, getNetworks } from "@/lib/api/geckoterminal";

export type NetworkIconLookup = {
  imageByNetworkId: Record<string, string>;
  nameByNetworkId: Record<string, string>;
};

export function buildNetworkIconLookup(
  networks: Array<{
    id: string;
    name: string;
    coingeckoAssetPlatformId: string | null;
  }>,
  platforms: Array<{ id: string; image?: { thumb: string } }>,
): NetworkIconLookup {
  const platformImages = new Map(
    platforms.map((platform) => [platform.id, platform.image?.thumb]),
  );
  const imageByNetworkId: Record<string, string> = {};
  const nameByNetworkId: Record<string, string> = {};

  for (const network of networks) {
    nameByNetworkId[network.id] = network.name;
    if (network.coingeckoAssetPlatformId) {
      const imageUrl = platformImages.get(network.coingeckoAssetPlatformId);
      if (imageUrl) {
        imageByNetworkId[network.id] = imageUrl;
      }
    }
  }

  return { imageByNetworkId, nameByNetworkId };
}

export const getNetworkIconLookup = cache(async (): Promise<NetworkIconLookup> => {
  const [networks, platforms] = await Promise.all([
    getNetworks(),
    getAssetPlatforms(),
  ]);
  return buildNetworkIconLookup(networks, platforms);
});

export function enrichDexPools(pools: DexPool[], lookup: NetworkIconLookup) {
  return pools.map((pool) => enrichDexPool(pool, lookup));
}

export function enrichDexPool(pool: DexPool, lookup: NetworkIconLookup): DexPool {
  return {
    ...pool,
    networkName: lookup.nameByNetworkId[pool.network] ?? pool.network,
    networkImageUrl: lookup.imageByNetworkId[pool.network] ?? null,
  };
}
