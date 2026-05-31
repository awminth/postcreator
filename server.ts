import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { config as loadDotenv } from "dotenv";

function loadEnvFiles() {
  const cwd = process.cwd();
  const envPath = path.join(cwd, ".env");
  const examplePath = path.join(cwd, ".env.example");

  if (fs.existsSync(envPath)) {
    loadDotenv({ path: envPath });
    return;
  }

  if (process.env.NODE_ENV !== "production" && fs.existsSync(examplePath)) {
    loadDotenv({ path: examplePath });
    console.warn(
      "[postcreator] No .env file found; loaded .env.example. Copy it to .env and set GEMINI_API_KEY for local development.",
    );
    return;
  }

  loadDotenv();
}

function getGeminiApiKey(): string | undefined {
  const raw = process.env.GEMINI_API_KEY?.trim();
  if (!raw) return undefined;
  return raw.replace(/^["']|["']$/g, "");
}

loadEnvFiles();

const app = express();
const PORT = Number(process.env.PORT) || 3010;

// Parse JSON bodies
app.use(express.json());

// Initialize Gemini AI
const apiKey = getGeminiApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn(
    "[postcreator] GEMINI_API_KEY is missing. Add it to .env (see .env.example) before using post generation.",
  );
}

// Generate Post API endpoint
app.post("/api/generate", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error:
          "GEMINI_API_KEY is not configured. Create a .env file in the project root (copy from .env.example) and set your Gemini API key from https://aistudio.google.com/apikey",
      });
    }

    const { topic, audience, tone, language, postType, includeVisualIdea } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Main Topic/Core Message is required." });
    }

    const systemInstruction = 
      "You are an expert Facebook Social Media Manager and professional content creator specializing in hyper-engaging Facebook posts.\n" +
      "Your objective is to generate an optimized, high-converting Facebook post using the specific parameters provided.\n" +
      "You must respect the language request: if 'Burmese' is selected, write the main post fully in culturally native, high-conversion Burmese natural copywriting. If 'Bilingual' is requested, write standard natural sections in Burmese and optionally highlight terms or key sentences in English where appropriate, maintaining a modern online Burmese merchant/influencer tone. If 'English' is requested, write in fluent high-engagement English.\n" +
      "Ensure the post features an elite 'Hook Sentence' that creates immediate curiosity, followed by structured spacing, natural highly engaging emojis, a super clear Call to Action (CTA), and 3-5 trending relevant hashtags.\n" +
      "And provide a strategic visual/image graphic suggestion that would perfectly accompany this post to maximize Click-Through Rate (CTR).";

    const prompt = `
Please generate an optimized Facebook post based on these settings:
- Topic / Core Message: ${topic}
- Target Audience: ${audience || "General audience / Facebook users"}
- Tone of Voice: ${tone || "Professional"}
- Language: ${language || "Burmese"}
- Post Type/Goal: ${postType || "Brand Awareness"}

Generate the output as a valid structured JSON object matching the requested schema. Ensure the response contains fully-formed string values with no trailing commas.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["hook", "body", "cta", "hashtags", "visualIdea"],
          properties: {
            hook: {
              type: Type.STRING,
              description: "A single, highly compelling attention-grabbing hook sentence of 1-3 lines. It must stand out and compel readers to read on.",
            },
            body: {
              type: Type.STRING,
              description: "The main body explanation. Break down dense text using appropriate spacing, short paragraphs, and bullet points or numbered lists where suitable. Blend emojis naturally.",
            },
            cta: {
              type: Type.STRING,
              description: "Clear and compelling Call to Action (CTA) telling the reader exactly what to do (e.g. click link, send message, drop comment).",
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3-5 high-engagement relevant hashtags.",
            },
            visualIdea: {
              type: Type.STRING,
              description: "A description of what kind of photo, design template, background canvas, or infographic to accompany this post to drive higher click-through-rates.",
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from the Gemini model.");
    }

    const postData = JSON.parse(resultText);
    return res.json(postData);

  } catch (error: any) {
    console.error("Gemini Post Generation Error:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while generating the post. Please try again.",
    });
  }
});

// Serve static assets and frontend index
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
