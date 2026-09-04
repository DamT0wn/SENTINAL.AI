import React from "react";
import { Post } from "../types";
import {
  calculateTrendingTopics,
  calculateTrendingHashtags,
  calculateSentiment
} from "../utils/analytics";
import {
  TrendingUp,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Hash,
  Activity,
  Layers
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend
} from "recharts";

interface TrendsViewProps {
  posts: Post[];
  onSelectTopic?: (topic: string) => void;
}

export const TrendsView: React.FC<TrendsViewProps> = ({ posts, onSelectTopic }) => {
  const topics = calculateTrendingTopics(posts);
  const hashtags = calculateTrendingHashtags(posts);

  // Topic frequency over simulated timeline
  const timelineData = [
    { hour: "08:00", renewable: 4, aiTech: 3, transit: 1, hoaxScam: 0 },
    { hour: "08:45", renewable: 6, aiTech: 5, transit: 2, hoaxScam: 0 },
    { hour: "09:30", renewable: 8, aiTech: 6, transit: 4, hoaxScam: 1 },
    { hour: "10:15", renewable: 7, aiTech: 6, transit: 3, hoaxScam: 4 },
    { hour: "10:35", renewable: 4, aiTech: 4, transit: 2, hoaxScam: 9 },
  ];

  // Emerging vs Declining
  const emergingTopics = [
    { name: "#CleanEnergyHoax", surge: "+480%", status: "Anomalous Spike", isThreat: true },
    { name: "Grid-Scale Storage", surge: "+85%", status: "Organic Growth", isThreat: false },
    { name: "Reasoning Models", surge: "+62%", status: "Organic Growth", isThreat: false },
  ];

  const decliningTopics = [
    { name: "Municipal Transit Budget", change: "-34%", status: "Decaying" },
    { name: "Rooftop Solar Tests", change: "-22%", status: "Stable" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#22D3EE]" />
            TREND INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Topic velocity tracking, hashtag acceleration, and anomalous coordinate surges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#22D3EE] bg-[#1D2638] px-3 py-1.5 rounded-lg border border-[#253149]">
            ● {topics.length} active semantic topics tracked
          </span>
        </div>
      </div>

      {/* Row 1: Emerging and Declining Topic Momentum Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerging Topics */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-3">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-[#F87171]" />
              EMERGING / ACCELERATING TOPICS
            </h3>
            <span className="text-[11px] font-mono text-[#94A3B8]">Velocity Surge</span>
          </div>

          <div className="space-y-2.5">
            {emergingTopics.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  item.isThreat
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-[#151B2E] border-[#253149]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5 font-mono">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className={`font-bold ${
                      item.isThreat ? "text-[#F87171]" : "text-[#34D399]"
                    }`}
                  >
                    {item.surge}
                  </span>
                  {item.isThreat && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-[#F87171] font-bold">
                      ANOMALY
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Topics */}
        <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-3">
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-[#94A3B8]" />
              DECLINING / DECELERATING TOPICS
            </h3>
            <span className="text-[11px] font-mono text-[#94A3B8]">Natural Decay</span>
          </div>

          <div className="space-y-2.5">
            {decliningTopics.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#151B2E] border border-[#253149] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5 font-mono">
                    {item.status}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#94A3B8]">
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Topic Frequency Over Time Timeline Chart */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#4F7CFF]" />
              TOPIC FREQUENCY OVER TIME (HOURLY INGESTION)
            </h3>
            <span className="text-[11px] text-[#94A3B8]">
              Comparing regular conversational topics against rapid coordinated astroturf emergence
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151B2E",
                  borderColor: "#253149",
                  borderRadius: "8px",
                  color: "#F8FAFC"
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="renewable" name="Renewable Energy" stroke="#34D399" strokeWidth={2} />
              <Line type="monotone" dataKey="aiTech" name="AI & Tech" stroke="#4F7CFF" strokeWidth={2} />
              <Line type="monotone" dataKey="transit" name="Urban Transit" stroke="#FBBF24" strokeWidth={2} />
              <Line type="monotone" dataKey="hoaxScam" name="Hoax/Disinformation" stroke="#F87171" strokeWidth={3} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Sentiment & Engagement by Topic Matrix */}
      <div className="bg-[#1D2638] border border-[#253149] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#253149] mb-4">
          <h3 className="text-sm font-bold text-[#F8FAFC]">
            SENTIMENT & ENGAGEMENT CORRELATION BY TOPIC
          </h3>
          <span className="text-xs text-[#94A3B8] font-mono">
            {topics.length} Tracked Topics
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#253149] text-[#94A3B8] font-mono">
                <th className="pb-3 font-semibold">TOPIC</th>
                <th className="pb-3 font-semibold">POST COUNT</th>
                <th className="pb-3 font-semibold">SENTIMENT</th>
                <th className="pb-3 font-semibold">AVG SCORE</th>
                <th className="pb-3 font-semibold">TOTAL ENGAGEMENT</th>
                <th className="pb-3 font-semibold">MOMENTUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#253149]/50">
              {topics.map((t, idx) => (
                <tr key={idx} className="hover:bg-[#151B2E]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#F8FAFC]">
                    {t.topic}
                  </td>
                  <td className="py-3 font-mono text-[#F8FAFC]">
                    {t.postCount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        t.sentimentLabel === "Positive"
                          ? "bg-emerald-500/10 text-[#34D399]"
                          : t.sentimentLabel === "Negative"
                          ? "bg-red-500/10 text-[#F87171]"
                          : "bg-slate-700/50 text-[#94A3B8]"
                      }`}
                    >
                      {t.sentimentLabel}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#94A3B8]">
                    {t.averageSentiment}
                  </td>
                  <td className="py-3 font-mono text-[#22D3EE] font-bold">
                    {t.totalEngagement}
                  </td>
                  <td className="py-3 font-mono text-xs">
                    <span
                      className={`${
                        t.momentum === "Surging"
                          ? "text-[#F87171] font-bold"
                          : "text-[#4F7CFF]"
                      }`}
                    >
                      {t.momentum}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
