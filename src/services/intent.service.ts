import { GoogleGenerativeAI } from "@google/generative-ai";
import { agentActionSchema } from "../validator/agent.schema";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Gemini API Key is required");
}

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiModel = genAi.getGenerativeModel({
  model: "gemini-flash-latest",
});

export async function parseAgentIntent(prompt: string) {
  const systemPrompt = `
You are a Windows AI package manager assistant.

Convert the user's request into strict JSON.

Supported actions:
- install_app
- uninstall_app

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- No code fences
- Only Windows winget commands
- Never return powershell commands
- Never return cmd commands
- Never return delete/remove filesystem commands

Install format:
{
  "action": "install_app",
  "app": "application name",
  "command": "winget install --id PACKAGE_ID -e --accept-source-agreements --accept-package-agreements"
}

Uninstall format:
{
  "action": "uninstall_app",
  "app": "application name",
  "command": "winget uninstall --id PACKAGE_ID -e"
}
`;

  const result = await geminiModel.generateContent(
    `${systemPrompt}\n\nUser request: ${prompt}`
  );

  const rawText = result.response.text();

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return agentActionSchema.parse(parsed);
}