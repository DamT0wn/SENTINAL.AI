import React from "react";
import { Account, Post } from "../types";
import { X, ShieldAlert, CheckCircle, AlertOctagon, UserCheck, Twitter, Hash, Activity } from "lucide-react";
import { ThreatBadge } from "./ThreatBadge";

interface AccountIntelligenceDrawerProps {
  account: Account | null;
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCampaign?: (campaignId: string) => void;
}

export const AccountIntelligenceDrawer: React.FC<AccountIntelligenceDrawerProps> = ({
  account,
  posts,
  isOpen,
  onClose,
  onSelectCampaign
}) => {
  if (!isOpen || !account) return null;

  const accountPosts = posts.filter((p) => p.username === account.username);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#151B2E] border-l border-[#253149] w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#253149] bg-[#1D2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4F7CFF]" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              ACCOUNT INTELLIGENCE DOSSIER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#253149] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Identity Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#111827] border-2 border-[#4F7CFF] flex items-center justify-center font-mono font-bold text-base text-[#4F7CFF]">
                {account.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  {account.displayName}
                  {account.verified && <UserCheck className="w-4 h-4 text-[#4F7CFF]" />}
                </h4>
                <span className="text-xs text-[#94A3B8] font-mono">@{account.username}</span>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Account Age: <span className="font-mono text-[#F8FAFC]">{account.accountAgeDays} days</span>
                </div>
              </div>
            </div>
            <ThreatBadge level={account.riskLevel} size="md" showScore={account.behaviorScore} />
          </div>

          {account.bio && (
            <p className="text-xs text-[#94A3B8] bg-[#111827] p-3 rounded-lg border border-[#253149] italic">
              "{account.bio}"
            </p>
          )}

          {/* Key Behavioral Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1D2638] border border-[#253149] p-3 rounded-xl">
              <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                BEHAVIOR RISK SCORE
              </span>
              <span
                className={`text-2xl font-mono font-bold ${
                  account.behaviorScore > 75
                    ? "text-[#F87171]"
                    : account.behaviorScore > 40
                    ? "text-[#FBBF24]"
                    : "text-[#34D399]"
                }`}
              >
                {account.behaviorScore} <span className="text-xs text-[#94A3B8]">/ 100</span>
              </span>
            </div>

            <div className="bg-[#1D2638] border border-[#253149] p-3 rounded-xl">
              <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                BOT PROBABILITY
              </span>
              <span
                className={`text-2xl font-mono font-bold ${
                  account.botProbability > 80
                    ? "text-[#F87171]"
                    : account.botProbability > 40
                    ? "text-[#FBBF24]"
                    : "text-[#34D399]"
                }`}
              >
                {account.botProbability}%
              </span>
            </div>

            <div className="bg-[#1D2638] border border-[#253149] p-3 rounded-xl">
              <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                FOLLOWERS / FOLLOWING
              </span>
              <span className="text-sm font-mono font-bold text-[#F8FAFC]">
                {account.followerCount} / {account.followingCount}
              </span>
            </div>

            <div className="bg-[#1D2638] border border-[#253149] p-3 rounded-xl">
              <span className="text-[10px] text-[#94A3B8] uppercase font-mono block">
                BURST POSTING DETECTED
              </span>
              <span
                className={`text-sm font-mono font-bold ${
                  account.burstActivity ? "text-[#F87171]" : "text-[#34D399]"
                }`}
              >
                {account.burstActivity ? "YES (HIGH FREQ)" : "NO (ORGANIC)"}
              </span>
            </div>
          </div>

          {/* Campaign Associations */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              CAMPAIGN ASSOCIATIONS
            </h5>
            {account.campaignIds.length > 0 ? (
              <div className="space-y-2">
                {account.campaignIds.map((cid, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (onSelectCampaign) onSelectCampaign(cid);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-all"
                  >
                    <div className="text-xs">
                      <span className="font-mono font-semibold text-[#F87171]">
                        {cid}
                      </span>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        Active participant in coordinated swarm
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#4F7CFF]">View →</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] bg-[#111827] p-2.5 rounded-lg border border-[#253149]">
                No malicious campaign clustering linked to this account.
              </p>
            )}
          </div>

          {/* Shared Hashtags */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              FREQUENT HASHTAGS
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {account.sharedHashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2 py-0.5 rounded bg-[#111827] text-[#22D3EE] border border-[#253149]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Account Posts */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              ASSOCIATED POSTS IN DATASET ({accountPosts.length})
            </h5>
            <div className="space-y-2">
              {accountPosts.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-[#111827] border border-[#253149] text-xs">
                  <p className="text-[#F8FAFC] line-clamp-3">{p.text}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
                    <span>{new Date(p.timestamp).toLocaleTimeString()}</span>
                    <span>Toxicity: {p.toxicityScore || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-[#253149] bg-[#1D2638] flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#94A3B8]">Moderation action:</span>
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Marked @${account.username} for active human review queue.`)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#151B2E] text-[#FBBF24] border border-amber-500/30 hover:bg-amber-500/10"
            >
              Flag for Review
            </button>
            <button
              onClick={() => alert(`Escalated @${account.username} to Trust & Safety leads.`)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F87171] text-white hover:bg-red-600"
            >
              Escalate Threat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
