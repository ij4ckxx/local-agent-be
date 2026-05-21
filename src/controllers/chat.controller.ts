import { Request, Response } from "express";
import {
  createConversation,
  createMessage,
  getConversationById,
  getConversationMessages,
  getConversationTitles,
  updateConversation,
} from "../services/conversation.service";
import { getGeminiResponse } from "../services/gemini.service";
import { chatSchema } from "../validator/chat.schema";

export async function chatHandler(req: Request, res: Response) {
  try {
    const validated = chatSchema.parse(req.body);
    console.log("Validated request:", validated);

    let conversationId = validated.conversationId;

    if (!conversationId) {
      const conversation = await createConversation(
        validated.prompt,
        validated.projectId,
      );

      conversationId = conversation.id;
    }
    await createMessage(conversationId, "user", validated.prompt);
    const aiReply = await getGeminiResponse(validated.prompt);
    console.log("AI reply length:", aiReply.length);
    const savedMessage = await createMessage(
      conversationId,
      "assistant",
      aiReply,
    );

    console.log("Saved content length:", savedMessage.content.length);
    await updateConversation(conversationId);
    res.json({
      success: true,
      conversationId,
      message: aiReply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "unknown error",
    });
  }
}

export async function getConversationsHandler(_req: Request, res: Response) {
  try {
    const conversations = await getConversationTitles();

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getConversationHandler(
  req: Request<{ conversationId: string }>,
  res: Response,
) {
  try {
    const { conversationId } = req.params;

    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
