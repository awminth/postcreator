import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  Layout, 
  Bookmark, 
  Info, 
  Heart, 
  Grid, 
  Smartphone, 
  PlusCircle, 
  Undo2, 
  Lightbulb, 
  Megaphone,
  Briefcase,
  Users,
  Compass,
  Zap,
  Globe
} from "lucide-react";
import EmojiBoard from "./components/EmojiBoard";
import FeedEmulator from "./components/FeedEmulator";
import SavedPosts from "./components/SavedPosts";
import PostAnalyzer from "./components/PostAnalyzer";
import { GeneratedPost, ToneType, LanguageType, PostGoalType } from "./types";

export default function App() {
  // Main form states
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<ToneType>("Casual");
  const [language, setLanguage] = useState<LanguageType>("Burmese");
  const [postGoal, setPostGoal] = useState<PostGoalType>("Engagement Boom");
  const [pageName, setPageName] = useState("Premium SMM Group");

  // Output workspace states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  
  // Custom manual edit state (allows free-form modification of the full post)
  const [editedFullText, setEditedFullText] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "editor" | "visual">("preview");
  const [copied, setCopied] = useState(false);
  
  // Local storage library states
  const [savedPosts, setSavedPosts] = useState<GeneratedPost[]>([]);

  // Ref to track text area cursor for emoji placement
  const topicRef = useRef<HTMLTextAreaElement>(null);

  // Load saved posts from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fb_smm_posts");
      if (stored) {
        setSavedPosts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read local storage posts", e);
    }
  }, []);

  // Update manual edit text area whenever currentPost updates
  useEffect(() => {
    if (currentPost) {
      const fullText = `${currentPost.hook}\n\n${currentPost.body}\n\n${currentPost.cta}\n\n${currentPost.hashtags.join(" ")}`;
      setEditedFullText(fullText);
    } else {
      setEditedFullText("");
    }
  }, [currentPost]);

  // Insert selected emoji at the cursor position
  const handleSelectEmoji = (emoji: string) => {
    if (topicRef.current) {
      const start = topicRef.current.selectionStart;
      const end = topicRef.current.selectionEnd;
      const currentVal = topic;
      const newVal = currentVal.substring(0, start) + emoji + currentVal.substring(end);
      setTopic(newVal);
      
      // Reset focus & cursor
      setTimeout(() => {
        if (topicRef.current) {
          topicRef.current.focus();
          const targetPos = start + emoji.length;
          topicRef.current.setSelectionRange(targetPos, targetPos);
        }
      }, 50);
    } else {
      setTopic(prev => prev + emoji);
    }
  };

  // Submit inputs to backend API
  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please write down your Core Message or Topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveTab("preview");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          audience,
          tone,
          language,
          postType: postGoal,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation process failed.");
      }

      setCurrentPost(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong while executing Gemini generation.");
    } finally {
      setLoading(false);
    }
  };

  // Copy composite/edited content to clipboard
  const handleCopyText = async () => {
    const textToCopy = editedFullText || (currentPost 
      ? `${currentPost.hook}\n\n${currentPost.body}\n\n${currentPost.cta}\n\n${currentPost.hashtags.join(" ")}`
      : "");

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  // Save current generated post draft array to local storage
  const handleSaveDraft = () => {
    if (!currentPost) return;

    // Build a fresh composite post state
    const postToSave: GeneratedPost = {
      ...currentPost,
      id: "draft_" + Date.now(),
      topic: topic.slice(0, 40) || "Facebook Draft",
      tone: tone,
      language: language,
      createdAt: new Date().toISOString()
    };

    const updated = [postToSave, ...savedPosts];
    setSavedPosts(updated);
    try {
      localStorage.setItem("fb_smm_posts", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage write failure", e);
    }
  };

  // Delete draft from local storage
  const handleDeleteDraft = (id: string) => {
    const filtered = savedPosts.filter(p => p.id !== id);
    setSavedPosts(filtered);
    try {
      localStorage.setItem("fb_smm_posts", JSON.stringify(filtered));
    } catch (e) {
      console.error("Local storage delete failure", e);
    }
  };

  // Load historical draft back into active configuration
  const handleLoadDraft = (post: GeneratedPost) => {
    setCurrentPost(post);
    setTopic(post.topic || "");
    setTone((post.tone as ToneType) || "Casual");
    setLanguage((post.language as LanguageType) || "Burmese");
    
    // Deconstruct fields if possible
    const fullText = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.join(" ")}`;
    setEditedFullText(fullText);
  };

  const handleResetForm = () => {
    setTopic("");
    setAudience("");
    setTone("Casual");
    setLanguage("Burmese");
    setPostGoal("Engagement Boom");
    setCurrentPost(null);
    setEditedFullText("");
    setError(null);
  };

  // Direct quick tags for target audience
  const quickAudiences = [
    "Online Shoppers",
    "Gen Z & Youth",
    "Business Owners",
    "Tech Enthusiasts",
    "Moms & Families",
    "B2B Professionals"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-purple-100 antialiased selection:text-purple-900 pb-16">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                Facebook Post Enhancer <span className="text-[10px] font-bold py-0.5 px-1.5 bg-blue-100 text-blue-800 rounded-sm uppercase tracking-wide">Expert</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Platform-Optimized Facebook SMM Writing Assistant & Live Emulator
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <a 
              href="https://facebook.com"
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Facebook.com</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Control Panel (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                    Generation Options
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 transition-colors hover:underline"
                  title="Reset form options"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Options</span>
                </button>
              </div>

              <form onSubmit={handleGeneratePost} className="space-y-4">
                {/* Topic / Core Message */}
                <div>
                  <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Main Topic / Core Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="topic-input"
                    ref={topicRef}
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Launching our new high-quality organic cosmetics line (Scent of Eden) with a 20% discount code (EDEN20) for the first 50 buyers. Order via messenger."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    required
                  />
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-medium">
                    <span>Describe your product, sale, event details clearly.</span>
                    <span className={topic.length > 300 ? "text-amber-500" : ""}>
                      {topic.length} characters
                    </span>
                  </div>
                </div>

                {/* Emoji board shortcut inserter */}
                <EmojiBoard onSelectEmoji={handleSelectEmoji} />

                {/* Target Audience */}
                <div>
                  <label htmlFor="audience-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Target Audience <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    id="audience-input"
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Young women, modern moms, beauty enthusiasts"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                  {/* Quick-select audience recommendation tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {quickAudiences.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setAudience(prev => prev ? `${prev}, ${tag}` : tag)}
                        className="text-[10px] bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-md px-2 py-0.5 text-slate-500 hover:text-slate-750 transition-all font-medium"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Page Name */}
                <div>
                  <label htmlFor="brand-name-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Live Preview Page Name
                  </label>
                  <input
                    id="brand-name-input"
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="e.g., Scent of Eden"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Grid Options for Tone, Language, Goal */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Language */}
                  <div>
                    <label htmlFor="language-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      4. Language
                    </label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageType)}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none cursor-pointer transition-all text-slate-700"
                    >
                      <option value="Burmese">🇲🇲 Burmese (Standard)</option>
                      <option value="Bilingual (MM + EN)">🌐 Bilingual (MM + EN)</option>
                      <option value="English">🇺🇸 English</option>
                    </select>
                  </div>

                  {/* Goal GoalType */}
                  <div>
                    <label htmlFor="goal-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      5. Campaign Goal
                    </label>
                    <select
                      id="goal-select"
                      value={postGoal}
                      onChange={(e) => setPostGoal(e.target.value as PostGoalType)}
                      className="w-full text-xs p-2.5 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none cursor-pointer transition-all text-slate-700"
                    >
                      <option value="Engagement Boom">🔥 Engagement Boom</option>
                      <option value="Product Launch">🚀 Product Launch</option>
                      <option value="Standard Promotion">🛍️ Standard Promotion</option>
                      <option value="Urgent Flash Sale">🚨 Urgent Flash Sale</option>
                      <option value="Interactive Q&A">🗣️ Interactive Q&A</option>
                      <option value="Event Announcement">📅 Event Listing</option>
                    </select>
                  </div>
                </div>

                {/* Tone of Voice Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    6. Tone of voice / Copy Vibe
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(["Professional", "Casual", "Humorous", "Inspirational", "Urgency / FOMO", "Storytelling", "Educational"] as ToneType[]).map((t) => {
                      const icons: Record<ToneType, string> = {
                        Professional: "💼",
                        Casual: "☕",
                        Humorous: "🎭",
                        Inspirational: "✨",
                        "Urgency / FOMO": "🚨",
                        Storytelling: "📖",
                        Educational: "📖",
                      };
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTone(t)}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                            tone === t
                              ? "bg-indigo-50/70 border-indigo-500 text-indigo-700 font-bold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span>{icons[t] || "📝"}</span>
                          <span className="truncate">{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] outline-none ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Optimizing Post Copy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current animate-pulse text-yellow-300" />
                      <span>Write Optimized Facebook Post</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Error Container */}
            {error && (
              <div className="bg-red-50 border border-red-200/80 rounded-xl p-4 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-800">Generation Error</h4>
                  <p className="text-[11px] text-red-600 mt-1 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Drafts library */}
            <SavedPosts
              savedPosts={savedPosts}
              onLoadPost={handleLoadDraft}
              onDeletePost={handleDeleteDraft}
            />
          </section>

          {/* RIGHT COLUMN: Output Preview & Workspace (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Output Panel Header & Tabs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="font-extrabold text-sm uppercase tracking-wider">
                    Creative SMM Workspace
                  </span>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/70 text-xs self-start">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "preview"
                        ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/40"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    1. Feed Emulator
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("editor")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "editor"
                        ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/40"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    2. View & Edit Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("visual")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "visual"
                        ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/40"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    3. Visual Graphic Prompt
                  </button>
                </div>
              </div>

              {/* Workspace Content rendering based on activeTab */}
              <div className="min-h-[280px]">
                {activeTab === "preview" && (
                  <div className="space-y-4">
                    <FeedEmulator post={currentPost} pageName={pageName} />
                    {currentPost && (
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60 mt-3">
                        <span className="text-[11px] text-slate-500 font-medium">
                          💡 Satisfied with this emulator render? You can copy the exact post copy instantly or customize it under "View & Edit Draft".
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:border-slate-300 transition-colors cursor-pointer active:scale-95"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            <span>Save Draft</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCopyText}
                            className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95 ${
                              copied 
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Full Post</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "editor" && (
                  <div className="space-y-4">
                    {currentPost ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
                            Combined Post Editor (Live Workspace)
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                            Editable copy
                          </span>
                        </div>
                        <textarea
                          rows={14}
                          value={editedFullText}
                          onChange={(e) => setEditedFullText(e.target.value)}
                          className="w-full text-xs font-sans p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-10 focus:border-indigo-500 outline-none leading-relaxed tracking-normal text-slate-800"
                        />
                        <div className="flex justify-between items-center mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              // Reset edited content to pristine state
                              const fullText = `${currentPost.hook}\n\n${currentPost.body}\n\n${currentPost.cta}\n\n${currentPost.hashtags.join(" ")}`;
                              setEditedFullText(fullText);
                            }}
                            className="text-xs text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-1.5 focus:outline-none"
                            title="Reset to original generated result"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            <span>Reset to Original</span>
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveDraft}
                              className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                              <span>Save Draft</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleCopyText}
                              className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95 ${
                                copied 
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
                                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                              }`}
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Content</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-slate-400">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="font-semibold text-xs text-slate-600 mb-1">Editor Inactive</h4>
                        <p className="text-[11px] max-w-xs mx-auto">
                          Generate a draft first. Once created, you can customize sentences, swap hashtags, or add details directly here.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "visual" && (
                  <div className="space-y-4">
                    {currentPost ? (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-100 animate-pulse" />
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                            Strategic Visual Layout Direction
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans border-b border-slate-100 pb-4 mb-4 font-normal">
                          {currentPost.visualIdea}
                        </p>

                        <div className="bg-white border border-slate-150 p-4 rounded-xl">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-widest font-mono mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                            <span>Recommended Graphic Text overlay</span>
                          </div>
                          <blockquote className="border-l-4 border-indigo-200 pl-3.5 py-1 my-3 text-slate-800 font-bold text-xs italic bg-slate-50/80 rounded-r-md">
                            "{currentPost.hook.slice(0, 80)}..."
                          </blockquote>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            💡 Design Guidance: Keep visual overlay text short (max 10 words). Place callouts clearly on the outer thirds of the square canvas (1:1 Ratio or 1200x1200px) with contrasting backdrop blocks to assure highest visual engagement.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-slate-400">
                        <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="font-semibold text-xs text-slate-600 mb-1">Visual Idea Suggestion Panel</h4>
                        <p className="text-[11px] max-w-xs mx-auto">
                          Once generated, Gemini will detail a target design pattern, background elements, and CTA graphics suggestions to perfect your organic engagement.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post analytics */}
            <PostAnalyzer post={currentPost} />
            
            {/* SMM Industry Best Practices Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 pb-2.5">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                  Facebook Marketing Cheat Sheet
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 shrink-0 select-none">•</span>
                  <span><strong>The 3-Line Rule:</strong> Direct the first 3 lines (the "Hook") to appeal directly to self-interest or immediate solutions before the platform truncates your post under "See More".</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 shrink-0 select-none">•</span>
                  <span><strong>Burmese Language Tip:</strong> Integrate native Burmese phrasing combined with universal high-retention English buzzwords (e.g., Code, Discount, Free Shipping, Messenger, DM) to fit standard shopping trends.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-blue-500 shrink-0 select-none">•</span>
                  <span><strong>Call to Action:</strong> Never leave the reader wondering why they read. Wrap the end with absolute commands: "Drop a comment below👇", "Inbox/DM us now for free sample📩", etc.</span>
                </li>
              </ul>
            </div>
            
          </section>
        </div>
      </main>
    </div>
  );
}
