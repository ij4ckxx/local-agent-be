import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Gemini API key is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

export async function getGeminiResponse(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt);

  return result.response.text();
}