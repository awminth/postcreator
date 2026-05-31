export interface GeneratedPost {
  id?: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  visualIdea: string;
  topic?: string;
  tone?: string;
  language?: string;
  createdAt?: string;
}

export type ToneType = 
  | "Professional"
  | "Casual"
  | "Humorous"
  | "Inspirational"
  | "Urgency / FOMO"
  | "Storytelling"
  | "Educational";

export type LanguageType =
  | "Burmese"
  | "Bilingual (MM + EN)"
  | "English";

export type PostGoalType =
  | "Product Launch"
  | "Engagement Boom"
  | "Standard Promotion"
  | "Interactive Q&A"
  | "Event Announcement"
  | "Urgent Flash Sale";
