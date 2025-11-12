const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("redis");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const redisSubscriber = createClient({ url: "redis://localhost:6379" });
redisSubscriber.connect();

redisSubscriber.subscribe("events", (message) => {
  const event = JSON.parse(message);
  console.log("Event received:", event);

  io.emit(event.type, event.data);
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`ws-service listening in http://localhost:${PORT}`);
});
