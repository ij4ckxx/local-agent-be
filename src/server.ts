import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./db/prisma";
import chatRoutes from "./routes/chat.routes";
import { parseAgentIntent } from "./services/intent.service";
import { extractWingetPackageId, wingetSearch } from "./services/winget.service";
import { success } from "zod";
import agentRoutes from "./routes/agent.routes";
import { initWebSocket } from "./websockets/socket";
import http from "http";
import { broadcastMessage } from "./websockets/socket";
import projectRoutes from "./routes/project.routes";
import sidebarRoutes from "./routes/sidebar.routes";
import authRoutes from "./routes/auth.routes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Backend is connected",
  });
});

app.get("/db-test", async (_req, res) => {
  try {
    const userCount = await prisma.users.count();

    res.json({
      status: "ok",
      message: `Database connection successful. User count: ${userCount}`,
      userCount,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.use("/chat", chatRoutes);
app.use("/projects", projectRoutes);
app.use("/auth", authRoutes);
app.use("/sidebar", sidebarRoutes);

app.get("/intent-test",async (_req,res)=>{
  const result = await parseAgentIntent("install Sublime text editor");
  res.json(result)
})
app.get("/winget-test", async (_req,res)=>{
  try{
  const output = await wingetSearch("notepad++");
  const packageID = extractWingetPackageId(output)
  res.json({
    success:true,
    packageID,
    rawOuput: output
  })
}
catch(err){
  res.status(500).json({
    success: false,
    error: err instanceof Error ? err.message : "Unknown error"
  })
}
})
app.get("/ws-test", (_req, res) => {
  broadcastMessage({
    type: "log",
    message: "Hello from backend",
  });

  res.json({
    success: true,
    message: "Message sent",
  });
});
app.use("/agent",agentRoutes);

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log("Server running with WebSocket on port:", PORT);
});
