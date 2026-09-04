import React from "react";
import { ActiveTab } from "../types";
import {
  LayoutDashboard,
  BarChart3,
  SearchCode,
  TrendingUp,
  Users,
  ShieldAlert,
  Network,
  ShieldCheck,
  AlertOctagon,
  Settings,
  Flame,
  Radio,
  SlidersHorizontal
} from "lucide-react";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeScenario: "all" | "normal" | "cyberbullying" | "coordinated";
  setActiveScenario: (scenario: "all" | "normal" | "cyberbullying" | "coordinated") => void;
  onOpenSimulation: () => void;
  onOpenCsvImport: () => void;
  threatCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeScenario,
  setActiveScenario,
  onOpenSimulation,
  onOpenCsvImport,
  threatCount,
}) => {
  const socialItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "social-analytics", label: "Social Analytics", icon: BarChart3 },
    { id: "post-analyzer", label: "Post Analyzer", icon: SearchCode },
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "audience", label: "Audience", icon: Users },
  ];

  const threatItems = [
    { id: "campaigns", label: "Campaigns", icon: ShieldAlert, badge: "Detected" },
    { id: "network", label: "Network", icon: Network },
    { id: "cyber-safety", label: "Cyber Safety", icon: ShieldCheck },
    { id: "threat-center", label: "Threat Center", icon: AlertOctagon, count: threatCount },
  ];

  return (
    <aside className="w-64 bg-[#151B2E] border-r border-[#253149] flex flex-col shrink-0 select-none h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#253149] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider font-mono text-[#F8FAFC]">
              SENTINEL<span className="text-[#4F7CFF]">-AI</span>
            </span>
            <span className="block text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase">
              Team Syntrix • SIH
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Simulation Trigger in Sidebar */}
        <div>
          <button
            id="sidebar-run-simulation"
            onClick={onOpenSimulation}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-500/20 via-[#8B5CF6]/20 to-[#4F7CFF]/20 hover:from-red-500/30 hover:to-[#4F7CFF]/30 border border-red-500/40 text-xs font-bold text-[#F8FAFC] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group"
          >
            <Flame className="w-4 h-4 text-[#F87171] group-hover:scale-110 transition-transform" />
            <span>RUN THREAT SIMULATION</span>
          </button>
        </div>

        {/* SOCIAL INTELLIGENCE SECTION */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-2">
            SOCIAL INTELLIGENCE
          </div>
          <nav className="space-y-1">
            {socialItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#4F7CFF] text-white shadow-md shadow-blue-600/30"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2638]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* THREAT INTELLIGENCE SECTION */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-2 flex items-center justify-between">
            <span>THREAT INTELLIGENCE</span>
            <span className="text-[9px] font-mono bg-red-500/20 text-[#F87171] px-1.5 py-0.2 rounded">
              DEFENSIVE
            </span>
          </div>
          <nav className="space-y-1">
            {threatItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#8B5CF6] text-white shadow-md shadow-purple-600/30"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2638]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono uppercase bg-red-500/20 text-[#F87171] px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === "number" && (
                    <span className="text-[10px] font-mono bg-[#1D2638] text-[#22D3EE] px-1.5 py-0.5 rounded border border-[#253149]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* DATASET SCENARIO SELECTOR */}
        <div className="pt-2 border-t border-[#253149]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-2 flex items-center justify-between">
            <span>DATA SCENARIO</span>
            <span className="font-mono text-[#22D3EE]">DEMO</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {[
              { id: "all", label: "All Data" },
              { id: "normal", label: "Scenario A" },
              { id: "cyberbullying", label: "Scenario B" },
              { id: "coordinated", label: "Scenario C" }
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id as any)}
                className={`text-[11px] py-1.5 px-2 rounded-md font-mono transition-all text-center ${
                  activeScenario === sc.id
                    ? "bg-[#253149] text-[#22D3EE] font-bold border border-[#4F7CFF]/50"
                    : "bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#253149]"
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="p-4 border-t border-[#253149] bg-[#111827] space-y-2">
        <button
          onClick={onOpenCsvImport}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2638] transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Import CSV Dataset</span>
          </div>
        </button>

        <button
          id="nav-item-settings"
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
            activeTab === "settings"
              ? "bg-[#1D2638] text-[#F8FAFC] font-bold"
              : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D2638]"
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Settings & Ethics</span>
          </div>
          <span className="text-[10px] text-[#34D399] font-mono">v1.0</span>
        </button>

        <div className="pt-2 border-t border-[#253149] flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
            DEMO STREAM ACTIVE
          </span>
          <span className="text-slate-500">SIH 2026</span>
        </div>
      </div>
    </aside>
  );
};
