import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma";
import { getOrCreateLocalUser } from "./conversation.service";

export async function createProject(name: string) {
  const user = await getOrCreateLocalUser();
  const now = new Date();

  return prisma.projects.create({
    data: {
      id: randomUUID(),
      user_id: user.id,
      name,
      created_at: now,
      updated_at: now,
    },
  });
}

export async function getProjects() {
  const user = await getOrCreateLocalUser();

  return prisma.projects.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id: true,
      name: true,
      updated_at: true,
    },
  });
}