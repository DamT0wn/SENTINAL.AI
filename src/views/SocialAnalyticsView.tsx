import React, { useState, useMemo } from "react";
import { Post, Account } from "../types";
import { PostCard } from "../components/PostCard";
import {
  calculateSentiment,
  calculateEmotion,
  calculateEngagementRate,
  calculateTrendingTopics,
  calculateTrendingHashtags
} from "../utils/analytics";
import {
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Smile,
  Users,
  Flame,
  Search,
  RotateCcw
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from "recharts";

interface SocialAnalyticsViewProps {
  posts: Post[];
  accounts: Account[];
  onSelectAccount: (username: string) => void;
  onAnalyzePost: (post: Post) => void;
}

export const SocialAnalyticsView: React.FC<SocialAnalyticsViewProps> = ({
  posts,
  accounts,
  onSelectAccount,
  onAnalyzePost
}) => {
  // Filter States
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Unique topics list
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.topic) set.add(p.topic);
    });
    return Array.from(set);
  }, [posts]);

  // Working filters applied to dataset
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Platform filter
      if (selectedPlatform !== "all" && p.platform !== selectedPlatform) return false;

      // Sentiment filter
      if (selectedSentiment !== "all") {
        if (selectedSentiment === "positive" && p.sentiment !== "positive") return false;
        if (selectedSentiment === "neutral" && p.sentiment !== "neutral") return false;
        if (selectedSentiment === "negative" && p.sentiment !== "negative") return false;
      }

      // Topic filter
      if (selectedTopic !== "all" && p.topic !== selectedTopic) return false;

      // Risk Level filter
      if (selectedRisk !== "all") {
        const risk = (p.cyberbullyingRisk || 0);
        if (selectedRisk === "low" && risk > 30) return false;
        if (selectedRisk === "medium" && (risk <= 30 || risk > 60)) return false;
        if (selectedRisk === "high" && (risk <= 60 || risk > 80)) return false;
        if (selectedRisk === "critical" && risk <= 80) return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesText = p.text.toLowerCase().includes(q);
        const matchesUser = p.username.toLowerCase().includes(q);
        const matchesTag = (p.hashtags || []).some((h) => h.toLowerCase().includes(q));
        if (!matchesText && !matchesUser && !matchesTag) return false;
      }

      return true;
    });
  }, [posts, selectedPlatform, selectedSentiment, selectedTopic, selectedRisk, searchQuery]);

  // Live calculated analytics on filtered dataset
  const sentiment = calculateSentiment(filteredPosts);
  const emotions = calculateEmotion(filteredPosts);
  const engagement = calculateEngagementRate(filteredPosts);
  const trendingTopics = calculateTrendingTopics(filteredPosts);
  const trendingHashtags = calculateTrendingHashtags(filteredPosts);

  // Sentiment Pie Chart Data
  const sentimentPieData = [
    { name: "Positive", value: sentiment.positive, color: "#34D399" },
    { name: "Neutral", value: sentiment.neutral, color: "#94A3B8" },
    { name: "Negative", value: sentiment.negative, color: "#F87171" }
  ].filter((d) => d.value > 0);

  // Topic vs Sentiment Data for Bar Chart
  const topicSentimentData = trendingTopics.slice(0, 5).map((t) => ({
    name: t.topic.length > 15 ? t.topic.slice(0, 15) + "..." : t.topic,
    posts: t.postCount,
    sentimentScore: Math.round(t.averageSentiment * 100),
    engagement: t.totalEngagement
  }));

  const resetFilters = () => {
    setSelectedPlatform("all");
    setSelectedSentiment("all");
    setSelectedTopic("all");
    setSelectedRisk("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            SOCIAL MEDIA ANALYTICS
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time computed metrics across sentiment distribution, emotional valence, topic frequency, and engagement velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
          <span>Dataset subset:</span>
          <span className="font-bold text-[#22D3EE] bg-[#1D2638] px-2 py-1 rounded border border-[#253149]">
            {filteredPosts.length} of {posts.length} posts
          </span>
        </div>
      </div>

      {/* Filter Toolbar (Working Filters!) */}
      <div className="bg-[#1D2638] border border-[#253149] p-4 rounded-xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            <Filter className="w-4 h-4 text-[#4F7CFF]" />
            <span>Working Analytics Filters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Platform Filter */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] font-mono mb-1">PLATFORM</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-[#151B2E] border border-[#253149] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter / X</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="threads">Threads</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] font-mono mb-1">SENTIMENT</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full bg-[#151B2E] border border-[#253149] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] font-mono mb-1">TOPIC</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-[#151B2E] border border-[#253149] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none"
            >
              <option value="all">All Topics</option>
              {availableTopics.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] font-mono mb-1">RISK LEVEL</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-[#151B2E] border border-[#253149] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (0-30)</option>
              <option value="medium">Medium Risk (31-60)</option>
              <option value="high">High Risk (61-80)</option>
              <option value="critical">Critical Risk (81-100)</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] text-[#94A3B8] font-mono mb-1">SEARCH TEXT / HASHTAG</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151B2E] border border-[#253149] rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#4F7CFF] focus:outline-none placeholder:text-slate-500"
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Sentiment Distribution & Emotional Valence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#34D399]" />
              SENTIMENT DISTRIBUTION
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">
              Score: {sentiment.averageScore}
            </span>
          </div>

          <div className="h-52 w-full mt-3 flex items-center justify-center">
            {sentimentPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#151B2E",
                      borderColor: "#253149",
                      borderRadius: "8px",
                      color: "#F8FAFC"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#94A3B8]">No matching posts for current filter.</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#253149] text-center font-mono text-xs">
            <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
              <span className="text-[#34D399] font-bold block">{sentiment.positivePercent}%</span>
              <span className="text-[10px] text-[#94A3B8]">POSITIVE</span>
            </div>
            <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
              <span className="text-[#94A3B8] font-bold block">{sentiment.neutralPercent}%</span>
              <span className="text-[10px] text-[#94A3B8]">NEUTRAL</span>
            </div>
            <div className="bg-[#151B2E] p-2 rounded-lg border border-[#253149]">
              <span className="text-[#F87171] font-bold block">{sentiment.negativePercent}%</span>
              <span className="text-[10px] text-[#94A3B8]">NEGATIVE</span>
            </div>
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#8B5CF6]" />
              EMOTION / VALENCE BREAKDOWN
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">NLP Extraction</span>
          </div>

          <div className="space-y-3 mt-4 flex-1">
            {emotions.map((emo) => {
              let color = "bg-[#4F7CFF]";
              if (emo.name === "Joy") color = "bg-[#34D399]";
              if (emo.name === "Anger") color = "bg-[#F87171]";
              if (emo.name === "Fear") color = "bg-[#FBBF24]";
              if (emo.name === "Sadness") color = "bg-[#8B5CF6]";

              return (
                <div key={emo.name} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#F8FAFC] font-medium">{emo.name}</span>
                    <span className="font-mono text-[#94A3B8]">
                      {emo.count} posts ({emo.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#151B2E] rounded-full overflow-hidden border border-[#253149]">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-300`}
                      style={{ width: `${emo.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#253149] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Average Engagement Rate:</span>
            <span className="font-mono text-[#22D3EE] font-bold">
              {engagement.averageEngagementRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Topic Frequency & Engagement by Topic */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              TOPIC FREQUENCY & TOTAL ENGAGEMENT
            </h3>
            <span className="text-[11px] text-[#94A3B8]">
              Volume comparison across extracted semantic clusters
            </span>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            {trendingTopics.length} Topics
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicSentimentData}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151B2E",
                  borderColor: "#253149",
                  borderRadius: "8px",
                  color: "#F8FAFC"
                }}
              />
              <Bar dataKey="posts" name="Post Count" fill="#4F7CFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagement" name="Total Engagement" fill="#22D3EE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Filtered Top Posts List */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149]">
          <h3 className="text-sm font-bold text-[#F8FAFC]">
            FILTERED SOCIAL POSTS ({filteredPosts.length})
          </h3>
          <span className="text-xs text-[#94A3B8] font-mono">
            Sorted by velocity & relevance
          </span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onAnalyze={onAnalyzePost}
                onSelectAccount={onSelectAccount}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#94A3B8] space-y-2">
            <p className="text-sm font-medium text-[#F8FAFC]">No posts match the selected filter combination.</p>
            <button
              onClick={resetFilters}
              className="text-xs text-[#4F7CFF] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
