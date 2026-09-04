import React from "react";
import { ThreatAlert } from "../types";
import { ThreatBadge } from "./ThreatBadge";
import { ArrowRight, AlertOctagon } from "lucide-react";

interface AlertCardProps {
  alert: ThreatAlert;
  onInvestigate: (route: string, targetId?: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onInvestigate }) => {
  return (
    <div
      id={`alert-card-${alert.id}`}
      className="bg-[#1D2638] border border-[#253149] rounded-xl p-4 shadow-md hover:border-[#4F7CFF]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg mt-0.5 ${
            alert.severity === "CRITICAL"
              ? "bg-red-500/15 text-[#F87171] border border-red-500/30"
              : alert.severity === "HIGH"
              ? "bg-rose-500/15 text-[#F87171] border border-rose-500/30"
              : alert.severity === "MEDIUM"
              ? "bg-amber-500/15 text-[#FBBF24] border border-amber-500/30"
              : "bg-emerald-500/15 text-[#34D399] border border-emerald-500/30"
          }`}
        >
          <AlertOctagon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ThreatBadge level={alert.severity} size="sm" />
            <h4 className="text-sm font-semibold text-[#F8FAFC]">
              {alert.title}
            </h4>
            <span className="text-[11px] text-[#94A3B8] font-mono">
              • {alert.timestamp}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
            {alert.description}
          </p>
        </div>
      </div>

      <button
        onClick={() => onInvestigate(alert.targetRoute, alert.targetId)}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151B2E] hover:bg-[#4F7CFF] text-xs font-semibold text-[#F8FAFC] border border-[#253149] hover:border-[#4F7CFF] transition-all"
      >
        <span>Investigate</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
