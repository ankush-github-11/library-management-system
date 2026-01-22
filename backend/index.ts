import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRoute from "./src/routes/bookRoute";
import { Server } from 'socket.io';
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const PORT: number = Number(process.env.PORT) || 3000;
const MONGO_URI: string | undefined = process.env.MONGO_URI;
app.use(express.json());
if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing in environment variables");
}

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/books', bookRoute);

app.get("/", (_req: Request, res: Response) => {
  return res.send("Hello");
});
app.set("io", io);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("App connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("MongoDB connection failed:", error.message);
  });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

