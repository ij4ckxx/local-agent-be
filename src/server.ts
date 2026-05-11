import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./db/prisma";
import chatRoutes from "./routes/chat.routes";

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

app.use("/chat", chatRoutes)

app.listen(PORT, () => {
  console.log("Server is running on Port:", PORT);
});
