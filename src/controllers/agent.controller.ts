import { Request, Response } from "express";
import { chatSchema } from "../validator/chat.schema";
import {
  createConversation,
  createMessage,
  updateConversation,
} from "../services/conversation.service";
import { parseAgentIntent } from "../services/intent.service";
import { validateWingetCommand } from "../validator/command-validator"; 

export async function runAgent(req: Request, res: Response) {
  try {
    const validated = chatSchema.parse(req.body);

    let conversationId = validated.conversationId;

    if (!conversationId) {
      const conversation = await createConversation(validated.prompt);
      conversationId = conversation.id;
    }

    await createMessage(conversationId, "user", validated.prompt);

    const intent = await parseAgentIntent(validated.prompt);

    const isSafe = validateWingetCommand(intent.command);

    if (!isSafe) {
      throw new Error("Unsafe command generated");
    }

    const assistantMessage =
      intent.action === "install_app"
        ? `Preparing installation for ${intent.app}...`
        : `Preparing uninstallation for ${intent.app}...`;

    await createMessage(conversationId, "assistant", assistantMessage);

    await updateConversation(conversationId);

    res.json({
      success: true,
      conversationId,
      action: intent.action,
      app: intent.app,
      command: intent.command,
      message: assistantMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}