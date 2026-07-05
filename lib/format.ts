const SUBSCRIPT_DIGITS = "₀₁₂₃₄₅₆₇₈₉";

function toSubscript(count: number) {
  return String(count)
    .split("")
    .map((digit) => SUBSCRIPT_DIGITS[Number(digit)])
    .join("");
}

/** e.g. 0.00000123 -> $0.0₅123 */
export function formatSmallUsd(value: number) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs === 0) return "$0.00";

  const exponent = Math.floor(Math.log10(abs));
  const zeroCount = -exponent - 1;
  const mantissa = abs / 10 ** exponent;
  const digits = mantissa
    .toPrecision(4)
    .replace(".", "")
    .replace(/0+$/, "")
    .slice(0, 4);

  return `${sign}$0.0${toSubscript(zeroCount)}${digits}`;
}

export function formatUsd(value: number | null | undefined, compact = false) {
  if (value == null || Number.isNaN(value)) return "—";

  const abs = Math.abs(value);

  if (compact && abs >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (abs === 0) return "$0.00";

  if (abs < 0.01) {
    return formatSmallUsd(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: abs >= 1 ? 2 : 6,
  }).format(value);
}

/** CoinGecko trending returns values like "$125,727,166" */
export function parseTrendingUsd(
  value: string | number | null | undefined,
): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isNaN(value) ? null : value;
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

export function formatPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
