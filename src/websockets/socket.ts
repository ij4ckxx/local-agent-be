import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

let wss: WebSocketServer;

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("Frontend connected");

    socket.send(
      JSON.stringify({
        type: "connected",
        message: "WebSocket connection established",
      })
    );

    socket.on("close", () => {
      console.log("Frontend disconnected");
    });
  });
}

export function broadcastMessage(data: unknown) {
  if (!wss) return;

  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}