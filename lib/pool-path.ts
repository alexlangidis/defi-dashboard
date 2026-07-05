export function normalizePoolAddress(address: string) {
  const decoded = decodeURIComponent(address);
  return decoded.startsWith("0x") ? decoded.toLowerCase() : decoded;
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
