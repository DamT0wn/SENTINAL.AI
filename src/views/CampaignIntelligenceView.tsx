import React from "react";
import { Campaign, Account, Post } from "../types";
import { ThreatScoreGauge } from "../components/ThreatScoreGauge";
import { ThreatBadge } from "../components/ThreatBadge";
import {
  ShieldAlert,
  Network,
  Users,
  Repeat,
  Clock,
  ExternalLink,
  History,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Layers
} from "lucide-react";

interface CampaignIntelligenceViewProps {
  campaigns: Campaign[];
  accounts: Account[];
  posts: Post[];
  selectedCampaignId?: string | null;
  onSelectCampaign: (id: string) => void;
  onNavigateToNetwork: (campaignId?: string) => void;
  onSelectAccount: (username: string) => void;
}

export const CampaignIntelligenceView: React.FC<CampaignIntelligenceViewProps> = ({
  campaigns,
  accounts,
  posts,
  selectedCampaignId,
  onSelectCampaign,
  onNavigateToNetwork,
  onSelectAccount
}) => {
  const currentCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const accountsList = currentCampaign?.accountsInvolved || currentCampaign?.accounts || [];
  const burstWindow = currentCampaign?.burstWindow || currentCampaign?.timeWindow || "5m window";
  const summaryDesc = currentCampaign?.description || currentCampaign?.summary || "";
  const targetNarrative = currentCampaign?.targetNarrative || "Coordinated Astroturf";

  const coordinationSignals = currentCampaign?.coordinationSignals || {
    timeSynchronicity: currentCampaign?.coordinationBreakdown?.temporalProximity || 94,
    contentSimilarity: currentCampaign?.coordinationBreakdown?.contentSimilarity || 91,
    hashtagOverlap: currentCampaign?.coordinationBreakdown?.sharedHashtags || 96,
    accountAgeDistribution: currentCampaign?.coordinationBreakdown?.activityBurst || 92,
    urlCooccurrence: currentCampaign?.coordinationBreakdown?.sharedUrls || 88,
  };

  const campaignAccounts = accounts.filter((a) =>
    accountsList.includes(a.username)
  );

  const campaignPosts = posts.filter(
    (p) => p.campaignId === currentCampaign?.id || (currentCampaign?.posts && currentCampaign.posts.includes(p.id))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-[#F87171]" />
            CAMPAIGN INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Algorithmic detection of coordinated inauthentic behavior, narrative manipulation swarms, and synthetic astroturfing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-view-network-campaign"
            onClick={() => onNavigateToNetwork(currentCampaign?.id)}
            className="px-4 py-2 rounded-xl bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span>VIEW NETWORK GRAPH</span>
          </button>
        </div>
      </div>

      {/* Campaign Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {campaigns.map((camp) => {
          const isSelected = currentCampaign?.id === camp.id;
          return (
            <button
              key={camp.id}
              onClick={() => onSelectCampaign(camp.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? "bg-[#1D2638] border-[#4F7CFF] text-[#F8FAFC] shadow-md shadow-blue-500/10"
                  : "bg-[#151B2E] border-[#253149] text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  camp.threatLevel === "CRITICAL" ? "bg-[#F87171] animate-pulse" : "bg-[#FBBF24]"
                }`}
              />
              <span>{camp.name}</span>
              <ThreatBadge level={camp.threatLevel} size="sm" showScore={camp.threatScore} />
            </button>
          );
        })}
      </div>

      {currentCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Detailed Campaign Overview & Scoring (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Campaign Card */}
            <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#253149]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#94A3B8]">
                      {currentCampaign.id}
                    </span>
                    <span className="text-xs font-mono text-[#F87171] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase font-bold">
                      {targetNarrative}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#F8FAFC] mt-1">
                    {currentCampaign.name}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    {summaryDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ThreatBadge level={currentCampaign.threatLevel} size="lg" />
                </div>
              </div>

              {/* 4 Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="bg-[#151B2E] p-3 rounded-xl border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">COORDINATION</span>
                  <span className="text-xl font-bold text-[#4F7CFF]">
                    {currentCampaign.coordinationScore}%
                  </span>
                </div>

                <div className="bg-[#151B2E] p-3 rounded-xl border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">THREAT SCORE</span>
                  <span className="text-xl font-bold text-[#F87171]">
                    {currentCampaign.threatScore} / 100
                  </span>
                </div>

                <div className="bg-[#151B2E] p-3 rounded-xl border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">ACCOUNTS</span>
                  <span className="text-xl font-bold text-[#F8FAFC]">
                    {accountsList.length} Nodes
                  </span>
                </div>

                <div className="bg-[#151B2E] p-3 rounded-xl border border-[#253149]">
                  <span className="text-[10px] text-[#94A3B8] block">BURST WINDOW</span>
                  <span className="text-xl font-bold text-[#22D3EE]">
                    {burstWindow}
                  </span>
                </div>
              </div>

              {/* 5-Signal Coordination Score Breakdown */}
              <div className="pt-2 border-t border-[#253149] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                    5-SIGNAL COORDINATION SCORE BREAKDOWN
                  </h4>
                  <span className="text-xs font-mono text-[#4F7CFF] font-bold">
                    Composite: {currentCampaign.coordinationScore}%
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: "1. Time Synchronicity", desc: "Posting latency clustered within 5-minute interval", val: coordinationSignals.timeSynchronicity, color: "bg-[#4F7CFF]" },
                    { label: "2. Content Similarity", desc: "TF-IDF N-gram overlap of phrases & claims", val: coordinationSignals.contentSimilarity, color: "bg-[#8B5CF6]" },
                    { label: "3. Hashtag Overlap", desc: "Shared hashtag co-occurrence across disjoint authors", val: coordinationSignals.hashtagOverlap, color: "bg-[#22D3EE]" },
                    { label: "4. Account Age Distribution", desc: "Suspiciously recent account creations (<14 days)", val: coordinationSignals.accountAgeDistribution, color: "bg-[#FBBF24]" },
                    { label: "5. URL Co-occurrence", desc: "Identical shortened/obfuscated hyperlink dissemination", val: coordinationSignals.urlCooccurrence, color: "bg-[#F87171]" },
                  ].map((sig, i) => (
                    <div key={i} className="text-xs bg-[#151B2E] p-2.5 rounded-xl border border-[#253149]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[#F8FAFC]">{sig.label}</span>
                        <span className="font-mono font-bold text-[#F8FAFC]">{sig.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#111827] rounded-full overflow-hidden mb-1">
                        <div className={`h-full ${sig.color} rounded-full`} style={{ width: `${sig.val}%` }} />
                      </div>
                      <span className="text-[10px] text-[#94A3B8]">{sig.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeated Phrases */}
              <div className="pt-2 border-t border-[#253149]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-[#22D3EE]" />
                  REPEATED PHRASES & ASTROTURF CLUSTERS
                </h4>
                <div className="space-y-1.5">
                  {currentCampaign.repeatedPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#151B2E] border border-[#253149] text-xs text-[#F8FAFC] font-mono flex items-center justify-between"
                    >
                      <span className="text-[#22D3EE]">"{phrase}"</span>
                      <span className="text-[10px] text-[#94A3B8] bg-[#111827] px-2 py-0.5 rounded">
                        Repeated across {accountsList.length} accounts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical Campaign Match Section */}
            {currentCampaign.historicalMatch && (
              <div className="bg-[#1D2638] border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[#4F7CFF]" />
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      HISTORICAL CAMPAIGN MATCH (TF-IDF + COSINE SIMILARITY)
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#4F7CFF] bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/30">
                    {currentCampaign.historicalMatch.matchPercentage || currentCampaign.historicalMatch.similarity}% MATCH
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Matched Prior Threat Dossier:</span>
                    <span className="font-mono font-bold text-[#F8FAFC]">
                      {currentCampaign.historicalMatch.campaignName}
                    </span>
                  </div>

                  <p className="text-[#94A3B8] bg-[#151B2E] p-3 rounded-xl border border-[#253149] leading-relaxed">
                    <strong className="text-[#F8FAFC] block mb-1">Pattern Analysis:</strong>
                    {currentCampaign.historicalMatch.patternSimilarity || currentCampaign.historicalMatch.characteristics?.join(" • ") || "High lexical and timing convergence identified."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Threat Score Breakdown Gauge & Involved Accounts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* The 5-factor weighted Threat Score gauge */}
            <ThreatScoreGauge
              score={currentCampaign.threatScore}
              threatLevel={currentCampaign.threatLevel}
              breakdown={currentCampaign.threatBreakdown}
              title="CAMPAIGN THREAT SCORE BREAKDOWN"
            />

            {/* Involved Accounts List */}
            <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                    COORDINATED ACCOUNTS ({campaignAccounts.length})
                  </h4>
                  <span className="text-[10px] text-[#94A3B8]">
                    Click any node to view intelligence dossier
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToNetwork(currentCampaign.id)}
                  className="text-xs text-[#4F7CFF] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Network className="w-3.5 h-3.5" />
                  View Graph
                </button>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto">
                {campaignAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => onSelectAccount(acc.username)}
                    className="p-3 rounded-xl bg-[#151B2E] border border-[#253149] hover:border-[#4F7CFF] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#111827] border border-red-500/40 flex items-center justify-center font-mono font-bold text-xs text-[#F87171]">
                        {acc.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F8FAFC] block">
                          {acc.displayName}
                        </span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">
                          @{acc.username} • Age: {acc.accountAgeDays}d
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#F87171] font-bold">
                        Bot: {acc.botProbability}%
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
