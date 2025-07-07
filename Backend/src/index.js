import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { Message } from "./models/message.model.js"; 

dotenv.config({ path: "./.env" });

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }
});


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("send_message", async ({ senderId, receiverId, message }) => {
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message
    });

 
    io.to(receiverId).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
  });
