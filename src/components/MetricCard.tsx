import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isAdversarial?: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
  id?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "text-[#4F7CFF]",
  onClick,
  id
}) => {
  return (
    <div
      id={id || `metric-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      className={`bg-[#1D2638] border border-[#253149] rounded-xl p-5 shadow-lg transition-all duration-200 hover:border-[#4F7CFF]/50 hover:bg-[#253149]/50 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-[#151B2E] border border-[#253149] ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <div className="text-2xl font-bold font-mono tracking-tight text-[#F8FAFC]">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend.isAdversarial
                ? "bg-red-500/15 text-[#F87171] border border-red-500/30"
                : trend.isPositive
                ? "bg-emerald-500/15 text-[#34D399] border border-emerald-500/30"
                : "bg-slate-700/50 text-[#94A3B8] border border-slate-600/30"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
