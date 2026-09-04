import React from "react";
import { ThreatBreakdown, RiskLevel } from "../types";
import { ThreatBadge } from "./ThreatBadge";

interface ThreatScoreGaugeProps {
  score: number;
  threatLevel: RiskLevel;
  breakdown: ThreatBreakdown;
  size?: "sm" | "md" | "lg";
  title?: string;
  showBreakdown?: boolean;
}

export const ThreatScoreGauge: React.FC<ThreatScoreGaugeProps> = ({
  score,
  threatLevel,
  breakdown,
  title = "COMPUTED THREAT SCORE",
  showBreakdown = true
}) => {
  const getScoreColor = (val: number) => {
    if (val > 80) return "text-[#F87171] stroke-[#F87171]";
    if (val > 60) return "text-[#F87171] stroke-[#F87171]";
    if (val > 30) return "text-[#FBBF24] stroke-[#FBBF24]";
    return "text-[#34D399] stroke-[#34D399]";
  };

  const factors = [
    { label: "NLP Risk", weight: "30%", val: breakdown.nlpRisk, color: "bg-[#8B5CF6]" },
    { label: "Coordination Score", weight: "20%", val: breakdown.coordinationScore, color: "bg-[#4F7CFF]" },
    { label: "Account Behavior", weight: "20%", val: breakdown.accountBehavior, color: "bg-[#22D3EE]" },
    { label: "Content Similarity", weight: "15%", val: breakdown.contentSimilarity, color: "bg-[#FBBF24]" },
    { label: "Historical Match", weight: "15%", val: breakdown.historicalSimilarity, color: "bg-[#F87171]" },
  ];

  return (
    <div className="bg-[#1D2638] border border-[#253149] rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2 border-b border-[#253149] pb-3 mb-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {title}
          </h4>
          <span className="text-[11px] text-[#94A3B8]">
            Formula: 30% NLP + 20% Coord + 20% Acct + 15% Sim + 15% Hist
          </span>
        </div>
        <ThreatBadge level={threatLevel} size="md" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Visual Gauge Circle */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="#151B2E"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              className={getScoreColor(score)}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - score / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold font-mono ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8]">
              / 100
            </span>
          </div>
        </div>

        {/* Contributing Factors breakdown */}
        {showBreakdown && (
          <div className="w-full flex-1 space-y-2.5">
            {factors.map((f, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#F8FAFC] font-medium flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${f.color}`} />
                    {f.label}
                    <span className="text-[10px] text-[#94A3B8] font-mono">({f.weight})</span>
                  </span>
                  <span className="font-mono font-semibold text-[#F8FAFC]">
                    {f.val} <span className="text-[#94A3B8] font-normal text-[10px]">/ 100</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#151B2E] rounded-full overflow-hidden border border-[#253149]">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, f.val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#253149] flex items-center justify-between text-[11px] text-[#94A3B8]">
        <span>Risk Thresholds:</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#34D399]">0-30 LOW</span>
          <span>•</span>
          <span className="text-[#FBBF24]">31-60 MED</span>
          <span>•</span>
          <span className="text-[#F87171]">61-80 HIGH</span>
          <span>•</span>
          <span className="text-[#F87171] font-bold">81-100 CRIT</span>
        </div>
      </div>
    </div>
  );
};
