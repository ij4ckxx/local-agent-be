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

export async function createConversation(
  title: string,
  projectId?: string
) {
  const user = await getOrCreateLocalUser();
  const now = new Date();

  return prisma.conversations.create({
    data: {
      id: randomUUID(),
      project_id: projectId ?? null,
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

export async function getConversationTitles() {
  return prisma.conversations.findMany({
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id: true,
      title: true,
      updated_at: true,
    },
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.messages.findMany({
    where: {
      conversation_id: conversationId,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      id: true,
      role: true,
      content: true,
      created_at: true,
    },
  });
}

export async function getConversationById(conversationId: string) {
  return prisma.conversations.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      id: true,
      title: true,
      updated_at: true,
      messages: {
        orderBy: {
          created_at: "asc",
        },
        select: {
          id: true,
          role: true,
          content: true,
          created_at: true,
        },
      },
    },
  });
}
