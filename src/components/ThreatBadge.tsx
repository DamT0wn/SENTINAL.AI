import React from "react";
import { RiskLevel } from "../types";

interface ThreatBadgeProps {
  level: RiskLevel | string;
  size?: "sm" | "md" | "lg";
  showScore?: number;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level, size = "md", showScore }) => {
  const normLevel = (level || "LOW").toUpperCase();

  let bg = "bg-emerald-500/15 text-[#34D399] border-emerald-500/30";
  let dotColor = "bg-[#34D399]";

  if (normLevel === "CRITICAL") {
    bg = "bg-red-500/20 text-[#F87171] border-red-500/40 animate-pulse";
    dotColor = "bg-[#F87171]";
  } else if (normLevel === "HIGH") {
    bg = "bg-rose-500/15 text-[#F87171] border-rose-500/30";
    dotColor = "bg-[#F87171]";
  } else if (normLevel === "MEDIUM") {
    bg = "bg-amber-500/15 text-[#FBBF24] border-amber-500/30";
    dotColor = "bg-[#FBBF24]";
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3.5 py-1.5 font-semibold"
      : "text-xs px-2.5 py-1 font-medium";

  return (
    <span
      id={`threat-badge-${normLevel.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${sizeClasses} whitespace-nowrap tracking-wide`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{normLevel}</span>
      {typeof showScore === "number" && (
        <span className="font-mono text-[11px] opacity-90">({showScore})</span>
      )}
    </span>
  );
};
