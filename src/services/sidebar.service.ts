import { prisma } from "../db/prisma";
import { getOrCreateLocalUser } from "./conversation.service";

export async function getSidebarData() {
  const user = await getOrCreateLocalUser();

  const projects = await prisma.projects.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id: true,
      name: true,
      conversations: {
        orderBy: {
          updated_at: "desc",
        },
        select: {
          id: true,
          title: true,
          updated_at: true,
        },
      },
    },
  });

  const recents = await prisma.conversations.findMany({
    where: {
      user_id: user.id,
      project_id: null,
    },
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id: true,
      title: true,
      updated_at: true,
    },
  });

  return {
    projects,
    recents,
  };
}