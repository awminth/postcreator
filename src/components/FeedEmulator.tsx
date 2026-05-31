import React, { useState, useEffect } from "react";
import { GeneratedPost } from "../types";
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal, User, Smartphone, Monitor } from "lucide-react";

interface FeedEmulatorProps {
  post: GeneratedPost | null;
  pageName: string;
}

export default function FeedEmulator({ post, pageName }: FeedEmulatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  
  // Reset expansion when post changes
  useEffect(() => {
    setIsExpanded(false);
  }, [post]);

  const fallbackPageName = pageName.trim() || "My Brand Page";

  if (!post) {
    return (
      <div className="bg-slate-100 border border-dashed border-slate-300 rounded-2xl h-80 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <Smartphone className="w-10 h-10 mb-3 text-slate-300" />
        <h4 className="font-semibold text-sm text-slate-600 mb-1">Live Feed Emulator Ready</h4>
        <p className="text-xs max-w-xs leading-relaxed">
          Provide topics and generate a post to check how your hook and structure will render on high-traffic feeds!
        </p>
      </div>
    );
  }

  // Construct complete text message
  const fullContent = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;

  // Simulating Facebook truncation: 
  // Truncate at ~260 chars OR after 5 lines (which comes first)
  const lines = fullContent.split("\n");
  const characterThreshold = 260;
  const lineThreshold = 5;

  const requiresSeeMore = fullContent.length > characterThreshold || lines.length > lineThreshold;

  let previewContent = fullContent;
  if (requiresSeeMore && !isExpanded) {
    // Attempt line truncation first, otherwise character truncation
    if (lines.length > lineThreshold) {
      previewContent = lines.slice(0, lineThreshold).join("\n");
      if (previewContent.length > characterThreshold) {
        previewContent = previewContent.slice(0, characterThreshold);
      }
    } else {
      previewContent = fullContent.slice(0, characterThreshold);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Device Toggle */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
          Feed Emulator Mockup
        </span>
        <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all ${
              device === "mobile"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all ${
              device === "desktop"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Mock Facebook Wrapper */}
      <div 
        className={`bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden font-sans mx-auto transition-all ${
          device === "mobile" ? "max-w-[420px] w-full" : "w-full"
        }`}
      >
        {/* Post Header */}
        <div className="flex items-center justify-between p-3.5 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner relative">
              {fallbackPageName[0].toUpperCase()}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="font-semibold text-[14px] text-slate-900 leading-tight flex items-center gap-1.5 hover:underline cursor-pointer">
                {fallbackPageName}
                <span className="w-3.5 h-3.5 bg-blue-500 text-white flex items-center justify-center rounded-full text-[8px] font-bold" title="Verified Badge">✓</span>
              </div>
              <div className="flex items-center gap-1 text-[11.5px] text-slate-500 mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
          <button type="button" className="text-slate-500 hover:bg-slate-55 p-1.5 rounded-full transition-all">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Post text */}
        <div className="px-4 pb-3.5">
          {/* Hook check indicator in visual testing */}
          {!isExpanded && (
            <div className="bg-emerald-50 text-[10px] text-emerald-700 px-2 py-0.5 rounded-sm font-semibold mb-2 inline-block font-mono">
              ⚡ LIVE FEED PREVIEW (Hook visibility zone)
            </div>
          )}

          {/* Actual content text */}
          <div className="text-[14.5px] text-slate-900 whitespace-pre-wrap leading-relaxed tracking-normal font-sans">
            {previewContent}
            {requiresSeeMore && !isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="text-slate-500 font-semibold hover:underline bg-transparent border-none p-0 ml-1.5 active:text-blue-700 outline-none inline-block text-[14px]"
              >
                ... See More
              </button>
            )}
          </div>
        </div>

        {/* Simulated Graphic Section representing the visual idea */}
        <div className="bg-slate-50 border-y border-slate-100 flex flex-col p-4 relative min-h-[140px] items-center justify-center text-center">
          <div className="absolute top-2.5 left-2.5 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Graphic/Image Suggestion
          </div>
          <div className="max-w-md my-4 px-3 flex flex-col items-center">
            <MessageCircle className="w-7 h-7 text-indigo-400/80 mb-2" />
            <p className="text-xs text-slate-600 font-medium italic select-none">
              "{post.visualIdea}"
            </p>
            <p className="text-[10px] text-slate-400 mt-2.5 leading-normal">
              💡 Digital Marketing Tip: Standard Facebook designs with high contrast backgrounds, large fonts, and a human headshot increase average CTR by up to 300%.
            </p>
          </div>
        </div>

        {/* Likes / Interaction metadata */}
        <div className="px-4 py-2 border-b border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 hover:underline cursor-pointer">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">👍</span>
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] -ml-2">❤️</span>
            <span className="ml-1 font-medium">9.4k Likes</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="hover:underline cursor-pointer">1.2K Comments</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">542 Shares</span>
          </div>
        </div>

        {/* Facebook Action Buttons */}
        <div className="grid grid-cols-3 text-center text-xs font-semibold text-slate-600 bg-white border-t border-slate-50 py-1 select-none">
          <button type="button" className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 transition-colors cursor-pointer rounded-sm active:scale-95">
            <ThumbsUp className="w-4 h-4 text-slate-500" />
            <span>Like</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 transition-colors cursor-pointer rounded-sm active:scale-95">
            <MessageCircle className="w-4 h-4 text-slate-500" />
            <span>Comment</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 transition-colors cursor-pointer rounded-sm active:scale-95">
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
