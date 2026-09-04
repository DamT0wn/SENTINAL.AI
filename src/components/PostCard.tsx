import React from "react";
import { Post } from "../types";
import { Heart, MessageCircle, Share2, AlertTriangle, ShieldCheck, Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { ThreatBadge } from "./ThreatBadge";

interface PostCardProps {
  post: Post;
  onAnalyze?: (post: Post) => void;
  onSelectAccount?: (username: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onAnalyze, onSelectAccount }) => {
  const getPlatformIcon = () => {
    switch (post.platform) {
      case "twitter":
        return <Twitter className="w-3.5 h-3.5 text-[#22D3EE]" />;
      case "instagram":
        return <Instagram className="w-3.5 h-3.5 text-[#F87171]" />;
      case "linkedin":
        return <Linkedin className="w-3.5 h-3.5 text-[#4F7CFF]" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-[#94A3B8]" />;
    }
  };

  const getSentimentPill = () => {
    if (post.sentiment === "positive") {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#34D399] border border-emerald-500/30 flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3 h-3" /> Positive
        </span>
      );
    }
    if (post.sentiment === "negative") {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 text-[#F87171] border border-red-500/30 flex items-center gap-1 font-medium">
          <AlertTriangle className="w-3 h-3" /> Negative
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/50 text-[#94A3B8] border border-slate-600/30 font-medium">
        Neutral
      </span>
    );
  };

  const isCoordinated = post.scenario === "coordinated";
  const isCyberbullying = post.scenario === "cyberbullying";

  return (
    <div
      id={`post-card-${post.id}`}
      className={`bg-[#1D2638] border ${
        isCoordinated
          ? "border-red-500/40 bg-red-950/10"
          : isCyberbullying
          ? "border-amber-500/40 bg-amber-950/10"
          : "border-[#253149]"
      } rounded-xl p-4 shadow-md transition-all duration-200 hover:border-[#4F7CFF]/50 hover:bg-[#253149]/40`}
    >
      {/* Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => onSelectAccount && onSelectAccount(post.username)}
            className="w-9 h-9 rounded-full bg-[#151B2E] border border-[#253149] flex items-center justify-center font-mono font-bold text-xs text-[#4F7CFF] cursor-pointer hover:border-[#4F7CFF]"
          >
            {post.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectAccount && onSelectAccount(post.username)}
                className="text-xs font-semibold text-[#F8FAFC] hover:text-[#4F7CFF] transition-colors"
              >
                {post.displayName}
              </button>
              <span className="text-[11px] text-[#94A3B8] font-mono">@{post.username}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] mt-0.5">
              <span className="flex items-center gap-1 capitalize">
                {getPlatformIcon()}
                {post.platform}
              </span>
              <span>•</span>
              <span className="font-mono">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {post.campaignId && (
                <>
                  <span>•</span>
                  <span className="text-[#F87171] font-mono font-semibold">CAMPAIGN_NODE</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {getSentimentPill()}
          {(post.cyberbullyingRisk || 0) > 60 && (
            <ThreatBadge level="HIGH" size="sm" />
          )}
        </div>
      </div>

      {/* Post Text */}
      <p className="mt-3 text-sm text-[#F8FAFC] leading-relaxed whitespace-pre-line">
        {post.text}
      </p>

      {/* Highlighted Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.hashtags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                tag === "#CleanEnergyHoax" || tag === "#CancelNow"
                  ? "bg-red-500/15 text-[#F87171] border-red-500/30 font-semibold"
                  : "bg-[#151B2E] text-[#22D3EE] border-[#253149]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* URL Link snippet if present */}
      {post.url && (
        <div className="mt-2.5 p-2 rounded-lg bg-[#151B2E] border border-[#253149] flex items-center justify-between text-xs">
          <span className="font-mono text-[#F87171] truncate max-w-[280px]">
            🔗 {post.url}
          </span>
          <span className="text-[10px] text-[#FBBF24] font-mono uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            Obfuscated Link
          </span>
        </div>
      )}

      {/* Engagement Footer and Action */}
      <div className="mt-3 pt-3 border-t border-[#253149] flex items-center justify-between text-xs text-[#94A3B8]">
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 hover:text-[#F8FAFC]">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> {post.likes}
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#F8FAFC]">
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> {post.comments}
          </span>
          <span className="flex items-center gap-1.5 hover:text-[#F8FAFC]">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" /> {post.shares}
          </span>
        </div>

        {onAnalyze && (
          <button
            onClick={() => onAnalyze(post)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#151B2E] hover:bg-[#4F7CFF] text-[#F8FAFC] hover:text-white border border-[#253149] transition-all font-medium"
          >
            Analyze Post →
          </button>
        )}
      </div>
    </div>
  );
};
