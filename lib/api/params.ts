const MAX_SEARCH_QUERY_LENGTH = 80;
const MAX_COIN_IDS = 50;
const MAX_COIN_ID_LENGTH = 80;
const MAX_NETWORK_LENGTH = 40;
const MAX_POOL_ADDRESS_LENGTH = 140;

const COIN_ID_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;
const NETWORK_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;
const POOL_ADDRESS_PATTERN = /^[a-z0-9][a-z0-9:_-]*$/i;

export function parseSearchQuery(value: string | null) {
  const query = value?.trim().replace(/\s+/g, " ") ?? "";
  if (query.length < 2) return null;
  return query.slice(0, MAX_SEARCH_QUERY_LENGTH);
}

export function parseCoinId(value: string | null | undefined) {
  const id = value?.trim() ?? "";
  if (!id || id.length > MAX_COIN_ID_LENGTH || !COIN_ID_PATTERN.test(id)) {
    return null;
  }
  return id.toLowerCase();
}

export function parseCoinIds(value: string | null) {
  if (!value) return [];

  const ids = value
    .split(",")
    .map((id) => parseCoinId(id))
    .filter((id): id is string => id !== null);

  return Array.from(new Set(ids)).slice(0, MAX_COIN_IDS);
}

export function parseNetworkId(value: string | null | undefined) {
  const network = value?.trim() ?? "";
  if (
    !network ||
    network.length > MAX_NETWORK_LENGTH ||
    !NETWORK_PATTERN.test(network)
  ) {
    return null;
  }
  return network.toLowerCase();
}

export function parsePoolAddress(value: string | null | undefined) {
  const raw = value?.trim() ?? "";
  if (!raw) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }

  if (
    decoded.length > MAX_POOL_ADDRESS_LENGTH ||
    !POOL_ADDRESS_PATTERN.test(decoded)
  ) {
    return null;
  }

  return decoded.startsWith("0x") ? decoded.toLowerCase() : decoded;
}
