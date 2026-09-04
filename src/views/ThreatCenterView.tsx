import React, { useState } from "react";
import { ThreatAlert, ActiveTab } from "../types";
import { AlertCard } from "../components/AlertCard";
import { ThreatBadge } from "../components/ThreatBadge";
import { AlertOctagon, Filter, ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react";

interface ThreatCenterViewProps {
  alerts: ThreatAlert[];
  onNavigate: (tab: ActiveTab, targetId?: string) => void;
}

export const ThreatCenterView: React.FC<ThreatCenterViewProps> = ({ alerts, onNavigate }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity === "all") return true;
    return a.severity.toLowerCase() === selectedSeverity.toLowerCase();
  });

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const highCount = alerts.filter((a) => a.severity === "HIGH").length;
  const medCount = alerts.filter((a) => a.severity === "MEDIUM").length;
  const lowCount = alerts.filter((a) => a.severity === "LOW").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <AlertOctagon className="w-7 h-7 text-[#F87171]" />
            THREAT INTELLIGENCE CENTER
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Unified operational command queue for triage, threat investigation, and coordinated adversarial intervention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThreatBadge level="CRITICAL" showScore={criticalCount} />
          <ThreatBadge level="HIGH" showScore={highCount} />
        </div>
      </div>

      {/* Severity Triage Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === "CRITICAL" ? "all" : "CRITICAL")}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === "CRITICAL"
              ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20"
              : "bg-[#1D2638] border-[#253149] hover:border-red-500/50"
          }`}
        >
          <span className="text-[10px] text-[#F87171] uppercase font-bold block">
            CRITICAL SEVERITY
          </span>
          <span className="text-2xl font-bold text-[#F87171] mt-1 block">
            {criticalCount}
          </span>
          <span className="text-[11px] text-[#94A3B8]">Immediate action required</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === "HIGH" ? "all" : "HIGH")}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === "HIGH"
              ? "bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/20"
              : "bg-[#1D2638] border-[#253149] hover:border-rose-500/50"
          }`}
        >
          <span className="text-[10px] text-[#F87171] uppercase font-bold block">
            HIGH SEVERITY
          </span>
          <span className="text-2xl font-bold text-[#F87171] mt-1 block">
            {highCount}
          </span>
          <span className="text-[11px] text-[#94A3B8]">Active harassment / swarm</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === "MEDIUM" ? "all" : "MEDIUM")}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === "MEDIUM"
              ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20"
              : "bg-[#1D2638] border-[#253149] hover:border-amber-500/50"
          }`}
        >
          <span className="text-[10px] text-[#FBBF24] uppercase font-bold block">
            MEDIUM SEVERITY
          </span>
          <span className="text-2xl font-bold text-[#FBBF24] mt-1 block">
            {medCount}
          </span>
          <span className="text-[11px] text-[#94A3B8]">Elevated negative velocity</span>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === "LOW" ? "all" : "LOW")}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedSeverity === "LOW"
              ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20"
              : "bg-[#1D2638] border-[#253149] hover:border-emerald-500/50"
          }`}
        >
          <span className="text-[10px] text-[#34D399] uppercase font-bold block">
            LOW / NOMINAL
          </span>
          <span className="text-2xl font-bold text-[#34D399] mt-1 block">
            {lowCount}
          </span>
          <span className="text-[11px] text-[#94A3B8]">Informational cues</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-[#1D2638] border border-[#253149] p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-[#94A3B8]">
          <Filter className="w-3.5 h-3.5 text-[#4F7CFF]" />
          <span>Active Severity Filter:</span>
          <strong className="text-[#F8FAFC] uppercase font-mono">{selectedSeverity}</strong>
        </div>

        {selectedSeverity !== "all" && (
          <button
            onClick={() => setSelectedSeverity("all")}
            className="text-xs text-[#4F7CFF] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Show All Alerts
          </button>
        )}
      </div>

      {/* Alerts Queue */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onInvestigate={(route, targetId) => onNavigate(route as ActiveTab, targetId)}
            />
          ))
        ) : (
          <div className="bg-[#1D2638] border border-[#253149] p-12 text-center rounded-2xl text-[#94A3B8]">
            <CheckCircle2 className="w-8 h-8 text-[#34D399] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#F8FAFC]">No active alerts matching "{selectedSeverity}" severity.</p>
          </div>
        )}
      </div>
    </div>
  );
};
