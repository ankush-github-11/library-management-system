import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRoute from "./src/routes/bookRoute";
const app = express();
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
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("App connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("MongoDB connection failed:", error.message);
  });
