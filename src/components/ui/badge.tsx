import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "orange" | "blue" | "amber" | "muted";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-beacon-border bg-beacon-card text-beacon-ivory/70",
    orange:  "border-beacon-orange/30 bg-beacon-orange/15 text-beacon-orange",
    blue:    "border-beacon-blue/30 bg-beacon-blue/15 text-beacon-blue",
    amber:   "border-beacon-amber/30 bg-beacon-amber/15 text-beacon-amber",
    muted:   "border-beacon-border bg-beacon-muted text-beacon-ivory/40",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
