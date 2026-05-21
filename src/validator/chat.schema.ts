import { z } from "zod";

export const chatSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500),
  conversationId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export type ChatRequest = z.infer<typeof chatSchema>;