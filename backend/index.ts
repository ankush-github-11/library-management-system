import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "./src/models/bookModel";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
const MONGO_URI: string | undefined = process.env.MONGO_URI;
app.use(express.json());
if (!MONGO_URI) {
  throw new Error("MongoDB URI is missing in environment variables");
}

// Creating a book
app.post("/books", async (req: Request, res: Response) => {
  try {
    const { title, author, pages } = req.body;
    if (!title || !author || !pages) {
      return res.status(400).json({
        message: "Please send all the fields: Title, Author, Pages",
      });
    }
    const book = await Book.create({ title, author, pages });
    return res.status(201).json(book);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error" });
  }
});

// Getting all the books
app.get("/books", async (_req: Request, res: Response) => {
  try {
    const books = await Book.find({});
    res.status(200).send({
      count: books.length,
      data: books
    });
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error" });
  }
});

// Getting one book by ID 
app.get("/books/:id", async (req: Request, res: Response) =>{
  try{
    const {id} = req.params;
    const book = await Book.findById(id);
    res.status(200).send(book);
  }
  catch (error: unknown) {
    if(error instanceof Error){
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error" });
  }
});

// Updating a book using ID
app.put("/books/:id", async(req: Request, res: Response) => {
  try{
    const id = req.params.id as string;
    const {title, author, pages} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ message: "Invalid book ID" });
    }
    if(!title || !author || !pages){
      return res.status(400).json({
        message: "Please provide - title, author, pages"
      });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {title, author, pages},
      {new: true, runValidators: true}
    )
    if(!updatedBook) return res.status(404).send({message: "Book Not Found"});
    res.status(200).send(updatedBook);
  }
  catch(error: unknown){
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error" });
  }
});

//Deleting a book using ID
app.delete("/books/:id", async(req: Request, res: Response) =>{
  try{
    const id = req.params.id as string;
    const result = await Book.findByIdAndDelete(id);
    if(!result){
      return res.status(404).send({
        message: "Book Not Found"
      });
    }
    res.status(200).send({
      Message: "The Book is deleted successfully"
    });
  }
  catch(error: unknown){
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown server error" });
  }

});
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
