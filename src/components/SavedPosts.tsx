import React from "react";
import { GeneratedPost } from "../types";
import { Bookmark, Trash2, Calendar, FileText, ChevronRight } from "lucide-react";

interface SavedPostsProps {
  savedPosts: GeneratedPost[];
  onLoadPost: (post: GeneratedPost) => void;
  onDeletePost: (id: string) => void;
}

export default function SavedPosts({ savedPosts, onLoadPost, onDeletePost }: SavedPostsProps) {
  return (
    <div className="bg-white border border-slate-250/60 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-4 h-4 text-indigo-500 fill-indigo-100" />
        <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wider font-sans">
          Draft Library ({savedPosts.length})
        </h3>
      </div>
      
      {savedPosts.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400 max-w-[200px] mx-auto">
            Your saved drafts will appear here. Hit "Save Draft" on any generated post to store it.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
          {savedPosts.map((post) => {
            const displayTitle = post.topic || "Untitled Post";
            const dateStr = post.createdAt 
              ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Saved";

            return (
              <div 
                key={post.id}
                className="group border border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 rounded-xl p-3 transition-all flex items-start gap-2.5 justify-between shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => onLoadPost(post)}
                  className="flex-1 text-left select-none outline-none"
                >
                  <p className="text-xs font-semibold text-slate-700 font-sans line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {displayTitle}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                      {post.tone || "General"}
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onLoadPost(post)}
                    title="Load draft"
                    className="p-1 px-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all outline-none text-xs flex items-center gap-0.5"
                  >
                    <span>Load</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => post.id && onDeletePost(post.id)}
                    title="Delete draft"
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md active:scale-95 transition-all outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
