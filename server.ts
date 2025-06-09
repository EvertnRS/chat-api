import express  from "express";
import socketio from "socket.io";
import http from "http";
import routes from "./src/routes/routes.js";
import userRoutes from "./src/routes/userRoutes";

const app = express();
const httpServer = http.createServer(app);
const socketServer = new socketio.Server(httpServer);

app.use(express.json());

app.use('/', userRoutes);

httpServer.listen(3000, () => {
  console.log("Server ta rodandinho na portinha http://localhost:3000");
});