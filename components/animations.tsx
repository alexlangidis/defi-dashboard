"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

type StaggerContainerProps = HTMLMotionProps<"div"> & {
  delay?: number;
  gap?: number;
};

export function StaggerContainer({
  children,
  className,
  delay = 0,
  gap = 0.06,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { transition: { staggerChildren: 0, delayChildren: 0 } },
        visible: {
          transition: { staggerChildren: gap, delayChildren: delay },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280, damping: 26 },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 240,
        damping: 24,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
