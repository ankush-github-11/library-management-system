import express, { Request, Response }  from "express";
const router = express.Router();
import Book from "../models/bookModel";
import mongoose from "mongoose";

// Getting all the books
router.get("/", async (_req: Request, res: Response) => {
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
    return res.status(500).json({ message: "unknown server error" });
  }
});

// Creating a book
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, author, pages } = req.body;
    if (!title || !author || !pages) {
      return res.status(400).json({
        message: "Please send all the fields: title, author, pages",
      });
    }
    const book = await Book.create({ title, author, pages });
    const io = req.app.get("io");
    io.emit("book-added", book);
    return res.status(201).json(book);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "unknown server error" });
  }
});

// Getting one book by ID 
router.get("/:id", async (req: Request, res: Response) =>{
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
    return res.status(500).json({ message: "unknown server error" });
  }
});

// Updating a book using ID
router.put("/:id", async(req: Request, res: Response) => {
  try{
    const id = req.params.id as string;
    const {title, author, pages} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ message: "invalid book id" });
    }
    if(!title || !author || !pages){
      return res.status(400).json({
        message: "please provide - title, author, pages"
      });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {title, author, pages},
      {new: true, runValidators: true}
    )
    if(!updatedBook) return res.status(404).send({message: "Book Not Found"});
    const io = req.app.get("io");
    io.emit("book-edited", updatedBook);
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

// Deleting a book using ID
router.delete("/:id", async(req: Request, res: Response) =>{
  try{
    const id = req.params.id as string;
    const result = await Book.findByIdAndDelete(id);
    if(!result){
      return res.status(404).send({
        message: "book not found"
      });
    }
    const io = req.app.get("io");
    io.emit("book-deleted", id);
    res.status(200).send({
      Message: "The book is deleted successfully"
    });
  }
  catch(error: unknown){
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "unknown server error" });
  }

});

export default router;