import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
const URI: string | undefined = process.env.URI;
app.use(express.json());
if (!URI) {
  throw new Error("MongoDB URI is missing in environment variables");
}
import mongoose from "mongoose";
import Book from "./src/models/bookModel";
app.post('/books', async (req: Request, res: Response) =>{
  try{
    if(!req.body.title || !req.body.author || !req.body.pages){
      return res.status(400).send({message: "Please send all the fields: Title, Author, Pages"});
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Unknown server error" });
  }
});
mongoose
  .connect(URI)
  .then(() => {
    console.log("App Connected to the DB");
  })
  .catch((error:Error) => {
    console.log("App is not connected to the DB:" ,error.message);
  });
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

