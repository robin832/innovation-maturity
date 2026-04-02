import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function scoreToPercent(score: number, max = 5): number {
  return Math.round((score / max) * 100);
}

export function getMaturityLevel(score: number) {
  if (score >= 4.5) return { label: "Innovation Pioneer",  color: "#FCC287" };
  if (score >= 3.5) return { label: "Innovation Leader",   color: "#E36037" };
  if (score >= 2.5) return { label: "Innovation Active",   color: "#00ACD9" };
  if (score >= 1.5) return { label: "Innovation Follower", color: "#F59E0B" };
  return               { label: "Innovation Laggard",  color: "#6B7280" };
}

export function confidenceBadge(confidence: "high" | "medium" | "low") {
  const map = {
    high:   { label: "High confidence",   className: "bg-beacon-blue/20 text-beacon-blue border-beacon-blue/30" },
    medium: { label: "Medium confidence", className: "bg-beacon-amber/20 text-beacon-amber border-beacon-amber/30" },
    low:    { label: "Limited public data", className: "bg-beacon-muted/40 text-beacon-ivory/60 border-beacon-border" },
  };
  return map[confidence];
}
