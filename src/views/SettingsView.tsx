import React from "react";
import { Settings, Shield, Cpu, RefreshCw, Radio, CheckCircle2, Lock, Terminal, FileCode } from "lucide-react";

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-[#8B5CF6]" />
            SETTINGS, ARCHITECTURE & ETHICS
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            System specifications, ethical safety guardrails, weighted threat formulas, and SIH 2026 competition notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#34D399] bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            COMPLIANT & SECURE
          </span>
        </div>
      </div>

      {/* Team & Hackathon Alignment Card */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7CFF] to-[#8B5CF6] flex items-center justify-center font-bold text-xs text-white">
              SX
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                TEAM SYNTRIX • SMART INDIA HACKATHON
              </h3>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                Social Threat Intelligence & Coordinated Disinformation Defense Platform
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#22D3EE] bg-[#151B2E] px-2.5 py-1 rounded border border-[#253149]">
            SIH 2026 Edition
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          SENTINEL-AI was engineered to bridge social media analytics and national cyber safety. Unlike commercial monitoring platforms that merely count keyword frequency, SENTINEL-AI correlates sentiment drops, temporal bursts, phrase overlap, and account creation timelines to uncover hidden coordinated astroturfing campaigns.
        </p>
      </div>

      {/* Architecture & Formula Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F8FAFC]">
            <Terminal className="w-4 h-4 text-[#4F7CFF]" />
            <span>Explainable Threat Scoring Formula</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Every threat score in SENTINEL-AI is fully auditable and deterministic. Rather than an inscrutable black box, risk is computed via a weighted linear combination of 5 orthogonal defense vectors:
          </p>

          <div className="bg-[#151B2E] p-3 rounded-xl border border-[#253149] font-mono text-xs space-y-1.5 text-[#F8FAFC]">
            <div className="text-[#22D3EE] font-bold text-[11px] pb-1 border-b border-[#253149]">
              THREAT_SCORE =
            </div>
            <div className="flex justify-between">
              <span>0.30 × NLP Risk Score</span>
              <span className="text-[#8B5CF6]">30% Weight</span>
            </div>
            <div className="flex justify-between">
              <span>0.20 × Coordination Score</span>
              <span className="text-[#4F7CFF]">20% Weight</span>
            </div>
            <div className="flex justify-between">
              <span>0.20 × Account Behavior Score</span>
              <span className="text-[#22D3EE]">20% Weight</span>
            </div>
            <div className="flex justify-between">
              <span>0.15 × Content Similarity Score</span>
              <span className="text-[#FBBF24]">15% Weight</span>
            </div>
            <div className="flex justify-between">
              <span>0.15 × Historical Campaign Match</span>
              <span className="text-[#F87171]">15% Weight</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F8FAFC]">
            <Cpu className="w-4 h-4 text-[#22D3EE]" />
            <span>Resilient Dual-Tier NLP Pipeline</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Engineered for bulletproof hackathon execution with zero failure modes:
          </p>
          <ul className="space-y-2 text-xs text-[#94A3B8]">
            <li className="p-2.5 rounded-lg bg-[#151B2E] border border-[#253149] flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-1 shrink-0" />
              <div>
                <strong className="text-[#F8FAFC]">Tier 1 (Server-Side Gemini 2.5 Flash):</strong> Deep semantic entity recognition, sarcasm detection, and intent classification via secure server-side Express proxy.
              </div>
            </li>
            <li className="p-2.5 rounded-lg bg-[#151B2E] border border-[#253149] flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] mt-1 shrink-0" />
              <div>
                <strong className="text-[#F8FAFC]">Tier 2 (Deterministic Offline NLP):</strong> Built-in rule engine executing lexicon scoring, profanity/cyberbullying dictionaries, and TF-IDF similarity if API credentials or network connections are unavailable.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Honest Data Representation Notice */}
      <div className="bg-[#1D2638] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#FBBF24]">
          <Shield className="w-5 h-5" />
          <span>Transparent Data Representation Notice</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          In this evaluation deployment, SENTINEL-AI operates on a high-fidelity synthetic benchmark dataset designed to demonstrate complex edge cases (organic discussion, coordinated bot swarms, and cyberbullying spikes) reliably without exposing live third-party personal data.
        </p>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          The platform's ingestion layer is architected for plug-and-play integration with authorized social media enterprise APIs (X/Twitter v2 filtered streams, Meta Graph API, Reddit API, LinkedIn Developer API, or custom Kafka/PubSub pipelines) in enterprise and law enforcement deployments.
        </p>
      </div>

      {/* Reset State Control */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-[#F8FAFC]">
            RESET APPLICATION BENCHMARK DATASET
          </h4>
          <span className="text-[11px] text-[#94A3B8]">
            Restore default synthetic stream posts, alerts, and campaign nodes
          </span>
        </div>
        <button
          onClick={onResetData}
          className="px-4 py-2 rounded-lg bg-[#151B2E] hover:bg-red-500/20 text-[#F87171] border border-red-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All Data
        </button>
      </div>
    </div>
  );
};
