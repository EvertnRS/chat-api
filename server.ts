import express  from "express";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./src/routes/userRoutes";
import chatRoutes from "./src/routes/chatRoutes";
import messageRoutes from "./src/routes/messageRoutes";
import { WebSocketProvider } from "./src/infra/providers/websocket/WebSocketProvider";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*" // change this to frontend URL in production
  },
});

const webSocketProvider = new WebSocketProvider();
webSocketProvider.setupSocket(io);

app.use(express.json());

app.use('/', userRoutes);
app.use('/', chatRoutes);
app.use('/', messageRoutes);

httpServer.listen(3000, () => {
  console.log("Server ta rodandinho na portinha http://localhost:3000");
});

export { io };