import React from "react";
import { Smile, Flame, Megaphone, Star, ArrowRight, Phone } from "lucide-react";

interface EmojiBoardProps {
  onSelectEmoji: (emoji: string) => void;
}

export default function EmojiBoard({ onSelectEmoji }: EmojiBoardProps) {
  const categories = [
    {
      name: "Promo",
      icon: <Flame className="w-3.5 h-3.5 text-orange-500" />,
      emojis: ["🔥", "💥", "🚀", "📢", "📣", "💯", "🎉", "⚡", "🎁", "🛍️"],
    },
    {
      name: "Alert & Direct",
      icon: <Star className="w-3.5 h-3.5 text-yellow-500" />,
      emojis: ["✨", "📌", "💡", "🎯", "🚨", "⭐️", "✅", "👑", "🍀", "💎"],
    },
    {
      name: "CTA Leads",
      icon: <ArrowRight className="w-3.5 h-3.5 text-sky-500" />,
      emojis: ["👇", "👉", "💬", "📩", "📲", "🔗", "👀", "✍️", "🙋‍♂️", "🤩"],
    },
    {
      name: "Business",
      icon: <Phone className="w-3.5 h-3.5 text-emerald-500" />,
      emojis: ["📞", "💼", "💰", "💸", "📈", "💖", "🤝", "🏡", "✈️", "🍕"],
    },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
      <div className="flex items-center gap-1.5 mb-3 text-slate-700">
        <Smile className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold uppercase tracking-wider font-sans text-slate-600">
          Marketing Emoji Quick Board
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-2.5 rounded-lg flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 font-medium text-slate-600 select-none">
              {cat.icon}
              <span>{cat.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelectEmoji(emoji)}
                  className="w-7 h-7 flex items-center justify-center text-base rounded-md hover:bg-slate-100 active:scale-95 transition-all outline-none"
                  title="Click to insert"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-2.5 text-center">
        💡 Pro-Tip: Tap an emoji to insert it directly into your core message box.
      </p>
    </div>
  );
}
