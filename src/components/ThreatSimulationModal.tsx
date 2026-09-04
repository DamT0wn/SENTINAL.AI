import React, { useState, useEffect } from "react";
import { X, Play, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Activity } from "lucide-react";
import { ThreatBadge } from "./ThreatBadge";

interface ThreatSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSimulation: () => void;
  onInvestigateCampaign: () => void;
}

const STEPS = [
  { id: 1, label: "Receiving simulated social stream...", desc: "Ingesting incoming 8 high-velocity posts across synthetic nodes" },
  { id: 2, label: "Sentiment analyzed", desc: "Negative sentiment spiked to 88% across Renewable Energy nodes" },
  { id: 3, label: "Topics detected", desc: "Clustering detected #CleanEnergyHoax surge with 98% phrase overlap" },
  { id: 4, label: "Behavior analyzed", desc: "Identified burst posting anomaly from 8 accounts created within 14 days" },
  { id: 5, label: "Coordination analyzed", desc: "Calculated 92% cross-account coordination across time & content" },
  { id: 6, label: "Threat score calculated", desc: "Applied formula (30% NLP + 20% Coord + 20% Acct + 15% Sim + 15% Hist)" },
  { id: 7, label: "COORDINATED ACTIVITY DETECTED", desc: "Actionable alert generated for human safety and moderation teams" },
];

export const ThreatSimulationModal: React.FC<ThreatSimulationModalProps> = ({
  isOpen,
  onClose,
  onCompleteSimulation,
  onInvestigateCampaign,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [isOpen]);

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsFinished(false);
    setCurrentStep(1);

    // Sequence runs across 4.2 seconds (approx 600ms per step)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 7) {
          clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          onCompleteSimulation();
          return 7;
        }
        return prev + 1;
      });
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151B2E] border border-[#253149] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#253149] flex items-center justify-between bg-[#1D2638]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/15 text-[#F87171] border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                RUN THREAT SIMULATION
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-blue-500/15 text-[#4F7CFF] border border-blue-500/30">
                  SCENARIO C
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Demonstrates real-time correlation of social stream, sentiment, behavioral bursts, and coordination scoring.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#253149] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-[#94A3B8] mb-2">
              <span>PIPELINE EXECUTION PROGRESS</span>
              <span>{Math.round((currentStep / 7) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden border border-[#253149]">
              <div
                className="h-full bg-gradient-to-r from-[#4F7CFF] via-[#8B5CF6] to-[#F87171] transition-all duration-300"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Stepper Display */}
          <div className="space-y-2.5 bg-[#111827] border border-[#253149] rounded-xl p-4 max-h-[300px] overflow-y-auto">
            {STEPS.map((step) => {
              const isPast = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-[#1D2638] border-[#4F7CFF] text-[#F8FAFC]"
                      : isPast
                      ? "bg-[#151B2E]/70 border-[#253149] text-[#94A3B8]"
                      : "opacity-40 border-transparent text-slate-500"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    ) : isCurrent ? (
                      <Activity className="w-4 h-4 text-[#4F7CFF] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-mono">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span className={isCurrent ? "text-[#22D3EE]" : ""}>
                        Step {step.id}: {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono uppercase bg-[#4F7CFF]/20 text-[#4F7CFF] px-1.5 py-0.2 rounded">
                          Processing
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Banner when finished */}
          {isFinished && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#F87171] animate-bounce" />
                  <span className="text-sm font-bold text-[#F87171] tracking-wide">
                    ⚠ COORDINATED ACTIVITY DETECTED
                  </span>
                </div>
                <ThreatBadge level="CRITICAL" showScore={87} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-red-500/20 text-center font-mono">
                <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">COORDINATION</span>
                  <span className="text-base font-bold text-[#F87171]">92%</span>
                </div>
                <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">THREAT SCORE</span>
                  <span className="text-base font-bold text-[#F87171]">87 / 100</span>
                </div>
                <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">ACCOUNTS INVOLVED</span>
                  <span className="text-base font-bold text-[#F8FAFC]">8</span>
                </div>
                <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">BURST WINDOW</span>
                  <span className="text-base font-bold text-[#22D3EE]">5 mins</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#94A3B8]">
                Disinformation burst identified using identical hashtag cluster (<span className="text-[#22D3EE]">#CleanEnergyHoax</span>) and obfuscated bit.ly link targets.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#253149] bg-[#1D2638] flex items-center justify-between">
          <span className="text-xs text-[#94A3B8] font-mono">
            Mode: Synthetic Stream Injection
          </span>
          <div className="flex items-center gap-3">
            {!isRunning && !isFinished ? (
              <button
                id="btn-trigger-simulation"
                onClick={startSimulation}
                className="px-5 py-2.5 rounded-lg bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                START 5-SECOND SIMULATION
              </button>
            ) : isRunning ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-lg bg-[#253149] text-[#94A3B8] text-xs font-medium flex items-center gap-2 cursor-not-allowed"
              >
                <Activity className="w-4 h-4 animate-spin text-[#4F7CFF]" />
                SIMULATION IN PROGRESS...
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={startSimulation}
                  className="px-3.5 py-2 rounded-lg bg-[#151B2E] hover:bg-[#253149] text-xs text-[#94A3B8] border border-[#253149] transition-all"
                >
                  Run Again
                </button>
                <button
                  id="btn-investigate-campaign-sim"
                  onClick={() => {
                    onClose();
                    onInvestigateCampaign();
                  }}
                  className="px-5 py-2 rounded-lg bg-[#F87171] hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                >
                  <span>INVESTIGATE CAMPAIGN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
