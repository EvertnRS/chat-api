import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./src/routes/userRoutes";
import chatRoutes from "./src/routes/chatRoutes";
import { createMessageRoutes } from "./src/routes/messageRoutes";
import { WebSocketProvider } from "./src/infra/providers/websocket/WebSocketProvider";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./src/infra/swagger/swagger";

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const webSocketProvider = WebSocketProvider.startInstance(io);
webSocketProvider.setupSocket(io);

const messageRoutes = createMessageRoutes(webSocketProvider);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", userRoutes);
app.use("/", chatRoutes);
app.use("/", messageRoutes);

httpServer.listen(3000, () => {
  console.log("Server ta rodandinho na portinha http://localhost:3000");
});

export { io };
