import Image from "next/image";

import { cn } from "@/lib/utils";

type CoinImageProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

export function CoinImage({
  src,
  alt,
  size = 28,
  className,
}: CoinImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
