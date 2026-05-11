import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma";

export async function getOrCreateLocalUser() {
  const now = new Date();

  const existingUser = await prisma.users.findUnique({
    where: {
      email: "local-user@ai-agent.app",
    },
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.users.create({
    data: {
      id: randomUUID(),
      name: "Local User",
      email: "local-user@ai-agent.app",
      created_at: now,
      updated_at: now,
    },
  });
}

export async function createConversation(title: string) {
  const user = await getOrCreateLocalUser();
  const now = new Date();

  return prisma.conversations.create({
    data: {
      id: randomUUID(),
      user_id: user.id,
      title: title.slice(0, 100),
      created_at: now,
      updated_at: now,
    },
  });
}

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.messages.create({
    data: {
      id: randomUUID(),
      conversation_id: conversationId,
      role,
      content,
      created_at: new Date(),
    },
  });
}

export async function updateConversation(conversationId: string) {
  return prisma.conversations.update({
    where: { id: conversationId },
    data: {
      updated_at: new Date(),
    },
  });
}
