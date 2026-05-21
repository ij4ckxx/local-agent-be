import { z } from "zod";

export const agentActionSchema = z.object({
  action: z.enum(["install_app", "uninstall_app"]),
  app: z.string().min(1, "App name is required"),
  command: z.string().min(1, "Command is required"),
});

export type AgentAction = z.infer<typeof agentActionSchema>;