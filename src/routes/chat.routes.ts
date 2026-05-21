import { Router } from "express";
import { chatHandler, getConversationHandler, getConversationsHandler } from "../controllers/chat.controller";

const router = Router();

router.post("/", chatHandler);
router.get("/conversations", getConversationsHandler);

router.get("/:conversationId", getConversationHandler);


export default router;