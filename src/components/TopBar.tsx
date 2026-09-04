import React from "react";
import { Flame, Activity, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface TopBarProps {
  onOpenSimulation: () => void;
  threatDetected: boolean;
  simulationRunning: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSimulation,
  threatDetected,
  simulationRunning
}) => {
  return (
    <header className="bg-[#151B2E] border-b border-[#253149] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* Left: App Title & Operational Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold font-mono text-[#F8FAFC]">
            SENTINEL-AI
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            | Social Threat Intelligence
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#34D399] border border-emerald-500/25 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            System Status: OPERATIONAL
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-[#22D3EE] border border-cyan-500/25 font-mono text-[11px]">
            Demo Mode: ACTIVE
          </span>
        </div>
      </div>

      {/* Right: Simulated Social Stream Badge & Threat Simulation CTA */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#22D3EE]">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
            SIMULATED SOCIAL STREAM
          </div>
          <span className="text-[10px] text-[#94A3B8]">
            Last updated: Just now
          </span>
        </div>

        <button
          id="topbar-run-threat-simulation"
          onClick={onOpenSimulation}
          disabled={simulationRunning}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
            simulationRunning
              ? "bg-[#253149] text-[#94A3B8] cursor-not-allowed"
              : threatDetected
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 animate-pulse"
              : "bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white shadow-blue-500/20"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>RUN THREAT SIMULATION</span>
        </button>
      </div>
    </header>
  );
};
