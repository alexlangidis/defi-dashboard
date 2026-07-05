import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  positive,
  className,
  width = 100,
  height = 32,
}: {
  data: number[];
  positive?: boolean;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const isUp = positive ?? data[data.length - 1] >= data[0];
  const stroke = isUp ? "#34d399" : "#f87171";
  const gradId = `spark-${isUp ? "up" : "down"}-${width}-${height}`;

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {isUp ? (
            <>
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </>
          )}
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
