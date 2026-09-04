import React from "react";
import { Account, Post } from "../types";
import { MetricCard } from "../components/MetricCard";
import { ThreatBadge } from "../components/ThreatBadge";
import {
  calculateActivityMetrics,
  calculateEngagementRate,
  calculateSentiment
} from "../utils/analytics";
import {
  Users,
  Clock,
  Zap,
  Activity,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  ShieldAlert
} from "lucide-react";

interface AudienceViewProps {
  accounts: Account[];
  posts: Post[];
  onSelectAccount: (username: string) => void;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  accounts,
  posts,
  onSelectAccount
}) => {
  const activity = calculateActivityMetrics(posts);
  const engagement = calculateEngagementRate(posts);
  const sentiment = calculateSentiment(posts);

  const burstAccountsCount = accounts.filter((a) => a.burstActivity).length;
  const highRiskAccounts = accounts.filter((a) => a.riskLevel === "CRITICAL" || a.riskLevel === "HIGH");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#4F7CFF]" />
            AUDIENCE BEHAVIOR INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Account behavioral profiling, bot probability metrics, temporal burst detection, and contributor influence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#F87171] bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/30">
            {burstAccountsCount} Burst Influx Nodes Detected
          </span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL TRACKED ACCOUNTS"
          value={accounts.length}
          subtitle="Identified across synthetic ingestion streams"
          icon={Users}
          accentColor="text-[#4F7CFF]"
        />

        <MetricCard
          title="AVERAGE ENGAGEMENT RATE"
          value={`${engagement.averageEngagementRate}%`}
          subtitle="Calculated over total likes, comments, and shares"
          icon={Zap}
          accentColor="text-[#22D3EE]"
        />

        <MetricCard
          title="PEAK ACTIVITY WINDOW"
          value={activity.peakActivityTime}
          subtitle={`Current posting velocity: ${activity.postingFrequency}`}
          icon={Clock}
          accentColor="text-[#FBBF24]"
        />

        <MetricCard
          title="ANOMALOUS / BOT NODES"
          value={burstAccountsCount}
          subtitle={`${highRiskAccounts.length} classified as High / Critical risk`}
          icon={ShieldAlert}
          accentColor="text-[#F87171]"
          trend={{ value: "Astroturf Clustered", isAdversarial: true }}
        />
      </div>

      {/* Behavioral Patterns & Temporal Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22D3EE]" />
            BEHAVIOR PATTERNS OBSERVED
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
            Algorithmic heuristic analysis identifies two distinct audience clusters:
          </p>
          <ul className="space-y-2 text-xs text-[#F8FAFC]">
            <li className="p-2.5 rounded-lg bg-[#151B2E] border border-[#253149] flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] mt-1 shrink-0" />
              <div>
                <strong className="text-[#34D399]">Organic Cohort (60%):</strong> Genuine accounts with natural inter-post intervals (30–120 mins), diverse topics, and organic engagement.
              </div>
            </li>
            <li className="p-2.5 rounded-lg bg-[#151B2E] border border-red-500/30 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F87171] mt-1 shrink-0" />
              <div>
                <strong className="text-[#F87171]">Coordinated Astroturf Cohort (40%):</strong> Synchronized burst within 5 minutes, accounts created within 14 days, high textual similarity.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">
            AUDIENCE SENTIMENT SPLIT
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
            Aggregated sentiment across all identified authors in current dataset:
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[#34D399] mb-1">
                <span>Positive Sentiment</span>
                <span>{sentiment.positivePercent}%</span>
              </div>
              <div className="h-2 bg-[#151B2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#34D399]" style={{ width: `${sentiment.positivePercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#94A3B8] mb-1">
                <span>Neutral Sentiment</span>
                <span>{sentiment.neutralPercent}%</span>
              </div>
              <div className="h-2 bg-[#151B2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#94A3B8]" style={{ width: `${sentiment.neutralPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[#F87171] mb-1">
                <span>Negative / Hostile Sentiment</span>
                <span>{sentiment.negativePercent}%</span>
              </div>
              <div className="h-2 bg-[#151B2E] rounded-full overflow-hidden">
                <div className="h-full bg-[#F87171]" style={{ width: `${sentiment.negativePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">
              BOT & SOCKPUPPET PROBABILITY
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Synthesizing account age, default avatar flags, following/follower ratio asymmetry, and synchronized posting cadence.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center font-mono">
            <span className="text-[10px] text-[#94A3B8] uppercase block">
              ADVERSARIAL COHORT BOT PROBABILITY
            </span>
            <span className="text-3xl font-bold text-[#F87171]">
              85% - 94%
            </span>
            <span className="text-[11px] text-[#94A3B8] block mt-1">
              8 accounts flagged for human trust & safety escalation
            </span>
          </div>
        </div>
      </div>

      {/* Account Contributor Directory (Clickable to open Account Intelligence Dossier!) */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              TRACKED ACCOUNT PROFILES ({accounts.length})
            </h3>
            <span className="text-[11px] text-[#94A3B8]">
              Click any account to open the Account Intelligence Dossier
            </span>
          </div>
          <span className="text-xs font-mono text-[#4F7CFF]">
            Click row to inspect →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isBurst = acc.burstActivity;
            return (
              <div
                key={acc.id}
                onClick={() => onSelectAccount(acc.username)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-[#4F7CFF] ${
                  isBurst
                    ? "bg-red-950/15 border-red-500/30 hover:bg-red-950/25"
                    : "bg-[#151B2E] border-[#253149] hover:bg-[#253149]/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#111827] border border-[#253149] flex items-center justify-center font-mono font-bold text-xs text-[#4F7CFF]">
                      {acc.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-semibold text-xs text-[#F8FAFC]">
                        <span>{acc.displayName}</span>
                        {acc.verified && <UserCheck className="w-3.5 h-3.5 text-[#4F7CFF]" />}
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8]">@{acc.username}</span>
                    </div>
                  </div>
                  <ThreatBadge level={acc.riskLevel} size="sm" showScore={acc.behaviorScore} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-[#253149]/60 pt-2 text-[#94A3B8]">
                  <div>
                    <span>Age: </span>
                    <strong className="text-[#F8FAFC]">{acc.accountAgeDays}d</strong>
                  </div>
                  <div>
                    <span>Bot Prob: </span>
                    <strong className={acc.botProbability > 70 ? "text-[#F87171]" : "text-[#34D399]"}>
                      {acc.botProbability}%
                    </strong>
                  </div>
                  <div>
                    <span>Followers: </span>
                    <strong className="text-[#F8FAFC]">{acc.followerCount}</strong>
                  </div>
                  <div>
                    <span>Burst: </span>
                    <strong className={isBurst ? "text-[#F87171]" : "text-[#34D399]"}>
                      {isBurst ? "DETECTED" : "ORGANIC"}
                    </strong>
                  </div>
                </div>

                {acc.sharedHashtags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {acc.sharedHashtags.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111827] text-[#22D3EE] border border-[#253149]">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
