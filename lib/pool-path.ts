import { parsePoolAddress } from "@/lib/api/params";

export function normalizePoolAddress(address: string) {
  return parsePoolAddress(address) ?? "";
}

export function poolAddressesMatch(a: string, b: string) {
  if (a.startsWith("0x") || b.startsWith("0x")) {
    return normalizePoolAddress(a) === normalizePoolAddress(b);
  }
  return a === b;
}

export function poolDetailPath(network: string, address: string) {
  return `/dex/${network}/${encodeURIComponent(normalizePoolAddress(address))}`;
}

export function shortenAddress(address: string, head = 6, tail = 4) {
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
