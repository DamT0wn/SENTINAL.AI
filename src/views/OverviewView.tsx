import React from "react";
import {
  Post,
  Account,
  Campaign,
  ThreatAlert,
  ActiveTab
} from "../types";
import { MetricCard } from "../components/MetricCard";
import { ThreatBadge } from "../components/ThreatBadge";
import { AlertCard } from "../components/AlertCard";
import { PostCard } from "../components/PostCard";
import {
  calculateSentiment,
  calculateEngagementRate,
  calculateTrendingTopics,
  calculateTrendingHashtags,
  calculateActivityMetrics
} from "../utils/analytics";
import {
  MessageSquare,
  Smile,
  Users,
  ShieldAlert,
  TrendingUp,
  Flame,
  ArrowRight,
  Activity,
  Radio,
  Clock
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface OverviewViewProps {
  posts: Post[];
  accounts: Account[];
  campaigns: Campaign[];
  alerts: ThreatAlert[];
  onOpenSimulation: () => void;
  onNavigate: (tab: ActiveTab, targetId?: string) => void;
  onSelectAccount: (username: string) => void;
  onAnalyzePost: (post: Post) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  posts,
  accounts,
  campaigns,
  alerts,
  onOpenSimulation,
  onNavigate,
  onSelectAccount,
  onAnalyzePost
}) => {
  // Computed analytics from actual current dataset
  const sentiment = calculateSentiment(posts);
  const engagement = calculateEngagementRate(posts);
  const trendingTopics = calculateTrendingTopics(posts).slice(0, 5);
  const trendingHashtags = calculateTrendingHashtags(posts).slice(0, 6);
  const activity = calculateActivityMetrics(posts);

  // Critical/High threat signals count
  const criticalThreatCount = alerts.filter(
    (a) => a.severity === "CRITICAL" || a.severity === "HIGH"
  ).length;

  // Sentiment trend data for Recharts
  const sentimentTrendData = [
    { time: "08:00", positive: 78, neutral: 18, negative: 4 },
    { time: "08:30", positive: 82, neutral: 14, negative: 4 },
    { time: "09:00", positive: 65, neutral: 25, negative: 10 },
    { time: "09:30", positive: 70, neutral: 22, negative: 8 },
    { time: "10:00", positive: 58, neutral: 20, negative: 22 },
    { time: "10:20", positive: 42, neutral: 18, negative: 40 },
    { time: "10:35", positive: 28, neutral: 12, negative: 60 }
  ];

  // Engagement by platform data
  const platformEngData = [
    { name: "Twitter/X", count: posts.filter((p) => p.platform === "twitter").length, color: "#22D3EE" },
    { name: "Instagram", count: posts.filter((p) => p.platform === "instagram").length, color: "#F87171" },
    { name: "LinkedIn", count: posts.filter((p) => p.platform === "linkedin").length, color: "#4F7CFF" },
    { name: "Threads", count: posts.filter((p) => p.platform === "threads").length, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header with Real-Time Stream Status & Simulation Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE] mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>● SIMULATED SOCIAL STREAM</span>
            <span className="text-[#94A3B8]">• Last updated: Just now</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
            SOCIAL INTELLIGENCE OVERVIEW
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Correlating social sentiment, topics, and engagement velocity with behavioral and threat intelligence signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-run-threat-sim-overview"
            onClick={onOpenSimulation}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-[#4F7CFF] hover:from-red-600 hover:to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>RUN THREAT SIMULATION</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (Calculated from actual dataset) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-posts-analyzed"
          title="POSTS ANALYZED"
          value={posts.length}
          subtitle={`Across ${new Set(posts.map((p) => p.platform)).size} social platforms in current stream`}
          icon={MessageSquare}
          trend={{ value: "+18% velocity", isPositive: true }}
          accentColor="text-[#22D3EE]"
          onClick={() => onNavigate("social-analytics")}
        />

        <MetricCard
          id="metric-overall-sentiment"
          title="OVERALL SENTIMENT"
          value={`${sentiment.positivePercent}% POS`}
          subtitle={`${sentiment.negativePercent}% Negative • ${sentiment.neutralPercent}% Neutral`}
          icon={Smile}
          trend={{
            value: sentiment.negativePercent > 35 ? "Adversarial shift" : "Constructive",
            isAdversarial: sentiment.negativePercent > 35,
            isPositive: sentiment.positivePercent > 50
          }}
          accentColor={sentiment.negativePercent > 35 ? "text-[#F87171]" : "text-[#34D399]"}
          onClick={() => onNavigate("social-analytics")}
        />

        <MetricCard
          id="metric-active-accounts"
          title="ACTIVE ACCOUNTS"
          value={new Set(posts.map((p) => p.username)).size}
          subtitle={`${accounts.filter((a) => a.burstActivity).length} accounts exhibiting high-velocity burst activity`}
          icon={Users}
          trend={{ value: `${accounts.length} tracked`, isPositive: true }}
          accentColor="text-[#4F7CFF]"
          onClick={() => onNavigate("audience")}
        />

        <MetricCard
          id="metric-threat-signals"
          title="THREAT SIGNALS"
          value={criticalThreatCount}
          subtitle={`${campaigns.length} campaigns tracked • ${alerts.length} active alerts`}
          icon={ShieldAlert}
          trend={{
            value: criticalThreatCount > 0 ? "Critical anomaly" : "Nominal",
            isAdversarial: criticalThreatCount > 0
          }}
          accentColor="text-[#F87171]"
          onClick={() => onNavigate("threat-center")}
        />
      </div>

      {/* Row 1: Sentiment Trend & Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4F7CFF]" />
                SENTIMENT TRAJECTORY OVER TIME
              </h3>
              <span className="text-[11px] text-[#94A3B8]">
                Time-series sentiment shifts tracking recent adverse disinformation burst
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-[#34D399]">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Positive
              </span>
              <span className="flex items-center gap-1 text-[#F87171]">
                <span className="w-2 h-2 rounded-full bg-[#F87171]" /> Negative
              </span>
            </div>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTrendData}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151B2E",
                    borderColor: "#253149",
                    borderRadius: "8px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                />
                <Area type="monotone" dataKey="positive" stroke="#34D399" strokeWidth={2} fill="url(#colorPos)" />
                <Area type="monotone" dataKey="negative" stroke="#F87171" strokeWidth={2} fill="url(#colorNeg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Topics (1 col) */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#22D3EE]" />
              TRENDING TOPICS
            </h3>
            <button
              onClick={() => onNavigate("trends")}
              className="text-xs text-[#4F7CFF] hover:underline font-medium"
            >
              View all →
            </button>
          </div>

          <div className="mt-3 space-y-2.5 flex-1">
            {trendingTopics.map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#151B2E] border border-[#253149] flex items-center justify-between gap-2 hover:border-[#4F7CFF]/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[#94A3B8]">#{idx + 1}</span>
                    <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                      {t.topic}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] font-mono">
                    {t.postCount} posts • {t.totalEngagement} eng
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      t.sentimentLabel === "Positive"
                        ? "bg-emerald-500/10 text-[#34D399]"
                        : t.sentimentLabel === "Negative"
                        ? "bg-red-500/10 text-[#F87171]"
                        : "bg-slate-700/40 text-[#94A3B8]"
                    }`}
                  >
                    {t.sentimentLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Trending Hashtags & Engagement Platform Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending Hashtags */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-3">
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              TRENDING HASHTAGS (VELOCITY ANALYSIS)
            </h3>
            <span className="text-[11px] font-mono text-[#94A3B8]">6 Detected</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {trendingHashtags.map((h, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  h.hashtag === "#CleanEnergyHoax" || h.hashtag === "#SolarScam"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-[#151B2E] border-[#253149]"
                }`}
              >
                <span className="text-xs font-mono font-bold text-[#22D3EE] block truncate">
                  {h.hashtag}
                </span>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>{h.count} hits</span>
                  <span
                    className={`text-[9px] uppercase px-1 rounded ${
                      h.momentum === "High Spike"
                        ? "bg-red-500/20 text-[#F87171] font-bold"
                        : "bg-slate-700/50 text-[#94A3B8]"
                    }`}
                  >
                    {h.momentum}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Volume Distribution */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              CROSS-PLATFORM STREAM DISTRIBUTION
            </h3>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              Avg Engagement: {engagement.averageEngagementRate}%
            </span>
          </div>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformEngData} layout="vertical">
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151B2E",
                    borderColor: "#253149",
                    borderRadius: "8px",
                    color: "#F8FAFC",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {platformEngData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Threat Alerts (Clickable Routing) */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#253149]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#F87171]" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              ACTIVE THREAT INTELLIGENCE ALERTS ({alerts.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate("threat-center")}
            className="text-xs text-[#4F7CFF] hover:underline font-semibold"
          >
            Open Threat Center →
          </button>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onInvestigate={(route, targetId) => onNavigate(route as ActiveTab, targetId)}
            />
          ))}
        </div>
      </div>

      {/* Row 4: Recent Social Activity Feed */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              RECENT SOCIAL ACTIVITY FEED
            </h3>
            <span className="text-[11px] text-[#94A3B8]">
              Live inspection of simulated feed posts across social nodes
            </span>
          </div>
          <button
            onClick={() => onNavigate("social-analytics")}
            className="text-xs text-[#4F7CFF] hover:underline font-semibold"
          >
            Explore all {posts.length} posts →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0, 4).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onAnalyze={onAnalyzePost}
              onSelectAccount={onSelectAccount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
