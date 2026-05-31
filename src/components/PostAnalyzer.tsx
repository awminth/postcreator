import React from "react";
import { GeneratedPost } from "../types";
import { BarChart3, AlertCircle, CheckCircle2, TrendingUp, Sparkles, Zap } from "lucide-react";

interface PostAnalyzerProps {
  post: GeneratedPost | null;
}

export default function PostAnalyzer({ post }: PostAnalyzerProps) {
  if (!post) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 text-center text-xs py-10 min-h-[180px]">
        <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
        <span className="font-medium text-slate-500">Post Analytics Panel Ready</span>
        <p className="max-w-xs mt-1 text-slate-400">
          Generate an optimized draft to check detailed copy health scores, hook visibility checks, and CTR factors.
        </p>
      </div>
    );
  }

  const fullText = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;
  
  // Calculate analytics
  const charCount = fullText.length;
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  
  // Emoji density check
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
  const emojiMatches = fullText.match(emojiRegex) || [];
  const emojiCount = emojiMatches.length;

  // Real-time Facebook feed audit rules:
  // Hook visibility check
  const hookLength = post.hook.length;
  const isHookShortEnough = hookLength <= 210; // Approx first 3 lines on mobile search feeds
  
  // Bullets & structure checks
  const paragraphCount = fullText.split("\n\n").length;
  const hasBullets = fullText.includes("-") || fullText.includes("•") || fullText.includes("*") || emojiCount > 3;

  // Score calculation
  let score = 50; // base score
  if (isHookShortEnough) score += 15;
  if (emojiCount >= 3 && emojiCount <= 10) score += 15; // sweet spot
  if (hasBullets) score += 10;
  if (post.cta.length > 5) score += 10;

  let scoreColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  if (score < 70) scoreColor = "text-amber-600 bg-amber-50 border-amber-100";
  if (score < 50) scoreColor = "text-red-600 bg-red-50 border-red-100";

  return (
    <div className="bg-white border border-slate-250/60 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wider font-sans">
            Post Analytics & Audit
          </h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono flex items-center gap-1 ${scoreColor}`}>
          <Zap className="w-3 h-3 fill-current" />
          <span>Post Score: {score}/100</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Characters</p>
          <p className="font-bold text-base text-slate-800 font-mono mt-0.5">{charCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Words</p>
          <p className="font-bold text-base text-slate-800 font-mono mt-0.5">{wordCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Emojis</p>
          <p className="font-bold text-base text-slate-800 font-mono mt-0.5">{emojiCount}</p>
        </div>
      </div>

      {/* Health Audit Checklist */}
      <div className="space-y-2.5 mt-1 text-xs">
        {/* Hook Visibility Check */}
        <div className="flex items-start gap-2">
          {isHookShortEnough ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-slate-700">Pre-See-More Hook Length</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              {isHookShortEnough 
                ? `Perfect! Your hook is ${hookLength} chars, staying within the optimal preview cutoff region for highest CTA conversion.`
                : `Your hook is a bit long (${hookLength} characters). In actual timelines, it might get truncated by the 'See More' block.`}
            </p>
          </div>
        </div>

        {/* Formatting / Readability Check */}
        <div className="flex items-start gap-2">
          {hasBullets ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-slate-700">Visual Separation & Layout</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              {hasBullets 
                ? "Excellent formatting! Paragraph chunks under 3 lines and custom bullets/eMojis maximize visual comprehension."
                : "Try adding more line breaks or simple emoji lists to break up long sentence blocks and lower bounce-rates."}
            </p>
          </div>
        </div>

        {/* Call-to-action Check */}
        <div className="flex items-start gap-2">
          {post.cta.length > 5 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-slate-700">Clear Action Trailing (CTA)</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              {post.cta.length > 5
                ? "High conversion! A dedicated trailing action tells readers precisely how to take the next step."
                : "Missing or weak Call to Action. Make sure to clearly instruct readers to comment, drop a message or call."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
