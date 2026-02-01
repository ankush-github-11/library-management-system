import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRoute from "./routes/bookRoute";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ---------- Middleware ----------
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://libman-system.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ---------- Routes ----------
app.use("/books", bookRoute);

app.get("/", (_req: Request, res: Response) => {
  res.send("Backend is running 🚀");
});

// ---------- Socket.IO ----------
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://libman-system.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);

// ---------- Start Server FIRST ----------
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// ---------- Connect MongoDB ----------
if (!MONGO_URI) {
  console.error("MONGO_URI is missing");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
}
