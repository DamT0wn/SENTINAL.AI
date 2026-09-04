import React, { useState } from "react";
import { AnalysisResult, Post } from "../types";
import { analyzePostFallback } from "../utils/fallbackNLP";
import { ThreatBadge } from "../components/ThreatBadge";
import {
  SearchCode,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Send,
  RefreshCw,
  Info,
  CheckCircle2,
  Tag,
  Zap
} from "lucide-react";

interface PostAnalyzerViewProps {
  initialPost?: Post | null;
}

const SAMPLE_POSTS = [
  {
    label: "Normal Discussion",
    text: "Excited to see modern grid-scale solar efficiency hitting new peaks this quarter. Distributed battery storage is making decentralized clean power viable! #RenewableEnergy #Sustainability #CleanTech"
  },
  {
    label: "Cyberbullying Harassment",
    text: "Look at this absolute fraud @aarav_climate acting like an expert. You know nothing, your research is a joke and you belong in the trash. Delete your account right now! #ExposeThem #FraudAlert"
  },
  {
    label: "Coordinated Astroturf",
    text: "Expose the fraud NOW before it spreads! The entire solar agenda is a massive taxpayer scam designed to bankrupt our power grid. Read the leaked files here: https://bit.ly/grid-dossier-2026 #CleanEnergyHoax #SolarScam #GreenTaxLies"
  }
];

export const PostAnalyzerView: React.FC<PostAnalyzerViewProps> = ({ initialPost }) => {
  const [inputText, setInputText] = useState<string>(
    initialPost ? initialPost.text : SAMPLE_POSTS[0].text
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() =>
    analyzePostFallback(initialPost ? initialPost.text : SAMPLE_POSTS[0].text)
  );

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);

    try {
      // First attempt server-side Gemini endpoint
      const response = await fetch("/api/analyze-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.analysis) {
        // Gemini analysis successful
        const a = data.analysis;
        setAnalysis({
          sentiment: a.sentiment || "Neutral",
          sentimentScore: a.sentimentScore || 0,
          confidence: a.confidence || 88,
          emotion: a.emotion || "Neutral",
          intent: a.intent || "Discussion",
          toxicityScore: a.toxicityScore || 0,
          cyberbullyingRisk: a.cyberbullyingRisk || 0,
          threatIndicators: a.threatIndicators || [],
          topics: a.topics || [],
          explanation: a.explanation || "",
          recommendedAction: a.recommendedAction || "NO ACTION",
          isFallback: false,
          source: "Powered by Gemini"
        });
      } else {
        // Use deterministic fallback
        const fallback = analyzePostFallback(inputText);
        setAnalysis(fallback);
      }
    } catch (err) {
      console.warn("API request failed, falling back to deterministic offline NLP:", err);
      const fallback = analyzePostFallback(inputText);
      setAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ESCALATE":
        return "bg-red-500/20 text-[#F87171] border-red-500/40 animate-pulse";
      case "FLAG FOR REVIEW":
        return "bg-amber-500/20 text-[#FBBF24] border-amber-500/30";
      case "MONITOR":
        return "bg-blue-500/20 text-[#4F7CFF] border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-[#34D399] border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <SearchCode className="w-7 h-7 text-[#4F7CFF]" />
            AI POST ANALYZER
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Deep contextual NLP for toxicity, cyberbullying, coordinated indicators, and recommended moderation actions.
          </p>
        </div>

        {/* Offline Fallback status pill */}
        <div>
          {analysis && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium ${
                analysis.isFallback
                  ? "bg-amber-500/10 text-[#FBBF24] border-amber-500/25"
                  : "bg-purple-500/10 text-[#8B5CF6] border-purple-500/25"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  analysis.isFallback ? "bg-[#FBBF24]" : "bg-[#8B5CF6]"
                }`}
              />
              <span>{analysis.source}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Input & Quick-Picks (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F8FAFC]">
                Analyze a Social Post
              </h3>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {inputText.length} chars
              </span>
            </div>

            {/* Quick-Pick Sample Posts */}
            <div>
              <span className="text-[11px] font-mono text-[#94A3B8] block mb-1.5">
                QUICK-PICK DEMO SCENARIOS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_POSTS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(sample.text)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#151B2E] hover:bg-[#253149] text-[#22D3EE] border border-[#253149] transition-all text-left"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Textarea */}
            <div>
              <textarea
                id="textarea-post-analyzer"
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a social-media post here..."
                className="w-full bg-[#151B2E] border border-[#253149] rounded-xl p-3.5 text-sm text-[#F8FAFC] placeholder:text-slate-500 focus:border-[#4F7CFF] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Analyze Button */}
            <button
              id="btn-analyze-sentinel-ai"
              disabled={isAnalyzing || !inputText.trim()}
              onClick={handleAnalyze}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAnalyzing || !inputText.trim()
                  ? "bg-[#253149] text-[#94A3B8] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#4F7CFF] to-[#8B5CF6] hover:from-blue-600 hover:to-purple-600 text-white cursor-pointer shadow-blue-500/20"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>ANALYZING WITH SENTINEL AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>ANALYZE WITH SENTINEL AI</span>
                </>
              )}
            </button>
          </div>

          {/* Context Note */}
          <div className="bg-[#151B2E] border border-[#253149] rounded-xl p-4 text-xs text-[#94A3B8] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#4F7CFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#F8FAFC]">Resilient NLP Architecture:</span>
              <p className="mt-0.5 leading-relaxed text-[11px]">
                Attempts server-side Gemini analysis. If offline, unconfigured, or rate-limited, it automatically routes through our deterministic offline NLP rule engine.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Analysis Results (7 cols) */}
        <div className="lg:col-span-7">
          {analysis ? (
            <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header with Recommended Action & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#253149]">
                <div>
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">
                    RECOMMENDED HUMAN MODERATOR ACTION
                  </span>
                  <div
                    id="badge-recommended-action"
                    className={`mt-1 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${getActionBadge(
                      analysis.recommendedAction
                    )}`}
                  >
                    <span>{analysis.recommendedAction}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#94A3B8] block">
                    CONFIDENCE
                  </span>
                  <span className="text-lg font-mono font-bold text-[#22D3EE]">
                    {analysis.confidence}%
                  </span>
                </div>
              </div>

              {/* Metric Matrix: Sentiment, Emotion, Intent, Risk */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#151B2E] border border-[#253149] p-3 rounded-xl">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                    SENTIMENT
                  </span>
                  <span
                    className={`text-base font-bold font-mono ${
                      analysis.sentiment === "Positive"
                        ? "text-[#34D399]"
                        : analysis.sentiment === "Negative"
                        ? "text-[#F87171]"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {analysis.sentiment}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono block">
                    Score: {analysis.sentimentScore}
                  </span>
                </div>

                <div className="bg-[#151B2E] border border-[#253149] p-3 rounded-xl">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                    DOMINANT EMOTION
                  </span>
                  <span className="text-base font-bold font-mono text-[#8B5CF6]">
                    {analysis.emotion}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono block">
                    Affective Valence
                  </span>
                </div>

                <div className="bg-[#151B2E] border border-[#253149] p-3 rounded-xl">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                    TOXICITY / HARASSMENT
                  </span>
                  <span
                    className={`text-base font-bold font-mono ${
                      analysis.toxicityScore > 60
                        ? "text-[#F87171]"
                        : analysis.toxicityScore > 30
                        ? "text-[#FBBF24]"
                        : "text-[#34D399]"
                    }`}
                  >
                    {analysis.toxicityScore} / 100
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono block">
                    Toxicity Index
                  </span>
                </div>

                <div className="bg-[#151B2E] border border-[#253149] p-3 rounded-xl">
                  <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                    CYBERBULLYING RISK
                  </span>
                  <span
                    className={`text-base font-bold font-mono ${
                      analysis.cyberbullyingRisk > 60
                        ? "text-[#F87171]"
                        : analysis.cyberbullyingRisk > 30
                        ? "text-[#FBBF24]"
                        : "text-[#34D399]"
                    }`}
                  >
                    {analysis.cyberbullyingRisk} / 100
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono block">
                    Safety Metric
                  </span>
                </div>
              </div>

              {/* Plain-English Explanation */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                  PLAIN-ENGLISH EXPLANATION
                </h4>
                <div className="p-3.5 rounded-xl bg-[#151B2E] border border-[#253149] text-xs text-[#F8FAFC] leading-relaxed">
                  {analysis.explanation}
                </div>
              </div>

              {/* Threat Indicators / Red Flags */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
                  DETECTED THREAT INDICATORS & BEHAVIORAL CUES
                </h4>
                <div className="space-y-1.5">
                  {analysis.threatIndicators.map((ind, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-[#F87171] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F87171]" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics / Entities & Detected Intent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#253149]">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                    EXTRACTED TOPICS / ENTITIES
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.topics.map((top, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-[#151B2E] text-[#22D3EE] border border-[#253149] flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {top}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                    AUTHOR INTENT
                  </h4>
                  <div className="p-2 rounded-lg bg-[#151B2E] border border-[#253149] text-xs font-mono text-[#F8FAFC]">
                    {analysis.intent}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-12 text-center text-[#94A3B8]">
              Select a post or enter text to run intelligence analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
