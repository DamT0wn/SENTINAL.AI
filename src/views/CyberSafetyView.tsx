import React, { useState } from "react";
import { Post } from "../types";
import { analyzePostFallback } from "../utils/fallbackNLP";
import { ThreatBadge } from "../components/ThreatBadge";
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertOctagon,
  CornerDownRight
} from "lucide-react";

interface CyberSafetyViewProps {
  posts: Post[];
  onAnalyzePost: (post: Post) => void;
}

export const CyberSafetyView: React.FC<CyberSafetyViewProps> = ({
  posts,
  onAnalyzePost
}) => {
  // Grab high toxicity or cyberbullying posts from dataset
  const harassmentPosts = posts.filter(
    (p) => (p.cyberbullyingRisk || 0) > 40 || (p.toxicityScore || 0) > 40 || p.scenario === "cyberbullying"
  );

  const [selectedPost, setSelectedPost] = useState<Post>(
    harassmentPosts[0] || posts[0]
  );
  const [customText, setCustomText] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const textToAnalyze = useCustom ? customText : selectedPost?.text || "";
  const analysis = analyzePostFallback(textToAnalyze);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#34D399]" />
            CYBER SAFETY & HARASSMENT DETECTION
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Proactive identification of targeted harassment, hate speech, dogpiling, and digital bullying vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#FBBF24] bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
            {harassmentPosts.length} Incidents Flagged in Stream
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Harassment Incidents in Dataset / Custom Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Select Incident or Input Text
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseCustom(false)}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    !useCustom ? "bg-[#4F7CFF] text-white font-bold" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  Stream Incidents
                </button>
                <button
                  onClick={() => {
                    setUseCustom(true);
                    if (!customText) {
                      setCustomText("You are an absolute fraud. Nobody likes your work and you should delete your account right now.");
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    useCustom ? "bg-[#4F7CFF] text-white font-bold" : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {!useCustom ? (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
                {harassmentPosts.map((post) => {
                  const isSelected = selectedPost?.id === post.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#151B2E] border-[#F87171] shadow-md shadow-red-500/10"
                          : "bg-[#111827] border-[#253149] hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-[#F8FAFC]">@{post.username}</span>
                        <ThreatBadge level="HIGH" size="sm" showScore={post.cyberbullyingRisk || 78} />
                      </div>
                      <p className="text-xs text-[#94A3B8] line-clamp-2">{post.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter text to analyze for cyberbullying / safety risks..."
                  className="w-full bg-[#151B2E] border border-[#253149] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Ethics & Moderation Disclaimer */}
          <div className="bg-[#151B2E] border border-[#253149] rounded-xl p-4 text-xs text-[#94A3B8] space-y-2">
            <div className="flex items-center gap-2 text-[#FBBF24] font-semibold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Moderation & Safety Policy Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              SENTINEL-AI operates as an advisory assistive intelligence system. All flags and recommendations ("ESCALATE", "FLAG FOR REVIEW") are calibrated to support human trust and safety teams, preventing autonomous censorship and upholding ethical moderation standards.
            </p>
          </div>
        </div>

        {/* Right: Detailed Risk Scoring & Evidence Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header with Risk Level */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#253149]">
              <div>
                <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">
                  EVALUATED SAFETY STATUS
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <ThreatBadge
                    level={
                      analysis.cyberbullyingRisk > 70
                        ? "CRITICAL"
                        : analysis.cyberbullyingRisk > 45
                        ? "HIGH"
                        : analysis.cyberbullyingRisk > 25
                        ? "MEDIUM"
                        : "LOW"
                    }
                    size="lg"
                    showScore={analysis.cyberbullyingRisk}
                  />
                  <span className="text-xs font-mono text-[#94A3B8]">
                    Toxicity: {analysis.toxicityScore} / 100
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-[#94A3B8] block">
                  RECOMMENDED ACTION
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase mt-1 ${
                    analysis.recommendedAction === "ESCALATE"
                      ? "bg-red-500/20 text-[#F87171] border border-red-500/40"
                      : analysis.recommendedAction === "FLAG FOR REVIEW"
                      ? "bg-amber-500/20 text-[#FBBF24] border border-amber-500/30"
                      : "bg-emerald-500/20 text-[#34D399] border border-emerald-500/30"
                  }`}
                >
                  {analysis.recommendedAction}
                </span>
              </div>
            </div>

            {/* Target Post Quote */}
            <div>
              <span className="text-xs font-mono text-[#94A3B8] uppercase block mb-1.5">
                INSPECTED TEXT:
              </span>
              <div className="p-3.5 rounded-xl bg-[#151B2E] border border-[#253149] text-xs text-[#F8FAFC] leading-relaxed italic">
                "{textToAnalyze}"
              </div>
            </div>

            {/* Cyberbullying Risk Gauge / Visual Bar */}
            <div className="bg-[#151B2E] border border-[#253149] p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#F8FAFC]">
                  Cyberbullying & Harassment Probability Gauge
                </span>
                <span className="font-mono font-bold text-base text-[#F87171]">
                  {analysis.cyberbullyingRisk} <span className="text-xs text-[#94A3B8]">/ 100</span>
                </span>
              </div>
              <div className="w-full h-3 bg-[#111827] rounded-full overflow-hidden border border-[#253149]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.cyberbullyingRisk}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
                <span>0 LOW</span>
                <span>30 MEDIUM</span>
                <span>60 HIGH</span>
                <span>100 CRITICAL</span>
              </div>
            </div>

            {/* Detected Evidence Breakdown */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-[#F87171]" />
                DETECTED EVIDENCE & LINGUISTIC MARKERS
              </h4>
              <div className="space-y-2">
                {analysis.threatIndicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#151B2E] border border-red-500/20 text-xs text-[#F8FAFC] flex items-start gap-2.5"
                  >
                    <CornerDownRight className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#F87171]">Marker {i + 1}: </strong>
                      <span>{ind}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plain-English Explanation */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                SAFETY EXPLANATION
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#151B2E] p-3.5 rounded-xl border border-[#253149]">
                {analysis.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
