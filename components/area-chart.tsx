import { cn } from "@/lib/utils";

export function AreaChart({
  data,
  className,
  height = 120,
}: {
  data: Array<{ x: number; y: number }>;
  className?: string;
  height?: number;
}) {
  if (data.length < 2) return null;

  const width = 400;
  const ys = data.map((d) => d.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const range = max - min || 1;
  const isUp = data[data.length - 1].y >= data[0].y;

  const linePoints = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.y - min) / range) * (height - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;
  const id = `area-grad-${isUp ? "up" : "down"}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {isUp ? (
            <>
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
            </>
          )}
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline
        fill="none"
        stroke={isUp ? "#34d399" : "#f87171"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
      />
    </svg>
  );
}
